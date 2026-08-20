import { useState } from 'react'
import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal'
import { CIRCLES } from '../content/services'

// One consistent light source (top-left) across all three objects, so they
// read as sitting in the same physical space rather than each having its
// own shadow direction. Kept deliberately restrained — a soft ambient drop
// plus a faint inset highlight, not a cartoon bevel.
const REST_SHADOW =
  '5px 7px 14px -8px rgba(20,20,20,0.1), -4px -4px 10px -8px rgba(255,255,255,0.8), inset 1.5px 1.5px 4px rgba(255,255,255,0.7), inset -1.5px -1.5px 5px rgba(20,20,20,0.03)'
const HOVER_SHADOW =
  '7px 10px 18px -9px rgba(20,20,20,0.15), -5px -5px 12px -9px rgba(255,255,255,0.85), inset 1.5px 1.5px 4px rgba(255,255,255,0.75), inset -1.5px -1.5px 5px rgba(20,20,20,0.03)'
const PRESSED_SHADOW =
  'inset 4px 5px 10px rgba(20,20,20,0.1), inset -3px -3px 8px rgba(255,255,255,0.6)'

// each circle floats on its own slow, slightly offset loop so the three
// never move in lockstep — barely perceptible, not a bounce
const FLOAT_DURATIONS = [7.5, 8.6, 7.9]
const FLOAT_DELAYS = [0, 0.6, 1.3]

function ClayCircle({
  n,
  title,
  hash,
  tags,
  index,
  delay,
  reduced,
}: (typeof CIRCLES)[number] & { index: number; delay: number; reduced: boolean }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    setPos({ x: (e.clientX - (rect.left + rect.width / 2)) / 22, y: (e.clientY - (rect.top + rect.height / 2)) / 22 })
  }

  const shadow = pressed ? PRESSED_SHADOW : hovering ? HOVER_SHADOW : REST_SHADOW
  const lift = pressed ? 1 : hovering ? -6 : 0

  return (
    <Reveal delay={delay}>
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
      >
        <motion.div
          onMouseMove={onMove}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => {
            setHovering(false)
            setPressed(false)
            setPos({ x: 0, y: 0 })
          }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          style={{
            transform: `translate3d(${hovering ? pos.x : 0}px, ${(hovering ? pos.y : 0) + lift}px, 0)`,
            transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 380ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <Link
            to={hash}
            onTouchStart={() => setPressed(true)}
            onTouchEnd={() => setPressed(false)}
            className="group flex size-[15rem] flex-col items-center justify-center gap-3 rounded-full p-6 text-center no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand)] md:size-[13.5rem] lg:size-[17.5rem]"
            style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #fbfbfa 55%, #f4f4f2 100%)',
              boxShadow: shadow,
              transition: 'box-shadow 380ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
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
          </Link>
        </motion.div>
      </motion.div>
    </Reveal>
  )
}

/**
 * The three-circle quick nav — soft claymorphic objects: a subtle tonal
 * surface gradient, one consistent top-left light source, a controlled
 * ambient shadow (never a glow, never bleeding into a neighbour), and an
 * inset highlight for a touch of roundness. Generous real gaps keep the
 * three shadows from ever touching at any breakpoint.
 */
export function ServiceCircles() {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="py-10 sm:py-14">
      <div className="mx-auto flex max-w-[60rem] flex-col items-center gap-10 md:flex-row md:justify-center md:gap-9 lg:gap-14">
        {CIRCLES.map((c, i) => (
          <ClayCircle key={c.n} {...c} index={i} delay={i * 0.08} reduced={reduced} />
        ))}
      </div>
    </div>
  )
}
