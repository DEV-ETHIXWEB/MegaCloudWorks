import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { usePhoneNav } from '#/lib/phoneUI'
import type { DeviceState } from './ConceptDeviceCanvas'
import { clamp01 } from './deviceStage'

import './concept-device.css'

const ConceptDeviceCanvas = lazy(() => import('./ConceptDeviceCanvas'))

/**
 * The case study's device.
 *
 * Everything a mockup image cannot do: it is the real model, it is switched
 * on, the app inside it is the running app, and it answers the pointer. The
 * WebGL half is a lazy chunk - three and drei are heavier than the entire rest
 * of the page - so the frame below is drawn in CSS first and the model takes
 * its place when it arrives.
 *
 * The whole thing is inert under `prefers-reduced-motion`: the model still
 * loads and the app still runs, it simply stands still.
 */
export function ConceptDevice({
  accent,
  /** changes whenever the screen does, so the glass can flare on the change */
  pulse,
  children,
  className = '',
}: {
  accent: string
  pulse: number
  children?: ReactNode
  className?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  // read on this side of the canvas and handed through as a prop, because
  // context does not cross r3f's own React root - see PhoneNavRelay
  const nav = usePhoneNav()

  const state = useRef<DeviceState>({
    px: 0,
    py: 0,
    scroll: 0,
    near: false,
    reduced: false,
  })

  /*
    The canvas is client-only - the server paints the CSS frame and the app -
    but it must also not mount until this box has a real size.

    r3f measures its container once on mount and sizes the drawing buffer from
    that. Measure it at zero and the canvas stays at the default 300x150, the
    scene never renders, and drei's <Html> - which is where the entire app
    screen lives - is projected through a camera that was never fitted. The app
    then lands somewhere off the device instead of on its glass.

    In dev the box happens to be measurable by the time the lazy chunk arrives.
    In a production build the chunk can land inside the same frame as
    hydration, the box is still 0x0, and the mockup ends up outside the phone.
    It looks like a caching problem because any later layout change - a resize,
    a font swap, a scroll that triggers reflow - silently corrects it.

    So: wait for a non-zero box, then mount. There is no race left to lose.
  */
  useEffect(() => {
    const node = host.current
    if (!node || typeof window === 'undefined') return

    const check = () => {
      const { width, height } = node.getBoundingClientRect()
      if (width > 0 && height > 0) {
        setReady(true)
        return true
      }
      return false
    }

    if (check()) return

    const ro = new ResizeObserver(() => {
      if (check()) ro.disconnect()
    })
    ro.observe(node)
    return () => ro.disconnect()
  }, [])

  /*
    Then make r3f actually look.

    Mounting into a sized box is necessary but not sufficient: react-use-measure
    - which is what <Canvas> sizes itself from - can settle on a zero reading
    and then never hear about it again, because the box does not subsequently
    *change*. The renderer is left at the canvas element's intrinsic 300x150,
    the scene is never fitted, and <Html> puts the app somewhere off the glass.

    It listens to window resize, so that is the lever. Watch the real canvas
    for a couple of seconds after it appears and, while its CSS box does not
    match the frame it lives in, nudge it. In the good case this costs one
    check and stops; in the bad case it corrects on the first tick instead of
    waiting for whatever incidental reflow the reader triggers first.
  */
  useEffect(() => {
    if (!ready || typeof window === 'undefined') return
    const node = host.current
    if (!node) return

    let frame = 0
    const started = performance.now()

    const nudge = () => {
      const canvas = node.querySelector('canvas')
      const box = node.getBoundingClientRect()

      if (canvas && box.width > 0 && box.height > 0) {
        const c = canvas.getBoundingClientRect()
        /*
          Both axes, deliberately. A canvas that has never been fitted sits at
          its intrinsic 300x150, and this device is often *exactly* 300 wide -
          so comparing width alone reports a healthy canvas while the height is
          out by a factor of three.
        */
        const wrong =
          Math.abs(c.width - box.width) > 2 ||
          Math.abs(c.height - box.height) > 2
        if (!wrong) return
        window.dispatchEvent(new Event('resize'))
      }

      if (performance.now() - started < 2000) {
        frame = window.requestAnimationFrame(nudge)
      }
    }

    frame = window.requestAnimationFrame(nudge)
    return () => window.cancelAnimationFrame(frame)
  }, [ready])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const node = host.current
    if (!node) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const applyMotion = () => {
      state.current.reduced = motion.matches
    }
    applyMotion()
    motion.addEventListener('change', applyMotion)

    /*
      One rAF for both signals.

      Pointer and scroll each fire far faster than a frame, and reading
      getBoundingClientRect inside either handler is a layout read on the
      hottest path on the page. So the handlers only record raw coordinates,
      and the measuring happens once per frame - which is also the only rate
      the rig can consume it at.
    */
    let frame = 0
    let clientX = 0
    let clientY = 0
    let hasPointer = false

    const measure = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const s = state.current

      if (hasPointer) {
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        // normalised against a box wider than the device itself, so the tilt
        // is still rising when the pointer reaches the copy beside it
        s.px = Math.max(-1, Math.min(1, (clientX - cx) / (rect.width * 1.9)))
        s.py = Math.max(-1, Math.min(1, (clientY - cy) / (rect.height * 1.15)))
        s.near =
          clientX > rect.left - rect.width * 0.5 &&
          clientX < rect.right + rect.width * 0.5 &&
          clientY > rect.top - 120 &&
          clientY < rect.bottom + 120
      }

      // how far the device has travelled up out of the viewport
      s.scroll = clamp01(-rect.top / (window.innerHeight * 0.85))
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }

    const onPointer = (e: PointerEvent) => {
      clientX = e.clientX
      clientY = e.clientY
      hasPointer = true
      schedule()
    }

    const onLeave = () => {
      hasPointer = false
      state.current.px = 0
      state.current.py = 0
      state.current.near = false
    }

    measure()
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      motion.removeEventListener('change', applyMotion)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <div
      ref={host}
      className={`cdev ${ready ? 'is-live' : ''} ${className}`}
      style={{ '--cdev-accent': accent } as React.CSSProperties}
    >
      {/* the glow the device sits in - the accent, at two per cent, on snow */}
      <span aria-hidden="true" className="cdev__halo" />

      {ready ? (
        <Suspense fallback={<Frame>{null}</Frame>}>
          <ConceptDeviceCanvas
            accent={accent}
            pulse={pulse}
            state={state}
            nav={nav}
          >
            {children}
          </ConceptDeviceCanvas>
        </Suspense>
      ) : (
        <Frame>{children}</Frame>
      )}
    </div>
  )
}

/**
 * The device before WebGL arrives.
 *
 * Deliberately not a picture of the same phone: it is a plain bezel at the
 * display's own aspect, so what swaps in is the shell appearing around an app
 * that was already running, rather than one phone replacing another.
 */
function Frame({ children }: { children?: ReactNode }) {
  return (
    <div className="cdev__frame">
      <div className="cdev__glass cdev__glass--fit">
        {children}
        <span aria-hidden="true" className="cdev__sheen" />
      </div>
    </div>
  )
}

export default ConceptDevice
