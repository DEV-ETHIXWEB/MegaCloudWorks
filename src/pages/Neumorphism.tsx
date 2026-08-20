import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { BRAND, NAV, HERO, SERVICES, STEPS, WORK, STATS } from '../content'

const raised = 'bg-[#eef0f3] shadow-[8px_8px_16px_#c8cad0,-8px_-8px_16px_#ffffff]'
const inset = 'bg-[#eef0f3] shadow-[inset_5px_5px_10px_#c8cad0,inset_-5px_-5px_10px_#ffffff]'

export function Neumorphism() {
  return (
    <main className="min-h-screen bg-[#eef0f3] font-sans text-[var(--ink)]">
      <Link
        to="/concepts"
        className={`fixed left-4 top-4 z-50 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-[var(--ink)] no-underline ${raised}`}
      >
        <ArrowLeft size={13} /> All concepts
      </Link>

      {/* Header */}
      <header className="mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-8 pl-40 pr-6 lg:flex-nowrap lg:pl-40 lg:pr-10">
        <span className="text-lg font-extrabold tracking-tight">
          {BRAND.name}
        </span>
        <nav className="hidden items-center gap-2 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--ink-soft)] no-underline transition-shadow hover:shadow-[inset_3px_3px_6px_#c8cad0,inset_-3px_-3px_6px_#ffffff]"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className={`rounded-full px-5 py-2.5 text-sm font-bold text-[var(--brand)] no-underline ${raised}`}
        >
          {HERO.cta}
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 sm:px-10 sm:py-20">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`inline-block rounded-full px-4 py-1.5 text-xs font-bold text-[var(--brand)] ${inset}`}
            >
              {HERO.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-[clamp(2.4rem,5.5vw,3.8rem)] font-extrabold leading-[1.02] tracking-[-0.02em]"
            >
              We design and build apps{' '}
              <span className="text-[var(--brand)]">end to end.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 max-w-md text-[var(--ink-soft)]"
            >
              {HERO.sub}
            </motion.p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className={`rounded-2xl px-7 py-3.5 text-sm font-bold text-[var(--brand)] no-underline transition-shadow hover:shadow-[inset_5px_5px_10px_#c8cad0,inset_-5px_-5px_10px_#ffffff] ${raised}`}
              >
                {HERO.cta}
              </a>
              <a
                href="#work"
                className="text-sm font-semibold text-[var(--ink-soft)] no-underline"
              >
                {HERO.ctaSecondary} →
              </a>
            </div>
          </div>
          <div className={`aspect-square rounded-[2.5rem] p-3 ${raised}`}>
            <div className={`h-full w-full overflow-hidden rounded-[2rem] ${inset}`}>
              <img
                src="/hero-background.webp"
                alt=""
                className="h-full w-full object-cover opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto grid max-w-[1200px] grid-cols-3 gap-6 px-6 py-10 sm:px-10">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={`rounded-2xl px-4 py-8 text-center ${raised}`}
          >
            <p className="text-3xl font-extrabold text-[var(--brand)] sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
              {s.label}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10">
        <h2 className="text-2xl font-extrabold tracking-tight">What we do</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`rounded-3xl p-7 transition-transform hover:-translate-y-1 ${raised}`}
            >
              <div className={`inline-flex size-11 items-center justify-center rounded-2xl text-[var(--brand)] ${inset}`}>
                {i + 1}
              </div>
              <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="about" className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10">
        <h2 className="text-2xl font-extrabold tracking-tight">How we work</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`rounded-3xl p-6 ${raised}`}
            >
              <span className={`inline-flex size-9 items-center justify-center rounded-full text-sm font-bold text-[var(--brand)] ${inset}`}>
                {s.n}
              </span>
              <h4 className="mt-4 font-bold">{s.title}</h4>
              <p className="text-xs font-semibold text-[var(--ink-faint)]">
                {s.meta}
              </p>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">{s.blurb}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Work */}
      <section id="work" className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10">
        <h2 className="text-2xl font-extrabold tracking-tight">Selected work</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {WORK.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`rounded-3xl p-3 ${raised}`}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <img src={w.img} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="px-3 py-4">
                <h4 className="font-bold">{w.title}</h4>
                <p className="text-sm text-[var(--ink-faint)]">{w.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section id="contact" className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10">
        <div className={`rounded-[2.5rem] px-8 py-16 text-center sm:px-16 ${raised}`}>
          <h2 className="text-[clamp(1.8rem,4.5vw,3rem)] font-extrabold leading-tight tracking-tight">
            Ready to build something?
          </h2>
          <a
            href={`mailto:${BRAND.email}`}
            className={`mt-8 inline-block rounded-2xl px-7 py-3.5 text-sm font-bold text-[var(--brand)] no-underline ${inset}`}
          >
            {BRAND.email}
          </a>
        </div>
        <p className="mt-8 text-center text-xs text-[var(--ink-faint)]">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </section>
    </main>
  )
}
