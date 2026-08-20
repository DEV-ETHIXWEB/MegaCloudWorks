import { useState } from 'react'
import { Search, PenTool, Code2, Rocket } from 'lucide-react'
import { Reveal } from './Reveal'
import { STEPS } from '../content/home'

// one icon per phase, standing in for what actually happens that week
// rather than an abstract bar
const ICONS = [Search, PenTool, Code2, Rocket]

// a light staircase offset per column: a quiet rhythm across the row
// rather than four cards sitting dead level with each other
const STAIRCASE = ['lg:mt-0', 'lg:mt-5', 'lg:mt-10', 'lg:mt-5']

/**
 * "How we work" as a phase timeline instead of the old click-to-expand
 * accordion. Each phase gets an icon for what it actually is, and the
 * active phase lifts on a soft shadow rather than filling with a flat
 * color block.
 */
export function ProcessTimeline() {
  const [active, setActive] = useState(0)

  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-[var(--line)]">
      {STEPS.map((s, i) => {
        const isActive = active === i
        const Icon = ICONS[i]
        return (
          <Reveal key={s.n} delay={i * 0.08} className={`lg:px-8 lg:first:pl-0 lg:last:pr-0 ${STAIRCASE[i]}`}>
            <button
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className="-mx-3 -mt-3 block w-[calc(100%+1.5rem)] rounded-2xl p-3 text-left transition-transform duration-300"
              style={{
                transform: isActive ? 'translateY(-3px)' : 'translateY(0)',
              }}
            >
              <span
                className="flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                style={{
                  background: isActive ? 'var(--brand)' : 'var(--paper-2)',
                  color: isActive ? '#fff' : 'var(--brand-text)',
                }}
              >
                <Icon size={20} strokeWidth={2} />
              </span>

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
  )
}
