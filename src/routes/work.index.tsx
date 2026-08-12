import { useEffect, useRef } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '#/components/site/SiteHeader'
import { SiteFooter } from '#/components/site/SiteFooter'
import { CONCEPT_PREVIEWS } from '#/components/site/ConceptPreviews'
import { CONCEPTS } from '#/lib/concepts'
import { seo } from '#/lib/seo'

export const Route = createFileRoute('/work/')({
  component: Work,
  head: (ctx) => {
    const page = seo({
      title: 'Work',
      description:
        'Five app concepts designed and prototyped by the MegaCloudWorks team, each one a complete product-thinking exercise.',
      path: '/work',
    })
    // /work/$slug is a child match sharing this route's prefix — when a
    // concept page is active, let its own head() own the canonical link so
    // the document doesn't end up with two conflicting canonicals.
    const lastMatchId: string | undefined =
      ctx.matches[ctx.matches.length - 1]?.routeId
    const isLeaf = lastMatchId === (ctx.match.routeId as string)
    return isLeaf ? page : { meta: page.meta }
  },
})

function Work() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.from('[data-hero]', {
        y: 34,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el, i) => {
        gsap.from(el, {
          y: 42,
          opacity: 0,
          duration: 0.9,
          delay: (i % 3) * 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={root}
      className="relative min-h-screen bg-[var(--paper)] text-[var(--ink)]"
    >
      <SiteHeader />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32 sm:px-10 lg:px-20 lg:pb-20 lg:pt-44">
        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p
              data-hero
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand)]"
            >
              <span aria-hidden="true" className="h-px w-6 bg-[var(--brand)]" />
              Work
            </p>
            <h1
              data-hero
              className="mt-4 font-display text-[clamp(2.75rem,6.5vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--ink)]"
            >
              Five ideas.
              <br />
              Built from <span className="text-[var(--brand)]">scratch.</span>
            </h1>
            <p
              data-hero
              className="mt-5 max-w-lg text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg"
            >
              App concepts designed and prototyped by the Megacloudworks team,
              each one a complete product-thinking exercise.
            </p>
          </div>

          <div data-hero className="shrink-0">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-5 py-3 text-sm font-semibold text-[var(--ink)] no-underline transition-colors hover:border-[var(--brand)]/50 hover:text-[var(--brand)]"
            >
              Get notified when we launch
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CONCEPT GRID ================= */}
      <section className="px-6 pb-24 sm:px-10 lg:px-20 lg:pb-32">
        <div className="card-grid">
          {CONCEPTS.map((c, i) => {
            const Preview = CONCEPT_PREVIEWS[c.slug]
            return (
              <Link
                key={c.slug}
                to="/work/$slug"
                params={{ slug: c.slug }}
                data-reveal
                className={`card-${c.slug} group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--ink)] bg-[var(--paper)] p-6 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-[0_0_0_1px_var(--brand),0_20px_50px_rgba(245,51,59,0.22)] sm:p-7`}
              >
                <div className="mb-8">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
                    {c.category} · {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] transition-colors group-hover:text-[var(--brand)]">
                    {c.name}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-[var(--ink-soft)]">
                    {c.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                    {c.blurb}
                  </p>
                </div>

                {/* The auto margin lives on whichever element starts the
                    card's bottom stack, so preview + footer hug the card's
                    own bottom edge however tall the grid row makes it. */}
                {Preview ? (
                  <div className="mt-auto mb-4">
                    <Preview />
                  </div>
                ) : null}

                <div
                  className={`${Preview ? '' : 'mt-auto'} flex items-center justify-between border-t border-[var(--line)] pt-4`}
                >
                  <span className="text-xs font-semibold text-[var(--ink-faint)]">
                    {c.year}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--brand)] transition-transform duration-300 group-hover:translate-x-1">
                    Concept
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
