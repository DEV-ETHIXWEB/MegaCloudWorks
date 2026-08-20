import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { BRAND, NAV, HERO, SERVICES, STEPS, WORK, STATS } from '../content'

export function Brutalism() {
  return (
    <main className="min-h-screen bg-[#fdfdf5] font-sans text-black">
      <Link
        to="/concepts"
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-1.5 border-2 border-black bg-white px-3 py-1.5 text-xs font-black uppercase text-black no-underline"
      >
        <ArrowLeft size={13} /> All concepts
      </Link>

      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black py-5 pl-44 pr-6 sm:pl-48 sm:pr-10">
        <span className="text-base font-black uppercase tracking-tight sm:text-2xl">
          {BRAND.name}
        </span>
        <nav className="flex flex-wrap items-center gap-5">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="text-sm font-black uppercase text-black no-underline hover:bg-[var(--brand)] hover:text-white"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#contact"
            className="border-2 border-black bg-[var(--brand)] px-4 py-2 text-sm font-black uppercase text-white no-underline shadow-[4px_4px_0_#000]"
          >
            {HERO.cta}
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="border-b-4 border-black px-6 py-16 sm:px-10 sm:py-24">
        <motion.div
          initial={{ opacity: 0, rotate: -1 }}
          animate={{ opacity: 1, rotate: -1 }}
          transition={{ duration: 0.4 }}
          className="inline-block border-2 border-black bg-[var(--brand)] px-3 py-1 text-xs font-black uppercase text-white"
        >
          {HERO.eyebrow}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 max-w-4xl text-[clamp(2.6rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-[-0.02em]"
        >
          We build apps.
          <br />
          <span className="bg-black text-[var(--brand)]">End to end.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 max-w-lg border-l-4 border-black pl-4 text-lg font-bold"
        >
          {HERO.sub}
        </motion.p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#contact"
            className="border-2 border-black bg-black px-6 py-3 text-sm font-black uppercase text-white no-underline shadow-[6px_6px_0_var(--brand)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            {HERO.cta}
          </a>
          <a
            href="#work"
            className="border-2 border-black bg-white px-6 py-3 text-sm font-black uppercase text-black no-underline shadow-[6px_6px_0_#000] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            {HERO.ctaSecondary}
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 divide-x-4 divide-black border-b-4 border-black bg-black text-white">
        {STATS.map((s) => (
          <div key={s.label} className="px-6 py-10 text-center">
            <p className="text-4xl font-black text-[var(--brand-2)] sm:text-5xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-black uppercase tracking-widest text-white/70">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      {/* Services */}
      <section id="services" className="border-b-4 border-black px-6 py-16 sm:px-10">
        <h2 className="text-3xl font-black uppercase">What we do</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="border-2 border-black bg-white p-6 shadow-[6px_6px_0_#000]"
            >
              <h3 className="text-2xl font-black uppercase">{s.title}</h3>
              <p className="mt-2 font-semibold text-black/70">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="about" className="border-b-4 border-black bg-[var(--brand)] px-6 py-16 sm:px-10">
        <h2 className="text-3xl font-black uppercase text-white">
          How we work
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="border-2 border-black bg-white p-5 shadow-[5px_5px_0_#000]"
            >
              <span className="text-3xl font-black">{s.n}</span>
              <h4 className="mt-2 text-lg font-black uppercase">{s.title}</h4>
              <p className="text-xs font-black uppercase text-black/50">
                {s.meta}
              </p>
              <p className="mt-2 text-sm font-semibold text-black/70">
                {s.blurb}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Work */}
      <section id="work" className="border-b-4 border-black px-6 py-16 sm:px-10">
        <h2 className="text-3xl font-black uppercase">Selected work</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {WORK.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="border-2 border-black bg-white shadow-[6px_6px_0_#000]"
            >
              <div className="aspect-[4/3] overflow-hidden border-b-2 border-black">
                <img src={w.img} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <h4 className="text-lg font-black uppercase">{w.title}</h4>
                <p className="text-sm font-bold text-[var(--brand-text)]">
                  {w.category}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section id="contact" className="bg-black px-6 py-20 text-white sm:px-10 sm:py-28">
        <h2 className="max-w-2xl text-[clamp(2rem,5.5vw,4rem)] font-black uppercase leading-[0.95]">
          Let's build something{' '}
          <span className="text-[var(--brand-2)]">loud.</span>
        </h2>
        <a
          href={`mailto:${BRAND.email}`}
          className="mt-8 inline-block border-2 border-white bg-[var(--brand)] px-6 py-3 text-lg font-black text-white no-underline shadow-[6px_6px_0_#fff]"
        >
          {BRAND.email}
        </a>
        <p className="mt-10 text-xs font-bold uppercase text-white/50">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </section>
    </main>
  )
}
