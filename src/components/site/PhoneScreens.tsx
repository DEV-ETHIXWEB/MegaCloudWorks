import { Home, PieChart, LayoutGrid, User } from 'lucide-react'

/** A neutral placeholder bar (grey) — used for faux copy/labels. */
function Bar({ w, tall = false }: { w: string; tall?: boolean }) {
  return (
    <span
      data-phone-reveal
      className="block rounded-full bg-[#e6e6ea]"
      style={{ width: w, height: tall ? 10 : 7 }}
    />
  )
}

/**
 * DashboardScreen — the default content shown inside <PhoneMockup />.
 *
 * Mirrors the analytics-app look from the hero. Every animatable element is
 * tagged with data-phone-reveal (stagger in) or data-phone-bar (chart grow)
 * so the parent's GSAP timeline animates it without any extra wiring.
 */
export function DashboardScreen() {
  const bars = [40, 62, 30, 96, 54, 72, 44]

  return (
    <div className="flex h-full flex-col bg-[var(--paper)] px-4 pb-2 pt-11 text-[var(--ink)]">
      {/* top row */}
      <div className="flex items-center justify-between">
        <span
          data-phone-reveal
          className="size-6 rounded-full bg-gradient-to-br from-[#d9d9de] to-[#eeeef1]"
        />
        <span data-phone-reveal className="size-2.5 rounded-full bg-[var(--brand)]" />
      </div>

      {/* headline metric */}
      <div className="mt-4 space-y-2">
        <Bar w="45%" />
        <div data-phone-reveal className="flex items-end gap-2">
          <span className="text-2xl font-extrabold tracking-tight">$48.2k</span>
          <span className="mb-1 rounded-full bg-[var(--brand)] px-1.5 py-0.5 text-[9px] font-bold text-white">
            +12%
          </span>
        </div>
      </div>

      {/* bar chart */}
      <div className="mt-4 flex h-24 items-end justify-between gap-1.5">
        {bars.map((h, i) => (
          <span
            key={i}
            data-phone-bar
            className="w-full rounded-t-[3px]"
            style={{
              height: `${h}%`,
              background: i === 3 ? 'var(--brand)' : '#e6e6ea',
            }}
          />
        ))}
      </div>

      {/* list rows */}
      <div className="mt-4 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} data-phone-reveal className="flex items-center gap-2.5">
            <span
              className="grid size-7 shrink-0 place-items-center rounded-lg"
              style={{
                background: i === 0 ? 'var(--brand-soft)' : '#f1f1f4',
              }}
            >
              <span
                className="size-2.5 rounded-full"
                style={{ background: i === 0 ? 'var(--brand)' : '#c9c9d0' }}
              />
            </span>
            <span className="flex-1 space-y-1.5">
              <Bar w={`${70 - i * 12}%`} />
              <Bar w={`${40 - i * 6}%`} />
            </span>
            <span className="text-[10px] font-semibold text-[var(--ink-faint)]">
              ›
            </span>
          </div>
        ))}
      </div>

      {/* bottom nav */}
      <div
        data-phone-reveal
        className="mt-auto flex items-center justify-around rounded-2xl bg-[var(--paper-2)] py-2.5"
      >
        <Home className="size-[18px] text-[var(--brand)]" strokeWidth={2.4} />
        <PieChart className="size-[18px] text-[#c2c2c9]" strokeWidth={2} />
        <LayoutGrid className="size-[18px] text-[#c2c2c9]" strokeWidth={2} />
        <User className="size-[18px] text-[#c2c2c9]" strokeWidth={2} />
      </div>
    </div>
  )
}

export default DashboardScreen
