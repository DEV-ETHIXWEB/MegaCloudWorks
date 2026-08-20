import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Bell,
  CalendarDays,
  ClipboardList,
  Home as HomeIcon,
  User,
  Wrench,
  Zap,
  Droplet,
  ChevronRight,
  Phone,
  Mail,
  Star,
  LogOut,
} from 'lucide-react'
import { Tap, usePhoneNav } from '../lib/phoneUI'

/**
 * The home page's own phone screens: a light, MegaCloudWorks-branded
 * mobile app, not one of the five work concepts. Four real screens behind
 * the bottom nav (Home / Schedule / Jobs / Profile) — it used to be one
 * screen with a nav bar that only recolored itself on tap, which meant
 * every button on the phone was decorative. Now the tabs actually
 * navigate, same PhoneNavProvider/Tap plumbing the work concepts use, and
 * an autoplay loop cycles through all four when nobody's driving (see
 * AppLaunchPhoneLive.tsx).
 */

const BRAND = '#f5333b'

function useClock() {
  const [now] = useState(() => new Date())
  const h = now.getHours() % 12 || 12
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

const JOBS = [
  { time: '9:30', title: 'HVAC inspection', client: 'Acme Services', status: 'Sched.', tone: BRAND, Icon: Zap },
  { time: '11:00', title: 'Boiler maintenance', client: 'Northstar Plumbing', status: 'Active', tone: '#2563EB', Icon: Droplet },
  { time: '14:30', title: 'Site visit', client: 'Evergreen', status: 'Later', tone: '#63646a', Icon: Wrench },
]

const ALL_JOBS = [
  ...JOBS,
  { time: '16:00', title: 'Panel upgrade', client: 'Riverside Co.', status: 'Sched.', tone: BRAND, Icon: Zap },
  { time: 'Tomorrow', title: 'Leak inspection', client: 'Maple Diner', status: 'Later', tone: '#63646a', Icon: Droplet },
]

const NAV = [
  { label: 'Home', Icon: HomeIcon },
  { label: 'Schedule', Icon: CalendarDays },
  { label: 'Jobs', Icon: ClipboardList },
  { label: 'Profile', Icon: User },
]

function StatusBar({ time }: { time: string }) {
  return (
    <div className="flex shrink-0 items-center justify-between px-3.5 pb-0.5 pt-9">
      <span className="text-[8px] font-bold text-[#63646a]">{time}</span>
      <span className="size-1.5 rounded-full" style={{ background: BRAND }} />
    </div>
  )
}

function BottomNav({ active }: { active: number }) {
  const { go } = usePhoneNav()
  return (
    <div className="mt-1.5 flex shrink-0 items-stretch justify-around px-1 pb-3 pt-1" style={{ borderTop: '1px solid rgba(16,16,20,0.06)' }}>
      {NAV.map((n, i) => (
        <Tap key={n.label} press={false} ripple={BRAND} label={n.label} onTap={() => go(i)} className="!w-auto flex-1">
          <span className="flex flex-col items-center gap-0.5 py-0.5">
            <n.Icon className="size-3" strokeWidth={active === i ? 2.4 : 2} style={{ color: active === i ? BRAND : '#a3a4aa' }} />
            <span className="text-[5.5px] font-bold" style={{ color: active === i ? BRAND : '#a3a4aa' }}>
              {n.label}
            </span>
            <span className="mt-0.5 h-0.5 w-2.5 rounded-full transition-opacity" style={{ background: BRAND, opacity: active === i ? 1 : 0 }} />
          </span>
        </Tap>
      ))}
    </div>
  )
}

function Shell({ children, active }: { children: React.ReactNode; active: number }) {
  const time = useClock()
  return (
    <div className="flex h-full flex-col overflow-hidden text-[#101014]" style={{ background: '#FAFAF9' }}>
      <StatusBar time={time} />
      {children}
      <BottomNav active={active} />
    </div>
  )
}

export function HomeHeroHome() {
  const { go } = usePhoneNav()
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <Shell active={0}>
      <div className="flex shrink-0 items-center justify-between px-3.5 pt-1">
        <div className="min-w-0">
          <p className="truncate text-[6.5px] font-semibold leading-none text-[#8a8b91]">Good morning</p>
          <p className="mt-0.5 truncate text-[10.5px] font-extrabold leading-none text-[#101014]">Marcus</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Tap press={false} ripple={BRAND} label="Notifications" className="!w-auto">
            <span className="relative flex size-5 items-center justify-center rounded-full" style={{ background: '#F2F2F0' }}>
              <Bell className="size-2.5 text-[#56575f]" strokeWidth={2} />
              <span className="absolute right-0.5 top-0.5 size-1 rounded-full ring-2 ring-[#FAFAF9]" style={{ background: BRAND }} />
            </span>
          </Tap>
          <span className="flex size-5 items-center justify-center rounded-full text-[7px] font-bold text-white" style={{ background: 'linear-gradient(145deg, #ff6a3d, #f5333b)' }}>
            M
          </span>
        </div>
      </div>

      <div className="shrink-0 px-3.5 pt-1.5">
        <div className="relative overflow-hidden rounded-xl px-2.5 py-2" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fdfcfc 100%)', border: '1px solid rgba(16,16,20,0.06)', boxShadow: '0 1px 2px rgba(16,16,20,0.04), 0 8px 20px -12px rgba(16,16,20,0.1)' }}>
          <div className="pointer-events-none absolute -right-5 -top-6 size-16 rounded-full opacity-[0.07]" style={{ background: BRAND }} />
          <div className="relative flex items-center justify-between gap-1.5">
            <p className="min-w-0 truncate text-[6px] font-bold uppercase tracking-wide text-[#8a8b91]">Overview</p>
            <span className="inline-flex shrink-0 items-center rounded-full px-1 py-px text-[5.5px] font-bold" style={{ background: 'rgba(31,157,85,0.12)', color: '#1F9D55' }}>
              +12.4%
            </span>
          </div>
          <div className="relative mt-1 flex items-end justify-between gap-2">
            <div className="min-w-0 shrink-0">
              <p className="whitespace-nowrap text-[6px] font-semibold text-[#a3a4aa]">Active jobs</p>
              <p className="text-[13px] font-extrabold leading-none text-[#101014]">4</p>
            </div>
            <div className="min-w-0 shrink-0 border-l border-[rgba(16,16,20,0.08)] pl-2 text-right">
              <p className="whitespace-nowrap text-[6px] font-semibold text-[#a3a4aa]">Est. revenue</p>
              <p className="whitespace-nowrap text-[13px] font-extrabold leading-none" style={{ color: BRAND }}>$2,340</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-1.5 grid shrink-0 grid-cols-2 gap-1.5 px-3.5">
        <div className="flex items-center justify-between rounded-lg px-2 py-1" style={{ background: '#F4F4F2' }}>
          <span className="truncate text-[6px] font-bold uppercase tracking-wide text-[#a3a4aa]">Done</span>
          <span className="shrink-0 text-[9px] font-extrabold leading-none text-[#101014]">12</span>
        </div>
        <div className="flex items-center justify-between rounded-lg px-2 py-1" style={{ background: '#F4F4F2' }}>
          <span className="truncate text-[6px] font-bold uppercase tracking-wide text-[#a3a4aa]">Pending</span>
          <span className="shrink-0 text-[9px] font-extrabold leading-none text-[#101014]">03</span>
        </div>
      </div>

      <div className="mt-1.5 min-h-0 flex-1 overflow-hidden px-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-[7px] font-extrabold text-[#101014]">Today&rsquo;s schedule</p>
          <Tap press={false} ripple={BRAND} label="See full schedule" onTap={() => go(1)} className="!w-auto">
            <span className="shrink-0 text-[6px] font-bold" style={{ color: BRAND }}>See all</span>
          </Tap>
        </div>
        <div className="mt-1 space-y-1">
          {JOBS.map((j, i) => (
            <Tap key={j.title} ripple={j.tone} label={`${j.title} at ${j.time}`} onTap={() => setSelected((cur) => (cur === i ? null : i))}>
              <span
                className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 transition-colors"
                style={{
                  background: selected === i ? '#FFFFFF' : 'transparent',
                  border: `1px solid ${selected === i ? j.tone + '33' : 'rgba(16,16,20,0.06)'}`,
                  boxShadow: selected === i ? '0 4px 10px -6px rgba(16,16,20,0.12)' : undefined,
                }}
              >
                <span className="flex size-4.5 shrink-0 items-center justify-center rounded-md" style={{ background: `${j.tone}1A`, color: j.tone }}>
                  <j.Icon className="size-2.5" strokeWidth={2.2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[7px] font-bold leading-tight text-[#101014]">{j.title}</span>
                  <span className="block truncate text-[6px] leading-tight text-[#a3a4aa]">{j.time} &middot; {j.client}</span>
                </span>
                <span className="shrink-0 whitespace-nowrap rounded-full px-1 py-0.5 text-[5.5px] font-bold" style={{ background: `${j.tone}1A`, color: j.tone }}>
                  {j.status}
                </span>
              </span>
            </Tap>
          ))}
        </div>
      </div>

      <div className="mx-3.5 mt-1.5 shrink-0 rounded-lg px-2 py-1.5" style={{ background: '#F4F4F2' }}>
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-[6px] font-bold text-[#101014]">Weekly progress</p>
          <p className="shrink-0 text-[6px] font-extrabold" style={{ color: BRAND }}>82%</p>
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded-full" style={{ background: 'rgba(16,16,20,0.08)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, #ff6a3d, ${BRAND})` }}
            initial={{ width: '0%' }}
            animate={{ width: '82%' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </div>
      </div>
    </Shell>
  )
}

export function HomeHeroSchedule() {
  const [day, setDay] = useState(2)
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <Shell active={1}>
      <div className="shrink-0 px-3.5 pt-1.5">
        <p className="text-[10.5px] font-extrabold leading-none text-[#101014]">Schedule</p>
        <div className="mt-2 flex items-center justify-between">
          {days.map((d, i) => (
            <Tap key={i} press={false} ripple={BRAND} label={`Show day ${i + 1}`} onTap={() => setDay(i)} className="!w-auto">
              <span className="flex flex-col items-center gap-1">
                <span className="text-[6px] font-bold text-[#a3a4aa]">{d}</span>
                <span
                  className="flex size-5 items-center justify-center rounded-full text-[7px] font-bold transition-colors"
                  style={day === i ? { background: BRAND, color: 'white' } : { color: '#101014' }}
                >
                  {18 + i}
                </span>
              </span>
            </Tap>
          ))}
        </div>
      </div>

      <div className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-hidden px-3.5">
        {ALL_JOBS.slice(0, 4).map((j) => (
          <div key={j.title} className="flex items-center gap-1.5 rounded-lg border border-[rgba(16,16,20,0.06)] px-1.5 py-1.5">
            <span className="flex w-7 shrink-0 flex-col items-start">
              <span className="whitespace-nowrap text-[7px] font-bold text-[#101014]">{j.time}</span>
            </span>
            <span className="h-6 w-px shrink-0" style={{ background: `${j.tone}55` }} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[7px] font-bold text-[#101014]">{j.title}</span>
              <span className="block truncate text-[6px] text-[#a3a4aa]">{j.client}</span>
            </span>
            <span className="shrink-0 rounded-full px-1 py-0.5 text-[5.5px] font-bold" style={{ background: `${j.tone}1A`, color: j.tone }}>
              {j.status}
            </span>
          </div>
        ))}
      </div>
    </Shell>
  )
}

export function HomeHeroJobs() {
  const [filter, setFilter] = useState<'all' | 'sched' | 'active'>('all')
  const filtered = ALL_JOBS.filter((j) =>
    filter === 'all' ? true : filter === 'sched' ? j.status === 'Sched.' : j.status === 'Active',
  )

  return (
    <Shell active={2}>
      <div className="shrink-0 px-3.5 pt-1.5">
        <p className="text-[10.5px] font-extrabold leading-none text-[#101014]">All jobs</p>
        <div className="mt-2 flex gap-1.5">
          {(['all', 'sched', 'active'] as const).map((f) => (
            <Tap key={f} press={false} ripple={BRAND} label={`Filter ${f}`} onTap={() => setFilter(f)} className="!w-auto">
              <span
                className="block rounded-full px-2 py-1 text-[6px] font-bold capitalize transition-colors"
                style={filter === f ? { background: BRAND, color: 'white' } : { background: '#F2F2F0', color: '#63646a' }}
              >
                {f === 'sched' ? 'Scheduled' : f}
              </span>
            </Tap>
          ))}
        </div>
      </div>

      <div className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-hidden px-3.5">
        {filtered.map((j) => (
          <div key={j.title} className="flex items-center gap-1.5 rounded-lg border border-[rgba(16,16,20,0.06)] px-1.5 py-1">
            <span className="flex size-4.5 shrink-0 items-center justify-center rounded-md" style={{ background: `${j.tone}1A`, color: j.tone }}>
              <j.Icon className="size-2.5" strokeWidth={2.2} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[7px] font-bold text-[#101014]">{j.title}</span>
              <span className="block truncate text-[6px] text-[#a3a4aa]">{j.time} &middot; {j.client}</span>
            </span>
            <ChevronRight className="size-2.5 shrink-0 text-[#c4c5ca]" strokeWidth={2.5} />
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="pt-4 text-center text-[6.5px] font-semibold text-[#a3a4aa]">No jobs in this filter</p>
        )}
      </div>
    </Shell>
  )
}

export function HomeHeroProfile() {
  const rows = [
    { label: 'Call dispatch', Icon: Phone },
    { label: 'Support inbox', Icon: Mail },
    { label: 'Rate this week', Icon: Star },
  ]

  return (
    <Shell active={3}>
      <div className="shrink-0 px-3.5 pt-2 text-center">
        <span
          className="mx-auto flex size-11 items-center justify-center rounded-full text-[13px] font-bold text-white"
          style={{ background: 'linear-gradient(145deg, #ff6a3d, #f5333b)' }}
        >
          M
        </span>
        <p className="mt-1.5 text-[9.5px] font-extrabold leading-none text-[#101014]">Marcus Delgado</p>
        <p className="mt-0.5 text-[6.5px] font-semibold text-[#a3a4aa]">Field technician &middot; 4 years</p>
      </div>

      <div className="mt-2.5 min-h-0 flex-1 space-y-1 overflow-hidden px-3.5">
        {rows.map((r) => (
          <Tap key={r.label} ripple={BRAND} label={r.label}>
            <span className="flex items-center gap-2 rounded-lg border border-[rgba(16,16,20,0.06)] px-2 py-1.5">
              <span className="flex size-4.5 shrink-0 items-center justify-center rounded-md" style={{ background: '#F2F2F0', color: '#56575f' }}>
                <r.Icon className="size-2.5" strokeWidth={2.2} />
              </span>
              <span className="flex-1 truncate text-left text-[7px] font-bold text-[#101014]">{r.label}</span>
              <ChevronRight className="size-2.5 shrink-0 text-[#c4c5ca]" strokeWidth={2.5} />
            </span>
          </Tap>
        ))}
        <Tap ripple="#e5484d" label="Sign out">
          <span className="flex items-center gap-2 rounded-lg px-2 py-1.5">
            <span className="flex size-4.5 shrink-0 items-center justify-center rounded-md" style={{ background: 'rgba(229,72,77,0.1)', color: '#e5484d' }}>
              <LogOut className="size-2.5" strokeWidth={2.2} />
            </span>
            <span className="flex-1 truncate text-left text-[7px] font-bold" style={{ color: '#e5484d' }}>Sign out</span>
          </span>
        </Tap>
      </div>
    </Shell>
  )
}

export const HOME_HERO_SCREENS = [HomeHeroHome, HomeHeroSchedule, HomeHeroJobs, HomeHeroProfile]
