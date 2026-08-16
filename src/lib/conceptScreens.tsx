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
import { Tap, useChoice, usePhoneNav, useScreenState } from '#/lib/phoneUI'

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
  const { go } = usePhoneNav()
  const [open, setOpen] = useChoice('fieldly.job', 0)
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
        {jobs.map((j, i) => (
          <Tap
            key={j.name}
            ripple={j.tone}
            label={`Open ${j.name}`}
            onTap={() => {
              setOpen(i)
              // a job opens on its quote, which is the next screen along
              go(1)
            }}
          >
            <span
              className="flex items-center gap-2 rounded-lg border bg-white px-2.5 py-2 transition-colors"
              style={{
                borderColor: open === i ? j.tone : 'var(--line)',
                boxShadow: open === i ? `0 0 0 1px ${j.tone}55` : undefined,
              }}
            >
              <span
                className="h-6 w-1 shrink-0 rounded-full"
                style={{ background: j.tone }}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[10px] font-bold text-[var(--ink)]">
                  {j.name}
                </span>
                <span className="block text-[8.5px] text-[var(--ink-faint)]">
                  {j.tag}
                </span>
              </span>
              <span
                className="shrink-0 rounded-full px-1.5 py-0.5 text-[7.5px] font-bold"
                style={{ background: `${j.tone}22`, color: j.tone }}
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
            className="flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-[11px] font-bold text-white"
            style={{ background: accent }}
          >
            + New Job
          </span>
        </Tap>
      </div>
    </ScreenShell>
  )
}

function FieldlyQuote({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  // the quote is a document with two things you can do to it, and it should
  // show which one you did
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
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        {/* every screen you can be sent to needs a way back out of it */}
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
        <Tap
          ripple="#ffffff"
          label="Convert to invoice"
          onTap={() => setSent('invoiced')}
        >
          <span
            className="block rounded-lg py-2.5 text-center text-[10.5px] font-bold text-white transition-colors"
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
          <span className="block rounded-lg border border-[var(--line)] py-2 text-center text-[10px] font-semibold text-[var(--ink-soft)]">
            {sent === 'sent' ? 'Sent to Sarah ✓' : 'Send to Client'}
          </span>
        </Tap>
      </div>
    </ScreenShell>
  )
}

function FieldlyPhotos({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  // the before/after pair is the point of the screen: the "before" slot is
  // empty until you take it
  const [shot, setShot] = useScreenState('fieldly.before', false)
  const [done, setDone] = useScreenState('fieldly.done', false)
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
            <Tap
              ripple={accent}
              label="Take before photo"
              onTap={() => setShot(true)}
            >
              <span
                className="flex aspect-square items-center justify-center rounded-lg border transition-colors"
                style={
                  shot
                    ? { background: `${accent}20`, borderColor: 'transparent' }
                    : {
                        background: '#f4f4f6',
                        borderColor: 'var(--line-strong)',
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
                  <Camera
                    className="size-4 text-[var(--ink-faint)]"
                    strokeWidth={1.75}
                  />
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
        <Tap
          ripple="#ffffff"
          label="Mark job complete"
          onTap={() => {
            setDone(true)
            // finishing a job puts you back on the day it came from
            window.setTimeout(() => go(3), 700)
          }}
        >
          <span
            className="block rounded-lg py-2.5 text-center text-[10.5px] font-bold text-white transition-colors"
            style={{ background: done ? '#1F9D55' : accent }}
          >
            {done ? 'Completed ✓' : 'Mark Complete'}
          </span>
        </Tap>
      </div>
    </ScreenShell>
  )
}

function FieldlySchedule({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [day, setDay] = useChoice('fieldly.day', 2)
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
            <Tap
              key={i}
              press={false}
              ripple={accent}
              label={`Show ${18 + i} November`}
              onTap={() => setDay(i)}
            >
              <span className="flex flex-col items-center gap-1">
                <span className="text-[7px] font-bold text-[var(--ink-faint)]">
                  {d}
                </span>
                <span
                  className="flex size-5 items-center justify-center rounded-full text-[8px] font-bold transition-colors"
                  style={
                    day === i
                      ? { background: accent, color: 'white' }
                      : { color: 'var(--ink-soft)' }
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
              ripple={accent}
              label={`Open ${r.label}`}
              onTap={() => go(0)}
            >
              <span className="flex items-center gap-2">
                <span className="w-7 shrink-0 text-[8px] font-bold text-[var(--ink-faint)]">
                  {r.t}
                </span>
                <span
                  className="flex h-5 flex-1 items-center rounded px-1.5 text-[7.5px] font-bold"
                  style={{
                    background: r.tone,
                    color:
                      r.tone === accent || r.tone === '#1F9D55'
                        ? 'white'
                        : 'var(--ink-faint)',
                  }}
                >
                  {r.label}
                </span>
              </span>
            </Tap>
          ))}
        </div>
      </div>
    </ScreenShell>
  )
}

/* ============================= STAMP ============================= */

function StampWallet({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  return (
    <ScreenShell bg="#FBF4EA">
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Good morning, Jamie
        </p>
        <Tap
          ripple="#ffffff"
          label="See reward catalog"
          onTap={() => go(2)}
          className="mt-3"
        >
          <span
            className="block rounded-xl p-3 text-left text-white"
            style={{ background: accent }}
          >
            <span className="block text-[8.5px] font-semibold text-white/70">
              Total points
            </span>
            <span className="mt-0.5 block text-xl font-extrabold">1,240</span>
            <span className="mt-1 block text-[8px] text-white/70">
              3 rewards available
            </span>
          </span>
        </Tap>
        <div className="mt-3 space-y-2">
          <Tap
            ripple={accent}
            label="Open Brew and Co punch card"
            onTap={() => go(1)}
          >
            <span className="block rounded-lg border border-[#e7d9c2] bg-white px-2.5 py-2">
              <span className="flex items-center justify-between">
                <span className="text-[9.5px] font-bold text-[var(--ink)]">
                  Brew &amp; Co
                </span>
                <span className="text-[8px] font-semibold text-[var(--ink-faint)]">
                  1 stamp away
                </span>
              </span>
              <span className="mt-1.5 flex gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span
                    key={i}
                    className="size-2.5 rounded-full"
                    style={{ background: i < 7 ? accent : '#eee0cb' }}
                  />
                ))}
              </span>
            </span>
          </Tap>
          <Tap
            ripple={accent}
            label="Open Corner Mart card"
            onTap={() => go(3)}
          >
            <span className="block rounded-lg border border-[#e7d9c2] bg-white px-2.5 py-2">
              <span className="flex items-center justify-between">
                <span className="text-[9.5px] font-bold text-[var(--ink)]">
                  Corner Mart
                </span>
                <span className="text-[8px] font-semibold text-[var(--ink-faint)]">
                  340 pts
                </span>
              </span>
              <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-[#eee0cb]">
                <span
                  className="block h-full w-[68%] rounded-full"
                  style={{ background: accent }}
                />
              </span>
            </span>
          </Tap>
        </div>
      </div>
    </ScreenShell>
  )
}

function StampPunchCard({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  // the whole product in one control: scanning fills the tenth hole and the
  // card turns into a free coffee
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
        <div className="mt-3 rounded-xl border border-[#e7d9c2] bg-white p-3">
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
              ? 'Card full — your next coffee is free'
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
            className="block rounded-lg py-2.5 text-center text-[10.5px] font-bold text-white transition-colors"
            style={{ background: full ? '#1F9D55' : accent }}
          >
            {full ? 'Claim Free Coffee' : 'Scan to Stamp'}
          </span>
        </Tap>
      </div>
    </ScreenShell>
  )
}

function StampCatalog({ accent }: { accent: string }) {
  // redeeming spends the balance, so the number at the top has to move
  const [points, setPoints] = useScreenState('stamp.points', 1240)
  const [taken, setTaken] = useScreenState<Array<string>>('stamp.taken', [])
  const rewards = [
    { name: 'Free Coffee', cost: '500 pts', price: 500, popular: true },
    { name: '10% Off Order', cost: '300 pts', price: 300, popular: false },
    { name: 'Free Pastry', cost: '400 pts', price: 400, popular: false },
  ]
  return (
    <ScreenShell bg="#FBF4EA">
      <StatusBar accent={accent} />
      <div className="flex-1 space-y-2 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          Reward Catalog
        </p>
        <p className="text-[8.5px] text-[var(--ink-faint)]">
          {points.toLocaleString()} points available
        </p>
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
              <span className="flex items-center justify-between rounded-lg border border-[#e7d9c2] bg-white px-2.5 py-2">
                <span className="flex items-center gap-2">
                  <Gift
                    className="size-3.5"
                    style={{ color: accent }}
                    strokeWidth={2}
                  />
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
                    background: got
                      ? '#1F9D55'
                      : afford
                        ? accent
                        : 'var(--ink-faint)',
                  }}
                >
                  {got ? 'Redeemed' : afford ? 'Redeem' : 'Short'}
                </span>
              </span>
            </Tap>
          )
        })}
      </div>
    </ScreenShell>
  )
}

function StampOffers({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
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
          <Tap
            key={o.name}
            ripple={accent}
            label={`Open ${o.name}`}
            onTap={() => go(1)}
          >
            <span className="flex items-center gap-2 rounded-lg border border-[#e7d9c2] bg-white px-2.5 py-2">
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ background: accent }}
              >
                {o.name[0]}
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

/* ============================= SLATE ============================= */

function SlateBooking({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  // a booking screen where the day and the time cannot be changed is a picture
  // of a booking screen
  const [day, setDay] = useChoice('slate.day', 1)
  const [slot, setSlot] = useChoice('slate.slot', 0)
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
            <Tap
              key={d}
              press={false}
              ripple={accent}
              label={`Choose ${d} November`}
              onTap={() => setDay(i)}
            >
              <span className="flex flex-col items-center gap-1">
                <span className="text-[7px] font-bold text-[var(--ink-faint)]">
                  {dayLabels[i]}
                </span>
                <span
                  className="flex size-5 items-center justify-center rounded-full text-[8px] font-bold transition-colors"
                  style={
                    day === i
                      ? { background: accent, color: 'white' }
                      : { color: 'var(--ink-soft)' }
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
                    ? {
                        borderColor: accent,
                        color: accent,
                        background: `${accent}12`,
                      }
                    : { borderColor: 'var(--line)', color: 'var(--ink-soft)' }
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
            className="block rounded-lg py-2.5 text-center text-[10.5px] font-bold text-white"
            style={{ background: accent }}
          >
            Confirm {days[day]} Nov · {slots[slot]}
          </span>
        </Tap>
      </div>
    </ScreenShell>
  )
}

function SlateConfirmed({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [added, setAdded] = useScreenState('slate.calendar', false)
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
        <Tap
          ripple="#ffffff"
          label="Add booking to calendar"
          className="mt-3"
          onTap={() => {
            setAdded(true)
            // once it is in the diary, the natural next place is the diary
            window.setTimeout(() => go(2), 700)
          }}
        >
          <span
            className="block w-full rounded-lg py-2.5 text-center text-[10px] font-bold text-white transition-colors"
            style={{ background: added ? '#1F9D55' : accent }}
          >
            {added ? 'Added to Calendar ✓' : 'Add to Calendar'}
          </span>
        </Tap>
      </div>
    </ScreenShell>
  )
}

function SlateAppointments({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [tab, setTab] = useChoice('slate.tab', 0)
  // cancelling has to actually remove the booking, or the button is a label
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
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <p className="text-[13px] font-extrabold text-[var(--ink)]">
          My Appointments
        </p>
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
                    ? { background: accent, color: 'white' }
                    : { color: 'var(--ink-faint)' }
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
              className="rounded-lg border border-[var(--line)] p-2.5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[9.5px] font-bold text-[var(--ink)]">
                  {u.s}
                </p>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[7px] font-bold text-white"
                  style={{
                    background: tab === 0 ? accent : 'var(--ink-faint)',
                  }}
                >
                  {tab === 0 ? 'Upcoming' : 'Done'}
                </span>
              </div>
              <p className="mt-0.5 text-[8px] text-[var(--ink-faint)]">{u.t}</p>
              <div className="mt-2 flex gap-1.5">
                <Tap
                  ripple={accent}
                  className="flex-1"
                  label={`Reschedule ${u.s}`}
                  onTap={() => go(0)}
                >
                  <span className="block rounded-md border border-[var(--line)] py-1 text-center text-[7.5px] font-semibold text-[var(--ink-soft)]">
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
                    <span className="block rounded-md border border-[var(--line)] py-1 text-center text-[7.5px] font-semibold text-[var(--ink-soft)]">
                      Cancel
                    </span>
                  </Tap>
                )}
              </div>
            </div>
          ))}
          {shown.length === 0 && (
            <p className="py-6 text-center text-[8.5px] text-[var(--ink-faint)]">
              Nothing booked. Tap Book a Slot to add one.
            </p>
          )}
        </div>
      </div>
    </ScreenShell>
  )
}

function SlateSchedule({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [picked, setPicked] = useChoice('slate.picked', -1)
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
          {rows.map((r, i) => {
            const free = r.name === 'Open slot'
            return (
              <Tap
                key={r.t}
                ripple={accent}
                label={free ? `Book ${r.t}` : `Open ${r.name}`}
                onTap={() => {
                  setPicked(i)
                  // an open slot is the one row that leads somewhere: it
                  // starts a booking
                  if (free) go(0)
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="w-7 shrink-0 text-[8px] font-bold text-[var(--ink-faint)]">
                    {r.t}
                  </span>
                  <span
                    className="flex h-6 flex-1 items-center justify-between rounded px-2 transition-shadow"
                    style={{
                      background: r.tone === accent ? `${accent}1f` : r.tone,
                      boxShadow:
                        picked === i ? `inset 0 0 0 1px ${accent}` : undefined,
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
                    {free && (
                      <span
                        className="text-[7px] font-bold"
                        style={{ color: accent }}
                      >
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
    </ScreenShell>
  )
}

/* ============================= PROPHY ============================= */

function ProphyRecall({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  // recalling a patient is the job, so a row has to be able to say it was done
  const [called, setCalled] = useScreenState<Array<string>>('prophy.called', [])
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
              <span className="flex items-center gap-2 rounded-lg border border-[var(--line)] px-2.5 py-2">
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-full text-[8.5px] font-bold text-white"
                  style={{
                    background: done
                      ? '#1F9D55'
                      : p.urgent
                        ? '#DC2626'
                        : accent,
                  }}
                >
                  {done ? (
                    <Check className="size-3" strokeWidth={3} />
                  ) : (
                    p.name[0]
                  )}
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-[9px] font-bold text-[var(--ink)]">
                    {p.name}
                  </span>
                  <span
                    className="block text-[8px] font-semibold"
                    style={{
                      color: done
                        ? '#1F9D55'
                        : p.urgent
                          ? '#DC2626'
                          : 'var(--ink-faint)',
                    }}
                  >
                    {done ? 'Contacted' : p.due}
                  </span>
                </span>
                <ChevronRight className="size-3 shrink-0 text-[var(--ink-faint)]" />
              </span>
            </Tap>
          )
        })}
      </div>
    </ScreenShell>
  )
}

function ProphyChart({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [saved, setSaved] = useScreenState('prophy.saved', false)
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <Tap
          ripple={accent}
          press={false}
          label="Back to patient recall"
          onTap={() => go(0)}
          className="mb-1.5 !w-auto"
        >
          <span
            className="flex items-center gap-0.5 text-[9px] font-bold"
            style={{ color: accent }}
          >
            <ChevronRight className="size-2.5 rotate-180" strokeWidth={3} />
            Recall
          </span>
        </Tap>
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
        <Tap
          ripple="#ffffff"
          label="Save notes"
          onTap={() => {
            setSaved(true)
            window.setTimeout(() => go(3), 700)
          }}
        >
          <span
            className="block rounded-lg py-2.5 text-center text-[10.5px] font-bold text-white transition-colors"
            style={{ background: saved ? '#1F9D55' : accent }}
          >
            {saved ? 'Notes saved ✓' : 'Save Notes'}
          </span>
        </Tap>
      </div>
    </ScreenShell>
  )
}

function ProphyDaySchedule({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  // an empty chair-slot is the one thing a practice manager wants to touch
  const [filled, setFilled] = useScreenState<Array<string>>('prophy.filled', [])
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
              {[r.c1, r.c2].map((tone, col) => {
                const key = `${r.t}-${col}`
                const booked = tone === accent || filled.includes(key)
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
                      className="flex h-6 items-center justify-center rounded text-[7px] font-bold transition-colors"
                      style={{
                        background: booked ? `${accent}30` : tone,
                        color: booked ? accent : 'var(--ink-faint)',
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
      </div>
    </ScreenShell>
  )
}

function ProphyTreatment({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  // the plan is a checklist, so ticking an item has to move the counters
  const [ticked, setTicked] = useScreenState<Array<number>>(
    'prophy.ticked',
    [2],
  )
  const stages = [
    { label: 'Proposed', count: 3 - ticked.length, tone: '#9aa0ac' },
    { label: 'Accepted', count: 1, tone: '#F08A24' },
    { label: 'Completed', count: 3 + ticked.length, tone: accent },
  ]
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 px-3.5 pb-3">
        <Tap
          ripple={accent}
          press={false}
          label="Back to chart"
          onTap={() => go(1)}
          className="mb-1.5 !w-auto"
        >
          <span
            className="flex items-center gap-0.5 text-[9px] font-bold"
            style={{ color: accent }}
          >
            <ChevronRight className="size-2.5 rotate-180" strokeWidth={3} />
            Chart
          </span>
        </Tap>
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
                <span className="flex items-center justify-between rounded-lg border border-[var(--line)] px-2.5 py-1.5">
                  <span className="text-[8.5px] font-semibold text-[var(--ink)]">
                    {t}
                  </span>
                  <Check
                    className="size-3 transition-colors"
                    style={{ color: ticked.includes(i) ? accent : '#c9c9d0' }}
                    strokeWidth={2.5}
                  />
                </span>
              </Tap>
            ),
          )}
        </div>
      </div>
    </ScreenShell>
  )
}

/* ============================= LEADR ============================= */

function LeadrPipeline({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
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
                  <Tap
                    key={i}
                    ripple={c.tone}
                    label={`Open ${c.label} lead ${i + 1}`}
                    onTap={() => go(1)}
                  >
                    <span
                      className="block h-6 rounded-md border-l-2 bg-white p-1"
                      style={{ borderColor: c.tone }}
                    >
                      <Bar w="80%" h={4} tone="#eeeef1" />
                    </span>
                  </Tap>
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
  const { go } = usePhoneNav()
  // the timeline is the record: logging a follow-up should write to it
  const [log, setLog] = useScreenState<Array<string>>('leadr.log', [])
  const [logged, setLogged] = useScreenState('leadr.logged', false)
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
          {[
            { Ico: Phone, note: 'Called Riya', label: 'Call Riya' },
            { Ico: Mail, note: 'Emailed Riya', label: 'Email Riya' },
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
        <div className="mt-3 space-y-1.5">
          {[
            ...log,
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
        <Tap
          ripple="#ffffff"
          label="Log follow-up"
          onTap={() => {
            setLogged(true)
            window.setTimeout(() => go(2), 700)
          }}
        >
          <span
            className="block rounded-lg py-2.5 text-center text-[10.5px] font-bold text-white transition-colors"
            style={{ background: logged ? '#1F9D55' : accent }}
          >
            {logged ? 'Follow-up logged ✓' : 'Log Follow-Up'}
          </span>
        </Tap>
      </div>
    </ScreenShell>
  )
}

function LeadrReminders({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [set, setSet] = useScreenState<Array<string>>('leadr.reminders', [])
  const items = [
    { name: 'Riya Kapoor', due: 'Today, 3:00 PM' },
    { name: 'Daniel Osei', due: 'Tomorrow' },
    { name: 'Wren Studio', due: 'In 3 days' },
  ]
  return (
    <ScreenShell>
      <StatusBar accent={accent} />
      <div className="flex-1 space-y-2 px-3.5 pb-3">
        <Tap
          ripple={accent}
          press={false}
          label="Back to pipeline"
          onTap={() => go(0)}
          className="!w-auto"
        >
          <span
            className="flex items-center gap-0.5 text-[9px] font-bold"
            style={{ color: accent }}
          >
            <ChevronRight className="size-2.5 rotate-180" strokeWidth={3} />
            Pipeline
          </span>
        </Tap>
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
        {items.map((it) => {
          const on = set.includes(it.name)
          return (
            <Tap
              key={it.name}
              ripple={accent}
              label={`Set reminder for ${it.name}`}
              onTap={() =>
                setSet((cur) =>
                  cur.includes(it.name)
                    ? cur.filter((n) => n !== it.name)
                    : [...cur, it.name],
                )
              }
            >
              <span className="flex items-center justify-between rounded-lg border border-[var(--line)] px-2.5 py-2">
                <span className="block text-left">
                  <span className="block text-[9px] font-bold text-[var(--ink)]">
                    {it.name}
                  </span>
                  <span className="block text-[8px] text-[var(--ink-faint)]">
                    {it.due}
                  </span>
                </span>
                <span
                  className="rounded-md px-1.5 py-1 text-[7px] font-bold transition-colors"
                  style={
                    on
                      ? { background: accent, color: 'white' }
                      : { background: '#f1f1f4', color: 'var(--ink-soft)' }
                  }
                >
                  {on ? 'Set' : 'Remind'}
                </span>
              </span>
            </Tap>
          )
        })}
      </div>
    </ScreenShell>
  )
}

function LeadrDigest({ accent }: { accent: string }) {
  const { go } = usePhoneNav()
  const [day, setDay] = useChoice('leadr.day', 3)
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
            <Tap
              key={s.l}
              ripple={accent}
              label={`See ${s.l}`}
              onTap={() => go(0)}
            >
              <span className="block rounded-lg bg-[#f4f4f6] p-2 text-center">
                <span className="block text-[12px] font-extrabold text-[var(--ink)]">
                  {s.v}
                </span>
                <span className="block text-[7px] font-semibold text-[var(--ink-faint)]">
                  {s.l}
                </span>
              </span>
            </Tap>
          ))}
        </div>
        <div className="mt-3 flex h-16 items-end justify-between gap-1.5 rounded-lg bg-[#f4f4f6] p-2">
          {bars.map((h, i) => (
            <Tap
              key={i}
              press={false}
              ripple={accent}
              label={`Show day ${i + 1}`}
              onTap={() => setDay(i)}
              className="flex h-full flex-1 items-end"
            >
              <span
                className="block w-full rounded-t transition-colors"
                style={{
                  height: `${h}%`,
                  background: day === i ? accent : '#dcdce0',
                }}
              />
            </Tap>
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
