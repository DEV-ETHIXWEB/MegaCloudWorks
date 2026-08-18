import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { CSSProperties } from 'react'
import { NotifyForm } from './NotifyForm'

/**
 * The closing call to action, staged rather than simply revealed.
 *
 * The beats, in order:
 *
 *   1  the headline arrives alone, large and centred in the section
 *   2  its question mark writes itself - the dot rides up the hook, laying
 *      the stroke behind it, then drops back to sit under it as the point
 *   3  the whole block travels left and settles at reading size
 *   4  the field appears, and the button slides out from behind its right
 *      edge and holds a glow
 *   5  the mountain comes up behind it
 *
 * The block is never re-laid-out: it is always in its final position in the
 * document and the centred opening is a transform, measured at run time. So
 * nothing below it moves while the sequence plays.
 */

// the beats, in ms from the section arriving
const BEAT = {
  headline: 0,
  mark: 620,
  settle: 1900,
  field: 2500,
  button: 2860,
} as const

// The question mark's hook, in its own 46x84 box, written from the foot of
// the stem up over the top - the direction the dot travels. The rider's own
// path (in styles.css) is this same curve with a lead-in from the point, so
// the dot climbs out of the point before the stroke starts following it.
const HOOK = 'M 23 56 C 23 40, 39 38, 39 24 C 39 6, 7 6, 7 24'

// the opening offset has to be in place before the first paint, or the block
// is briefly visible where the document put it; on the server there is no
// layout to measure, so it falls back to the ordinary effect
const useMeasureEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export function SummitCta() {
  const section = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const block = useRef<HTMLDivElement>(null)
  const [beat, setBeat] = useState(0)
  const [lift, setLift] = useState<CSSProperties>({})

  /** where the block has to go to be centred in the section, and how much
      bigger it reads while it is there */
  const measure = useCallback(() => {
    const host = stage.current
    const el = block.current
    if (!host || !el) return

    const hostBox = host.getBoundingClientRect()
    const box = el.getBoundingClientRect()
    if (!box.width) return

    const dx = (hostBox.width - box.width) / 2 - (box.left - hostBox.left)
    const dy = (hostBox.height - box.height) / 2 - (box.top - hostBox.top)
    // no room to grow on a phone, where the block already fills the column
    const scale = hostBox.width > 900 ? 1.28 : 1.06

    setLift({
      ['--cta-dx' as string]: `${dx.toFixed(1)}px`,
      ['--cta-dy' as string]: `${dy.toFixed(1)}px`,
      ['--cta-scale' as string]: `${scale}`,
    })
  }, [])

  useMeasureEffect(() => {
    measure()
  }, [measure])

  // arm the sequence when the section arrives, and run it on its own clock
  useEffect(() => {
    const el = section.current
    if (!el) return

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    measure()

    if (reduce || typeof IntersectionObserver === 'undefined') {
      setBeat(9)
      return
    }

    let timers: Array<number> = []

    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.some(
          (e) => e.isIntersecting || e.boundingClientRect.bottom < 0,
        )
        if (!seen) return
        io.disconnect()
        measure()
        timers = Object.values(BEAT).map((ms, i) =>
          window.setTimeout(() => setBeat(i + 1), ms),
        )
      },
      // NOT a ratio: this block is taller than a short viewport, so a
      // fraction-of-the-element threshold can never be met and the sequence
      // would never start. The band in the middle of the screen is the test.
      { threshold: 0, rootMargin: '-25% 0px -25% 0px' },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [measure])

  // the centred opening is measured, so it has to be re-measured whenever the
  // section changes size
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
    const ro = new ResizeObserver(measure)
    if (section.current) ro.observe(section.current)
    return () => ro.disconnect()
  }, [measure])

  return (
    <div
      ref={section}
      className={[
        'summit',
        beat >= 1 && 'is-head',
        beat >= 2 && 'is-mark',
        beat >= 3 && 'is-settled',
        beat >= 4 && 'is-field',
        beat >= 5 && 'is-button',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* The mountain arrives with the button, not before it: the section
          opens as bare paper so the headline has the stage to itself. */}
      <div
        data-summit
        aria-hidden="true"
        className="summit__plate pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] bg-[image:url('/about/footer.webp')] bg-contain bg-[position:right_20%] bg-no-repeat sm:block lg:w-[54%]"
      />
      <div
        aria-hidden="true"
        className="summit__plate pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_right,var(--paper)_0%,var(--paper)_28%,rgba(255,255,255,0)_52%)] sm:block"
      />
      <div
        aria-hidden="true"
        className="summit__plate pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[image:url('/about/footer.webp')] bg-cover bg-[position:center_top] bg-no-repeat sm:hidden"
      />

      <div
        ref={stage}
        className="relative mx-auto flex min-h-[26rem] max-w-[1600px] flex-col justify-center px-6 pb-60 pt-16 sm:px-10 sm:py-24 lg:min-h-[32rem] lg:px-20 lg:py-28"
      >
        <div ref={block} style={lift} className="summit__block max-w-lg">
          <p className="summit__eyebrow flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
            Let&rsquo;s build something great
            <span aria-hidden="true" className="h-px w-8 bg-[var(--brand)]" />
          </p>

          <h2 className="summit__head mt-4 font-display text-[clamp(2.25rem,4.4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-[var(--ink)]">
            Have a project
            <br />
            <span className="text-[var(--brand)]">
              in mind
              {/* the mark is drawn, not typed - the glyph is replaced by a
                  stroke the dot lays down on its way up */}
              <span className="summit__mark" role="img" aria-label="?">
                <svg viewBox="0 0 46 84" fill="none">
                  {/* pathLength normalises the stroke to 100 units, so the
                      draw is exact without measuring the curve */}
                  <path
                    className="summit__hook"
                    d={HOOK}
                    pathLength={100}
                    stroke="currentColor"
                    strokeWidth="13"
                    strokeLinecap="round"
                  />
                  <circle
                    className="summit__rider"
                    r="7"
                    cx="0"
                    cy="0"
                    fill="currentColor"
                  />
                  <circle
                    className="summit__point"
                    cx="23"
                    cy="76"
                    r="7"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </span>
          </h2>

          <div className="summit__form cta-form mt-8">
            <NotifyForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummitCta
