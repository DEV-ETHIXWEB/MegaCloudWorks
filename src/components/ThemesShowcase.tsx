import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'
import { IPhoneMockup } from './IPhoneMockup'
import { PhoneNavProvider } from '../lib/phoneUI'
import { CONCEPT_SCREENS } from '../lib/conceptScreens'
import { CONCEPTS } from '../content/concepts'

// same idle-float idiom as ScreensShowcase, so the homepage's row of themes
// and a case study's row of screens read as one language
const FLOAT_DURATIONS = [7.2, 8.4, 7.8, 8.9, 8.1]
const FLOAT_DELAYS = [0, 0.7, 1.4, 0.35, 1.05]

const AUTOPLAY_MS = 3200

/**
 * The mobile case: five full-size stacked phones is the same "wall of
 * devices, scroll past four to see the last one" problem ScreensShowcase's
 * AutoplayPhone solves for one concept's screens — except here each step
 * is a different product entirely, not a different screen of the same one.
 * One phone loops through all five concepts' hero screens on its own; tap
 * to take over and jump straight into that concept's case study.
 */
function AutoplayThemePhone() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced || paused) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % CONCEPTS.length), AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [reduced, paused])

  const concept = CONCEPTS[index]
  const Active = CONCEPT_SCREENS[concept.slug]?.[0]
  if (!Active) return null

  return (
    <div className="mx-auto flex w-full max-w-[220px] flex-col items-center">
      {/* a tap hands control to the visitor: pause the autoplay and let the
          link through to that concept's case study, same as tapping a
          screen dot below */}
      <Link
        to={`/work/${concept.slug}`}
        onPointerDown={() => setPaused(true)}
        className="mx-auto block rounded-[2.75rem]"
        style={{ width: 200, boxShadow: '0 14px 22px rgba(0,0,0,0.16)' }}
      >
        <PhoneNavProvider index={0} count={CONCEPT_SCREENS[concept.slug].length} onGo={() => {}}>
          <IPhoneMockup size="sm" label={`${concept.name} · ${concept.screens[0]}, ${index + 1} of ${CONCEPTS.length}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={concept.slug}
                className="h-full w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Active accent={concept.accent} />
              </motion.div>
            </AnimatePresence>
          </IPhoneMockup>
        </PhoneNavProvider>
      </Link>

      <p className="mt-4 text-center text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
        {concept.category}
      </p>
      <p className="mt-1 text-center font-sans text-sm font-bold text-[var(--ink)]">{concept.name}</p>

      {/* progress dots double as manual controls: tapping one both jumps
          the phone and pauses the loop, same as tapping the phone itself */}
      <div className="mt-3 flex items-center gap-1.5">
        {CONCEPTS.map((c, i) => (
          <button
            key={c.slug}
            type="button"
            aria-label={`Show ${c.name}`}
            aria-current={i === index}
            onClick={() => {
              setPaused(true)
              setIndex(i)
            }}
            className="p-1.5"
          >
            <span
              className="block size-1.5 rounded-full opacity-40 transition-opacity"
              style={{ background: i === index ? concept.accent : 'var(--ink-faint)', opacity: i === index ? 1 : 0.4 }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * The homepage's "one of each" moment: five phones, one per concept, each
 * running its own hero screen in its own accent. Where ScreensShowcase goes
 * deep on a single product (every screen it has), this goes wide across the
 * whole studio, proof that the range is real rather than one demo reused.
 */
export function ThemesShowcase() {
  const [hovered, setHovered] = useState<number | null>(null)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <>
      <div className="sm:hidden">
        <Reveal>
          <AutoplayThemePhone />
        </Reveal>
      </div>

      <div className="mx-auto hidden max-w-none grid-cols-2 gap-x-8 gap-y-14 sm:grid lg:grid-cols-5 lg:gap-x-6">
        {CONCEPTS.map((concept, i) => {
          const Screen = CONCEPT_SCREENS[concept.slug]?.[0]
          const isHovered = hovered === i
          if (!Screen) return null
          return (
            <Reveal key={concept.slug} delay={i * 0.08}>
              <Link to={`/work/${concept.slug}`} className="mx-auto flex w-full max-w-[220px] flex-col items-center no-underline">
                <motion.div
                  className="w-full"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  animate={reduced ? undefined : { y: [0, -6, 0] }}
                  transition={
                    reduced
                      ? undefined
                      : {
                          duration: FLOAT_DURATIONS[i % FLOAT_DURATIONS.length],
                          delay: FLOAT_DELAYS[i % FLOAT_DELAYS.length],
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }
                  }
                >
                  <div
                    className="mx-auto rounded-[2.75rem]"
                    style={{
                      width: 200,
                      transform: isHovered && !reduced ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                      transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 420ms ease',
                      boxShadow: isHovered
                        ? '0 26px 36px rgba(0,0,0,0.30)'
                        : '0 14px 22px rgba(0,0,0,0.16)',
                    }}
                  >
                    <PhoneNavProvider index={0} count={CONCEPT_SCREENS[concept.slug].length} onGo={() => {}}>
                      <IPhoneMockup size="sm" label={`${concept.name} · ${concept.screens[0]}`}>
                        <Screen accent={concept.accent} />
                      </IPhoneMockup>
                    </PhoneNavProvider>
                  </div>
                </motion.div>
                <p className="mt-4 text-center text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
                  {concept.category}
                </p>
                <p className="mt-1 text-center font-sans text-sm font-bold text-[var(--ink)]">{concept.name}</p>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </>
  )
}
