import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'

const NAV = [
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const

export function SiteHeader({
  tone = 'light',
  servicesLabel = 'Services',
  ctaLabel = 'Get in touch',
}: {
  tone?: 'light' | 'dark'
  servicesLabel?: string
  ctaLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const dark = tone === 'dark'

  const logo = dark ? '/logo-light.svg' : '/logo-resized.svg'
  const navLink = dark
    ? 'text-white/80 hover:text-white'
    : 'text-[var(--ink)] hover:text-[var(--brand)]'
  const iconBtn = dark
    ? 'text-white hover:bg-white/10'
    : 'text-[var(--ink)] hover:bg-[var(--paper-2)]'
  const panel = dark
    ? 'border-white/10 bg-[#141416] shadow-[0_18px_44px_rgba(0,0,0,0.5)]'
    : 'border-[var(--line)] bg-[var(--paper)] shadow-[0_18px_44px_rgba(16,16,20,0.12)]'
  const panelLink = dark
    ? 'text-white/85 hover:bg-white/10'
    : 'text-[var(--ink)] hover:bg-[var(--paper-2)]'

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-6 py-5 sm:px-10 lg:px-20">
        <Link
          to="/"
          className="flex shrink-0 items-center no-underline"
          onClick={close}
        >
          <img
            src={logo}
            alt="MegaCloudWorks"
            className="h-[30px] w-auto sm:h-[34px]"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`relative py-1 text-sm font-semibold no-underline transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:scale-x-0 after:bg-[var(--brand)] after:transition-transform after:content-[''] ${navLink}`}
              activeProps={{
                className: 'text-[var(--brand)] after:scale-x-100',
              }}
            >
              {item.to === '/services' ? servicesLabel : item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden h-10 px-5 sm:inline-flex">
            <Link to="/contact">{ctaLabel}</Link>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden ${iconBtn}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className={`mx-6 rounded-2xl border p-2 lg:hidden ${panel}`}>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={close}
              className={`block rounded-xl px-4 py-3 text-sm font-semibold no-underline transition-colors ${panelLink}`}
              activeProps={{ className: 'text-[var(--brand)]' }}
            >
              {item.to === '/services' ? servicesLabel : item.label}
            </Link>
          ))}
          <Button asChild className="mt-1 w-full">
            <Link to="/contact" onClick={close}>
              {ctaLabel}
            </Link>
          </Button>
        </div>
      )}
    </header>
  )
}

export default SiteHeader
