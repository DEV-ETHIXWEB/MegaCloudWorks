import { Link } from '@tanstack/react-router'

const LINKS = [
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const

export function SiteFooter({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark'

  return (
    <footer
      className={
        dark
          ? 'dark border-t border-white/10 bg-[#0d0d0f]'
          : 'border-t border-[var(--line)]'
      }
    >
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-6 px-6 py-16 text-center sm:px-10 lg:px-20">
        <Link to="/" className="flex items-center no-underline">
          <img
            src={dark ? '/logo-light.svg' : '/logo-resized.svg'}
            alt="Megacloudworks"
            className="h-9 w-auto"
          />
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-semibold no-underline transition-colors ${
                dark
                  ? 'text-white/70 hover:text-white'
                  : 'text-[var(--ink-soft)] hover:text-[var(--brand)]'
              }`}
              activeProps={{ className: 'text-[var(--brand)]' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href="mailto:hello@megacloudworks.com"
          className="mail-highlight text-sm"
        >
          hello@megacloudworks.com
        </a>

        <p
          className={
            dark ? 'text-xs text-white/40' : 'text-xs text-[var(--ink-faint)]'
          }
        >
          © {new Date().getFullYear()} Megacloudworks. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default SiteFooter
