import { useEffect, useRef } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '#/components/site/SiteHeader'
import { SiteFooter } from '#/components/site/SiteFooter'
import { Button } from '#/components/ui/button'
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

      gsap.to('[data-glow]', {
        scale: 1.15,
        opacity: 0.8,
        duration: 7,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
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
        <div
          data-glow
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[34rem] w-[34rem] rounded-full opacity-60 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(245,51,59,0.16) 0%, rgba(255,106,61,0.08) 45%, rgba(255,255,255,0) 72%)',
          }}
        />

        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p
              data-hero
              className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand)]"
            >
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
              App concepts designed and prototyped by the MegaCloudWorks team,
              each one a complete product-thinking exercise, not client work, a
              way for you to see how we design and build.
            </p>
          </div>

          <div
            data-hero
            className="flex shrink-0 items-center gap-8 border-t border-[var(--line)] pt-6 lg:border-t-0 lg:pt-0"
          >
            <div>
              <p className="font-display text-3xl font-extrabold tracking-tight text-[var(--ink)]">
                {CONCEPTS.length}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
                Concepts
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-extrabold tracking-tight text-[var(--ink)]">
                {new Set(CONCEPTS.map((c) => c.category)).size}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
                Industries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONCEPT GRID ================= */}
      <section className="px-6 pb-24 sm:px-10 lg:px-20 lg:pb-32">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CONCEPTS.map((c, i) => (
            <Link
              key={c.slug}
              to="/work/$slug"
              params={{ slug: c.slug }}
              data-reveal
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand)]/40 hover:shadow-[0_20px_50px_rgba(16,16,20,0.1)] sm:p-7 ${
                i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div>
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

              <div className="mt-8 flex items-center justify-between border-t border-[var(--line)] pt-4">
                <span className="text-xs font-semibold text-[var(--ink-faint)]">
                  {c.year}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--brand)] transition-transform duration-300 group-hover:translate-x-1">
                  Concept
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 pb-24 sm:px-10 sm:pb-28 lg:px-20">
        <div
          data-reveal
          className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper-2)] p-8 sm:rounded-3xl sm:p-12"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-70 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(245,51,59,0.14) 0%, rgba(255,106,61,0.09) 45%, rgba(255,255,255,0) 72%)',
            }}
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl">
                Have an idea like these?
              </h2>
              <p className="mt-2 text-sm text-[var(--ink-soft)] sm:text-base">
                We take on a limited number of projects at a time. Tell us what
                you&rsquo;re building.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="group w-full shrink-0 sm:w-auto"
            >
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2"
              >
                <span>Start a project</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
