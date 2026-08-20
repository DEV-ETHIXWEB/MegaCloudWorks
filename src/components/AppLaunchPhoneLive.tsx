import { useState } from 'react'
import { PhoneNavProvider } from '../lib/phoneUI'
import { CONCEPT_SCREENS } from '../lib/conceptScreens'
import { HomeHeroScreen } from './HomeHeroScreen'
import type { Concept } from '../content/concepts'

/**
 * The concept's real screens, genuinely tappable, split into its own
 * lazy chunk (see AppLaunchPhone.tsx) so the ~1600-line phone-UI library
 * only downloads once the loading splash has actually finished, not as
 * part of the homepage's own bundle.
 *
 * `home` swaps in MegaCloudWorks' own light home screen instead of the
 * concept's real first screen: the homepage phone is a MegaCloudWorks
 * product moment, not a shortcut into one of the five work concepts.
 */
export function AppLaunchPhoneLive({ concept, home = false }: { concept: Concept; home?: boolean }) {
  const screens = CONCEPT_SCREENS[concept.slug]
  const [index, setIndex] = useState(0)
  const Screen = screens[index]

  if (home) {
    return (
      <PhoneNavProvider index={0} count={1} onGo={() => {}}>
        <HomeHeroScreen />
      </PhoneNavProvider>
    )
  }

  return (
    <PhoneNavProvider index={index} count={screens.length} onGo={setIndex}>
      <Screen accent={concept.accent} />
    </PhoneNavProvider>
  )
}
