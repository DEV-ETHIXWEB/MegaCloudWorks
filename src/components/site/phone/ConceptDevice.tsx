import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import './concept-device.css'

/** the CSS rectangle every concept screen is authored at */
const AUTHORED_W = 300
const AUTHORED_H = 662

/** the hand-held phone plate the app is shown inside */
const HAND_SRC = '/concept/hand-phone.png'

/**
 * The case study's device.
 *
 * A photograph of a phone held in a hand, with the running app behind the
 * display cut-out - so the bezel, the notch and the fingers that overlap the
 * body all sit *over* the app the way they would in life.
 *
 * The app is DOM, not a projection. A WebGL model used to carry it and
 * re-project the screen through the camera each frame; that projection drifted
 * against the bezel as the model tilted, so the app slid out of the phone.
 * Here the screen is a box positioned inside the plate by layout, and the two
 * are laid out together - so nothing can come apart.
 */
export function ConceptDevice({
  accent,
  children,
  className = '',
}: {
  accent: string
  /** kept for the call sites; the plate has nothing to flare */
  pulse?: number
  children?: ReactNode
  className?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  /*
    The app is laid out at the 300x662 it was drawn at and scaled into the
    cut-out, so its type stays the size the kit intends however big the plate
    is on the page.

    It is fitted rather than stretched. The cut-out in the art is 189x410,
    which is a shade wider in proportion than the app - so the app is scaled to
    the shorter of the two fits and centred, and the couple of pixels left over
    fall either side, black on black against the bezel. Scaling to width
    instead would push the tab bar under the bottom of the bezel.
  */
  useEffect(() => {
    const node = host.current
    if (!node || typeof window === 'undefined') return

    const fit = () => {
      const screen = node.querySelector<HTMLElement>('.cdev__screen')
      if (!screen) return
      const { width, height } = screen.getBoundingClientRect()
      if (width <= 0 || height <= 0) return

      const k = Math.min(width / AUTHORED_W, height / AUTHORED_H)
      node.style.setProperty('--cdev-k', String(k))
      node.style.setProperty('--cdev-dx', `${(width - AUTHORED_W * k) / 2}px`)
      node.style.setProperty('--cdev-dy', `${(height - AUTHORED_H * k) / 2}px`)
      setReady(true)
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(node)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={host}
      className={`cdev ${ready ? 'is-live' : ''} ${className}`}
      style={{ '--cdev-accent': accent } as CSSProperties}
    >
      {/* the light the phone stands in - the accent, low and wide, so the
          colour of the product is in the air around it. It sits outside the
          crop, because a glow with a straight edge is a box. */}
      <span aria-hidden="true" className="cdev__halo" />

      {/* the cloud the hand comes up out of - one bank behind it for
          distance, one low and in front, which is also what takes the
          straight edge off the foot of the frame */}
      <span aria-hidden="true" className="cdev__smoke cdev__smoke--back" />

      <div className="cdev__crop">
        <div className="cdev__rig">
          {/* The app is laid out inside the cut-out, not projected onto it.
              Same box, same corners, positioned by layout: there is no room
              left for it to slide, which is the whole requirement. */}
          <div className="cdev__screen">{children}</div>

          {/* the plate sits over the app: bezel, notch and fingers all in
              front of the running screen, the way a hand holds a phone */}
          <img
            src={HAND_SRC}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="cdev__plate"
          />
        </div>
      </div>

      <span aria-hidden="true" className="cdev__smoke cdev__smoke--front" />
    </div>
  )
}

export default ConceptDevice
