import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SiteHeader } from '#/components/site/SiteHeader'
import { SiteFooter } from '#/components/site/SiteFooter'
import { BlurText } from '#/components/site/BlurText'
import { Button } from '#/components/ui/button'
import { seo } from '#/lib/seo'

export const Route = createFileRoute('/services')({
  component: Services,
  head: () =>
    seo({
      title: 'What we do',
      description:
        'App design, development, and brand & UI, one team handling strategy, design, and engineering end to end.',
      path: '/services',
    }),
})

const COLUMNS = [
  {
    kicker: 'Services',
    title: 'Design & UX',
    body: 'Research, flows and high-fidelity interfaces, the whole product design journey, not just pretty screens.',
  },
  {
    kicker: 'Technology',
    title: 'Modern stacks',
    body: 'Well-supported, maintainable engineering that keeps working long after launch day.',
  },
  {
    kicker: 'Difference',
    title: 'One team',
    body: 'Designers and engineers in the same room, so nothing gets lost in a handoff between vendors.',
  },
  {
    kicker: 'The promise',
    title: 'Shipped, not stalled',
    body: 'We move in tight increments you can review, and get real product in front of real users fast.',
  },
]

const CIRCLES = [
  { n: '01', title: 'App Design', to: 'app-design' },
  { n: '02', title: 'Development', to: 'app-development' },
  { n: '03', title: 'Brand & UI', to: 'brand-ui' },
]

const SERVICES = [
  {
    id: 'app-design',
    title: 'App Design',
    tagline: 'Product design & UX',
    body: 'We turn a rough idea into a clear, usable product. Research and flows first, then interfaces people actually enjoy, designed in high fidelity and handed off ready to build.',
    img: '/card-design.webp',
    includes: [
      'Discovery, user flows & information architecture',
      'Wireframes and interactive prototypes',
      'High-fidelity UI for every core screen',
      'Design system & component library',
      'Developer-ready handoff and specs',
    ],
  },
  {
    id: 'app-development',
    title: 'App Development',
    tagline: 'Web & mobile engineering',
    body: 'Clean, performant, maintainable code, shipped on a schedule you can plan around. We build with modern, well-supported stacks so what we ship keeps working after launch.',
    img: '/card-development.webp',
    includes: [
      'Web apps, PWAs & cross-platform mobile',
      'API design and backend integration',
      'Performance, accessibility & SEO baked in',
      'CI/CD, testing and release pipelines',
      'Post-launch support and iteration',
    ],
  },
  {
    id: 'brand-ui',
    title: 'Brand & UI',
    tagline: 'Identity & visual systems',
    body: 'A visual language that feels cohesive everywhere, from the logo to the smallest button. We build systems, not one-off screens, so your product looks intentional as it grows.',
    img: '/card-brand.webp',
    includes: [
      'Logo, colour and typography systems',
      'Brand guidelines & usage rules',
      'Reusable UI kit and design tokens',
      'Marketing site and social templates',
      'Illustration and iconography direction',
    ],
  },
]

const PROCESS = [
  {
    step: '01',
    title: 'Discover',
    body: 'We dig into your goals, users and constraints so the work is pointed at the right problem.',
  },
  {
    step: '02',
    title: 'Design',
    body: 'Flows, prototypes and polished UI, validated early, before a line of production code.',
  },
  {
    step: '03',
    title: 'Build',
    body: 'We ship in tight increments you can review, with quality and performance built in.',
  },
  {
    step: '04',
    title: 'Launch',
    body: 'We get it live, measure what matters, and keep iterating alongside you.',
  },
]

function Services() {
  const root = useRef<HTMLDivElement>(null)
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setBeat(99)
      return
    }

    const marks = [60, 280, 560, 820]
    const timers = marks.map((ms, i) =>
      window.setTimeout(() => setBeat(i + 1), ms),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // hero — plays on load
      gsap.from('[data-hero]', {
        y: 34,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
      })

      // slow breathing glow(s)
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

      // slowly rotating dashed rings
      gsap.utils.toArray<HTMLElement>('[data-ring]').forEach((el, i) => {
        gsap.to(el, {
          rotate: i % 2 === 0 ? 360 : -360,
          duration: 60 + i * 20,
          ease: 'none',
          repeat: -1,
        })
      })

      // approach columns: glowing accent lines draw in one after another
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

      // generic scroll reveals
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 42,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })

      // overlapping circles — scale + fade, staggered on scroll
      gsap.from('[data-circle]', {
        scale: 0.82,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.16,
        scrollTrigger: { trigger: '[data-circles]', start: 'top 78%' },
      })

      // circles keep breathing — a soft, out-of-sync glow pulse
      gsap.to('[data-cglow]', {
        opacity: 0.55,
        scale: 1.07,
        duration: 2.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.5, from: 'center' },
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
      <section className="relative overflow-hidden px-6 pb-16 pt-28 sm:px-10 sm:pb-20 sm:pt-36 lg:px-20 lg:pt-44">
        <div
          data-glow
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full opacity-70 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(245,51,59,0.14) 0%, rgba(255,106,61,0.09) 40%, rgba(255,255,255,0) 70%)',
          }}
        />
        {/* the hero runs on the same beat clock as the About hero — one
            language for big type across the site. These carry no `data-hero`,
            so the page's GSAP pass leaves them to BlurText. */}
        <div className="relative max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand)]">
            <BlurText
              as="span"
              text="About our approach to work"
              start={beat >= 1}
              delay={38}
              stepDuration={0.3}
            />
            <span
              aria-hidden="true"
              className={`h-px w-8 origin-left bg-[var(--brand)] transition-transform duration-700 ease-out ${
                beat >= 1 ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </p>
          {/* by words, not letters: BlurText wraps each unit in an
              inline-block, and per-letter units let a line break inside a
              word — "engin / eering" */}
          <h1 className="mt-6 font-display text-[clamp(2.75rem,6.5vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--ink)]">
            <BlurText
              as="span"
              text="Design and engineering,"
              start={beat >= 2}
              delay={90}
              stepDuration={0.34}
              className="block"
            />
            <BlurText
              as="span"
              text="under one roof."
              start={beat >= 3}
              delay={90}
              stepDuration={0.34}
              className="block"
            />
          </h1>
          <BlurText
            text="Three tightly connected services. Take one, or hand us the whole journey, from first sketch to shipped product."
            start={beat >= 4}
            delay={26}
            stepDuration={0.3}
            className="mt-7 text-lg leading-relaxed text-[var(--ink-soft)]"
          />
        </div>

        {/* approach columns */}
        <div
          data-columns
          className="relative mt-14 grid gap-8 sm:mt-20 sm:gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {COLUMNS.map((c) => (
            <div data-reveal key={c.kicker} className="relative pt-7">
              {/* faint track + animated glowing accent line */}
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

      {/* ================= HOW WE WORK — overlapping circles =================
          The About page's band, brought over whole: the same painted sky held
          under the section by a sticky frame, the same red, the same white
          type. The circles are unchanged in structure — they just stand in
          weather now instead of on paper.

          No `overflow-hidden` on this section: a clipping ancestor would make
          it the scroll container for its own sticky sky, which then never
          sticks. */}
      <section
        data-band="paper"
        className="svc-band on-brand relative px-6 py-20 sm:px-10 sm:py-28 lg:px-20 lg:py-36"
      >
        <div aria-hidden="true" className="step-sky">
          <div className="step-sky__hold">
            <img
              src="/about/sky-2.webp"
              alt=""
              loading="lazy"
              decoding="async"
              className="step-sky__plate is-on"
            />
          </div>
        </div>

        <h2
          data-reveal
          className="relative z-10 font-display text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.03em] text-[var(--ink)]"
        >
          How we
          <br />
          work
        </h2>

        <div
          data-circles
          className="relative z-10 mt-10 flex flex-col items-center justify-center gap-5 sm:mt-16 sm:gap-6 md:flex-row md:gap-0"
        >
          {/* the dashed rings survive the move — white on red now */}
          <div
            data-ring
            aria-hidden="true"
            className="pointer-events-none absolute hidden h-[22rem] w-[22rem] rounded-full border border-dashed border-white/30 md:block lg:h-[26rem] lg:w-[26rem]"
          />
          <div
            data-ring
            aria-hidden="true"
            className="pointer-events-none absolute hidden h-[29rem] w-[29rem] rounded-full border border-dashed border-white/18 md:block lg:h-[34rem] lg:w-[34rem]"
          />

          {/* the bank the three discs stand in, the same construction the step
              marks use: shapes drawn white at a low alpha, which over this red
              comes out as the lighter red the sky plate is painted in */}
          <span aria-hidden="true" className="svc-cloud svc-cloud--l" />
          <span aria-hidden="true" className="svc-cloud svc-cloud--r" />

          {CIRCLES.map((c) => (
            <div
              key={c.n}
              data-circle
              className="group relative aspect-square w-[15rem] md:-mx-4 md:w-[13.5rem] lg:-mx-6 lg:w-[19rem]"
            >
              {/* the disc's own weather, sitting just behind it */}
              <span
                data-cglow
                aria-hidden="true"
                className="svc-disc__halo pointer-events-none absolute inset-[-8%] rounded-full blur-2xl transition-opacity duration-500"
              />
              <Link
                to="/services"
                hash={c.to}
                className="svc-disc absolute inset-0 flex flex-col items-center justify-center rounded-full px-4 text-center no-underline"
              >
                <span className="svc-disc__n font-display text-sm font-bold">
                  {c.n}
                </span>
                <span className="svc-disc__title mt-1 font-display text-xl font-extrabold tracking-tight lg:text-3xl">
                  {c.title}
                </span>
                <span className="svc-disc__more mt-3 text-sm font-semibold">
                  Find out more →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SERVICE DETAIL ================= */}
      <section className="px-6 pb-8 sm:px-10 lg:px-20">
        <div className="flex flex-col gap-6">
          {SERVICES.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              data-reveal
              className="scroll-mt-28 overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-6 shadow-[0_1px_2px_rgba(16,16,20,0.04)] sm:p-10"
            >
              <div className="grid gap-7 sm:gap-8 lg:grid-cols-[1fr_1.1fr]">
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-6 -top-6 size-40 rounded-full opacity-70 blur-3xl"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(245,51,59,0.14) 0%, rgba(255,106,61,0.08) 45%, rgba(255,255,255,0) 72%)',
                    }}
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <span className="font-display text-4xl font-extrabold text-[var(--brand)] sm:text-5xl">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <img
                      src={s.img}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="-mr-6 -mt-2 h-28 w-28 shrink-0 object-contain drop-shadow-[0_16px_24px_rgba(16,16,20,0.14)] sm:mr-0 sm:h-40 sm:w-40 lg:-mr-8 lg:h-44 lg:w-44"
                    />
                  </div>
                  <p className="relative mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                    {s.tagline}
                  </p>
                  <h3 className="relative mt-1 font-display text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
                    {s.title}
                  </h3>
                  <p className="relative mt-4 max-w-md text-base leading-relaxed text-[var(--ink-soft)]">
                    {s.body}
                  </p>
                </div>

                <div className="lg:border-l lg:border-[var(--line)] lg:pl-8">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                    What&apos;s included
                  </p>
                  <ul className="mt-4 flex flex-col gap-3">
                    {s.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[15px] leading-snug text-[var(--ink)]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--brand)]"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="px-6 py-16 sm:px-10 sm:py-24 lg:px-20">
        <h2
          data-reveal
          className="font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl"
        >
          How we work, step by step
        </h2>
        <div className="mt-8 grid gap-7 sm:mt-10 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <div
              data-reveal
              key={p.step}
              className="border-t border-[var(--line)] pt-5"
            >
              <span className="font-display text-sm font-extrabold text-[var(--brand)]">
                {p.step}
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-[var(--ink)]">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 pb-20 sm:px-10 sm:pb-28 lg:px-20">
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper-2)] p-6 sm:p-12"
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
          <div className="relative flex flex-col items-stretch gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl">
                Have something in mind?
              </h2>
              <p className="mt-2 text-[var(--ink-soft)]">
                Tell us about your project, we&apos;ll come back with a plan.
              </p>
            </div>
            <Button asChild size="lg" className="w-full shrink-0 sm:w-auto">
              <Link to="/contact">Start a project</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
