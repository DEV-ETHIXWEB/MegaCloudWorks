import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { IPhoneMockup } from './IPhoneMockup'
import { ScreensShowcase } from './ScreensShowcase'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import { PhoneNavProvider } from '../lib/phoneUI'
import { CONCEPT_SCREENS } from '../lib/conceptScreens'
import type { Concept } from '../content/concepts'

/**
 * Everything on the homepage that needs the ~1600-line interactive phone-UI
 * library, bundled behind one React.lazy boundary (see Home.tsx) so that
 * library only downloads once a visitor actually scrolls this far, instead
 * of shipping in the homepage's initial bundle.
 */

export function HeroPhone({ concept }: { concept: Concept }) {
  const Screen = CONCEPT_SCREENS[concept.slug][0]
  return (
    <div className="relative mx-auto w-full max-w-[230px] sm:max-w-[260px]">
      <div
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-40 blur-3xl"
        style={{ background: `radial-gradient(circle, ${concept.accent}, transparent 70%)` }}
      />
      <PhoneNavProvider index={0} count={CONCEPT_SCREENS[concept.slug].length} onGo={() => {}}>
        <IPhoneMockup size="md" label={`${concept.name} — a real MegaCloudWorks concept`}>
          <Screen accent={concept.accent} />
        </IPhoneMockup>
      </PhoneNavProvider>
      <Link
        to={`/work/${concept.slug}`}
        className="edge-hard absolute -bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-bold text-[var(--ink)] no-underline"
      >
        A real product, built by us <ArrowUpRight size={13} />
      </Link>
    </div>
  )
}

export function ProductExperienceSection({ concept }: { concept: Concept }) {
  return (
    <section
      data-header-tone="dark"
      className="on-brand relative overflow-hidden bg-[var(--brand)] px-[var(--edge)] py-24 text-white sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="relative mx-auto max-w-[var(--container-wide)]">
        <SectionHeading
          n="03"
          kicker="Product experience"
          title="We don't just design apps. We build them."
          sub={`${concept.name} — ${concept.blurb}`}
          light
        />
        <div className="mt-16">
          <ScreensShowcase concept={concept} />
        </div>
        <Reveal delay={0.2} className="mt-14 text-center">
          <Link
            to={`/work/${concept.slug}`}
            className="edge-hard inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[var(--brand-text)] no-underline"
          >
            See the full case study <ArrowRight size={15} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
