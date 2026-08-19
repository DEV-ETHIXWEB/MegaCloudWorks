import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { Reveal } from './Reveal'
import { IPhoneMockup } from './IPhoneMockup'
import { AppLoadingScreen } from './AppLoadingScreen'
import { HandHoldingPhone } from './HandHoldingPhone'
import { TextGenerateEffect } from './TextGenerateEffect'
import type { Concept } from '../content/concepts'

// The concept's real, tappable screens — deferred behind their own chunk so
// this section's first paint (the loading splash) never waits on the
// ~1600-line phone-UI library. See AppLaunchPhoneLive.tsx.
const AppLaunchPhoneLive = lazy(() =>
  import('./AppLaunchPhoneLive').then((m) => ({ default: m.AppLaunchPhoneLive })),
)

/**
 * The product moment: a phone that actually starts up. A loading splash
 * plays first, then crossfades into the concept's real first screen — live
 * and tappable, not a picture of one. Laid out left (phone, held) / right
 * (copy) on a dark band of its own, rather than centered on the page's
 * usual paper background, so it reads as its own distinct moment.
 */
export function AppLaunchPhone({ concept }: { concept: Concept }) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'center center'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [6, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1])

  const [live, setLive] = useState(false)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = setTimeout(() => setLive(true), reduced ? 0 : 2400)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      ref={sectionRef}
      data-header-tone="dark"
      className="relative isolate overflow-hidden bg-[var(--near-black)] px-[var(--edge)] py-24 text-white sm:py-32"
    >
      <div
        className="pointer-events-none absolute left-[8%] top-1/2 -z-10 size-[30rem] -translate-y-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ background: `radial-gradient(circle, ${concept.accent}, transparent 70%)` }}
      />
      <div className="grain-overlay" aria-hidden="true" />

      <div className="mx-auto grid max-w-[var(--container-wide)] items-center gap-14 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-20">
        {/* phone, held — left on desktop, first on mobile */}
        <Reveal className="mx-auto w-full max-w-[220px] lg:mx-0">
          <motion.div className="relative" style={{ rotateX: rotate, scale, transformPerspective: 1000 }}>
            <IPhoneMockup size="lg" label={`${concept.name} — ${live ? 'live' : 'launching'}`}>
              <AnimatePresence mode="wait">
                {live ? (
                  <motion.div
                    key="live"
                    className="h-full w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Suspense fallback={<AppLoadingScreen accent={concept.accent} />}>
                      <AppLaunchPhoneLive concept={concept} />
                    </Suspense>
                  </motion.div>
                ) : (
                  <motion.div
                    key="loading"
                    className="h-full w-full"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <AppLoadingScreen accent={concept.accent} />
                  </motion.div>
                )}
              </AnimatePresence>
            </IPhoneMockup>
            <HandHoldingPhone />
          </motion.div>
        </Reveal>

        {/* copy — right on desktop, centered under the phone on mobile */}
        <Reveal delay={0.15} className="text-center lg:text-left">
          <p className="kicker justify-center lg:justify-start" data-n="02" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Product experience
          </p>
          <h2 className="mt-4 font-sans text-[length:var(--fs-h2)] font-extrabold leading-[0.98] tracking-[var(--tracking-tight)] text-white">
            Every app starts <span style={{ color: concept.accent }}>here.</span>
          </h2>
          <TextGenerateEffect
            words="A real MegaCloudWorks build, launching — not a screenshot."
            className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/60 sm:text-lg lg:mx-0"
          />
        </Reveal>
      </div>
    </section>
  )
}
