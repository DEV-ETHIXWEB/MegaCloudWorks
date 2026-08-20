import { useCallback, useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SiteHeader } from '#/components/site/SiteHeader'
import { SiteFooter } from '#/components/site/SiteFooter'
import { SummitCta } from '#/components/site/SummitCta'
import { StudioBridge } from '#/components/site/StudioBridge'
import { PageWash } from '#/components/site/PageWash'
import { StepRow } from '#/components/site/StepRow'
import { TeamExpertise } from '#/components/site/TeamExpertise'
import { StepTrail } from '#/components/site/StepTrail'
import { StepSky } from '#/components/site/StepSky'
import { seo } from '#/lib/seo'

export const Route = createFileRoute('/about')({
  component: About,
  head: () =>
    seo({
      title: 'About',
      description:
        'MegaCloudWorks is an app design & development studio built by the team behind Ethixweb, years of real client work, now aimed squarely at apps.',
      path: '/about',
    }),
})

// The route crosses the section rather than running down its middle: the
// first three beats take alternating sides and the fourth lands in the
// centre, where the two sides meet.
const STEPS = [
  {
    n: '01',
    art: '/card-brand-400.webp',
    side: 'left',
    title: 'Understand',
    desc: 'We start with your problem, not a template: who this is for, what it has to do, and what counts as done.',
  },
  {
    n: '02',
    art: '/card-design-400.webp',
    side: 'right',
    title: 'Design',
    desc: 'We shape the flows before the pixels, then draw an interface that makes the next step obvious.',
  },
  {
    n: '03',
    art: '/card-development-400.webp',
    side: 'left',
    title: 'Build',
    desc: 'We develop it properly - tested, reviewed, and built to hold up as the product and its traffic grow.',
  },
  {
    n: '04',
    art: '/process/rocket-growth.webp',
    side: 'center',
    title: 'Ship & Evolve',
    desc: 'We launch, watch how it is actually used, and keep improving it release after release.',
  },
] as const

function About() {
  const root = useRef<HTMLDivElement>(null)
  // how far down the "How we work" route the reader has walked - each row
  // reports in as it arrives, and the spine draws itself to match
  const steps = useRef<HTMLDivElement>(null)
  const [reached, setReached] = useState(0)
  const reach = useCallback(
    (index: number) => setReached((cur) => Math.max(cur, index + 1)),
    [],
  )
  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    let ctx: gsap.Context | undefined

    try {
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // the headline copy is plain type now, so the only thing left for
        // GSAP here is the photograph. It fades - the slow drift/scale lives
        // in CSS on the <img> itself, and a GSAP transform on the same
        // element would be steamrolled by that animation anyway.
        gsap.from('[data-hero-art]', {
          opacity: 0,
          duration: 1.4,
          ease: 'power2.out',
        })

        // The type on this page does not animate at all any more - no
        // scroll-gated fades on `[data-reveal]`, no per-line reveal in "How
        // we work". Only the marks and the artwork move; the words are
        // simply there to be read the moment they are on screen.
      }, root)
    } catch {
      // animation setup failed for any reason (extension conflict, GSAP
      // load error, etc.) - bail out silently rather than leaving
      // scroll-gated content stuck at opacity:0 with no way to reveal it
      gsap.set('[data-hero-art], [data-callout], [data-reveal], [data-step]', {
        clearProps: 'all',
      })
      return
    }

    // photographs load async and change document height; refresh once they
    // land so ScrollTrigger's trigger positions reflect final layout
    const images = Array.from(document.querySelectorAll('img'))
    const onImageSettle = () => ScrollTrigger.refresh()
    images.forEach((img) => {
      if (img.complete) return
      img.addEventListener('load', onImageSettle, { once: true })
      img.addEventListener('error', onImageSettle, { once: true })
    })

    // absolute safety net: if a section is still invisible five seconds
    // after mount (animation library failed silently, a trigger never
    // fired, etc.) force it visible so content can never be permanently lost
    const safetyTimer = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>('[data-reveal], [data-step]')
        .forEach((el) => {
          if (getComputedStyle(el).opacity === '0') {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.4 })
          }
        })
    }, 5000)

    return () => {
      window.clearTimeout(safetyTimer)
      images.forEach((img) => {
        img.removeEventListener('load', onImageSettle)
        img.removeEventListener('error', onImageSettle)
      })
      ctx.revert()
    }
  }, [])

  return (
    <div
      ref={root}
      className="relative min-h-screen overflow-x-clip text-[var(--ink)]"
    >
      {/* the page's colour lives here, not on the sections: it cross-fades
          between paper and brand as the bands come up */}
      <PageWash />

      {/* ================= 1. HERO - Design. Build. Ship. ================= */}
      {/* the mountain photograph sits behind the (transparent, absolutely
          positioned) SiteHeader from y:0, so it reads as one continuous
          backdrop rather than starting below the nav */}
      <section
        data-band="paper"
        className="relative overflow-hidden pb-0 sm:pb-16 lg:pb-0 lg:min-h-[44rem] xl:min-h-[50rem]"
      >
        {/* ---- background photograph, full width, starts at the very top ---- */}
        {/* from lg up the photograph is a backdrop the headline sits over; below
            that it becomes its own block underneath the copy (further down), so
            the text never has to fight the image for contrast */}
        <div
          data-hero-art
          className="absolute inset-x-0 top-0 hidden lg:block lg:h-[44rem] xl:h-[50rem]"
        >
          {/* two masks, intersected: the left edge dissolves into the copy
              column and the bottom dissolves into the paper below, so the
              photograph has no cut edge anywhere it meets the page */}
          <div className="hero-mask absolute inset-0 overflow-hidden">
            <img
              src="/about/hero.webp"
              alt="A red basecamp tent pitched on a dark volcanic ridge beneath a snow-capped mountain, red signal smoke drifting past a weather mast."
              className="hero-drift absolute inset-0 h-full w-full object-cover object-[70%_46%]"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            {/* the signal smoke keeps moving: a slow brand-tinted haze drifting
                across the ridge, so the frame never reads as a flat still */}
            <span aria-hidden="true" className="hero-haze" />
            <span aria-hidden="true" className="hero-sheen" />
          </div>

          {/* ---- basecamp callout ---- */}
          {/* only shown from lg up - below that the mask keeps the mast/tent
              close to the text column, leaving no clean spot for the label */}
          <div
            data-callout
            className="callout is-on pointer-events-none absolute left-[40%] top-[48%] hidden w-[13.5rem] lg:block"
          >
            <div className="flex items-center gap-3">
              <div className="w-[9.5rem] shrink-0">
                <p className="text-[11px] font-bold uppercase leading-tight tracking-[0.1em] text-[var(--brand)]">
                  MegaCloudWorks
                </p>
                <p className="text-[11px] font-bold uppercase leading-tight tracking-[0.1em] text-[var(--ink)]">
                  Basecamp
                </p>
              </div>
              {/* the leader strikes rather than fades: it grows in stepped
                  stutters like a tube light finding its charge */}
              <span
                aria-hidden="true"
                className="callout__wire h-px flex-1 bg-[var(--brand)]"
              />
              <span
                aria-hidden="true"
                className="callout__pip relative size-[7px] shrink-0 rounded-full bg-[var(--brand)]"
              >
                <span
                  aria-hidden="true"
                  className="callout__drop absolute left-1/2 top-full h-20 w-px -translate-x-1/2 bg-gradient-to-b from-[var(--brand)] to-[var(--brand)]/15"
                />
              </span>
            </div>
            <p className="mt-1.5 w-[9.5rem] text-[10.5px] font-semibold uppercase leading-snug tracking-[0.06em] text-[var(--ink-soft)]">
              App design &amp; development
            </p>
          </div>
        </div>

        <SiteHeader ctaLabel="Get notified" />

        {/* ---- headline copy, floats over the photograph's left/top ---- */}
        <div className="relative z-10 px-6 pb-10 pt-28 sm:px-10 sm:pb-12 sm:pt-32 lg:px-20 lg:pb-0 lg:pt-40">
          <div className="mx-auto max-w-[1600px]">
            <div className="max-w-xl">
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
                <span>About us</span>
                <span
                  aria-hidden="true"
                  className="h-px w-8 origin-left bg-[var(--brand)]"
                />
              </p>
              <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.25rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--ink)]">
                <span className="block">Design.</span>
                <span className="block">Build.</span>
                <span className="block text-[var(--brand)]">Ship.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--ink-soft)]">
                We partner with businesses through two studios to create digital
                experiences that work.
              </p>
            </div>
          </div>
        </div>

        {/* ---- below lg the photograph gets its own full-bleed block under the
            copy, with the basecamp label sitting above it as a caption ---- */}
        <div className="lg:hidden">
          <div className="px-6 sm:px-10">
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <p className="text-[11px] font-bold uppercase leading-tight tracking-[0.1em] text-[var(--brand)]">
                  MegaCloudWorks
                </p>
                <p className="text-[11px] font-bold uppercase leading-tight tracking-[0.1em] text-[var(--ink)]">
                  Basecamp
                </p>
              </div>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-[var(--brand)]"
              />
              <span
                aria-hidden="true"
                className="size-[7px] shrink-0 rounded-full bg-[var(--brand)]"
              />
            </div>
            <p className="mt-1.5 text-[10.5px] font-semibold uppercase leading-snug tracking-[0.06em] text-[var(--ink-soft)]">
              App design &amp; development
            </p>
          </div>

          <div
            className="hero-mask--foot relative mt-5 h-[21rem] overflow-hidden sm:h-[26rem]"
          >
            <img
              src="/about/hero.webp"
              alt="A red basecamp tent pitched on a dark volcanic ridge beneath a snow-capped mountain, red signal smoke drifting past a weather mast."
              className="hero-drift h-full w-full object-cover object-[80%_62%]"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <span aria-hidden="true" className="hero-haze" />
          </div>
        </div>
      </section>

      {/* ================= 2. TWO STUDIOS - on paper ================= */}
      <section
        data-band="paper"
        className="relative px-6 pb-24 pt-12 sm:px-10 sm:pb-28 sm:pt-16 lg:px-20 lg:pb-32 lg:pt-20"
      >
        <div className="mx-auto max-w-[1600px]">
          <p
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink)]"
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-[var(--brand)]"
            />
            Two studios. One team.
          </p>

          <div className="mt-6">
            <StudioBridge />
          </div>
        </div>
      </section>

      {/* ================= 3. HOW WE WORK ================= */}
      {/* This band paints itself rather than handing the page over to
          <PageWash>: it stays `paper` as far as the wash is concerned and
          carries its own ground - the artwork behind it is pale through the
          middle, which is exactly where the type sits, so the section keeps
          the page's ordinary ink and red instead of inverting.

          No overflow clipping here either: the plate is held by a sticky
          frame, and a clipping ancestor would make this section its scroll
          container - at which point it would never stick. */}
      <section
        data-band="paper"
        className="step-band relative px-6 py-24 sm:px-10 sm:py-28 lg:px-20 lg:py-36"
      >
        {/* the sky the four steps are walked across */}
        <StepSky />

        <div className="relative z-10 mx-auto max-w-[72rem]">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink)]">
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-[var(--brand)]"
            />
            How we work
          </p>

          <h2 className="mt-5 max-w-[22ch] font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-[var(--ink)]">
            Four moves, in the same order, every time.
          </h2>
        </div>

        {/* The route runs the full width of the band, not the width of the
            heading above it: the marks are pushed right out to the page's
            margins so the trail has real distance to cross. The copy is
            unaffected - a two-column grid splits on the page's centre line
            whatever its outer width, so the text still starts (or ends)
            exactly where it did. */}
        <div ref={steps} className="relative z-10 mt-20 sm:mt-24">
          <StepTrail scope={steps} active={reached} />

          {/* stacked there is no route drawn between the rows, so the gap is
              doing nothing but separating them - a desktop-sized one just
              leaves a phone scrolling through empty red */}
          <ol className="relative z-10 flex list-none flex-col gap-12 p-0 sm:gap-32">
            {STEPS.map((step, i) => (
              <StepRow
                key={step.n}
                step={step}
                index={i}
                side={step.side}
                onLit={reach}
              />
            ))}
          </ol>
        </div>
      </section>

      {/* ================= 4. TEAM & EXPERTISE ================= */}
      <section
        data-band="paper"
        className="relative px-6 py-24 sm:px-10 sm:py-28 lg:px-20 lg:py-32"
      >
        <div className="mx-auto max-w-[1600px]">
          <TeamExpertise />
        </div>
      </section>

      {/* ================= 5. NOTIFY CTA - back on paper ================= */}
      <section
        data-band="paper"
        className="relative overflow-hidden bg-[var(--paper)]"
      >
        {/* the mountain plates live inside SummitCta: they are the last beat
            of its sequence, not a permanent backdrop */}
        <SummitCta />
      </section>

      <SiteFooter tone="dark" variant="compact" />
    </div>
  )
}

export default About
