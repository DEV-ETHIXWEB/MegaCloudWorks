import { useEffect, useRef, useState } from 'react'

import './home-approach.css'

/* ------------------------------------------------------------------ *
 * marks
 * ------------------------------------------------------------------ */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function BulbIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M9 17.5a6 6 0 1 1 6 0v1.2a1.3 1.3 0 0 1-1.3 1.3h-3.4A1.3 1.3 0 0 1 9 18.7z" />
      <path d="M10 21.5h4" />
    </svg>
  )
}

function PenIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M15 4.5 19.5 9 8 20.5H3.5V16z" />
      <path d="m12.5 7 4.5 4.5" />
    </svg>
  )
}

function LayersIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="m12 3.5 8.5 4.3-8.5 4.3-8.5-4.3z" />
      <path d="m3.5 12.2 8.5 4.3 8.5-4.3M3.5 16.4l8.5 4.3 8.5-4.3" />
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5.5l-3 13" />
    </svg>
  )
}

function RocketIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M13.5 4.5c3.5-2 6 0 6 0s2 2.5 0 6c-1.7 3-6.2 6.6-6.2 6.6l-6.4-6.4S10.5 6.2 13.5 4.5Z" />
      <path d="M8.5 15.5 5 19M7 12.5 4 13l2-3.5M11.5 17l-.5 3 3.5-2" />
      <circle cx="14.5" cy="9.5" r="1.4" />
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * the content
 * ------------------------------------------------------------------ */

const STEPS = [
  {
    index: '01',
    title: 'Discover',
    art: '/card-design-400.webp',
    icon: <BulbIcon />,
    note: 'We learn your idea, your users and your market.',
  },
  {
    index: '02',
    title: 'Strategy',
    art: '/card-development-400.webp',
    icon: <PenIcon />,
    note: 'We set the strategy, the features and the roadmap.',
  },
  {
    index: '03',
    title: 'Design',
    art: '/card-brand-400.webp',
    icon: <LayersIcon />,
    note: 'Experiences users love and businesses rely on.',
  },
  {
    index: '04',
    title: 'Build',
    art: '/process/code-tooling.webp',
    icon: <CodeIcon />,
    note: 'Robust, scalable, secure - and cleanly built.',
  },
  {
    index: '05',
    title: 'Launch & Grow',
    art: '/process/rocket-growth.webp',
    icon: <RocketIcon />,
    note: 'We ship it, then help you scale it.',
  },
] as const

/**
 * The hops between the tiles.
 *
 * Drawn in a 100x100 box stretched across the whole row: each arc runs from
 * one column's centre to the next, so the dashes always meet the tiles
 * wherever the grid puts them. The last one runs off the end, as in the
 * design - the process does not stop at launch.
 */
const COLUMN_CENTRES = [10, 30, 50, 70, 90] as const

function Hops() {
  return (
    <svg
      className="approach-hops hidden lg:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {COLUMN_CENTRES.slice(0, -1).map((from, i) => {
        const to = COLUMN_CENTRES[i + 1]
        const mid = (from + to) / 2
        return (
          <path key={from} d={`M ${from + 6} 50 Q ${mid} 92, ${to - 6} 50`} />
        )
      })}
      {/* and on, past the last tile */}
      <path d="M 96 50 Q 99 68, 103 62" />
      <polygon points="104,62 99.5,60 100.5,66" />
    </svg>
  )
}

/**
 * Plays the connecting run once the row is actually on screen.
 *
 * One observer, one flag, and the animation itself lives in CSS - so the
 * scroll handler never re-renders anything but the wrapper's data attribute,
 * and it fires once rather than on every crossing.
 */
function useShown<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    /*
     * A ratio threshold cannot be used here. On a phone the run is taller
     * than the screen, so the fraction of it that is ever visible at once
     * may sit under any figure worth setting on a desk - and the reveal
     * would simply never fire, leaving the steps invisible. Crossing the
     * edge at all is the signal; the margin just holds it back until the
     * top of the run is properly on screen.
     */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        io.disconnect()
      },
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return { ref, shown }
}

/**
 * The phone timeline's track.
 *
 * Two numbers are needed and neither can be had in CSS: where the line
 * should stop (the centre of the last stop, not the foot of its card),
 * and how much of it has been walked. Both are measured here and handed
 * to the stylesheet as custom properties, so the drawing itself stays in
 * CSS and the scroll handler only ever writes two strings.
 */
function useTrack(list: React.RefObject<HTMLOListElement | null>) {
  const track = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = list.current
    const line = track.current
    if (!el || !line) return

    const measure = () => {
      const stops = el.querySelectorAll('.approach-step__index')
      if (stops.length < 2) return
      const first = stops[0].getBoundingClientRect()
      const last = stops[stops.length - 1].getBoundingClientRect()
      const top = first.top + first.height / 2 - el.getBoundingClientRect().top
      const height = last.top + last.height / 2 - first.top - first.height / 2
      line.style.setProperty('--track-top', `${top}px`)
      line.style.setProperty('--track-height', `${Math.max(height, 0)}px`)
    }

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const box = el.getBoundingClientRect()
        // walked from the moment the list's top reaches two thirds of the
        // screen until its foot passes the same line
        const start = window.innerHeight * 0.66
        const walked = (start - box.top) / (box.height || 1)
        line.style.setProperty('--fill', `${Math.min(Math.max(walked, 0), 1)}`)
      })
    }

    measure()
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [list])

  return track
}

export function HomeApproach() {
  const run = useShown<HTMLDivElement>()
  const list = useRef<HTMLOListElement>(null)
  const track = useTrack(list)

  return (
    <section id="approach" className="home-approach">
      <div
        className="home-approach__wisp home-approach__wisp--left"
        aria-hidden="true"
      />
      <div
        className="home-approach__wisp home-approach__wisp--right"
        aria-hidden="true"
      />

      <div className="relative z-[2] mx-auto w-full max-w-[1360px] px-6 pb-20 pt-24 sm:px-10 lg:px-28 lg:pb-24 lg:pt-28">
        {/* ---------- the claim ---------- */}
        <span className="approach-tick" aria-hidden="true" />
        <p className="approach-eyebrow">Our process</p>

        <h2 className="mt-5 text-center font-display text-[clamp(2rem,3.5vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-[var(--ink)]">
          From idea to <span className="text-[var(--brand)]">impact.</span>
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-center text-[1.0625rem] leading-[1.6] text-[var(--ink-soft)]">
          A clear, proven process that turns complexity into powerful digital
          products.
        </p>

        {/* ---------- the five steps ---------- */}
        <div
          ref={run.ref}
          data-shown={run.shown ? 'true' : 'false'}
          className="relative mt-10"
        >
          <Hops />

          {/* the track only exists on phones; on a desk the wave above the
              row does this job */}
          <span ref={track} className="approach-track" aria-hidden="true">
            <span className="approach-track__fill" />
          </span>

          <ol
            ref={list}
            className="relative grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5"
          >
            {STEPS.map((step, i) => (
              <li key={step.index} style={{ '--i': i } as React.CSSProperties}>
                <span className="approach-step__art">
                  <img
                    src={step.art}
                    alt=""
                    width={420}
                    height={384}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <p className="approach-step__index">
                  <span className="approach-step__num">{step.index}</span>
                  <span className="approach-step__mark" aria-hidden="true">
                    <img
                      src={step.art}
                      alt=""
                      width={420}
                      height={384}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                </p>
                <h3 className="approach-step__title">{step.title}</h3>
                <p className="approach-step__note">{step.note}</p>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  )
}

export default HomeApproach
