import { Link } from '@tanstack/react-router'
import { Instagram, Linkedin, Twitter } from 'lucide-react'

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', Icon: Linkedin },
  { label: 'Instagram', href: 'https://www.instagram.com/', Icon: Instagram },
  { label: 'X', href: 'https://x.com/', Icon: Twitter },
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
            alt="MegaCloudWorks"
            className="h-9 w-auto"
          />
        </Link>

        <a
          href="mailto:hello@megacloudworks.com"
          className="mail-highlight text-sm"
        >
          hello@megacloudworks.com
        </a>

        <div className="flex items-center justify-center gap-3">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className={`inline-flex size-9 items-center justify-center rounded-full no-underline transition-colors ${
                dark
                  ? 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  : 'bg-[#1a1a1e] text-white hover:bg-[var(--brand)]'
              }`}
            >
              <Icon className="size-4" strokeWidth={2} />
            </a>
          ))}
        </div>

        <p
          className={
            dark ? 'text-xs text-white/40' : 'text-xs text-[var(--ink-faint)]'
          }
        >
          © {new Date().getFullYear()} MegaCloudWorks. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default SiteFooter
