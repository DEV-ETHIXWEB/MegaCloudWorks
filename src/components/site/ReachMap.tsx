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

// The route: a stepped bolt from the US pin to the India pin, zig-zagging
// about the straight line between them rather than arcing over it — a single
// cut, so it reads as a deliberate corridor and not a scribble.
// Built once here so the geometry stays honest if either pin moves.
const ROUTE = (() => {
  const dx = PIN_IN.x - PIN.x
  const dy = PIN_IN.y - PIN.y
  const len = Math.hypot(dx, dy)
  // unit normal to the run — the zig-zag swings along this, not along y, so
  // the steps stay square to the route however the pins are placed
  const nx = -dy / len
  const ny = dx / len
  // two legs, so the bolt cuts exactly once between the two pins
  const STEPS = 2
  const AMP = 34

  const points = [`M ${PIN.x} ${PIN.y}`]
  for (let i = 1; i < STEPS; i += 1) {
    const t = i / STEPS
    const swing = (i % 2 === 1 ? 1 : -1) * AMP
    const x = PIN.x + dx * t + nx * swing
    const y = PIN.y + dy * t + ny * swing
    points.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  points.push(`L ${PIN_IN.x} ${PIN_IN.y}`)
  return points.join(' ')
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

        {/* the corridor between the two: a stepped bolt that draws itself in
            once the pins have landed, then keeps a charge running along it */}
        <g className="reach-route" aria-hidden="true">
          <path
            className="reach-route__glow"
            d={ROUTE}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="reach-route__line"
            d={ROUTE}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="reach-route__pulse"
            d={ROUTE}
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
