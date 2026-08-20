import { Link } from '@tanstack/react-router'
import { Instagram, Linkedin, Twitter } from 'lucide-react'
import { CONCEPTS } from '#/lib/concepts'

import './home-footer.css'

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M4 12h15M13.5 6.5 20 12l-6.5 5.5" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.3l3.3 2" />
    </svg>
  )
}

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', Icon: Linkedin },
  { label: 'Instagram', href: 'https://www.instagram.com/', Icon: Instagram },
  { label: 'X', href: 'https://x.com/', Icon: Twitter },
] as const

/* Every link below points at a route that exists - the studio pages and
   the five case studies. Nothing here is a placeholder. */
const STUDIO = [
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const

export function HomeFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="home-footer">
      <div className="mx-auto max-w-[1360px] px-6 pb-8 pt-14 sm:px-10 lg:px-28">
        {/* ---------- the last word ---------- */}
        <div className="flex flex-col gap-6 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <img
              src="/logo-light.svg"
              alt="MegaCloudWorks"
              width={236}
              height={32}
              loading="lazy"
              decoding="async"
              className="h-8 w-auto"
            />
            <p className="mt-5 max-w-md text-[1.35rem] font-bold leading-[1.25] tracking-[-0.03em] text-white">
              An app design &amp; development studio.
              <br />
              <span className="text-white/55">
                From idea to store, with one team.
              </span>
            </p>
          </div>

          <Link
            to="/contact"
            className="footer-cta cta-diagonal self-start lg:self-auto"
          >
            Start a project
            <ArrowRight />
          </Link>
        </div>

        <div className="footer-rule" />

        {/* ---------- the map ---------- */}
        <div className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-3 lg:grid-cols-4">
          <div>
            <p className="footer-head">Studio</p>
            <ul>
              {STUDIO.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer-head">Work</p>
            <ul>
              {CONCEPTS.map((concept) => (
                <li key={concept.slug}>
                  <Link
                    to="/work/$slug"
                    params={{ slug: concept.slug }}
                    className="footer-link"
                  >
                    {concept.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer-head">Get in touch</p>
            <ul className="space-y-3 text-[0.9375rem] text-white/62">
              <li>
                <a
                  href="mailto:hello@megacloudworks.com"
                  className="footer-link footer-link--row"
                >
                  <MailIcon />
                  hello@megacloudworks.com
                </a>
              </li>
              <li className="flex items-center gap-2.5 py-1 text-white/60">
                <PinIcon />
                India, building for teams worldwide
              </li>
              <li className="flex items-center gap-2.5 py-1 text-white/60">
                <ClockIcon />
                Replies within one business day
              </li>
            </ul>
          </div>

          <div>
            <p className="footer-head">Follow</p>
            <ul className="flex gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="footer-social"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-[16rem] text-[0.875rem] leading-[1.5] text-white/45">
              We take on a few projects at a time, so each one gets the whole
              studio.
            </p>
          </div>
        </div>

        <div className="footer-rule" />

        {/* ---------- the small print ---------- */}
        <div className="flex flex-col items-center gap-3 pt-6 text-[0.8125rem] text-white/40 sm:flex-row sm:justify-between">
          <p>© {year} MegaCloudWorks. All rights reserved.</p>
          <p>Designed &amp; built in-house.</p>
        </div>
      </div>
    </footer>
  )
}

export default HomeFooter
