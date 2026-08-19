import { useState } from 'react'
import { PhoneNavProvider } from '../lib/phoneUI'
import { CONCEPT_SCREENS } from '../lib/conceptScreens'
import type { Concept } from '../content/concepts'

/**
 * The concept's real screens, genuinely tappable — split into its own
 * lazy chunk (see AppLaunchPhone.tsx) so the ~1600-line phone-UI library
 * only downloads once the loading splash has actually finished, not as
 * part of the homepage's own bundle.
 */
export function AppLaunchPhoneLive({ concept }: { concept: Concept }) {
  const screens = CONCEPT_SCREENS[concept.slug]
  const [index, setIndex] = useState(0)
  const Screen = screens[index]

  return (
    <PhoneNavProvider index={index} count={screens.length} onGo={setIndex}>
      <Screen accent={concept.accent} />
    </PhoneNavProvider>
  )
}
