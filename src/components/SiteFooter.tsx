import { Link } from 'react-router-dom'
import { LinkedInIcon, InstagramIcon, XIcon } from './SocialIcons'
import { BRAND, NAV, SOCIALS } from '../content/site'

const ICONS = { LinkedIn: LinkedInIcon, Instagram: InstagramIcon, X: XIcon } as const

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[var(--near-black)] text-white">
      <div className="mx-auto max-w-[var(--container-wide)] px-[var(--edge)] py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center no-underline">
              <img src="/logo-light.svg" alt={BRAND.name} width={220} height={30} className="h-8 w-auto" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              An app design & development studio. Research, UI, and engineering under one roof.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((s) => {
                const Icon = ICONS[s.label as keyof typeof ICONS]
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 no-underline transition-colors hover:bg-[var(--brand)] hover:text-white"
                  >
                    <Icon className="size-4" strokeWidth={2} />
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Navigate</p>
            <ul className="mt-4 space-y-3">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-sm text-white/70 no-underline transition-colors hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Get in touch</p>
            <a
              href={`mailto:${BRAND.email}`}
              className="mt-4 inline-block text-sm font-semibold text-white no-underline hover:text-[var(--brand-2)]"
            >
              {BRAND.email}
            </a>
            <p className="mt-3 text-sm text-white/55">India, building for US teams.</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>Design & engineering under one roof.</p>
        </div>
      </div>
    </footer>
  )
}
