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

/** one holding card per person, until the real five are ready */
const PLACEHOLDERS = [1, 2, 3, 4, 5] as const

const FIGURES = [
  { icon: <CubeIcon />, value: '50+', label: 'Projects Delivered' },
  { icon: <CalendarIcon />, value: '5+', label: 'Years of Experience' },
  { icon: <PeopleIcon />, value: '12+', label: 'Experts & Builders' },
  { icon: <GlobeIcon />, value: '10+', label: 'Industries Served' },
  { icon: <RosetteIcon />, value: '99%', label: 'Client Satisfaction' },
] as const

/**
 * "Our team & expertise": the five disciplines the studio is built out of,
 * each on its own card standing on the same ridge, and under them the plate
 * of figures that says how much of it has actually been done.
 */
export function TeamExpertise() {
  return (
    <div className="team">
      <p className="team__eyebrow">Our team &amp; expertise</p>
      <span className="team__rule" aria-hidden="true" />

      <h2 className="team__title">
        Built by specialists.
        <br />
        <span className="text-[var(--brand)]">United</span> by the work.
      </h2>

      <p className="team__lede">
        We bring together strategy, design, engineering, and product thinking to
        turn ambitious ideas into scalable digital products.
      </p>

      {/* The five people are not in yet - the row stands as five holding
          cards so the layout, the tilt and the spacing are all real, and
          only the contents change when the photographs arrive. */}
      <ul className="team-cards">
        {PLACEHOLDERS.map((slot) => (
          <li key={slot} className="team-cards__slot">
            <ProfileCard
              className="team-profile"
              name="Placeholder"
              title="Will be updating this in evening"
              handle="placeholder"
              status="Coming soon"
              contactText="Contact"
              showUserInfo
              enableTilt
              behindGlowColor="rgba(245, 51, 59, 0.55)"
              innerGradient="linear-gradient(145deg, #2a0f12cc 0%, #f5333b33 100%)"
            />
          </li>
        ))}
      </ul>

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
