/**
 * A minimal, abstract cupped-palm shape the phone rests in — one smooth
 * silhouette (a single continuous curve, not separate finger shapes,
 * which read as stray blobs at this size), sitting just below the phone
 * with a small intentional overlap. Painted after the phone in DOM order
 * so that overlap sits naturally in front rather than hidden behind the
 * phone's own opaque bezel.
 */
export function HandHoldingPhone() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-full -mt-4 h-10" aria-hidden="true">
      <svg viewBox="0 0 220 60" className="h-full w-full" preserveAspectRatio="xMidYMin meet">
        <defs>
          <linearGradient id="hand-tone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dba876" />
            <stop offset="100%" stopColor="#b17b4d" />
          </linearGradient>
        </defs>
        {/* one open, upturned palm shape — a single smooth curve */}
        <path d="M8,60 L8,32 Q8,10 40,8 L180,8 Q212,10 212,32 L212,60 Z" fill="url(#hand-tone)" />
      </svg>
    </div>
  )
}
