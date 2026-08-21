import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IPhoneMockup } from './IPhoneMockup'
import { PhoneNavProvider } from '../lib/phoneUI'
import { CONCEPT_SCREENS } from '../lib/conceptScreens'
import type { Concept } from '../content/concepts'

const AUTOPLAY_MS = 4200

/**
 * The work-detail "Key screens" moment: one phone live and centered, its
 * neighbours peeking in at the edges, dimmed and scaled down. Arrows and
 * dots move the same index the peeking phones already hint at, and the
 * whole thing loops on its own until a visitor reaches for the controls —
 * at which point it hands control over and stays put, the same courtesy
 * ScreensShowcase's mobile autoplay already extends.
 */
export function ScreensCarousel({ concept }: { concept: Concept }) {
  const screens = CONCEPT_SCREENS[concept.slug] ?? []
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dir, setDir] = useState<1 | -1>(1)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const count = screens.length

  useEffect(() => {
    if (reduced || paused || count < 2) return
    const id = window.setInterval(() => {
      setDir(1)
      setIndex((i) => (i + 1) % count)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [reduced, paused, count])

  const go = (next: number, direction: 1 | -1) => {
    setPaused(true)
    setDir(direction)
    setIndex(((next % count) + count) % count)
  }

  const Active = screens[index]
  const prevIdx = ((index - 1) % count + count) % count
  const nextIdx = (index + 1) % count
  const Prev = screens[prevIdx]
  const Next = screens[nextIdx]
  if (!Active) return null

  return (
    <div
      className="mx-auto w-full max-w-[46rem] select-none"
      onPointerDown={() => setPaused(true)}
    >
      <div className="relative flex items-center justify-center py-2" style={{ minHeight: 470 }}>
        {/* previous phone, peeking at the left edge */}
        {count > 2 && (
          <button
            type="button"
            aria-label={`Show ${concept.screens[prevIdx]}`}
            onClick={() => go(prevIdx, -1)}
            className="absolute left-0 z-0 hidden w-[11rem] shrink-0 opacity-40 grayscale-[0.3] transition-opacity duration-300 hover:opacity-60 sm:block"
            style={{ transform: 'translateX(-38%) scale(0.78)' }}
          >
            <IPhoneMockup size="md">
              <Prev accent={concept.accent} />
            </IPhoneMockup>
          </button>
        )}

        {/* active phone, live and tappable */}
        <div className="relative z-10 w-[13.5rem] shrink-0 sm:w-[15rem]" style={{ filter: 'drop-shadow(0 26px 40px rgba(0,0,0,0.22))' }}>
          <PhoneNavProvider index={index} count={count} onGo={(next) => go(next, next > index ? 1 : -1)}>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: dir * 26 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -26 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <IPhoneMockup size="md" label={`${concept.name} · ${concept.screens[index]}, screen ${index + 1} of ${count}`}>
                  <Active accent={concept.accent} />
                </IPhoneMockup>
              </motion.div>
            </AnimatePresence>
          </PhoneNavProvider>
        </div>

        {/* next phone, peeking at the right edge */}
        {count > 2 && (
          <button
            type="button"
            aria-label={`Show ${concept.screens[nextIdx]}`}
            onClick={() => go(nextIdx, 1)}
            className="absolute right-0 z-0 hidden w-[11rem] shrink-0 opacity-40 grayscale-[0.3] transition-opacity duration-300 hover:opacity-60 sm:block"
            style={{ transform: 'translateX(38%) scale(0.78)' }}
          >
            <IPhoneMockup size="md">
              <Next accent={concept.accent} />
            </IPhoneMockup>
          </button>
        )}

        {/* arrow controls: sit just outside the peeking phones so they
            never overlap the live screen's own tap targets */}
        <button
          type="button"
          aria-label="Previous screen"
          onClick={() => go(prevIdx, -1)}
          className="surface-lift absolute left-1 z-20 flex size-9 items-center justify-center rounded-full text-[var(--ink)] sm:-left-2"
        >
          <ChevronLeft size={16} strokeWidth={2.4} />
        </button>
        <button
          type="button"
          aria-label="Next screen"
          onClick={() => go(nextIdx, 1)}
          className="surface-lift absolute right-1 z-20 flex size-9 items-center justify-center rounded-full text-[var(--ink)] sm:-right-2"
        >
          <ChevronRight size={16} strokeWidth={2.4} />
        </button>
      </div>

      <p className="mt-5 text-center text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
        Screen {String(index + 1).padStart(2, '0')} of {String(count).padStart(2, '0')}
      </p>
      <p className="mt-1 text-center font-sans text-sm font-bold text-[var(--ink)]">{concept.screens[index]}</p>

      {/* progress dots double as manual controls, same idiom as the
          mobile autoplay phone elsewhere on the site */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {screens.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show screen ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i, i > index ? 1 : -1)}
            className="p-1.5"
          >
            <span
              className="block size-1.5 rounded-full transition-all"
              style={{
                background: i === index ? concept.accent : 'var(--ink-faint)',
                opacity: i === index ? 1 : 0.35,
                width: i === index ? 14 : 6,
                borderRadius: 999,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
