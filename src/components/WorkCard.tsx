import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from './Reveal'
import { CardSpotlight } from './CardSpotlight'
import { CodeScreenPeek } from './CodeScreenPeek'
import type { Concept } from '../content/concepts'

export function WorkCard({
  concept,
  delay = 0,
  bare = false,
}: {
  concept: Concept
  delay?: number
  /** omit the card's own surface-lift shadow/border, for when a caller
   * (e.g. WobbleCard) already supplies the surface, so the two don't stack */
  bare?: boolean
}) {
  return (
    <Reveal delay={delay}>
      <Link
        to={`/work/${concept.slug}`}
        className={`${bare ? '' : 'surface-lift '}group block h-full overflow-hidden no-underline`}
      >
        <CardSpotlight color="rgba(255,255,255,0.16)" radius={220}>
          <div
            className="relative flex aspect-[4/3] items-end overflow-hidden rounded-t-[inherit] p-6"
            style={{
              background: `linear-gradient(150deg, ${concept.heroFrom}, ${concept.heroTo})`,
            }}
          >
            <span
              className="absolute right-5 top-5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
              style={{ background: concept.accent, color: concept.accentInk }}
            >
              {concept.category}
            </span>
            <div
              className="absolute -bottom-10 -right-10 size-40 rounded-full opacity-30 blur-2xl transition-transform duration-700 group-hover:scale-125"
              style={{ background: concept.accent }}
            />
            {/* same code-screen peek as the homepage's featured cards, so
                every appearance of a concept card reads as one consistent
                treatment rather than two different designs */}
            <CodeScreenPeek
              accent={concept.accent}
              slug={concept.slug}
              className="absolute -bottom-4 -right-4 h-[78%] w-[46%] max-w-[180px] rotate-[4deg] transition-transform duration-700 group-hover:-translate-y-2 group-hover:rotate-[2deg]"
            />
            <h3 className="relative max-w-[58%] font-sans text-4xl font-extrabold leading-[0.95] tracking-tight text-white">
              {concept.name}
            </h3>
          </div>
        </CardSpotlight>
        <div className="flex items-start justify-between gap-4 p-6">
          <div>
            <p className="font-semibold text-[var(--ink)]">{concept.tagline}</p>
            <p className="mt-1 text-sm text-[var(--ink-faint)]">
              {concept.platform} · {concept.timeline}
            </p>
          </div>
          <ArrowUpRight
            className="mt-1 shrink-0 text-[var(--ink-faint)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--brand)]"
            size={20}
          />
        </div>
      </Link>
    </Reveal>
  )
}
