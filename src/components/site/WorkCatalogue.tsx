import { useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CONCEPTS } from '#/lib/concepts'
import { CONCEPT_SCREENS } from '#/lib/conceptScreens'
import { PhoneMockup } from '#/components/site/PhoneMockup'
import { PhoneNavProvider } from '#/lib/phoneUI'

/**
 * The catalogue - the Work page's index of concepts.
 *
 * A grid of five equal cards is the layout every studio site already has, and
 * it flattens five very different products into one shape. This is a printed
 * index instead: one line per concept, set large, with the catalogue code, the
 * sector and the year running alongside it the way a listing would.
 *
 * Two things happen on approach. The row floods with that concept's own colour
 * - which is the only place colour appears on this page, so the palette is
 * doing work rather than decorating - and its first screen comes up in a
 * device beside the list. Only the hovered concept's device is mounted: five
 * live phones would each be running a tilt loop for no reason.
 *
 * Everything is a real link, and the whole thing is keyboard-reachable - focus
 * drives exactly the same preview hover does.
 */
export function WorkCatalogue() {
  const [at, setAt] = useState<number | null>(null)
  const list = useRef<HTMLOListElement>(null)

  const active = at === null ? null : CONCEPTS[at]
  const screens = active ? (CONCEPT_SCREENS[active.slug] ?? []) : []
  const Preview = screens[0]

  return (
    <div className="catalogue" data-lit={at !== null ? '' : undefined}>
      <ol
        ref={list}
        className="catalogue__list"
        onMouseLeave={() => setAt(null)}
      >
        {CONCEPTS.map((c, i) => (
          <li key={c.slug} className="catalogue__item">
            <Link
              to="/work/$slug"
              params={{ slug: c.slug }}
              className="catalogue__row"
              data-on={at === i ? '' : undefined}
              style={{ '--row': c.accent } as React.CSSProperties}
              onMouseEnter={() => setAt(i)}
              onFocus={() => setAt(i)}
              onBlur={() => setAt(null)}
            >
              {/* the colour arrives as a wipe from the left edge, so the row
                  reads as being filled in rather than switched on */}
              <span aria-hidden="true" className="catalogue__wash" />

              <span className="catalogue__code">
                MCW&#8202;&ndash;&#8202;{String(i + 1).padStart(2, '0')}
              </span>

              <span className="catalogue__name">{c.name}</span>

              <span className="catalogue__meta">
                <span className="catalogue__sector">{c.category}</span>
                <span className="catalogue__flow">{c.flow}</span>
                <span className="catalogue__year">{c.year}</span>
              </span>

              {/* the tagline only exists while the row is live: at rest the
                  list is names and nothing else, which is the whole point */}
              <span className="catalogue__line">{c.tagline}</span>
            </Link>
          </li>
        ))}
      </ol>

      {/* the device sits in the column the list leaves empty */}
      <div className="catalogue__stage" aria-hidden="true">
        {active && Preview ? (
          <div key={active.slug} className="catalogue__device">
            <PhoneNavProvider index={0} count={screens.length} onGo={() => {}} inert>
              <PhoneMockup variant="mini" accent={active.accent} restY={-8}>
                <Preview c={active} />
              </PhoneMockup>
            </PhoneNavProvider>
            <p className="catalogue__caption">
              <span style={{ color: active.accent }}>&#9679;</span>{' '}
              {active.screens[0]} &middot; {active.platform}
            </p>
          </div>
        ) : (
          <p className="catalogue__hint">
            Point at a title to open it.
          </p>
        )}
      </div>
    </div>
  )
}

export default WorkCatalogue
