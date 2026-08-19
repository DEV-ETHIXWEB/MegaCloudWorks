import { useParams, Navigate, Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { PageMeta } from '../components/PageMeta'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { Reveal } from '../components/Reveal'
import { CTASection } from '../components/CTASection'
import { ScreensShowcase } from '../components/ScreensShowcase'
import { IPhoneMockup } from '../components/IPhoneMockup'
import { PhoneNavProvider } from '../lib/phoneUI'
import { CONCEPT_SCREENS } from '../lib/conceptScreens'
import { getConcept, getAdjacentConcept } from '../content/concepts'

export function WorkDetail() {
  const { slug } = useParams<{ slug: string }>()
  const concept = getConcept(slug)

  if (!concept) return <Navigate to="/work" replace />

  const next = getAdjacentConcept(concept.slug)
  const HeroScreen = CONCEPT_SCREENS[concept.slug]?.[0]

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <PageMeta
        title={`${concept.name} — ${concept.tagline}`}
        description={concept.blurb}
        path={`/work/${concept.slug}`}
      />
      <SiteHeader tone="dark" />

      {/* Hero — concept's own accent palette */}
      <section
        className="relative overflow-hidden px-[var(--edge)] pb-20 pt-36 text-white sm:pt-44"
        style={{ background: `linear-gradient(160deg, ${concept.heroFrom}, ${concept.heroTo})` }}
      >
        <div
          className="pointer-events-none absolute -right-40 -top-20 size-[36rem] rounded-full opacity-30 blur-3xl"
          style={{ background: concept.accent }}
        />
        <div className="mx-auto grid max-w-[var(--container-wide)] items-center gap-12 lg:grid-cols-[1fr_auto]">
          <div>
            <Link to="/work" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 no-underline hover:text-white">
              <ArrowLeft size={14} /> All concepts
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span
                className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
                style={{ background: concept.accent, color: concept.accentInk }}
              >
                {concept.category}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-white/50">{concept.year}</span>
            </div>
            <h1 className="mt-6 font-sans text-[clamp(2.6rem,7vw,5.5rem)] font-black leading-[0.94] tracking-[-0.03em]">
              {concept.name}
            </h1>
            <p className="mt-3 max-w-lg text-xl text-white/80">{concept.tagline}</p>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-6 border-t border-white/15 pt-8 sm:grid-cols-4">
              {[
                { label: 'Role', value: 'App Design & Development' },
                { label: 'Platform', value: concept.platform },
                { label: 'Timeline', value: concept.timeline },
                { label: 'Category', value: concept.category },
              ].map((m) => (
                <div key={m.label}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">{m.label}</p>
                  <p className="mt-1 text-sm font-semibold text-white/90">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {HeroScreen && (
            <Reveal delay={0.15} className="mx-auto lg:mx-0">
              <PhoneNavProvider index={0} count={CONCEPT_SCREENS[concept.slug].length} onGo={() => {}}>
                <IPhoneMockup size="lg" label={`${concept.name} — ${concept.screens[0]}`}>
                  <HeroScreen accent={concept.accent} />
                </IPhoneMockup>
              </PhoneNavProvider>
            </Reveal>
          )}
        </div>
      </section>

      {/* Problem */}
      <section className="px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto grid max-w-[var(--container-wide)] gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="kicker" data-n="01">
              The problem
            </p>
            <h2 className="mt-4 font-sans text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              {concept.problemTitle}
            </h2>
          </div>
          <Reveal className="space-y-5 lg:col-span-7 lg:col-start-6">
            {concept.problemBody.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-[var(--ink-soft)]">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Key screens — real, tappable phone UI, not placeholder tiles */}
      <section
        className="relative overflow-hidden border-y border-[var(--line)] px-[var(--edge)] pb-28 pt-20 sm:pt-24"
        style={{
          background: `radial-gradient(120% 60% at 50% 0%, ${concept.accent}14, var(--paper-2) 55%)`,
        }}
      >
        <div className="mx-auto max-w-[var(--container-wide)]">
          <div className="mx-auto max-w-xl text-center">
            <p className="kicker justify-center" data-n="01">
              Key screens
            </p>
            <h2 className="mt-4 font-sans text-2xl font-extrabold tracking-tight sm:text-3xl">
              {concept.screensSubtitle}
            </h2>
            <p className="mt-3 text-sm text-[var(--ink-faint)]">
              Live and tappable — try one. Each phone runs the actual interaction, not a picture of it.
            </p>
          </div>
          <div className="mt-16">
            <ScreensShowcase concept={concept} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-[var(--edge)] py-24 sm:py-32">
        <div className="mx-auto max-w-[var(--container-wide)]">
          <p className="kicker" data-n="03">
            Features
          </p>
          <h2 className="mt-4 font-sans text-2xl font-extrabold tracking-tight sm:text-3xl">{concept.featuresSubtitle}</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {concept.features.map((f, i) => {
              const Icon = f.icon
              return (
                <Reveal key={f.title} delay={i * 0.05}>
                  <div className="surface-lift h-full p-6">
                    <span
                      className="inline-flex size-11 items-center justify-center rounded-xl"
                      style={{ background: `${concept.accent}1a`, color: concept.accentText }}
                    >
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-4 font-sans text-lg font-bold">{f.title}</h3>
                    <p className="mt-1.5 text-sm text-[var(--ink-soft)]">{f.body}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Design approach — palette + typeface */}
      <section className="border-t border-[var(--line)] bg-[var(--near-black)] px-[var(--edge)] py-24 text-white sm:py-32">
        <div className="mx-auto max-w-[var(--container-wide)]">
          <p className="kicker" data-n="04" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Design approach
          </p>
          <h2 className="mt-4 font-sans text-2xl font-extrabold tracking-tight sm:text-3xl">Palette & typeface</h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div className="grid gap-4 sm:grid-cols-3">
              {concept.palette.map((p) => (
                <Reveal key={p.hex}>
                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    <div className="h-24" style={{ background: p.hex }} />
                    <div className="bg-white/5 p-4">
                      <p className="font-mono text-xs text-white/60">{p.hex}</p>
                      <p className="mt-1 text-sm font-bold">{p.name}</p>
                      <p className="mt-0.5 text-xs text-white/50">{p.usage}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1} className="flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Typeface</p>
              <p className="mt-3 font-sans text-6xl font-black tracking-tight">{concept.typeface}</p>
              <p className="mt-3 max-w-sm text-white/60">
                Set as the concept's own display face, distinct from the MegaCloudWorks Geologica system, so each
                idea reads as its own product rather than a re-skin.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection eyebrow="Your turn" title="Want something like this, for real?" sub="Same process, pointed at your problem instead of ours." />

      {/* Next concept */}
      <section className="border-t border-[var(--line)] px-[var(--edge)] py-12">
        <Link
          to={`/work/${next.slug}`}
          className="mx-auto flex max-w-[var(--container-wide)] items-center justify-between gap-4 no-underline"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">Next concept</p>
            <p className="mt-1 font-sans text-2xl font-extrabold tracking-tight text-[var(--ink)]">{next.name}</p>
          </div>
          <ArrowRight className="text-[var(--brand)]" size={24} />
        </Link>
      </section>

      <SiteFooter />
    </main>
  )
}
