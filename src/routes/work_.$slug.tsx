import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '#/components/site/SiteHeader'
import { SiteFooter } from '#/components/site/SiteFooter'
import { PhoneMockup } from '#/components/site/PhoneMockup'
import { PageWash } from '#/components/site/PageWash'
import { BlurText } from '#/components/site/BlurText'
import { AlpineBackdrop } from '#/components/site/AlpineBackdrop'
import { SummitCta } from '#/components/site/SummitCta'
import { ConceptDevice } from '#/components/site/phone/ConceptDevice'
import { CONCEPTS, getConcept } from '#/lib/concepts'
import { CONCEPT_ICONS } from '#/lib/conceptIcons'
import { CONCEPT_SCREENS } from '#/lib/conceptScreens'
import { Booting, LaunchScreen } from '#/lib/iosKit'
import { PhoneNavProvider } from '#/lib/phoneUI'
import type { PhoneNavMode } from '#/lib/phoneUI'
import { useReveal } from '#/lib/useReveal'
import { seo } from '#/lib/seo'

import '#/styles-case.css'

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

/** Where the screen index is, and how it last got there. */
type Nav = { index: number; dir: 1 | -1; mode: PhoneNavMode }

/**
 * A concept, as a case study.
 *
 * The page is one room - snow, a ridge, the studio's red smoke coming off it -
 * and the product's own colour is the only thing that changes between the
 * five. What used to be five saturated plates is now one climb: the device
 * standing in the weather, four camps on the way up, and the palette read off
 * the rock as strata.
 *
 * The device is the real model from `/models/phone/phone.obj` with the real
 * app running on its glass. It is not decorative - every screen in the case
 * study loads into it, and the app inside navigates itself.
 */
function ConceptDetail() {
  const concept = Route.useLoaderData()
  const root = useRef<HTMLDivElement>(null)
  const screens = CONCEPT_SCREENS[concept.slug] ?? []

  // The device's whole navigation state, kept together. Only this component
  // knows whether a tab was tapped or a record was opened, so it is also the
  // only place that can tell the glass which transition to play.
  const [nav, setNav] = useState<Nav>({ index: 0, dir: 1, mode: 'tab' })
  const go = (i: number, mode: PhoneNavMode = 'push') =>
    setNav((cur) =>
      cur.index === i ? cur : { index: i, dir: i > cur.index ? 1 : -1, mode },
    )

  /** Show screen `i` and bring the device back into view to show it on. */
  const pick = (i: number) => {
    go(i, 'tab')
    root.current
      ?.querySelector('[data-hero-device]')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const ActiveScreen = screens[nav.index]
  const currentIndex = CONCEPTS.findIndex((c) => c.slug === concept.slug)
  const next = CONCEPTS[(currentIndex + 1) % CONCEPTS.length]
  const folio = String(currentIndex + 1).padStart(2, '0')

  // the hero headline arrives a line at a time, on the same beat system the
  // About hero runs on - one language for big type across the site
  const [beat, setBeat] = useState(0)

  /*
    The whole arrival is spent inside two seconds.

    Every beat below is measured from the route mounting, and the last one has
    to have finished animating - not started - by 2000ms: the curtain lifts at
    ~700, the headline's last line lands at ~1150, the callout at ~1250, and
    the app finishes booting at 900 so the device has a live screen on it well
    before the copy stops moving. Nothing on this page is allowed to still be
    arriving when somebody has already started reading it.
  */
  const [booted, setBooted] = useState(false)
  useEffect(() => {
    setBooted(false)
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBooted(true)
      return
    }
    const t = window.setTimeout(() => setBooted(true), 900)
    return () => window.clearTimeout(t)
  }, [concept.slug])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBeat(99)
      return
    }
    const marks = [60, 190, 350, 520, 700, 880]
    const timers = marks.map((ms, i) =>
      window.setTimeout(() => setBeat(i + 1), ms),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [concept.slug])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)
    let ctx: gsap.Context | undefined

    try {
      ctx = gsap.context(() => {
        /*
          The weather has depth, so it cannot travel as one picture.

          Each layer of the backdrop moves at its own rate as the hero leaves:
          the haze barely at all, the far ridge a little, the near ridge most.
          That difference is the only thing that makes three flat vectors read
          as a distance rather than as wallpaper.
        */
        // The plate is deliberately not in here. It carries its own drift as
        // a CSS animation on `transform`, and a scrub tween on the same
        // property would simply win and freeze it.
        const drift: Array<[string, number]> = [
          ['haze', 7],
          ['smoke', 18],
        ]

        for (const [layer, yPercent] of drift) {
          const target = root.current?.querySelector(
            `[data-sky-layer='${layer}']`,
          )
          if (!target) continue
          gsap.to(target, {
            yPercent,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-hero]',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          })
        }

        // the route line beside the problem draws itself as the argument is
        // read, so the section has a floor you can see yourself descending
        gsap.fromTo(
          '[data-route-fill]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-route]',
              start: 'top 72%',
              end: 'bottom 78%',
              scrub: 0.6,
            },
          },
        )

        // The camps arrive one after another, low to high, like a party coming
        // up the slope rather than four tiles fading in together.
        //
        // fromTo rather than from: a `from` on autoAlpha leaves the elements
        // hidden until its trigger fires, and a viewport tall enough to have
        // this section already on screen never fires it.
        gsap.fromTo(
          '[data-camp]',
          { y: 46, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: { trigger: '[data-camps]', start: 'top 88%' },
          },
        )
      }, root)
    } catch {
      // the whole backdrop is decoration; if GSAP cannot set it up the page
      // still reads, so clear anything half-applied and carry on
      gsap.set('[data-sky-layer], [data-route-fill], [data-camp]', {
        clearProps: 'all',
      })
      return
    }

    return () => ctx.revert()
  }, [concept.slug])

  // everything below the fold arrives on the shared reveal system, re-armed
  // whenever the route swaps to another concept
  useReveal(root, concept.slug)

  useEffect(() => {
    setNav({ index: 0, dir: 1, mode: 'tab' })
  }, [concept.slug])

  return (
    <div
      ref={root}
      className="cs relative min-h-screen overflow-x-clip text-[var(--ink)]"
      /*
        The whole page takes the concept's colour, not just the device.
        Everything on the site paints itself from `--brand` - eyebrow dots,
        rules, links, hover states - so overriding those tokens here re-tints
        the entire case study without a single component knowing which product
        it is showing. The `--c-*` set is this page's own, read by styles-case.
      */
      style={
        {
          '--brand': concept.accent,
          '--brand-strong': concept.band,
          '--brand-2': concept.accent2,
          '--brand-soft': `${concept.accent}1f`,
          '--accent': concept.accent,
          '--c-accent': concept.accent,
          '--c-accent-2': concept.accent2,
          '--c-band': concept.band,
          '--c-wash': concept.wash,
          '--c-ink': concept.accentInk,
          '--c-hero-to': concept.heroTo,
        } as React.CSSProperties
      }
    >
      {/* the arrival: the concept's colour covers the page, says which product
          is being opened, and lifts away */}
      <div key={concept.slug} aria-hidden="true" className="concept-curtain">
        <span className="concept-curtain__mark">{concept.name}</span>
      </div>

      <PageWash />

      {/* ================= 1. THE HERO ================= */}
      <section data-hero data-band="paper" className="cs-hero">
        <AlpineBackdrop c={concept} />

        <SiteHeader />

        <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-12 pt-20 sm:px-10 sm:pb-14 sm:pt-24 lg:px-20 lg:pb-14">
          <div className="mx-auto w-full max-w-[1600px]">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
              {/* ---- copy ---- */}
              <div className="pb-2">
                <Link
                  to="/work"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--granite-faint)] no-underline transition-colors hover:text-[var(--c-band)]"
                >
                  <ArrowLeft className="size-3.5" />
                  Back to work
                </Link>

                <p className="cs-folio mt-7">
                  <BlurText
                    as="span"
                    text={folio}
                    start={beat >= 1}
                    delay={70}
                    stepDuration={0.3}
                    className="cs-folio__n"
                  />
                  <span
                    aria-hidden="true"
                    className={`cs-folio__rule ${beat >= 1 ? 'is-on' : ''}`}
                  />
                  <BlurText
                    as="span"
                    text={concept.category}
                    start={beat >= 1}
                    delay={70}
                    stepDuration={0.3}
                    className="cs-folio__label"
                  />
                </p>

                <h1 className={`chead chead--${concept.headline} mt-5`}>
                  <BlurText
                    as="span"
                    text={concept.name}
                    animateBy="letters"
                    start={beat >= 2}
                    delay={38}
                    stepDuration={0.32}
                    className="chead__name"
                  />
                  <BlurText
                    as="span"
                    text={concept.tagline}
                    animateBy="words"
                    start={beat >= 3}
                    delay={54}
                    stepDuration={0.34}
                    className="chead__line"
                  />
                </h1>

                <BlurText
                  text={concept.blurb}
                  start={beat >= 4}
                  delay={22}
                  stepDuration={0.3}
                  className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-[var(--granite-soft)] sm:text-[17px]"
                />

                <div
                  className={`mt-7 flex flex-wrap gap-2 transition-opacity duration-700 ${
                    beat >= 5 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {[concept.platform, concept.timeline, concept.year].map(
                    (tag) => (
                      <span key={tag} className="cs-tag">
                        {tag}
                      </span>
                    ),
                  )}
                </div>

                {/* ---- the screen picker ----
                    Inline with the copy, not in a bar of its own. It had a
                    full-width plinth across the foot of the hero for a while:
                    ninety pixels of chrome to say four words, and a hard
                    horizontal edge cutting the photograph in half. It is a
                    caption to the device, so it lives with the writing. */}
                {screens.length > 1 ? (
                  <div className="cs-picker mt-8">
                    <span className="cs-picker__k">Screens</span>
                    <div className="cs-picker__row">
                      {concept.screens.map((label, i) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => go(i, 'tab')}
                          aria-current={nav.index === i}
                          data-on={nav.index === i ? '' : undefined}
                          className="cs-pick"
                        >
                          <span className="cs-pick__n">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="cs-pick__label">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* ---- the device, standing in the weather ---- */}
              <div
                data-hero-device
                className="relative mx-auto w-[clamp(300px,86vw,442px)] max-w-full lg:mx-0 lg:w-[min(36vw,520px,calc(80vh*0.678))]"
              >
                {/*
                    There was a leader line here - a wire out to the left of
                    the phone labelling its navigation and its motion. Two
                    things were wrong with it. The label duplicated the Motion
                    and Navigation panels further down the page, which say the
                    same two words and then explain them; and the wire had to
                    reach across the gap to the glass, which at this width put
                    it straight through the headline. The device does not need
                    a caption to say it is running - the hint under it says so,
                    and tapping it proves it.
                */}

                {/* The screens navigate each other from inside the glass - a
                    tab, a job row, a nudge - so the router the page owns is
                    handed down to them, from outside the keyed slide that
                    remounts on every change. */}
                <PhoneNavProvider
                  index={nav.index}
                  count={screens.length}
                  onGo={go}
                >
                  <ConceptDevice
                    accent={concept.accent}
                    pulse={booted ? nav.index + 1 : 0}
                  >
                    <div
                      key={booted ? concept.screens[nav.index] : 'launch'}
                      className="phone3d__slide"
                      data-dir={nav.dir}
                      data-mode={nav.mode}
                      data-motion={concept.motion}
                    >
                      {!booted ? (
                        <LaunchScreen c={concept} />
                      ) : ActiveScreen ? (
                        <ActiveScreen c={concept} />
                      ) : null}
                    </div>
                  </ConceptDevice>
                </PhoneNavProvider>

                {/* The bar inside the glass is a real router, and nobody
                    tries tapping a picture of a phone unless they are told
                    the picture is not one. */}
                <p className="cs-device__hint">
                  <span aria-hidden="true" className="cs-device__hintDot" />
                  Tap the nav bar to see the other screens
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. THE RIDGE TICKER ================= */}
      <div aria-hidden="true" className="cs-ticker">
        <div className="cs-ticker__track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="cs-ticker__run">
              <span className="cs-ticker__word">{concept.name}</span>
              <span className="cs-ticker__dot" />
              <span className="cs-ticker__note">{concept.tagline}</span>
              <span className="cs-ticker__dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ================= 3. THE BRIEF ================= */}
      <section
        data-band="paper"
        className="relative border-b border-[var(--hair)] px-6 py-9 sm:px-10 lg:px-20"
      >
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-6 lg:grid-cols-5">
          {[
            ['Role', 'App design & development'],
            ['Platform', concept.platform],
            ['Timeline', concept.timeline],
            ['Sector', concept.category],
            ['Year', concept.year],
          ].map(([label, value]) => (
            <div key={label} data-reveal>
              <p className="cs-brief__k">{label}</p>
              <p className="cs-brief__v">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 4. THE PROBLEM ================= */}
      <section
        data-band="paper"
        className="relative px-6 py-24 sm:px-10 sm:py-28 lg:px-20 lg:py-36"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-[0.44fr_0.56fr] lg:gap-24">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p
                data-reveal
                className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--granite)]"
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-[var(--c-accent)]"
                />
                The problem
              </p>
              <h2
                data-reveal
                className={`chead chead--${concept.headline} chead--section mt-6`}
              >
                <span className="chead__line">{concept.problemTitle}</span>
              </h2>
            </div>

            {/* the argument, read down a route line that draws with the scroll */}
            <div data-route className="relative space-y-10 lg:pt-4">
              <span aria-hidden="true" className="cs-route">
                <span data-route-fill className="cs-route__fill" />
              </span>

              {concept.problemBody.map((p, i) => (
                <p key={i} data-reveal className="cs-para">
                  <span className="cs-para__n">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. THE CAMPS ================= */}
      <section
        data-band="paper"
        className="relative overflow-hidden border-t border-[var(--hair)] px-6 py-20 sm:px-10 sm:py-24 lg:px-20 lg:py-28"
        style={{
          background: `linear-gradient(180deg, #ffffff 0%, ${concept.wash} 100%)`,
        }}
      >
        <div className="relative z-10 mx-auto max-w-[1600px]">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--granite)]">
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-[var(--c-accent)]"
            />
            Key screens
          </p>

          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 className={`chead chead--${concept.headline} chead--section`}>
              <span className="chead__line">{concept.screensSubtitle}</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--granite-soft)]">
              All four are running. Pick one to load it into the device above,
              or drive the whole app from the tab bar inside the glass.
            </p>
          </div>

          <div data-camps className="cs-camps mt-12 lg:mt-16">
            {concept.screens.map((label, i) => {
              const Screen = screens[i]
              const isActive = nav.index === i
              if (!Screen) return null
              return (
                <button
                  key={label}
                  type="button"
                  data-camp
                  onClick={() => pick(i)}
                  aria-current={isActive}
                  data-on={isActive ? '' : undefined}
                  className="cs-camp group"
                >
                  <span className="cs-camp__plinth">
                    <span className="cs-camp__head">
                      <span className="cs-camp__n">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="cs-camp__tab">
                        {concept.tabs[i]?.label}
                      </span>
                    </span>

                    <span className="cs-camp__device">
                      {/* inert, but index-aware: each mini has to light its own
                          tab, and none of them may contain a real button - see
                          PhoneNavProvider's `inert` */}
                      <PhoneNavProvider
                        index={i}
                        count={screens.length}
                        onGo={() => {}}
                        inert
                      >
                        <PhoneMockup
                          variant="mini"
                          accent={concept.accent}
                          motion={concept.motion}
                          /* the one being shown stands square on; the rest are
                             turned away until the pointer picks them up */
                          restY={isActive ? 0 : -15}
                        >
                          {/* each one boots a beat after the last, so the row
                              comes up like four phones rather than one */}
                          <Booting c={concept} delay={i * 170}>
                            <Screen c={concept} />
                          </Booting>
                        </PhoneMockup>
                      </PhoneNavProvider>
                    </span>
                  </span>

                  <span className="cs-camp__label">{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================= 6. WHAT IT DOES ================= */}
      <section
        data-band="paper"
        className="relative border-t border-[var(--hair)] px-6 py-24 sm:px-10 sm:py-28 lg:px-20 lg:py-36"
      >
        <div className="mx-auto max-w-[1600px]">
          <p
            data-reveal
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--granite)]"
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-[var(--c-accent)]"
            />
            What it does
          </p>
          <h2
            data-reveal
            className={`chead chead--${concept.headline} chead--section mt-6`}
          >
            <span className="chead__line">{concept.featuresSubtitle}</span>
          </h2>

          {/* The first feature is the argument the product is making; the
              other five are how it makes it. Sizing them all identically was
              the old mistake - see .cs-bento. */}
          <ul className="cs-bento mt-12 sm:mt-14">
            {concept.features.map((f, i) => {
              const Icon = CONCEPT_ICONS[f.icon]
              const lead = i === 0
              return (
                <li
                  key={f.title}
                  data-reveal
                  className={`cs-tile ${lead ? 'cs-tile--lead' : ''}`}
                >
                  <span className="cs-tile__head">
                    <span className="cs-tile__icon">
                      {Icon ? (
                        <Icon
                          className={lead ? 'size-6' : 'size-5'}
                          strokeWidth={2}
                        />
                      ) : null}
                    </span>
                    <span aria-hidden="true" className="cs-tile__n">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>

                  <span className="cs-tile__body">
                    <span className="cs-tile__t">{f.title}</span>
                    <span className="cs-tile__b">{f.body}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ================= 7. THE DESIGN SYSTEM ================= */}
      <section
        data-band="paper"
        className="relative border-t border-[var(--hair)] px-6 py-24 sm:px-10 sm:py-28 lg:px-20 lg:py-32"
      >
        <div className="mx-auto max-w-[1600px]">
          <p
            data-reveal
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--granite)]"
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-[var(--c-accent)]"
            />
            The design system
          </p>

          <div
            data-reveal
            className="mt-6 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between"
          >
            <h2 className={`chead chead--${concept.headline} chead--section`}>
              <span className="chead__line">
                Built for this problem, not pulled off a shelf.
              </span>
            </h2>
            <p className="max-w-sm text-[15px] leading-relaxed text-[var(--granite-soft)]">
              Colour, type, corner radius and motion chosen for the room the
              product is used in - a windscreen at dawn, a counter, a surgery.
              Nothing here is inherited from a shared kit.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-[0.46fr_0.54fr]">
            {/* ---- the palette, cut as strata ---- */}
            <div data-reveal className="cs-strata">
              {concept.palette.map((swatch) => (
                <div
                  key={swatch.hex}
                  className="cs-strata__band"
                  style={{
                    background: swatch.swatch,
                    color: isLight(swatch.hex) ? '#101014' : '#ffffff',
                  }}
                >
                  <span className="cs-strata__hex">{swatch.hex}</span>
                  <span className="cs-strata__name">{swatch.name}</span>
                  <span className="cs-strata__note">{swatch.note}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <div data-reveal className="cs-plate">
                <p className="cs-plate__eyebrow">
                  Typeface · {concept.typeface}
                </p>
                <p className="cs-plate__mark">{concept.name}</p>
                <p className="cs-plate__tag">{concept.tagline}</p>

                <div className="mt-7 grid grid-cols-4 gap-2">
                  {['Regular', 'Semibold', 'Bold', 'Extrabold'].map((w, i) => (
                    <div key={w} className="cs-weight">
                      <p
                        className="cs-weight__aa"
                        style={{ fontWeight: [400, 600, 700, 800][i] }}
                      >
                        Aa
                      </p>
                      <p className="cs-weight__n">{w}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-2.5">
                  <span
                    className="rounded-xl px-4 py-2.5 text-xs font-bold text-white"
                    style={{
                      background: `linear-gradient(120deg, ${concept.accent}, ${concept.accent2})`,
                    }}
                  >
                    {concept.features[0]?.title ?? 'Primary action'}
                  </span>
                  <span className="rounded-full border border-[var(--hair)] px-3.5 py-2 text-xs font-semibold text-[var(--granite-soft)]">
                    {concept.surface === 'dark' ? 'Dark-first' : 'Light-first'}
                  </span>
                  <span className="rounded-full border border-[var(--hair)] px-3.5 py-2 text-xs font-semibold capitalize text-[var(--granite-soft)]">
                    {concept.skin} skin
                  </span>
                </div>
              </div>

              {/* motion gets a panel of its own: it is the difference between
                  five apps and one app recoloured five times, and it is
                  invisible in a screenshot */}
              <div data-reveal className="cs-panel">
                <p className="cs-panel__eyebrow">Motion · {concept.motion}</p>
                <p className="cs-panel__body">{concept.motionNote}</p>
              </div>

              <div data-reveal className="cs-panel flex-1">
                <p className="cs-panel__eyebrow">Navigation · {concept.flow}</p>
                <p className="cs-panel__body">{concept.flowNote}</p>

                <div className="mt-6 space-y-2">
                  {concept.tabs.map((t, i) => {
                    const Icon = CONCEPT_ICONS[t.icon]
                    const on = nav.index === i
                    return (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => pick(i)}
                        data-on={on ? '' : undefined}
                        className="cs-navrow"
                      >
                        <span
                          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            background: concept.wash,
                            color: concept.band,
                          }}
                        >
                          {Icon ? (
                            <Icon className="size-4" strokeWidth={2.2} />
                          ) : null}
                        </span>
                        <span className="flex-1 text-sm font-bold text-[var(--granite)]">
                          {t.label}
                        </span>
                        <span className="text-xs font-semibold text-[var(--granite-faint)]">
                          {concept.screens[i]}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. NEXT CONCEPT ================= */}
      <section
        data-band="paper"
        className="relative px-6 pb-20 sm:px-10 lg:px-20"
      >
        <div className="mx-auto max-w-[1600px]">
          <Link
            data-reveal
            to="/work/$slug"
            params={{ slug: next.slug }}
            className="cs-next"
            style={
              {
                '--n-accent': next.accent,
                '--n-band': next.band,
                '--n-wash': next.wash,
              } as React.CSSProperties
            }
          >
            <span aria-hidden="true" className="cs-next__fill" />
            <span className="cs-next__body">
              <span className="cs-next__eyebrow">Next concept</span>
              <span className="cs-next__name">{next.name}</span>
              <span className="cs-next__tag">{next.tagline}</span>
            </span>
            <span aria-hidden="true" className="cs-next__go">
              <ArrowUpRight className="size-5 sm:size-6" strokeWidth={2.4} />
            </span>
          </Link>
        </div>
      </section>

      {/* ================= 9. CTA ================= */}
      {/*
        The page hands the colour back.

        Everything above is the product's; the close belongs to the studio, so
        the brand tokens are put back to the red the rest of the site closes
        on. It is the same summit the About and Services pages end at, and it
        should not arrive wearing the concept's jacket.
      */}
      <section
        data-band="paper"
        className="relative overflow-hidden bg-[var(--paper)]"
        style={
          {
            '--brand': '#f5333b',
            '--brand-strong': '#e11d26',
            '--brand-2': '#ff6a3d',
            '--brand-soft': 'rgba(245,51,59,0.12)',
          } as React.CSSProperties
        }
      >
        <SummitCta />
      </section>

      <SiteFooter tone="dark" variant="compact" />
    </div>
  )
}

/**
 * Whether a hex is light enough to need dark text on it.
 *
 * The palettes carry both near-black inks and near-white papers, so the label
 * colour on a swatch cannot be a constant. Relative luminance, the sRGB way,
 * rather than a naive channel average - an average calls #FFC24B dark.
 */
function isLight(hex: string) {
  const h = hex.replace('#', '')
  const full =
    h.length === 3
      ? h
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : h
  const [r, g, b] = [0, 2, 4].map(
    (i) => parseInt(full.slice(i, i + 2), 16) / 255,
  )
  const lin = (v: number) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) > 0.42
}
