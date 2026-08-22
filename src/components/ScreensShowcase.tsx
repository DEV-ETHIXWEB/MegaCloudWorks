import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Reveal } from './Reveal'
import { IPhoneMockup } from './IPhoneMockup'
import { PhoneNavProvider } from '../lib/phoneUI'
import { CONCEPT_SCREENS } from '../lib/conceptScreens'
import type { Concept } from '../content/concepts'

// Each phone drifts on its own slow, slightly offset loop so the four never
// move in lockstep: barely perceptible, a float rather than a bounce. Same
// idiom as ServiceCircles so the site has one floating language, not two.
const FLOAT_DURATIONS = [7.2, 8.4, 7.8, 8.9]
const FLOAT_DELAYS = [0, 0.7, 1.4, 0.35]

const AUTOPLAY_MS = 3200

/**
 * The mobile case: four full-size stacked phones read as a wall of near-
 * identical devices on a narrow screen, and a visitor has to scroll past
 * three of them to see the fourth. One phone that loops through all four
 * screens on its own says the same thing in a tenth of the scroll — tap to
 * take over is still there, it just isn't required.
 */
function AutoplayPhone({ concept }: { concept: Concept }) {
  const screens = CONCEPT_SCREENS[concept.slug] ?? []
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced || paused || screens.length < 2) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % screens.length), AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [reduced, paused, screens.length])

  const Active = screens[index]
  if (!Active) return null

  return (
    <div className="mx-auto flex w-full max-w-[220px] flex-col items-center">
      <div
        // a tap on the phone hands control to the visitor: pause the
        // autoplay so their own navigation isn't yanked away mid-read
        onPointerDown={() => setPaused(true)}
        className="w-full"
        style={{ filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.16))' }}
      >
        <PhoneNavProvider index={index} count={screens.length} onGo={setIndex}>
          <IPhoneMockup size="sm" label={`${concept.name} · ${concept.screens[index]}, screen ${index + 1} of ${screens.length}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
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
      </div>

      <p className="mt-4 text-center text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
        Screen {String(index + 1).padStart(2, '0')} of {String(screens.length).padStart(2, '0')}
      </p>
      <p className="mt-1 text-center font-sans text-sm font-bold text-[var(--ink)]">{concept.screens[index]}</p>

      {/* progress dots double as manual controls: tapping one both jumps
          the phone and pauses the loop, same as tapping the phone itself */}
      <div className="mt-3 flex items-center gap-1.5">
        {screens.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show screen ${i + 1}`}
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
 * All four of a concept's screens, live and tappable, side by side on
 * tablet/desktop. On mobile a single autoplaying phone takes over instead
 * (see AutoplayPhone above) — both read from the same PhoneNavProvider,
 * live-tappable phone underneath, just a different presentation per
 * viewport.
 */
export function ScreensShowcase({ concept }: { concept: Concept }) {
  const screens = CONCEPT_SCREENS[concept.slug] ?? []
  const [indices, setIndices] = useState<number[]>(screens.map((_, i) => i))
  const [hovered, setHovered] = useState<number | null>(null)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // a gentle wave, not a staircase: no card sits more than 24px off the
  // others' baseline, so all screens stay comfortably inside the same viewport
  const lift = ['lg:mt-0', 'lg:mt-6', 'lg:mt-0', 'lg:mt-6', 'lg:mt-6', 'lg:mt-0']

  // grid columns follow the concept's own screen count (most have four; a
  // concept with five gets a fifth column rather than wrapping one card
  // onto its own lonely row)
  const lgCols = screens.length >= 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'

  return (
    <>
      <div className="sm:hidden">
        <Reveal>
          <AutoplayPhone concept={concept} />
        </Reveal>
      </div>

      <div className={`mx-auto hidden max-w-xs grid-cols-1 gap-x-8 gap-y-14 sm:grid sm:max-w-none sm:grid-cols-2 lg:max-w-none ${lgCols} lg:gap-x-6`}>
        {screens.map((_, i) => {
          const Active = screens[indices[i]]
          const isHovered = hovered === i
          return (
            <Reveal key={concept.screens[i]} delay={i * 0.08} className={lift[i % lift.length]}>
              <div className="mx-auto flex w-full max-w-[220px] flex-col items-center">
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
                  {/* the hover lift rides on its own wrapper so it composes with
                      the idle float above instead of fighting it for the
                      transform channel */}
                  <div
                    style={{
                      transform: isHovered && !reduced ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                      transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), filter 420ms ease',
                      filter: isHovered
                        ? 'drop-shadow(0 26px 36px rgba(0,0,0,0.30))'
                        : 'drop-shadow(0 14px 22px rgba(0,0,0,0.16))',
                    }}
                  >
                    <PhoneNavProvider
                      index={indices[i]}
                      count={screens.length}
                      onGo={(next) => setIndices((cur) => cur.map((v, j) => (j === i ? next : v)))}
                    >
                      <IPhoneMockup size="sm" label={`${concept.name} · ${concept.screens[indices[i]]}`}>
                        <Active accent={concept.accent} />
                      </IPhoneMockup>
                    </PhoneNavProvider>
                  </div>
                </motion.div>
                {/* --ink-faint, not the concept's accentText: this showcase
                    runs both on the homepage's brand-red band and on a light
                    case-study page, and a mid-tone accent goes unreadable on
                    red. `.on-brand` already flips this token to white/66%, so
                    one value stays legible in both places. */}
                <p className="mt-4 text-center text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
                  Screen {String(i + 1).padStart(2, '0')}
                </p>
                <p className="mt-1 text-center font-sans text-sm font-bold text-[var(--ink)]">
                  {concept.screens[i]}
                </p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </>
  )
}
