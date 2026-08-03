import { useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '#/components/site/SiteHeader'
import { SiteFooter } from '#/components/site/SiteFooter'
import { NotifyForm } from '#/components/site/NotifyForm'

export const Route = createFileRoute('/about')({ component: About })

const ETHIXWEB_SERVICES = ['Web design', 'Marketing sites', 'Brand & content']
const MEGACLOUD_SERVICES = ['App design', 'App development', 'UI / UX systems']

function ServiceList({ items }: { items: ReadonlyArray<string> }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-3 text-[15px] text-[var(--ink)]"
        >
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-[var(--brand)]"
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

function About() {
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

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 42,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
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

      {/* ================= 1. STUDIO INTRO ================= */}
      <section className="relative overflow-hidden px-6 pb-24 pt-36 sm:px-10 lg:px-20 lg:pb-32 lg:pt-44">
        <div className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* ---- left: copy ---- */}
          <div className="max-w-xl">
            <h1
              data-hero
              className="font-display text-[clamp(2.75rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--ink)]"
            >
              Experienced studio,{' '}
              <span className="text-[var(--brand)]">fresh</span> focus.
            </h1>
            <p
              data-hero
              className="mt-7 max-w-md text-lg leading-relaxed text-[var(--ink-soft)]"
            >
              MegaCloudWorks is an app design &amp; development studio built by
              the team behind Ethixweb, years of real client work, now aimed
              squarely at apps.
            </p>
          </div>

          {/* ---- right: the two-studio split card ---- */}
          <div
            data-hero
            className="w-full rounded-2xl border-[1.5px] border-[var(--ink)] bg-white"
          >
            {/* masthead — Ethixweb ←→ MegaCloudWorks */}
            <div className="grid grid-cols-1 gap-6 px-7 pb-6 pt-7 sm:grid-cols-2">
              <div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-lg font-extrabold tracking-[-0.01em] text-[var(--ink)]">
                    ETHIXWEB
                  </span>
                  <span
                    aria-hidden="true"
                    className="link-track hidden h-px flex-1 sm:block"
                  />
                </div>
                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                  Web &amp; Marketing
                </p>
              </div>

              <div>
                <div className="font-display text-lg font-extrabold tracking-[-0.01em] text-[var(--brand)]">
                  MEGACLOUDWORKS
                </div>
                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                  App design &amp; development
                </p>
              </div>
            </div>

            {/* service columns */}
            <div className="grid grid-cols-1 border-t-[1.5px] border-[var(--ink)] sm:grid-cols-2">
              <div className="px-7 py-7">
                <ServiceList items={ETHIXWEB_SERVICES} />
              </div>
              <div className="border-t-[1.5px] border-[var(--ink)] px-7 py-7 sm:border-l-[1.5px] sm:border-t-0">
                <ServiceList items={MEGACLOUD_SERVICES} />
              </div>
            </div>

            {/* cross-sell footer */}
            <div className="border-t-[1.5px] border-[var(--ink)] px-7 pb-8 pt-6 text-center">
              <p className="text-sm text-[var(--ink-soft)]">
                Looking for websites instead?
              </p>
              <a
                href="https://ethixweb.com"
                target="_blank"
                rel="noreferrer"
                className="cta-diagonal mt-4 inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--brand)] px-6 text-base font-semibold text-white no-underline shadow-[0_10px_30px_-8px_rgba(245,51,59,0.6)]"
              >
                Visit Ethixweb
                <ArrowRight className="size-[18px]" strokeWidth={2.2} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. NOTIFY CTA ================= */}
      <section className="relative overflow-hidden border-y border-[var(--line)] bg-white">
        {/* expedition photograph, anchored bottom-right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[image:url('/about-background.png')] bg-cover bg-[position:right_bottom] bg-no-repeat lg:bg-[length:auto_100%]"
        />
        {/* white scrim so the copy stays readable over the photo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_24%,rgba(255,255,255,0.55)_38%,rgba(255,255,255,0)_54%)] lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.72)_42%,rgba(255,255,255,0.1)_70%,rgba(255,255,255,0)_88%)] lg:hidden"
        />

        <div className="relative mx-auto flex min-h-[34rem] max-w-[1600px] items-center px-6 pb-72 pt-20 sm:px-10 lg:min-h-[42rem] lg:px-20 lg:pb-20">
          <div data-reveal className="max-w-lg">
            <h2 className="font-display text-[clamp(2.25rem,4.4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-[var(--ink)]">
              Ready to build something great?
            </h2>
            <p className="mt-4 max-w-sm text-lg leading-relaxed text-[var(--ink-soft)]">
              Drop your email and we&rsquo;ll reach out the moment we open for
              projects.
            </p>
            <div className="mt-8">
              <NotifyForm />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default About
