import {
  Camera,
  Gift,
  Bell,
  Phone,
  Mail,
  Check,
  ChevronRight,
} from 'lucide-react'
import { Fragment } from 'react'
import type { ReactNode } from 'react'

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
  return (
    <div className="flex items-center justify-between px-4 pb-2 pt-11">
      <span
        className={`text-[10px] font-bold ${dark ? 'text-white/70' : 'text-[var(--ink-faint)]'}`}
      >
        9:41
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

/* ============================= FIELDLY ============================= */

function FieldlyDispatch({ accent }: { accent: string }) {
  const jobs = [
    { name: '14 Oak Street', tag: 'HVAC', status: 'En Route', tone: accent },
    {
      name: '82 Birch Avenue',
      tag: 'Plumbing',
      status: 'In Progress',
      tone: '#F08A24',
    },
    {
      name: '3 Elm Road',
      tag: 'Electrical',
      status: 'Scheduled',
      tone: '#9aa0ac',
    },
    {
      name: '55 Pine Close',
      tag: 'HVAC',
      status: 'Scheduled',
      tone: '#9aa0ac',
    },
  ]
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 space-y-2 px-3.5 pb-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[13px] font-extrabold text-[var(--ink)]">
            Today&rsquo;s Jobs
          </p>
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
            style={{ background: accent }}
          >
            4 total
          </span>
        </div>
        {jobs.map((j) => (
          <div
            key={j.name}
            className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-white px-2.5 py-2"
          >
            <span
              className="h-6 w-1 shrink-0 rounded-full"
              style={{ background: j.tone }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-bold text-[var(--ink)]">
                {j.name}
              </p>
              <p className="text-[8.5px] text-[var(--ink-faint)]">{j.tag}</p>
            </div>
            <span
              className="shrink-0 rounded-full px-1.5 py-0.5 text-[7.5px] font-bold"
              style={{ background: `${j.tone}22`, color: j.tone }}
            >
              {j.status}
            </span>
          </div>
        ))}
      </div>
      <div className="px-3.5 pb-4">
        <div
          className="flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-[11px] font-bold text-white"
          style={{ background: accent }}
        >
          + New Job
        </div>
      </div>
    </ScreenShell>
  )
}

function FieldlyQuote({ accent }: { accent: string }) {
  const lines = [
    { l: 'Labour (4h × $85)', v: '$340.00' },
    { l: 'Pipe fittings & parts', v: '$120.00' },
    { l: 'Emergency call-out fee', v: '$75.00' },
  ]
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Quote #Q-0847
        </p>
        <p className="text-[8.5px] text-[var(--ink-faint)]">
          Sarah Johnson · 18 Nov 2025
        </p>
        <div className="mt-3 space-y-1.5 rounded-lg border border-[var(--line)] p-2.5">
          {lines.map((row) => (
            <div key={row.l} className="flex items-center justify-between">
              <Bar w="60%" h={6} tone="#eeeef1" />
              <span className="text-[9px] font-semibold text-[var(--ink-soft)]">
                {row.v}
              </span>
            </div>
          ))}
          <div className="mt-1 flex items-center justify-between border-t border-[var(--line)] pt-1.5">
            <span className="text-[9px] font-extrabold text-[var(--ink)]">
              Total
            </span>
            <span className="text-[11px] font-extrabold text-[var(--ink)]">
              $588.50
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-2 px-3.5 pb-4">
        <div
          className="rounded-lg py-2.5 text-center text-[10.5px] font-bold text-white"
          style={{ background: accent }}
        >
          Convert to Invoice
        </div>
        <div className="rounded-lg border border-[var(--line)] py-2 text-center text-[10px] font-semibold text-[var(--ink-soft)]">
          Send to Client
        </div>
      </div>
    </ScreenShell>
  )
}

function FieldlyPhotos({ accent }: { accent: string }) {
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Job #1047 · Photos
        </p>
        <p className="text-[8.5px] text-[var(--ink-faint)]">
          Panel upgrade · Marcus D.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <p className="text-[8px] font-bold uppercase tracking-wide text-[var(--ink-faint)]">
              Before
            </p>
            <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-[var(--line-strong)] bg-[#f4f4f6]">
              <Camera
                className="size-4 text-[var(--ink-faint)]"
                strokeWidth={1.75}
              />
            </div>
          </div>
          <div className="space-y-1">
            <p
              className="text-[8px] font-bold uppercase tracking-wide"
              style={{ color: accent }}
            >
              After
            </p>
            <div
              className="flex aspect-square items-center justify-center rounded-lg"
              style={{ background: `${accent}20` }}
            >
              <Check
                className="size-4"
                style={{ color: accent }}
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-1 rounded-lg bg-[#f4f4f6] p-2">
          <Bar w="90%" h={6} tone="#dcdce0" />
          <Bar w="60%" h={6} tone="#e6e6ea" />
        </div>
      </div>
      <div className="px-3.5 pb-4">
        <div
          className="rounded-lg py-2.5 text-center text-[10.5px] font-bold text-white"
          style={{ background: accent }}
        >
          Mark Complete
        </div>
      </div>
    </ScreenShell>
  )
}

function FieldlySchedule({ accent }: { accent: string }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const rows = [
    { t: '8:00', label: 'HVAC · Oak St', tone: accent },
    { t: '10:30', label: 'Plumbing · Birch Ave', tone: '#eeeef1' },
    { t: '13:00', label: 'Lunch', tone: '#f4f4f6' },
    { t: '14:00', label: 'Electrical · Elm Rd', tone: '#1F9D55' },
    { t: '16:00', label: 'HVAC · Pine Close', tone: '#eeeef1' },
  ]
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">November</p>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[7px] font-bold text-[var(--ink-faint)]">
                {d}
              </span>
              <span
                className="flex size-5 items-center justify-center rounded-full text-[8px] font-bold"
                style={
                  i === 2
                    ? { background: accent, color: 'white' }
                    : { color: 'var(--ink-soft)' }
                }
              >
                {18 + i}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {rows.map((r) => (
            <div key={r.t} className="flex items-center gap-2">
              <span className="w-7 shrink-0 text-[8px] font-bold text-[var(--ink-faint)]">
                {r.t}
              </span>
              <div
                className="h-5 flex-1 rounded"
                style={{
                  background:
                    r.tone === accent || r.tone === '#1F9D55' ? r.tone : r.tone,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  )
}

/* ============================= STAMP ============================= */

function StampWallet({ accent }: { accent: string }) {
  return (
    <ScreenShell bg="#FBF4EA">
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Good morning, Jamie
        </p>
        <div
          className="mt-3 rounded-xl p-3 text-white"
          style={{ background: accent }}
        >
          <p className="text-[8.5px] font-semibold text-white/70">
            Total points
          </p>
          <p className="mt-0.5 text-xl font-extrabold">1,240</p>
          <p className="mt-1 text-[8px] text-white/70">3 rewards available</p>
        </div>
        <div className="mt-3 space-y-2">
          <div className="rounded-lg border border-[#e7d9c2] bg-white px-2.5 py-2">
            <div className="flex items-center justify-between">
              <p className="text-[9.5px] font-bold text-[var(--ink)]">
                Brew &amp; Co
              </p>
              <span className="text-[8px] font-semibold text-[var(--ink-faint)]">
                1 stamp away
              </span>
            </div>
            <div className="mt-1.5 flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className="size-2.5 rounded-full"
                  style={{ background: i < 7 ? accent : '#eee0cb' }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[#e7d9c2] bg-white px-2.5 py-2">
            <div className="flex items-center justify-between">
              <p className="text-[9.5px] font-bold text-[var(--ink)]">
                Corner Mart
              </p>
              <span className="text-[8px] font-semibold text-[var(--ink-faint)]">
                340 pts
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#eee0cb]">
              <div
                className="h-full w-[68%] rounded-full"
                style={{ background: accent }}
              />
            </div>
          </div>
        </div>
      </div>
    </ScreenShell>
  )
}

function StampPunchCard({ accent }: { accent: string }) {
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
        <div className="mt-3 rounded-xl border border-[#e7d9c2] bg-white p-3">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="flex aspect-square items-center justify-center rounded-full border-2"
                style={
                  i < 9
                    ? { background: accent, borderColor: accent }
                    : { borderColor: '#e7d9c2' }
                }
              >
                {i < 9 && (
                  <Check className="size-2.5 text-white" strokeWidth={3} />
                )}
              </span>
            ))}
          </div>
          <p className="mt-2.5 text-center text-[9px] font-bold text-[var(--ink)]">
            9 of 10 stamps, 1 more and it&rsquo;s free
          </p>
        </div>
      </div>
      <div className="px-3.5 pb-4">
        <div
          className="rounded-lg py-2.5 text-center text-[10.5px] font-bold text-white"
          style={{ background: accent }}
        >
          Scan to Stamp
        </div>
      </div>
    </ScreenShell>
  )
}

function StampCatalog({ accent }: { accent: string }) {
  const rewards = [
    { name: 'Free Coffee', cost: '500 pts', popular: true },
    { name: '10% Off Order', cost: '300 pts', popular: false },
    { name: 'Free Pastry', cost: '400 pts', popular: false },
  ]
  return (
    <ScreenShell bg="#FBF4EA">
      <StatusBar accent={accent} />
      <div className="flex-1 space-y-2 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Reward Catalog
        </p>
        <p className="text-[8.5px] text-[var(--ink-faint)]">
          1,240 points available
        </p>
        {rewards.map((r) => (
          <div
            key={r.name}
            className="flex items-center justify-between rounded-lg border border-[#e7d9c2] bg-white px-2.5 py-2"
          >
            <div className="flex items-center gap-2">
              <Gift
                className="size-3.5"
                style={{ color: accent }}
                strokeWidth={2}
              />
              <div>
                <p className="text-[9.5px] font-bold text-[var(--ink)]">
                  {r.name}
                </p>
                <p className="text-[8px] text-[var(--ink-faint)]">{r.cost}</p>
              </div>
            </div>
            <span
              className="rounded-full px-2 py-1 text-[7.5px] font-bold text-white"
              style={{ background: accent }}
            >
              Redeem
            </span>
          </div>
        ))}
      </div>
    </ScreenShell>
  )
}

function StampOffers({ accent }: { accent: string }) {
  return (
    <ScreenShell bg="#FBF4EA">
      <StatusBar accent={accent} />
      <div className="flex-1 space-y-2 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Offers &amp; Alerts
        </p>
        <div
          className="rounded-lg px-2.5 py-2"
          style={{ background: `${accent}1f` }}
        >
          <div className="flex items-center gap-1.5">
            <Bell
              className="size-3"
              style={{ color: accent }}
              strokeWidth={2.2}
            />
            <p className="text-[8.5px] font-bold" style={{ color: accent }}>
              3 live deals nearby
            </p>
          </div>
        </div>
        {[
          { name: 'Brew & Co', offer: 'Double points today', dist: '0.2 km' },
          { name: 'Corner Mart', offer: 'Bonus 200 pts', dist: '0.4 km' },
          {
            name: 'Sunny Bakes',
            offer: 'Free cookie w/ drink',
            dist: '0.6 km',
          },
        ].map((o) => (
          <div
            key={o.name}
            className="flex items-center gap-2 rounded-lg border border-[#e7d9c2] bg-white px-2.5 py-2"
          >
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ background: accent }}
            >
              {o.name[0]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] font-bold text-[var(--ink)]">
                {o.name}
              </p>
              <p className="truncate text-[8px] text-[var(--ink-faint)]">
                {o.offer}
              </p>
            </div>
            <span className="shrink-0 text-[7.5px] font-semibold text-[var(--ink-faint)]">
              {o.dist}
            </span>
          </div>
        ))}
      </div>
    </ScreenShell>
  )
}

/* ============================= SLATE ============================= */

function SlateBooking({ accent }: { accent: string }) {
  const days = [17, 18, 19, 20, 21, 22, 23]
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const slots = [
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '11:00 AM',
    '2:00 PM',
    '3:30 PM',
  ]
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Book a Slot
        </p>
        <div
          className="mt-2 flex items-center gap-2 rounded-lg px-2.5 py-1.5"
          style={{ background: `${accent}18` }}
        >
          <Check
            className="size-3"
            style={{ color: accent }}
            strokeWidth={2.5}
          />
          <p className="text-[8.5px] font-bold text-[var(--ink)]">
            Women&rsquo;s Haircut &amp; Style
          </p>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <div key={d} className="flex flex-col items-center gap-1">
              <span className="text-[7px] font-bold text-[var(--ink-faint)]">
                {dayLabels[i]}
              </span>
              <span
                className="flex size-5 items-center justify-center rounded-full text-[8px] font-bold"
                style={
                  i === 1
                    ? { background: accent, color: 'white' }
                    : { color: 'var(--ink-soft)' }
                }
              >
                {d}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {slots.map((s, i) => (
            <div
              key={s}
              className="rounded-lg border py-1.5 text-center text-[8.5px] font-bold"
              style={
                i === 0
                  ? {
                      borderColor: accent,
                      color: accent,
                      background: `${accent}12`,
                    }
                  : { borderColor: 'var(--line)', color: 'var(--ink-soft)' }
              }
            >
              {s}
            </div>
          ))}
        </div>
      </div>
      <div className="px-3.5 pb-4">
        <div
          className="rounded-lg py-2.5 text-center text-[10.5px] font-bold text-white"
          style={{ background: accent }}
        >
          Confirm Booking
        </div>
      </div>
    </ScreenShell>
  )
}

function SlateConfirmed({ accent }: { accent: string }) {
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex flex-1 flex-col items-center justify-center px-5 pb-6 text-center">
        <span
          className="flex size-12 items-center justify-center rounded-full"
          style={{ background: `${accent}1f` }}
        >
          <Check
            className="size-6"
            style={{ color: accent }}
            strokeWidth={2.5}
          />
        </span>
        <p className="mt-3 text-[13px] font-extrabold text-[var(--ink)]">
          You&rsquo;re booked!
        </p>
        <p className="mt-1 text-[8.5px] text-[var(--ink-faint)]">
          Confirmation sent to your phone
        </p>
        <div className="mt-4 w-full space-y-1.5 rounded-lg border border-[var(--line)] p-2.5 text-left">
          <div className="flex justify-between">
            <span className="text-[8px] text-[var(--ink-faint)]">Service</span>
            <span className="text-[8.5px] font-bold text-[var(--ink)]">
              Haircut &amp; Style
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[8px] text-[var(--ink-faint)]">Date</span>
            <span className="text-[8.5px] font-bold text-[var(--ink)]">
              Mon, 18 Nov
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[8px] text-[var(--ink-faint)]">Time</span>
            <span className="text-[8.5px] font-bold text-[var(--ink)]">
              9:00 AM
            </span>
          </div>
        </div>
        <div
          className="mt-3 w-full rounded-lg py-2.5 text-center text-[10px] font-bold text-white"
          style={{ background: accent }}
        >
          Add to Calendar
        </div>
      </div>
    </ScreenShell>
  )
}

function SlateAppointments({ accent }: { accent: string }) {
  const upcoming = [
    { s: 'Haircut & Style', t: 'Mon 18 Nov · 9:00 AM' },
    { s: 'Deep Tissue Massage', t: 'Thu 21 Nov · 2:30 PM' },
  ]
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          My Appointments
        </p>
        <div className="mt-2 flex gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[8px] font-bold text-white"
            style={{ background: accent }}
          >
            Upcoming
          </span>
          <span className="rounded-full px-2.5 py-1 text-[8px] font-bold text-[var(--ink-faint)]">
            Past
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {upcoming.map((u) => (
            <div
              key={u.s}
              className="rounded-lg border border-[var(--line)] p-2.5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[9.5px] font-bold text-[var(--ink)]">
                  {u.s}
                </p>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[7px] font-bold text-white"
                  style={{ background: accent }}
                >
                  Upcoming
                </span>
              </div>
              <p className="mt-0.5 text-[8px] text-[var(--ink-faint)]">{u.t}</p>
              <div className="mt-2 flex gap-1.5">
                <span className="flex-1 rounded-md border border-[var(--line)] py-1 text-center text-[7.5px] font-semibold text-[var(--ink-soft)]">
                  Reschedule
                </span>
                <span className="flex-1 rounded-md border border-[var(--line)] py-1 text-center text-[7.5px] font-semibold text-[var(--ink-soft)]">
                  Cancel
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  )
}

function SlateSchedule({ accent }: { accent: string }) {
  const rows = [
    { t: '9:00', name: 'Sarah M.', tone: accent },
    { t: '10:15', name: 'Priya K.', tone: accent },
    { t: '11:30', name: 'Open slot', tone: '#eeeef1' },
    { t: '13:00', name: 'Tom R.', tone: '#eeeef1' },
    { t: '15:30', name: 'Aisha N.', tone: '#eeeef1' },
  ]
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Today&rsquo;s Schedule
        </p>
        <p className="text-[8.5px] text-[var(--ink-faint)]">
          Mon, 18 Nov · 5 booked
        </p>
        <div className="mt-3 space-y-1.5">
          {rows.map((r) => (
            <div key={r.t} className="flex items-center gap-2">
              <span className="w-7 shrink-0 text-[8px] font-bold text-[var(--ink-faint)]">
                {r.t}
              </span>
              <div
                className="flex h-6 flex-1 items-center rounded px-2"
                style={{
                  background: r.tone === accent ? `${accent}1f` : r.tone,
                }}
              >
                <span
                  className="text-[8px] font-bold"
                  style={{
                    color: r.tone === accent ? accent : 'var(--ink-faint)',
                  }}
                >
                  {r.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  )
}

/* ============================= PROPHY ============================= */

function ProphyRecall({ accent }: { accent: string }) {
  const patients = [
    { name: 'Emma Wilkins', due: 'Overdue 2 wks', urgent: true },
    { name: 'Marcus Lee', due: 'Due this week', urgent: false },
    { name: 'Priya Shah', due: 'Due this week', urgent: false },
    { name: 'Tom Baxter', due: 'Due in 2 wks', urgent: false },
  ]
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 space-y-2 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Patient Recall
        </p>
        <p className="text-[8.5px] text-[var(--ink-faint)]">
          14 patients due this month
        </p>
        {patients.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-2 rounded-lg border border-[var(--line)] px-2.5 py-2"
          >
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-[8.5px] font-bold text-white"
              style={{ background: p.urgent ? '#DC2626' : accent }}
            >
              {p.name[0]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] font-bold text-[var(--ink)]">
                {p.name}
              </p>
              <p
                className="text-[8px] font-semibold"
                style={{ color: p.urgent ? '#DC2626' : 'var(--ink-faint)' }}
              >
                {p.due}
              </p>
            </div>
            <ChevronRight className="size-3 shrink-0 text-[var(--ink-faint)]" />
          </div>
        ))}
      </div>
    </ScreenShell>
  )
}

function ProphyChart({ accent }: { accent: string }) {
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Emma Wilkins
        </p>
        <p className="text-[8.5px] text-[var(--ink-faint)]">
          DOB 04/12/1991 · Chart #2214
        </p>
        <div className="mt-3 space-y-2">
          <div className="rounded-lg border border-[var(--line)] p-2.5">
            <p
              className="text-[8px] font-bold uppercase tracking-wide"
              style={{ color: accent }}
            >
              Today&rsquo;s notes
            </p>
            <div className="mt-1.5 space-y-1">
              <Bar w="95%" h={6} tone="#eeeef1" />
              <Bar w="88%" h={6} tone="#eeeef1" />
              <Bar w="60%" h={6} tone="#eeeef1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-[#f4f4f6] p-2">
              <p className="text-[7.5px] font-semibold text-[var(--ink-faint)]">
                Last visit
              </p>
              <p className="mt-0.5 text-[9px] font-bold text-[var(--ink)]">
                6 mo ago
              </p>
            </div>
            <div className="rounded-lg bg-[#f4f4f6] p-2">
              <p className="text-[7.5px] font-semibold text-[var(--ink-faint)]">
                Next recall
              </p>
              <p
                className="mt-0.5 text-[9px] font-bold"
                style={{ color: accent }}
              >
                2 wks
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-3.5 pb-4">
        <div
          className="rounded-lg py-2.5 text-center text-[10.5px] font-bold text-white"
          style={{ background: accent }}
        >
          Save Notes
        </div>
      </div>
    </ScreenShell>
  )
}

function ProphyDaySchedule({ accent }: { accent: string }) {
  const chairs = ['Chair 1', 'Chair 2']
  const rows = [
    { t: '9:00', c1: accent, c2: '#eeeef1' },
    { t: '10:00', c1: '#eeeef1', c2: accent },
    { t: '11:00', c1: accent, c2: '#eeeef1' },
    { t: '13:00', c1: '#eeeef1', c2: '#eeeef1' },
  ]
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Day Schedule
        </p>
        <div className="mt-2 grid grid-cols-[2rem_1fr_1fr] gap-1.5">
          <span />
          {chairs.map((c) => (
            <span
              key={c}
              className="text-center text-[7.5px] font-bold text-[var(--ink-faint)]"
            >
              {c}
            </span>
          ))}
          {rows.map((r) => (
            <Fragment key={r.t}>
              <span className="self-center text-[7.5px] font-bold text-[var(--ink-faint)]">
                {r.t}
              </span>
              <span
                className="h-6 rounded"
                style={{ background: r.c1 === accent ? `${accent}30` : r.c1 }}
              />
              <span
                className="h-6 rounded"
                style={{ background: r.c2 === accent ? `${accent}30` : r.c2 }}
              />
            </Fragment>
          ))}
        </div>
      </div>
    </ScreenShell>
  )
}

function ProphyTreatment({ accent }: { accent: string }) {
  const stages = [
    { label: 'Proposed', count: 2, tone: '#9aa0ac' },
    { label: 'Accepted', count: 1, tone: '#F08A24' },
    { label: 'Completed', count: 4, tone: accent },
  ]
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Treatment Plan
        </p>
        <p className="text-[8.5px] text-[var(--ink-faint)]">Emma Wilkins</p>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {stages.map((s) => (
            <div
              key={s.label}
              className="rounded-lg bg-[#f4f4f6] p-2 text-center"
            >
              <p
                className="text-[13px] font-extrabold"
                style={{ color: s.tone }}
              >
                {s.count}
              </p>
              <p className="mt-0.5 text-[7px] font-semibold text-[var(--ink-faint)]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {['Crown · tooth #14', 'Filling · tooth #19', 'Cleaning'].map(
            (t, i) => (
              <div
                key={t}
                className="flex items-center justify-between rounded-lg border border-[var(--line)] px-2.5 py-1.5"
              >
                <span className="text-[8.5px] font-semibold text-[var(--ink)]">
                  {t}
                </span>
                <Check
                  className="size-3"
                  style={{ color: i === 2 ? accent : '#c9c9d0' }}
                  strokeWidth={2.5}
                />
              </div>
            ),
          )}
        </div>
      </div>
    </ScreenShell>
  )
}

/* ============================= LEADR ============================= */

function LeadrPipeline({ accent }: { accent: string }) {
  const cols = [
    { label: 'New', count: 4, tone: '#9aa0ac' },
    { label: 'Contacted', count: 3, tone: '#F08A24' },
    { label: 'Won', count: 2, tone: accent },
  ]
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">Pipeline</p>
        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {cols.map((c) => (
            <div key={c.label} className="rounded-lg bg-[#f4f4f6] p-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[7px] font-bold text-[var(--ink-faint)]">
                  {c.label}
                </span>
                <span
                  className="text-[7px] font-bold"
                  style={{ color: c.tone }}
                >
                  {c.count}
                </span>
              </div>
              <div className="mt-1.5 space-y-1">
                {Array.from({ length: c.count }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 rounded-md border-l-2 bg-white p-1"
                    style={{ borderColor: c.tone }}
                  >
                    <Bar w="80%" h={4} tone="#eeeef1" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  )
}

function LeadrDetail({ accent }: { accent: string }) {
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <div className="flex items-center gap-2">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ background: accent }}
          >
            RK
          </span>
          <div>
            <p className="text-[10.5px] font-extrabold text-[var(--ink)]">
              Riya Kapoor
            </p>
            <p className="text-[8px] text-[var(--ink-faint)]">
              Nimbus Retail · $12,000
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-1.5">
          {[Phone, Mail].map((Ico, i) => (
            <span
              key={i}
              className="flex size-7 items-center justify-center rounded-lg"
              style={{ background: `${accent}18`, color: accent }}
            >
              <Ico className="size-3.5" strokeWidth={2} />
            </span>
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {[
            'Called, left voicemail',
            'Sent proposal via email',
            'Meeting booked for Thu',
          ].map((t) => (
            <div key={t} className="flex items-start gap-1.5">
              <span
                className="mt-1 size-1 shrink-0 rounded-full"
                style={{ background: accent }}
              />
              <span className="text-[8px] leading-relaxed text-[var(--ink-soft)]">
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-3.5 pb-4">
        <div
          className="rounded-lg py-2.5 text-center text-[10.5px] font-bold text-white"
          style={{ background: accent }}
        >
          Log Follow-Up
        </div>
      </div>
    </ScreenShell>
  )
}

function LeadrReminders({ accent }: { accent: string }) {
  const items = [
    { name: 'Riya Kapoor', due: 'Today, 3:00 PM' },
    { name: 'Daniel Osei', due: 'Tomorrow' },
    { name: 'Wren Studio', due: 'In 3 days' },
  ]
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 space-y-2 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Follow-Ups
        </p>
        <div
          className="rounded-lg px-2.5 py-2"
          style={{ background: `${accent}18` }}
        >
          <div className="flex items-center gap-1.5">
            <Bell
              className="size-3"
              style={{ color: accent }}
              strokeWidth={2.2}
            />
            <p className="text-[8.5px] font-bold" style={{ color: accent }}>
              3 leads need a follow-up
            </p>
          </div>
        </div>
        {items.map((it, i) => (
          <div
            key={it.name}
            className="flex items-center justify-between rounded-lg border border-[var(--line)] px-2.5 py-2"
          >
            <div>
              <p className="text-[9px] font-bold text-[var(--ink)]">
                {it.name}
              </p>
              <p className="text-[8px] text-[var(--ink-faint)]">{it.due}</p>
            </div>
            <span
              className="rounded-md px-1.5 py-1 text-[7px] font-bold"
              style={
                i === 0
                  ? { background: accent, color: 'white' }
                  : { background: '#f1f1f4', color: 'var(--ink-soft)' }
              }
            >
              Remind
            </span>
          </div>
        ))}
      </div>
    </ScreenShell>
  )
}

function LeadrDigest({ accent }: { accent: string }) {
  const bars = [40, 65, 30, 90, 55, 70, 45]
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Weekly Digest
        </p>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {[
            { l: 'New leads', v: '12' },
            { l: 'Contacted', v: '9' },
            { l: 'Won', v: '3' },
          ].map((s) => (
            <div key={s.l} className="rounded-lg bg-[#f4f4f6] p-2 text-center">
              <p className="text-[12px] font-extrabold text-[var(--ink)]">
                {s.v}
              </p>
              <p className="text-[7px] font-semibold text-[var(--ink-faint)]">
                {s.l}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex h-16 items-end justify-between gap-1.5 rounded-lg bg-[#f4f4f6] p-2">
          {bars.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-t"
              style={{
                height: `${h}%`,
                background: i === 3 ? accent : '#dcdce0',
              }}
            />
          ))}
        </div>
      </div>
    </ScreenShell>
  )
}

/* ============================= REGISTRY ============================= */

type ScreenComponent = (props: { accent: string }) => ReactNode

export const CONCEPT_SCREENS: Record<string, ScreenComponent[]> = {
  fieldly: [FieldlyDispatch, FieldlyQuote, FieldlyPhotos, FieldlySchedule],
  stamp: [StampWallet, StampPunchCard, StampCatalog, StampOffers],
  slate: [SlateBooking, SlateConfirmed, SlateAppointments, SlateSchedule],
  prophy: [ProphyRecall, ProphyChart, ProphyDaySchedule, ProphyTreatment],
  leadr: [LeadrPipeline, LeadrDetail, LeadrReminders, LeadrDigest],
}
