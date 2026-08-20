import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { PageMeta } from '../components/PageMeta'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { CTASection } from '../components/CTASection'
import { MagneticButton } from '../components/MagneticButton'
import { TypewriterEffect } from '../components/TypewriterEffect'
import { ABOUT_HERO, STUDIOS, ABOUT_STEPS, COVERAGE } from '../content/about'

export function About() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <PageMeta
        title="About"
        description="MegaCloudWorks is an app design & development studio built by the team behind Ethixweb, years of real client work, now aimed squarely at apps."
        path="/about"
      />
      <SiteHeader />

      {/* Hero */}
      <section className="relative isolate overflow-hidden px-[var(--edge)] pb-16 pt-36 sm:pt-44">
        {/* same centered shape as the homepage, What-we-do and Work:
            kicker, headline (last line typed in), one line, two actions */}
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="kicker justify-center" data-n="01">
            {ABOUT_HERO.eyebrow}
          </p>
          <h1 className="mt-4 font-sans text-[length:var(--fs-page-h1)] font-black leading-[0.94] tracking-[var(--tracking-tight)] sm:leading-[0.88]">
            {ABOUT_HERO.headlineLines[0]}
            <br />
            {ABOUT_HERO.headlineLines[1]}
            <br />
            <TypewriterEffect words={[{ text: ABOUT_HERO.headlineLines[2], className: 'text-[var(--brand)]' }]} />
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

        <Reveal delay={0.15} className="mx-auto mt-12 max-w-[var(--container-wide)]">
          <div className="surface-glass relative overflow-hidden rounded-[2rem] p-2 shadow-[0_30px_80px_-30px_rgba(16,16,20,0.35)]">
            <div className="relative aspect-[16/8] overflow-hidden rounded-[1.6rem] sm:aspect-[21/8]">
              <img
                src="/about/hero.webp"
                alt="A red basecamp tent pitched on a dark volcanic ridge beneath a snow-capped mountain, red signal smoke drifting past a weather mast."
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="edge-hard absolute bottom-6 left-6 hidden rounded-2xl bg-white px-5 py-4 sm:block">
                <p className="text-sm font-black tracking-tight">{ABOUT_HERO.calloutTitle}</p>
                <p className="text-xs font-bold text-[var(--brand-text)]">{ABOUT_HERO.calloutSub}</p>
                <p className="mt-1 text-[11px] text-[var(--ink-faint)]">{ABOUT_HERO.calloutMeta}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Two studios */}
      <section className="px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto grid max-w-[var(--container-wide)] gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="kicker" data-n="02">
              {STUDIOS.eyebrow}
            </p>
          </div>
          <Reveal className="lg:col-span-7 lg:col-start-6">
            <p className="text-[length:var(--fs-lead)] font-medium leading-relaxed tracking-tight text-[var(--ink)]">
              {STUDIOS.body}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <img src="/ethixweb-black.png" alt="Ethixweb" className="h-7 w-auto object-contain opacity-70" onError={(e) => (e.currentTarget.style.display = 'none')} />
              <div className="link-track h-px w-16" />
              <img src="/logo-resized.svg" alt="MegaCloudWorks" className="h-7 w-auto" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* How we work — brand band */}
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
                <div className="h-full rounded-2xl border border-white/25 bg-white/10 p-6 backdrop-blur-sm">
                  <span className="text-4xl font-black text-white/90">{s.n}</span>
                  <h3 className="mt-3 font-sans text-xl font-extrabold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto grid max-w-[var(--container-wide)] items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="surface-lift aspect-[4/3] overflow-hidden">
              <img src="/about-background.webp" alt="Coverage map background" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="kicker" data-n="04">
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
