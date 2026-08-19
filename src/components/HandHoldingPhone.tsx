/**
 * A minimal, abstract cupped-palm shape the phone rests in — sits just
 * below the phone with a small intentional overlap (so the fingertip
 * bumps tuck against its bottom edge), painted after the phone in DOM
 * order so that overlap sits naturally in front rather than hidden behind
 * the phone's own opaque bezel. A warm, visibly-lit tone so it reads as a
 * clear shape against the dark band.
 */
export function HandHoldingPhone() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-full -mt-3 h-16" aria-hidden="true">
      <svg viewBox="0 0 220 90" className="h-full w-full" preserveAspectRatio="xMidYMin meet">
        <defs>
          <linearGradient id="hand-tone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0ab7e" />
            <stop offset="100%" stopColor="#a9714a" />
          </linearGradient>
        </defs>
        {/* open palm, cradling the phone's bottom edge from underneath */}
        <path
          d="M0,20
             Q4,4 26,4
             Q40,4 46,16
             Q60,-2 92,4
             L128,4
             Q160,-2 174,16
             Q180,4 194,4
             Q216,4 220,20
             L220,90 L0,90 Z"
          fill="url(#hand-tone)"
        />
      </svg>
    </div>
  )
}
