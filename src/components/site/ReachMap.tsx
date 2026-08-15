import { useEffect, useRef, useState } from 'react'
import { WORLD_COUNTRIES, WORLD_VIEWBOX } from './world-countries'
import type { WorldRegionId } from './world-countries'

/**
 * Natural Earth world map, drawn country by country, with the United States
 * and India carried in brand red — joined by a zig-zag corridor — and
 * everywhere else in grey.
 *
 * The geometry is generated ahead of time (see scripts/generate-world.mjs) so
 * no map library ships to the browser — this is a plain SVG of <path>s.
 *
 * Hover styling lives entirely in CSS, so pointing at a country never causes
 * a React render; the only state a pointer touches is the label.
 */

const REGIONS: Record<WorldRegionId, string> = {
  us: 'United States',
  canada: 'Canada & the North',
  latam: 'Latin America',
  europe: 'Europe & the UK',
  africa: 'Africa',
  mideast: 'Middle East',
  asia: 'Asia',
  oceania: 'Australia & the Pacific',
}

// The callout hangs in the open North Pacific — the only large empty area
// adjacent to the US — with a leader line dropping down the west coast onto
// the mainland. Both are in map space (the 900x460 viewBox).
const PIN = { x: 188, y: 150 }
const LABEL = { x: 26, y: 40 }
const LEAD_ELBOW = { x: 124, y: 68 }

// India's callout mirrors it, dropping into the open water below the
// subcontinent (India's own geometry spans x 615-683, y 161-240). The label
// block is kept left of Indonesia (starts at x 687) and Australia (x 720),
// and above the thin Antarctic coastline that runs the full width at y 309 —
// the type carries no halo of its own.
const PIN_IN = { x: 648, y: 197 }
const LEAD_ELBOW_IN = { x: 606, y: 260 }
const LABEL_IN = { x: 594, y: 282 }

// The route: a single arc from the US pin to the India pin, bowing north over
// the Atlantic and Europe the way a flight path does, rather than cutting
// straight across. It is drawn as a run of dots rather than as a stroke, so
// the connection can be shown travelling — each dot in turn flaring from red
// to white, west to east.
const ARC = {
  c1: { x: PIN.x + (PIN_IN.x - PIN.x) * 0.28, y: PIN.y - 96 },
  c2: { x: PIN.x + (PIN_IN.x - PIN.x) * 0.72, y: PIN_IN.y - 112 },
}

const ROUTE =
  `M ${PIN.x} ${PIN.y} ` +
  `C ${ARC.c1.x.toFixed(1)} ${ARC.c1.y.toFixed(1)}, ` +
  `${ARC.c2.x.toFixed(1)} ${ARC.c2.y.toFixed(1)}, ` +
  `${PIN_IN.x} ${PIN_IN.y}`

// The dots themselves, sampled off the same cubic so they sit exactly on the
// arc. The two ends are left off: the pins are already there.
const DOTS = (() => {
  const COUNT = 26
  const at = (t: number, a: number, b: number, c: number, d: number) => {
    const u = 1 - t
    return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d
  }

  return Array.from({ length: COUNT - 1 }, (_, i) => {
    const t = (i + 1) / COUNT
    return {
      x: at(t, PIN.x, ARC.c1.x, ARC.c2.x, PIN_IN.x),
      y: at(t, PIN.y, ARC.c1.y, ARC.c2.y, PIN_IN.y),
    }
  })
})()

type Hover = { name: string; region: WorldRegionId }

export function ReachMap({ className = '' }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const tip = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)
  const [shown, setShown] = useState(false)
  const [hover, setHover] = useState<Hover | null>(null)

  // the reveal is only armed once we know the client will run it, so
  // server-rendered output is never left hidden
  useEffect(() => {
    const el = wrap.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    setArmed(true)

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        setShown(true)
        io.disconnect()
      },
      { threshold: 0.15 },
    )
    io.observe(el)

    return () => io.disconnect()
  }, [])

  // The label follows the pointer, which keeps it clear of the country under
  // the cursor without any collision maths. Its position is written straight
  // to the node rather than held in state — a render per mousemove would mean
  // reconciling 176 paths sixty times a second for a label that moves 3px.
  const move = (event: React.PointerEvent<SVGPathElement>) => {
    const box = wrap.current?.getBoundingClientRect()
    const node = tip.current
    if (!box || !node) return
    const x = Math.min(Math.max(event.clientX - box.left, 44), box.width - 44)
    const y = Math.min(Math.max(event.clientY - box.top, 34), box.height)
    node.style.transform = `translate(${x}px, ${y}px)`
  }

  const enter = (event: React.PointerEvent<SVGPathElement>, country: Hover) => {
    move(event)
    setHover((cur) =>
      cur?.name === country.name
        ? cur
        : { name: country.name, region: country.region },
    )
  }

  return (
    <div ref={wrap} className={`relative w-full ${className}`}>
      <svg
        viewBox={WORLD_VIEWBOX}
        role="img"
        aria-label="World map with the United States, MegaCloudWorks' primary market, and India, where the studio builds, both highlighted in red and joined by a route line; every other country is shown in grey."
        className={`reach-map h-auto w-full ${armed ? 'reach-map--armed' : ''} ${
          shown ? 'reach-map--in' : ''
        }`}
      >
        <defs>
          <radialGradient id="reach-halo">
            {/* kept faint: at full strength it read as a pink smudge behind
                the continent rather than a glow coming off it */}
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.12" />
            <stop offset="65%" stopColor="var(--brand)" stopOpacity="0.03" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle
          cx={PIN.x}
          cy={PIN.y}
          r="124"
          fill="url(#reach-halo)"
          className="reach-halo"
        />

        <g className="reach-countries">
          {WORLD_COUNTRIES.map((country) => {
            // the two homes carry their own callout on the map, so pointing at
            // them must not raise a floating label repeating the name
            const isUs = country.region === 'us'
            const isIndia = country.name === 'India'
            const labelled = isUs || isIndia

            return (
              <path
                key={country.name}
                d={country.d}
                className={`reach-country ${isUs ? 'is-us' : ''} ${
                  isIndia ? 'is-india' : ''
                }`}
                onPointerEnter={labelled ? undefined : (e) => enter(e, country)}
                onPointerMove={labelled ? undefined : move}
                onPointerLeave={
                  labelled
                    ? undefined
                    : () =>
                        setHover((cur) =>
                          cur?.name === country.name ? null : cur,
                        )
                }
              />
            )
          })}
        </g>

        {/* the corridor between the two: a dotted arc that lays itself down
            once the pins have landed, then keeps a charge running along it —
            one dot at a time flaring from red to white, US → India */}
        <g className="reach-route" aria-hidden="true">
          <path
            className="reach-route__glow"
            d={ROUTE}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {DOTS.map((dot, i) => (
            <circle
              key={i}
              className="reach-dot"
              cx={dot.x.toFixed(1)}
              cy={dot.y.toFixed(1)}
              r="2.4"
              fill="var(--brand)"
              style={
                {
                  // two staggers off the same index: the dots settle west to
                  // east as the route is laid, then the charge runs the same
                  // way on a loop
                  '--lay': `${900 + i * 46}ms`,
                  '--run': `${i * 90}ms`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>

        {/* United States callout — the leader line draws itself in, then the
            wordmark rises under it */}
        <g
          className={`reach-pin ${hover && hover.region !== 'us' ? 'is-dim' : ''}`}
        >
          <path
            className="reach-lead"
            d={`M ${PIN.x} ${PIN.y} L ${LEAD_ELBOW.x} ${LEAD_ELBOW.y}`}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle
            className="reach-pip"
            cx={PIN.x}
            cy={PIN.y}
            r="4"
            fill="var(--brand)"
          />
          <circle
            className="reach-ring"
            cx={PIN.x}
            cy={PIN.y}
            r="10"
            fill="none"
            stroke="var(--brand)"
            strokeWidth="1.2"
          />
          <text
            className="reach-title"
            x={LABEL.x}
            y={LABEL.y}
            fill="var(--brand-strong)"
          >
            UNITED STATES
          </text>
          <text
            className="reach-sub"
            x={LABEL.x}
            y={LABEL.y + 19}
            fill="var(--ink-soft)"
          >
            PRIMARY MARKET
          </text>
        </g>

        {/* India callout — same construction, dropped into the Indian Ocean */}
        <g
          className={`reach-pin reach-pin--in ${
            hover && hover.region !== 'us' ? 'is-dim' : ''
          }`}
        >
          <path
            className="reach-lead"
            d={`M ${PIN_IN.x} ${PIN_IN.y} L ${LEAD_ELBOW_IN.x} ${LEAD_ELBOW_IN.y}`}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle
            className="reach-pip"
            cx={PIN_IN.x}
            cy={PIN_IN.y}
            r="4"
            fill="var(--brand)"
          />
          <circle
            className="reach-ring"
            cx={PIN_IN.x}
            cy={PIN_IN.y}
            r="10"
            fill="none"
            stroke="var(--brand)"
            strokeWidth="1.2"
          />
          <text
            className="reach-title"
            x={LABEL_IN.x}
            y={LABEL_IN.y}
            fill="var(--brand-strong)"
          >
            INDIA
          </text>
          <text
            className="reach-sub"
            x={LABEL_IN.x}
            y={LABEL_IN.y + 19}
            fill="var(--ink-soft)"
          >
            OUR STUDIO
          </text>
        </g>
      </svg>

      {/* country label — plain type, no card, so it reads as part of the map */}
      <div ref={tip} className={`reach-tip ${hover ? 'is-on' : ''}`}>
        <div aria-hidden="true" className="reach-tip__inner">
          <span className="reach-tip__name">{hover?.name ?? ''}</span>
          <span className="reach-tip__note">
            {hover ? REGIONS[hover.region] : ''}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ReachMap
