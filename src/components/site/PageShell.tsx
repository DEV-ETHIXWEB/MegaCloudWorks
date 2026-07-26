import type { ReactNode } from 'react'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'

/**
 * PageShell — shared frame for the inner content pages (Services, Work,
 * About, Contact). Renders the site header, a consistent page heading block,
 * and the footer, with the same 80px desktop side gutters as the homepage.
 */
export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  children: ReactNode
}) {
  return (
    <main className="relative min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <SiteHeader />

      <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-32 sm:px-10 lg:px-20 lg:pt-40">
        <header className="max-w-2xl">
          <p className="reveal-up text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
            {eyebrow}
          </p>
          <h1
            className="reveal-up mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--ink)]"
            style={{ animationDelay: '60ms' }}
          >
            {title}
          </h1>
          {intro && (
            <p
              className="reveal-up mt-6 text-lg leading-relaxed text-[var(--ink-soft)]"
              style={{ animationDelay: '120ms' }}
            >
              {intro}
            </p>
          )}
        </header>

        <div className="mt-16">{children}</div>
      </div>

      <SiteFooter />
    </main>
  )
}

export default PageShell
