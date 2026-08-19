import { lazy, Suspense } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { PageMeta } from '../components/PageMeta'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { SectionHeading } from '../components/SectionHeading'
import { ServiceCard } from '../components/ServiceCard'
import { WorkCard } from '../components/WorkCard'
import { ProcessSteps } from '../components/ProcessSteps'
import { StatsSection } from '../components/StatsSection'
import { CTASection } from '../components/CTASection'
import { Reveal } from '../components/Reveal'
import { MagneticButton } from '../components/MagneticButton'
import { HOME_HERO, SERVICES } from '../content/home'
import { CONCEPTS, getConcept } from '../content/concepts'
import { STUDIOS, COVERAGE } from '../content/about'

// The homepage's two product-screen moments need the ~1600-line interactive
// phone-UI library. Deferred behind one chunk so it downloads only once a
// visitor is actually scrolling toward it, not as part of the initial
// homepage bundle.
const HeroPhone = lazy(() => import('../components/HomeProductMoments').then((m) => ({ default: m.HeroPhone })))
const ProductExperienceSection = lazy(() =>
  import('../components/HomeProductMoments').then((m) => ({ default: m.ProductExperienceSection })),
)

const HERO_CONCEPT = getConcept('fieldly')!

function PhoneFallback() {
  return (
    <div className="mx-auto aspect-[9/18.5] w-full max-w-[230px] animate-pulse rounded-[2.75rem] bg-[var(--paper-2)] sm:max-w-[260px]" />
  )
}

export function Home() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <PageMeta
        title="MegaCloudWorks · App Design & Development Studio"
        description="MegaCloudWorks is an app design & development studio. We design and build apps end to end — research, UI, and engineering under one roof."
        path="/"
      />
      <SiteHeader />

      {/* 01 — Hero: headline + a real, live product screen as the focal point */}
      <section className="relative overflow-hidden px-[var(--edge)] pb-12 pt-28 sm:pb-16 sm:pt-32">
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
          className="pointer-events-none absolute right-[2%] top-10 -z-10 size-[34rem] rounded-full opacity-[0.3] blur-[100px]"
          style={{ background: 'radial-gradient(circle, var(--brand), transparent 70%)' }}
        />

        <div className="mx-auto max-w-[var(--container-wide)]">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="kicker"
                data-n="01"
              >
                {HOME_HERO.eyebrow}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 font-sans text-[clamp(2.4rem,6vw,5.6rem)] font-black leading-[0.92] tracking-[-0.035em]"
              >
                {HOME_HERO.headlineLines[0]} <br />
                {HOME_HERO.headlineLines[1]}{' '}
                <span className="relative inline-block text-[var(--brand)]">
                  {HOME_HERO.headlineLines[2]}
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    height="10"
                    viewBox="0 0 200 10"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d="M0,6 Q50,0 100,5 T200,4" stroke="var(--brand)" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="mt-5 max-w-md text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg"
              >
                {HOME_HERO.sub}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.3 }}
                className="mt-6 flex flex-wrap items-center gap-4"
              >
                <MagneticButton to="/contact" size="lg">
                  {HOME_HERO.cta} <ArrowRight size={15} />
                </MagneticButton>
                <Link
                  to="/work"
                  className="text-sm font-semibold text-[var(--ink)] no-underline underline decoration-[var(--brand)] decoration-2 underline-offset-4"
                >
                  {HOME_HERO.ctaSecondary}
                </Link>
              </motion.div>
            </div>

            {/* the focal point — a real, tappable product screen, not a stock photo */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <Suspense fallback={<PhoneFallback />}>
                <HeroPhone concept={HERO_CONCEPT} />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 02 — Immediate proof */}
      <StatsSection />

      {/* 03 — What we do */}
      <section id="services" className="px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto max-w-[var(--container-wide)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading n="02" kicker="What we do" title="Three ways in, one team." />
            <Reveal>
              <Link to="/services" className="text-sm font-semibold text-[var(--brand-text)] no-underline hover:opacity-70">
                View all services →
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.title} n={s.n} title={s.title} desc={s.desc} img={s.img} to={s.to} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* 04 — Product experience */}
      <Suspense
        fallback={
          <div className="bg-[var(--brand)] px-[var(--edge)] py-24 sm:py-32">
            <div className="mx-auto h-96 max-w-[var(--container-wide)] animate-pulse rounded-3xl bg-white/10" />
          </div>
        }
      >
        <ProductExperienceSection concept={HERO_CONCEPT} />
      </Suspense>

      {/* 05 — Selected work: one featured, two supporting — not three equal cards */}
      <section id="work" className="px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto max-w-[var(--container-wide)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading n="04" kicker="Selected work" title="Five products that don't exist yet." />
            <Reveal>
              <Link to="/work" className="text-sm font-semibold text-[var(--brand-text)] no-underline hover:opacity-70">
                See the whole index →
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-stretch">
            {/* featured */}
            <Reveal className="lg:w-1/2">
              <Link
                to={`/work/${CONCEPTS[0].slug}`}
                className="surface-lift group flex h-full flex-col overflow-hidden no-underline"
              >
                <div
                  className="relative flex aspect-[4/3] flex-1 items-end overflow-hidden p-8"
                  style={{ background: `linear-gradient(150deg, ${CONCEPTS[0].heroFrom}, ${CONCEPTS[0].heroTo})` }}
                >
                  <span
                    className="absolute right-6 top-6 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
                    style={{ background: CONCEPTS[0].accent, color: CONCEPTS[0].accentInk }}
                  >
                    {CONCEPTS[0].category}
                  </span>
                  <div
                    className="pointer-events-none absolute -bottom-16 -right-16 size-64 rounded-full opacity-30 blur-3xl transition-transform duration-700 group-hover:scale-125"
                    style={{ background: CONCEPTS[0].accent }}
                  />
                  <h3 className="relative font-sans text-4xl font-black tracking-tight text-white sm:text-5xl">
                    {CONCEPTS[0].name}
                  </h3>
                </div>
                <div className="flex items-start justify-between gap-4 p-7">
                  <div>
                    <p className="font-sans text-lg font-bold text-[var(--ink)]">{CONCEPTS[0].tagline}</p>
                    <p className="mt-1.5 max-w-md text-sm text-[var(--ink-soft)]">{CONCEPTS[0].blurb}</p>
                    <p className="mt-2 text-xs font-semibold text-[var(--ink-faint)]">
                      {CONCEPTS[0].platform} · {CONCEPTS[0].timeline}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="mt-1 shrink-0 text-[var(--ink-faint)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--brand)]"
                    size={22}
                  />
                </div>
              </Link>
            </Reveal>

            {/* supporting */}
            <div className="flex flex-col gap-6 lg:w-1/2">
              {CONCEPTS.slice(1, 3).map((c, i) => (
                <WorkCard key={c.slug} concept={c} delay={0.1 + i * 0.08} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 06 — How we work */}
      <section id="process" className="bg-[var(--paper-2)] px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto max-w-[var(--container-wide)]">
          <SectionHeading
            n="05"
            kicker="How we work"
            title={
              <>
                Four steps,
                <br />
                <span className="text-[var(--brand)]">no surprises.</span>
              </>
            }
            sub="Click a stage to see what it actually includes — nine weeks, start to store, the same order every time."
          />
          <div className="mt-12">
            <ProcessSteps />
          </div>
        </div>
      </section>

      {/* 07 — Studio */}
      <section className="border-y border-[var(--line)] px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto grid max-w-[var(--container-wide)] gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="kicker" data-n="06">
              {STUDIOS.eyebrow}
            </p>
          </div>
          <Reveal className="lg:col-span-7 lg:col-start-6">
            <p className="text-[clamp(1.3rem,2.4vw,1.8rem)] font-medium leading-relaxed tracking-tight text-[var(--ink)]">
              {STUDIOS.body}
            </p>
            <p className="mt-6 text-lg text-[var(--ink-soft)]">{COVERAGE.body}</p>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--brand-text)] no-underline hover:opacity-70"
            >
              More about the studio <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 08 — Final CTA */}
      <CTASection
        eyebrow="Let's build"
        title={
          <>
            Ready to build <br /> something?
          </>
        }
        sub="Tell us about your project, we'll come back with a plan."
      />

      <SiteFooter />
    </main>
  )
}
