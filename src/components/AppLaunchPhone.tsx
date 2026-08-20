import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { Reveal } from './Reveal'
import { IPhoneMockup } from './IPhoneMockup'
import { AppLoadingScreen } from './AppLoadingScreen'
import { TextGenerateEffect } from './TextGenerateEffect'
import type { Concept } from '../content/concepts'

// The concept's real, tappable screens, deferred behind their own chunk so
// this section's first paint (the loading splash) never waits on the
// ~1600-line phone-UI library. See AppLaunchPhoneLive.tsx.
const AppLaunchPhoneLive = lazy(() =>
  import('./AppLaunchPhoneLive').then((m) => ({ default: m.AppLaunchPhoneLive })),
)

/**
 * The product moment: a phone that actually starts up. A loading splash
 * plays first, then crossfades into the concept's real first screen: live
 * and tappable, not a picture of one. Laid out left (phone) / right (copy)
 * on the same paper background as the hero rather than a separate dark
 * band, so it reads as a continuation of the page instead of a jump.
 */
export function AppLaunchPhone({ concept, home = false }: { concept: Concept; home?: boolean }) {
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
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-[var(--paper)] px-[var(--edge)] py-16 sm:py-20">
      <div
        className="pointer-events-none absolute left-[10%] top-1/2 -z-10 size-[24rem] -translate-y-1/2 rounded-full opacity-20 blur-[110px]"
        style={{ background: `radial-gradient(circle, ${home ? '#f5333b' : concept.accent}, transparent 70%)` }}
      />

      {/* flex, not grid: a 1fr track let the copy's own max-w-md sit inside
          a much wider column than it filled, leaving a dead gap to its
          right. Flex sizes both children to their own content and centers
          the pair as one tight, balanced group instead. */}
      <div className="mx-auto flex max-w-[52rem] flex-col items-center gap-10 lg:flex-row lg:justify-center lg:gap-14">
        {/* phone: left on desktop, first on mobile */}
        <Reveal className="mx-auto w-full max-w-[190px] lg:mx-0 lg:shrink-0">
          <motion.div className="relative" style={{ rotateX: rotate, scale, transformPerspective: 1000 }}>
            <IPhoneMockup size="lg" label={`${home ? 'MegaCloudWorks' : concept.name} · ${live ? 'live' : 'launching'}`}>
              <AnimatePresence mode="wait">
                {live ? (
                  <motion.div
                    key="live"
                    className="h-full w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Suspense fallback={<AppLoadingScreen accent={home ? '#f5333b' : concept.accent} />}>
                      <AppLaunchPhoneLive concept={concept} home={home} />
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
                    <AppLoadingScreen accent={home ? '#f5333b' : concept.accent} />
                  </motion.div>
                )}
              </AnimatePresence>
            </IPhoneMockup>
          </motion.div>
        </Reveal>

        {/* copy: right on desktop, centered under the phone on mobile */}
        <Reveal delay={0.15} className="text-center lg:max-w-sm lg:text-left">
          <p className="kicker justify-center lg:justify-start" data-n="02">
            Product experience
          </p>
          <h2 className="mt-4 font-sans text-[length:var(--fs-h2)] font-extrabold leading-[0.98] tracking-[var(--tracking-tight)] text-[var(--ink)]">
            Every app starts <span className="text-[var(--brand)]">here.</span>
          </h2>
          <TextGenerateEffect
            words="A real MegaCloudWorks build, launching, not a screenshot."
            className="mx-auto mt-4 max-w-xs text-base leading-relaxed text-[var(--ink-soft)] sm:max-w-sm sm:text-lg lg:mx-0"
          />
        </Reveal>
      </div>
    </section>
  )
}
