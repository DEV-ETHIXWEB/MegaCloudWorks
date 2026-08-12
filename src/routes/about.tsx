import { useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Globe, LineChart, PenTool, Smartphone, Code2, Layers } from 'lucide-react'
import { SiteHeader } from '#/components/site/SiteHeader'
import { SiteFooter } from '#/components/site/SiteFooter'
import { NotifyForm } from '#/components/site/NotifyForm'
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

const ETHIXWEB_SERVICES = [
  { label: 'Websites', icon: Globe },
  { label: 'Marketing', icon: LineChart },
  { label: 'Brand & Content', icon: PenTool },
] as const

const MEGACLOUD_SERVICES = [
  { label: 'App Design', icon: Smartphone },
  { label: 'Development', icon: Code2 },
  { label: 'UI / UX Systems', icon: Layers },
] as const

const STEPS = [
  {
    n: '01',
    icon: '/about/step-1.svg',
    title: 'Understand',
    desc: 'Clarify the problem and the goals.',
  },
  {
    n: '02',
    icon: '/about/step-2.svg',
    title: 'Design',
    desc: 'Craft intuitive flows and thoughtful UI.',
  },
  {
    n: '03',
    icon: '/about/step-3.svg',
    title: 'Build',
    desc: 'Develop with quality and scalability.',
  },
  {
    n: '04',
    icon: '/about/step-4.svg',
    title: 'Ship & Evolve',
    desc: 'Launch, measure and keep improving.',
  },
] as const

function ServiceList({
  items,
  emphasis = false,
}: {
  items: ReadonlyArray<{ label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }>
  emphasis?: boolean
}) {
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-7">
      {items.map(({ label, icon: Icon }) => (
        <li
          key={label}
          className="flex items-center gap-2 text-[13.5px] font-medium text-[var(--ink-soft)] sm:text-sm"
        >
          <Icon
            className={
              emphasis
                ? 'size-4 shrink-0 text-[var(--brand)]'
                : 'size-4 shrink-0 text-[var(--ink-faint)]'
            }
            strokeWidth={1.75}
          />
          {label}
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

    let ctx: gsap.Context | undefined

    try {
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.from('[data-hero]', {
          y: 34,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
        })

        gsap.from('[data-hero-art]', {
          scale: 1.06,
          opacity: 0,
          duration: 1.3,
          ease: 'power3.out',
          delay: 0.15,
        })

        gsap.from('[data-callout]', {
          opacity: 0,
          x: 16,
          duration: 0.9,
          ease: 'power2.out',
          delay: 0.9,
        })

        // an element already on-screen at mount (common on tall viewports,
        // or once the hero photo finishes loading and shrinks the page)
        // will never fire ScrollTrigger's onEnter, since that only fires on
        // a scroll/refresh crossing — so those play immediately instead of
        // waiting on a trigger that has already been passed
        const revealables = gsap.utils.toArray<HTMLElement>('[data-reveal]')
        const inView = (el: HTMLElement) =>
          el.getBoundingClientRect().top < window.innerHeight * 0.92

        revealables.forEach((el) => {
          if (inView(el)) {
            gsap.from(el, { y: 42, opacity: 0, duration: 0.9, ease: 'power3.out' })
            return
          }
          gsap.from(el, {
            y: 42,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              invalidateOnRefresh: true,
            },
          })
        })

        // "How we work" steps cascade in on scroll. The connector arrows
        // between them are static (no animation) — they're small enough,
        // and few enough, that animating them added visual-consistency
        // risk (a tween landing on a stuck/zero-scale frame under certain
        // scroll patterns) without adding anything the step cascade
        // itself doesn't already sell.
        const steps = gsap.utils.toArray<HTMLElement>('[data-step]')
        const stepsTrigger = document.querySelector<HTMLElement>('[data-steps]')
        const stepsInView = stepsTrigger ? inView(stepsTrigger) : false

        steps.forEach((el, i) => {
          if (stepsInView) {
            gsap.from(el, { y: 28, opacity: 0, duration: 0.7, delay: i * 0.14, ease: 'power3.out' })
            return
          }
          gsap.from(el, {
            y: 28,
            opacity: 0,
            duration: 0.7,
            delay: i * 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '[data-steps]',
              start: 'top 92%',
              invalidateOnRefresh: true,
            },
          })
        })
      }, root)
    } catch {
      // animation setup failed for any reason (extension conflict, GSAP
      // load error, etc.) — bail out silently rather than leaving
      // scroll-gated content stuck at opacity:0 with no way to reveal it
      gsap.set('[data-hero], [data-hero-art], [data-callout], [data-reveal], [data-step], [data-step-line]', {
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
      document.querySelectorAll<HTMLElement>('[data-reveal], [data-step]').forEach((el) => {
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
      className="relative min-h-screen overflow-x-clip bg-[var(--paper)] text-[var(--ink)]"
    >
      {/* ================= 1. HERO — Design. Build. Ship. ================= */}
      {/* the mountain photograph sits behind the (transparent, absolutely
          positioned) SiteHeader from y:0, so it reads as one continuous
          backdrop rather than starting below the nav */}
      <section className="relative overflow-hidden pb-16 lg:pb-0 lg:min-h-[44rem] xl:min-h-[50rem]">
        {/* ---- background photograph, full width, starts at the very top ---- */}
        {/* the mask pushes much further right at narrow widths — there's far
            less horizontal room before the headline column, so the tent/mast
            need to stay well clear of the text instead of sitting under it */}
        <div className="absolute inset-x-0 top-0 h-[34rem] sm:h-[38rem] lg:h-[44rem] xl:h-[50rem]">
          <img
            data-hero-art
            src="/about/hero.webp"
            alt="A red basecamp tent pitched on a dark volcanic ridge beneath a snow-capped mountain, red signal smoke drifting past a weather mast."
            className="absolute inset-0 h-full w-full object-cover object-[78%_46%] [mask-image:linear-gradient(to_right,transparent_0%,transparent_62%,black_92%)] sm:object-[74%_46%] sm:[mask-image:linear-gradient(to_right,transparent_0%,transparent_48%,black_78%)] lg:object-[70%_46%] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_34%)]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          {/* protective scrim behind the headline on mobile/tablet, where the
              photograph and text column overlap in the same stacking order */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--paper)] via-[var(--paper)]/85 to-transparent lg:hidden"
          />

          {/* ---- basecamp callout ---- */}
          {/* only shown from lg up — below that the mask keeps the mast/tent
              close to the text column, leaving no clean spot for the label */}
          <div
            data-callout
            className="pointer-events-none absolute left-[40%] top-[48%] hidden w-[13.5rem] lg:block"
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
              <span aria-hidden="true" className="h-px flex-1 bg-[var(--brand)]" />
              <span
                aria-hidden="true"
                className="relative size-[7px] shrink-0 rounded-full bg-[var(--brand)]"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-full h-20 w-px -translate-x-1/2 bg-gradient-to-b from-[var(--brand)] to-[var(--brand)]/15"
                />
              </span>
            </div>
            <p className="mt-1.5 w-[9.5rem] text-[10.5px] font-semibold uppercase leading-snug tracking-[0.06em] text-[var(--ink-soft)]">
              App design &amp; development
            </p>
          </div>
        </div>

        <SiteHeader servicesLabel="What we do" ctaLabel="Get notified" />

        {/* ---- headline copy, floats over the photograph's left/top ---- */}
        <div className="relative z-10 px-6 pb-20 pt-28 sm:px-10 sm:pb-32 sm:pt-32 lg:px-20 lg:pb-0 lg:pt-40">
          <div className="mx-auto max-w-[1600px]">
            <div className="max-w-xl">
              <p
                data-hero
                className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]"
              >
                About us
                <span aria-hidden="true" className="h-px w-8 bg-[var(--brand)]" />
              </p>
              <h1
                data-hero
                className="mt-5 font-display text-[clamp(3rem,7vw,5.25rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--ink)]"
              >
                Design.
                <br />
                Build.
                <br />
                <span className="text-[var(--brand)]">Ship.</span>
              </h1>
              <p
                data-hero
                className="mt-6 max-w-md text-lg leading-relaxed text-[var(--ink-soft)]"
              >
                We partner with businesses through two studios to create
                digital experiences that work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. TWO STUDIOS / HOW WE WORK PANEL ================= */}
      <section className="relative px-6 pb-20 pt-16 sm:px-10 lg:px-20 lg:pb-28 lg:pt-20">
        <div
          data-reveal
          className="mx-auto max-w-[1600px] rounded-[28px] border border-[var(--line)] bg-[var(--paper-2)]/60 p-5 sm:p-8 lg:p-10"
        >
          {/* ---- Two studios, one team ---- */}
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink)]">
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-[var(--brand)]"
            />
            Two studios. One team.
          </p>

          <div className="relative mt-6 grid grid-cols-1 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] sm:grid-cols-2">
            {/* connector plus, centered on the divider */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper)] sm:flex"
            >
              <span className="text-base font-semibold text-[var(--brand)]">
                +
              </span>
            </div>

            {/* ethixweb column */}
            <div className="flex flex-col gap-5 p-6 sm:p-8">
              <div>
                <h3 className="flex items-center gap-3 font-display text-xl font-extrabold tracking-tight text-[var(--ink)] sm:text-2xl">
                  <span className="whitespace-nowrap">Ethixweb</span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 max-w-10 bg-[var(--line-strong)]"
                  />
                </h3>
                <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                  Web &amp; Marketing
                </p>
              </div>

              <ServiceList items={ETHIXWEB_SERVICES} />

              <a
                href="https://ethixweb.com"
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex h-11 w-fit items-center gap-2 rounded-xl border border-[var(--brand)] px-5 text-sm font-semibold text-[var(--brand)] no-underline transition-colors hover:bg-[var(--brand)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
              >
                View Ethixweb
                <span className="sr-only">(opens in a new tab)</span>
                <ArrowRight className="size-4" strokeWidth={2.2} />
              </a>
            </div>

            {/* megacloudworks column */}
            <div className="flex flex-col gap-5 border-t border-[var(--line)] p-6 sm:border-l sm:border-t-0 sm:p-8">
              <div>
                <h3 className="flex items-center gap-3 font-display text-xl font-extrabold tracking-tight text-[var(--brand)] sm:text-2xl">
                  <span className="whitespace-nowrap">MegaCloudWorks</span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 max-w-10 bg-[var(--brand)]/30"
                  />
                </h3>
                <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                  App Design &amp; Development
                </p>
              </div>

              <ServiceList items={MEGACLOUD_SERVICES} emphasis />
            </div>
          </div>

          {/* ---- How we work ---- */}
          <p className="mt-12 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink)] sm:mt-16">
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-[var(--brand)]"
            />
            How we work
          </p>

          <div
            data-steps
            className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 sm:gap-x-6 lg:gap-x-8"
          >
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                data-step
                className="relative"
                style={{ zIndex: STEPS.length - i }}
              >
                {i < STEPS.length - 1 && (
                  <img
                    data-step-line
                    src="/about/step-arrow.svg"
                    alt=""
                    aria-hidden="true"
                    width={36}
                    height={5}
                    className="pointer-events-none absolute left-[calc(100%+0.75rem)] top-[4.75rem] z-10 hidden w-9 sm:block"
                  />
                )}
                <p className="font-display text-3xl font-extrabold tracking-tight text-[var(--brand)]">
                  {step.n}
                </p>
                <img
                  src={step.icon}
                  alt=""
                  aria-hidden="true"
                  width={80}
                  height={80}
                  className="mt-3 h-[4.5rem] w-[4.5rem] object-contain object-left sm:h-20 sm:w-20"
                />
                <h3 className="mt-4 font-display text-base font-extrabold tracking-tight text-[var(--ink)] sm:text-lg">
                  {step.title}
                </h3>
                <p className="mt-1.5 max-w-[10rem] text-sm leading-snug text-[var(--ink-soft)]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 3. NOTIFY CTA ================= */}
      <section className="relative overflow-hidden bg-[var(--paper)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] bg-[image:url('/about/footer.webp')] bg-contain bg-[position:right_20%] bg-no-repeat sm:block lg:w-[54%]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_right,var(--paper)_0%,var(--paper)_28%,rgba(255,255,255,0)_52%)] sm:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[image:url('/about/footer.webp')] bg-cover bg-[position:center_top] bg-no-repeat opacity-80 sm:hidden"
        />

        <div className="relative mx-auto flex min-h-[24rem] max-w-[1600px] flex-col justify-center px-6 pb-48 pt-20 sm:px-10 sm:py-24 lg:min-h-[30rem] lg:px-20 lg:py-28">
          <div className="max-w-lg">
            <p
              data-reveal
              className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]"
            >
              Let&rsquo;s build something great
              <span
                aria-hidden="true"
                className="h-px w-8 bg-[var(--brand)]"
              />
            </p>
            <h2
              data-reveal
              className="mt-4 font-display text-[clamp(2.25rem,4.4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-[var(--ink)]"
            >
              Have a project
              <br />
              <span className="text-[var(--brand)]">in mind?</span>
            </h2>
            <div data-reveal className="mt-8">
              <NotifyForm />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter tone="dark" variant="compact" />
    </div>
  )
}

export default About
