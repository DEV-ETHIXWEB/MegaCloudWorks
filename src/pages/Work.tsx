import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { PageMeta } from '../components/PageMeta'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { SectionHeading } from '../components/SectionHeading'
import { WorkCard } from '../components/WorkCard'
import { Reveal } from '../components/Reveal'
import { CTASection } from '../components/CTASection'
import { MagneticButton } from '../components/MagneticButton'
import { WORK_HERO, MADE } from '../content/work'
import { CONCEPTS } from '../content/concepts'

export function Work() {
  const totalScreens = CONCEPTS.reduce((sum, c) => sum + c.screens.length, 0)
  const totalFeatures = CONCEPTS.reduce((sum, c) => sum + c.features.length, 0)

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <PageMeta
        title="Work"
        description="Five app concepts designed and prototyped by the MegaCloudWorks team, each one a complete product-thinking exercise."
        path="/work"
      />
      <SiteHeader />

      {/* Hero: same centered shape as the homepage and What-we-do: kicker,
          headline (last line typed in), one line of copy, then two actions */}
      <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-[var(--edge)] pb-14 pt-36 sm:pb-16 sm:pt-44">
        <img
          src="/work-hero-background.webp"
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
              'radial-gradient(ellipse 40% 60% at 44% 45%, var(--paper) 0%, rgba(255,255,255,0.5) 50%, transparent 82%)',
          }}
        />
        <div
          className="pointer-events-none absolute right-[6%] top-10 -z-10 size-[26rem] rounded-full opacity-[0.28] blur-[100px]"
          style={{ background: 'radial-gradient(circle, var(--brand), transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="kicker justify-center" data-n="01">
            {WORK_HERO.eyebrow}
          </p>
          <h1 className="mt-4 font-sans text-[length:var(--fs-page-h1)] font-black leading-[1.06] tracking-[var(--tracking-tight)] sm:leading-[1.02]">
            {WORK_HERO.headlineLines[0]}
            <br />
            {WORK_HERO.headlineLines[1]} <span className="text-[var(--brand)]">{WORK_HERO.headlineLines[2]}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
            {WORK_HERO.sub}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton to="/contact" size="lg">
              {WORK_HERO.cta} <ArrowRight size={15} />
            </MagneticButton>
            <MagneticButton href="#index" size="lg" variant="edge-hover">
              See the index <ArrowUpRight size={15} />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Index */}
      <section id="index" className="scroll-mt-28 px-[var(--edge)] py-16">
        <div className="mx-auto max-w-[var(--container-wide)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="kicker" data-n="02">
              The index
            </p>
            <span className="edge-hard rounded-full bg-white px-4 py-1.5 text-xs font-bold">
              05 concepts
            </span>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CONCEPTS.map((c, i) => (
              <WorkCard key={c.slug} concept={c} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* Inside every one: brand band with live stats */}
      <section data-header-tone="dark" className="on-brand bg-[var(--brand)] px-[var(--edge)] py-24 text-white sm:py-32">
        <div className="mx-auto max-w-[var(--container-wide)]">
          <SectionHeading n="03" kicker="Inside every one" title="Not mockups. Products, thought all the way through." light />
          <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { v: CONCEPTS.length, l: 'Each one taken end to end' },
              { v: totalScreens, l: 'Flows, not single frames' },
              { v: totalFeatures, l: 'Scoped, written, and specced' },
              { v: CONCEPTS.length, l: 'A whole identity per idea' },
            ].map((s, i) => (
              <Reveal key={s.l} delay={i * 0.06}>
                <p className="font-sans text-5xl font-black">{s.v}</p>
                <p className="mt-2 text-sm text-white/75">{s.l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What each one is made of */}
      <section className="px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto max-w-[var(--container-wide)]">
          <SectionHeading n="04" kicker="What each one is made of" title="Flow, build, brand." />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {MADE.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.08}>
                <div className="surface-lift h-full overflow-hidden">
                  <div className="flex aspect-[4/3.6] w-full items-center justify-center bg-[var(--paper-2)]">
                    <img src={m.img} alt="" width={m.w} height={m.h} className="w-[70%] object-contain" />
                  </div>
                  <div className="p-6">
                    <span className="kicker" data-n={m.n}>
                      {m.kicker}
                    </span>
                    <h3 className="mt-3 font-sans text-xl font-extrabold tracking-tight">{m.title}</h3>
                    <p className="mt-2 text-sm text-[var(--ink-soft)]">{m.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Your turn"
        title={
          <>
            The sixth one <br /> could be <span className="text-white">yours.</span>
          </>
        }
        sub="Same process, pointed at your problem instead of ours."
        ctaLabel="Start a conversation"
      />

      <SiteFooter />
    </main>
  )
}
