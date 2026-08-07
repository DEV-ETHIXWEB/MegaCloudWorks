/**
 * Small, low-fidelity product snapshots shown inside the concept cards on the
 * Work page. Purely decorative — no data, no interaction.
 */

function Panel({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3.5 shadow-[0_8px_24px_rgba(16,16,20,0.05)]">
      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--ink-faint)]">
        {label}
      </p>
      {children}
    </div>
  )
}

/** Prophy — recall list with a small month chart underneath. */
export function ProphyPreview() {
  const rows = [
    { name: 'Sarah M.', sub: 'Overdue 12d', hot: true, w: '84%' },
    { name: 'Tom R.', sub: 'Due in 3d', hot: false, w: '56%' },
    { name: 'Priya K.', sub: 'Due in 9d', hot: false, w: '38%' },
  ]
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const bars = [30, 48, 26, 58, 38, 70]

  return (
    <Panel label="Recall due">
      <div className="mt-3 space-y-2.5">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-2.5">
            <span
              className="size-3.5 shrink-0 rounded-full"
              style={{ background: r.hot ? 'var(--brand)' : '#1a1a1e' }}
            />
            <span className="w-16 shrink-0 leading-none">
              <span className="block text-[9px] font-bold text-[var(--ink)]">
                {r.name}
              </span>
              <span className="mt-1 block text-[8px] text-[var(--ink-faint)]">
                {r.sub}
              </span>
            </span>
            <span className="flex-1">
              <span
                className="block h-1.5 rounded-full"
                style={{
                  width: r.w,
                  background: r.hot ? 'var(--brand)' : '#e6e6ea',
                }}
              />
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3.5 flex items-end justify-between gap-1.5 border-t border-[var(--line)] pt-3">
        {bars.map((h, i) => (
          <span key={months[i]} className="flex flex-1 flex-col items-center">
            <span
              className="w-full rounded-[3px]"
              style={{
                height: `${Math.round(h * 0.34)}px`,
                background: i === bars.length - 1 ? 'var(--brand)' : '#e6e6ea',
              }}
            />
            <span className="mt-1.5 text-[7px] font-semibold text-[var(--ink-faint)]">
              {months[i]}
            </span>
          </span>
        ))}
      </div>
    </Panel>
  )
}

/** Leadr — pipeline stage counters. */
export function LeadrPreview() {
  const stages = [
    { label: 'New', n: '24' },
    { label: 'Contacted', n: '18' },
    { label: 'Qualified', n: '11' },
    { label: 'Proposal', n: '6' },
    { label: 'Closed', n: '3' },
  ]

  return (
    <Panel label="Pipeline · Q3">
      <div className="mt-3 flex items-stretch gap-2">
        {stages.map((s, i) => (
          <span
            key={s.label}
            className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 ${
              i === 0
                ? 'bg-[#1a1a1e] text-white'
                : 'border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)]'
            }`}
          >
            <span className="text-[7px] font-semibold uppercase tracking-wide opacity-60">
              {s.label}
            </span>
            <span className="text-[13px] font-extrabold leading-none">
              {s.n}
            </span>
          </span>
        ))}
      </div>
    </Panel>
  )
}

/** Slate — a week strip with the booked day highlighted. */
export function SlatePreview() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const slots = ['9:00', '11:30', '2:15']

  // Slate's card is the narrow one in the bento grid, so the strip runs on
  // single-letter initials and an equal-track grid — seven three-letter pills
  // would wrap mid-word at that width. Chips wrap rather than squeeze.
  return (
    <Panel label="Week of 9 Nov">
      <div className="mt-3 grid grid-cols-7 gap-[3px]">
        {days.map((d, i) => (
          <span
            key={d}
            aria-label={d}
            className={`min-w-0 rounded-md py-1.5 text-center text-[8px] font-bold ${
              i === 2
                ? 'bg-[var(--brand)] text-white'
                : 'bg-[#f1f1f4] text-[var(--ink-faint)]'
            }`}
          >
            {d[0]}
          </span>
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {slots.map((s) => (
          <span
            key={s}
            className="rounded-full border border-[var(--line)] px-2 py-1 text-[8px] font-semibold text-[var(--ink-soft)]"
          >
            {s}
          </span>
        ))}
      </div>
    </Panel>
  )
}

export const CONCEPT_PREVIEWS: Partial<
  Record<string, () => React.ReactElement>
> = {
  prophy: ProphyPreview,
  leadr: LeadrPreview,
  slate: SlatePreview,
}
