import { useState } from 'react'

/**
 * The two studios, shown shaking hands: Ethixweb and MegaCloudWorks on
 * their own plates, joined by the animated brand rail (`.link-track`, the
 * same connector the About page already uses for this pair — extended here
 * rather than replaced, so the two pages speak the same language).
 *
 * On hover the plates lean toward each other and the rail tightens: the
 * "team up" beat, done as a nudge rather than an animation set piece.
 * Sized to the content it sits under — never wider.
 */
export function StudioHandshake() {
  const [joined, setJoined] = useState(false)

  return (
    <div
      className="mt-8 w-full max-w-sm select-none"
      onMouseEnter={() => setJoined(true)}
      onMouseLeave={() => setJoined(false)}
    >
      <div className="flex items-center gap-3">
        {/* Ethixweb */}
        <div
          className="surface-lift flex min-w-0 flex-1 flex-col items-center gap-2 px-3 py-4"
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
        </div>

        {/* the join */}
        <div className="flex shrink-0 flex-col items-center gap-1.5" aria-hidden="true">
          <div
            className="link-track h-[3px]"
            style={{
              width: joined ? '1.5rem' : '2.75rem',
              transition: 'width 420ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        </div>

        {/* MegaCloudWorks */}
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
