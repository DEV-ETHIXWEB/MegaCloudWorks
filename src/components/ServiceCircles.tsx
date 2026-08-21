import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal'
import { CIRCLES } from '../content/services'

// One consistent light source (top-left) across all three objects, so they
// read as sitting in the same physical space rather than each having its
// own shadow direction. Kept deliberately restrained: a soft ambient drop
// plus a faint inset highlight, not a cartoon bevel.
//
// The cloud is an irregular silhouette, so it can't lean on box-shadow's
// inset terms and border-radius the way the old circle did — box-shadow
// draws around the element's own box, not its clip-path. Ambient/glow
// shadows move to filter: drop-shadow(), which follows a clipped shape's
// real alpha silhouette; the inset highlight/shade stays as box-shadow on a
// separate overlay clipped to the same cloud path (inset shadows do respect
// clip-path, since they paint inside the element rather than around it).
const REST_DROP = 'drop-shadow(5px 7px 10px rgba(20,20,20,0.16)) drop-shadow(0 0 8px rgba(193,20,32,0.08))'
const HOVER_DROP = 'drop-shadow(7px 11px 16px rgba(20,20,20,0.22)) drop-shadow(0 0 14px rgba(193,20,32,0.16))'
const PRESSED_DROP = 'drop-shadow(2px 3px 6px rgba(20,20,20,0.14)) drop-shadow(0 0 6px rgba(193,20,32,0.12))'

const REST_INSET = 'inset 1.5px 2px 5px rgba(255,255,255,0.8), inset -2px -3px 7px rgba(20,20,20,0.04)'
const HOVER_INSET = 'inset 1.5px 2px 5px rgba(255,255,255,0.85), inset -2px -3px 8px rgba(20,20,20,0.04)'
const PRESSED_INSET = 'inset 3px 4px 9px rgba(20,20,20,0.12), inset -2px -2px 6px rgba(255,255,255,0.55)'

// each circle floats on its own slow, slightly offset loop so the three
// never move in lockstep: barely perceptible, not a bounce
const FLOAT_DURATIONS = [7.5, 8.6, 7.9]
const FLOAT_DELAYS = [0, 0.6, 1.3]

// matches the previous 380ms cubic-bezier(0.22, 1, 0.36, 1) settle by feel
const TILT_SPRING = { stiffness: 340, damping: 30, mass: 0.5 }

function ClayCircle({
  n,
  title,
  hash,
  tags,
  index,
  delay,
  reduced,
}: (typeof CIRCLES)[number] & { index: number; delay: number; reduced: boolean }) {
  // Cursor tilt lives in Motion values, not React state: a raw mousemove
  // can fire far more often than a frame, so setState-per-pixel here was
  // re-rendering (and, since this card now clips to an SVG path and casts
  // filter: drop-shadow instead of the old box-shadow, repainting) on every
  // one of those events. Motion values update the transform directly on
  // the node without touching React at all — same approach CardSpotlight
  // already uses for its cursor glow.
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, TILT_SPRING)
  const y = useSpring(rawY, TILT_SPRING)
  const lift = useSpring(0, TILT_SPRING)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)
  // Touch-only devices can leave a synthetic hover engaged after a tap since
  // there's no real pointer to trigger mouseleave; only tilt/glow on devices
  // that report genuine hover support. The explicit onTouchStart/onTouchEnd
  // below still give touch its own tactile "pressed" feedback.
  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduced || !canHover) return
    const rect = e.currentTarget.getBoundingClientRect()
    rawX.set((e.clientX - (rect.left + rect.width / 2)) / 22)
    rawY.set((e.clientY - (rect.top + rect.height / 2)) / 22)
  }

  const drop = pressed ? PRESSED_DROP : hovering ? HOVER_DROP : REST_DROP
  const inset = pressed ? PRESSED_INSET : hovering ? HOVER_INSET : REST_INSET
  const liftTarget = pressed ? 1 : hovering ? -6 : 0

  useEffect(() => {
    lift.set(liftTarget)
  }, [liftTarget, lift])

  const tiltY = useTransform([y, lift], ([yy, ll]) => (yy as number) + (ll as number))
  const transform = useMotionTemplate`translate3d(${x}px, ${tiltY}px, 0)`

  return (
    <Reveal delay={delay} className={index > 0 ? '-mt-10 md:mt-0' : undefined}>
      <motion.div
        animate={
          reduced
            ? undefined
            : { y: [0, -3, 0] }
        }
        transition={
          reduced
            ? undefined
            : {
                duration: FLOAT_DURATIONS[index % FLOAT_DURATIONS.length],
                delay: FLOAT_DELAYS[index % FLOAT_DELAYS.length],
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
        // promotes this to its own compositor layer so the infinite float
        // moves the already-painted (clipped + filtered) bitmap around
        // instead of repainting the clay-cloud clip-path and drop-shadow
        // on every frame, forever
        style={{ willChange: 'transform' }}
      >
        <motion.div
          onMouseMove={onMove}
          onMouseEnter={() => canHover && setHovering(true)}
          onMouseLeave={() => {
            setHovering(false)
            setPressed(false)
            rawX.set(0)
            rawY.set(0)
          }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          style={{
            transform,
            transition: 'box-shadow 380ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <Link
            to={hash}
            onTouchStart={() => setPressed(true)}
            onTouchEnd={() => setPressed(false)}
            // wider than tall (aspect-[7/6], not a square): a dome that's as
            // tall as it is wide reads as a bell, not a cloud. The clip-path
            // is in objectBoundingBox units, so stretching this box is all
            // it takes to reshape it — no need to touch the circle cluster.
            className="group relative flex w-[17.75rem] aspect-[7/6] flex-col items-center justify-center gap-2 px-8 pb-20 pt-9 text-center no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand)] md:w-[16.25rem] md:pb-16 md:pt-8 lg:w-[20.5rem] lg:pb-24 lg:pt-10"
            style={{
              filter: drop,
              transition: 'filter 380ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                clipPath: 'url(#clay-cloud)',
                background: 'linear-gradient(145deg, #ffffff 0%, #fbfbfa 55%, #f4f4f2 100%)',
                boxShadow: inset,
                transition: 'box-shadow 380ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
            <span className="relative flex flex-col items-center gap-2.5">
              <span
                className="flex size-8 items-center justify-center rounded-full text-[11px] font-black text-white"
                style={{
                  background: 'linear-gradient(145deg, var(--brand-2), var(--brand))',
                  boxShadow: '2px 3px 6px -2px rgba(193,20,32,0.45), inset 1px 1px 2px rgba(255,255,255,0.35)',
                }}
              >
                {n}
              </span>
              <span className="font-sans text-xl font-extrabold leading-tight tracking-tight text-[var(--ink)] lg:text-2xl">
                {title}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-[var(--ink-soft)]"
                    style={{
                      background: '#f2f2f0',
                      boxShadow: 'inset 1px 1.5px 3px rgba(20,20,20,0.08), inset -1px -1px 2px rgba(255,255,255,0.7)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-text)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Find out more <ArrowRight size={12} />
              </span>
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </Reveal>
  )
}

/**
 * The three-circle quick nav: soft claymorphic objects, a subtle tonal
 * surface gradient, one consistent top-left light source, a controlled
 * ambient shadow (never a glow, never bleeding into a neighbour), and an
 * inset highlight for a touch of roundness. Generous real gaps keep the
 * three shadows from ever touching at any breakpoint.
 */
export function ServiceCircles() {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="py-2 sm:py-4">
      {/* the cloud silhouette every card clips to, defined once and shared
          by url(#clay-cloud) rather than duplicated per card. objectBoundingBox
          units mean the 0-1 path scales to whatever box each ClayCircle's
          Link ends up with — width from its own classes, height derived
          from that same element's aspect-[7/6]. */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          {/* a clipPath's children union automatically, so the cloud is just
              a flat-bottomed base plus several full circles overlapping
              along the top — every lobe stays a perfect arc (crisp, premium)
              instead of an eyeballed cubic curve trying to fake one. */}
          <clipPath id="clay-cloud" clipPathUnits="objectBoundingBox">
            <circle cx="0.4773" cy="0.2973" r="0.2273" />
            <circle cx="0.2864" cy="0.3882" r="0.1727" />
            <circle cx="0.6591" cy="0.3700" r="0.1818" />
            <circle cx="0.1773" cy="0.5336" r="0.1273" />
            <circle cx="0.8136" cy="0.5155" r="0.1364" />
            <circle cx="0.3682" cy="0.5700" r="0.1455" />
            <circle cx="0.5500" cy="0.5973" r="0.1545" />
            <circle cx="0.7136" cy="0.5791" r="0.1273" />
          </clipPath>
        </defs>
      </svg>

      <div className="mx-auto flex max-w-[60rem] flex-col items-center gap-0 md:flex-row md:justify-center md:gap-10 lg:gap-16">
        {/* on mobile the cards stack; -mt pulls each into the previous
            card's own transparent lower corners (its cloud shape doesn't
            fill its box) instead of leaving a second, visually-doubled gap
            on top of that dead space */}
        {CIRCLES.map((c, i) => (
          <ClayCircle key={c.n} {...c} index={i} delay={i * 0.08} reduced={reduced} />
        ))}
      </div>
    </div>
  )
}
