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

  // the canvas is client-only; the server paints the CSS frame and the app
  useEffect(() => setReady(true), [])

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
