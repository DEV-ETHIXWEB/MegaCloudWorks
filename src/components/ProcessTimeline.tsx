import { Fragment } from 'react'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal'
import { STEPS } from '../content/home'

// One hand-drawn frame per phase — an unclimbed peak, a map with the
// target marked, a pickaxe breaking ground, a flag planted at the
// summit — standing in for what that phase actually is. Real cutouts
// with proper alpha (no more black canvas baked in), so a CSS
// drop-shadow can trace the illustration's own silhouette instead of a
// box's edges: a thin dark outline that hugs the artwork itself, plus
// a soft lift shadow for depth.
const ICONS = ['/timeline/step1.webp', '/timeline/step2.webp', '/timeline/step3.webp', '/timeline/step4.webp']

function Frame({ icon, className = '' }: { icon: string; className?: string }) {
  return (
    <div className={`group relative aspect-[3/2] w-full ${className}`}>
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04] group-hover:-translate-y-1"
        style={{
          filter: 'drop-shadow(0 0 0.75px rgba(16,16,20,0.85)) drop-shadow(0 8px 14px rgba(16,16,20,0.18))',
        }}
      />
    </div>
  )
}

// A dotted connector with a small light that keeps travelling from
// step to step, left to right — every connector fires in turn on one
// shared 6s cycle, so the glow visibly makes its way across all three
// gaps toward the fourth, final step, then loops.
function Connector({ index }: { index: number }) {
  return (
    <div className="relative flex h-3 w-10 items-center xl:w-14" aria-hidden="true">
      <div className="flex w-full items-center justify-between pr-4">
        {Array.from({ length: 5 }).map((_, dot) => (
          <span key={dot} className="size-[3px] rounded-full bg-[var(--brand)]/40" />
        ))}
      </div>
      <ArrowRight size={13} strokeWidth={2.5} className="absolute right-0 text-[var(--brand)]" />
      <motion.span
        className="absolute top-1/2 size-[5px] -translate-y-1/2 rounded-full bg-[var(--brand)]"
        style={{ boxShadow: '0 0 7px 2px rgba(193,20,32,0.6)' }}
        initial={{ left: '0%', opacity: 0 }}
        animate={{ left: ['0%', '0%', '84%', '84%'], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          repeatDelay: 4.4,
          delay: index * 2,
          ease: 'easeInOut',
          times: [0, 0.06, 0.9, 1],
        }}
      />
    </div>
  )
}

/**
 * "How we work" as an illustrated waypoint trail instead of the old
 * click-to-expand accordion: number, frame, title, one-line caption, a
 * dotted connector — with a light that keeps travelling step to step —
 * carrying the eye from one phase into the next.
 */
export function ProcessTimeline() {
  return (
    <>
      {/* Below lg: a plain 2/4-col grid, no connectors — the travelling
          light is a "reading order" cue that only makes sense once
          everything sits on one line. */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 sm:gap-x-8 lg:hidden">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08} className="flex flex-col items-start">
            <span className="font-sans text-2xl font-black text-[var(--brand)] sm:text-3xl">{s.n}</span>
            <Frame icon={ICONS[i]} className="mt-3" />
            <h3 className="mt-4 font-sans text-lg font-extrabold tracking-tight text-[var(--ink)] sm:text-xl">
              {s.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-soft)]">{s.blurb}</p>
          </Reveal>
        ))}
      </div>

      {/* lg+: number / frame+connector / title+caption as three explicit
          grid rows sharing one set of columns, so the frame column and
          its title column always line up exactly. Connectors sit in
          their own thin columns and self-center against the frame row
          only (not the number or the caption), so the travelling light
          always crosses at the frame's mid-height regardless of caption
          line count. */}
      <div
        className="hidden lg:grid lg:items-start lg:gap-x-2 lg:gap-y-3 xl:gap-x-4"
        style={{ gridTemplateColumns: '1fr 2.5rem 1fr 2.5rem 1fr 2.5rem 1fr' }}
      >
        {STEPS.map((s, i) => {
          const col = i * 2 + 1
          return (
            <Fragment key={s.n}>
              <Reveal delay={i * 0.08} style={{ gridColumn: col, gridRow: 1 }}>
                <span className="font-sans text-3xl font-black text-[var(--brand)]">{s.n}</span>
              </Reveal>
              <Reveal delay={i * 0.08 + 0.03} style={{ gridColumn: col, gridRow: 2, alignSelf: 'center' }}>
                <Frame icon={ICONS[i]} />
              </Reveal>
              <Reveal delay={i * 0.08 + 0.06} style={{ gridColumn: col, gridRow: 3 }} className="max-w-[15rem]">
                <h3 className="font-sans text-xl font-extrabold tracking-tight text-[var(--ink)]">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-soft)]">{s.blurb}</p>
              </Reveal>
              {i < STEPS.length - 1 && (
                <div style={{ gridColumn: col + 1, gridRow: 2, alignSelf: 'center', justifySelf: 'center' }}>
                  <Connector index={i} />
                </div>
              )}
            </Fragment>
          )
        })}
      </div>
    </>
  )
}
