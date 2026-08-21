import { Reveal } from './Reveal'
import { PRINCIPLES } from '../content/home'

export function StatsSection() {
  return (
    <section className="relative isolate overflow-hidden border-y border-[var(--line)] bg-[var(--near-black)]">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[var(--container-wide)] grid-cols-1 gap-10 px-[var(--edge)] py-16 sm:grid-cols-3 sm:gap-8 sm:py-20">
        {PRINCIPLES.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08} className="relative border-l-2 border-[var(--brand)] pl-4">
            <p className="font-sans text-lg font-black text-white sm:text-xl">{p.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/50">{p.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
