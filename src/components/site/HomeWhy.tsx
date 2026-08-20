import { useEffect, useRef, useState } from 'react'

import './home-why.css'

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

function ShieldCheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M12 3 19 6v5.5c0 4.2-2.9 7.6-7 9.5-4.1-1.9-7-5.3-7-9.5V6z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  )
}

function TeamIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="9" cy="9.5" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 7.2a3 3 0 0 1 0 5.6M17.5 19a5.3 5.3 0 0 0-2-4.1" />
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

function LockIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M13 2.5 5.5 13.5H11l-1 8 8.5-11H13z" />
    </svg>
  )
}

function MedalIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="12" cy="10" r="6.5" />
      <path d="m12 6.8 1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2L8.8 9.1l2.2-.3z" />
      <path d="m8.5 16.5-1.5 5 5-2.2 5 2.2-1.5-5" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5a14 14 0 0 1 0 17 14 14 0 0 1 0-17Z" />
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * the content
 * ------------------------------------------------------------------ */

const LEFT = [
  {
    icon: <ShieldCheckIcon />,
    title: 'Proven Expertise',
    body: 'Years of hands-on experience across industries and technologies to deliver excellence.',
  },
  {
    icon: <TeamIcon />,
    title: 'Client-First Approach',
    body: 'We listen, understand, and align with your goals to deliver solutions that truly matter.',
  },
  {
    icon: <RocketIcon />,
    title: 'Scalable & Future-Ready',
    body: 'We build flexible, high-performance solutions that grow with your business.',
  },
] as const

const RIGHT = [
  {
    icon: <LockIcon />,
    title: 'Security by Design',
    body: 'We follow best practices to ensure your data, apps, and infrastructure are always secure.',
  },
  {
    icon: <BoltIcon />,
    title: 'Agile & Transparent',
    body: 'Iterative processes, real-time updates, and clear communication at every step of the way.',
  },
  {
    icon: <MedalIcon />,
    title: 'Results That Matter',
    body: 'We focus on outcomes that drive growth, engagement, and long-term success.',
  },
] as const

/**
 * Held back until the section is on screen, so the two columns close in
 * on the summit as you arrive rather than having already done it.
 */
function useShown() {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        io.disconnect()
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return { ref, shown }
}

export function HomeWhy() {
  const run = useShown()

  return (
    <section id="why" className="home-why">
      <div className="home-why__wash" aria-hidden="true" />

      <div className="relative z-[2] mx-auto max-w-[1360px] px-6 py-12 sm:px-10 lg:px-28 lg:pb-10 lg:pt-20">
        {/* ---------- the claim ---------- */}
        <p className="why-eyebrow">Why choose MegaCloud</p>

        <h2 className="mt-4 text-center font-display text-[clamp(1.8rem,3vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-[var(--ink)]">
          Why teams choose{' '}
          <span className="text-[var(--brand)]">MegaCloud</span>
        </h2>

        <p className="mx-auto mt-3.5 max-w-xl text-center text-[0.9375rem] leading-[1.55] text-[var(--ink-soft)]">
          We go beyond code. We partner with you to build secure, scalable, and
          future-ready digital products that drive real business results.
        </p>

        {/* ---------- the reasons, either side of the summit ---------- */}
        <div
          ref={run.ref}
          data-shown={run.shown ? 'true' : 'false'}
          className="mt-7 grid grid-cols-1 items-center gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)_minmax(0,1fr)] lg:gap-8"
        >
          <ul className="space-y-4">
            {LEFT.map((item, i) => (
              <li
                key={item.title}
                className="why-card why-card--left"
                style={{ '--i': i } as React.CSSProperties}
              >
                <span className="why-card__disc">{item.icon}</span>
                <div>
                  <h3 className="text-[1.0625rem] font-bold tracking-[-0.02em] text-[var(--ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[0.8125rem] leading-[1.5] text-[var(--ink-soft)]">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* the studio, on the summit between the two columns */}
          <div
            className="why-summit order-first lg:order-none"
            aria-hidden="true"
          >
            <span className="why-disc">
              <img
                src="/logo-mark.svg"
                alt=""
                width={231}
                height={141}
                loading="lazy"
                decoding="async"
                className="why-mark"
              />
            </span>
          </div>

          <ul className="space-y-4">
            {RIGHT.map((item, i) => (
              <li
                key={item.title}
                className="why-card why-card--right"
                style={{ '--i': i + 3 } as React.CSSProperties}
              >
                <span className="why-card__disc">{item.icon}</span>
                <div>
                  <h3 className="text-[1.0625rem] font-bold tracking-[-0.02em] text-[var(--ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[0.8125rem] leading-[1.5] text-[var(--ink-soft)]">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default HomeWhy
