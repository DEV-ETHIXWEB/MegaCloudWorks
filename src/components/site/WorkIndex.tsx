import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { CONCEPT_PREVIEWS } from '#/components/site/ConceptPreviews'
import { CONCEPTS } from '#/lib/concepts'
import type { Concept } from '#/lib/concepts'

/**
 * The Work index.
 *
 * The old page was five cards in a bento grid: every concept got the same
 * postage-stamp of attention and the grid did the talking. This reads as an
 * index instead — the five names are the page, set large, and whichever one
 * the reader is on takes over a stage beside them. One thing is in focus at a
 * time; the other four sit back, dimmed and slightly out of focus, exactly the
 * way the About page treats copy that hasn't arrived yet.
 *
 * The active concept is driven by three things, in this order of precedence:
 * pointer (hover), keyboard (focus), and scroll position — so it works the
 * same whether you are mousing, tabbing, or thumbing down a phone.
 */
export function WorkIndex() {
  const [active, setActive] = useState(0)
  const rows = useRef<Array<HTMLElement | null>>([])

  // Scroll hands the stage over as each row crosses the middle of the screen.
  //
  // The band is cut out of the viewport with negative margins — a row is
  // "current" only while it straddles the centre line — so this reports on
  // crossings rather than on every scroll frame, and a hover chosen in between
  // two crossings keeps the stage until the reader moves on.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => {
        // the stage only exists beside the list from lg up; below that every
        // row carries its own plate and there is nothing to sync
        if (window.innerWidth < 1024) return

        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const i = rows.current.indexOf(e.target as HTMLElement)
          if (i < 0) return
          setActive((cur) => (cur === i ? cur : i))
        })
      },
      { rootMargin: '-46% 0px -46% 0px' },
    )

    rows.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="work-index">
      {/* ---- the stage: one plate at a time, the rest held behind it ---- */}
      {/* sticky rather than fixed, so it releases the moment the list ends */}
      {/* the outer column stretches the full height of the list; the inner
          block is the part that actually sticks (a sticky element as tall as
          its own container has nowhere to travel) */}
      <div className="work-stage hidden lg:block">
        <div className="work-stage__inner">
          <div className="work-stage__frame">
            {CONCEPTS.map((c, i) => (
              <div key={c.slug} className="work-stage__slot">
                <ConceptPlate concept={c} index={i} active={i === active} />
              </div>
            ))}
          </div>

          <p className="work-stage__foot">
            <span aria-hidden="true" className="work-stage__tick" />
            {String(active + 1).padStart(2, '0')} /{' '}
            {String(CONCEPTS.length).padStart(2, '0')}
            <span className="work-stage__label">
              {CONCEPTS[active].category}
            </span>
          </p>
        </div>
      </div>

      {/* ---- the list ---- */}
      <ol className="work-rows">
        {CONCEPTS.map((c, i) => (
          <li
            key={c.slug}
            ref={(el) => {
              rows.current[i] = el
            }}
            /* the row wipes upward rather than fading: the name stays sharp
               the whole way, so it reads as printing rather than appearing */
            data-reveal="mask"
            className="work-rows__item"
          >
            <Link
              to="/work/$slug"
              params={{ slug: c.slug }}
              className="work-row"
              data-active={i === active ? '' : undefined}
              style={{ '--accent': c.accent } as React.CSSProperties}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span aria-hidden="true" className="work-row__glow" />

              <span className="work-row__n">
                {String(i + 1).padStart(2, '0')}
              </span>

              <span className="work-row__body">
                <span className="work-row__name">{c.name}</span>
                <span className="work-row__tag">{c.tagline}</span>
                <span className="work-row__meta">
                  {c.category}
                  <span aria-hidden="true" className="work-row__dot" />
                  {c.platform}
                  <span aria-hidden="true" className="work-row__dot" />
                  {c.timeline}
                </span>
              </span>

              <span className="work-row__go">
                <span className="work-row__go-label">Concept</span>
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>

            {/* below lg there is no stage, so the plate rides with its row */}
            <div className="mt-5 lg:hidden">
              <ConceptPlate concept={c} index={i} active />
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/**
 * A concept, shown whole: its own colour, its screens, its palette, and the
 * low-fidelity product snapshot where one exists. Everything on it comes off
 * the concept record, so all five look like themselves rather than like five
 * repaints of one card.
 */
function ConceptPlate({
  concept: c,
  index,
  active,
}: {
  concept: Concept
  index: number
  active: boolean
}) {
  const Preview = CONCEPT_PREVIEWS[c.slug]

  return (
    <article
      className="work-plate"
      data-active={active ? '' : undefined}
      aria-hidden={active ? undefined : true}
      style={{ '--accent': c.accent } as React.CSSProperties}
    >
      <span aria-hidden="true" className="work-plate__grain" />
      <span aria-hidden="true" className="work-plate__ghost">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="work-plate__inner">
        <header className="flex items-start justify-between gap-4">
          <p className="work-plate__eyebrow">
            {c.category}
            <span aria-hidden="true" className="work-plate__rule" />
          </p>
          <p className="work-plate__index">
            {String(index + 1).padStart(2, '0')}
          </p>
        </header>

        <h3 className="work-plate__name font-display">{c.name}</h3>
        <p className="work-plate__tag">{c.tagline}</p>

        <div className="work-plate__screens">
          {c.screens.map((s, i) => (
            <span
              key={s}
              className="work-plate__screen"
              style={{ '--i': i } as React.CSSProperties}
            >
              {s}
            </span>
          ))}
        </div>

        {Preview ? (
          <div className="work-plate__preview">
            <Preview />
          </div>
        ) : null}

        <footer className="work-plate__foot">
          <span className="work-plate__swatches">
            {c.palette.map((p) => (
              <span
                key={p.hex}
                title={`${p.name} ${p.hex}`}
                className="work-plate__swatch"
                style={{ background: p.swatch }}
              />
            ))}
          </span>
          <span className="work-plate__type">
            {c.typeface}
            <span aria-hidden="true" className="work-plate__dot" />
            {c.year}
          </span>
        </footer>
      </div>
    </article>
  )
}

export default WorkIndex
