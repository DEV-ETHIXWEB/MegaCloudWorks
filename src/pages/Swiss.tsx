import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { BRAND, NAV, HERO, SERVICES, STEPS, WORK, STATS } from '../content'

export function Swiss() {
  return (
    <main className="min-h-screen bg-white font-sans text-[var(--ink)]">
      <Link
        to="/concepts"
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1.5 text-xs font-semibold text-white no-underline backdrop-blur"
      >
        <ArrowLeft size={13} /> All concepts
      </Link>

      {/* Grid frame: 12 cols, hairline rules, everything snapped to it */}
      <div className="mx-auto max-w-[1400px] border-x border-[var(--line)]">
        {/* Header */}
        <header className="grid grid-cols-12 border-b border-[var(--ink)]">
          <div className="col-span-6 border-r border-[var(--line)] px-6 py-6 sm:col-span-3">
            <span className="text-lg font-extrabold uppercase tracking-tight">
              {BRAND.name}
            </span>
          </div>
          <nav className="col-span-6 hidden items-center justify-end gap-8 px-6 sm:col-span-6 sm:flex">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="text-sm font-semibold uppercase tracking-wide no-underline hover:text-[var(--brand)]"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="col-span-6 flex items-center justify-center bg-[var(--brand)] px-6 py-6 text-sm font-bold uppercase tracking-wide text-white no-underline sm:col-span-3"
          >
            {HERO.cta}
          </a>
        </header>

        {/* Hero — huge grid-numbered type block */}
        <section className="grid grid-cols-12 border-b border-[var(--ink)]">
          <div className="col-span-12 border-r border-[var(--line)] px-6 py-4 sm:col-span-1">
            <span className="text-xs font-bold tracking-widest text-[var(--ink-faint)]">
              01
            </span>
          </div>
          <div className="col-span-12 px-6 py-16 sm:col-span-11 sm:py-24">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--brand)]"
            >
              {HERO.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-4xl text-[clamp(2.6rem,7.5vw,6rem)] font-black uppercase leading-[0.92] tracking-[-0.02em]"
            >
              We design & build apps end to end.
            </motion.h1>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <p className="text-lg leading-snug text-[var(--ink-soft)] sm:col-span-2">
                {HERO.sub}
              </p>
              <a
                href="#work"
                className="self-end text-sm font-bold uppercase tracking-wide text-[var(--ink)] no-underline underline decoration-[var(--brand)] decoration-2 underline-offset-4"
              >
                {HERO.ctaSecondary} →
              </a>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="grid grid-cols-3 border-b border-[var(--ink)]">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`px-6 py-10 ${i < 2 ? 'border-r border-[var(--line)]' : ''}`}
            >
              <p className="text-4xl font-black tracking-tight sm:text-5xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                {s.label}
              </p>
            </div>
          ))}
        </section>

        {/* Services */}
        <section id="services" className="grid grid-cols-12 border-b border-[var(--ink)]">
          <div className="col-span-12 border-r border-[var(--line)] px-6 py-4 sm:col-span-1">
            <span className="text-xs font-bold tracking-widest text-[var(--ink-faint)]">
              02
            </span>
          </div>
          <div className="col-span-12 sm:col-span-11">
            <div className="grid grid-cols-1 sm:grid-cols-3">
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`px-6 py-12 ${i < 2 ? 'border-b sm:border-b-0 sm:border-r' : 'border-b sm:border-b-0'} border-[var(--line)]`}
                >
                  <span className="text-xs font-bold text-[var(--brand)]">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 text-2xl font-extrabold uppercase tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[var(--ink-soft)]">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="about" className="grid grid-cols-12 border-b border-[var(--ink)]">
          <div className="col-span-12 border-r border-[var(--line)] px-6 py-4 sm:col-span-1">
            <span className="text-xs font-bold tracking-widest text-[var(--ink-faint)]">
              03
            </span>
          </div>
          <div className="col-span-12 px-6 py-16 sm:col-span-11">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--ink-faint)]">
              How we work
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-0 sm:grid-cols-4">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`py-6 pr-6 ${i < 3 ? 'sm:border-r sm:border-[var(--line)] sm:mr-6' : ''}`}
                >
                  <span className="text-5xl font-black text-[var(--brand)]">
                    {s.n}
                  </span>
                  <h4 className="mt-3 text-lg font-extrabold uppercase">
                    {s.title}
                  </h4>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
                    {s.meta}
                  </p>
                  <p className="mt-3 text-sm text-[var(--ink-soft)]">{s.blurb}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Work */}
        <section id="work" className="grid grid-cols-12 border-b border-[var(--ink)]">
          <div className="col-span-12 border-r border-[var(--line)] px-6 py-4 sm:col-span-1">
            <span className="text-xs font-bold tracking-widest text-[var(--ink-faint)]">
              04
            </span>
          </div>
          <div className="col-span-12 sm:col-span-11">
            <div className="grid grid-cols-1 sm:grid-cols-3">
              {WORK.map((w, i) => (
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`group ${i < 2 ? 'border-b sm:border-b-0 sm:border-r' : 'border-b sm:border-b-0'} border-[var(--line)]`}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={w.img}
                      alt=""
                      className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                    />
                  </div>
                  <div className="px-6 py-5">
                    <h4 className="text-lg font-extrabold uppercase tracking-tight">
                      {w.title}
                    </h4>
                    <p className="text-sm font-semibold text-[var(--brand-text)]">
                      {w.category}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section id="contact" className="grid grid-cols-12">
          <div className="col-span-12 bg-[var(--brand)] px-6 py-20 text-white sm:col-span-8 sm:py-28">
            <h2 className="text-[clamp(2rem,5.5vw,4rem)] font-black uppercase leading-[0.95] tracking-tight">
              Ready to build
              <br />
              something?
            </h2>
          </div>
          <div className="col-span-12 flex flex-col justify-center border-t border-[var(--ink)] px-6 py-12 sm:col-span-4 sm:border-l sm:border-t-0">
            <a
              href={`mailto:${BRAND.email}`}
              className="text-lg font-bold text-[var(--ink)] no-underline"
            >
              {BRAND.email}
            </a>
            <p className="mt-6 text-xs text-[var(--ink-faint)]">
              © {new Date().getFullYear()} {BRAND.name}
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
