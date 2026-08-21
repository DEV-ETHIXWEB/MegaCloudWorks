import { useState } from 'react'
import { Globe, Smartphone } from 'lucide-react'

type StudioHandshakeProps = {
  /** `compact`: the small widget under the homepage headline (unchanged).
   *  `feature`: a larger standalone card for pages where the two studios
   *  are the whole point of the section, e.g. the About page. */
  variant?: 'compact' | 'feature'
}

/**
 * The two studios, shown shaking hands: Ethixweb and MegaCloudWorks on
 * their own plates, joined by the animated brand rail (`.link-track`, the
 * same connector the About page already uses for this pair, extended here
 * rather than replaced, so the two pages speak the same language).
 *
 * On hover the plates lean toward each other and the rail tightens: the
 * "team up" beat, done as a nudge rather than an animation set piece.
 */
export function StudioHandshake({ variant = 'compact' }: StudioHandshakeProps) {
  const [joined, setJoined] = useState(false)
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
    <div className="w-full select-none" onMouseEnter={() => setJoined(true)} onMouseLeave={() => setJoined(false)}>
      <div className="relative flex flex-col items-stretch gap-8 sm:flex-row sm:items-stretch sm:gap-0">
        {/* Ethixweb — the studio's own site, one click out. edge-hard's
            ink-border-plus-offset-shadow treatment, not surface-lift: this
            pair is the whole point of the section, so it gets the same
            weight as a primary CTA, not another rounded white card. */}
        <a
          href="https://www.ethixweb.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative z-10 flex min-w-0 flex-1 flex-col items-center gap-3 bg-[var(--paper)] px-7 pb-8 pt-6 text-center no-underline"
          style={{
            border: '2px solid var(--ink)',
            boxShadow: joined ? '2px 2px 0 var(--ink)' : '4px 4px 0 var(--ink)',
            transform: joined ? 'translate(6px, -2px)' : 'translate(0, 0)',
            transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 380ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--ink-faint)]">
            <span className="text-[var(--ink)]">01</span> · Web studio
          </span>
          <span
            className="flex size-16 items-center justify-center rounded-full text-[var(--ink)] transition-transform duration-300 group-hover:scale-105"
            style={{
              background: 'linear-gradient(145deg, #f4f4f2, #e4e4e2)',
              boxShadow: 'inset 1.5px 2px 4px rgba(255,255,255,0.9), inset -1.5px -1.5px 4px rgba(20,20,20,0.08)',
            }}
          >
            <Globe size={26} strokeWidth={1.6} />
          </span>
          <img
            src="/ethixweb-black.png"
            alt="Ethixweb"
            className="h-7 w-auto max-w-full object-contain sm:h-8"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <p className="max-w-[15rem] text-sm leading-relaxed text-[var(--ink-soft)]">
            Marketing sites, e-commerce, the platforms a business runs on.
          </p>
        </a>

        {/* the join: a real connective beam, not a thin divider, with the
            brand-red travelling pulse anchored at its center so it reads on
            both mobile (vertical) and desktop (horizontal) */}
        <div className="relative z-20 flex shrink-0 items-center justify-center py-1 sm:w-0 sm:py-0" aria-hidden="true">
          <div className="link-track link-track--vertical h-8 w-[3px] sm:hidden" />
          <div className="link-track hidden sm:block sm:h-[3px] sm:w-10" />
          <span
            className="absolute flex size-10 items-center justify-center rounded-full border-2 border-[var(--ink)] text-sm font-black text-white"
            style={{
              background: 'linear-gradient(145deg, var(--brand-2), var(--brand))',
              boxShadow: '2px 3px 0 rgba(16,16,20,0.9)',
              transform: joined ? 'scale(1.1) rotate(90deg)' : 'scale(1) rotate(0deg)',
              transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            +
          </span>
        </div>

        {/* MegaCloudWorks */}
        <div
          className="group relative z-10 flex min-w-0 flex-1 flex-col items-center gap-3 px-7 pb-8 pt-6 text-center"
          style={{
            background: 'linear-gradient(180deg, #fff5f4 0%, var(--paper) 40%)',
            border: '2px solid var(--ink)',
            boxShadow: joined ? '-2px 2px 0 var(--brand)' : '-4px 4px 0 var(--brand)',
            transform: joined ? 'translate(-6px, -2px)' : 'translate(0, 0)',
            transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 380ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--brand-text)]">
            02 · App studio
          </span>
          <span
            className="flex size-16 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-105"
            style={{
              background: 'linear-gradient(145deg, var(--brand-2), var(--brand))',
              boxShadow: '2px 3px 8px -2px rgba(193,20,32,0.5), inset 1.5px 1.5px 3px rgba(255,255,255,0.4)',
            }}
          >
            <Smartphone size={26} strokeWidth={1.6} />
          </span>
          <img src="/logo-resized.svg" alt="MegaCloudWorks" className="h-7 w-auto max-w-full object-contain sm:h-8" />
          <p className="max-w-[15rem] text-sm leading-relaxed text-[var(--ink-soft)]">
            Native & cross-platform products, designed and built end to end.
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink-faint)]">
        One team <span className="text-[var(--brand)]">·</span> end to end
      </p>
    </div>
  )
}
