import { useState } from 'react'
import { motion } from 'motion/react'
import { Reveal } from './Reveal'
import { IPhoneMockup } from './IPhoneMockup'
import { PhoneNavProvider } from '../lib/phoneUI'
import { CONCEPT_SCREENS } from '../lib/conceptScreens'
import type { Concept } from '../content/concepts'

// Each phone drifts on its own slow, slightly offset loop so the four never
// move in lockstep — barely perceptible, a float rather than a bounce. Same
// idiom as ServiceCircles so the site has one floating language, not two.
const FLOAT_DURATIONS = [7.2, 8.4, 7.8, 8.9]
const FLOAT_DELAYS = [0, 0.7, 1.4, 0.35]

/**
 * All four of a concept's screens, live and tappable, side by side.
 * Every phone runs its own PhoneNavProvider so tapping something in one
 * screen (open a job, claim a reward) navigates within that phone alone —
 * an asymmetric stagger keeps four identical-width devices from reading as
 * a flat, boring grid, and a gentle idle float keeps them from sitting dead
 * on the page. Hovering one lifts it a little further out.
 */
export function ScreensShowcase({ concept }: { concept: Concept }) {
  const screens = CONCEPT_SCREENS[concept.slug] ?? []
  const [indices, setIndices] = useState<number[]>(screens.map((_, i) => i))
  const [hovered, setHovered] = useState<number | null>(null)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // a gentle wave, not a staircase — no card sits more than 24px off the
  // others' baseline, so all four stay comfortably inside the same viewport
  const lift = ['lg:mt-0', 'lg:mt-6', 'lg:mt-0', 'lg:mt-6']

  return (
    <div className="mx-auto grid max-w-xs grid-cols-1 gap-x-8 gap-y-14 sm:max-w-none sm:grid-cols-2 lg:max-w-none lg:grid-cols-4 lg:gap-x-6">
      {screens.map((_, i) => {
        const Active = screens[indices[i]]
        const isHovered = hovered === i
        return (
          <Reveal key={concept.screens[i]} delay={i * 0.08} className={lift[i % lift.length]}>
            <div className="mx-auto flex w-full max-w-[220px] flex-col items-center lg:max-w-none">
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
                    <IPhoneMockup size="sm" label={`${concept.name} — ${concept.screens[indices[i]]}`}>
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
  )
}
