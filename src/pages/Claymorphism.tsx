import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { BRAND, NAV, HERO, SERVICES, STEPS, WORK, STATS } from '../content'

const clay =
  'rounded-[2rem] border-2 border-white bg-white shadow-[0_10px_0_-2px_rgba(16,16,20,0.06),0_18px_36px_-12px_rgba(16,16,20,0.18),inset_0_2px_0_rgba(255,255,255,0.9)]'
const clayBrand =
  'rounded-[2rem] border-2 border-white/40 bg-[var(--brand)] shadow-[0_10px_0_-2px_rgba(120,12,18,0.35),0_18px_36px_-12px_rgba(120,12,18,0.5),inset_0_2px_0_rgba(255,255,255,0.35)]'

export function Claymorphism() {
  return (
    <main className="min-h-screen bg-[#fef3f2] font-sans text-[var(--ink)]">
      <Link
        to="/concepts"
        className={`fixed left-4 top-4 z-50 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[var(--ink)] no-underline ${clay}`}
      >
        <ArrowLeft size={13} /> All concepts
      </Link>

      {/* Header */}
      <header className="mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-8 pl-40 pr-6 lg:flex-nowrap lg:pl-40 lg:pr-10">
        <span className="text-xl font-extrabold tracking-tight">
          {BRAND.name}
        </span>
        <nav className="hidden items-center gap-2 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="rounded-full px-4 py-2 text-sm font-bold text-[var(--ink-soft)] no-underline hover:bg-white"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className={`px-5 py-2.5 text-sm font-bold text-white no-underline ${clayBrand}`}
        >
          {HERO.cta}
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-6 py-14 sm:px-10 sm:py-20">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
              className={`inline-block px-4 py-1.5 text-xs font-bold text-[var(--brand-text)] ${clay}`}
            >
              {HERO.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
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
              <motion.a
                whileHover={{ y: -3 }}
                whileTap={{ y: 1 }}
                href="#contact"
                className={`px-7 py-3.5 text-sm font-bold text-white no-underline ${clayBrand}`}
              >
                {HERO.cta}
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                whileTap={{ y: 1 }}
                href="#work"
                className={`px-7 py-3.5 text-sm font-bold text-[var(--ink)] no-underline ${clay}`}
              >
                {HERO.ctaSecondary}
              </motion.a>
            </div>
          </div>
          <div className={`aspect-square overflow-hidden p-4 ${clay}`}>
            <div className="h-full w-full overflow-hidden rounded-[1.5rem]">
              <img
                src="/hero-background.webp"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto grid max-w-[1200px] grid-cols-3 gap-5 px-6 pb-10 sm:px-10">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.06, type: 'spring', bounce: 0.4 }}
            className={`px-4 py-7 text-center ${clay}`}
          >
            <p className="text-3xl font-extrabold text-[var(--brand)] sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
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
              whileHover={{ y: -6, rotate: -1 }}
              className={`p-7 ${clay}`}
            >
              <div className={`inline-flex size-12 items-center justify-center text-white ${clayBrand}`}>
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
              className={`p-6 ${clay}`}
            >
              <span className={`inline-flex size-9 items-center justify-center rounded-full text-sm font-bold text-white ${clayBrand}`}>
                {s.n}
              </span>
              <h4 className="mt-4 font-bold">{s.title}</h4>
              <p className="text-xs font-bold text-[var(--ink-faint)]">
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
              whileHover={{ y: -6 }}
              className={`p-3 ${clay}`}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-[1.4rem]">
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
        <div className={`px-8 py-16 text-center sm:px-16 ${clayBrand}`}>
          <h2 className="text-[clamp(1.8rem,4.5vw,3rem)] font-extrabold leading-tight tracking-tight text-white">
            Ready to build something?
          </h2>
          <motion.a
            whileHover={{ y: -3 }}
            whileTap={{ y: 1 }}
            href={`mailto:${BRAND.email}`}
            className={`mt-8 inline-block px-7 py-3.5 text-sm font-bold text-[var(--brand-text)] no-underline ${clay}`}
          >
            {BRAND.email}
          </motion.a>
        </div>
        <p className="mt-8 text-center text-xs text-[var(--ink-faint)]">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </section>
    </main>
  )
}
