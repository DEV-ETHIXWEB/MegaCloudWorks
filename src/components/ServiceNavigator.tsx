import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Check } from 'lucide-react'
import { Reveal } from './Reveal'
import { SERVICE_DETAILS } from '../content/services'

function indexForHash(hash: string) {
  const i = SERVICE_DETAILS.findIndex((s) => `#${s.id}` === hash)
  return i === -1 ? 0 : i
}

/**
 * One interactive capability picker: tabs on desktop drive a single detail
 * panel (progressive disclosure — nothing is duplicated three times on the
 * page), collapsing to an accordion of the same content on mobile where a
 * hover/tab pattern doesn't translate to touch.
 *
 * Only the active tab's content exists in the DOM, so a deep link like
 * /services#brand-ui (used from the homepage's service cards) has to pick
 * that tab on load rather than relying on the browser to scroll to an id
 * that was never rendered.
 */
export function ServiceNavigator() {
  const { hash } = useLocation()
  const [active, setActive] = useState(() => indexForHash(hash))

  useEffect(() => {
    if (!hash) return
    const i = indexForHash(hash)
    setActive(i)
    // the panel for this id only just mounted, so the browser's own
    // navigation-time scroll (which ran before it existed) has nothing to
    // land on yet — do it ourselves once the element is actually there.
    requestAnimationFrame(() => {
      document.getElementById(SERVICE_DETAILS[i].id)?.scrollIntoView({ block: 'start' })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash])

  const service = SERVICE_DETAILS[active]
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const focusTab = (i: number) => {
    setActive(i)
    tabRefs.current[i]?.focus()
  }

  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const last = SERVICE_DETAILS.length - 1
    if (e.key === 'ArrowRight') focusTab(active === last ? 0 : active + 1)
    else if (e.key === 'ArrowLeft') focusTab(active === 0 ? last : active - 1)
    else if (e.key === 'Home') focusTab(0)
    else if (e.key === 'End') focusTab(last)
    else return
    e.preventDefault()
  }

  return (
    <div>
      {/* desktop / tablet — tab rail + single detail panel */}
      <div className="hidden md:block">
        {/* stable scroll target for hash deep-links (e.g. /services#brand-ui
            from the homepage's service cards) — separate from the ARIA
            tabpanel id below, which changes meaning ("the active panel")
            rather than naming one specific service */}
        <div id={SERVICE_DETAILS[active].id} className="scroll-mt-28" />
        <div role="tablist" aria-label="Services" className="flex flex-wrap gap-2 border-b border-[var(--line)] pb-1">
          {SERVICE_DETAILS.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              id={`${s.id}-tab`}
              type="button"
              onClick={() => setActive(i)}
              onKeyDown={onTabKeyDown}
              role="tab"
              aria-selected={active === i}
              aria-controls={`${s.id}-panel`}
              tabIndex={active === i ? 0 : -1}
              className={`relative rounded-t-xl px-5 py-3.5 text-sm font-bold transition-colors ${
                active === i ? 'text-[var(--brand-text)]' : 'text-[var(--ink-faint)] hover:text-[var(--ink)]'
              }`}
            >
              <span className="mr-2 opacity-60">{s.n}</span>
              {s.title}
              {active === i && (
                <motion.span
                  layoutId="service-tab-underline"
                  className="absolute inset-x-3 -bottom-[3px] h-[3px] rounded-full bg-[var(--brand)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={service.id}
            id={`${service.id}-panel`}
            role="tabpanel"
            aria-labelledby={`${service.id}-tab`}
            tabIndex={0}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="scroll-mt-28 grid items-center gap-12 pt-12 lg:grid-cols-[minmax(0,22rem)_1fr]"
          >
            <div className="surface-lift relative mx-auto flex aspect-square w-full max-w-[22rem] items-center justify-center overflow-hidden bg-[var(--paper-2)] p-10">
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{ background: 'radial-gradient(circle at 50% 40%, rgba(245,51,59,0.08), transparent 65%)' }}
              />
              <img
                src={service.img}
                alt=""
                className="relative w-full max-w-[16rem] object-contain drop-shadow-[0_20px_30px_rgba(16,16,20,0.12)]"
              />
            </div>
            <div>
              <span className="kicker" data-n={service.n}>
                {service.tagline}
              </span>
              <h3 className="mt-4 font-sans text-[length:var(--fs-h3)] font-extrabold leading-tight tracking-[var(--tracking-tight)]">
                {service.title}
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-[var(--ink-soft)]">{service.body}</p>
              <ul className="mt-6 space-y-2.5">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-medium text-[var(--ink)]">
                    <Check size={14} strokeWidth={3} className="mt-0.5 shrink-0 text-[var(--brand)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--brand-text)] no-underline hover:opacity-70"
              >
                Start a {service.title.toLowerCase()} project <ArrowUpRight size={15} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* mobile — accordion; every service's full content stays reachable
          without relying on a hover/tab interaction that doesn't fit touch */}
      <div className="space-y-4 md:hidden">
        {SERVICE_DETAILS.map((s, i) => {
          const isOpen = active === i
          return (
            <Reveal key={s.id} delay={i * 0.06}>
              <div id={s.id} className="surface-lift scroll-mt-28 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActive(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`edge-hard flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-black transition-colors ${
                        isOpen ? 'bg-[var(--brand)] text-white' : 'bg-white text-[var(--ink)]'
                      }`}
                    >
                      {s.n}
                    </span>
                    <span className="font-sans text-base font-extrabold tracking-tight">{s.title}</span>
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="space-y-4 px-5 pb-5">
                        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-[var(--paper-2)] p-8">
                          <img
                            src={s.img}
                            alt=""
                            className="w-full max-w-[12rem] object-contain drop-shadow-[0_16px_24px_rgba(16,16,20,0.12)]"
                          />
                        </div>
                        <p className="text-[var(--ink-soft)]">{s.body}</p>
                        <ul className="space-y-2">
                          {s.includes.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-[var(--ink)]">
                              <Check size={13} strokeWidth={3} className="mt-0.5 shrink-0 text-[var(--brand)]" />
                              {item}
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
