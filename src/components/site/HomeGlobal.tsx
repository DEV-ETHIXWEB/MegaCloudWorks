import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { WORLD_COUNTRIES, WORLD_VIEWBOX } from './world-countries'

import './home-global.css'

/**
 * Where the offices are, in the map's own 900x460 space.
 *
 * `side` says which way the caption hangs off the dot, so labels never run
 * off the edge of the plate or sit on top of the arcs.
 */
const HUB = { x: 648, y: 197 }

const OFFICES = [
  { place: 'Canada', time: '9:30 AM', x: 196, y: 118, side: 'right' },
  { place: 'New York', time: '10:30 AM', x: 232, y: 168, side: 'right' },
  { place: 'Brazil', time: '11:30 AM', x: 296, y: 272, side: 'right' },
  { place: 'Europe', time: '4:30 PM', x: 462, y: 112, side: 'right' },
  { place: 'Japan', time: '12:30 AM', x: 772, y: 158, side: 'right' },
  { place: 'Australia', time: '2:30 AM', x: 762, y: 314, side: 'right' },
] as const

/** A flight path: an arc bowing away from the straight line between two pins. */
function arc(from: { x: number; y: number }, to: { x: number; y: number }) {
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2
  // the further apart, the deeper the bow
  const lift = Math.hypot(to.x - from.x, to.y - from.y) * 0.22
  return `M ${from.x} ${from.y} Q ${midX} ${midY - lift}, ${to.x} ${to.y}`
}

function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12h15M13.5 6.5 20 12l-6.5 5.5" />
    </svg>
  )
}

/** Plays the map in once it is actually on screen, and only once. */
function useShown<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        io.disconnect()
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return { ref, shown }
}

export function HomeGlobal() {
  const map = useShown<HTMLDivElement>()

  return (
    <section id="global" className="home-global">
      <div className="mx-auto max-w-[1360px] px-6 py-14 sm:px-10 lg:px-28 lg:py-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-12">
          {/* ---------- the claim ---------- */}
          <div>
            <p className="global-eyebrow">Global delivery</p>

            <h2 className="mt-5 font-display text-[clamp(1.9rem,3vw,2.9rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-white">
              We deliver all over the
              <br />
              world, <span className="text-[var(--brand)]">from India.</span>
            </h2>

            <p className="mt-5 max-w-md text-[1rem] leading-[1.6] text-white/65">
              One studio, one team, every time zone. We ship for clients across
              six continents without handing your project to anyone else.
            </p>

            <Link to="/about" className="global-cta mt-8">
              Meet our team
              <ArrowRight />
            </Link>
          </div>

          {/* ---------- and where they are ---------- */}
          <div
            ref={map.ref}
            data-shown={map.shown ? 'true' : 'false'}
            className="global-map"
          >
            <svg
              className="global-map__plate"
              viewBox={WORLD_VIEWBOX}
              aria-hidden="true"
            >
              <defs>
                {/* the land is not filled - it is perforated */}
                <pattern
                  id="global-dots"
                  width="4.2"
                  height="4.2"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1.1" cy="1.1" r="0.95" fill="#46464e" />
                </pattern>
              </defs>

              {WORLD_COUNTRIES.map((country) => (
                <path
                  key={country.name}
                  className="global-map__land"
                  d={country.d}
                />
              ))}

              {OFFICES.map((office, i) => (
                <path
                  key={office.place}
                  className="global-map__arc"
                  style={{ '--i': i } as React.CSSProperties}
                  pathLength={1}
                  d={arc(HUB, office)}
                />
              ))}
            </svg>

            {/* the pins, placed in percentages of the same 900x460 box */}
            {OFFICES.map((office, i) => (
              <div key={office.place}>
                <span
                  aria-hidden="true"
                  className="global-node"
                  style={
                    {
                      left: `${(office.x / 900) * 100}%`,
                      top: `${(office.y / 460) * 100}%`,
                      '--i': i,
                    } as React.CSSProperties
                  }
                />
                <p
                  className="global-label"
                  style={
                    {
                      left: `${((office.x + 14) / 900) * 100}%`,
                      top: `${((office.y - 4) / 460) * 100}%`,
                      '--i': i,
                    } as React.CSSProperties
                  }
                >
                  <span className="global-label__place">{office.place}</span>
                  <br />
                  <span className="global-label__time">{office.time}</span>
                </p>
              </div>
            ))}

            {/* the studio itself - it answers the pointer, so it is the
                one live thing on an otherwise inert board */}
            <span
              className="global-hub"
              role="img"
              aria-label="MegaCloudWorks, India"
              style={{
                left: `${(HUB.x / 900) * 100}%`,
                top: `${(HUB.y / 460) * 100}%`,
              }}
            >
              <img
                src="/logo-mark.svg"
                alt=""
                width={231}
                height={141}
                loading="lazy"
                decoding="async"
              />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeGlobal
