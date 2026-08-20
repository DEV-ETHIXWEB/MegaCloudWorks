import { useEffect, useState } from 'react'
import { PhoneNavProvider } from '../lib/phoneUI'
import { CONCEPT_SCREENS } from '../lib/conceptScreens'
import { HOME_HERO_SCREENS } from './HomeHeroScreen'
import type { Concept } from '../content/concepts'

const AUTOPLAY_MS = 3600

/**
 * The concept's real screens, genuinely tappable, split into its own
 * lazy chunk (see AppLaunchPhone.tsx) so the ~1600-line phone-UI library
 * only downloads once the loading splash has actually finished, not as
 * part of the homepage's own bundle.
 *
 * `home` swaps in MegaCloudWorks' own light home app instead of the
 * concept's real first screen: the homepage phone is a MegaCloudWorks
 * product moment, not a shortcut into one of the five work concepts. Its
 * four screens (Home/Schedule/Jobs/Profile) autoplay in a loop on both
 * desktop and mobile until someone taps the phone, same idea as
 * ScreensShowcase's mobile autoplay.
 */
export function AppLaunchPhoneLive({ concept, home = false }: { concept: Concept; home?: boolean }) {
  const screens = home ? HOME_HERO_SCREENS : CONCEPT_SCREENS[concept.slug]
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const Screen = screens[index]

  useEffect(() => {
    if (!home) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || paused) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % screens.length), AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [home, paused, screens.length])

  const go = (next: number) => {
    if (home) setPaused(true)
    setIndex(next)
  }

  return (
    <div onPointerDown={home ? () => setPaused(true) : undefined} className="h-full w-full">
      <PhoneNavProvider index={index} count={screens.length} onGo={go}>
        <Screen accent={concept.accent} />
      </PhoneNavProvider>
    </div>
  )
}
