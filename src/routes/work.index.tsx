import { useCallback, useEffect, useRef, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '#/components/site/SiteHeader'
import { SiteFooter } from '#/components/site/SiteFooter'
import { BlurText } from '#/components/site/BlurText'
import { PageWash } from '#/components/site/PageWash'
import { PullCord } from '#/components/site/PullCord'
import { WorkIndex } from '#/components/site/WorkIndex'
import { Odometer } from '#/components/site/Odometer'
import { CONCEPTS } from '#/lib/concepts'
import { useReveal } from '#/lib/useReveal'
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

/** What a concept actually contains — counted off the record, not asserted. */
const TALLY = [
  { n: CONCEPTS.length, label: 'Concepts', note: 'Each one taken end to end' },
  {
    n: CONCEPTS.reduce((t, c) => t + c.screens.length, 0),
    label: 'Screens',
    note: 'Flows, not single frames',
  },
  {
    n: CONCEPTS.reduce((t, c) => t + c.features.length, 0),
    label: 'Features',
    note: 'Scoped, written, and specced',
  },
  {
    n: CONCEPTS.reduce((t, c) => t + c.palette.length, 0),
    label: 'Brand colours',
    note: 'A whole identity per idea',
  },
] as const

/** The three things a concept has to have before we call it one. */
const MADE = [
  {
    k: 'Flow',
    t: 'The screens that carry it',
    d: 'The four or five moments the product actually lives in, drawn before anything is built.',
    img: '/work/flow.png',
    w: 600,
    h: 545,
    alt: 'A phone showing an app screen, rising out of a bank of cloud.',
  },
  {
    k: 'Build',
    t: 'A feature set with edges',
    d: 'What ships, what waits, and what we deliberately left out — written down, not implied.',
    img: '/work/build.png',
    w: 600,
    h: 596,
    alt: 'A code editor window with brackets and syntax marks, rising out of a bank of cloud.',
  },
  {
    k: 'Brand',
    t: 'A face it could launch under',
    d: 'Palette, typeface, and tone, resolved before a single line of interface is written.',
    img: '/work/brand.png',
    w: 600,
    h: 577,
    alt: 'A type specimen card with colour chips and a layers mark, rising out of a bank of cloud.',
  },
] as const

function Work() {
  const root = useRef<HTMLDivElement>(null)
  // the three-part list, measured by the thread that runs through it
  const made = useRef<HTMLOListElement>(null)
  // the hero headline arrives a line at a time, on the site's beat system for
  // big type
  const [beat, setBeat] = useState(0)
  // the cord in the hero: pulled, it takes the whole page over to brand red
  // and holds it there, band logic and all, until it's pulled back
  const [pulled, setPulled] = useState(false)
  // the cord is a physical thing, so it makes a physical sound. One element,
  // built on first pull and reused after that, rewound each time so rapid
  // pulls still click instead of going silent mid-clip.
  const click = useRef<HTMLAudioElement | null>(null)
  const toggle = useCallback(() => {
    setPulled((cur) => !cur)

    if (typeof Audio === 'undefined') return
    try {
      const sound = (click.current ??= new Audio('/click.wav'))
      sound.volume = 0.4
      sound.currentTime = 0
      // rejected when the browser hasn't granted playback yet — the pull
      // still works, it just doesn't make a noise
      void sound.play().catch(() => {})
    } catch {
      // no audio support: silence is an acceptable outcome
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setBeat(99)
      return
    }

    const marks = [80, 300, 560, 820, 1120]
    const timers = marks.map((ms, i) =>
      window.setTimeout(() => setBeat(i + 1), ms),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [])

  useReveal(root)

  return (
    <div
      ref={root}
      className={`relative min-h-screen overflow-x-clip text-[var(--ink)] ${
        pulled ? 'on-brand' : ''
      }`}
    >
      {/* the page's colour lives here, not on the sections: it cross-fades
          between paper and brand as the bands come up. The cord overrules the
          bands entirely — pulled, the sheet is red from top to bottom. */}
      {pulled ? (
        <div aria-hidden="true" className="page-wash" data-tone="brand" />
      ) : (
        <PageWash />
      )}

      <SiteHeader />

      {/* ================= 1. HERO ================= */}
      <section
        data-band="paper"
        className="relative overflow-hidden px-6 pb-16 pt-28 sm:px-10 sm:pb-20 sm:pt-32 lg:px-20 lg:pb-28 lg:pt-44"
      >
        <div className="relative z-10 mx-auto max-w-[1600px]">
          {/* the cord hangs from the top of the hero, clear of the copy */}
          <PullCord
            pulled={pulled}
            onToggle={toggle}
            className="pointer-events-auto absolute -top-28 right-2 z-20 hidden lg:block"
          />

          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand)]">
            <span
              aria-hidden="true"
              className={`h-px w-8 origin-left bg-[var(--brand)] transition-transform duration-700 ease-out ${
                beat >= 1 ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
            <BlurText
              as="span"
              text="Selected work"
              start={beat >= 1}
              delay={70}
              stepDuration={0.3}
            />
          </p>

          <h1 className="mt-6 max-w-[16ch] font-display text-[clamp(2.9rem,7vw,5.5rem)] font-extrabold leading-[0.94] tracking-[-0.035em] text-[var(--ink)]">
            {/* one BlurText per line, letter by letter — the words are short
                enough that per-word staggering would land them all at once
                and lose the cascade */}
            <BlurText
              as="span"
              text="Five products"
              animateBy="letters"
              start={beat >= 2}
              delay={30}
              stepDuration={0.32}
              className="block"
            />
            <BlurText
              as="span"
              text="that don't exist"
              animateBy="letters"
              start={beat >= 3}
              delay={30}
              stepDuration={0.32}
              className="block"
            />
            <BlurText
              as="span"
              text="yet."
              animateBy="letters"
              start={beat >= 4}
              delay={30}
              stepDuration={0.32}
              className="block text-[var(--brand)]"
            />
          </h1>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <BlurText
              text="We build concepts the way we build client work: a real problem, a real flow, a real brand. These five are ours, and they are how we think out loud."
              start={beat >= 5}
              delay={22}
              stepDuration={0.3}
              className="max-w-xl text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg"
            />

            <div
              className={`shrink-0 transition-all duration-700 ease-out ${
                beat >= 5
                  ? 'translate-y-0 opacity-100 blur-0'
                  : 'translate-y-3 opacity-0 blur-[6px]'
              }`}
            >
              <Link
                to="/contact"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-5 py-3.5 text-sm font-semibold text-[var(--ink)] no-underline transition-colors hover:border-[var(--brand)]/50 hover:text-[var(--brand)] sm:w-auto sm:py-3"
              >
                Get notified when we launch
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. THE INDEX ================= */}
      <section
        data-band="paper"
        className="relative px-6 pb-24 sm:px-10 sm:pb-28 lg:px-20 lg:pb-36"
      >
        <div className="mx-auto max-w-[1600px]">
          <p
            data-reveal="sweep"
            className="flex items-center gap-3 border-t border-[var(--line)] pt-6 text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink)]"
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-[var(--brand)]"
            />
            The index
            <span className="ml-auto font-semibold tracking-[0.14em] text-[var(--ink-faint)]">
              {String(CONCEPTS.length).padStart(2, '0')} concepts
            </span>
          </p>

          <div className="mt-10 sm:mt-14">
            <WorkIndex />
          </div>
        </div>
      </section>

      {/* ================= 3. HOW A CONCEPT IS MADE — the red stretch ====== */}
      <section
        data-band="brand"
        className="on-brand relative px-6 py-24 sm:px-10 sm:py-28 lg:px-20 lg:py-36"
      >
        <div className="relative z-10 mx-auto max-w-[1600px]">
          <p
            data-reveal
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink)]"
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-[var(--brand)]"
            />
            Inside every one
          </p>

          <h2
            data-reveal="mask"
            className="mt-5 max-w-[20ch] font-display text-[clamp(2rem,4.4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-[var(--ink)]"
          >
            Not mockups. Products, thought all the way through.
          </h2>

          <div className="work-tally" data-reveal data-reveal-stagger>
            {TALLY.map((t) => (
              <div key={t.label} className="work-tally__cell">
                <p className="work-tally__n font-display">
                  <Odometer value={t.n} />
                </p>
                <p className="work-tally__label">{t.label}</p>
                <p className="work-tally__note">{t.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. WHAT EACH ONE IS MADE OF — back on paper ====== */}
      {/* the renders are white cloud and red objects: on the red band they'd
          disappear into it, so they get their own paper stretch */}
      <section
        data-band="paper"
        className="relative px-6 pb-24 pt-16 sm:px-10 sm:pb-28 sm:pt-20 lg:px-20 lg:pb-32 lg:pt-24"
      >
        <div className="mx-auto max-w-[1600px]">
          <p
            data-reveal="sweep"
            className="flex items-baseline gap-3 border-t border-[var(--line)] pt-6 text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink)]"
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-[var(--brand)]"
            />
            What each one is made of
            <span className="ml-auto font-semibold tracking-[0.14em] text-[var(--ink-faint)]">
              Three parts
            </span>
          </p>

          <ol ref={made} className="work-made">
            {MADE.map((m, i) => (
              <li
                key={m.k}
                data-reveal="scale"
                className="work-made__item"
                style={{ '--i': i } as React.CSSProperties}
              >
                {/* every render is bottom-aligned in a bay of the same
                    height, so the three sit on one shelf and the copy below
                    them lines up across all three columns */}
                <span className="work-made__bay">
                  {/* the folio, set enormous and drawn in outline, standing
                      behind the render */}
                  <span aria-hidden="true" className="work-made__folio">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <img
                    src={m.img}
                    width={m.w}
                    height={m.h}
                    alt={m.alt}
                    loading="lazy"
                    decoding="async"
                    className="work-made__art"
                  />
                </span>
                <span aria-hidden="true" className="work-made__shelf" />

                <p className="work-made__k">
                  {String(i + 1).padStart(2, '0')}
                  <span aria-hidden="true" className="work-made__sep" />
                  {m.k}
                </p>
                <h3 className="work-made__t font-display">{m.t}</h3>
                <p className="work-made__d">{m.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= 5. CTA ================= */}
      <section
        data-band="paper"
        className="relative px-6 pb-24 pt-8 sm:px-10 sm:pb-28 lg:px-20 lg:pb-32"
      >
        {/* the page closes on the same plate the index is built from: same
            ink, same grain, same folio — and the folio reads 06, which is the
            whole argument of the section */}
        <div
          data-reveal="scale"
          className="work-close sheen-on-arrival mx-auto max-w-[1600px]"
        >
          <span aria-hidden="true" className="work-plate__grain" />
          <span aria-hidden="true" className="work-plate__ghost">
            06
          </span>

          <div className="work-close__inner">
            <div className="min-w-0">
              <p className="work-close__eyebrow">
                <span aria-hidden="true" className="work-close__tick" />
                Your turn
              </p>

              {/* the heading blurs into focus on arrival, a word at a time,
                  then the last word lands letter by letter in red */}
              <h2 className="work-close__head font-display">
                <BlurText
                  as="span"
                  text="The sixth one could be"
                  delay={78}
                  stepDuration={0.3}
                  className="block"
                />
                <BlurText
                  as="span"
                  text="yours."
                  animateBy="letters"
                  delay={44}
                  stepDuration={0.32}
                  className="block text-[var(--brand)]"
                />
              </h2>

              <BlurText
                text="Same process, pointed at your problem instead of ours."
                delay={20}
                stepDuration={0.28}
                className="work-close__sub"
              />
            </div>

            <Link
              to="/contact"
              className="cta-diagonal group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-7 py-4 text-sm font-bold text-white no-underline shadow-[0_18px_44px_-14px_rgba(245,51,59,0.8)]"
            >
              Start a conversation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default Work
