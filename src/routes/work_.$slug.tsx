import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  MapPin,
  FileText,
  Camera,
  Users,
  WifiOff,
  Stamp,
  Bell,
  Gift,
  ScanLine,
  CalendarCheck2,
  Clock,
  Repeat,
  Smartphone,
  ClipboardList,
  Activity,
  FolderClock,
  PenLine,
  Kanban,
  Filter,
  UserPlus,
  Mail,
} from 'lucide-react'
import { SiteHeader } from '#/components/site/SiteHeader'
import { SiteFooter } from '#/components/site/SiteFooter'
import { PhoneMockup } from '#/components/site/PhoneMockup'
import { Button } from '#/components/ui/button'
import { CONCEPTS, getConcept } from '#/lib/concepts'
import type { ConceptIconName } from '#/lib/concepts'
import { CONCEPT_SCREENS } from '#/lib/conceptScreens'
import { seo } from '#/lib/seo'

const ICONS: Record<ConceptIconName, typeof CalendarClock> = {
  CalendarClock,
  MapPin,
  FileText,
  Camera,
  Users,
  WifiOff,
  Stamp,
  Bell,
  Gift,
  ScanLine,
  CalendarCheck2,
  Clock,
  Repeat,
  Smartphone,
  ClipboardList,
  Activity,
  FolderClock,
  PenLine,
  Kanban,
  Filter,
  UserPlus,
  Mail,
}

export const Route = createFileRoute('/work_/$slug')({
  component: ConceptDetail,
  loader: ({ params }) => {
    const concept = getConcept(params.slug)
    if (!concept) throw notFound()
    return concept
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    return seo({
      title: `${loaderData.name} · ${loaderData.tagline}`,
      description: loaderData.blurb,
      path: `/work/${loaderData.slug}`,
    })
  },
})

const META = ['platform', 'timeline', 'category'] as const

function ConceptDetail() {
  const concept = Route.useLoaderData()
  const root = useRef<HTMLDivElement>(null)
  const screens = CONCEPT_SCREENS[concept.slug] ?? []
  const [activeScreen, setActiveScreen] = useState(0)
  const ActiveScreen = screens[activeScreen]

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
        stagger: 0.1,
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
  }, [concept.slug])

  useEffect(() => {
    setActiveScreen(0)
  }, [concept.slug])

  const currentIndex = CONCEPTS.findIndex((c) => c.slug === concept.slug)
  const next = CONCEPTS[(currentIndex + 1) % CONCEPTS.length]

  return (
    <div
      ref={root}
      className="relative min-h-screen bg-[var(--paper)] text-[var(--ink)]"
    >
      <SiteHeader tone="dark" />

      {/* ================= HERO ================= */}
      <section
        className="relative overflow-hidden pt-24 lg:pt-28"
        style={{
          background: `linear-gradient(160deg, ${concept.heroFrom} 0%, ${concept.heroTo} 100%)`,
        }}
      >
        <div className="relative mx-auto max-w-[1400px] px-6 pb-16 pt-8 sm:px-10 lg:px-20 lg:pb-24 lg:pt-12">
          <Link
            data-hero
            to="/work"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 no-underline transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Work
          </Link>

          <div className="mt-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div>
              <span
                data-hero
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white/85"
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full"
                  style={{ background: concept.accent }}
                />
                {concept.category} · Case Study
              </span>
              <h1
                data-hero
                className="mt-5 font-display text-[clamp(2.5rem,6.5vw,5rem)] font-extrabold leading-[0.92] tracking-[-0.03em] text-white"
              >
                {concept.name}.
                <br />
                {concept.tagline}
              </h1>
              <p
                data-hero
                className="mt-5 max-w-md text-base leading-relaxed text-white/70 sm:text-lg"
              >
                {concept.blurb}
              </p>
              <div data-hero className="mt-7 flex flex-wrap gap-2">
                {[concept.platform, concept.category, concept.year].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white/85"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div
              data-hero
              data-hero-anchor
              className="mx-auto w-full max-w-[260px]"
            >
              <div className="mb-4 flex items-center justify-center gap-2">
                <span className="relative flex size-1.5">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ background: concept.accent }}
                  />
                  <span
                    className="relative inline-flex size-1.5 rounded-full"
                    style={{ background: concept.accent }}
                  />
                </span>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/60">
                  {concept.screens[activeScreen]}
                </p>
              </div>
              <PhoneMockup>
                <ActiveScreen accent={concept.accent} />
              </PhoneMockup>
              {screens.length > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  {screens.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveScreen(i)}
                      aria-label={`Show ${concept.screens[i]}`}
                      aria-current={activeScreen === i}
                      className="group/dot flex h-11 min-w-11 items-center justify-center px-2"
                    >
                      <span
                        className="block h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: activeScreen === i ? '20px' : '6px',
                          background:
                            activeScreen === i
                              ? concept.accent
                              : 'rgba(255,255,255,0.3)',
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= META STRIP ================= */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 px-6 py-8 sm:px-10 lg:grid-cols-4 lg:px-20">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              Role
            </p>
            <p className="mt-1.5 text-sm font-semibold text-[var(--ink)]">
              App Design &amp; Development
            </p>
          </div>
          {META.map((key) => (
            <div key={key}>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                {key}
              </p>
              <p className="mt-1.5 text-sm font-semibold capitalize text-[var(--ink)]">
                {concept[key]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PROBLEM ================= */}
      <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p
            data-reveal
            className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]"
          >
            The problem
          </p>
          <h2
            data-reveal
            className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl"
          >
            {concept.problemTitle}
          </h2>
          <div className="mt-6 space-y-4">
            {concept.problemBody.map((p, i) => (
              <p
                key={i}
                data-reveal
                className="text-base leading-relaxed text-[var(--ink-soft)]"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ================= KEY SCREENS ================= */}
      <section className="bg-[var(--paper-2)] px-6 py-16 sm:px-10 sm:py-20 lg:px-20">
        <p
          data-reveal
          className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]"
        >
          Key screens
        </p>
        <h2
          data-reveal
          className="mt-3 max-w-xl font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl"
        >
          {concept.screensSubtitle}
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {concept.screens.map((label, i) => {
            const Screen = screens[i]
            const isActive = activeScreen === i
            return (
              <button
                key={label}
                type="button"
                data-reveal
                onClick={() => {
                  setActiveScreen(i)
                  root.current
                    ?.querySelector('[data-hero-anchor]')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }}
                aria-current={isActive}
                className="group block text-left"
              >
                <div
                  className="relative aspect-[9/18.5] w-full overflow-hidden rounded-[1.75rem] border-2 bg-[var(--paper)] p-1.5 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
                  style={{
                    borderColor: isActive ? concept.accent : 'var(--line)',
                    boxShadow: isActive
                      ? `0 12px 32px -12px ${concept.accent}55`
                      : undefined,
                  }}
                >
                  <div className="h-full w-full overflow-hidden rounded-[1.4rem]">
                    <Screen accent={concept.accent} />
                  </div>
                </div>
                <p
                  className="mt-3 text-center text-sm font-semibold transition-colors"
                  style={{ color: isActive ? concept.accent : 'var(--ink)' }}
                >
                  {label}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-20">
        <p
          data-reveal
          className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]"
        >
          Features
        </p>
        <h2
          data-reveal
          className="mt-3 max-w-xl font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl"
        >
          {concept.featuresSubtitle}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {concept.features.map((f) => {
            const Icon = ICONS[f.icon]
            return (
              <div
                key={f.title}
                data-reveal
                className="bg-[var(--paper)] p-6 sm:p-7"
              >
                <div
                  className="inline-flex size-10 items-center justify-center rounded-xl border"
                  style={{
                    borderColor: 'var(--line-strong)',
                    color: concept.accent,
                  }}
                >
                  <Icon className="size-[18px]" strokeWidth={2} />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-[var(--ink)]">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {f.body}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ================= DESIGN APPROACH ================= */}
      <section className="bg-[var(--paper-2)] px-6 py-16 sm:px-10 sm:py-20 lg:px-20">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-2 lg:gap-16">
          <div data-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
              Design approach
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl">
              A visual system built for this problem, not a template.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--ink-soft)]">
              Every concept ships with its own small design system, colour,
              type, and interaction choices made for that product&rsquo;s
              context, not inherited from a shared kit.
            </p>
          </div>

          <div
            data-reveal
            className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)]"
          >
            <div className="border-b border-[var(--line)] px-6 py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--ink-faint)]">
                Colour palette
              </p>
            </div>
            {concept.palette.map((c) => (
              <div
                key={c.hex}
                className="flex items-center gap-4 border-b border-[var(--line)] px-5 py-4 last:border-b-0 sm:px-6"
              >
                <span
                  className="size-9 shrink-0 rounded-lg"
                  style={{ background: c.swatch }}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[var(--ink)]">
                    {c.name}
                  </p>
                  <p className="text-xs text-[var(--ink-faint)]">{c.note}</p>
                </div>
                <span className="shrink-0 rounded-md border border-[var(--line)] bg-[var(--paper-2)] px-2 py-1 font-mono text-[11px] text-[var(--ink-soft)]">
                  {c.hex}
                </span>
              </div>
            ))}
          </div>

          <div
            data-reveal
            className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] lg:col-start-2"
          >
            <div className="border-b border-[var(--line)] px-6 py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--ink-faint)]">
                Typeface · {concept.typeface}
              </p>
            </div>
            <div
              className="p-6"
              style={{ background: concept.accentInk, color: 'white' }}
            >
              <p
                className="text-2xl font-extrabold uppercase tracking-tight"
                style={{ color: concept.accent }}
              >
                {concept.name}
              </p>
              <p className="mt-1 text-lg font-bold">{concept.tagline}</p>
              <div className="mt-5 flex gap-2">
                {['Regular', 'Semibold', 'Bold', 'Extrabold'].map((w) => (
                  <div
                    key={w}
                    className="flex-1 rounded-lg border border-white/15 bg-white/5 py-2.5 text-center"
                  >
                    <p className="text-sm font-bold">Aa</p>
                    <p className="mt-1 text-[9px] text-white/50">{w}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <span
                  className="rounded-lg px-4 py-2 text-xs font-bold"
                  style={{
                    background: concept.accent,
                    color: concept.accentInk,
                  }}
                >
                  {concept.features[0]?.title ?? 'Primary action'}
                </span>
                <span className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white/80">
                  {concept.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 pb-16 sm:px-10 sm:pb-20 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div
            data-reveal
            className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper-2)] p-6 sm:rounded-3xl sm:p-12"
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
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl">
                  Want an app like {concept.name}?
                </h2>
                <p className="mt-2 text-sm text-[var(--ink-soft)] sm:text-base">
                  We design and build focused tools for real industries.
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
                  <span>Get in touch</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 border-t border-[var(--line)] pt-6">
            <Link
              to="/work/$slug"
              params={{ slug: next.slug }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)] no-underline transition-colors hover:text-[var(--brand)]"
            >
              Next concept: {next.name}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
