import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { BRAND, NAV, HERO, SERVICES, STEPS, WORK, STATS } from '../content'

const glass =
  'border border-white/15 bg-white/8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]'

export function Glassmorphism() {
  return (
    <main className="relative min-h-screen overflow-hidden font-sans text-white">
      {/* rich gradient backdrop */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 15% 10%, rgba(245,51,59,0.45), transparent 60%), radial-gradient(50% 45% at 85% 20%, rgba(255,106,61,0.35), transparent 60%), radial-gradient(70% 60% at 50% 100%, rgba(120,20,90,0.5), transparent 60%), linear-gradient(160deg, #1a1020 0%, #120a18 100%)',
        }}
      />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_50%)]" />

      <Link
        to="/concepts"
        className={`fixed left-4 top-4 z-50 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white no-underline ${glass}`}
      >
        <ArrowLeft size={13} /> All concepts
      </Link>

      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-5 sm:px-10">
        <div className={`mx-auto flex max-w-[1300px] flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-2xl py-3 pl-40 pr-6 lg:flex-nowrap lg:pl-40 lg:pr-6 ${glass}`}>
          <span className="text-lg font-extrabold tracking-tight">
            {BRAND.name}
          </span>
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="text-sm font-semibold text-white/80 no-underline hover:text-white"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="rounded-full bg-[var(--brand)] px-5 py-2 text-sm font-bold text-white no-underline shadow-[0_4px_20px_rgba(245,51,59,0.5)]"
          >
            {HERO.cta}
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1100px] px-6 py-20 text-center sm:px-10 sm:py-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`mx-auto inline-block rounded-full px-4 py-1.5 text-xs font-bold text-white/90 ${glass}`}
        >
          {HERO.eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-7 max-w-3xl text-[clamp(2.4rem,6.5vw,5rem)] font-extrabold leading-[1.02] tracking-[-0.02em]"
        >
          We design and build apps{' '}
          <span className="bg-gradient-to-r from-[#ff6a3d] to-[#f5333b] bg-clip-text text-transparent">
            end to end.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-md text-white/70"
        >
          {HERO.sub}
        </motion.p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#contact"
            className="rounded-full bg-[var(--brand)] px-7 py-3.5 text-sm font-bold text-white no-underline shadow-[0_4px_24px_rgba(245,51,59,0.55)]"
          >
            {HERO.cta}
          </a>
          <a
            href="#work"
            className={`rounded-full px-7 py-3.5 text-sm font-bold text-white no-underline ${glass}`}
          >
            {HERO.ctaSecondary}
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto grid max-w-[1100px] grid-cols-3 gap-5 px-6 pb-10 sm:px-10">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={`rounded-2xl px-4 py-7 text-center ${glass}`}
          >
            <p className="text-3xl font-extrabold sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/60">
              {s.label}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-[1100px] px-6 py-20 sm:px-10">
        <h2 className="text-2xl font-extrabold tracking-tight">What we do</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`rounded-2xl p-6 transition-transform hover:-translate-y-1 ${glass}`}
            >
              <h3 className="text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-white/65">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="about" className="mx-auto max-w-[1100px] px-6 py-20 sm:px-10">
        <h2 className="text-2xl font-extrabold tracking-tight">How we work</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`rounded-2xl p-6 ${glass}`}
            >
              <span className="text-3xl font-extrabold text-[var(--brand-2)]">
                {s.n}
              </span>
              <h4 className="mt-3 font-bold">{s.title}</h4>
              <p className="text-xs font-semibold text-white/50">{s.meta}</p>
              <p className="mt-2 text-sm text-white/65">{s.blurb}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Work */}
      <section id="work" className="mx-auto max-w-[1100px] px-6 py-20 sm:px-10">
        <h2 className="text-2xl font-extrabold tracking-tight">Selected work</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {WORK.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`overflow-hidden rounded-2xl p-3 ${glass}`}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl">
                <img src={w.img} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="px-2 py-4">
                <h4 className="font-bold">{w.title}</h4>
                <p className="text-sm text-white/55">{w.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section id="contact" className="mx-auto max-w-[1100px] px-6 py-20 sm:px-10">
        <div className={`rounded-[2rem] px-8 py-16 text-center sm:px-16 ${glass}`}>
          <h2 className="text-[clamp(1.8rem,4.5vw,3rem)] font-extrabold leading-tight tracking-tight">
            Ready to build something?
          </h2>
          <a
            href={`mailto:${BRAND.email}`}
            className="mt-8 inline-block rounded-full bg-[var(--brand)] px-7 py-3.5 text-sm font-bold text-white no-underline shadow-[0_4px_24px_rgba(245,51,59,0.55)]"
          >
            {BRAND.email}
          </a>
        </div>
        <p className="mt-8 text-center text-xs text-white/40">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </section>
    </main>
  )
}
