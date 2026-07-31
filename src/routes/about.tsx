import { useEffect, useRef } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SiteHeader } from '#/components/site/SiteHeader'
import { SiteFooter } from '#/components/site/SiteFooter'
import { Button } from '#/components/ui/button'
import {
  Sparkles,
  Zap,
  Target,
  Layers,
  Compass,
  ArrowRight,
  Award,
  Users,
  CheckCircle2,
  Globe,
  Code2,
  Feather,
} from 'lucide-react'

export const Route = createFileRoute('/about')({ component: About })

const PILLARS = [
  {
    kicker: '01 / Craft',
    title: 'Precision Design',
    body: 'Every layout, type hierarchy, and micro-animation is crafted to delight users at first glance.',
  },
  {
    kicker: '02 / Clarity',
    title: 'Simplified Workflows',
    body: 'We strip away clutter so users can focus on what matters most without cognitive overload.',
  },
  {
    kicker: '03 / Speed',
    title: 'Uncompromising Speed',
    body: 'Performance is a primary feature. We build lightweight, ultra-fast applications that load instantly.',
  },
  {
    kicker: '04 / Rigor',
    title: 'Robust Engineering',
    body: 'Well-structured, maintainable code architectures that stand up to high scale and heavy usage.',
  },
]

const PRINCIPLES = [
  {
    icon: Compass,
    title: 'Clarity over Complexity',
    body: 'Great software feels effortless. We solve complex underlying problems to deliver simple, intuitive interfaces.',
  },
  {
    icon: Layers,
    title: 'Adaptive Systems',
    body: 'We build flexible design systems and modular codebases that adapt and evolve as your business grows.',
  },
  {
    icon: Target,
    title: 'Focus & Intentionality',
    body: 'Every feature serves a purpose. We eliminate distraction to keep user interactions smooth and targeted.',
  },
  {
    icon: Feather,
    title: 'Lightweight & Fast',
    body: 'Optimized render cycles, lean dependencies, and fast server responses ensure instant interactions.',
  },
  {
    icon: Code2,
    title: 'One Unified Team',
    body: 'Designers and engineers collaborate from day one — eliminating handoff loss and speeding up delivery.',
  },
  {
    icon: Sparkles,
    title: 'Delightful Polish',
    body: 'Subtle motion, fluid hover states, and refined typography that make your brand feel truly premium.',
  },
]

const TEAM = [
  {
    name: 'Amar Singh',
    role: 'Founder',
    bio: 'Former product architect specializing in design systems, micro-interactions, and visual direction.',
    image: '/avatar-1.svg',
    accent: 'Fintech & Design Systems',
  },
  {
    name: 'Elena Rostova',
    role: 'Engineering Lead & Co-Founder',
    bio: 'Full-stack systems engineer focused on WebGL, real-time sync engines, and React 19 architecture.',
    image: '/avatar-2.svg',
    accent: 'Systems & Performance',
  },
  {
    name: 'Marcus Vance',
    role: 'Product Strategy Lead',
    bio: 'Product strategist helping startups turn raw technical capabilities into high-converting user products.',
    image: '/avatar-3.svg',
    accent: 'Product Growth & UX',
  },
]

const STUDIO_METRICS = [
  { value: '50+', label: 'Shipped Applications' },
  { value: '100%', label: 'In-House Execution' },
  { value: '4.9/5', label: 'Average Client Rating' },
  { value: '12+', label: 'Years Experience' },
]

function About() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Hero elements entrance
      gsap.from('[data-hero]', {
        y: 34,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
      })

      // Breathing background glows
      gsap.utils.toArray<HTMLElement>('[data-glow]').forEach((el, i) => {
        gsap.to(el, {
          scale: 1.18,
          opacity: 0.85,
          duration: 6 + i,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })

      // Slowly rotating dashed rings
      gsap.utils.toArray<HTMLElement>('[data-ring]').forEach((el, i) => {
        gsap.to(el, {
          rotate: i % 2 === 0 ? 360 : -360,
          duration: 60 + i * 20,
          ease: 'none',
          repeat: -1,
        })
      })

      // Glowing accent lines draw in
      gsap.from('[data-line]', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.5,
        ease: 'power2.inOut',
        stagger: 0.34,
        scrollTrigger: {
          trigger: '[data-columns]',
          start: 'top 80%',
          toggleActions: 'restart none none reset',
        },
      })

      // Scroll reveals
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
    <div ref={root} className="relative min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <SiteHeader />

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden px-6 pb-20 pt-36 sm:px-10 lg:px-20 lg:pt-44">
        {/* Breathing background glow */}
        <div
          data-glow
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full opacity-70 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(245,51,59,0.14) 0%, rgba(255,106,61,0.09) 40%, rgba(255,255,255,0) 70%)',
          }}
        />

        <div className="relative max-w-3xl">
          <p
            data-hero
            className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand)]"
          >
            Studio & Philosophy
          </p>
          <h1
            data-hero
            className="mt-6 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.03em] text-[var(--ink)]"
          >
            Building software that feels{' '}
            <span className="bg-gradient-to-r from-[var(--brand)] via-[#ff6a3d] to-[#f5333b] bg-clip-text text-transparent">
              clear & joyful.
            </span>
          </h1>
          <p
            data-hero
            className="mt-7 text-lg leading-relaxed text-[var(--ink-soft)]"
          >
            Megacloudworks is an independent design & development studio. We help ambitious companies launch digital products that combine raw technical speed with memorable visual craft.
          </p>
        </div>

        {/* 4 Studio Pillars with Animated Glowing Lines */}
        <div
          data-columns
          className="relative mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PILLARS.map((c) => (
            <div data-reveal key={c.kicker} className="relative pt-7">
              {/* Faint track + animated glowing accent line */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-[var(--line)]"
              />
              <span
                data-line
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] origin-left rounded-full bg-[var(--brand)] shadow-[0_0_16px_rgba(245,51,59,0.85)]"
              />
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--brand)]">
                {c.kicker}
              </p>
              <h3 className="mt-3 font-display text-lg font-bold text-[var(--ink)]">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= OUR STORY & VISION SPOTLIGHT ================= */}
      <section className="relative px-6 py-16 sm:px-10 lg:px-20">
        {/* Dashed background ring */}
        <div
          data-ring
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-1/2 hidden h-[32rem] w-[32rem] -translate-y-1/2 rounded-full border border-dashed border-[var(--line-strong)] lg:block opacity-40"
        />

        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-8 shadow-[0_20px_60px_rgba(16,16,20,0.06)] sm:p-12 lg:p-16"
        >
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
                <Sparkles className="h-3.5 w-3.5" />
                Why We Started
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl lg:text-5xl">
                Software shouldn&apos;t force you to choose between beauty and reliability.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
                We founded Megacloudworks because too many digital tools are either aesthetically pleasing but buggy, or robust but joyless. We bring designers and engineers into the same room from day one so nothing gets lost in translation.
              </p>

              {/* Studio Metrics */}
              <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[var(--line)] pt-8 sm:grid-cols-4">
                {STUDIO_METRICS.map((m) => (
                  <div key={m.label}>
                    <p className="font-display text-2xl font-extrabold text-[var(--brand)] sm:text-3xl">
                      {m.value}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[var(--ink-soft)]">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Interactive Visual Card */}
            <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#161215] via-[#1f1619] to-[#0d0c10] p-6 shadow-2xl">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]" />

              <div className="relative h-full w-full flex flex-col justify-between space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[var(--brand)]" />
                    <span className="text-xs font-mono text-white/70">studio-manifest.ts</span>
                  </div>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-mono text-emerald-400">
                    ACTIVE PIPELINE
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs text-white/80">
                  <p className="text-purple-400">
                    const <span className="text-white">studio</span> = {`{`}
                  </p>
                  <p className="pl-4 text-emerald-400">
                    designSystem: <span className="text-amber-300">&quot;Geologica & Glassmorphism&quot;</span>,
                  </p>
                  <p className="pl-4 text-emerald-400">
                    performanceBudget: <span className="text-cyan-300">&quot;&lt; 100ms TBT&quot;</span>,
                  </p>
                  <p className="pl-4 text-emerald-400">
                    handoffLoss: <span className="text-rose-400">0</span>,
                  </p>
                  <p className="text-purple-400">{`}`}</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md flex items-center justify-between text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[var(--brand)]" />
                    <span>Zero Handoff Friction Engine</span>
                  </div>
                  <span className="font-bold text-emerald-400">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRINCIPLES GRID ================= */}
      <section className="relative px-6 py-20 sm:px-10 lg:px-20">
        <div data-reveal className="max-w-2xl mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
            Core Principles
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
            Guidelines that dictate how we build.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.title}
                data-reveal
                className="group relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[var(--brand)]/30 hover:shadow-[0_20px_50px_rgba(16,16,20,0.08)]"
              >
                {/* Glowing red top line on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 rounded-full bg-[var(--brand)] opacity-0 shadow-[0_0_16px_rgba(245,51,59,0.85)] transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"
                />

                {/* Corner red glow accent */}
                <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 origin-top-right scale-0 bg-gradient-to-br from-[var(--brand)]/15 to-transparent opacity-0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-100" />

                {/* Icon Container */}
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--paper-2)] text-[var(--ink)] border border-[var(--line)] shadow-sm transition-all duration-500 group-hover:border-[var(--brand)]/40 group-hover:bg-[var(--brand)] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[var(--brand)]/20">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="font-display text-xl font-extrabold text-[var(--ink)] transition-colors duration-300 group-hover:text-[var(--brand)]">
                  {p.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {p.body}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ================= LEADERSHIP & TEAM SECTION ================= */}
      <section className="relative bg-[var(--paper-2)] py-24">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-20">
          <div data-reveal className="mb-12 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
              Our Team
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
              People bringing clarity & speed to your product vision.
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {TEAM.map((member) => (
              <div
                key={member.name}
                data-reveal
                className="group relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper)] shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--brand)]/30 hover:shadow-[0_20px_50px_rgba(16,16,20,0.12)]"
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#1b1517] via-[#24171a] to-[#121216]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-3 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[var(--ink)] backdrop-blur-sm shadow-sm">
                    {member.accent}
                  </span>
                </div>

                {/* Info Container */}
                <div className="p-6 sm:p-8">
                  <h3 className="font-display text-2xl font-extrabold text-[var(--ink)] transition-colors group-hover:text-[var(--brand)]">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ENHANCED CTA SECTION ================= */}
      <section className="px-6 py-28 sm:px-10 lg:px-20">
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper-2)] p-10 shadow-[0_4px_20px_rgba(16,16,20,0.06)] sm:p-14 lg:p-16"
        >
          <div
            data-glow
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-70 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(245,51,59,0.14) 0%, rgba(255,106,61,0.09) 45%, rgba(255,255,255,0) 72%)',
            }}
          />
          <div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
                <Zap className="h-3.5 w-3.5" />
                Let&apos;s Build Together
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl lg:text-5xl">
                Ready to create something exceptional?
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-[var(--ink-soft)]">
                Tell us about your product vision — we&apos;ll collaborate with you from concept to launch.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="group shrink-0 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[var(--brand)]/20"
              >
                <Link to="/contact" className="flex items-center gap-2 font-semibold">
                  <span>Get in Touch</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/work">View Our Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
