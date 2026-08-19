import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageMeta } from '../components/PageMeta'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { MagneticButton } from '../components/MagneticButton'
import { ServiceNavigator } from '../components/ServiceNavigator'
import { ProcessSteps } from '../components/ProcessSteps'
import { WorkCard } from '../components/WorkCard'
import { StatsSection } from '../components/StatsSection'
import { CTASection } from '../components/CTASection'
import { SERVICES_HERO, COLUMNS, CIRCLES, FACTS } from '../content/services'
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

      {/* 01 — Hero */}
      <section className="relative overflow-hidden px-[var(--edge)] pb-20 pt-36 sm:pt-44">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(16,16,20,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,16,20,0.05) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)',
          }}
        />
        <div
          className="pointer-events-none absolute right-[4%] top-6 -z-10 size-[30rem] rounded-full opacity-[0.3] blur-[100px]"
          style={{ background: 'radial-gradient(circle, var(--brand), transparent 70%)' }}
        />

        <div className="mx-auto max-w-[var(--container-wide)]">
          <p className="kicker" data-n="01">
            {SERVICES_HERO.eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl font-sans text-[clamp(2.6rem,7vw,5.5rem)] font-black leading-[0.94] tracking-[-0.03em]">
            {SERVICES_HERO.headlineLines[0]}
            <br />
            {SERVICES_HERO.headlineLines[1]}
          </h1>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-lg text-lg text-[var(--ink-soft)]">{SERVICES_HERO.sub}</p>
            <div className="flex flex-wrap items-center gap-4">
              <MagneticButton to="/contact" size="lg">
                Start a project <ArrowRight size={15} />
              </MagneticButton>
              <a
                href="#capabilities"
                className="text-sm font-semibold text-[var(--ink)] no-underline underline decoration-[var(--brand)] decoration-2 underline-offset-4"
              >
                See what's included
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick nav — three circles, jumps straight into the capability picker below */}
      <section className="px-[var(--edge)] py-10 sm:py-12">
        <div className="mx-auto flex max-w-[46rem] flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8">
          {CIRCLES.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.08}>
              <Link
                to={c.hash}
                className="group flex size-[13rem] shrink-0 flex-col items-center justify-center rounded-full bg-white p-4 text-center no-underline shadow-[0_24px_60px_-24px_rgba(16,16,20,0.35)] ring-1 ring-[var(--line)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_32px_70px_-24px_rgba(245,51,59,0.35)] hover:ring-[var(--brand)]/40 sm:size-[15.5rem]"
              >
                <span className="text-sm font-black text-[var(--brand-text)]">{c.n}</span>
                <span className="mt-2 font-sans text-xl font-extrabold leading-tight tracking-tight text-[var(--ink)] sm:text-2xl">
                  {c.title}
                </span>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--ink-faint)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Find out more <ArrowRight size={12} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 02 — Capabilities: one interactive picker, not three duplicated blocks */}
      <section id="capabilities" className="scroll-mt-28 px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto max-w-[var(--container-wide)]">
          <SectionHeading n="02" kicker="Capabilities" title="What's included, service by service." />
          <div className="mt-12">
            <ServiceNavigator />
          </div>
        </div>
      </section>

      {/* 03 — Why MegaCloudWorks */}
      <section
        data-header-tone="dark"
        className="on-brand relative overflow-hidden bg-[var(--brand)] px-[var(--edge)] py-24 text-white sm:py-28"
      >
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative mx-auto max-w-[var(--container-wide)]">
          <SectionHeading n="03" kicker="Why MegaCloudWorks" title="What working with us actually feels like." light />
          <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((c, i) => (
              <Reveal
                key={c.title}
                delay={i * 0.06}
                className={
                  i === 0
                    ? ''
                    : i === 2
                      ? 'border-t border-white/20 pt-6 sm:border-l sm:pl-6 lg:border-t-0 lg:pt-0'
                      : 'border-t border-white/20 pt-6 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0'
                }
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">{c.kicker}</p>
                <h3 className="mt-3 font-sans text-xl font-extrabold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{c.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — How we work */}
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
            sub="The same process behind every service above — click a stage to see what it actually includes."
          />
          <div className="mt-12">
            <ProcessSteps />
          </div>
        </div>
      </section>

      <StatsSection />

      {/* 05 — Selected work as proof */}
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

      {/* 06 — Final CTA */}
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
