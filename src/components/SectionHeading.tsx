import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

export function SectionHeading({
  n,
  kicker,
  title,
  sub,
  align = 'left',
  light = false,
}: {
  n: string
  kicker: string
  title: ReactNode
  sub?: ReactNode
  align?: 'left' | 'center'
  light?: boolean
}) {
  return (
    <Reveal className={align === 'center' ? 'mx-auto max-w-2xl text-center' : ''}>
      <p className="kicker" data-n={n} style={light ? { color: 'rgba(255,255,255,0.6)' } : undefined}>
        {kicker}
      </p>
      <h2
        className={`mt-4 font-sans text-[clamp(2rem,4.6vw,3.4rem)] font-extrabold leading-[0.98] tracking-[-0.03em] ${
          light ? 'text-white' : 'text-[var(--ink)]'
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-4 max-w-lg text-base leading-relaxed sm:text-lg ${
            align === 'center' ? 'mx-auto' : ''
          } ${light ? 'text-white/70' : 'text-[var(--ink-soft)]'}`}
        >
          {sub}
        </p>
      )}
    </Reveal>
  )
}
