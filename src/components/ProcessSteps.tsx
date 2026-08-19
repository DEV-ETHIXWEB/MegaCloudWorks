import { useState } from 'react'
import { Check } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Reveal } from './Reveal'
import { STEPS } from '../content/home'

export function ProcessSteps() {
  const [active, setActive] = useState(0)

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* progress rail */}
      <Reveal className="hidden lg:block">
        <div className="sticky top-28 space-y-1">
          {STEPS.map((s, i) => (
            <button
              key={s.n}
              onClick={() => setActive(i)}
              className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition-colors ${
                active === i
                  ? 'bg-[var(--brand)] text-white'
                  : 'text-[var(--ink-faint)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]'
              }`}
            >
              <span className="mr-2 opacity-70">{s.n}</span>
              {s.title}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="space-y-4">
        {STEPS.map((s, i) => {
          const isActive = active === i
          return (
            <Reveal key={s.n} delay={i * 0.05}>
              <div
                className={`surface-lift overflow-hidden transition-[border-color] ${
                  isActive ? 'border-[var(--brand)]/40' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActive(isActive ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left"
                  aria-expanded={isActive}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`edge-hard flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-black transition-colors ${
                        isActive ? 'bg-[var(--brand)] text-white' : 'bg-white text-[var(--ink)]'
                      }`}
                    >
                      {s.n}
                    </span>
                    <div>
                      <h3 className="font-sans text-lg font-extrabold tracking-tight sm:text-xl">
                        {s.title}
                      </h3>
                      <p className="text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
                        {s.meta}
                      </p>
                    </div>
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 pb-6 pl-[4.25rem]">
                        <p className="text-[var(--ink-soft)]">{s.blurb}</p>
                        <ul className="mt-4 space-y-2">
                          {s.points.map((p) => (
                            <li key={p} className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
                              <Check size={14} strokeWidth={3} className="text-[var(--brand)]" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
