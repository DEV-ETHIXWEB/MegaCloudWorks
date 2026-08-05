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

/**
 * Ethixweb "E" — a full-height frosted upright beside three deep-red glass
 * rungs, each with a dark edge and a white inner highlight, plus a diagonal
 * gloss sweep across the whole letterform. Matches the brand emblem, minus
 * the backing plate so it sits directly on the card.
 */
const E_RUNG_Y = [0, 36, 72] as const
const RUNG_H = 28
const COL_W = 31.4
const RUNG_W = 64.1

function EthixwebMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-2 -2 99.5 104"
      className={className}
      role="img"
      aria-label="Ethixweb"
    >
      <defs>
        {/* frosted, lighter glass for the upright */}
        <linearGradient id="ethix-col" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#f7cdd1" />
          <stop offset="40%" stopColor="#efb0b6" />
          <stop offset="70%" stopColor="#e79ba2" />
          <stop offset="100%" stopColor="#f0b7bd" />
        </linearGradient>
        {/* deeper, glossier glass for the rungs */}
        <linearGradient id="ethix-rung" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#e3959c" />
          <stop offset="20%" stopColor="#c02330" />
          <stop offset="52%" stopColor="#a5101a" />
          <stop offset="80%" stopColor="#bc2c37" />
          <stop offset="100%" stopColor="#d9666f" />
        </linearGradient>
        {/* single diagonal highlight raked across the letterform */}
        <linearGradient id="ethix-sheen" x1="0" y1="1" x2="0.75" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="42%" stopColor="rgba(255,255,255,0)" />
          <stop offset="52%" stopColor="rgba(255,255,255,0.30)" />
          <stop offset="62%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id="ethix-letter">
          <rect x="0" y="0" width={COL_W} height="100" />
          {E_RUNG_Y.map((y) => (
            <rect key={y} x={COL_W} y={y} width={RUNG_W} height={RUNG_H} />
          ))}
        </clipPath>
        <filter id="ethix-drop" x="-15%" y="-15%" width="135%" height="135%">
          <feDropShadow
            dx="1"
            dy="1.4"
            stdDeviation="1.1"
            floodColor="#7d0a12"
            floodOpacity="0.3"
          />
        </filter>
      </defs>

      <g filter="url(#ethix-drop)">
        {/* upright */}
        <rect
          x="0"
          y="0"
          width={COL_W}
          height="100"
          fill="url(#ethix-col)"
          stroke="#9c0f18"
          strokeWidth="1.2"
        />
        <rect
          x="1.5"
          y="1.5"
          width={COL_W - 3}
          height="97"
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="0.7"
        />

        {/* rungs */}
        {E_RUNG_Y.map((y) => (
          <g key={y}>
            <rect
              x={COL_W}
              y={y}
              width={RUNG_W}
              height={RUNG_H}
              fill="url(#ethix-rung)"
              stroke="#9c0f18"
              strokeWidth="1.2"
            />
            <rect
              x={COL_W + 1.5}
              y={y + 1.5}
              width={RUNG_W - 3}
              height={RUNG_H - 3}
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="0.7"
            />
          </g>
        ))}

        <rect
          x="0"
          y="0"
          width={COL_W + RUNG_W}
          height="100"
          fill="url(#ethix-sheen)"
          clipPath="url(#ethix-letter)"
        />
      </g>
    </svg>
  )
}

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
          <div className="w-full rounded-2xl border-[1.5px] border-[var(--ink)] bg-white">
            {/* masthead — Ethixweb ←→ MegaCloudWorks */}
            <div className="px-7 pb-6 pt-7">
              <div
                data-hero
                className="flex items-center justify-center gap-4 sm:gap-6"
              >
                <EthixwebMark className="h-10 w-auto shrink-0" />
                <span
                  aria-hidden="true"
                  className="link-track h-[3px] w-14 shrink-0 rounded-full sm:w-28"
                />
                <img
                  src="/logo-mark.svg"
                  alt="MegaCloudWorks"
                  className="h-10 w-auto shrink-0"
                />
              </div>
              <div
                data-hero
                className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                  Web &amp; Marketing
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)] sm:text-right">
                  App design &amp; development
                </p>
              </div>
            </div>

            {/* service columns */}
            <div className="grid grid-cols-1 border-t-[1.5px] border-[var(--ink)] sm:grid-cols-2">
              <div data-hero className="px-7 py-7">
                <ServiceList items={ETHIXWEB_SERVICES} />
              </div>
              <div
                data-hero
                className="border-t-[1.5px] border-[var(--ink)] px-7 py-7 sm:border-l-[1.5px] sm:border-t-0"
              >
                <ServiceList items={MEGACLOUD_SERVICES} />
              </div>
            </div>

            {/* cross-sell footer */}
            <div
              data-hero
              className="border-t-[1.5px] border-[var(--ink)] px-7 pb-8 pt-6 text-center"
            >
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
          className="pointer-events-none absolute inset-0 bg-[image:url('/about-background.png')] bg-cover bg-[position:72%_bottom] bg-no-repeat lg:bg-[position:right_bottom]"
        />
        {/* white scrim so the copy stays readable over the photo — the wide crop
            already carries fog on its left, so this only needs a gentle lift */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.8)_28%,rgba(255,255,255,0.35)_44%,rgba(255,255,255,0)_60%)] lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.72)_42%,rgba(255,255,255,0.1)_70%,rgba(255,255,255,0)_88%)] lg:hidden"
        />

        <div className="relative mx-auto flex min-h-[30rem] max-w-[1600px] items-center px-6 pb-56 pt-16 sm:px-10 lg:min-h-[42rem] lg:px-20 lg:pb-20 lg:pt-20">
          <div className="max-w-lg">
            <h2
              data-reveal
              className="font-display text-[clamp(2.25rem,4.4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-[var(--ink)]"
            >
              Ready to build something great?
            </h2>
            <p
              data-reveal
              className="mt-4 max-w-sm text-lg leading-relaxed text-[var(--ink-soft)]"
            >
              Drop your email and we&rsquo;ll reach out the moment we open for
              projects.
            </p>
            <div data-reveal className="mt-8">
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
