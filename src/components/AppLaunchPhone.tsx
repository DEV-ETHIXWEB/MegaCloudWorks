import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Reveal } from './Reveal'
import { IPhoneMockup } from './IPhoneMockup'
import { AppLoadingScreen } from './AppLoadingScreen'
import type { Concept } from '../content/concepts'

/**
 * The product moment used to live beside the hero headline. It now surfaces
 * on its own, centered, once a visitor actually scrolls to it — same
 * scroll-triggered Reveal every other section uses for the copy above it,
 * showing the phone mid-launch (an app-loading splash, not a static
 * screenshot) rather than a screen that's already loaded.
 *
 * The phone itself also settles in with a light scroll-tied tilt — the same
 * idea as Aceternity's container-scroll-animation (rotateX + scale tied to
 * scroll progress), turned way down: a couple of degrees and a hair of
 * scale, not a full perspective flip, so it reads as a subtle settle rather
 * than a set piece.
 */
export function AppLaunchPhone({ concept }: { concept: Concept }) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'center center'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [6, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1])

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden px-[var(--edge)] py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[110px]" style={{ background: `radial-gradient(circle, ${concept.accent}, transparent 70%)` }} />
      <div className="mx-auto flex max-w-[var(--container-wide)] flex-col items-center text-center">
        <Reveal>
          <p className="kicker justify-center" data-n="02">
            Product experience
          </p>
          <h2 className="mt-4 font-sans text-[length:var(--fs-h2)] font-extrabold leading-[0.98] tracking-[var(--tracking-tight)] text-[var(--ink)]">
            Every app starts <span className="text-[var(--brand)]">here.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
            A real MegaCloudWorks build, launching — not a screenshot.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-12 w-full">
          <motion.div
            className="relative mx-auto w-full max-w-[260px]"
            style={{ rotateX: rotate, scale, transformPerspective: 1000 }}
          >
            <IPhoneMockup size="lg" label={`${concept.name} — launching`}>
              <AppLoadingScreen accent={concept.accent} />
            </IPhoneMockup>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}
