import { useState } from 'react'
import { motion } from 'motion/react'
import { Reveal } from './Reveal'
import { STEPS } from '../content/home'

const MAX_WEEKS = Math.max(...STEPS.map((s) => s.weeks))
// a light staircase offset per column — a quiet rhythm across the row
// rather than four cards sitting dead level with each other
const STAIRCASE = ['lg:mt-0', 'lg:mt-5', 'lg:mt-10', 'lg:mt-5']

/**
 * "How we work" as a phase timeline instead of the old click-to-expand
 * accordion. Each phase carries its own small bar-chart — all four weeks
 * values, its own bar picked out in brand red — so "Build" reading far
 * taller than "Launch" is the real nine-week shape, not decoration.
 * Columns step down the row like a staircase for rhythm, and clicking a
 * phase quietly highlights it. Nothing else added underneath — no closing
 * graphic, just the timeline itself.
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
            <Reveal key={s.n} delay={i * 0.08} className={`lg:px-8 lg:first:pl-0 lg:last:pr-0 ${STAIRCASE[i]}`}>
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className="-mx-3 -mt-3 block w-[calc(100%+1.5rem)] rounded-2xl p-3 text-left transition-colors duration-300"
                style={{ background: isActive ? 'var(--brand-soft)' : 'transparent' }}
              >
                {/* the graph: every phase's share of the nine weeks, this
                    column's own bar picked out — reads as one small chart
                    repeated four times, each copy pointing at itself */}
                <div className="flex h-10 items-end gap-1" aria-hidden="true">
                  {STEPS.map((bar, j) => (
                    <motion.div
                      key={bar.n}
                      className="w-2 rounded-full"
                      style={{ background: j === i ? 'var(--brand)' : 'var(--line-strong)' }}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${(bar.weeks / MAX_WEEKS) * 100}%` }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.6, delay: 0.1 + j * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ))}
                </div>

                <div className="mt-4 flex items-baseline gap-3">
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
    </div>
  )
}
