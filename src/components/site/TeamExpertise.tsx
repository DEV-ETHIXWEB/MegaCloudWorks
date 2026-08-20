import { useCallback, useState } from 'react'

import { ProfileCard } from './ProfileCard'

import './team-expertise.css'

/* ------------------------------------------------------------------ *
 * marks
 * ------------------------------------------------------------------ */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function CubeIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M12 2.8 20 7v10l-8 4.2L4 17V7z" />
      <path d="m4 7 8 4.2L20 7M12 11.2V21" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <rect x="3.2" y="5" width="17.6" height="16" rx="2.2" />
      <path d="M3.2 9.6h17.6M8 2.8v4.2M16 2.8v4.2" />
      <path d="M7.4 13.4h2M11 13.4h2M14.6 13.4h2M7.4 17h2M11 17h2" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="9.4" cy="7.6" r="3.6" />
      <path d="M2.8 20.4a6.6 6.6 0 0 1 13.2 0" />
      <path d="M16.4 4.4a3.6 3.6 0 0 1 0 6.9M18.4 20.4a6 6 0 0 0-2-4.5" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 9.6h17.6M3.2 14.4h17.6" />
      <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
    </svg>
  )
}

function RosetteIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="12" cy="9.6" r="6.4" />
      <path d="m11.4 6.6.6-1.4.6 1.4 1.5.2-1.1 1.1.3 1.5-1.3-.7-1.3.7.3-1.5-1.1-1.1z" />
      <path d="m8.4 15.4-1.6 5.4 5.2-2.4 5.2 2.4-1.6-5.4" />
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * the content
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 * the five marks
 *
 * Drawn here, on the same 1.7 stroke and round terminals as the figures
 * below them, because none of the studio's isometric artwork covers
 * security or campaign work and a borrowed icon set would show.
 * ------------------------------------------------------------------ */

const mark = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function PhoneCodeIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" {...mark} aria-hidden>
      <rect x="6" y="2.6" width="12" height="18.8" rx="2.6" />
      <path d="M10.4 19.4h3.2" />
      <path d="m10.6 9.4-2 2.2 2 2.2M13.4 9.4l2 2.2-2 2.2" />
    </svg>
  )
}

function CampaignIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" {...mark} aria-hidden>
      <path d="M4 9.4v4.2a1.6 1.6 0 0 0 1.6 1.6H8l7.4 4.2V5.2L8 9.4z" />
      <path d="M8 15.2v3.4a1.4 1.4 0 0 0 2.8 0v-1.8" />
      <path d="M18.4 9.2a3.4 3.4 0 0 1 0 5.6M20.6 6.6a6.6 6.6 0 0 1 0 10.8" />
    </svg>
  )
}

function ChipIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" {...mark} aria-hidden>
      <rect x="6.4" y="6.4" width="11.2" height="11.2" rx="2.2" />
      <rect x="10" y="10" width="4" height="4" rx="1" />
      <path d="M9.6 3.4v3M14.4 3.4v3M9.6 17.6v3M14.4 17.6v3M3.4 9.6h3M3.4 14.4h3M17.6 9.6h3M17.6 14.4h3" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" {...mark} aria-hidden>
      <path d="M12 3 19 6v5.5c0 4.2-2.9 7.6-7 9.5-4.1-1.9-7-5.3-7-9.5V6z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  )
}

function GaugeIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" {...mark} aria-hidden>
      <path d="M3.6 17.4a9 9 0 1 1 16.8 0" />
      <path d="m12 13.6 4-4.2" />
      <circle cx="12" cy="14.4" r="1.5" />
      <path d="M4.6 12.4h1.8M17.6 12.4h1.8M11.1 5.6h1.8" />
    </svg>
  )
}

/**
 * What the studio is asked for, one card per service. The deck holds them
 * one behind the next: five equal cards side by side said nothing about
 * which came first, and at column width none of them had room to breathe.
 */
const EXPERTISE = [
  {
    icon: <PhoneCodeIcon />,
    name: 'App development',
    line: 'Native and cross-platform builds, from the first screen to the store.',
  },
  {
    icon: <CampaignIcon />,
    name: 'Ad campaign management',
    line: 'Search and social campaigns run and reported, budget put where it returns.',
  },
  {
    icon: <ChipIcon />,
    name: 'AI services',
    line: 'Assistants, booking agents and automation wired into the product itself.',
  },
  {
    icon: <ShieldIcon />,
    name: 'Security',
    line: 'Access, data and dependencies reviewed before launch and after it.',
  },
  {
    icon: <GaugeIcon />,
    name: 'App management',
    line: 'Frequent audits, updates and monitoring, so it keeps running at peak.',
  },
] as const

const FIGURES = [
  { icon: <CubeIcon />, value: '50+', label: 'Projects Delivered' },
  { icon: <CalendarIcon />, value: '5+', label: 'Years of Experience' },
  { icon: <PeopleIcon />, value: '12+', label: 'Experts & Builders' },
  { icon: <GlobeIcon />, value: '10+', label: 'Industries Served' },
  { icon: <RosetteIcon />, value: '99%', label: 'Client Satisfaction' },
] as const

/**
 * "Our expertise": the five services, dealt as a deck. The front card is the
 * one being read; the rest stand behind it, offset far enough to be counted.
 * Next deals the front card to the back, so the deck runs on for ever in one
 * direction rather than stopping at the fifth.
 */
export function TeamExpertise() {
  const [front, setFront] = useState(0)
  const count = EXPERTISE.length

  const step = useCallback(
    (by: number) => setFront((cur) => (cur + by + count) % count),
    [count],
  )

  return (
    <div className="team">
      <div className="team__top">
        <div className="team__lead">
          <p className="team__eyebrow">Our expertise</p>

          <h2 className="team__title">
            Built by specialists.
            <br />
            <span className="text-[var(--brand)]">United</span> by the work.
          </h2>

          <p className="team__lede">
            Five services the studio is asked for most, from the first build to
            the audits that keep it running. Deal through the deck to read them.
          </p>
        </div>

        <div
          className="team-deck"
          role="group"
          aria-roledescription="carousel"
          aria-label="What we do"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') step(1)
            if (event.key === 'ArrowLeft') step(-1)
          }}
        >
          <div className="team-deck__stage">
            {EXPERTISE.map((item, i) => {
              // how far back in the deck this card is sitting right now
              const depth = (i - front + count) % count
              const shown = depth === 0

              return (
                <div
                  key={item.name}
                  className="team-deck__slot"
                  data-depth={depth}
                  style={{ '--depth': depth } as React.CSSProperties}
                  aria-hidden={shown ? undefined : true}
                  inert={!shown}
                >
                  <ProfileCard
                    className="team-profile"
                    artwork={item.icon}
                    name={item.name}
                    title={item.line}
                    showUserInfo={false}
                    enableTilt={shown}
                    behindGlowEnabled={false}
                    innerGradient="linear-gradient(145deg, #1b1b1f 0%, #241416 100%)"
                  />
                </div>
              )
            })}
          </div>

          <div className="team-deck__nav">
            <button
              type="button"
              className="team-deck__btn"
              onClick={() => step(-1)}
              aria-label="Show the previous service"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                {...mark}
                aria-hidden
              >
                <path d="M20 12H5M10.5 5.5 4 12l6.5 6.5" />
              </svg>
            </button>

            <p className="team-deck__count" aria-live="polite">
              <span className="team-deck__count-now">
                {String(front + 1).padStart(2, '0')}
              </span>
              <span className="team-deck__count-rule" aria-hidden="true" />
              <span>{String(count).padStart(2, '0')}</span>
              <span className="sr-only">, {EXPERTISE[front].name}</span>
            </p>

            <button
              type="button"
              className="team-deck__btn"
              onClick={() => step(1)}
              aria-label="Show the next service"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                {...mark}
                aria-hidden
              >
                <path d="M4 12h15M13.5 5.5 20 12l-6.5 6.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="team-figures">
        <div className="team-figures__lead">
          <p className="team-figures__eyebrow">What we&rsquo;re expert at</p>
          <span className="team-figures__rule" aria-hidden="true" />
          <h3 className="team-figures__title">
            Deep expertise.
            <br />
            Real-world impact.
          </h3>
          <p className="team-figures__body">
            We combine strategy, design and engineering to deliver digital
            products that drive results.
          </p>
        </div>

        <dl className="team-figures__grid">
          {FIGURES.map((figure) => (
            <div key={figure.label} className="team-figure">
              <span className="team-figure__icon">{figure.icon}</span>
              <dt className="team-figure__value">{figure.value}</dt>
              <dd className="team-figure__label">{figure.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

export default TeamExpertise
