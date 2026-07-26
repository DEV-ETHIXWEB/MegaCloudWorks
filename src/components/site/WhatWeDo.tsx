import { Link } from '@tanstack/react-router'

const ITEMS = [
  {
    img: '/showcase-app.png',
    title: 'App Design',
    desc: 'Thoughtful UX and polished interfaces.',
    to: '/services',
    hash: 'app-design',
  },
  {
    img: '/code.png',
    title: 'App Development',
    desc: 'Clean, and performant code, shipped on time.',
    to: '/services',
    hash: 'app-development',
  },
  {
    img: '/design.png',
    title: 'Brand & UI',
    desc: 'Visual systems that feel cohesive.',
    to: '/services',
    hash: 'brand-ui',
  },
] as const

export function WhatWeDo() {
  return (
    <section
      id="what-we-do"
      className="scroll-mt-24 px-6 py-20 sm:px-10 sm:py-28 lg:px-20"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink-faint)]">
            What we do
          </p>
          <Link
            to="/services"
            className="text-sm font-semibold text-[var(--brand)] no-underline transition-opacity hover:opacity-70"
          >
            View all services →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              hash={item.hash}
              className="group relative block min-h-[240px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6 no-underline shadow-[0_1px_2px_rgba(16,16,20,0.04)] transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(16,16,20,0.10)]"
            >
              <h3 className="relative z-10 font-display text-2xl font-extrabold leading-tight tracking-tight text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="relative z-10 mt-2 max-w-[9.5rem] text-sm leading-snug text-[var(--ink-soft)]">
                {item.desc}
              </p>
              <span className="relative z-10 mt-4 inline-block text-sm font-semibold text-[var(--brand)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Learn more →
              </span>
              <img
                src={item.img}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="pointer-events-none absolute bottom-0 right-0 w-[60%] max-w-[190px] translate-x-3 translate-y-3 object-contain transition-transform duration-300 group-hover:translate-y-1"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhatWeDo
