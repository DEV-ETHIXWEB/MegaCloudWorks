import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

const CONCEPTS = [
  {
    to: '/concepts/minimalism',
    name: 'Minimalism',
    desc: 'Radical restraint. Whitespace as the loudest element, one accent color, no ornament.',
    bg: '#ffffff',
    fg: '#101014',
  },
  {
    to: '/concepts/swiss',
    name: 'Swiss Design',
    desc: 'Grid-locked type, red as a structural signal, International Typographic Style.',
    bg: '#ffffff',
    fg: '#101014',
  },
  {
    to: '/concepts/brutalism',
    name: 'Brutalism',
    desc: 'Raw, unapologetic, oversized type, hard edges, thick borders, zero polish.',
    bg: '#f5333b',
    fg: '#101014',
  },
  {
    to: '/concepts/neumorphism',
    name: 'Neumorphism',
    desc: 'Soft extruded UI, subtle dual shadows, everything looks pressed from the same material.',
    bg: '#f0f0f3',
    fg: '#101014',
  },
  {
    to: '/concepts/glassmorphism',
    name: 'Glassmorphism',
    desc: 'Frosted layers, blur, depth, floating panels over a rich gradient backdrop.',
    bg: '#1a1020',
    fg: '#ffffff',
  },
  {
    to: '/concepts/claymorphism',
    name: 'Claymorphism',
    desc: 'Puffy 3D shapes, soft shadows, playful and tactile, rounded like modeling clay.',
    bg: '#fef3f2',
    fg: '#101014',
  },
] as const

export function Gallery() {
  return (
    <main className="min-h-screen bg-[var(--paper-2)] px-6 py-16 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-text)]">
          MegaCloudWorks — redesign concepts
        </p>
        <h1 className="mt-4 font-sans text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-[var(--ink)]">
          Six directions.
          <br />
          <span className="text-[var(--brand)]">Same brand, same words.</span>
        </h1>
        <p className="mt-4 max-w-xl text-[var(--ink-soft)]">
          Every concept reuses the exact MegaCloudWorks copy, brand red (#f5333b) and
          Geologica typeface — only the visual language changes. Pick the direction
          that should become the real site.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CONCEPTS.map((c, i) => (
            <motion.div
              key={c.to}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={c.to}
                className="group block overflow-hidden rounded-2xl border border-[var(--line)] no-underline shadow-sm transition-shadow hover:shadow-xl"
              >
                <div
                  style={{ background: c.bg, color: c.fg }}
                  className="flex h-40 items-center justify-center text-2xl font-extrabold tracking-tight"
                >
                  {c.name}
                </div>
                <div className="bg-[var(--paper)] p-6">
                  <h3 className="font-sans text-lg font-bold text-[var(--ink)]">
                    {c.name}
                  </h3>
                  <p className="mt-2 text-sm leading-snug text-[var(--ink-soft)]">
                    {c.desc}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-[var(--brand-text)] transition-transform group-hover:translate-x-1">
                    View concept →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
