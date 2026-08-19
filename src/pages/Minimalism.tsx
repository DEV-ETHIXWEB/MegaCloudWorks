import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { BRAND, NAV, HERO, SERVICES, STEPS, WORK, STATS } from '../content'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
}

export function Minimalism() {
  return (
    <main className="min-h-screen bg-white text-[var(--ink)]">
      <Link
        to="/concepts"
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1.5 text-xs font-semibold text-white no-underline backdrop-blur"
      >
        <ArrowLeft size={13} /> All concepts
      </Link>

      {/* Header */}
      <header className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-10 sm:px-8">
        <span className="text-sm font-bold tracking-tight">{BRAND.name}</span>
        <nav className="hidden items-center gap-10 sm:flex">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="text-sm text-[var(--ink-soft)] no-underline transition-colors hover:text-[var(--ink)]"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="text-sm font-semibold text-[var(--ink)] no-underline"
        >
          {HERO.cta} →
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1100px] px-6 pb-28 pt-16 sm:px-8">
        <motion.p
          {...fadeUp}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-faint)]"
        >
          {HERO.eyebrow}
        </motion.p>
        <motion.h1
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.08 }}
          className="mt-8 max-w-3xl text-[clamp(2.6rem,7vw,5.4rem)] font-light leading-[1.02] tracking-[-0.03em]"
        >
          We design and build apps{' '}
          <span className="text-[var(--brand)]">end to end.</span>
        </motion.h1>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.16 }}
          className="mt-8 max-w-md text-lg leading-relaxed text-[var(--ink-soft)]"
        >
          {HERO.sub}
        </motion.p>
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.24 }}
          className="mt-10 flex items-center gap-8"
        >
          <a
            href="#contact"
            className="border-b-2 border-[var(--ink)] pb-1 text-sm font-semibold no-underline"
          >
            {HERO.cta}
          </a>
          <a
            href="#work"
            className="text-sm text-[var(--ink-soft)] no-underline hover:text-[var(--ink)]"
          >
            {HERO.ctaSecondary}
          </a>
        </motion.div>
      </section>

      {/* thin rule */}
      <div className="mx-auto max-w-[1100px] px-6 sm:px-8">
        <div className="h-px w-full bg-[var(--line)]" />
      </div>

      {/* Stats */}
      <section className="mx-auto grid max-w-[1100px] grid-cols-3 gap-6 px-6 py-16 sm:px-8">
        {STATS.map((s) => (
          <motion.div key={s.label} {...fadeUp}>
            <p className="text-4xl font-light tracking-tight sm:text-5xl">
              {s.value}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--ink-faint)]">
              {s.label}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-[1100px] px-6 py-24 sm:px-8">
        <motion.p
          {...fadeUp}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-faint)]"
        >
          What we do
        </motion.p>
        <div className="mt-10 divide-y divide-[var(--line)] border-t border-[var(--line)]">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              className="group flex items-center justify-between gap-6 py-8"
            >
              <div>
                <h3 className="text-2xl font-light tracking-tight sm:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-1 text-[var(--ink-soft)]">{s.desc}</p>
              </div>
              <ArrowUpRight
                className="shrink-0 text-[var(--ink-faint)] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--brand)]"
                size={22}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="about" className="mx-auto max-w-[1100px] px-6 py-24 sm:px-8">
        <motion.p
          {...fadeUp}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-faint)]"
        >
          How we work
        </motion.p>
        <div className="mt-10 grid gap-x-12 gap-y-14 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
            >
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-semibold text-[var(--brand)]">
                  {s.n}
                </span>
                <span className="text-xs uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                  {s.meta}
                </span>
              </div>
              <h4 className="mt-3 text-xl font-medium tracking-tight">
                {s.title}
              </h4>
              <p className="mt-2 max-w-sm text-[var(--ink-soft)]">{s.blurb}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Work */}
      <section id="work" className="mx-auto max-w-[1100px] px-6 py-24 sm:px-8">
        <motion.p
          {...fadeUp}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-faint)]"
        >
          Selected work
        </motion.p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {WORK.map((w, i) => (
            <motion.div
              key={w.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[var(--paper-2)]">
                <img
                  src={w.img}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h4 className="mt-4 text-lg font-medium tracking-tight">
                {w.title}
              </h4>
              <p className="text-sm text-[var(--ink-faint)]">{w.category}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section id="contact" className="mx-auto max-w-[1100px] px-6 py-28 sm:px-8">
        <motion.h2
          {...fadeUp}
          className="max-w-2xl text-[clamp(2rem,5vw,3.4rem)] font-light leading-[1.05] tracking-[-0.02em]"
        >
          Ready to build something?{' '}
          <span className="text-[var(--brand)]">Let's talk.</span>
        </motion.h2>
        <motion.div {...fadeUp} className="mt-8">
          <a
            href={`mailto:${BRAND.email}`}
            className="border-b-2 border-[var(--ink)] pb-1 text-lg font-medium no-underline"
          >
            {BRAND.email}
          </a>
        </motion.div>
      </section>

      <footer className="mx-auto max-w-[1100px] px-6 py-10 text-xs text-[var(--ink-faint)] sm:px-8">
        © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
      </footer>
    </main>
  )
}
