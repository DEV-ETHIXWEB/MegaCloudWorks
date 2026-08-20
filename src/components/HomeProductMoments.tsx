import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ScreensShowcase } from './ScreensShowcase'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import type { Concept } from '../content/concepts'

/**
 * The homepage's screens-showcase moment: needs the ~1600-line interactive
 * phone-UI library, bundled behind one React.lazy boundary (see Home.tsx) so
 * that library only downloads once a visitor actually scrolls this far,
 * instead of shipping in the homepage's initial bundle.
 */
export function ProductExperienceSection({ concept }: { concept: Concept }) {
  return (
    <section
      data-header-tone="dark"
      className="on-brand relative isolate overflow-hidden bg-[var(--brand)] px-[var(--edge)] py-24 text-white sm:py-32"
    >
      <div className="grain-overlay" aria-hidden="true" />
      <div className="relative mx-auto max-w-[var(--container-wide)]">
        <SectionHeading
          n="04"
          kicker="Product experience"
          title="We don't just design apps. We build them."
          sub={`${concept.name} · ${concept.blurb}`}
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
