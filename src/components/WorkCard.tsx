import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from './Reveal'
import type { Concept } from '../content/concepts'

export function WorkCard({
  concept,
  delay = 0,
  bare = false,
}: {
  concept: Concept
  delay?: number
  /** omit the card's own surface-lift shadow/border — for when a caller
   * (e.g. WobbleCard) already supplies the surface, so the two don't stack */
  bare?: boolean
}) {
  return (
    <Reveal delay={delay}>
      <Link
        to={`/work/${concept.slug}`}
        className={`${bare ? '' : 'surface-lift '}group block h-full overflow-hidden no-underline`}
      >
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
          <h3 className="relative font-sans text-3xl font-extrabold tracking-tight text-white">
            {concept.name}
          </h3>
        </div>
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
