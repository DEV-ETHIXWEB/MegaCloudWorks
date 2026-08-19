import { useState } from 'react'
import { motion } from 'motion/react'
import { Reveal } from './Reveal'
import { STEPS } from '../content/home'

const TOTAL_WEEKS = STEPS.reduce((sum, s) => sum + s.weeks, 0)

/**
 * "How we work" as a phase timeline instead of the old click-to-expand
 * accordion — a connecting line draws itself in as it scrolls into view,
 * each phase gets a small proportional bar showing its share of the nine
 * weeks (the actual "graph"), and clicking a phase quietly highlights it.
 * All of it stays understated: a hairline that lights up, a bar that
 * grows, a border that tints — nothing that competes with the copy.
 */
export function ProcessTimeline() {
  const [active, setActive] = useState(0)

  return (
    <div>
      {/* the connecting line — draws left to right on scroll-in, with a dot
          over each phase that fills solid once you've selected it */}
      <div className="relative mb-2 hidden h-3 lg:block">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--line)]" />
        <motion.div
          className="absolute inset-y-0 left-0 top-1/2 h-px -translate-y-1/2 bg-[var(--brand)]"
          initial={{ width: '0%' }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
        />
        {STEPS.map((s, i) => (
          <span
            key={s.n}
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors duration-300"
            style={{
              left: `${(i / (STEPS.length - 1)) * 100}%`,
              borderColor: active === i ? 'var(--brand)' : 'var(--line-strong)',
              background: active === i ? 'var(--brand)' : 'var(--paper)',
            }}
          />
        ))}
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-[var(--line)]">
        {STEPS.map((s, i) => {
          const isActive = active === i
          return (
            <Reveal key={s.n} delay={i * 0.08} className="lg:px-8 lg:first:pl-0 lg:last:pr-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className="-mx-3 -mt-3 block w-[calc(100%+1.5rem)] rounded-2xl p-3 text-left transition-colors duration-300"
                style={{ background: isActive ? 'var(--brand-soft)' : 'transparent' }}
              >
                <div className="flex items-baseline gap-3">
                  <h3 className="font-sans text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-[1.75rem]">
                    {s.title}
                  </h3>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-colors duration-300"
                    style={{
                      background: isActive ? 'var(--brand)' : 'var(--brand-soft)',
                      color: isActive ? '#fff' : 'var(--brand-text)',
                    }}
                  >
                    {s.meta}
                  </span>
                </div>

                {/* the graph: a hairline bar sized to this phase's share of
                    the nine weeks, so "Build" reading much wider than
                    "Launch" is the timeline's real proportions, not decoration */}
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--paper-3)]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: isActive ? 'var(--brand)' : 'var(--line-strong)' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(s.weeks / TOTAL_WEEKS) * 100}%` }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">{s.blurb}</p>
              </button>
              <ul className="mt-5 space-y-2 border-t border-[var(--line)] pt-5">
                {s.points.map((p) => (
                  <li key={p} className="text-sm text-[var(--ink-faint)]">
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          )
        })}
      </div>

      {/* the wave — a quiet closing flourish, not a set piece: a handful of
          overlapping semicircles fading in from the edges, all at low
          opacity so it reads as texture under the timeline rather than
          competing with it */}
      <div className="mt-14 h-8 w-full overflow-hidden opacity-[0.35] sm:mt-16 sm:h-10" aria-hidden="true">
        <svg viewBox="0 0 1400 40" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="process-wave-fade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--brand)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {Array.from({ length: 40 }).map((_, i) => (
            <circle key={i} cx={i * 36 + 18} cy="0" r="19" fill="url(#process-wave-fade)" />
          ))}
        </svg>
      </div>
    </div>
  )
}
