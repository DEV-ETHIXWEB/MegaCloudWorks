const ITEMS = [
  {
    img: '/showcase-app.png',
    title: 'App Design',
    desc: 'Thoughtful UX and polished interfaces.',
  },
  {
    img: '/code.png',
    title: 'App Development',
    desc: 'Clean, and performant code, shipped on time.',
  },
  {
    img: '/design.png',
    title: 'Brand & UI',
    desc: 'Visual systems that feel cohesive.',
  },
]

export function WhatWeDo() {
  return (
    <section
      id="what-we-do"
      className="scroll-mt-24 px-[7px] py-20 sm:px-[11px] sm:py-28"
    >
      <div className="mx-auto max-w-[1100px]">
        <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink-faint)]">
          What we do
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <article
              key={item.title}
              className="group relative min-h-[240px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6 shadow-[0_1px_2px_rgba(16,16,20,0.04)] transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(16,16,20,0.10)]"
            >
              <h3 className="relative z-10 font-display text-2xl font-extrabold leading-tight tracking-tight text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="relative z-10 mt-2 max-w-[9.5rem] text-sm leading-snug text-[var(--ink-soft)]">
                {item.desc}
              </p>
              <img
                src={item.img}
                alt={item.title}
                loading="lazy"
                className="pointer-events-none absolute bottom-0 right-0 w-[60%] max-w-[190px] translate-x-3 translate-y-3 object-contain transition-transform duration-300 group-hover:translate-y-1"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhatWeDo
