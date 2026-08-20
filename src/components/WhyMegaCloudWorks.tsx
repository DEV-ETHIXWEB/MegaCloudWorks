import { useState } from 'react'
import { Palette, Layers, Users, Rocket } from 'lucide-react'
import { Reveal } from './Reveal'
import { COLUMNS } from '../content/services'

const ICONS = [Palette, Layers, Users, Rocket]

/**
 * "What working with us actually feels like" — four reasons, rebuilt from
 * four flat bordered columns into panels that respond.
 *
 * Restraint is the point: on a full-bleed brand-red band, anything with
 * real color would shout, so each panel is just frosted white at very low
 * alpha. Hovering (or focusing) one lifts it, lightens the frost a step,
 * brightens its hairline, and grows a short rule under the title — four
 * small moves in the same direction rather than one big effect.
 */
export function WhyMegaCloudWorks() {
  const [active, setActive] = useState<number | null>(null)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((c, i) => {
        const Icon = ICONS[i % ICONS.length]
        const on = active === i
        return (
          <Reveal key={c.title} delay={i * 0.07}>
            <div
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group relative h-full overflow-hidden rounded-2xl p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              style={{
                background: on ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)',
                boxShadow: on
                  ? '0 18px 40px -20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.28)'
                  : '0 8px 22px -18px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.16)',
                border: `1px solid ${on ? 'rgba(255,255,255,0.34)' : 'rgba(255,255,255,0.16)'}`,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transform: on && !reduced ? 'translateY(-6px)' : 'translateY(0)',
                transition:
                  'transform 420ms cubic-bezier(0.22,1,0.36,1), background 420ms ease, border-color 420ms ease, box-shadow 420ms ease',
              }}
            >
              {/* oversized ghost numeral, anchored top-right */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-1 -top-3 font-sans text-6xl font-black leading-none transition-colors duration-500"
                style={{ color: on ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <span
                className="relative flex size-11 items-center justify-center rounded-xl transition-colors duration-500"
                style={{
                  background: on ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.14)',
                  color: on ? 'var(--brand-text)' : '#fff',
                }}
              >
                <Icon size={19} strokeWidth={2} />
              </span>

              <p className="relative mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">{c.kicker}</p>
              <h3 className="relative mt-2 font-sans text-xl font-extrabold tracking-tight text-white">{c.title}</h3>

              {/* the rule grows out from under the title on hover */}
              <span
                aria-hidden="true"
                className="relative mt-3 block h-px rounded-full bg-white/70"
                style={{
                  width: on ? '2.5rem' : '1rem',
                  opacity: on ? 1 : 0.45,
                  transition: 'width 420ms cubic-bezier(0.22,1,0.36,1), opacity 420ms ease',
                }}
              />

              <p className="relative mt-3 text-sm leading-relaxed text-white/75">{c.body}</p>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}
