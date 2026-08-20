import { useState } from 'react'
import { motion } from 'motion/react'
import { Bell, CalendarDays, ClipboardList, Home as HomeIcon, User, Wrench, Zap, Droplet } from 'lucide-react'
import { Tap } from '../lib/phoneUI'

/**
 * The home page's own phone screen, a light, MegaCloudWorks-branded mobile
 * home screen, not one of the five work concepts. It used to reuse Fieldly's
 * real dispatch board (dark, indigo, built to match Flux's moodboard
 * reference), which meant the splash-to-live crossfade jumped from a light
 * loading screen straight into someone else's product and a dark theme.
 * This is its own thing: bright, restrained, red only where it earns it.
 */

function useClock() {
  const [now] = useState(() => new Date())
  const h = now.getHours() % 12 || 12
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

const JOBS = [
  { time: '9:30', title: 'HVAC inspection', client: 'Acme Services', status: 'Sched.', tone: '#f5333b', Icon: Zap },
  { time: '11:00', title: 'Boiler maintenance', client: 'Northstar Plumbing', status: 'Active', tone: '#2563EB', Icon: Droplet },
  { time: '14:30', title: 'Site visit', client: 'Evergreen', status: 'Later', tone: '#63646a', Icon: Wrench },
]

const NAV = [
  { label: 'Home', Icon: HomeIcon },
  { label: 'Schedule', Icon: CalendarDays },
  { label: 'Jobs', Icon: ClipboardList },
  { label: 'Profile', Icon: User },
]

export function HomeHeroScreen() {
  const time = useClock()
  const [tab, setTab] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const brand = '#f5333b'

  return (
    <div className="flex h-full flex-col overflow-hidden text-[#101014]" style={{ background: '#FAFAF9' }}>
      {/* status bar */}
      <div className="flex shrink-0 items-center justify-between px-3.5 pb-0.5 pt-9">
        <span className="text-[8px] font-bold text-[#63646a]">{time}</span>
        <span className="size-1.5 rounded-full" style={{ background: brand }} />
      </div>

      {/* header */}
      <div className="flex shrink-0 items-center justify-between px-3.5 pt-1">
        <div className="min-w-0">
          <p className="truncate text-[6.5px] font-semibold leading-none text-[#8a8b91]">Good morning</p>
          <p className="mt-0.5 truncate text-[10.5px] font-extrabold leading-none text-[#101014]">Marcus</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Tap press={false} ripple={brand} label="Notifications" className="!w-auto">
            <span className="relative flex size-5 items-center justify-center rounded-full" style={{ background: '#F2F2F0' }}>
              <Bell className="size-2.5 text-[#56575f]" strokeWidth={2} />
              <span className="absolute right-0.5 top-0.5 size-1 rounded-full ring-2 ring-[#FAFAF9]" style={{ background: brand }} />
            </span>
          </Tap>
          <span
            className="flex size-5 items-center justify-center rounded-full text-[7px] font-bold text-white"
            style={{ background: 'linear-gradient(145deg, #ff6a3d, #f5333b)' }}
          >
            M
          </span>
        </div>
      </div>

      {/* hero overview card */}
      <div className="shrink-0 px-3.5 pt-1.5">
        <div
          className="relative overflow-hidden rounded-xl px-2.5 py-2"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fdfcfc 100%)',
            border: '1px solid rgba(16,16,20,0.06)',
            boxShadow: '0 1px 2px rgba(16,16,20,0.04), 0 8px 20px -12px rgba(16,16,20,0.1)',
          }}
        >
          <div
            className="pointer-events-none absolute -right-5 -top-6 size-16 rounded-full opacity-[0.07]"
            style={{ background: brand }}
          />
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
              <p className="whitespace-nowrap text-[13px] font-extrabold leading-none" style={{ color: brand }}>$2,340</p>
            </div>
          </div>
        </div>
      </div>

      {/* quick stats */}
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

      {/* schedule list */}
      <div className="mt-1.5 min-h-0 flex-1 overflow-hidden px-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-[7px] font-extrabold text-[#101014]">Today&rsquo;s schedule</p>
          <span className="shrink-0 text-[6px] font-semibold text-[#a3a4aa]">3 jobs</span>
        </div>
        <div className="mt-1 space-y-1">
          {JOBS.map((j, i) => (
            <Tap
              key={j.title}
              ripple={j.tone}
              label={`${j.title} at ${j.time}`}
              onTap={() => setSelected((cur) => (cur === i ? null : i))}
            >
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
                <span
                  className="shrink-0 whitespace-nowrap rounded-full px-1 py-0.5 text-[5.5px] font-bold"
                  style={{ background: `${j.tone}1A`, color: j.tone }}
                >
                  {j.status}
                </span>
              </span>
            </Tap>
          ))}
        </div>
      </div>

      {/* weekly progress */}
      <div className="mx-3.5 mt-1.5 shrink-0 rounded-lg px-2 py-1.5" style={{ background: '#F4F4F2' }}>
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-[6px] font-bold text-[#101014]">Weekly progress</p>
          <p className="shrink-0 text-[6px] font-extrabold" style={{ color: brand }}>82%</p>
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded-full" style={{ background: 'rgba(16,16,20,0.08)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, #ff6a3d, ${brand})` }}
            initial={{ width: '0%' }}
            animate={{ width: '82%' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </div>
      </div>

      {/* bottom nav */}
      <div className="mt-1.5 flex shrink-0 items-stretch justify-around px-1 pb-3 pt-1" style={{ borderTop: '1px solid rgba(16,16,20,0.06)' }}>
        {NAV.map((n, i) => (
          <Tap key={n.label} press={false} ripple={brand} label={n.label} onTap={() => setTab(i)} className="!w-auto flex-1">
            <span className="flex flex-col items-center gap-0.5 py-0.5">
              <n.Icon
                className="size-3"
                strokeWidth={tab === i ? 2.4 : 2}
                style={{ color: tab === i ? brand : '#a3a4aa' }}
              />
              <span
                className="text-[5.5px] font-bold"
                style={{ color: tab === i ? brand : '#a3a4aa' }}
              >
                {n.label}
              </span>
              <span
                className="mt-0.5 h-0.5 w-2.5 rounded-full transition-opacity"
                style={{ background: brand, opacity: tab === i ? 1 : 0 }}
              />
            </span>
          </Tap>
        ))}
      </div>
    </div>
  )
}
