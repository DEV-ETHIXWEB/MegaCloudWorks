import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'
import { BRAND } from '../content/site'

export function CTASection({
  eyebrow,
  title,
  sub,
  ctaLabel = 'Get in touch',
  bgImage = true,
}: {
  eyebrow: string
  title: ReactNode
  sub?: string
  ctaLabel?: string
  /** Swap the coral cloudscape photo for a flat brand-red field. On by
   * default so every closing CTA across the site shares the same
   * cloudscape background; pass `bgImage={false}` for the rare spot that
   * wants the plain colour field instead. */
  bgImage?: boolean
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--brand)] px-[var(--edge)] py-24 sm:py-32">
      {bgImage && (
        <>
          <img
            src="/cta-sky.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
          />
          {/* the photo alone reads a touch light for white text; a soft
              bottom-weighted scrim in the same brand red keeps contrast
              without flattening the clouds back into a solid field */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(ellipse 70% 65% at 50% 60%, rgba(193,20,32,0.32) 0%, rgba(193,20,32,0.12) 55%, rgba(193,20,32,0.4) 100%)',
            }}
          />
        </>
      )}
      <div
        className="pointer-events-none absolute -right-40 -top-40 size-[32rem] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5), transparent 70%)' }}
      />
      <div className="grain-overlay" aria-hidden="true" />

      <div className="relative mx-auto max-w-[var(--container)] text-center">
        <Reveal>
          <p className="kicker justify-center" data-n="→" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {eyebrow}
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl font-sans text-[length:var(--fs-h1)] font-black leading-[0.98] tracking-[var(--tracking-tight)] text-white">
            {title}
          </h2>
          {sub && <p className="mx-auto mt-5 max-w-lg text-lg text-white/85">{sub}</p>}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="edge-hard inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-[var(--brand-text)] no-underline"
              style={{ boxShadow: '4px 4px 0 rgba(16,16,20,0.9)' }}
            >
              {ctaLabel}
            </Link>
            <a
              href={`mailto:${BRAND.email}`}
              className="text-sm font-semibold text-white no-underline underline decoration-white/40 underline-offset-4 hover:decoration-white"
            >
              {BRAND.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
