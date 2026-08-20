import {
  Camera,
  Bell,
  Phone,
  Mail,
  Check,
  ChevronRight,
  Wrench,
  Zap,
  Droplet,
  Package,
  TrendingUp,
  Coffee,
  Cookie,
  ShoppingBag,
  Percent,
  Video,
  Star,
  Users,
  CalendarDays,
  Wallet,
  Receipt,
  QrCode,
  Filter,
  Plus,
  Home,
  ClipboardList,
  ArrowUpRight,
} from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Tap, useChoice, usePhoneNav, useScreenState } from './phoneUI'

/* ======================================================================
 * SHARED PRIMITIVES
 *
 * Kept deliberately small. Five products use five different UI patterns
 * (glass cards, kanban, calendar grids, stat tiles, card heroes) and
 * forcing all of them through one "flexible" component reads worse than
 * a little duplication between products that don't actually share a
 * layout. What's here is the handful of pieces that really do repeat.
 * ====================================================================== */

/**
 * The status bar clock, live. Twenty mock screens all read "9:41" (the
 * standard iOS-marketing-screenshot time) until this: every phone across
 * every concept now shows the visitor's actual local time, ticking once a
 * minute rather than on every render.
 */
function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000 * 15)
    return () => window.clearInterval(id)
  }, [])
  const h = now.getHours() % 12 || 12
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

function Bar({
  w,
  h = 7,
  tone = '#e6e6ea',
}: {
  w: string
  h?: number
  tone?: string
}) {
  return (
    <span
      className="block rounded-full"
      style={{ width: w, height: h, background: tone }}
    />
  )
}

function StatusBar({
  accent,
  dark = false,
}: {
  accent: string
  dark?: boolean
}) {
  const time = useClock()
  return (
    <div className="flex items-center justify-between px-4 pb-2 pt-11">
      <span
        className={`text-[10px] font-bold ${dark ? 'text-white/70' : 'text-[var(--ink-faint)]'}`}
      >
        {time}
      </span>
      <span className="size-2 rounded-full" style={{ background: accent }} />
    </div>
  )
}

function ScreenShell({
  children,
  bg = 'var(--paper)',
}: {
  children: ReactNode
  bg?: string
}) {
  return (
    <div
      className="flex h-full flex-col overflow-hidden text-[var(--ink)]"
      style={{ background: bg }}
    >
      {children}
    </div>
  )
}

/**
 * A dark-surface shell for the three products (Prophy, Leadr, Slate) whose
 * moodboard references run near-black/deep-teal instead of white. Text
 * inside can't lean on var(--ink); .reset-surface pins that to near-black
 * for the light screens, so everything here is set in explicit whites.
 */
function DarkScreenShell({
  children,
  bg,
}: {
  children: ReactNode
  bg: string
}) {
  return (
    <div
      className="flex h-full flex-col overflow-hidden text-white"
      style={{ background: bg }}
    >
      {children}
    </div>
  )
}

function DarkStatusBar({ accent }: { accent: string }) {
  const time = useClock()
  return (
    <div className="flex items-center justify-between px-4 pb-2 pt-11">
      <span className="text-[10px] font-bold text-white/60">{time}</span>
      <span className="size-2 rounded-full" style={{ background: accent }} />
    </div>
  )
}

/** Small colored-initial avatar: the stand-in for photography everywhere. */
function Avatar({
  name,
  tone,
  size = 28,
  fontSize = 9,
}: {
  name: string
  tone: string
  /** pixel diameter: kept a plain style so it isn't at the mercy of Tailwind's JIT class scanner */
  size?: number
  fontSize?: number
}) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ background: tone, width: size, height: size, fontSize }}
    >
      {initials}
    </span>
  )
}

/** A horizontal strip of icon + number + label: Dently/Leadr's stat-chip row. */
function StatChipRow({
  items,
  tone = 'light',
}: {
  items: Array<{ icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; value: string; label: string }>
  tone?: 'light' | 'dark'
}) {
  const lineColor = tone === 'dark' ? 'rgba(255,255,255,0.1)' : 'var(--line)'
  return (
    <div
      className="flex items-stretch rounded-xl"
      style={{ background: tone === 'dark' ? 'rgba(255,255,255,0.06)' : '#f4f4f6' }}
    >
      {items.map(({ icon: Icon, value, label }, i) => (
        <div
          key={label}
          className="flex flex-1 flex-col items-center gap-0.5 px-1 py-2"
          style={{ borderLeft: i > 0 ? `1px solid ${lineColor}` : undefined }}
        >
          <Icon
            className={`size-3 ${tone === 'dark' ? 'text-white/60' : 'text-[var(--ink-faint)]'}`}
            strokeWidth={2}
          />
          <span
            className={`text-[10px] font-extrabold ${tone === 'dark' ? 'text-white' : 'text-[var(--ink)]'}`}
          >
            {value}
          </span>
          <span
            className={`text-center text-[6.5px] font-semibold leading-tight ${tone === 'dark' ? 'text-white/50' : 'text-[var(--ink-faint)]'}`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Horizontal stage stepper: Leadr's deal-detail progress line. */
function Stepper({
  stages,
  activeIndex,
  accent,
}: {
  stages: string[]
  activeIndex: number
  accent: string
}) {
  return (
    <div className="flex items-center">
      {stages.map((s, i) => (
        <Fragment key={s}>
          <div className="flex flex-col items-center gap-1">
            <span
              className="flex size-3 items-center justify-center rounded-full border-2 transition-colors"
              style={{
                background: i <= activeIndex ? accent : 'transparent',
                borderColor: i <= activeIndex ? accent : 'rgba(255,255,255,0.25)',
              }}
            />
            <span
              className="whitespace-nowrap text-[6px] font-bold"
              style={{ color: i === activeIndex ? accent : 'rgba(255,255,255,0.45)' }}
            >
              {s}
            </span>
          </div>
          {i < stages.length - 1 && (
            <span
              className="mb-3.5 h-[2px] flex-1"
              style={{ background: i < activeIndex ? accent : 'rgba(255,255,255,0.16)' }}
            />
          )}
        </Fragment>
      ))}
    </div>
  )
}

/** A percentage progress ring: borrowed from the amber wallet reference. */
function ProgressRing({
  pct,
  tone,
  size = 44,
}: {
  pct: number
  tone: string
  size?: number
}) {
  const r = size / 2 - 4
  const c = 2 * Math.PI * r
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={4} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (pct / 100) * c}
          className="progress-ring-arc"
        />
      </svg>
      <span className="absolute text-[9px] font-extrabold text-white">{pct}%</span>
    </span>
  )
}

/* ============================= FIELDLY =============================
 * Reference: Flux (image 7): navy/near-black ground, map-pin price-style
 * highlight card, operational stat tiles + icon grid on the home screen,
 * colour-coded icon-chip rows for jobs/transactions. Indigo-blue accent
 * (#5B4FE8), Flux's own primary colour, replacing the old amber.
 */

const FIELDLY_BG = '#0A0912'

function FieldlyDispatch({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [open, setOpen] = useChoice('fieldly.job', 0)
  const jobs = [
    { name: '14 Oak Street', tag: 'HVAC', status: 'En Route', tone: accent, Icon: Zap },
    { name: '82 Birch Avenue', tag: 'Plumbing', status: 'In Progress', tone: '#F08A24', Icon: Droplet },
    { name: '3 Elm Road', tag: 'Electrical', status: 'Scheduled', tone: '#9aa0ac', Icon: Wrench },
    { name: '55 Pine Close', tag: 'HVAC', status: 'Scheduled', tone: '#9aa0ac', Icon: Zap },
  ]
  return (
    <DarkScreenShell bg={FIELDLY_BG}>
      <DarkStatusBar accent={accent} />
      <div className="px-3.5 pb-2.5">
        <p className="text-[13px] font-extrabold text-white">Morning, Marcus</p>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <p className="text-[7.5px] font-bold uppercase tracking-wide text-white/50">
              Today&rsquo;s Jobs
            </p>
            <p className="mt-1 text-lg font-extrabold text-white">4</p>
          </div>
          <div className="rounded-xl p-2.5" style={{ background: accent }}>
            <p className="text-[7.5px] font-bold uppercase tracking-wide text-white/70">
              Est. Revenue
            </p>
            <p className="mt-1 text-lg font-extrabold text-white">$2,340</p>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden px-3.5 pb-3">
        {jobs.map((j, i) => (
          <Tap
            key={j.name}
            ripple={j.tone}
            label={`Open ${j.name}`}
            onTap={() => {
              setOpen(i)
              go(1)
            }}
          >
            <span
              className="flex items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-colors"
              style={{
                background: 'rgba(255,255,255,0.045)',
                borderColor: open === i ? j.tone : 'rgba(255,255,255,0.08)',
                boxShadow: open === i ? `0 0 0 1px ${j.tone}55` : undefined,
              }}
            >
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-lg"
                style={{ background: `${j.tone}22`, color: j.tone }}
              >
                <j.Icon className="size-3.5" strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[10px] font-bold text-white">
                  {j.name}
                </span>
                <span className="block text-[8.5px] text-white/45">{j.tag}</span>
              </span>
              <span
                className="shrink-0 rounded-full px-1.5 py-0.5 text-[7.5px] font-bold"
                style={{ background: `${j.tone}26`, color: j.tone }}
              >
                {j.status}
              </span>
            </span>
          </Tap>
        ))}
      </div>
      <div className="px-3.5 pb-4">
        <Tap ripple="#ffffff" label="New job" onTap={() => go(1)}>
          <span
            className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[11px] font-bold text-white"
            style={{ background: accent }}
          >
            + New Job
          </span>
        </Tap>
      </div>
    </DarkScreenShell>
  )
}

function FieldlyQuote({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [sent, setSent] = useScreenState<'none' | 'sent' | 'invoiced'>(
    'fieldly.quote',
    'none',
  )
  const lines = [
    { l: 'Labour (4h × $85)', v: '$340.00' },
    { l: 'Pipe fittings & parts', v: '$120.00' },
    { l: 'Emergency call-out fee', v: '$75.00' },
  ]
  return (
    <DarkScreenShell bg={FIELDLY_BG}>
      <DarkStatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <Tap
          ripple={accent}
          press={false}
          label="Back to today's jobs"
          onTap={() => go(0)}
          className="mb-1.5 !w-auto"
        >
          <span
            className="flex items-center gap-0.5 text-[9px] font-bold"
            style={{ color: accent }}
          >
            <ChevronRight className="size-2.5 rotate-180" strokeWidth={3} />
            Jobs
          </span>
        </Tap>
        {/* card-visual treatment, echoing Flux's debit-card hero */}
        <div
          className="relative overflow-hidden rounded-xl p-3 text-white"
          style={{ background: `linear-gradient(135deg, ${accent}, #3B2FC9)` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-wide text-white/65">
                Quote #Q-0847
              </p>
              <p className="mt-1 text-base font-extrabold">$588.50</p>
            </div>
            <Receipt className="size-4 text-white/55" strokeWidth={2} />
          </div>
          <p className="mt-2 text-[8.5px] font-semibold text-white/70">
            Sarah Johnson · 18 Nov 2025
          </p>
        </div>
        <div className="mt-3 space-y-1.5 rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {lines.map((row) => (
            <div key={row.l} className="flex items-center justify-between">
              <span className="text-[8.5px] text-white/55">{row.l}</span>
              <span className="text-[9px] font-semibold text-white/55">{row.v}</span>
            </div>
          ))}
          <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-1.5">
            <span className="text-[9px] font-extrabold text-white">Total</span>
            <span className="text-[11px] font-extrabold text-white">$588.50</span>
          </div>
        </div>
      </div>
      <div className="space-y-2 px-3.5 pb-4">
        <Tap
          ripple="#ffffff"
          label="Convert to invoice"
          onTap={() => setSent('invoiced')}
        >
          <span
            className="block rounded-xl py-2.5 text-center text-[10.5px] font-bold text-white transition-colors"
            style={{ background: sent === 'invoiced' ? '#1F9D55' : accent }}
          >
            {sent === 'invoiced' ? 'Invoice created ✓' : 'Convert to Invoice'}
          </span>
        </Tap>
        <Tap
          ripple={accent}
          label="Send quote to client"
          onTap={() => setSent('sent')}
        >
          <span className="block rounded-xl border border-white/15 py-2 text-center text-[10px] font-semibold text-white/70">
            {sent === 'sent' ? 'Sent to Sarah ✓' : 'Send to Client'}
          </span>
        </Tap>
      </div>
    </DarkScreenShell>
  )
}

function FieldlyPhotos({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [shot, setShot] = useScreenState('fieldly.before', false)
  const [done, setDone] = useScreenState('fieldly.done', false)
  return (
    <DarkScreenShell bg={FIELDLY_BG}>
      <DarkStatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-white">Job #1047 · Photos</p>
        <p className="text-[8.5px] text-white/45">Panel upgrade · Marcus D.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <p className="text-[8px] font-bold uppercase tracking-wide text-white/45">
              Before
            </p>
            <Tap
              ripple={accent}
              label="Take before photo"
              onTap={() => setShot(true)}
            >
              <span
                className="flex aspect-square items-center justify-center rounded-xl border transition-colors"
                style={
                  shot
                    ? { background: `${accent}26`, borderColor: 'transparent' }
                    : {
                        background: 'rgba(255,255,255,0.04)',
                        borderColor: 'rgba(255,255,255,0.14)',
                        borderStyle: 'dashed',
                      }
                }
              >
                {shot ? (
                  <Check
                    className="size-4"
                    style={{ color: accent }}
                    strokeWidth={2.5}
                  />
                ) : (
                  <Camera className="size-4 text-white/35" strokeWidth={1.75} />
                )}
              </span>
            </Tap>
          </div>
          <div className="space-y-1">
            <p
              className="text-[8px] font-bold uppercase tracking-wide"
              style={{ color: accent }}
            >
              After
            </p>
            <div
              className="flex aspect-square items-center justify-center rounded-xl"
              style={{ background: `${accent}26` }}
            >
              <Check
                className="size-4"
                style={{ color: accent }}
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.045)' }}>
          <p className="text-[7.5px] font-bold uppercase tracking-wide text-white/40">
            Notes
          </p>
          <div className="mt-1.5 space-y-1">
            <Bar w="90%" h={6} tone="rgba(255,255,255,0.12)" />
            <Bar w="60%" h={6} tone="rgba(255,255,255,0.08)" />
          </div>
        </div>
      </div>
      <div className="px-3.5 pb-4">
        <Tap
          ripple="#ffffff"
          label="Mark job complete"
          onTap={() => {
            setDone(true)
            window.setTimeout(() => go(3), 700)
          }}
        >
          <span
            className="block rounded-xl py-2.5 text-center text-[10.5px] font-bold text-white transition-colors"
            style={{ background: done ? '#1F9D55' : accent }}
          >
            {done ? 'Completed ✓' : 'Mark Complete'}
          </span>
        </Tap>
      </div>
    </DarkScreenShell>
  )
}

function FieldlySchedule({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [day, setDay] = useChoice('fieldly.day', 2)
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const rows = [
    { t: '8:00', label: 'HVAC · Oak St', tone: accent, Icon: Zap },
    { t: '10:30', label: 'Plumbing · Birch Ave', tone: '#F08A24', Icon: Droplet },
    { t: '13:00', label: 'Lunch', tone: '#9aa0ac', Icon: Package },
    { t: '14:00', label: 'Electrical · Elm Rd', tone: '#1F9D55', Icon: Wrench },
    { t: '16:00', label: 'HVAC · Pine Close', tone: accent, Icon: Zap },
  ]
  return (
    <DarkScreenShell bg={FIELDLY_BG}>
      <DarkStatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-white">November</p>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <Tap
              key={i}
              press={false}
              ripple={accent}
              label={`Show ${18 + i} November`}
              onTap={() => setDay(i)}
            >
              <span className="flex flex-col items-center gap-1">
                <span className="text-[7px] font-bold text-white/40">{d}</span>
                <span
                  className="flex size-5 items-center justify-center rounded-full text-[8px] font-bold transition-colors"
                  style={
                    day === i
                      ? { background: accent, color: 'white' }
                      : { color: 'rgba(255,255,255,0.6)' }
                  }
                >
                  {18 + i}
                </span>
              </span>
            </Tap>
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {rows.map((r) => (
            <Tap
              key={r.t}
              ripple={r.tone}
              label={`Open ${r.label}`}
              onTap={() => go(0)}
            >
              <span className="flex items-center gap-2">
                <span className="w-7 shrink-0 text-[8px] font-bold text-white/40">
                  {r.t}
                </span>
                <span
                  className="flex h-7 flex-1 items-center gap-1.5 rounded-lg px-2"
                  style={{ background: `${r.tone}22` }}
                >
                  <r.Icon className="size-3" style={{ color: r.tone }} strokeWidth={2.2} />
                  <span className="text-[8px] font-bold" style={{ color: r.tone }}>
                    {r.label}
                  </span>
                </span>
              </span>
            </Tap>
          ))}
        </div>
      </div>
    </DarkScreenShell>
  )
}

/* ============================= STAMP =============================
 * Reference: Vault (image 3/4): a balance/card hero, month-pill +
 * chart treatment for anything numeric, category-icon-chip rows for
 * the reward catalog and offers. Purple accent already matches Vault's
 * own palette, so the cream/purple pairing carries over almost as-is.
 */

const STAMP_BG = '#0D0A16'

function StampWallet({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [points] = useScreenState('stamp.points', 1240)
  return (
    <DarkScreenShell bg={STAMP_BG}>
      <DarkStatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-extrabold text-white">Wallet</p>
          <Avatar name="Jamie Ortiz" tone={accent} />
        </div>
        {/* Vault-style balance/card hero */}
        <Tap ripple="#ffffff" label="See reward catalog" onTap={() => go(2)} className="mt-3">
          <span
            className="relative block overflow-hidden rounded-2xl p-3.5 text-left text-white"
            style={{ background: `linear-gradient(135deg, ${accent}, #E88FD8)` }}
          >
            <span className="absolute -right-6 -top-10 size-28 rounded-full bg-white/10" />
            <span className="relative flex items-center justify-between">
              <span className="block text-[8.5px] font-semibold text-white/75">
                Total points
              </span>
              <Wallet className="size-3.5 text-white/65" strokeWidth={2} />
            </span>
            <span className="relative mt-1 block text-2xl font-extrabold">
              {points.toLocaleString()}
            </span>
            <span className="relative mt-2 block text-[8px] font-semibold text-white/75">
              3 rewards available · tap to redeem
            </span>
          </span>
        </Tap>
        <div className="mt-3 space-y-2">
          <Tap ripple={accent} label="Open Brew and Co punch card" onTap={() => go(1)}>
            <span className="flex items-center gap-2.5 rounded-xl px-2.5 py-2" style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg" style={{ background: `${accent}22`, color: accent }}>
                <Coffee className="size-3.5" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between">
                  <span className="text-[9.5px] font-bold text-white">
                    Brew &amp; Co
                  </span>
                  <span className="text-[8px] font-semibold text-white/45">
                    1 stamp away
                  </span>
                </span>
                <span className="mt-1 flex gap-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span
                      key={i}
                      className="size-2 rounded-full"
                      style={{ background: i < 7 ? accent : 'rgba(255,255,255,0.14)' }}
                    />
                  ))}
                </span>
              </span>
            </span>
          </Tap>
          <Tap ripple={accent} label="Open Corner Mart card" onTap={() => go(3)}>
            <span className="flex items-center gap-2.5 rounded-xl px-2.5 py-2" style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg" style={{ background: `${accent}22`, color: accent }}>
                <ShoppingBag className="size-3.5" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between">
                  <span className="text-[9.5px] font-bold text-white">
                    Corner Mart
                  </span>
                  <span className="text-[8px] font-semibold text-white/45">
                    340 pts
                  </span>
                </span>
                <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <span className="block h-full w-[68%] rounded-full" style={{ background: accent }} />
                </span>
              </span>
            </span>
          </Tap>
        </div>
      </div>
    </DarkScreenShell>
  )
}

function StampPunchCard({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [stamps, setStamps] = useScreenState('stamp.stamps', 9)
  const full = stamps >= 10
  return (
    <ScreenShell bg="#FBF4EA">
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Brew &amp; Co
        </p>
        <p className="text-[8.5px] text-[var(--ink-faint)]">
          Coffee · Punch Card
        </p>
        <div className="mt-3 rounded-2xl border border-[#e7d9c2] bg-white p-3">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="flex aspect-square items-center justify-center rounded-full border-2 transition-colors duration-300"
                style={
                  i < stamps
                    ? { background: accent, borderColor: accent }
                    : { borderColor: '#e7d9c2' }
                }
              >
                {i < stamps && (
                  <Check className="size-2.5 text-white" strokeWidth={3} />
                )}
              </span>
            ))}
          </div>
          <p className="mt-2.5 text-center text-[9px] font-bold text-[var(--ink)]">
            {full
              ? 'Card full: your next coffee is free'
              : `${stamps} of 10 stamps, ${10 - stamps} more and it’s free`}
          </p>
        </div>
      </div>
      <div className="px-3.5 pb-4">
        <Tap
          ripple="#ffffff"
          label={full ? 'Claim free coffee' : 'Scan to stamp'}
          onTap={() => (full ? go(2) : setStamps((n) => n + 1))}
        >
          <span
            className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-center text-[10.5px] font-bold text-white transition-colors"
            style={{ background: full ? '#1F9D55' : accent }}
          >
            {!full && <QrCode className="size-3.5" strokeWidth={2.2} />}
            {full ? 'Claim Free Coffee' : 'Scan to Stamp'}
          </span>
        </Tap>
      </div>
    </ScreenShell>
  )
}

function StampCatalog({ accent }: { accent: string }) {
  const [points, setPoints] = useScreenState('stamp.points', 1240)
  const [taken, setTaken] = useScreenState<Array<string>>('stamp.taken', [])
  const rewards = [
    { name: 'Free Coffee', cost: '500 pts', price: 500, Icon: Coffee },
    { name: '10% Off Order', cost: '300 pts', price: 300, Icon: Percent },
    { name: 'Free Pastry', cost: '400 pts', price: 400, Icon: Cookie },
  ]
  // a Vault-style bar breakdown of where the points came from this month
  const bars = [
    { l: 'Brew & Co', v: 60 },
    { l: 'Corner Mart', v: 34 },
    { l: 'Sunny Bakes', v: 18 },
    { l: 'Other', v: 8 },
  ]
  return (
    <ScreenShell bg="#FBF4EA">
      <StatusBar accent={accent} />
      <div className="flex-1 space-y-3 overflow-hidden px-3.5 pb-3">
        <div>
          <p className="text-[13px] font-extrabold text-[var(--ink)]">
            Reward Catalog
          </p>
          <p className="text-[8.5px] text-[var(--ink-faint)]">
            {points.toLocaleString()} points available
          </p>
        </div>
        <div className="flex h-12 items-end gap-2 rounded-xl bg-white p-2">
          {bars.map((b) => (
            <div key={b.l} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span
                className="block w-full rounded-t"
                style={{ height: `${b.v}%`, background: `linear-gradient(180deg, ${accent}, #4C1D95)` }}
              />
              <span className="text-[6px] font-bold text-[var(--ink-faint)]">{b.l}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {rewards.map((r) => {
            const got = taken.includes(r.name)
            const afford = points >= r.price
            return (
              <Tap
                key={r.name}
                ripple={accent}
                disabled={got || !afford}
                label={`Redeem ${r.name}`}
                onTap={() => {
                  setTaken((cur) => [...cur, r.name])
                  setPoints((p) => p - r.price)
                }}
              >
                <span className="flex items-center justify-between rounded-xl border border-[#e7d9c2] bg-white px-2.5 py-2">
                  <span className="flex items-center gap-2">
                    <span
                      className="flex size-6 items-center justify-center rounded-lg"
                      style={{ background: `${accent}18`, color: accent }}
                    >
                      <r.Icon className="size-3" strokeWidth={2} />
                    </span>
                    <span className="block text-left">
                      <span className="block text-[9.5px] font-bold text-[var(--ink)]">
                        {r.name}
                      </span>
                      <span className="block text-[8px] text-[var(--ink-faint)]">
                        {r.cost}
                      </span>
                    </span>
                  </span>
                  <span
                    className="rounded-full px-2 py-1 text-[7.5px] font-bold text-white transition-colors"
                    style={{
                      background: got ? '#1F9D55' : afford ? accent : 'var(--ink-faint)',
                    }}
                  >
                    {got ? 'Redeemed' : afford ? 'Redeem' : 'Short'}
                  </span>
                </span>
              </Tap>
            )
          })}
        </div>
      </div>
    </ScreenShell>
  )
}

function StampOffers({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const offers = [
    { name: 'Brew & Co', offer: 'Double points today', dist: '0.2 km', Icon: Coffee },
    { name: 'Corner Mart', offer: 'Bonus 200 pts', dist: '0.4 km', Icon: ShoppingBag },
    { name: 'Sunny Bakes', offer: 'Free cookie w/ drink', dist: '0.6 km', Icon: Cookie },
  ]
  return (
    <ScreenShell bg="#FBF4EA">
      <StatusBar accent={accent} />
      <div className="flex-1 space-y-2 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Offers &amp; Alerts
        </p>
        <div
          className="flex items-center gap-1.5 rounded-xl px-2.5 py-2"
          style={{ background: `${accent}1f` }}
        >
          <Bell className="size-3" style={{ color: accent }} strokeWidth={2.2} />
          <p className="text-[8.5px] font-bold" style={{ color: accent }}>
            3 live deals nearby
          </p>
        </div>
        {offers.map((o) => (
          <Tap key={o.name} ripple={accent} label={`Open ${o.name}`} onTap={() => go(1)}>
            <span className="flex items-center gap-2.5 rounded-xl border border-[#e7d9c2] bg-white px-2.5 py-2">
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-lg"
                style={{ background: `${accent}18`, color: accent }}
              >
                <o.Icon className="size-3.5" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-[9px] font-bold text-[var(--ink)]">
                  {o.name}
                </span>
                <span className="block truncate text-[8px] text-[var(--ink-faint)]">
                  {o.offer}
                </span>
              </span>
              <span className="shrink-0 text-[7.5px] font-semibold text-[var(--ink-faint)]">
                {o.dist}
              </span>
            </span>
          </Tap>
        ))}
      </div>
    </ScreenShell>
  )
}

/* ============================= SLATE =============================
 * Reference: Slotly (image 6): near-black ground, stat tiles (Bookings
 * Today / Revenue), staff/service filter pills, a day-schedule of coloured
 * time-block rows, bottom stat strip. Slate keeps its own teal accent
 * rather than Slotly's coral, and stays calmer/more spacious than
 * Fieldly's denser operational layout.
 */

const SLATE_BG = '#0D0B0C'

function SlateBooking({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [day, setDay] = useChoice('slate.day', 1)
  const [slot, setSlot] = useChoice('slate.slot', 0)
  const [service, setService] = useChoice('slate.service', 0)
  const services = ['Haircut', 'Colour', 'Massage']
  const days = [17, 18, 19, 20, 21, 22, 23]
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const slots = ['9:00 AM', '9:30 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:30 PM']
  return (
    <DarkScreenShell bg={SLATE_BG}>
      <DarkStatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-white">Book a Slot</p>
        <div className="mt-2 flex gap-1.5">
          {services.map((s, i) => (
            <Tap
              key={s}
              press={false}
              ripple={accent}
              label={`Choose ${s}`}
              onTap={() => setService(i)}
              className="!w-auto"
            >
              <span
                className="block rounded-full px-2.5 py-1 text-[7.5px] font-bold transition-colors"
                style={
                  service === i
                    ? { background: accent, color: '#04211d' }
                    : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }
                }
              >
                {s}
              </span>
            </Tap>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <Tap
              key={d}
              press={false}
              ripple={accent}
              label={`Choose ${d} November`}
              onTap={() => setDay(i)}
            >
              <span className="flex flex-col items-center gap-1">
                <span className="text-[7px] font-bold text-white/40">
                  {dayLabels[i]}
                </span>
                <span
                  className="flex size-5 items-center justify-center rounded-full text-[8px] font-bold transition-colors"
                  style={
                    day === i
                      ? { background: accent, color: '#04211d' }
                      : { color: 'rgba(255,255,255,0.7)' }
                  }
                >
                  {d}
                </span>
              </span>
            </Tap>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {slots.map((s, i) => (
            <Tap
              key={s}
              press={false}
              ripple={accent}
              label={`Choose ${s}`}
              onTap={() => setSlot(i)}
            >
              <span
                className="block rounded-lg border py-1.5 text-center text-[8.5px] font-bold transition-colors"
                style={
                  slot === i
                    ? { borderColor: accent, color: accent, background: `${accent}1a` }
                    : { borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)' }
                }
              >
                {s}
              </span>
            </Tap>
          ))}
        </div>
      </div>
      <div className="px-3.5 pb-4">
        <Tap ripple="#ffffff" label="Confirm booking" onTap={() => go(1)}>
          <span
            className="block rounded-xl py-2.5 text-center text-[10.5px] font-bold"
            style={{ background: accent, color: '#04211d' }}
          >
            Confirm {days[day]} Nov · {slots[slot]}
          </span>
        </Tap>
      </div>
    </DarkScreenShell>
  )
}

function SlateConfirmed({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [added, setAdded] = useScreenState('slate.calendar', false)
  return (
    <DarkScreenShell bg={SLATE_BG}>
      <DarkStatusBar accent={accent} />
      <div className="flex flex-1 flex-col items-center justify-center px-5 pb-6 text-center">
        <span
          className="flex size-12 items-center justify-center rounded-full"
          style={{ background: `${accent}22` }}
        >
          <Check className="size-6" style={{ color: accent }} strokeWidth={2.5} />
        </span>
        <p className="mt-3 text-[13px] font-extrabold text-white">
          You&rsquo;re booked!
        </p>
        <p className="mt-1 text-[8.5px] text-white/50">
          Confirmation sent to your phone
        </p>
        <div className="mt-4 w-full space-y-1.5 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-left">
          <div className="flex justify-between">
            <span className="text-[8px] text-white/45">Service</span>
            <span className="text-[8.5px] font-bold text-white">
              Haircut &amp; Style
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[8px] text-white/45">Date</span>
            <span className="text-[8.5px] font-bold text-white">
              Mon, 18 Nov
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[8px] text-white/45">Time</span>
            <span className="text-[8.5px] font-bold text-white">9:00 AM</span>
          </div>
        </div>
        <Tap
          ripple="#ffffff"
          label="Add booking to calendar"
          className="mt-3"
          onTap={() => {
            setAdded(true)
            window.setTimeout(() => go(2), 700)
          }}
        >
          <span
            className="block w-full rounded-xl py-2.5 text-center text-[10px] font-bold transition-colors"
            style={{
              background: added ? '#1F9D55' : accent,
              color: added ? 'white' : '#04211d',
            }}
          >
            {added ? 'Added to Calendar ✓' : 'Add to Calendar'}
          </span>
        </Tap>
      </div>
    </DarkScreenShell>
  )
}

function SlateAppointments({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [tab, setTab] = useChoice('slate.tab', 0)
  const [cancelled, setCancelled] = useScreenState<Array<string>>(
    'slate.cancelled',
    [],
  )
  const upcoming = [
    { s: 'Haircut & Style', t: 'Mon 18 Nov · 9:00 AM' },
    { s: 'Deep Tissue Massage', t: 'Thu 21 Nov · 2:30 PM' },
  ]
  const past = [
    { s: 'Haircut & Style', t: 'Mon 21 Oct · 9:00 AM' },
    { s: 'Beard Trim', t: 'Fri 4 Oct · 5:15 PM' },
  ]
  const shown = (tab === 0 ? upcoming : past).filter(
    (u) => !cancelled.includes(u.s),
  )
  return (
    <DarkScreenShell bg={SLATE_BG}>
      <DarkStatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-white">My Appointments</p>
        <div className="mt-2 flex gap-2">
          {['Upcoming', 'Past'].map((t, i) => (
            <Tap
              key={t}
              press={false}
              ripple={accent}
              label={`Show ${t}`}
              onTap={() => setTab(i)}
              className="!w-auto"
            >
              <span
                className="block rounded-full px-2.5 py-1 text-[8px] font-bold transition-colors"
                style={
                  tab === i
                    ? { background: accent, color: '#04211d' }
                    : { color: 'rgba(255,255,255,0.5)' }
                }
              >
                {t}
              </span>
            </Tap>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {shown.map((u) => (
            <div
              key={u.s}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[9.5px] font-bold text-white">{u.s}</p>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[7px] font-bold"
                  style={{
                    background: tab === 0 ? accent : 'rgba(255,255,255,0.15)',
                    color: tab === 0 ? '#04211d' : 'rgba(255,255,255,0.7)',
                  }}
                >
                  {tab === 0 ? 'Upcoming' : 'Done'}
                </span>
              </div>
              <p className="mt-0.5 text-[8px] text-white/45">{u.t}</p>
              <div className="mt-2 flex gap-1.5">
                <Tap
                  ripple={accent}
                  className="flex-1"
                  label={`Reschedule ${u.s}`}
                  onTap={() => go(0)}
                >
                  <span className="block rounded-md border border-white/15 py-1 text-center text-[7.5px] font-semibold text-white/70">
                    {tab === 0 ? 'Reschedule' : 'Book again'}
                  </span>
                </Tap>
                {tab === 0 && (
                  <Tap
                    ripple="#DC2626"
                    className="flex-1"
                    label={`Cancel ${u.s}`}
                    onTap={() => setCancelled((c) => [...c, u.s])}
                  >
                    <span className="block rounded-md border border-white/15 py-1 text-center text-[7.5px] font-semibold text-white/70">
                      Cancel
                    </span>
                  </Tap>
                )}
              </div>
            </div>
          ))}
          {shown.length === 0 && (
            <p className="py-6 text-center text-[8.5px] text-white/40">
              Nothing booked. Tap Book a Slot to add one.
            </p>
          )}
        </div>
      </div>
    </DarkScreenShell>
  )
}

function SlateSchedule({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [staff, setStaff] = useChoice('slate.staff', 0)
  const [picked, setPicked] = useChoice('slate.picked', -1)
  const staffOptions = ['All Staff', 'Neha', 'Priya']
  const rows = [
    { t: '9:00', name: 'Sarah M.', tone: accent, kind: 'confirmed' as const },
    { t: '10:15', name: 'Priya K.', tone: accent, kind: 'confirmed' as const },
    { t: '11:30', name: 'Open slot', tone: 'rgba(255,255,255,0.08)', kind: 'open' as const },
    { t: '13:00', name: 'Tom R.', tone: '#DC2626', kind: 'urgent' as const },
    { t: '15:30', name: 'Aisha N.', tone: accent, kind: 'confirmed' as const },
  ]
  return (
    <DarkScreenShell bg={SLATE_BG}>
      <DarkStatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-white">
          Today&rsquo;s Schedule
        </p>
        <p className="text-[8.5px] text-white/45">Mon, 18 Nov · 5 booked</p>
        <div className="mt-2 flex gap-1.5 overflow-x-auto">
          {staffOptions.map((s, i) => (
            <Tap
              key={s}
              press={false}
              ripple={accent}
              label={`Filter by ${s}`}
              onTap={() => setStaff(i)}
              className="!w-auto shrink-0"
            >
              <span
                className="flex items-center gap-1 rounded-full px-2 py-1 text-[7.5px] font-bold transition-colors"
                style={
                  staff === i
                    ? { background: accent, color: '#04211d' }
                    : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }
                }
              >
                <Filter className="size-2" strokeWidth={2.5} />
                {s}
              </span>
            </Tap>
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {rows.map((r, i) => {
            const free = r.kind === 'open'
            return (
              <Tap
                key={r.t}
                ripple={accent}
                label={free ? `Book ${r.t}` : `Open ${r.name}`}
                onTap={() => {
                  setPicked(i)
                  if (free) go(0)
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="w-7 shrink-0 text-[8px] font-bold text-white/40">
                    {r.t}
                  </span>
                  <span
                    className="flex h-6 flex-1 items-center justify-between rounded-md px-2 transition-shadow"
                    style={{
                      background: r.kind === 'open' ? r.tone : `${r.tone}26`,
                      boxShadow: picked === i ? `inset 0 0 0 1px ${accent}` : undefined,
                    }}
                  >
                    <span className="text-[8px] font-bold" style={{ color: free ? 'rgba(255,255,255,0.4)' : r.tone }}>
                      {r.name}
                    </span>
                    {free && (
                      <span className="text-[7px] font-bold" style={{ color: accent }}>
                        Book
                      </span>
                    )}
                  </span>
                </span>
              </Tap>
            )
          })}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 px-3.5 pb-4">
        {[
          { l: 'Bookings', v: '5' },
          { l: 'Revenue', v: '$310' },
          { l: 'Pending', v: '1' },
        ].map((s) => (
          <div key={s.l} className="rounded-lg bg-white/[0.06] p-1.5 text-center">
            <p className="text-[11px] font-extrabold text-white">{s.v}</p>
            <p className="text-[6.5px] font-semibold text-white/45">{s.l}</p>
          </div>
        ))}
      </div>
    </DarkScreenShell>
  )
}

/* ============================= PROPHY =============================
 * Reference: Dently (image 1/2): deep teal ground, glassy frosted
 * cards, pill bottom nav, avatar-and-stat-chip doctor/patient cards,
 * an appointment card with two buttons, and a proper chair-schedule
 * grid. Photography is replaced throughout with initials avatars.
 * Blue accent (#2563EB) preserved.
 */

const PROPHY_BG = 'linear-gradient(180deg, #0F3630 0%, #071D1A 100%)'

function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}

function ProphyRecall({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [called, setCalled] = useScreenState<Array<string>>('prophy.called', [])
  const patients = [
    { name: 'Emma Wilkins', due: 'Overdue 2 wks', urgent: true },
    { name: 'Marcus Lee', due: 'Due this week', urgent: false },
    { name: 'Priya Shah', due: 'Due this week', urgent: false },
    { name: 'Tom Baxter', due: 'Due in 2 wks', urgent: false },
  ]
  return (
    <DarkScreenShell bg={PROPHY_BG}>
      <DarkStatusBar accent={accent} />
      <div className="px-3.5 pb-2.5">
        <p className="text-[13px] font-extrabold text-white">Patient Recall</p>
        <p className="text-[8.5px] text-white/50">14 patients due this month</p>
        <StatChipRow
          tone="dark"
          items={[
            { icon: Users, value: '14', label: 'Due' },
            { icon: Bell, value: '1', label: 'Overdue' },
            { icon: Check, value: '9', label: 'Contacted' },
          ]}
        />
      </div>
      <div className="flex-1 space-y-2 overflow-hidden px-3.5 pb-3">
        {patients.map((p) => {
          const done = called.includes(p.name)
          return (
            <Tap
              key={p.name}
              ripple={p.urgent ? '#DC2626' : accent}
              label={`Open ${p.name}`}
              onTap={() => {
                setCalled((c) => (c.includes(p.name) ? c : [...c, p.name]))
                go(1)
              }}
            >
              <GlassCard className="flex items-center gap-2.5 px-2.5 py-2">
                <Avatar
                  name={p.name}
                  tone={done ? '#1F9D55' : p.urgent ? '#DC2626' : accent}
                />
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-[9px] font-bold text-white">
                    {p.name}
                  </span>
                  <span
                    className="block text-[8px] font-semibold"
                    style={{
                      color: done ? '#4ADE80' : p.urgent ? '#F87171' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {done ? 'Contacted' : p.due}
                  </span>
                </span>
                <ChevronRight className="size-3 shrink-0 text-white/35" />
              </GlassCard>
            </Tap>
          )
        })}
      </div>
    </DarkScreenShell>
  )
}

function ProphyChart({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [saved, setSaved] = useScreenState('prophy.saved', false)
  return (
    <DarkScreenShell bg={PROPHY_BG}>
      <DarkStatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <Tap
          ripple={accent}
          press={false}
          label="Back to patient recall"
          onTap={() => go(0)}
          className="mb-1.5 !w-auto"
        >
          <span className="flex items-center gap-0.5 text-[9px] font-bold" style={{ color: accent }}>
            <ChevronRight className="size-2.5 rotate-180" strokeWidth={3} />
            Recall
          </span>
        </Tap>
        <div className="flex items-center gap-2.5">
          <Avatar name="Emma Wilkins" tone={accent} size={36} />
          <div>
            <p className="text-[12px] font-extrabold text-white">Emma Wilkins</p>
            <p className="text-[8px] text-white/45">DOB 04/12/1991 · Chart #2214</p>
          </div>
        </div>
        {/* appointment-card-with-two-buttons pattern from the reference */}
        <GlassCard className="mt-3 p-2.5">
          <p className="text-[7.5px] font-bold uppercase tracking-wide text-white/45">
            Upcoming Appointment
          </p>
          <p className="mt-1 text-[10px] font-bold text-white">
            Scaling &amp; Polish · Dr. Okafor
          </p>
          <p className="text-[8px] text-white/45">Wed 20 Nov · 10:00 AM</p>
          <div className="mt-2 flex gap-1.5">
            <span className="flex-1 rounded-lg border border-white/15 py-1.5 text-center text-[7.5px] font-semibold text-white/70">
              Reschedule
            </span>
            <span
              className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-center text-[7.5px] font-bold text-white"
              style={{ background: accent }}
            >
              <Video className="size-2.5" strokeWidth={2.4} />
              Join Now
            </span>
          </div>
        </GlassCard>
        <GlassCard className="mt-2.5 p-2.5">
          <p className="text-[8px] font-bold uppercase tracking-wide" style={{ color: accent }}>
            Today&rsquo;s notes
          </p>
          <div className="mt-1.5 space-y-1">
            <Bar w="95%" h={6} tone="rgba(255,255,255,0.14)" />
            <Bar w="88%" h={6} tone="rgba(255,255,255,0.14)" />
            <Bar w="60%" h={6} tone="rgba(255,255,255,0.14)" />
          </div>
        </GlassCard>
        <StatChipRow
          tone="dark"
          items={[
            { icon: CalendarDays, value: '6 mo', label: 'Last visit' },
            { icon: Bell, value: '2 wks', label: 'Next recall' },
            { icon: Star, value: '4.9', label: 'Satisfaction' },
          ]}
        />
      </div>
      <div className="px-3.5 pb-4">
        <Tap
          ripple="#ffffff"
          label="Save notes"
          onTap={() => {
            setSaved(true)
            window.setTimeout(() => go(3), 700)
          }}
        >
          <span
            className="block rounded-xl py-2.5 text-center text-[10.5px] font-bold text-white transition-colors"
            style={{ background: saved ? '#1F9D55' : accent }}
          >
            {saved ? 'Notes saved ✓' : 'Save Notes'}
          </span>
        </Tap>
      </div>
    </DarkScreenShell>
  )
}

function ProphyDaySchedule({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [filled, setFilled] = useScreenState<Array<string>>('prophy.filled', [])
  const chairs = ['Chair 1', 'Chair 2']
  const rows = [
    { t: '9:00', c1: true, c2: false },
    { t: '10:00', c1: false, c2: true },
    { t: '11:00', c1: true, c2: false },
    { t: '13:00', c1: false, c2: false },
  ]
  return (
    <DarkScreenShell bg={PROPHY_BG}>
      <DarkStatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-white">Day Schedule</p>
        <p className="text-[8.5px] text-white/45">Wed, 20 Nov · 2 chairs</p>
        <GlassCard className="mt-2.5 p-2">
          <div className="grid grid-cols-[2.2rem_1fr_1fr] gap-1.5">
            <span />
            {chairs.map((c) => (
              <span key={c} className="text-center text-[7.5px] font-bold text-white/50">
                {c}
              </span>
            ))}
            {rows.map((r) => (
              <Fragment key={r.t}>
                <span className="self-center text-[7.5px] font-bold text-white/40">
                  {r.t}
                </span>
                {[r.c1, r.c2].map((isBooked, col) => {
                  const key = `${r.t}-${col}`
                  const booked = isBooked || filled.includes(key)
                  return (
                    <Tap
                      key={key}
                      ripple={accent}
                      label={booked ? `${r.t} booked` : `Book ${r.t}`}
                      onTap={() => {
                        if (booked) {
                          go(1)
                          return
                        }
                        setFilled((f) => [...f, key])
                      }}
                    >
                      <span
                        className="flex h-7 items-center justify-center rounded-lg text-[7px] font-bold transition-colors"
                        style={{
                          background: booked ? `${accent}33` : 'rgba(255,255,255,0.06)',
                          color: booked ? accent : 'rgba(255,255,255,0.35)',
                          border: booked ? `1px solid ${accent}55` : '1px dashed rgba(255,255,255,0.14)',
                        }}
                      >
                        {booked ? '' : '+'}
                      </span>
                    </Tap>
                  )
                })}
              </Fragment>
            ))}
          </div>
        </GlassCard>
      </div>
    </DarkScreenShell>
  )
}

function ProphyTreatment({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [ticked, setTicked] = useScreenState<Array<number>>(
    'prophy.ticked',
    [2],
  )
  const pct = Math.round((ticked.length / 3) * 100)
  return (
    <DarkScreenShell bg={PROPHY_BG}>
      <DarkStatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <Tap
          ripple={accent}
          press={false}
          label="Back to chart"
          onTap={() => go(1)}
          className="mb-1.5 !w-auto"
        >
          <span className="flex items-center gap-0.5 text-[9px] font-bold" style={{ color: accent }}>
            <ChevronRight className="size-2.5 rotate-180" strokeWidth={3} />
            Chart
          </span>
        </Tap>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-extrabold text-white">Treatment Plan</p>
            <p className="text-[8.5px] text-white/45">Emma Wilkins</p>
          </div>
          <ProgressRing pct={pct} tone={accent} />
        </div>
        <div className="mt-3 space-y-1.5">
          {['Crown · tooth #14', 'Filling · tooth #19', 'Cleaning'].map((t, i) => (
            <Tap
              key={t}
              ripple={accent}
              label={`Mark ${t} complete`}
              onTap={() =>
                setTicked((cur) =>
                  cur.includes(i) ? cur.filter((n) => n !== i) : [...cur, i],
                )
              }
            >
              <GlassCard className="flex items-center justify-between px-2.5 py-1.5">
                <span className="text-[8.5px] font-semibold text-white">{t}</span>
                <span
                  className="flex size-4 items-center justify-center rounded-full transition-colors"
                  style={{
                    background: ticked.includes(i) ? accent : 'transparent',
                    border: ticked.includes(i) ? 'none' : '1.5px solid rgba(255,255,255,0.25)',
                  }}
                >
                  {ticked.includes(i) && <Check className="size-2.5 text-white" strokeWidth={3} />}
                </span>
              </GlassCard>
            </Tap>
          ))}
        </div>
      </div>
    </DarkScreenShell>
  )
}

/* ============================= LEADR =============================
 * Reference: Leadr (image 5): the moodboard's actual "Pipeline" screen is
 * a dashboard, not a bare kanban: a greeting header, a big gradient hero
 * card (pipeline value + a 4-number stat row), a horizontal run of stage
 * cards, an "Upcoming Follow-ups" list, and a floating "+" tab bar. That
 * composition is rebuilt here rather than the flatter 3-column kanban this
 * file used to have. Green accent (#16A34A) kept; the reference's own
 * purple/indigo gradients are swapped for our green throughout, layered
 * green-on-green (a lighter mint-to-green sweep) so the hero still reads
 * as a genuine gradient moment rather than a flat fill.
 */

const LEADR_BG = '#0A0916'
const LEADR_SURFACE = 'rgba(255,255,255,0.045)'
const LEADR_BORDER = 'rgba(255,255,255,0.08)'

/** initials-avatar + name/subline row, reused on Pipeline and Lead Detail */
function LeadRow({
  name,
  sub,
  tone,
  right,
  onTap,
}: {
  name: string
  sub: string
  tone: string
  right?: ReactNode
  onTap?: () => void
}) {
  return (
    <Tap ripple={tone} label={`Open ${name}`} onTap={onTap}>
      <span
        className="flex items-center gap-2 rounded-xl px-2.5 py-2"
        style={{ background: LEADR_SURFACE, border: `1px solid ${LEADR_BORDER}` }}
      >
        <Avatar name={name} tone={tone} size={24} fontSize={8} />
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-[8.5px] font-bold text-white">{name}</span>
          <span className="block truncate text-[7px] text-white/45">{sub}</span>
        </span>
        {right}
      </span>
    </Tap>
  )
}

/** the floating-FAB pill nav every Leadr screen shares */
/**
 * The Leadr tab bar. `active`/`onNav` speak the tab bar's own 0-4 index
 * space (Home, Leads, FAB-slot, Tasks, Insights); screen components map
 * that back to their own 4-screen index space themselves, since which tab
 * "is home" for a given screen isn't the tab bar's business.
 */
function LeadrBottomNav({ active, accent, onNav }: { active: number; accent: string; onNav: (tab: number) => void }) {
  const items = [
    { Ico: Home, label: 'Home' },
    { Ico: Users, label: 'Leads' },
    null,
    { Ico: ClipboardList, label: 'Tasks' },
    { Ico: TrendingUp, label: 'Insights' },
  ]
  return (
    <div className="flex items-center justify-between px-3.5 pb-3.5 pt-1.5">
      {items.map((it, i) =>
        it === null ? (
          <Tap key="fab" ripple="#ffffff" label="New lead" className="!w-auto" onTap={() => onNav(2)}>
            <span
              className="flex size-8 items-center justify-center rounded-full text-white shadow-[0_4px_14px_-2px_rgba(22,163,74,0.6)]"
              style={{ background: accent }}
            >
              <Plus className="size-4" strokeWidth={2.5} />
            </span>
          </Tap>
        ) : (
          <Tap key={it.label} ripple={accent} label={it.label} className="!w-auto" onTap={() => onNav(i)}>
            <span className="flex flex-col items-center gap-0.5 px-1">
              <it.Ico
                className="size-3.5"
                strokeWidth={2.2}
                style={{ color: i === active ? accent : 'rgba(255,255,255,0.4)' }}
              />
              <span
                className="text-[5.5px] font-bold"
                style={{ color: i === active ? accent : 'rgba(255,255,255,0.4)' }}
              >
                {it.label}
              </span>
            </span>
          </Tap>
        ),
      )}
    </div>
  )
}

/** tab-bar tab index (Home/Leads/FAB/Tasks/Insights) → this file's 4-screen index */
function leadrTabToScreen(tab: number) {
  if (tab === 3) return 2 // Tasks -> Follow-Up Reminders
  if (tab === 4) return 3 // Insights -> CRM Analytics
  return 0 // Home, Leads, and the FAB all land on Pipeline
}

const leadsFor = (accent: string) => [
  { name: 'Sarah Mitchell', company: 'Acme HVAC', value: '$18,500', stage: 'Qualified', tone: accent },
  { name: 'James Carter', company: 'Northstar Plumbing', value: '$9,800', stage: 'Proposal', tone: '#F08A24' },
  { name: 'Maya Chen', company: 'Evergreen Services', value: '$24,200', stage: 'Negotiation', tone: '#9aa0ac' },
  { name: 'Daniel Osei', company: 'BrightCore Ltd.', value: '$6,400', stage: 'New Lead', tone: accent },
]

function LeadrPipeline({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const stages = [
    { label: 'New Leads', count: 18, tone: '#9aa0ac' },
    { label: 'Qualified', count: 12, tone: accent },
    { label: 'Proposal', count: 7, tone: '#F08A24' },
    { label: 'Won', count: 4, tone: '#34D399' },
  ]
  return (
    <DarkScreenShell bg={LEADR_BG}>
      <DarkStatusBar accent={accent} />
      <div className="flex-1 overflow-hidden px-3.5 pb-2">
        {/* greeting header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-white">Good morning, Alex</p>
            <p className="text-[7px] text-white/45">Let's close some deals today.</p>
          </div>
          <Avatar name="Alex Rivera" tone={accent} size={24} fontSize={8} />
        </div>

        {/* gradient hero: pipeline value + 4-up stat row */}
        <Tap ripple="#ffffff" label="View pipeline value details" onTap={() => go(3)} className="mt-2.5">
          <span
            className="block rounded-2xl p-3"
            style={{ background: `linear-gradient(135deg, ${accent}, #0f5c28 85%)` }}
          >
            <span className="flex items-center justify-between">
              <span className="text-[6.5px] font-bold uppercase tracking-wide text-white/75">Pipeline Value</span>
              <TrendingUp className="size-3 text-white/80" strokeWidth={2.2} />
            </span>
            <span className="mt-0.5 block text-[15px] font-black text-white">$184.2K</span>
            <span className="mt-2 flex items-stretch border-t border-white/20 pt-1.5">
              {stages.map((s, i) => (
                <span
                  key={s.label}
                  className="flex-1 text-center"
                  style={{ borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.2)' : undefined }}
                >
                  <span className="block text-[9px] font-extrabold text-white">{s.count}</span>
                  <span className="block text-[5.5px] font-semibold text-white/70">{s.label}</span>
                </span>
              ))}
            </span>
          </span>
        </Tap>

        {/* leads list */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[8px] font-bold text-white">Pipeline</p>
          <Tap ripple={accent} label="View all leads" className="!w-auto" onTap={() => go(0)}>
            <span className="flex items-center gap-0.5 text-[6.5px] font-bold" style={{ color: accent }}>
              View All <ArrowUpRight className="size-2" strokeWidth={2.4} />
            </span>
          </Tap>
        </div>
        <div className="mt-1.5 space-y-1.5">
          {leadsFor(accent).map((l) => (
            <LeadRow
              key={l.name}
              name={l.name}
              sub={`${l.company} · ${l.value}`}
              tone={l.tone}
              onTap={() => go(1)}
              right={
                <span
                  className="shrink-0 rounded-md px-1.5 py-0.5 text-[6.5px] font-bold"
                  style={{ background: `${l.tone}26`, color: l.tone }}
                >
                  {l.stage}
                </span>
              }
            />
          ))}
        </div>
      </div>
      <LeadrBottomNav active={0} accent={accent} onNav={(tab) => go(leadrTabToScreen(tab))} />
    </DarkScreenShell>
  )
}

function LeadrDetail({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [log, setLog] = useScreenState<Array<string>>('leadr.log', [])
  const [logged, setLogged] = useScreenState('leadr.logged', false)
  const [tab, setTab] = useChoice('leadr.detailTab', 0)
  const lead = leadsFor(accent)[0]
  const stages = ['New', 'Contacted', 'Proposal', 'Won']
  const tabs = ['Overview', 'Activity', 'Notes']

  return (
    <DarkScreenShell bg={LEADR_BG}>
      <DarkStatusBar accent={accent} />
      <div className="flex-1 overflow-hidden px-3.5 pb-3">
        <Tap ripple={accent} press={false} label="Back to pipeline" onTap={() => go(0)} className="!w-auto">
          <span className="flex items-center gap-0.5 text-[8px] font-bold" style={{ color: accent }}>
            <ChevronRight className="size-2.5 rotate-180" strokeWidth={3} />
            Pipeline
          </span>
        </Tap>

        <div className="mt-2 flex items-center gap-2.5">
          <Avatar name={lead.name} tone={accent} size={32} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-extrabold text-white">{lead.name}</p>
            <p className="truncate text-[7.5px] text-white/45">
              {lead.company} · {lead.value} opportunity
            </p>
          </div>
          <span
            className="shrink-0 rounded-full px-1.5 py-0.5 text-[6px] font-bold"
            style={{ background: `${lead.tone}26`, color: lead.tone }}
          >
            {lead.stage}
          </span>
        </div>

        <div className="mt-3">
          <Stepper stages={stages} activeIndex={2} accent={accent} />
        </div>

        {/* tabs */}
        <div className="mt-3 flex gap-1 border-b border-white/10">
          {tabs.map((t, i) => (
            <Tap key={t} press={false} ripple={accent} label={t} className="!w-auto" onTap={() => setTab(i)}>
              <span
                className="block px-1.5 pb-1.5 text-[7px] font-bold"
                style={{
                  color: tab === i ? accent : 'rgba(255,255,255,0.4)',
                  borderBottom: tab === i ? `2px solid ${accent}` : '2px solid transparent',
                }}
              >
                {t}
              </span>
            </Tap>
          ))}
        </div>

        {tab === 0 && (
          <div className="mt-3 space-y-2.5">
            <div className="flex gap-1.5">
              {[
                { Ico: Phone, note: 'Called Sarah', label: `Call ${lead.name}` },
                { Ico: Video, note: 'Video call with Sarah', label: `Video call ${lead.name}` },
                { Ico: Mail, note: 'Emailed Sarah', label: `Email ${lead.name}` },
              ].map(({ Ico, note, label }) => (
                <Tap
                  key={label}
                  ripple={accent}
                  label={label}
                  className="!w-auto"
                  onTap={() => setLog((cur) => [note, ...cur])}
                >
                  <span
                    className="flex size-7 items-center justify-center rounded-lg"
                    style={{ background: `${accent}18`, color: accent }}
                  >
                    <Ico className="size-3.5" strokeWidth={2} />
                  </span>
                </Tap>
              ))}
            </div>
            <div className="rounded-xl p-2.5" style={{ background: LEADR_SURFACE, border: `1px solid ${LEADR_BORDER}` }}>
              <p className="text-[6.5px] font-bold uppercase tracking-wide text-white/40">Next Follow-up</p>
              <p className="mt-1 text-[8.5px] font-bold text-white">Send proposal follow-up</p>
              <p className="text-[7px] text-white/45">Due Today, 11:00 AM</p>
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className="mt-3 space-y-1.5">
            {[...log, 'Called, left voicemail', 'Sent proposal via email', 'Meeting booked for Thu'].map((t) => (
              <div key={t} className="flex items-start gap-1.5">
                <span className="mt-1 size-1 shrink-0 rounded-full" style={{ background: accent }} />
                <span className="text-[8px] leading-relaxed text-white/60">{t}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 2 && (
          <div className="mt-3 rounded-xl p-2.5" style={{ background: LEADR_SURFACE, border: `1px solid ${LEADR_BORDER}` }}>
            <p className="text-[7.5px] leading-relaxed text-white/60">
              Budget confirmed with finance. Wants rollout before end of quarter; prioritise the proposal follow-up.
            </p>
          </div>
        )}
      </div>
      <div className="px-3.5 pb-4">
        <Tap
          ripple="#ffffff"
          label="Log follow-up"
          onTap={() => {
            setLogged(true)
            window.setTimeout(() => go(2), 700)
          }}
        >
          <span
            className="block rounded-xl py-2.5 text-center text-[10.5px] font-bold text-white transition-colors"
            style={{ background: logged ? '#1F9D55' : accent }}
          >
            {logged ? 'Follow-up logged ✓' : 'Log Follow-Up'}
          </span>
        </Tap>
      </div>
    </DarkScreenShell>
  )
}

function LeadrReminders({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [done, setDone] = useScreenState<Array<string>>('leadr.tasksDone', [])
  const tasks = [
    { t: '09:00', name: 'Call Sarah Mitchell', sub: 'Acme HVAC · Qualified', Ico: Phone },
    { t: '10:30', name: 'Follow up with James Carter', sub: 'Northstar Plumbing · Proposal', Ico: Mail },
    { t: '13:00', name: 'Send proposal to Maya Chen', sub: 'Evergreen Services · Negotiation', Ico: ClipboardList },
    { t: '15:30', name: 'Review new leads', sub: '4 leads awaiting first contact', Ico: Users },
  ]
  const doneCount = done.length

  return (
    <DarkScreenShell bg={LEADR_BG}>
      <DarkStatusBar accent={accent} />
      <div className="flex-1 overflow-hidden px-3.5 pb-2">
        <Tap ripple={accent} press={false} label="Back to pipeline" onTap={() => go(0)} className="!w-auto">
          <span className="flex items-center gap-0.5 text-[8px] font-bold" style={{ color: accent }}>
            <ChevronRight className="size-2.5 rotate-180" strokeWidth={3} />
            Pipeline
          </span>
        </Tap>
        <div className="mt-1.5 flex items-center justify-between">
          <p className="text-[11px] font-extrabold text-white">Today's Activity</p>
          <span className="text-[7px] font-bold text-white/45">
            {doneCount}/{tasks.length} done
          </span>
        </div>

        <div className="mt-2.5 space-y-2">
          {tasks.map((task, i) => {
            const isDone = done.includes(task.name)
            return (
              <Tap
                key={task.name}
                ripple={accent}
                label={`${isDone ? 'Mark incomplete' : 'Mark complete'}: ${task.name}`}
                onTap={() =>
                  setDone((cur) => (cur.includes(task.name) ? cur.filter((n) => n !== task.name) : [...cur, task.name]))
                }
              >
                <span className="flex items-start gap-2">
                  <span className="flex w-9 shrink-0 flex-col items-center pt-1.5">
                    <span className="text-[6.5px] font-bold text-white/40">{task.t}</span>
                    {i < tasks.length - 1 && <span className="mt-1 w-px flex-1 bg-white/10" />}
                  </span>
                  <span
                    className="flex flex-1 items-center gap-2 rounded-xl px-2.5 py-2 transition-colors"
                    style={{
                      background: isDone ? `${accent}14` : LEADR_SURFACE,
                      border: `1px solid ${isDone ? `${accent}40` : LEADR_BORDER}`,
                    }}
                  >
                    <span
                      className="flex size-6 shrink-0 items-center justify-center rounded-lg transition-colors"
                      style={{ background: isDone ? accent : `${accent}18`, color: isDone ? 'white' : accent }}
                    >
                      {isDone ? <Check className="size-3" strokeWidth={2.6} /> : <task.Ico className="size-3" strokeWidth={2} />}
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span
                        className="block truncate text-[8px] font-bold"
                        style={{
                          color: isDone ? 'rgba(255,255,255,0.5)' : 'white',
                          textDecoration: isDone ? 'line-through' : 'none',
                        }}
                      >
                        {task.name}
                      </span>
                      <span className="block truncate text-[6.5px] text-white/40">{task.sub}</span>
                    </span>
                  </span>
                </span>
              </Tap>
            )
          })}
        </div>
      </div>
      <LeadrBottomNav active={3} accent={accent} onNav={(tab) => go(leadrTabToScreen(tab))} />
    </DarkScreenShell>
  )
}

function LeadrDigest({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [day, setDay] = useChoice('leadr.day', 5)
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const bars = [40, 65, 30, 90, 55, 82, 45]
  return (
    <DarkScreenShell bg={LEADR_BG}>
      <DarkStatusBar accent={accent} />
      <div className="flex-1 overflow-hidden px-3.5 pb-2">
        <Tap ripple={accent} press={false} label="Back to pipeline" onTap={() => go(0)} className="!w-auto">
          <span className="flex items-center gap-0.5 text-[8px] font-bold" style={{ color: accent }}>
            <ChevronRight className="size-2.5 rotate-180" strokeWidth={3} />
            Pipeline
          </span>
        </Tap>
        <p className="mt-1.5 text-[11px] font-extrabold text-white">CRM Analytics</p>

        {/* headline metric */}
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="text-[6.5px] font-bold uppercase tracking-wide text-white/40">Pipeline Value</p>
            <p className="text-[16px] font-black text-white">$184.2K</p>
          </div>
          <span
            className="mb-0.5 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[6.5px] font-bold"
            style={{ background: 'rgba(52,211,153,0.16)', color: '#34D399' }}
          >
            <TrendingUp className="size-2" strokeWidth={2.6} />
            +18.4%
          </span>
        </div>

        {/* minimal 7-day bar chart, tappable */}
        <div className="mt-3 flex h-14 items-end justify-between gap-1.5 rounded-xl px-2 py-2" style={{ background: LEADR_SURFACE }}>
          {bars.map((h, i) => (
            <Tap
              key={i}
              press={false}
              ripple={accent}
              label={`Show ${days[i]}`}
              onTap={() => setDay(i)}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1"
            >
              <span
                className="block w-full rounded-full transition-colors"
                style={{ height: `${h}%`, background: day === i ? accent : 'rgba(255,255,255,0.14)' }}
              />
              <span
                className="text-[5.5px] font-bold"
                style={{ color: day === i ? accent : 'rgba(255,255,255,0.35)' }}
              >
                {days[i]}
              </span>
            </Tap>
          ))}
        </div>

        {/* 3-up metric row */}
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {[
            { l: 'Won', v: '$64.8K', tone: '#34D399' },
            { l: 'Conversion', v: '32.6%', tone: accent },
            { l: 'New leads', v: '48', tone: '#9aa0ac' },
          ].map((s) => (
            <span
              key={s.l}
              className="block rounded-xl p-2 text-center"
              style={{ background: LEADR_SURFACE, border: `1px solid ${LEADR_BORDER}` }}
            >
              <span className="block text-[10px] font-extrabold" style={{ color: s.tone }}>
                {s.v}
              </span>
              <span className="block text-[6px] font-semibold text-white/45">{s.l}</span>
            </span>
          ))}
        </div>

        {/* upcoming follow-ups */}
        <div className="mt-3 space-y-1.5">
          <p className="text-[6.5px] font-bold uppercase tracking-wide text-white/40">Upcoming Follow-ups</p>
          {[
            { name: 'Follow up with Sarah Mitchell', t: 'Today, 11:00 AM', Ico: Phone },
            { name: 'Demo with Northstar Plumbing', t: 'Today, 2:30 PM', Ico: Video },
          ].map((f) => (
            <div key={f.name} className="flex items-center gap-2 rounded-lg px-2 py-1.5" style={{ background: LEADR_SURFACE }}>
              <span
                className="flex size-5 shrink-0 items-center justify-center rounded-md"
                style={{ background: `${accent}22`, color: accent }}
              >
                <f.Ico className="size-2.5" strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-[7px] font-semibold text-white">{f.name}</span>
                <span className="block text-[6px] text-white/40">{f.t}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <LeadrBottomNav active={4} accent={accent} onNav={(tab) => go(leadrTabToScreen(tab))} />
    </DarkScreenShell>
  )
}

/* ============================= REGISTRY ============================= */

type ScreenComponent = (props: { accent: string }) => ReactNode

export const CONCEPT_SCREENS: Record<string, ScreenComponent[]> = {
  fieldly: [FieldlyDispatch, FieldlyQuote, FieldlyPhotos, FieldlySchedule],
  // ordered to match concepts.ts's screen names: Stamp Card, Rewards Wallet,
  // Nearby Offers, Redeem at Till
  stamp: [StampPunchCard, StampWallet, StampOffers, StampCatalog],
  slate: [SlateBooking, SlateConfirmed, SlateAppointments, SlateSchedule],
  prophy: [ProphyRecall, ProphyChart, ProphyDaySchedule, ProphyTreatment],
  leadr: [LeadrPipeline, LeadrDetail, LeadrReminders, LeadrDigest],
}
