import { Reveal } from './Reveal'
import { STATS } from '../content/home'

export function StatsSection() {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--near-black)]">
      <div className="mx-auto grid max-w-[var(--container-wide)] grid-cols-1 divide-y divide-white/10 px-[var(--edge)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="px-2 py-10 text-center sm:px-8">
            <p className="font-sans text-5xl font-black tracking-tight text-white sm:text-6xl">
              {s.value}
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
