import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { StrokeText } from './StrokeText'

import './home-hero.css'

/**
 * The climb, one stop per phase of a build.
 *
 * `dot` is where the stop sits on the drawn route, `label` is the top-left
 * of the caption hung off it - both percentages of the section, so the
 * drawing stays registered at any width.
 */
const STOPS = [
  {
    index: '01',
    title: 'Define',
    note: 'We dive deep into your idea and market.',
    dot: { x: 50, y: 70 },
    label: { x: 52.5, y: 72.5 },
  },
  {
    index: '02',
    title: 'Design',
    note: 'User-first design that’s clean, clear, and functional.',
    dot: { x: 64, y: 59 },
    label: { x: 52.5, y: 44 },
  },
  {
    index: '03',
    title: 'Build',
    note: 'Scalable architecture. Clean code. No shortcuts.',
    dot: { x: 73.5, y: 39 },
    label: { x: 62, y: 22 },
  },
  {
    index: '04',
    title: 'Launch',
    note: 'We ship, support, and scale with you.',
    dot: { x: 82, y: 24 },
    label: { x: 69, y: 9 },
  },
] as const

/** Where the flag is planted. */
const SUMMIT = { x: 89, y: 15.5 }

/**
 * The route, through every stop to the flag.
 *
 * It leaves the first stop heading right and almost level, swings back
 * up the face in a long S, then straightens out for the summit - the
 * shape of a path traversing a slope rather than a line ruled between
 * two corners.
 */
const ROUTE_WALKED =
  'M 50 70 C 55 72.5, 60.5 67, 64 59 ' +
  'C 67 52, 69.5 45, 73.5 39 ' +
  'C 76.5 34, 79.5 28, 82 24 ' +
  'C 84.5 20, 87 17, 89 15.5'

const TALLY = [
  { value: '40+', label: 'Projects delivered' },
  { value: '98%', label: 'Client satisfaction' },
  { value: '9+', label: 'Industries served' },
] as const

function ArrowOut({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6.5 21V3.5" />
      <path
        d="M6.5 4.5h11l-2.2 3.6 2.2 3.6h-11z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

/** True on phones, tracked live so a rotation swaps the headline. */
function useIsPhone() {
  const [phone, setPhone] = useState(false)

  useEffect(() => {
    const q = window.matchMedia('(max-width: 767px)')
    const sync = () => setPhone(q.matches)
    sync()
    q.addEventListener('change', sync)
    return () => q.removeEventListener('change', sync)
  }, [])

  return phone
}

export function HomeHero() {
  /*
   * The headline is drawn on a phone and set as type on a desk.
   *
   * Only one of the two is ever in the tree - rendering both and hiding
   * one with CSS would have a screen reader read the headline twice, and
   * `aria-hidden` cannot be swapped by a media query.
   */
  const phone = useIsPhone()

  return (
    <section id="top" className="home-hero">
      {/* ---------- the ridge ---------- */}
      <div className="home-hero__plate" aria-hidden="true" />
      <div className="home-hero__wash" aria-hidden="true" />

      {/* ---------- the route up it ----------
          Both strokes are one unit long (pathLength), so a single dash
          rule draws them from the first stop to the flag no matter what
          the real length works out to at this width. */}
      <svg
        className="home-hero__route"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="home-hero__route-glow"
          pathLength={1}
          d={ROUTE_WALKED}
        />
        <path
          className="home-hero__route-body"
          pathLength={1}
          d={ROUTE_WALKED}
        />
        <path
          className="home-hero__route-core"
          pathLength={1}
          d={ROUTE_WALKED}
        />

        {/* the light that walks the route: it travels the same path over
            the same duration as the draw, so it always sits exactly on
            the line's leading edge */}
        <circle className="home-hero__spark" r="1.2">
          <animateMotion
            dur="2.4s"
            begin="0.25s"
            fill="freeze"
            path={ROUTE_WALKED}
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="spline"
            keySplines="0.65 0 0.35 1"
          />
        </circle>
      </svg>

      {STOPS.map((stop, i) => (
        <div
          key={stop.index}
          aria-hidden="true"
          className="home-hero__stop"
          style={
            {
              left: `${stop.dot.x}%`,
              top: `${stop.dot.y}%`,
              '--i': i,
            } as React.CSSProperties
          }
        />
      ))}

      {STOPS.map((stop, i) => (
        <div
          key={stop.index}
          className="home-hero__step"
          style={
            {
              left: `${stop.label.x}%`,
              top: `${stop.label.y}%`,
              '--i': i,
            } as React.CSSProperties
          }
        >
          <p className="home-hero__step-index">{stop.index}</p>
          <p className="home-hero__step-title">{stop.title}</p>
          <p className="home-hero__step-note">{stop.note}</p>
        </div>
      ))}

      <div
        aria-hidden="true"
        className="home-hero__flag"
        style={{ left: `${SUMMIT.x}%`, top: `${SUMMIT.y}%` }}
      >
        <FlagIcon />
      </div>

      {/* ---------- the claim ---------- */}
      <div className="relative z-[2] mx-auto max-w-[1360px] px-6 pb-16 pt-28 sm:px-10 lg:min-h-screen lg:px-28 lg:pb-16 lg:pt-32">
        <div className="max-w-xl">
          <p className="text-[0.8125rem] font-bold uppercase tracking-[0.3em] text-[var(--brand)]">
            We build digital products
          </p>

          {/* Still an h1: the drawn lines are images with labels, and a
              page without a heading is a page a screen reader cannot
              skim. The size is the only thing the breakpoint changes. */}
          <h1 className="hero-title mt-6 lg:mt-7">
            <StrokeText
              text="From idea"
              fontSize={phone ? 54 : 88}
              letterSpacing={phone ? -2 : -4}
              strokeColor="var(--ink)"
              fillColor="var(--ink)"
              strokeWidth={1}
              drawDuration={0.85}
              stagger={0.03}
              fillDelay={0.06}
              align={phone ? 'center' : 'left'}
            />
            <StrokeText
              text="to app."
              fontSize={phone ? 54 : 88}
              letterSpacing={phone ? -2 : -4}
              strokeColor="var(--brand)"
              fillColor="var(--brand)"
              strokeWidth={1}
              drawDuration={0.85}
              stagger={0.03}
              fillDelay={0.2}
              align={phone ? 'center' : 'left'}
            />
          </h1>

          <p className="mt-6 max-w-md text-[1.0625rem] leading-[1.6] text-[var(--ink-soft)] sm:text-[1.125rem]">
            We turn complex ideas into intuitive, scalable apps that solve real
            problems and create value.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-10 gap-y-5">
            <Link to="/work" className="hero-cta">
              View our work
              <ArrowOut />
            </Link>
          </div>

          {/* phones get the proof as a single line - faces and one figure -
              rather than a four-cell table that would wrap to three rows */}
          <div className="hero-proof mt-10">
            <span>
              <span className="hero-proof__value">Trusted by founders</span>
              <span className="hero-proof__label">
                and enterprises worldwide
              </span>
            </span>
          </div>

          <div className="hero-tally mt-8">
            <p className="hero-tally__cell max-w-[10rem] text-[0.9375rem] leading-[1.4] text-[var(--ink-soft)]">
              Trusted by founders and enterprises
            </p>
            {TALLY.map((item) => (
              <div key={item.label} className="hero-tally__cell">
                <p className="text-[1.35rem] font-extrabold leading-none tracking-[-0.03em] text-[var(--brand)]">
                  {item.value}
                </p>
                <p className="mt-1.5 text-[0.8125rem] text-[var(--ink-soft)]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHero
