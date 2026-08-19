import { useState } from 'react'
import { Reveal } from './Reveal'
import { IPhoneMockup } from './IPhoneMockup'
import { PhoneNavProvider } from '../lib/phoneUI'
import { CONCEPT_SCREENS } from '../lib/conceptScreens'
import type { Concept } from '../content/concepts'

/**
 * All four of a concept's screens, live and tappable, side by side.
 * Every phone runs its own PhoneNavProvider so tapping something in one
 * screen (open a job, claim a reward) navigates within that phone alone —
 * an asymmetric stagger keeps four identical-width devices from reading as
 * a flat, boring grid.
 */
export function ScreensShowcase({ concept }: { concept: Concept }) {
  const screens = CONCEPT_SCREENS[concept.slug] ?? []
  const [indices, setIndices] = useState<number[]>(screens.map((_, i) => i))

  // a gentle wave, not a staircase — no card sits more than 24px off the
  // others' baseline, so all four stay comfortably inside the same viewport
  const lift = ['lg:mt-0', 'lg:mt-6', 'lg:mt-0', 'lg:mt-6']

  return (
    <div className="mx-auto grid max-w-xs grid-cols-1 gap-x-8 gap-y-14 sm:max-w-none sm:grid-cols-2 lg:max-w-none lg:grid-cols-4 lg:gap-x-6">
      {screens.map((_, i) => {
        const Active = screens[indices[i]]
        return (
          <Reveal key={concept.screens[i]} delay={i * 0.08} className={lift[i % lift.length]}>
            <div className="mx-auto flex w-full max-w-[220px] flex-col items-center lg:max-w-none">
              <PhoneNavProvider
                index={indices[i]}
                count={screens.length}
                onGo={(next) => setIndices((cur) => cur.map((v, j) => (j === i ? next : v)))}
              >
                <IPhoneMockup size="sm" label={`${concept.name} — ${concept.screens[indices[i]]}`}>
                  <Active accent={concept.accent} />
                </IPhoneMockup>
              </PhoneNavProvider>
              <p className="mt-4 text-center text-xs font-bold uppercase tracking-wide" style={{ color: concept.accentText }}>
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
