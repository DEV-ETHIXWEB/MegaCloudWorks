import type { Concept } from '#/lib/concepts'

/**
 * The figure behind a case study.
 *
 * Every concept page used to open on the same photograph of the same ridge,
 * re-tinted. Five products, one picture: the tint was doing all the work and
 * losing, because a reader arriving from the work index sees the same image
 * they just left. This draws each concept its own backdrop instead, built out
 * of the thing the product is actually about - a dispatch grid, a deck of
 * cards, a week of slots, a vital sign, a pipeline of light.
 *
 * All five are SVG on a tinted wash, animated in CSS with transform and
 * opacity only, and all five are decorative: `aria-hidden`, no text, nothing
 * the page depends on. They stop moving under `prefers-reduced-motion` and
 * still read as a composition standing still - which is the test for whether
 * the motion was decoration or a crutch.
 */
export function ConceptMotif({ c }: { c: Concept }) {
  return (
    <div
      aria-hidden="true"
      className="cmotif"
      data-motif={c.motif}
      style={
        {
          '--m-a': c.accent,
          '--m-a2': c.accent2,
          '--m-ink': c.accentInk,
          '--m-from': c.heroFrom,
          '--m-to': c.heroTo,
        } as React.CSSProperties
      }
    >
      <span className="cmotif__wash" />
      <Figure c={c} />
      {/* a single slow specular pass over the whole plate, so the figure is
          lit rather than printed */}
      <span className="cmotif__sheen" />
      {/* film grain, at a strength that reads on a large flat colour and
          disappears on a small one */}
      <span className="cmotif__grain" />
    </div>
  )
}

function Figure({ c }: { c: Concept }) {
  switch (c.motif) {
    case 'grid':
      return <GridFigure />
    case 'strata':
      return <StrataFigure />
    case 'week':
      return <WeekFigure />
    case 'pulse':
      return <PulseFigure />
    case 'rays':
      return <RaysFigure />
    default:
      return null
  }
}

/* ------------------------------------------------------------------ *
 * Fieldly - the dispatch grid
 *
 * A city block plan with four vans running their routes across it. The
 * lines are the streets; the dots are the day.
 * ------------------------------------------------------------------ */

function GridFigure() {
  const cols = [80, 200, 320, 440, 560, 680, 800, 920]
  const rows = [70, 160, 250, 340, 430, 520]

  return (
    <svg className="cmotif__svg" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">
      <g className="cmotif__streets">
        {cols.map((x) => (
          <line key={`c${x}`} x1={x} y1="0" x2={x} y2="560" />
        ))}
        {rows.map((y) => (
          <line key={`r${y}`} x1="0" y1={y} x2="1000" y2={y} />
        ))}
      </g>

      {/* the arterials: two streets that carry the accent */}
      <g className="cmotif__arterial">
        <line x1="0" y1="250" x2="1000" y2="250" />
        <line x1="440" y1="0" x2="440" y2="560" />
      </g>

      {/* four vans, each on its own leg, at its own pace */}
      <g className="cmotif__vans">
        {[
          { d: 'M0 160 H440 V430', dur: 17 },
          { d: 'M1000 340 H560 V70', dur: 21 },
          { d: 'M200 560 V250 H800', dur: 25 },
          { d: 'M920 0 V430 H320', dur: 19 },
        ].map((v, i) => (
          <g key={i}>
            <path className="cmotif__leg" d={v.d} />
            <circle className="cmotif__van" r="5">
              <animateMotion dur={`${v.dur}s`} repeatCount="indefinite" path={v.d} />
            </circle>
          </g>
        ))}
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * Stamp - the deck
 *
 * Loyalty cards fanned and drifting, with the ten holes of the top one
 * filling and clearing on a long loop.
 * ------------------------------------------------------------------ */

function StrataFigure() {
  const cards = [
    { x: 120, y: 300, r: -9, o: 0.1 },
    { x: 250, y: 250, r: -5, o: 0.14 },
    { x: 380, y: 205, r: -2, o: 0.2 },
    { x: 510, y: 170, r: 2, o: 0.3 },
    { x: 640, y: 145, r: 6, o: 0.46 },
  ]

  return (
    <svg className="cmotif__svg" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">
      <g className="cmotif__deck">
        {cards.map((card, i) => (
          <g
            key={i}
            className="cmotif__card"
            style={{ '--i': i, '--o': card.o } as React.CSSProperties}
            transform={`translate(${card.x} ${card.y}) rotate(${card.r})`}
          >
            <rect width="300" height="188" rx="22" />
            <g className="cmotif__holes">
              {Array.from({ length: 10 }).map((_, h) => (
                <circle
                  key={h}
                  cx={38 + (h % 5) * 56}
                  cy={72 + Math.floor(h / 5) * 62}
                  r="15"
                  style={{ '--h': h } as React.CSSProperties}
                />
              ))}
            </g>
          </g>
        ))}
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * Slate - the week
 *
 * Seven columns of slots. Most are free; a few book themselves and
 * release again, which is the whole product in one loop.
 * ------------------------------------------------------------------ */

function WeekFigure() {
  // deterministic rather than random: the same week every render, so the
  // server and the client agree and the composition is actually designed
  const booked = new Set([2, 5, 9, 13, 16, 22, 27, 31, 34, 40])

  return (
    <svg className="cmotif__svg" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">
      <g className="cmotif__week">
        {Array.from({ length: 7 }).map((_, col) =>
          Array.from({ length: 7 }).map((_, row) => {
            const i = col * 7 + row
            return (
              <rect
                key={i}
                className={booked.has(i) ? 'cmotif__slot is-booked' : 'cmotif__slot'}
                x={70 + col * 128}
                y={54 + row * 68}
                width="104"
                height="46"
                rx="12"
                style={{ '--i': i } as React.CSSProperties}
              />
            )
          }),
        )}
      </g>

      {/* the day being read: a column rule that walks the week */}
      <rect className="cmotif__cursor" x="62" y="34" width="120" height="490" rx="18" />
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * Prophy - the vital
 *
 * Concentric recall rings and one slow trace. Nothing here jumps: it is
 * the only motif that moves at the speed of a waiting room.
 * ------------------------------------------------------------------ */

function PulseFigure() {
  return (
    <svg className="cmotif__svg" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">
      <g className="cmotif__rings">
        {[90, 160, 230, 300, 370, 440].map((r, i) => (
          <circle
            key={r}
            cx="760"
            cy="280"
            r={r}
            style={{ '--i': i } as React.CSSProperties}
          />
        ))}
      </g>

      <path
        className="cmotif__trace"
        d="M-20 300 H180 l26 -74 22 148 30 -186 26 112 h58 l24 -46 22 46 H620 l30 -60 26 60 H1020"
      />

      <g className="cmotif__teeth">
        {Array.from({ length: 14 }).map((_, i) => (
          <rect
            key={i}
            x={70 + i * 46}
            y="440"
            width="30"
            height="38"
            rx="11"
            style={{ '--i': i } as React.CSSProperties}
          />
        ))}
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * Leadr - the pipeline
 *
 * Stage columns under a rake of light, with deals travelling left to
 * right and one of them going quiet.
 * ------------------------------------------------------------------ */

function RaysFigure() {
  return (
    <svg className="cmotif__svg" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">
      <g className="cmotif__rays">
        {[-28, -16, -4, 8, 20, 32, 44].map((a, i) => (
          <rect
            key={a}
            x="-260"
            y={-40 + i * 96}
            width="1600"
            height="34"
            transform={`rotate(${a} 500 280)`}
            style={{ '--i': i } as React.CSSProperties}
          />
        ))}
      </g>

      <g className="cmotif__stages">
        {[110, 300, 490, 680, 870].map((x, i) => (
          <g key={x} style={{ '--i': i } as React.CSSProperties}>
            <rect className="cmotif__stage" x={x} y="120" width="150" height="330" rx="22" />
            {[0, 1, 2].map((d) => (
              <rect
                key={d}
                className="cmotif__deal"
                x={x + 18}
                y={152 + d * 76}
                width="114"
                height="56"
                rx="14"
                style={{ '--d': d } as React.CSSProperties}
              />
            ))}
          </g>
        ))}
      </g>
    </svg>
  )
}

export default ConceptMotif
