import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { PageMeta } from '../components/PageMeta'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { MagneticButton } from '../components/MagneticButton'
import { ServiceNavigator } from '../components/ServiceNavigator'
import { ServiceCircles } from '../components/ServiceCircles'
import { WhyMegaCloudWorks } from '../components/WhyMegaCloudWorks'
import { ProcessTimeline } from '../components/ProcessTimeline'
import { WorkCard } from '../components/WorkCard'
import { StatsSection } from '../components/StatsSection'
import { CTASection } from '../components/CTASection'
import { SERVICES_HERO, FACTS } from '../content/services'
import { CONCEPTS } from '../content/concepts'

export function Services() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <PageMeta
        title="What we do"
        description="App design, development, and brand & UI, one team handling strategy, design, and engineering end to end."
        path="/services"
      />
      <SiteHeader />

      {/* 01 · Hero. `isolate` so the dot-grid/glow's negative z-index stays
          scoped to this section instead of escaping to the document root
          and painting behind <main>'s own background (neither this section
          nor <main> otherwise sets a z-index, so nothing else contains
          them). */}
      <section className="relative isolate overflow-hidden px-[var(--edge)] pb-14 pt-36 sm:pb-16 sm:pt-44">
        <img
          src="/services-hero-background.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover opacity-[0.88]"
        />
        <div
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            background:
              'linear-gradient(to bottom, var(--paper) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.1) 60%, var(--paper) 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            background:
              'radial-gradient(ellipse 40% 60% at 50% 45%, var(--paper) 0%, rgba(255,255,255,0.5) 50%, transparent 82%)',
          }}
        />
        <div
          className="pointer-events-none absolute right-[4%] top-6 -z-10 size-[30rem] rounded-full opacity-[0.3] blur-[100px]"
          style={{ background: 'radial-gradient(circle, var(--brand), transparent 70%)' }}
        />

        {/* centered, same shape as the homepage hero: kicker, headline,
            one short line, then two actions side by side, so landing and
            What-we-do read as the same product rather than two layouts */}
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="kicker justify-center" data-n="01">
            {SERVICES_HERO.eyebrow}
          </p>
          <h1 className="mt-4 font-sans text-[length:var(--fs-page-h1)] font-black leading-[0.98] tracking-[var(--tracking-tight)] sm:leading-[0.94]">
            {SERVICES_HERO.headlineLines[0]}
            <br />
            under one <span className="text-[var(--brand)]">roof.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
            {SERVICES_HERO.sub}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton to="/contact" size="lg">
              Start a project <ArrowRight size={15} />
            </MagneticButton>
            <MagneticButton href="#capabilities" size="lg" variant="edge-hover">
              See what's included <ArrowUpRight size={15} />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Quick nav: three glass circles over a bed of concentric rings,
          jumps straight into the capability picker below */}
      <section className="px-[var(--edge)]">
        <ServiceCircles />
      </section>

      {/* 02 · Capabilities: one interactive picker, not three duplicated blocks */}
      <section id="capabilities" className="scroll-mt-28 px-[var(--edge)] pb-24 pt-2 sm:pb-32 sm:pt-4">
        <div className="mx-auto max-w-[var(--container-wide)]">
          <SectionHeading n="02" kicker="Capabilities" title="What's included, service by service." />
          <div className="mt-12">
            <ServiceNavigator />
          </div>
        </div>
      </section>

      {/* 03 · Why MegaCloudWorks */}
      <section
        data-header-tone="dark"
        className="on-brand relative isolate overflow-hidden bg-[var(--brand)] px-[var(--edge)] py-24 text-white sm:py-28"
      >
        <div className="grain-overlay" aria-hidden="true" />
        <div className="relative mx-auto max-w-[var(--container-wide)]">
          <SectionHeading n="03" kicker="Why MegaCloudWorks" title="What working with us actually feels like." light />
          <div className="mt-14">
            <WhyMegaCloudWorks />
          </div>
        </div>
      </section>

      {/* 04 · How we work */}
      <section id="process" className="bg-[var(--paper-2)] px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto max-w-[var(--container-wide)]">
          <SectionHeading
            n="04"
            kicker="How we work"
            title={
              <>
                Four steps,
                <br />
                <span className="text-[var(--brand)]">no surprises.</span>
              </>
            }
            sub="The same process behind every service above, start to finish."
          />
          <div className="mt-12">
            <ProcessTimeline />
          </div>
        </div>
      </section>

      <StatsSection />

      {/* 05 · Selected work as proof */}
      <section className="px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto max-w-[var(--container-wide)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading n="05" kicker="Recent thinking" title="What these services build." />
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

      {/* Engagement facts */}
      <section className="border-y border-[var(--line)] bg-[var(--paper-2)] px-[var(--edge)] py-16">
        <div className="mx-auto max-w-[var(--container-wide)]">
          <div className="grid gap-8 sm:grid-cols-3">
            {FACTS.map((f) => (
              <Reveal key={f.label}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">{f.label}</p>
                <p className="mt-2 font-sans text-2xl font-extrabold tracking-tight">{f.value}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-10 border-t border-[var(--line)] pt-8">
            <p className="text-[var(--ink-soft)]">
              Curious exactly how we get from a kickoff call to a shipped product?{' '}
              <Link to="/about#how-we-work" className="font-semibold text-[var(--brand-text)] no-underline hover:opacity-70">
                See the full process on the About page →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 06 · Final CTA */}
      <CTASection
        eyebrow="Start a project"
        title="Have something in mind?"
        sub="Tell us about your project, we'll come back with a plan."
        ctaLabel="Start a project"
      />

      <SiteFooter />
    </main>
  )
}
