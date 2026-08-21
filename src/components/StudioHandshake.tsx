import { useState } from 'react'
import { Check, Globe, Plus, Smartphone } from 'lucide-react'
import { motion } from 'motion/react'

type StudioHandshakeProps = {
  /** `compact`: the small widget under the homepage headline (unchanged).
   *  `feature`: a larger standalone card for pages where the two studios
   *  are the whole point of the section, e.g. the About page. */
  variant?: 'compact' | 'feature'
}

// shared easing for every hand-off in this component: the hover lean, the
// plus button's icon swap, and the big one below
const EASE_OUT = [0.22, 1, 0.36, 1] as const

/**
 * The two studios, shown shaking hands: Ethixweb and MegaCloudWorks on
 * their own plates, joined by the animated brand rail (`.link-track`, the
 * same connector the About page already uses for this pair, extended here
 * rather than replaced, so the two pages speak the same language).
 *
 * On hover the plates lean toward each other and the rail tightens: the
 * "team up" beat, done as a nudge rather than an animation set piece. In
 * the `feature` variant, tapping the plus commits to it: the two plates
 * actually reflow into one square seal, Ethixweb on top, MegaCloudWorks
 * on the bottom, with the plus settling into a checkmark at the seam.
 * That's a real layout change (row of two rectangles → stacked square),
 * not a fake transform trick, so it's built on Motion's `layout` — it
 * measures the before/after boxes itself and animates the difference,
 * which is also what keeps it honest across breakpoints: the same click
 * handler works whether the plates started stacked (mobile) or side by
 * side (desktop).
 */
export function StudioHandshake({ variant = 'compact' }: StudioHandshakeProps) {
  const [joined, setJoined] = useState(false)
  // A click commitment, separate from the hover preview: tapping the plus
  // reflows the two plates into one square card and holds it there until
  // it's tapped again.
  const [merged, setMerged] = useState(false)
  const feature = variant === 'feature'

  if (!feature) {
    return (
      <div
        className="mt-8 w-full max-w-sm select-none"
        onMouseEnter={() => setJoined(true)}
        onMouseLeave={() => setJoined(false)}
      >
        <div className="flex items-center gap-3">
          <a
            href="https://www.ethixweb.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="surface-lift flex min-w-0 flex-1 flex-col items-center gap-2 px-3 py-4 no-underline"
            style={{
              transform: joined ? 'translateX(6px)' : 'translateX(0)',
              transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <img
              src="/ethixweb-black.png"
              alt="Ethixweb"
              className="h-5 w-auto max-w-full object-contain opacity-80"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ink-faint)]">Web</span>
          </a>

          <div className="flex shrink-0 flex-col items-center gap-1.5" aria-hidden="true">
            <div
              className="link-track h-[3px]"
              style={{
                width: joined ? '1.5rem' : '2.75rem',
                transition: 'width 420ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          </div>

          <div
            className="surface-lift flex min-w-0 flex-1 flex-col items-center gap-2 px-3 py-4"
            style={{
              transform: joined ? 'translateX(-6px)' : 'translateX(0)',
              transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <img src="/logo-resized.svg" alt="MegaCloudWorks" className="h-5 w-auto max-w-full object-contain" />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ink-faint)]">Apps</span>
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
          One team, end to end
        </p>
      </div>
    )
  }

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.55, ease: EASE_OUT } }}
      className="w-full select-none"
      onMouseEnter={() => setJoined(true)}
      onMouseLeave={() => setJoined(false)}
    >
      <motion.div
        layout
        transition={{ layout: { duration: 0.55, ease: EASE_OUT } }}
        className={
          merged
            ? 'relative mx-auto flex aspect-square w-full max-w-[19rem] flex-col overflow-hidden sm:max-w-[21rem]'
            : 'relative flex flex-col items-stretch gap-8 sm:flex-row sm:items-stretch sm:gap-0'
        }
        style={
          merged
            ? { border: '2px solid var(--ink)', boxShadow: '6px 6px 0 var(--ink)', borderRadius: 28 }
            : { borderRadius: 0 }
        }
      >
        {/* Ethixweb — the studio's own site, one click out. edge-hard's
            ink-border-plus-offset-shadow treatment when split (this pair is
            the whole point of the section, so it gets the weight of a
            primary CTA, not a rounded surface-lift card); once merged the
            wrapper above owns the single shared border, so this plate goes
            back to being plain content on its half of the seal. */}
        <motion.a
          layout
          transition={{ layout: { duration: 0.55, ease: EASE_OUT } }}
          href="https://www.ethixweb.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={
            merged
              ? 'group relative z-10 flex flex-1 flex-col items-center justify-center gap-2 bg-[var(--paper)] px-6 py-5 text-center no-underline'
              : 'group relative z-10 flex min-w-0 flex-1 flex-col items-center gap-3 bg-[var(--paper)] px-7 pb-8 pt-6 text-center no-underline'
          }
          style={
            merged
              ? undefined
              : {
                  border: '2px solid var(--ink)',
                  boxShadow: joined ? '2px 2px 0 var(--ink)' : '4px 4px 0 var(--ink)',
                  transform: joined ? 'translate(6px, -2px)' : 'translate(0, 0)',
                  transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                }
          }
        >
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--ink-faint)]">
            <span className="text-[var(--ink)]">01</span> · Web studio
          </span>
          <span
            className={
              merged
                ? 'flex size-11 items-center justify-center rounded-full text-[var(--ink)]'
                : 'flex size-16 items-center justify-center rounded-full text-[var(--ink)] transition-transform duration-300 group-hover:scale-105'
            }
            style={{
              background: 'linear-gradient(145deg, #f4f4f2, #e4e4e2)',
              boxShadow: 'inset 1.5px 2px 4px rgba(255,255,255,0.9), inset -1.5px -1.5px 4px rgba(20,20,20,0.08)',
            }}
          >
            <Globe size={merged ? 19 : 26} strokeWidth={1.6} />
          </span>
          <img
            src="/ethixweb-black.png"
            alt="Ethixweb"
            className={merged ? 'h-6 w-auto max-w-full object-contain' : 'h-7 w-auto max-w-full object-contain sm:h-8'}
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          {!merged && (
            <p className="max-w-[15rem] text-sm leading-relaxed text-[var(--ink-soft)]">
              Marketing sites, e-commerce, the platforms a business runs on.
            </p>
          )}
        </motion.a>

        {/* the join: a real connective beam, not a thin divider, with the
            brand-red travelling pulse anchored at its center. Split, it
            bridges the gap between the two plates (vertical on mobile,
            horizontal on desktop); merged, that same rail becomes the
            single seam running across the seal. The plus at its center is
            the one real control here: tap it and the two plates reflow
            into that seal, and the plus itself settles into a checkmark.
            Tap again to pull them back apart. */}
        <motion.div
          layout
          transition={{ layout: { duration: 0.55, ease: EASE_OUT } }}
          className={
            merged
              ? 'relative z-20 flex h-0 w-full items-center justify-center'
              : 'relative z-20 flex shrink-0 items-center justify-center py-1 sm:w-0 sm:py-0'
          }
        >
          {merged ? (
            <div className="link-track h-[3px] w-full" />
          ) : (
            <>
              <div className="link-track link-track--vertical h-8 w-[3px] sm:hidden" />
              <div
                className="link-track hidden sm:block sm:h-[3px]"
                style={{ width: joined ? '1.5rem' : '2.5rem', transition: 'width 420ms cubic-bezier(0.22, 1, 0.36, 1)' }}
              />
            </>
          )}
          <motion.button
            layout
            type="button"
            onClick={() => setMerged((m) => !m)}
            aria-pressed={merged}
            aria-label={merged ? 'Split Ethixweb and MegaCloudWorks apart' : 'Merge Ethixweb and MegaCloudWorks together'}
            className="absolute flex size-10 items-center justify-center rounded-full border-2 border-[var(--ink)] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand)]"
            style={{
              background: 'linear-gradient(145deg, var(--brand-2), var(--brand))',
              boxShadow: '2px 3px 0 rgba(16,16,20,0.9)',
              transform: merged ? 'scale(1.14) rotate(180deg)' : joined ? 'scale(1.08) rotate(90deg)' : 'scale(1) rotate(0deg)',
              transition: 'transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <Plus
              size={16}
              strokeWidth={2.6}
              className="absolute transition-all duration-300 ease-out"
              style={{ opacity: merged ? 0 : 1, transform: merged ? 'scale(0.4) rotate(45deg)' : 'scale(1) rotate(0deg)' }}
            />
            <Check
              size={16}
              strokeWidth={2.8}
              className="absolute transition-all duration-300 ease-out"
              style={{ opacity: merged ? 1 : 0, transform: merged ? 'scale(1) rotate(0deg)' : 'scale(0.4) rotate(-45deg)' }}
            />
          </motion.button>
        </motion.div>

        {/* MegaCloudWorks */}
        <motion.div
          layout
          transition={{ layout: { duration: 0.55, ease: EASE_OUT } }}
          className={
            merged
              ? 'group relative z-10 flex flex-1 flex-col items-center justify-center gap-2 px-6 py-5 text-center'
              : 'group relative z-10 flex min-w-0 flex-1 flex-col items-center gap-3 px-7 pb-8 pt-6 text-center'
          }
          style={{
            background: 'linear-gradient(180deg, #fff5f4 0%, var(--paper) 40%)',
            ...(merged
              ? {}
              : {
                  border: '2px solid var(--ink)',
                  boxShadow: joined ? '-2px 2px 0 var(--brand)' : '-4px 4px 0 var(--brand)',
                  transform: joined ? 'translate(-6px, -2px)' : 'translate(0, 0)',
                  transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                }),
          }}
        >
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--brand-text)]">
            02 · App studio
          </span>
          <span
            className={
              merged
                ? 'flex size-11 items-center justify-center rounded-full text-white'
                : 'flex size-16 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-105'
            }
            style={{
              background: 'linear-gradient(145deg, var(--brand-2), var(--brand))',
              boxShadow: '2px 3px 8px -2px rgba(193,20,32,0.5), inset 1.5px 1.5px 3px rgba(255,255,255,0.4)',
            }}
          >
            <Smartphone size={merged ? 19 : 26} strokeWidth={1.6} />
          </span>
          <img
            src="/logo-resized.svg"
            alt="MegaCloudWorks"
            className={merged ? 'h-6 w-auto max-w-full object-contain' : 'h-7 w-auto max-w-full object-contain sm:h-8'}
          />
          {!merged && (
            <p className="max-w-[15rem] text-sm leading-relaxed text-[var(--ink-soft)]">
              Native & cross-platform products, designed and built end to end.
            </p>
          )}
        </motion.div>
      </motion.div>

      <p className="mt-8 text-center text-xs font-black uppercase tracking-[0.2em] text-[var(--ink)]">
        One team <span className="text-[var(--brand)]">·</span> end to end
      </p>
    </motion.div>
  )
}
