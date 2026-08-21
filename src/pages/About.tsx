import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { PageMeta } from '../components/PageMeta'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { CTASection } from '../components/CTASection'
import { MagneticButton } from '../components/MagneticButton'
import { StudioHandshake } from '../components/StudioHandshake'
import { StatsSection } from '../components/StatsSection'
import { WorkCard } from '../components/WorkCard'
import { ABOUT_HERO, STUDIOS, ABOUT_STEPS, COVERAGE, ORIGIN } from '../content/about'
import { CONCEPTS } from '../content/concepts'

export function About() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <PageMeta
        title="About"
        description="MegaCloudWorks is an app design & development studio built by the team behind Ethixweb, years of real client work, now aimed squarely at apps."
        path="/about"
      />
      <SiteHeader />

      {/* Hero: the photograph is the section's background now, not a framed
          card. Its composition suits this: dark ridges hold the left and
          right edges while the middle stays near-white, so centred copy sits
          in the clear valley rather than fighting the picture. */}
      <section className="relative isolate flex min-h-[86svh] flex-col items-center justify-center overflow-hidden px-[var(--edge)] pb-24 pt-32 sm:pt-36">
        <img
          src="/about/sky-ready.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
        />
        {/* a soft white bloom under the copy only, keeps the headline
            legible at any crop without washing the ridges out at the edges */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 68% 58% at 50% 44%, rgba(255,255,255,0.88), rgba(255,255,255,0.42) 56%, rgba(255,255,255,0) 82%)',
          }}
        />
        {/* dissolve the photo into the page rather than ending on a hard seam */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-[var(--paper)]" />
        <div className="grain-media grain-media--behind" aria-hidden="true" />

        {/* wider than the other heroes: this headline is a full sentence
            rather than three short lines, so it needs room to break well */}
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="kicker justify-center" data-n="01">
            {ABOUT_HERO.eyebrow}
          </p>
          {/* --fs-h1, not --fs-page-h1: display size scales inversely with
              line length, and at the page-hero step this sentence ran to
              four rows and swamped everything under it */}
          <h1 className="mt-4 text-balance font-sans text-[length:var(--fs-h1)] font-black leading-[1.02] tracking-[var(--tracking-tight)] sm:leading-[0.94]">
            {ABOUT_HERO.headlineLines[0]}
            <br />
            <span className="text-[var(--brand)]">{ABOUT_HERO.headlineLines[1]}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
            {ABOUT_HERO.sub}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton to="/contact" size="lg">
              Start a project <ArrowRight size={15} />
            </MagneticButton>
            <MagneticButton href="#how-we-work" size="lg" variant="edge-hover">
              How we work <ArrowUpRight size={15} />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Immediate proof: same stats band the homepage and services page
          run, real numbers rather than new copy invented for this page */}
      <StatsSection />

      {/* Two studios */}
      <section className="px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto grid max-w-[var(--container-wide)] gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4 lg:self-start lg:sticky lg:top-32">
            <p className="kicker text-sm sm:text-base lg:text-xl" data-n="02">
              {STUDIOS.eyebrow}
            </p>
            <p className="mt-4 hidden max-w-[22rem] text-[1.61rem] font-semibold leading-relaxed text-[var(--ink)] lg:block">
              One team, two studios: the web side and the app side of the same standard.
            </p>
          </div>
          <Reveal className="lg:col-span-7 lg:col-start-6">
            <p className="text-[length:clamp(1.254rem,2.508vw,1.452rem)] font-normal leading-relaxed tracking-tight text-[var(--ink-soft)]">
              {STUDIOS.body}
            </p>
            <div className="mt-10">
              <StudioHandshake variant="feature" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* How we work: brand band */}
      <section
        id="how-we-work"
        data-header-tone="dark"
        className="on-brand relative isolate scroll-mt-28 overflow-hidden bg-[var(--brand)] px-[var(--edge)] py-24 text-white sm:py-32"
      >
        <div className="grain-overlay" aria-hidden="true" />
        <div className="mx-auto max-w-[var(--container-wide)]">
          <SectionHeading n="03" kicker="How we work" title="Four moves, in the same order, every time." light />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-white/25 bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-white/45 hover:bg-white/15 hover:shadow-[0_20px_44px_rgba(0,0,0,0.18)]">
                  <span className="text-4xl font-black text-white/90 transition-colors duration-300 group-hover:text-white">
                    {s.n}
                  </span>
                  <h3 className="mt-3 font-sans text-xl font-extrabold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80 transition-colors duration-300 group-hover:text-white/90">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Origin: the human "why" behind two studios instead of one. The
          heading sits centered on its own, then the quote runs wide and
          left-aligned underneath — one unhurried thought, not a caption
          squeezed into a narrow centered block. */}
      <section className="px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto max-w-[var(--container-wide)] text-center">
          <p className="kicker justify-center" data-n="04">
            {ORIGIN.eyebrow}
          </p>
          <Reveal className="mx-auto mt-8 max-w-6xl text-left">
            <p className="font-sans text-[length:clamp(1.2rem,1.9vw,1.55rem)] font-medium leading-[1.65] tracking-tight text-[var(--ink)]">
              &ldquo;{ORIGIN.quote}&rdquo;
            </p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              {ORIGIN.attribution}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Coverage */}
      <section className="border-t border-[var(--line)] px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto grid max-w-[var(--container-wide)] items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="surface-lift aspect-[4/3] overflow-hidden">
              <img src="/about-background.webp" alt="Coverage map background" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="kicker" data-n="05">
              {COVERAGE.eyebrow}
            </p>
            <h2 className="mt-4 font-sans text-[length:var(--fs-h2)] font-extrabold leading-[0.98] tracking-[var(--tracking-tight)]">
              {COVERAGE.titleLines[0]}
              <br />
              <span className="text-[var(--brand)]">{COVERAGE.titleLines[1]}</span>
            </h2>
            <p className="mt-4 max-w-md text-lg text-[var(--ink-soft)]">{COVERAGE.body}</p>
          </Reveal>
        </div>
      </section>

      {/* Proof: the same five concepts Work runs, tying "here's who we are"
          back to "here's what we've actually built" before the final ask */}
      <section className="bg-[var(--paper-2)] px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto max-w-[var(--container-wide)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading n="06" kicker="What we build" title="Five products, one standard." />
            <Reveal>
              <Link to="/work" className="text-sm font-semibold text-[var(--brand-text)] no-underline hover:opacity-70">
                See the whole index →
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CONCEPTS.slice(0, 3).map((c, i) => (
              <WorkCard key={c.slug} concept={c} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Notify me"
        title={
          <>
            Want to know when <br /> we launch?
          </>
        }
        sub="No spam, just an occasional note when something new ships."
      />

      <SiteFooter />
    </main>
  )
}
