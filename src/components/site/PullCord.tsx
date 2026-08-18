import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A rope with a ball on the end, hanging in the Work hero. Grab the ball and
 * it stretches; pull it past the line and let go and the page flips to red;
 * pull it again to put the page back.
 *
 * The rope is a verlet chain solved in plain pixels - position, previous
 * position, gravity, then a few passes of "put the links back to length".
 * That is the whole simulation, which is why this needs no physics engine and
 * no WebGL: it is one <path> and one <circle>, redrawn on demand.
 *
 * The loop parks itself when the rope has settled and wakes on the next
 * interaction, so an idle page is not paying for an animation frame.
 */

const W = 132 // the drawing box, in CSS pixels (viewBox matches 1:1)
const H = 340

const LINKS = 15
const SEG = 15 // rest length of one link
const GRAVITY = 0.72
const FRICTION = 0.986
const RELAX = 8 // constraint passes per frame; more = stiffer rope
const BALL_R = 15

/**
 * Speed ceiling, in pixels per frame. A pointer can cross the whole rope
 * between two frames, and verlet reads that gap as velocity: released, the
 * ball would whip over the anchor and wrap the rope around it. Capping the
 * step keeps the swing in the range a real cord would have.
 */
const MAX_V = 18

/** how far below its resting position the ball must go to count as a pull */
const PULL = 78

type Point = { x: number; y: number; px: number; py: number }

export function PullCord({
  pulled,
  onToggle,
  className = '',
}: {
  pulled: boolean
  onToggle: () => void
  className?: string
}) {
  const svg = useRef<SVGSVGElement>(null)
  const rope = useRef<SVGPathElement>(null)
  const knob = useRef<SVGGElement>(null)
  const points = useRef<Array<Point>>([])
  const frame = useRef(0)
  const drag = useRef<{ id: number; armed: boolean } | null>(null)
  const [armed, setArmed] = useState(false)

  // the rope hangs from the top edge; the last point carries the ball
  if (!points.current.length) {
    points.current = Array.from({ length: LINKS + 1 }, (_, i) => ({
      x: W / 2,
      y: 8 + i * SEG,
      px: W / 2,
      py: 8 + i * SEG,
    }))
  }

  const draw = useCallback(() => {
    const pts = points.current
    const path = rope.current
    const ball = knob.current
    if (!path || !ball) return

    // midpoint-smoothed polyline: each link's corner is rounded off against
    // the next, so a 15-link chain reads as one continuous cord
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
    for (let i = 1; i < pts.length - 1; i += 1) {
      const mx = (pts[i].x + pts[i + 1].x) / 2
      const my = (pts[i].y + pts[i + 1].y) / 2
      d += ` Q ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}, ${mx.toFixed(1)} ${my.toFixed(1)}`
    }
    const last = pts[pts.length - 1]
    d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`

    path.setAttribute('d', d)
    ball.setAttribute('transform', `translate(${last.x} ${last.y})`)
  }, [])

  const step = useCallback(() => {
    const pts = points.current
    const held = drag.current

    for (let i = 1; i < pts.length; i += 1) {
      // the ball is carried by the pointer while it is held, so it does not
      // integrate - the rest of the chain is pulled along by the constraints
      if (held && i === pts.length - 1) continue
      const p = pts[i]
      let vx = (p.x - p.px) * FRICTION
      let vy = (p.y - p.py) * FRICTION
      const speed = Math.hypot(vx, vy)
      if (speed > MAX_V) {
        vx = (vx / speed) * MAX_V
        vy = (vy / speed) * MAX_V
      }
      p.px = p.x
      p.py = p.y
      p.x += vx
      p.y += vy + GRAVITY
    }

    for (let pass = 0; pass < RELAX; pass += 1) {
      for (let i = 0; i < pts.length - 1; i += 1) {
        const a = pts[i]
        const b = pts[i + 1]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.hypot(dx, dy) || 0.0001
        const shift = (dist - SEG) / dist / 2
        const ox = dx * shift
        const oy = dy * shift

        // the top link is nailed to the ceiling, and the ball is nailed to
        // the pointer while held; everything else shares the correction
        const aFixed = i === 0
        const bFixed = held && i + 1 === pts.length - 1

        if (!aFixed && !bFixed) {
          a.x += ox
          a.y += oy
          b.x -= ox
          b.y -= oy
        } else if (aFixed && !bFixed) {
          b.x -= ox * 2
          b.y -= oy * 2
        } else if (!aFixed && bFixed) {
          a.x += ox * 2
          a.y += oy * 2
        }
      }
    }

    draw()

    // how much life is left in the rope: park the loop once it is still
    let energy = 0
    for (const p of pts) energy += Math.abs(p.x - p.px) + Math.abs(p.y - p.py)
    return energy
  }, [draw])

  const run = useCallback(() => {
    if (frame.current) return
    const tick = () => {
      const energy = step()
      if (energy < 0.35 && !drag.current) {
        frame.current = 0
        return
      }
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }, [step])

  useEffect(() => {
    // settle the rope off-screen before the first paint rather than letting
    // the reader watch it sag into place - and for anyone who has asked for
    // less motion, that settled state is simply where it stays until they
    // take hold of it themselves
    for (let i = 0; i < 140; i += 1) step()
    draw()

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduce) run()

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = 0
    }
  }, [draw, run, step])

  /** pointer position in the rope's own pixel space */
  const local = (e: PointerEvent | React.PointerEvent) => {
    const box = svg.current?.getBoundingClientRect()
    if (!box) return null
    return {
      x: ((e.clientX - box.left) / box.width) * W,
      y: ((e.clientY - box.top) / box.height) * H,
    }
  }

  const restY = 8 + LINKS * SEG

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const held = drag.current
      if (!held || e.pointerId !== held.id) return
      const at = local(e)
      if (!at) return
      const ball = points.current[points.current.length - 1]
      ball.px = ball.x
      ball.py = ball.y
      // the ball can be taken sideways as well as down, but not up past the
      // anchor and not out of the box
      ball.x = Math.max(-40, Math.min(W + 40, at.x))
      ball.y = Math.max(24, Math.min(H + 90, at.y))

      const far = ball.y - restY > PULL
      if (far !== held.armed) {
        held.armed = far
        setArmed(far)
      }
      run()
    }

    const up = (e: PointerEvent) => {
      const held = drag.current
      if (!held || e.pointerId !== held.id) return
      drag.current = null
      setArmed(false)
      if (held.armed) onToggle()
      run()
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [onToggle, restY, run])

  const grab = (e: React.PointerEvent) => {
    e.preventDefault()
    drag.current = { id: e.pointerId, armed: false }
    setArmed(false)
    run()
  }

  return (
    <svg
      ref={svg}
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      className={`pull-cord ${armed ? 'is-armed' : ''} ${className}`}
    >
      <path
        ref={rope}
        className="pull-cord__rope"
        stroke="var(--brand)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <g
        ref={knob}
        className="pull-cord__knob"
        role="button"
        tabIndex={0}
        aria-pressed={pulled}
        aria-label="Pull the cord to switch the page to red"
        onPointerDown={grab}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return
          e.preventDefault()
          onToggle()
        }}
      >
        <circle r={BALL_R + 9} className="pull-cord__grip" />
        <circle r={BALL_R} className="pull-cord__ball" fill="var(--brand)" />
        <circle
          r={BALL_R * 0.34}
          cx={-BALL_R * 0.3}
          cy={-BALL_R * 0.34}
          fill="#fff"
          opacity="0.34"
        />
      </g>
    </svg>
  )
}

export default PullCord
