import { useState } from 'react'
import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal'
import { CIRCLES } from '../content/services'

function GlassCircle({ n, title, hash, tags, delay }: (typeof CIRCLES)[number] & { delay: number }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    setPos({ x: (e.clientX - (rect.left + rect.width / 2)) / 14, y: (e.clientY - (rect.top + rect.height / 2)) / 14 })
  }

  return (
    <Reveal delay={delay}>
      <motion.div
        onMouseMove={onMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => {
          setHovering(false)
          setPos({ x: 0, y: 0 })
        }}
        style={{
          transform: hovering ? `translate3d(${pos.x}px, ${pos.y}px, 0) scale(1.02)` : 'translate3d(0,0,0) scale(1)',
          transition: 'transform 0.2s ease-out',
        }}
      >
        <Link
          to={hash}
          className="surface-glass group flex size-[15rem] flex-col items-center justify-center gap-3 rounded-full p-6 text-center no-underline shadow-[0_24px_60px_-28px_rgba(16,16,20,0.35)] sm:size-[17.5rem]"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-[var(--brand)] text-[11px] font-black text-white">
            {n}
          </span>
          <span className="font-sans text-xl font-extrabold leading-tight tracking-tight text-[var(--ink)] sm:text-2xl">
            {title}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold text-[var(--ink-soft)] ring-1 ring-white/80"
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
    </Reveal>
  )
}

/**
 * The three-circle quick nav, redone as soft overlapping glass discs over a
 * bed of concentric rings — a subtle glassmorphism moment (the only place
 * on the site the glass treatment carries real backdrop color to blur)
 * rather than the flat white circles it replaces. Each disc tilts gently
 * toward the cursor, the same restrained parallax used elsewhere on the
 * site, not a new interaction language.
 */
export function ServiceCircles() {
  return (
    <div className="relative overflow-hidden py-6">
      {/* concentric rings — the glass backdrop */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--brand)]/10 sm:size-[42rem]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--brand)]/10 sm:size-[32rem]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 sm:size-[22rem]"
        style={{ background: 'radial-gradient(circle, var(--brand-soft), transparent 72%)' }}
        aria-hidden="true"
      />

      <div className="mx-auto flex max-w-[50rem] flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-0">
        {CIRCLES.map((c, i) => (
          <div key={c.n} className={i > 0 ? 'sm:-ml-8' : ''}>
            <GlassCircle {...c} delay={i * 0.08} />
          </div>
        ))}
      </div>
    </div>
  )
}
