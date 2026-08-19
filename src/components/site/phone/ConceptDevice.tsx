import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { DeviceState } from './ConceptDeviceCanvas'
import { clamp01 } from './deviceStage'

import './concept-device.css'

/**
 * The case study's device.
 *
 * Everything a mockup image cannot do: it is switched on, the app inside it is
 * the running app, and its own tab bar drives the case study.
 *
 * The bezel is DOM and so is the screen, which is the point. A WebGL model
 * used to carry it and re-project the app onto the glass each frame; that
 * projection drifted against the bezel as the model tilted, so the screen slid
 * out of the phone - visibly on desktop, badly on mobile. Layout cannot drift.
 */
export function ConceptDevice({
  accent,
  children,
  className = '',
}: {
  accent: string
  /** kept for the call sites; the DOM glass has nothing to flare */
  pulse?: number
  children?: ReactNode
  className?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

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

      {/*
        The app is laid out inside the glass, not projected onto it.

        The WebGL half used to own this: the model rendered, and drei's <Html
        transform> re-projected the whole app through the camera every frame so
        it appeared to sit on the glass. That projection is only ever as exact
        as the camera fit, and the rig tilts the model continuously - so the
        screen crept out of its bezel, differently at every viewport width, and
        worse on phones where the canvas is smallest.

        A DOM screen inside a DOM bezel cannot do that. It is the same box,
        clipped by the same rounded rectangle, positioned by layout. There is
        no room left for it to slide, which is the whole requirement.
      */}
      <Frame>{children}</Frame>
    </div>
  )
}

/**
 * The bezel, at the display's own aspect.
 *
 * `--fit` carries the 300x662 rectangle every screen is authored into, so the
 * glass and the app are the same box and the app is clipped by the same
 * rounded corners that draw the phone.
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
