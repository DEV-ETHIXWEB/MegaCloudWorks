import { useState } from 'react'

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

  return (
    <div
      className={feature ? 'w-full select-none' : 'mt-8 w-full max-w-sm select-none'}
      onMouseEnter={() => setJoined(true)}
      onMouseLeave={() => setJoined(false)}
    >
      <div className={feature ? 'flex items-stretch gap-4 sm:gap-6' : 'flex items-center gap-3'}>
        {/* Ethixweb — the studio's own site, one click out */}
        <a
          href="https://www.ethixweb.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={
            feature
              ? 'group surface-lift flex min-w-0 flex-1 flex-col items-center gap-3 px-6 py-10 no-underline transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(16,16,20,0.08)] sm:py-12'
              : 'surface-lift flex min-w-0 flex-1 flex-col items-center gap-2 px-3 py-4 no-underline'
          }
          style={{
            transform: joined ? `translateX(${feature ? '10px' : '6px'})` : 'translateX(0)',
            transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <img
            src="/ethixweb-black.png"
            alt="Ethixweb"
            className={
              feature
                ? 'h-8 w-auto max-w-full object-contain opacity-80 transition-transform duration-300 group-hover:scale-105 sm:h-9'
                : 'h-5 w-auto max-w-full object-contain opacity-80'
            }
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <span
            className={
              feature
                ? 'text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink-faint)]'
                : 'text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ink-faint)]'
            }
          >
            Web
          </span>
          {feature && (
            <p className="mt-1 max-w-[16rem] text-center text-sm leading-relaxed text-[var(--ink-soft)]">
              Marketing sites, e-commerce, platforms.
            </p>
          )}
        </a>

        {/* the join */}
        <div className={feature ? 'flex shrink-0 flex-col items-center justify-center gap-1.5' : 'flex shrink-0 flex-col items-center gap-1.5'} aria-hidden="true">
          <div
            className="link-track h-[3px]"
            style={{
              width: joined ? (feature ? '2rem' : '1.5rem') : feature ? '3.5rem' : '2.75rem',
              transition: 'width 420ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        </div>

        {/* MegaCloudWorks */}
        <div
          className={
            feature
              ? 'group surface-lift flex min-w-0 flex-1 flex-col items-center gap-3 px-6 py-10 transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(16,16,20,0.08)] sm:py-12'
              : 'surface-lift flex min-w-0 flex-1 flex-col items-center gap-2 px-3 py-4'
          }
          style={{
            transform: joined ? `translateX(-${feature ? '10px' : '6px'})` : 'translateX(0)',
            transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <img
            src="/logo-resized.svg"
            alt="MegaCloudWorks"
            className={
              feature
                ? 'h-8 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:h-9'
                : 'h-5 w-auto max-w-full object-contain'
            }
          />
          <span
            className={
              feature
                ? 'text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink-faint)]'
                : 'text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ink-faint)]'
            }
          >
            Apps
          </span>
          {feature && (
            <p className="mt-1 max-w-[16rem] text-center text-sm leading-relaxed text-[var(--ink-soft)]">
              Native & cross-platform products, end to end.
            </p>
          )}
        </div>
      </div>

      <p
        className={
          feature
            ? 'mt-5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-faint)]'
            : 'mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-faint)]'
        }
      >
        One team, end to end
      </p>
    </div>
  )
}
