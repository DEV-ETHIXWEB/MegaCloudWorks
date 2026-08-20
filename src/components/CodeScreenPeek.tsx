// A small, self-drawn "phone showing code" peek for the work-card corner
// treatment. Real stock/vector assets in this style all carry attribution
// or paid-license strings attached, so this is CSS/SVG instead — and each
// concept gets a structurally different screen (not just recolored line
// bars): Fieldly a code editor, Stamp a terminal build log, Slate a
// calendar/schedule grid, Prophy an analytics chart, Leadr a kanban board.
type Tone = 'kw' | 'str' | 'fn' | 'com' | 'dim'

const TONE_COLOR: Record<Tone, string> = {
  kw: '#c586ff',
  str: '#7ee787',
  fn: '#79c0ff',
  com: '#6e7681',
  dim: 'rgba(255,255,255,0.28)',
}

function Chrome({ file, children }: { file: string; children: React.ReactNode }) {
  return (
    <>
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-2 py-1.5">
        <span className="size-1.5 rounded-full bg-[#ff5f57]" />
        <span className="size-1.5 rounded-full bg-[#febc2e]" />
        <span className="size-1.5 rounded-full bg-[#28c840]" />
        <span className="ml-1 truncate text-[6px] font-semibold text-white/30">{file}</span>
      </div>
      {children}
    </>
  )
}

/** Fieldly — a code editor: numbered lines, a blinking text cursor at the end of the active line. */
function EditorScreen({ accent }: { accent: string }) {
  const lines: Array<{ w: string; tone: Tone }> = [
    { w: '44%', tone: 'kw' },
    { w: '68%', tone: 'fn' },
    { w: '32%', tone: 'dim' },
    { w: '58%', tone: 'str' },
    { w: '50%', tone: 'dim' },
  ]
  return (
    <Chrome file="dispatch.ts">
      <div className="flex flex-1 flex-col justify-center space-y-[9px] px-2.5 py-2.5">
        {lines.map((l, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-2.5 shrink-0 text-right text-[6px] font-medium text-white/20">{i + 1}</span>
            <span className="block h-[5px] rounded-sm" style={{ width: l.w, background: TONE_COLOR[l.tone] }} />
            {i === lines.length - 1 && (
              <span className="h-[7px] w-[1.5px] animate-[blink_1s_steps(1)_infinite]" style={{ background: accent }} />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.06] px-2.5 py-1">
        <span className="text-[6px] font-semibold text-white/25">TypeScript</span>
        <span className="size-1 rounded-full" style={{ background: accent }} />
      </div>
    </Chrome>
  )
}

/** Stamp — a terminal build/deploy log: lines type-reveal top to bottom, tail line has a running spinner. */
function TerminalScreen({ accent }: { accent: string }) {
  const lines = [
    { text: '$ pnpm build', tone: 'dim' as Tone },
    { text: '✓ compiled 214 modules', tone: 'str' as Tone },
    { text: '✓ rewards.tsx', tone: 'fn' as Tone },
    { text: '✓ optimizing assets', tone: 'str' as Tone },
  ]
  return (
    <Chrome file="zsh — rewards">
      <div className="flex flex-1 flex-col justify-center space-y-2.5 px-2.5 py-2.5 font-mono">
        {lines.map((l, i) => (
          <p
            key={i}
            className="overflow-hidden whitespace-nowrap text-[6.5px] font-semibold leading-none"
            style={{
              color: TONE_COLOR[l.tone],
              animation: `typeline 2.6s steps(${l.text.length}) ${i * 0.55}s both`,
            }}
          >
            {l.text}
          </p>
        ))}
        <div className="mt-1.5 h-[5px] w-full overflow-hidden rounded-full bg-white/10">
          <span
            className="block h-full rounded-full"
            style={{ background: accent, animation: 'growbar 2.4s ease-in-out 1.8s both' }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.06] px-2.5 py-1">
        <span className="text-[6px] font-semibold text-white/25">build passed</span>
        <span className="size-1 rounded-full" style={{ background: '#28c840' }} />
      </div>
    </Chrome>
  )
}

/** Slate — a week calendar grid: a highlighted "today" column and a sweeping current-time indicator. */
function CalendarScreen({ accent }: { accent: string }) {
  const days = ['M', 'T', 'W', 'T', 'F']
  const events = [1, 3, 2, 4, 0]
  return (
    <Chrome file="calendar.ts">
      <div className="flex flex-1 flex-col px-2.5 py-2.5">
        <div className="grid flex-1 grid-cols-5 gap-1">
          {days.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span
                className="text-[6px] font-bold"
                style={{ color: i === 2 ? accent : 'rgba(255,255,255,0.3)' }}
              >
                {d}
              </span>
              <div className="flex w-full flex-1 flex-col items-center gap-[3px] rounded-sm bg-white/[0.04] p-[3px]">
                {Array.from({ length: events[i] }).map((_, j) => (
                  <span
                    key={j}
                    className="block h-[6px] w-full shrink-0 rounded-[1px]"
                    style={{
                      background: i === 2 ? accent : TONE_COLOR.dim,
                      opacity: i === 2 ? 0.55 + j * 0.15 : 0.5,
                      animation: `riseIn 0.5s ease-out ${(i * 4 + j) * 0.08}s both`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.06] px-2.5 py-1">
        <span className="text-[6px] font-semibold text-white/25">this week</span>
        <span className="size-1 rounded-full" style={{ background: accent, animation: 'pulseSoft 1.8s ease-in-out infinite' }} />
      </div>
    </Chrome>
  )
}

/** Prophy — an analytics chart: bars rise in from the baseline, one bar highlighted in accent. */
function ChartScreen({ accent }: { accent: string }) {
  const bars = [30, 55, 40, 72, 50, 90, 62]
  return (
    <Chrome file="analytics.ts">
      <div className="flex flex-1 flex-col justify-end gap-1.5 px-2.5 py-2.5">
        <div className="flex items-end gap-[3px]" style={{ height: '58%' }}>
          {bars.map((h, i) => (
            <span
              key={i}
              className="flex-1 origin-bottom rounded-[1px]"
              style={{
                height: `${h}%`,
                background: i === 5 ? accent : TONE_COLOR.dim,
                animation: `riseIn 0.5s ease-out ${i * 0.09}s both`,
              }}
            />
          ))}
        </div>
        <div className="mt-1 h-px w-full bg-white/10" />
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.06] px-2.5 py-1">
        <span className="text-[6px] font-semibold text-white/25">recall rate</span>
        <span className="text-[6px] font-bold" style={{ color: accent }}>+18%</span>
      </div>
    </Chrome>
  )
}

/** Leadr — a kanban board: three stage columns, cards stack in staggered. */
function KanbanScreen({ accent }: { accent: string }) {
  const columns = [
    { label: 'New', count: 2, tone: TONE_COLOR.dim },
    { label: 'Active', count: 3, tone: accent },
    { label: 'Won', count: 1, tone: TONE_COLOR.str },
  ]
  return (
    <Chrome file="pipeline.tsx">
      <div className="flex flex-1 gap-1.5 px-2.5 py-2.5">
        {columns.map((col, ci) => (
          <div key={col.label} className="flex flex-1 flex-col gap-1">
            <span className="truncate text-[5.5px] font-bold uppercase tracking-wide text-white/30">
              {col.label}
            </span>
            <div className="flex flex-1 flex-col gap-[3px]">
              {Array.from({ length: col.count }).map((_, j) => (
                <span
                  key={j}
                  className="block h-[9px] w-full shrink-0 rounded-[2px]"
                  style={{
                    background: `${col.tone}${col.tone === TONE_COLOR.dim ? '' : '33'}`,
                    border: `1px solid ${col.tone}55`,
                    animation: `riseIn 0.4s ease-out ${(ci * 3 + j) * 0.08}s both`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.06] px-2.5 py-1">
        <span className="text-[6px] font-semibold text-white/25">6 open deals</span>
        <span className="size-1 animate-pulse rounded-full" style={{ background: accent }} />
      </div>
    </Chrome>
  )
}

const SCREENS: Record<string, (props: { accent: string }) => React.ReactElement> = {
  fieldly: EditorScreen,
  stamp: TerminalScreen,
  slate: CalendarScreen,
  prophy: ChartScreen,
  leadr: KanbanScreen,
}

export function CodeScreenPeek({
  accent,
  slug,
  className = '',
}: {
  accent: string
  /** picks which screen type (editor / terminal / calendar) this concept gets */
  slug: string
  className?: string
}) {
  const Screen = SCREENS[slug] ?? EditorScreen

  return (
    <div
      className={`pointer-events-none flex select-none flex-col overflow-hidden rounded-[10%/5%] border border-white/10 bg-[#0d1117] shadow-[0_18px_32px_rgba(0,0,0,0.5)] ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
        @keyframes typeline { from { width: 0 } to { width: 100% } }
        @keyframes growbar { from { width: 0% } to { width: 78% } }
        @keyframes riseIn { from { opacity: 0; transform: scaleY(0.3) } to { opacity: 1; transform: scaleY(1) } }
        @keyframes pulseSoft { 0%, 100% { opacity: 0.5 } 50% { opacity: 1 } }
      `}</style>
      <Screen accent={accent} />
    </div>
  )
}
