import type { ReactNode } from 'react'
import {
  ArrowUpRight,
  Camera,
  Check,
  ChevronRight,
  Clock,
  Flame,
  Gift,
  MapPin,
  Navigation,
  Phone,
  Plus,
  QrCode,
  Signature,
  Sparkles,
  Zap,
} from 'lucide-react'
import type { Concept, ConceptIconName } from '#/lib/concepts'
import { Tap, useChoice, usePhoneNav, useScreenState } from '#/lib/phoneUI'
import {
  AppCanvas,
  Avatar,
  Card,
  Glyph,
  GhostButton,
  LargeTitle,
  ListGroup,
  NavBar,
  Pill,
  PrimaryButton,
  Row,
  SearchField,
  Segmented,
  Sheet,
  Stat,
  StatusBar,
  TabBar,
  Track,
} from '#/lib/iosKit'

/**
 * The five concepts' app screens.
 *
 * Every screen is assembled from the shared iOS kit - status bar, large title,
 * grouped lists, sheets, and the glass tab bar - so the family resemblance is
 * deliberate and the differences are too. What separates one concept from the
 * next is its *flow*, not its furniture:
 *
 *   Fieldly  · ops console    - dark board, floating bar, list runs under it
 *   Stamp    · wallet-first   - a deck of cards that lifts when picked
 *   Slate    · calendar-first - the week never leaves; confirmation is a sheet
 *   Prophy   · chart-first    - search, cards, and exactly one alarm colour
 *   Leadr    · pipeline board - stages scroll sideways under a fixed header
 *
 * The tab bar is wired to the same router the arrows and the swipe use, so the
 * whole case study can be driven from inside the glass.
 */

type ScreenProps = { c: Concept }

/**
 * The one screen-level action each app lifts out of its tab capsule.
 *
 * Current iOS keeps destinations and actions in separate controls - the tab
 * bar is a capsule of places you can go, and the single most-used *verb* gets
 * its own circle beside it. Which verb that is says a lot about the product,
 * so each concept picks its own.
 */
const TAB_ACTION: Record<
  string,
  { icon: ConceptIconName; label: string }
> = {
  fieldly: { icon: 'Plus', label: 'Add a job' },
  stamp: { icon: 'QrCode', label: 'Scan at the till' },
  slate: { icon: 'Plus', label: 'New booking' },
  prophy: { icon: 'Search', label: 'Search patients' },
  leadr: { icon: 'Plus', label: 'Add a lead' },
}

/* ------------------------------------------------------------------ *
 * Shared bits that are not chrome
 * ------------------------------------------------------------------ */

/** A horizontally scrolling rail with the scrollbar taken away. */
function Rail({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex gap-2 overflow-x-auto px-[1.05rem] pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ scrollSnapType: 'x proximity' }}
    >
      {children}
    </div>
  )
}

/** The soft plate a map sits on when there is no map. */
function MapPlate({ c, height = 78 }: { c: Concept; height?: number }) {
  return (
    <span
      className="relative block overflow-hidden rounded-xl"
      style={{
        height,
        background: `linear-gradient(150deg, color-mix(in srgb, ${c.accent} 26%, transparent), color-mix(in srgb, ${c.accent2} 12%, transparent))`,
      }}
    >
      {/* roads, abstracted to the two or three lines a glance actually reads */}
      <svg viewBox="0 0 120 60" className="absolute inset-0 size-full" aria-hidden="true">
        <path
          d="M-4 44 Q 30 38 52 24 T 124 14"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeWidth="2.5"
          className="text-white"
        />
        <path
          d="M18 64 L 34 26 L 60 -4"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1.6"
          className="text-white"
        />
        <path
          d="M74 64 L 86 30 L 124 34"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1.6"
          className="text-white"
        />
      </svg>
      <span
        className="absolute left-[46%] top-[38%] flex size-4 items-center justify-center rounded-full text-white shadow-lg"
        style={{ background: c.accent }}
      >
        <Navigation className="size-2" strokeWidth={3} fill="currentColor" />
      </span>
      {/* the pulse that says this is live rather than a screenshot */}
      <span
        className="absolute left-[46%] top-[38%] size-4 rounded-full"
        style={{
          background: c.accent,
          animation: 'phone-ripple 2.4s ease-out infinite',
          opacity: 0.22,
        }}
      />
    </span>
  )
}

/* ============================= FIELDLY ============================= *
 * Ops console. Dark by default, floating tab bar, and a board that stays
 * readable in a van at dusk.
 * =================================================================== */

const FIELDLY_JOBS = [
  {
    name: '14 Oak Street',
    trade: 'HVAC · Marcus D.',
    status: 'En route',
    tone: '#FF6B2C',
    time: '08:00',
  },
  {
    name: '82 Birch Avenue',
    trade: 'Plumbing · Ellie R.',
    status: 'On site',
    tone: '#FFC24B',
    time: '10:30',
  },
  {
    name: '3 Elm Road',
    trade: 'Electrical · Sam O.',
    status: 'Queued',
    tone: '#8C8F9B',
    time: '14:00',
  },
  {
    name: '55 Pine Close',
    trade: 'HVAC · Marcus D.',
    status: 'Queued',
    tone: '#8C8F9B',
    time: '16:15',
  },
]

/** Who is out, what they can sign off, and when they are free again. */
const FIELDLY_CREWS = [
  { name: 'Marcus D.', trade: 'HVAC · Gas Safe', until: 'Free 12:30', free: true },
  { name: 'Ellie R.', trade: 'Plumbing · L2', until: 'On site', free: false },
  { name: 'Sam O.', trade: 'Electrical · 18th', until: 'Free 15:00', free: true },
]

function FieldlyBoard({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [open, setOpen] = useChoice('fieldly.job', 0)

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <LargeTitle
        eyebrow="Tuesday 18 Nov"
        title="Dispatch"
        sub="4 jobs · 3 crews out · £2,410 booked"
      />

      <div className="mb-3 px-[1.05rem]">
        <Card className="flex items-center justify-around p-2.5">
          <Stat n="4" label="Jobs" />
          <span className="h-6 w-px" style={{ background: 'var(--hair)' }} />
          <Stat n="2" label="Rolling" tone={c.accent} />
          <span className="h-6 w-px" style={{ background: 'var(--hair)' }} />
          <Stat n="1" label="Done" />
        </Card>
      </div>

      <ListGroup header="The board">
        {FIELDLY_JOBS.map((j, i) => (
          <Row
            key={j.name}
            active={open === i}
            onTap={() => {
              setOpen(i)
              go(1)
            }}
            label={`Open ${j.name}`}
            chevron
            leading={
              <span className="flex items-center gap-2">
                <span
                  className="h-7 w-[3px] rounded-full"
                  style={{ background: j.tone }}
                />
                <span
                  className="text-[9px] font-extrabold tabular-nums"
                  style={{ color: 'var(--ink2)' }}
                >
                  {j.time}
                </span>
              </span>
            }
            title={j.name}
            sub={j.trade}
            trailing={
              <Pill tone={j.tone} solid={j.status === 'En route'}>
                {j.status}
              </Pill>
            }
          />
        ))}
      </ListGroup>

      {/* The half of the board that is actually the dispatcher's job.
          A day with nothing unassigned on it is a day that does not need a
          dispatch app, so the screen has to show the state it exists for. */}
      <ListGroup header="Waiting on a crew">
        <Row
          onTap={() => go(1)}
          label="Assign 9 Quarry Lane"
          chevron
          leading={
            <Glyph tone="#F0463C" soft>
              <Zap className="size-3" strokeWidth={2.6} />
            </Glyph>
          }
          title="9 Quarry Lane"
          sub="No heating · called 07:41"
          trailing={
            <Pill tone="#F0463C" solid>
              Urgent
            </Pill>
          }
        />
        <Row
          onTap={() => go(1)}
          label="Assign Unit 4, Mill Yard"
          chevron
          leading={
            <Glyph tone={c.accent} soft>
              <Clock className="size-3" strokeWidth={2.6} />
            </Glyph>
          }
          title="Unit 4, Mill Yard"
          sub="Annual service · any day this week"
          trailing={<Pill tone="#8C8F9B">Flexible</Pill>}
        />
      </ListGroup>

      {/* who is actually free, which is the question the board never answers */}
      <p
        className="mb-1.5 px-[1.05rem] text-[8px] font-extrabold uppercase tracking-[0.14em]"
        style={{ color: 'var(--ink2)' }}
      >
        Crews out
      </p>
      <Rail>
        {FIELDLY_CREWS.map((crew) => (
          <span
            key={crew.name}
            className="flex w-[104px] shrink-0 flex-col gap-1.5 rounded-xl p-2"
            style={{
              background: 'var(--card)',
              boxShadow: 'inset 0 0 0 0.5px var(--hair)',
            }}
          >
            <span className="flex items-center gap-1.5">
              <Avatar name={crew.name} size={18} tone={crew.free ? c.accent : undefined} />
              <span
                className="truncate text-[9.5px] font-extrabold"
                style={{ color: 'var(--ink)' }}
              >
                {crew.name}
              </span>
            </span>
            <span className="text-[8px]" style={{ color: 'var(--ink2)' }}>
              {crew.trade}
            </span>
            <span
              className="rounded-md px-1.5 py-0.5 text-center text-[8px] font-extrabold"
              style={{
                background: crew.free ? `${c.accent}1f` : 'var(--fill)',
                color: crew.free ? c.accent : 'var(--ink2)',
              }}
            >
              {crew.until}
            </span>
          </span>
        ))}
      </Rail>

      <div className="mt-3 px-[1.05rem]">
        <PrimaryButton label="Add a job" onTap={() => go(1)}>
          <Plus className="size-3" strokeWidth={3} />
          New job
        </PrimaryButton>
      </div>
    </AppCanvas>
  )
}

function FieldlyJob({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [state, setState] = useScreenState<'none' | 'signed' | 'invoiced'>(
    'fieldly.quote',
    'none',
  )
  const lines = [
    { l: 'Labour · 4h at £85', v: '£340.00' },
    { l: 'Pipe fittings & parts', v: '£120.00' },
    { l: 'Emergency call-out', v: '£75.00' },
  ]

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <NavBar back="Board" title="Job 1047" onBack={() => go(0)} right="Edit" />

      <div className="mb-3 px-[1.05rem]">
        <MapPlate c={c} />
      </div>

      <div className="mb-3 px-[1.05rem]">
        <Card className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p
                className="truncate text-[13px] font-extrabold"
                style={{ color: 'var(--ink)' }}
              >
                14 Oak Street
              </p>
              <p className="mt-0.5 text-[9.5px]" style={{ color: 'var(--ink2)' }}>
                Sarah Johnson · boiler service
              </p>
            </div>
            <Pill tone={c.accent} solid>
              En route
            </Pill>
          </div>

          <div className="mt-3 space-y-1.5">
            {lines.map((row) => (
              <div key={row.l} className="flex items-baseline justify-between gap-2">
                <span className="text-[10px]" style={{ color: 'var(--ink2)' }}>
                  {row.l}
                </span>
                <span
                  className="text-[10.5px] font-bold tabular-nums"
                  style={{ color: 'var(--ink)' }}
                >
                  {row.v}
                </span>
              </div>
            ))}
          </div>

          <div
            className="mt-2.5 flex items-baseline justify-between border-t pt-2"
            style={{ borderColor: 'var(--hair)' }}
          >
            <span className="text-[10px] font-extrabold" style={{ color: 'var(--ink)' }}>
              Total inc. VAT
            </span>
            <span
              className="text-[16.5px] font-extrabold tabular-nums"
              style={{ color: c.accent }}
            >
              £642.00
            </span>
          </div>
        </Card>
      </div>

      {/* The part of a job card that keeps an engineer out of a phone call:
          what was agreed, what is on the van, and what has to be signed off
          before the invoice is allowed to exist. */}
      <ListGroup header="Before you leave site">
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <Check className="size-3" strokeWidth={2.8} />
            </Glyph>
          }
          title="Parts on the van"
          sub="28mm valve · flue seal kit"
          trailing={<Pill tone="#1F9D55">In stock</Pill>}
        />
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <Flame className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="Gas safety check"
          sub="Required · certificate auto-issued"
          trailing={<Pill tone={c.accent2}>Due</Pill>}
        />
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <Clock className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="Next stop"
          sub="82 Birch Avenue · 14 min away"
          trailing={<span className="tabular-nums">10:30</span>}
        />
      </ListGroup>

      <div className="space-y-2 px-[1.05rem]">
        <PrimaryButton
          label={state === 'none' ? 'Take signature' : 'Convert to invoice'}
          tone={state === 'invoiced' ? '#1F9D55' : undefined}
          onTap={() => {
            if (state === 'invoiced') return
            if (state === 'none') setState('signed')
            else {
              setState('invoiced')
              window.setTimeout(() => go(2), 700)
            }
          }}
        >
          {state === 'none' ? (
            <>
              <Signature className="size-3" strokeWidth={2.6} />
              Get signature
            </>
          ) : state === 'signed' ? (
            <>
              <Zap className="size-3" strokeWidth={2.8} />
              Convert to invoice
            </>
          ) : (
            <>
              <Check className="size-3" strokeWidth={3} />
              Invoice sent
            </>
          )}
        </PrimaryButton>
        <GhostButton label="Call the customer">
          <Phone className="size-2.5" strokeWidth={2.6} />
          Call Sarah
        </GhostButton>
      </div>
    </AppCanvas>
  )
}

function FieldlyProof({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [shot, setShot] = useScreenState('fieldly.before', false)
  const [done, setDone] = useScreenState('fieldly.done', false)

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <NavBar back="Job" title="Proof" onBack={() => go(1)} />

      <div className="mb-3 grid grid-cols-2 gap-2 px-[1.05rem]">
        <div>
          <p
            className="mb-1 text-[8px] font-extrabold uppercase tracking-[0.14em]"
            style={{ color: 'var(--ink2)' }}
          >
            Before
          </p>
          <Tap ripple={c.accent} label="Take the before photo" onTap={() => setShot(true)}>
            <span
              className="flex aspect-[3/4] flex-col items-center justify-center gap-1 rounded-xl transition-all"
              style={
                shot
                  ? {
                      background: `linear-gradient(150deg, ${c.accent}, ${c.accent2})`,
                      color: '#fff',
                    }
                  : {
                      background: 'var(--fill)',
                      border: '1px dashed var(--hair)',
                      color: 'var(--ink2)',
                    }
              }
            >
              {shot ? (
                <Check className="size-5" strokeWidth={3} />
              ) : (
                <Camera className="size-4" strokeWidth={1.9} />
              )}
              <span className="text-[8px] font-bold">
                {shot ? '09:12' : 'Tap to shoot'}
              </span>
            </span>
          </Tap>
        </div>

        <div>
          <p
            className="mb-1 text-[8px] font-extrabold uppercase tracking-[0.14em]"
            style={{ color: c.accent }}
          >
            After
          </p>
          <span
            className="flex aspect-[3/4] flex-col items-center justify-center gap-1 rounded-xl text-white"
            style={{
              background: `linear-gradient(150deg, ${c.accent2}, ${c.accent})`,
            }}
          >
            <Check className="size-5" strokeWidth={3} />
            <span className="text-[8px] font-bold">11:48</span>
          </span>
        </div>
      </div>

      <ListGroup header="Attached to job 1047">
        <Row
          leading={<Glyph tone={c.accent} soft><Flame className="size-3" strokeWidth={2.4} /></Glyph>}
          title="Flue gas reading logged"
          sub="CO 0.002% · pass"
          trailing={<Check className="size-3" style={{ color: '#1F9D55' }} strokeWidth={3} />}
        />
        <Row
          leading={<Glyph tone={c.accent} soft><Clock className="size-3" strokeWidth={2.4} /></Glyph>}
          title="On site 2h 36m"
          sub="Auto-tracked from arrival"
          trailing={<span className="tabular-nums">09:12</span>}
        />
        <Row
          leading={<Glyph tone={c.accent} soft><Signature className="size-3" strokeWidth={2.4} /></Glyph>}
          title="Signed by S. Johnson"
          sub="On the doorstep, 11:52"
          trailing={<Check className="size-3" style={{ color: '#1F9D55' }} strokeWidth={3} />}
        />
      </ListGroup>

      {/* the note is what ends the dispute the photographs started */}
      <div className="mb-3 px-[1.05rem]">
        <Card className="p-2.5">
          <p
            className="text-[8px] font-extrabold uppercase tracking-[0.14em]"
            style={{ color: 'var(--ink2)' }}
          >
            Engineer’s note
          </p>
          <p
            className="mt-1.5 text-[10px] leading-[1.5]"
            style={{ color: 'var(--ink)' }}
          >
            Old expansion vessel had failed - replaced under warranty. Pressure
            reset to 1.2 bar and left running. Customer shown the isolation
            valve.
          </p>
          <p className="mt-2 text-[8px]" style={{ color: 'var(--ink2)' }}>
            Marcus D. · saved offline, synced 12:04
          </p>
        </Card>
      </div>

      <div className="px-[1.05rem]">
        <PrimaryButton
          label="Mark the job complete"
          tone={done ? '#1F9D55' : undefined}
          onTap={() => {
            setDone(true)
            window.setTimeout(() => go(3), 700)
          }}
        >
          {done ? (
            <>
              <Check className="size-3" strokeWidth={3} /> Completed
            </>
          ) : (
            'Mark complete'
          )}
        </PrimaryButton>
      </div>
    </AppCanvas>
  )
}

function FieldlyWeek({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [day, setDay] = useChoice('fieldly.day', 1)
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const rows = [
    { t: '08:00', label: 'HVAC · Oak St', span: 46, tone: c.accent },
    { t: '10:30', label: 'Plumbing · Birch Ave', span: 62, tone: c.accent2 },
    { t: '13:00', label: 'Lunch', span: 26, tone: 'var(--fill)' },
    { t: '14:00', label: 'Electrical · Elm Rd', span: 54, tone: '#4B5563' },
    { t: '16:15', label: 'HVAC · Pine Close', span: 38, tone: '#4B5563' },
  ]

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <LargeTitle eyebrow="Week 47" title="The Week" sub="18 jobs · 62% utilised" />

      <div className="mb-3 grid grid-cols-7 gap-1 px-[1.05rem]">
        {days.map((d, i) => (
          <Tap
            key={i}
            press={false}
            ripple={c.accent}
            label={`Show ${17 + i} November`}
            onTap={() => setDay(i)}
          >
            <span className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-bold" style={{ color: 'var(--ink2)' }}>
                {d}
              </span>
              <span
                className="flex size-6 items-center justify-center rounded-lg text-[10px] font-extrabold tabular-nums transition-all"
                style={
                  day === i
                    ? {
                        background: `linear-gradient(140deg, ${c.accent}, ${c.accent2})`,
                        color: '#fff',
                      }
                    : { background: 'var(--fill)', color: 'var(--ink2)' }
                }
              >
                {17 + i}
              </span>
            </span>
          </Tap>
        ))}
      </div>

      <div className="space-y-1.5 px-[1.05rem]">
        {rows.map((r) => (
          <Tap key={r.t} ripple={c.accent} label={`Open ${r.label}`} onTap={() => go(1)}>
            <span className="flex items-center gap-2">
              <span
                className="w-7 shrink-0 text-[8px] font-bold tabular-nums"
                style={{ color: 'var(--ink2)' }}
              >
                {r.t}
              </span>
              <span className="flex-1">
                <span
                  className="flex h-6 items-center rounded-md px-2 text-[9px] font-bold"
                  style={{
                    width: `${r.span}%`,
                    minWidth: '42%',
                    background: r.tone,
                    color: r.tone === 'var(--fill)' ? 'var(--ink2)' : '#fff',
                  }}
                >
                  {r.label}
                </span>
              </span>
            </span>
          </Tap>
        ))}
      </div>

      {/* What a week view is actually for. A row of coloured bars says how the
          day is arranged; only the numbers say whether the week is any good,
          and only the gap list says what to do about it. */}
      <div className="mt-3 mb-3 px-[1.05rem]">
        <Card className="flex items-center justify-around p-2.5">
          <Stat n="18" label="Jobs" />
          <span className="h-6 w-px" style={{ background: 'var(--hair)' }} />
          <Stat n="62%" label="Utilised" tone={c.accent} />
          <span className="h-6 w-px" style={{ background: 'var(--hair)' }} />
          <Stat n="£9.4k" label="Booked" />
        </Card>
      </div>

      <ListGroup header="Gaps worth filling">
        <Row
          onTap={() => go(0)}
          label="Fill Wednesday morning"
          chevron
          leading={
            <Glyph tone={c.accent2} soft>
              <Clock className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="Wed 09:00 – 12:00"
          sub="Ellie R. free · 3 hours"
          trailing={<Pill tone={c.accent2}>3h</Pill>}
        />
        <Row
          onTap={() => go(0)}
          label="Fill Friday afternoon"
          chevron
          leading={
            <Glyph tone={c.accent2} soft>
              <Clock className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="Fri 13:00 – 17:00"
          sub="Sam O. free · 4 hours"
          trailing={<Pill tone={c.accent2}>4h</Pill>}
        />
      </ListGroup>
    </AppCanvas>
  )
}

/* ============================== STAMP ============================== *
 * Wallet-first. A warm, paper-feeling deck of cards that lifts when picked,
 * behind a cream frosted bar.
 * =================================================================== */

const STAMP_SHOPS = [
  { name: 'Brew & Co', kind: 'Coffee', tone: '#F5333B', note: '9 of 10 stamps' },
  { name: 'Corner Mart', kind: 'Grocery', tone: '#FF9563', note: '340 points' },
  { name: 'Sunny Bakes', kind: 'Bakery', tone: '#C2410C', note: '5 of 8 stamps' },
]

function StampWallet({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [picked, setPicked] = useChoice('stamp.card', 0)

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <LargeTitle eyebrow="Good morning" title="Jamie" sub="3 cards · 2 rewards ready" />

      {/* the balance card is the one big object in the app */}
      <div className="mb-4 px-[1.05rem]" data-phone-reveal>
        <Tap ripple="#ffffff" label="See rewards" onTap={() => go(2)}>
          <span
            className="relative block overflow-hidden rounded-2xl p-3.5 text-left text-white"
            style={{
              background: `linear-gradient(135deg, ${c.accent} 0%, ${c.accent2} 100%)`,
              boxShadow: `0 14px 30px -14px ${c.accent}`,
            }}
          >
            <span
              aria-hidden="true"
              className="absolute -right-6 -top-8 size-24 rounded-full"
              style={{ background: 'rgba(255,255,255,0.16)' }}
            />
            <span className="relative block text-[9px] font-bold uppercase tracking-[0.16em] text-white/75">
              Points balance
            </span>
            <span className="relative mt-1 block text-[28.5px] font-extrabold leading-none tracking-[-0.03em] tabular-nums">
              1,240
            </span>
            <span className="relative mt-2 flex items-center gap-1 text-[9.5px] font-semibold text-white/80">
              <Sparkles className="size-2.5" strokeWidth={2.6} />2 rewards ready to claim
            </span>
          </span>
        </Tap>
      </div>

      {/* the deck - cards overlap the way they would in a wallet, and the
          chosen one lifts clear of the ones below it */}
      <p
        className="mb-2 px-[1.05rem] text-[8px] font-extrabold uppercase tracking-[0.14em]"
        style={{ color: 'var(--ink2)' }}
      >
        Your cards
      </p>
      <div className="px-[1.05rem]">
        {STAMP_SHOPS.map((s, i) => (
          <Tap
            key={s.name}
            ripple="#ffffff"
            label={`Open the ${s.name} card`}
            onTap={() => {
              setPicked(i)
              go(1)
            }}
          >
            <span
              className="relative block rounded-xl p-2.5 text-left transition-all duration-300"
              style={{
                background: `linear-gradient(120deg, ${s.tone} 0%, color-mix(in srgb, ${s.tone} 62%, #2A1E1A) 100%)`,
                color: '#fff',
                marginTop: i === 0 ? 0 : -10,
                zIndex: i,
                transform: picked === i ? 'translateY(-6px)' : undefined,
                boxShadow:
                  picked === i
                    ? `0 14px 26px -12px ${s.tone}`
                    : '0 6px 14px -10px rgba(42,30,26,0.7)',
              }}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-extrabold">
                    {s.name}
                  </span>
                  <span className="block text-[9px] text-white/70">{s.kind}</span>
                </span>
                <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[8px] font-bold">
                  {s.note}
                </span>
              </span>
            </span>
          </Tap>
        ))}
      </div>

      {/* The thing a paper card cannot do, said out loud: a wallet that
          remembers. Without this the screen is a stack of cards and nothing
          else, which is exactly what the shop already had. */}
      <ListGroup header="This week">
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <Sparkles className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="Double stamps at Brew & Co"
          sub="Until 4pm today"
          trailing={<Pill tone={c.accent} solid>2×</Pill>}
          onTap={() => go(1)}
          label="Open the Brew & Co card"
          chevron
        />
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <Gift className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="One stamp from a free coffee"
          sub="Brew & Co · 9 of 10"
          trailing={<span className="tabular-nums">9/10</span>}
        />
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <QrCode className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="Stamped at Corner Mart"
          sub="Saturday, 11:20"
          trailing={<span className="tabular-nums">+1</span>}
        />
      </ListGroup>
    </AppCanvas>
  )
}

function StampCard({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [stamps, setStamps] = useScreenState('stamp.stamps', 9)
  const full = stamps >= 10

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <NavBar back="Wallet" title="Brew & Co" onBack={() => go(0)} />

      <div className="mb-3 px-[1.05rem]">
        <Card className="p-3.5">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="flex aspect-square items-center justify-center rounded-full transition-all duration-500"
                style={
                  i < stamps
                    ? {
                        background: `linear-gradient(140deg, ${c.accent}, ${c.accent2})`,
                        color: '#fff',
                        transform: i === stamps - 1 ? 'scale(1.08)' : undefined,
                      }
                    : {
                        border: '1.5px dashed color-mix(in srgb, var(--ink2) 45%, transparent)',
                        color: 'transparent',
                      }
                }
              >
                {i < stamps ? <Check className="size-3" strokeWidth={3.4} /> : null}
              </span>
            ))}
          </div>

          <p
            className="mt-3 text-center text-[10.5px] font-bold"
            style={{ color: full ? c.accent : 'var(--ink)' }}
          >
            {full
              ? 'Card full - the next one is on the house'
              : `${10 - stamps} more and the next one is free`}
          </p>
        </Card>
      </div>

      <ListGroup header="This card">
        <Row title="Earned since March" trailing="47 stamps" />
        <Row title="Free coffees claimed" trailing="4" />
        <Row title="Last visit" trailing="Yesterday" />
        <Row title="Usual order" trailing="Flat white" />
      </ListGroup>

      {/* the shop side of the card - the half a rubber stamp never had */}
      <ListGroup header="From the shop">
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <Sparkles className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="Double stamps until 4pm"
          sub="Tuesdays are quiet - help us out"
          trailing={<Pill tone={c.accent} solid>Live</Pill>}
        />
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <MapPin className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="17 Grove Street"
          sub="Open until 17:00 · 4 min walk"
          trailing={<Pill tone="#1F9D55">Open</Pill>}
        />
      </ListGroup>

      <div className="px-[1.05rem]">
        <PrimaryButton
          label={full ? 'Claim the free coffee' : 'Scan at the till'}
          tone={full ? '#1F9D55' : undefined}
          onTap={() => (full ? go(2) : setStamps((n) => n + 1))}
        >
          {full ? (
            <>
              <Gift className="size-3" strokeWidth={2.6} />
              Claim free coffee
            </>
          ) : (
            <>
              <QrCode className="size-3" strokeWidth={2.6} />
              Scan to stamp
            </>
          )}
        </PrimaryButton>
      </div>
    </AppCanvas>
  )
}

function StampRewards({ c }: ScreenProps) {
  const [tab, setTab] = useChoice('stamp.tab', 0)
  const [points, setPoints] = useScreenState('stamp.points', 1240)
  const [taken, setTaken] = useScreenState<Array<string>>('stamp.taken', [])

  const rewards = [
    { name: 'Free filter coffee', price: 500, shop: 'Brew & Co' },
    { name: '10% off the whole order', price: 300, shop: 'Corner Mart' },
    { name: 'Any pastry, free', price: 400, shop: 'Sunny Bakes' },
    { name: 'Bag of house beans', price: 1200, shop: 'Brew & Co' },
  ]
  const shown = rewards.filter((r) =>
    tab === 0 ? !taken.includes(r.name) : taken.includes(r.name),
  )

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <LargeTitle
        title="Rewards"
        sub={`${points.toLocaleString()} points to spend`}
        right={
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-extrabold tabular-nums text-white"
            style={{ background: `linear-gradient(130deg, ${c.accent}, ${c.accent2})` }}
          >
            {points.toLocaleString()}
          </span>
        }
      />

      <Segmented items={['Available', 'Claimed']} value={tab} onChange={setTab} />

      <ListGroup>
        {shown.map((r) => {
          const claimed = taken.includes(r.name)
          const afford = points >= r.price
          return (
            <Row
              key={r.name}
              onTap={
                claimed || !afford
                  ? undefined
                  : () => {
                      setTaken((cur) => [...cur, r.name])
                      setPoints((p) => p - r.price)
                    }
              }
              label={`Claim ${r.name}`}
              leading={
                <Glyph tone={c.accent} soft={!afford || claimed}>
                  <Gift className="size-3" strokeWidth={2.4} />
                </Glyph>
              }
              title={r.name}
              sub={`${r.shop} · ${r.price} pts`}
              trailing={
                <Pill
                  tone={claimed ? '#1F9D55' : afford ? c.accent : undefined}
                  solid={!claimed && afford}
                >
                  {claimed ? 'Claimed' : afford ? 'Claim' : 'Short'}
                </Pill>
              }
            />
          )
        })}
        {shown.length === 0 ? (
          <div className="px-3 py-6 text-center text-[10px]" style={{ color: 'var(--ink2)' }}>
            {tab === 0 ? 'Everything claimed. Go get a coffee.' : 'Nothing claimed yet.'}
          </div>
        ) : null}
      </ListGroup>

      {/* the next one up, with the gap made visible - a points balance on its
          own is a number, and a number does not get anybody through a door */}
      <div className="mb-3 px-[1.05rem]">
        <Card className="p-3">
          <div className="flex items-baseline justify-between">
            <p className="text-[10.5px] font-extrabold" style={{ color: 'var(--ink)' }}>
              Bag of house beans
            </p>
            <p
              className="text-[9px] font-bold tabular-nums"
              style={{ color: 'var(--ink2)' }}
            >
              {points.toLocaleString()} / 1,200
            </p>
          </div>
          <div className="mt-2">
            <Track pct={Math.min(100, (points / 1200) * 100)} tone={c.accent} />
          </div>
          <p className="mt-2 text-[9px]" style={{ color: 'var(--ink2)' }}>
            About four more visits at Brew &amp; Co.
          </p>
        </Card>
      </div>

      <ListGroup header="Ending soon">
        <Row
          leading={
            <Glyph tone={c.accent2} soft>
              <Clock className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="Sunny Bakes · free cookie"
          sub="Expires Sunday"
          trailing={<Pill tone={c.accent2}>3 days</Pill>}
        />
        <Row
          leading={
            <Glyph tone={c.accent2} soft>
              <Clock className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="Corner Mart · bonus points"
          sub="Expires tonight"
          trailing={<Pill tone="#F0463C" solid>Today</Pill>}
        />
      </ListGroup>
    </AppCanvas>
  )
}

function StampNearby({ c }: ScreenProps) {
  const { go } = usePhoneNav()

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <LargeTitle title="Nearby" sub="3 live offers within a 10 minute walk" />

      <div className="mb-3 px-[1.05rem]">
        <MapPlate c={c} height={94} />
      </div>

      <ListGroup header="On your way home">
        {[
          { name: 'Brew & Co', offer: 'Double stamps until 4pm', dist: '0.2 km' },
          { name: 'Corner Mart', offer: 'Bonus 200 points today', dist: '0.4 km' },
          { name: 'Sunny Bakes', offer: 'Free cookie with any drink', dist: '0.6 km' },
        ].map((o, i) => (
          <Row
            key={o.name}
            onTap={() => go(1)}
            label={`Open ${o.name}`}
            chevron
            leading={<Avatar name={o.name} tone={STAMP_SHOPS[i]?.tone} size={24} />}
            title={o.name}
            sub={o.offer}
            trailing={<span className="tabular-nums">{o.dist}</span>}
          />
        ))}
      </ListGroup>

      <ListGroup header="New round here">
        <Row
          onTap={() => go(1)}
          label="Open Alder & Rye"
          chevron
          leading={<Avatar name="Alder Rye" tone={c.accent2} size={24} />}
          title="Alder & Rye"
          sub="Bakery · joined last week"
          trailing={<Pill tone={c.accent} solid>New</Pill>}
        />
        <Row
          onTap={() => go(1)}
          label="Open The Print Room"
          chevron
          leading={<Avatar name="Print Room" tone={c.accent} size={24} />}
          title="The Print Room"
          sub="Coffee & stationery · 0.9 km"
          trailing={<span className="tabular-nums">0.9 km</span>}
        />
      </ListGroup>

      <div className="px-[1.05rem]">
        <GhostButton label="See every shop on the map">
          <MapPin className="size-2.5" strokeWidth={2.6} />
          All 24 shops nearby
        </GhostButton>
      </div>
    </AppCanvas>
  )
}

/* ============================== SLATE ============================== *
 * Calendar-first. The week never leaves the screen, and confirmation arrives
 * as a sheet over the booking rather than as another page.
 * =================================================================== */

const SLATE_SLOTS = ['9:00', '9:30', '10:00', '11:00', '14:00', '15:30']
const SLATE_TAKEN = [2, 4]

function SlateBook({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [day, setDay] = useChoice('slate.day', 1)
  const [slot, setSlot] = useChoice('slate.slot', 0)
  const [sheet, setSheet] = useScreenState('slate.sheet', false)
  const days = [17, 18, 19, 20, 21, 22, 23]
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <AppCanvas
      c={c}
      chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}
      sheetOpen={sheet}
      sheet={
        <Sheet open={sheet} onDismiss={() => setSheet(false)}>
            <p className="text-[13px] font-extrabold" style={{ color: 'var(--ink)' }}>
              Confirm this booking
            </p>
            <p className="mt-0.5 text-[10px]" style={{ color: 'var(--ink2)' }}>
              Cut &amp; style with Ana · 45 min
            </p>
            <div className="my-2.5 flex items-center gap-2">
              <span
                className="flex-1 rounded-lg px-2.5 py-2 text-center"
                style={{ background: 'var(--fill)' }}
              >
                <span className="block text-[9px]" style={{ color: 'var(--ink2)' }}>
                  Date
                </span>
                <span
                  className="mt-0.5 block text-[11px] font-extrabold"
                  style={{ color: 'var(--ink)' }}
                >
                  {days[day]} Nov
                </span>
              </span>
              <span
                className="flex-1 rounded-lg px-2.5 py-2 text-center"
                style={{ background: 'var(--fill)' }}
              >
                <span className="block text-[9px]" style={{ color: 'var(--ink2)' }}>
                  Time
                </span>
                <span
                  className="mt-0.5 block text-[11px] font-extrabold"
                  style={{ color: 'var(--ink)' }}
                >
                  {SLATE_SLOTS[slot]}
                </span>
              </span>
            </div>
            <PrimaryButton
              label="Confirm the booking"
              onTap={() => {
                setSheet(false)
                window.setTimeout(() => go(1), 260)
              }}
            >
              Confirm booking
            </PrimaryButton>
        </Sheet>
      }
    >
      <StatusBar />
      <LargeTitle eyebrow="Ana's Studio" title="Pick a time" />

      <div className="mb-3 px-[1.05rem]">
        <span
          className="flex items-center gap-2 rounded-xl px-2.5 py-2"
          style={{ background: `color-mix(in srgb, ${c.accent} 12%, transparent)` }}
        >
          <Check className="size-3" style={{ color: c.accent }} strokeWidth={3} />
          <span className="text-[10.5px] font-bold" style={{ color: 'var(--ink)' }}>
            Cut &amp; style · 45 min · £38
          </span>
        </span>
      </div>

      {/* the week strip is the spine of the whole app and never scrolls away */}
      <div className="mb-3 grid grid-cols-7 gap-1 px-[1.05rem]">
        {days.map((d, i) => (
          <Tap
            key={d}
            press={false}
            ripple={c.accent}
            label={`Choose ${d} November`}
            onTap={() => setDay(i)}
          >
            <span className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-bold" style={{ color: 'var(--ink2)' }}>
                {labels[i]}
              </span>
              <span
                className="flex size-6 items-center justify-center rounded-full text-[10px] font-extrabold tabular-nums transition-all"
                style={
                  day === i
                    ? { background: c.accent, color: '#fff' }
                    : { color: 'var(--ink2)' }
                }
              >
                {d}
              </span>
            </span>
          </Tap>
        ))}
      </div>

      <div className="mb-3 grid grid-cols-3 gap-1.5 px-[1.05rem]">
        {SLATE_SLOTS.map((s, i) => {
          const gone = SLATE_TAKEN.includes(i)
          return (
            <Tap
              key={s}
              press={false}
              ripple={c.accent}
              disabled={gone}
              label={gone ? `${s} is taken` : `Choose ${s}`}
              onTap={() => setSlot(i)}
            >
              <span
                className="block rounded-lg py-2 text-center text-[10px] font-extrabold tabular-nums transition-all"
                style={
                  gone
                    ? {
                        background: 'var(--fill)',
                        color: 'var(--ink2)',
                        opacity: 0.45,
                        textDecoration: 'line-through',
                      }
                    : slot === i
                      ? { background: c.accent, color: '#fff' }
                      : {
                          background: `color-mix(in srgb, ${c.accent2} 26%, transparent)`,
                          color: 'var(--ink)',
                        }
                }
              >
                {s}
              </span>
            </Tap>
          )
        })}
      </div>

      <div className="px-[1.05rem]">
        <PrimaryButton label="Review the booking" onTap={() => setSheet(true)}>
          Book {days[day]} Nov at {SLATE_SLOTS[slot]}
        </PrimaryButton>
      </div>

      {/* Everything a one-chair salon would otherwise have to say on the
          phone: what it is, how long it takes, and who you are seeing. The
          grid of times alone makes a booking screen; this makes it a shop. */}
      <ListGroup header="What you’re booking">
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <Sparkles className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="Cut & finish"
          sub="45 minutes · £38"
          trailing={<Pill tone={c.accent} solid>Chosen</Pill>}
        />
        <Row
          leading={<Avatar name="Nadia K" size={22} tone={c.accent} />}
          title="Nadia K."
          sub="Your usual stylist"
          trailing={<Pill tone={c.accent2}>Same as last</Pill>}
        />
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <MapPin className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="8 Fellgate Row"
          sub="Ring the top bell · 6 min walk"
          trailing={<ChevronRight className="size-3" strokeWidth={2.6} />}
        />
      </ListGroup>

      <div className="mb-1 px-[1.05rem]">
        <Card className="p-2.5">
          <p className="text-[9.5px] leading-[1.5]" style={{ color: 'var(--ink2)' }}>
            <span className="font-extrabold" style={{ color: 'var(--ink)' }}>
              No deposit.
            </span>{' '}
            Free to move or cancel up to two hours before. A reminder lands the
            morning of, when you can still do something about it.
          </p>
        </Card>
      </div>
    </AppCanvas>
  )
}

function SlateConfirmed({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [added, setAdded] = useScreenState('slate.calendar', false)

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />

      <div className="flex flex-col items-center px-[1.05rem] pt-2" data-phone-reveal>
        <span
          className="flex size-14 items-center justify-center rounded-full text-white"
          style={{
            background: `linear-gradient(140deg, ${c.accent}, ${c.accent2})`,
            boxShadow: `0 12px 26px -12px ${c.accent}`,
          }}
        >
          <Check className="size-7" strokeWidth={3} />
        </span>
        <p
          className="mt-3 text-[19px] font-extrabold tracking-[-0.02em]"
          style={{ color: 'var(--ink)' }}
        >
          You&rsquo;re booked
        </p>
        <p className="mt-1 text-[10px]" style={{ color: 'var(--ink2)' }}>
          A reminder lands the morning before
        </p>
      </div>

      {/* a ticket stub rather than a table - the notch is what makes it read
          as something torn off and kept */}
      <div className="mt-4 px-[1.05rem]">
        <Card className="overflow-hidden p-0">
          <div
            className="px-3 py-2.5 text-white"
            style={{ background: `linear-gradient(120deg, ${c.accentInk}, ${c.accent})` }}
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/70">
              Ana&rsquo;s Studio
            </p>
            <p className="mt-0.5 text-[14.5px] font-extrabold">Cut &amp; style</p>
          </div>

          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-1.5 top-0 size-3 -translate-y-1/2 rounded-full"
              style={{ background: c.appBg[0] }}
            />
            <span
              aria-hidden="true"
              className="absolute -right-1.5 top-0 size-3 -translate-y-1/2 rounded-full"
              style={{ background: c.appBg[0] }}
            />
            <div
              className="border-t border-dashed"
              style={{ borderColor: 'var(--hair)' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-1 p-3">
            <Stat n="18" label="Nov" />
            <Stat n="9:00" label="Start" tone={c.accent} />
            <Stat n="45m" label="Length" />
          </div>
        </Card>
      </div>

      <div className="mt-3 space-y-2 px-[1.05rem]">
        <PrimaryButton
          label="Add to the phone calendar"
          tone={added ? '#1F9D55' : undefined}
          onTap={() => {
            setAdded(true)
            window.setTimeout(() => go(2), 700)
          }}
        >
          {added ? (
            <>
              <Check className="size-3" strokeWidth={3} /> In your calendar
            </>
          ) : (
            'Add to calendar'
          )}
        </PrimaryButton>
        <GhostButton label="Book another time" onTap={() => go(0)}>
          Book another
        </GhostButton>
      </div>

      {/* The half of "confirmed" that stops a no-show: when they will be
          reminded, and how they get out of it without ringing anybody. */}
      <ListGroup header="What happens next">
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <Check className="size-3" strokeWidth={2.8} />
            </Glyph>
          }
          title="Confirmation sent"
          sub="To your phone, just now"
          trailing={<span className="tabular-nums">now</span>}
        />
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <Clock className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="Reminder, morning of"
          sub="07:30 - while you can still move it"
          trailing={<Pill tone={c.accent2}>Tue</Pill>}
        />
        <Row
          onTap={() => go(0)}
          label="Move or cancel this visit"
          chevron
          leading={
            <Glyph tone={c.accent} soft>
              <Navigation className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="Move or cancel"
          sub="Free until 07:00 on the day"
        />
      </ListGroup>
    </AppCanvas>
  )
}

function SlateVisits({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [tab, setTab] = useChoice('slate.tab', 0)
  const [cancelled, setCancelled] = useScreenState<Array<string>>('slate.cancelled', [])

  const upcoming = [
    { s: 'Cut & style', t: 'Mon 18 Nov · 9:00', who: 'Ana' },
    { s: 'Deep conditioning', t: 'Thu 21 Nov · 14:30', who: 'Ana' },
  ]
  const past = [
    { s: 'Cut & style', t: 'Mon 21 Oct · 9:00', who: 'Ana' },
    { s: 'Fringe trim', t: 'Fri 4 Oct · 17:15', who: 'Jo' },
  ]
  const shown = (tab === 0 ? upcoming : past).filter((v) => !cancelled.includes(v.s))

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <LargeTitle title="My visits" />
      <Segmented items={['Upcoming', 'Past']} value={tab} onChange={setTab} />

      <div className="space-y-2 px-[1.05rem]">
        {shown.map((v) => (
          <Card key={v.s} className="p-2.5">
            <div className="flex items-center gap-2">
              <Avatar name={v.who} size={24} />
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-[11px] font-extrabold"
                  style={{ color: 'var(--ink)' }}
                >
                  {v.s}
                </p>
                <p className="text-[9px]" style={{ color: 'var(--ink2)' }}>
                  {v.t}
                </p>
              </div>
              <Pill tone={tab === 0 ? c.accent : undefined} solid={tab === 0}>
                {tab === 0 ? 'Booked' : 'Done'}
              </Pill>
            </div>

            <div className="mt-2 flex gap-1.5">
              <Tap
                ripple={c.accent}
                className="flex-1"
                label={tab === 0 ? `Move ${v.s}` : `Book ${v.s} again`}
                onTap={() => go(0)}
              >
                <span
                  className="block rounded-lg py-1.5 text-center text-[9px] font-bold"
                  style={{ background: 'var(--fill)', color: 'var(--ink)' }}
                >
                  {tab === 0 ? 'Move it' : 'Book again'}
                </span>
              </Tap>
              {tab === 0 ? (
                <Tap
                  ripple="#DC2626"
                  className="flex-1"
                  label={`Cancel ${v.s}`}
                  onTap={() => setCancelled((cur) => [...cur, v.s])}
                >
                  <span
                    className="block rounded-lg py-1.5 text-center text-[9px] font-bold"
                    style={{ background: 'rgba(220,38,38,0.1)', color: '#DC2626' }}
                  >
                    Cancel
                  </span>
                </Tap>
              ) : null}
            </div>
          </Card>
        ))}

        {shown.length === 0 ? (
          <p className="py-8 text-center text-[10px]" style={{ color: 'var(--ink2)' }}>
            Nothing here. Pick a time to add one.
          </p>
        ) : null}
      </div>

      {/* What the salon knows about you, sitting on the booking rather than in
          someone's head - which is the only reason a regular tolerates
          booking through an app instead of texting. */}
      <ListGroup header="On your record">
        <Row title="Usual service" trailing="Cut & finish" />
        <Row title="Usual stylist" trailing="Nadia K." />
        <Row title="Colour last used" trailing="6.1 ash" />
        <Row title="Visits this year" trailing="7" />
      </ListGroup>

      <div className="px-[1.05rem]">
        <PrimaryButton label="Book the same again" onTap={() => go(0)}>
          Book the same again
        </PrimaryButton>
      </div>
    </AppCanvas>
  )
}

function SlateDesk({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [picked, setPicked] = useChoice('slate.picked', -1)
  const rows = [
    { t: '9:00', name: 'Sarah M.', kind: 'Cut & style', taken: true },
    { t: '10:15', name: 'Priya K.', kind: 'Colour', taken: true },
    { t: '11:30', name: 'Open', kind: 'Tap to fill', taken: false },
    { t: '13:00', name: 'Tom R.', kind: 'Beard trim', taken: true },
    { t: '15:30', name: 'Open', kind: 'Tap to fill', taken: false },
  ]

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <LargeTitle
        eyebrow="Mon 18 Nov"
        title="Front desk"
        sub="3 booked · 2 gaps · £114 on the day"
      />

      {/* a real time rail: the column of hours, the blocks, and where now is */}
      <div className="relative px-[1.05rem]">
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[2.6rem] top-1 w-px"
          style={{ background: 'var(--hair)' }}
        />

        <div className="space-y-1.5">
          {rows.map((r, i) => (
            <Tap
              key={r.t}
              ripple={c.accent}
              label={r.taken ? `Open ${r.name}` : `Fill the ${r.t} gap`}
              onTap={() => {
                setPicked(i)
                if (!r.taken) go(0)
              }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-7 shrink-0 text-right text-[8px] font-bold tabular-nums"
                  style={{ color: 'var(--ink2)' }}
                >
                  {r.t}
                </span>
                <span
                  className="relative z-10 size-1.5 shrink-0 rounded-full"
                  style={{ background: r.taken ? c.accent : 'var(--hair)' }}
                />
                <span
                  className="flex flex-1 items-center justify-between rounded-lg px-2 py-1.5 transition-shadow"
                  style={{
                    background: r.taken
                      ? `color-mix(in srgb, ${c.accent} 12%, transparent)`
                      : 'var(--fill)',
                    boxShadow: picked === i ? `inset 0 0 0 1px ${c.accent}` : undefined,
                    borderLeft: r.taken ? 'none' : `2px dashed var(--hair)`,
                  }}
                >
                  <span className="min-w-0">
                    <span
                      className="block truncate text-[10px] font-bold"
                      style={{ color: r.taken ? 'var(--ink)' : 'var(--ink2)' }}
                    >
                      {r.name}
                    </span>
                    <span className="block text-[8px]" style={{ color: 'var(--ink2)' }}>
                      {r.kind}
                    </span>
                  </span>
                  {!r.taken ? (
                    <Plus className="size-3 shrink-0" style={{ color: c.accent }} strokeWidth={3} />
                  ) : null}
                </span>
              </span>
            </Tap>
          ))}
        </div>
      </div>

      {/* The counter's own view: the day in numbers, and the two things
          somebody standing at the desk actually does with a gap. */}
      <div className="mt-3 mb-3 px-[1.05rem]">
        <Card className="flex items-center justify-around p-2.5">
          <Stat n="3" label="Booked" />
          <span className="h-6 w-px" style={{ background: 'var(--hair)' }} />
          <Stat n="2" label="Gaps" tone={c.accent} />
          <span className="h-6 w-px" style={{ background: 'var(--hair)' }} />
          <Stat n="£114" label="On the day" />
        </Card>
      </div>

      <ListGroup header="Waiting for a cancellation">
        <Row
          onTap={() => go(0)}
          label="Offer the 11:30 to Dee W."
          chevron
          leading={<Avatar name="Dee W" size={22} tone={c.accent} />}
          title="Dee W."
          sub="Wants any morning this week"
          trailing={<Pill tone={c.accent} solid>Offer 11:30</Pill>}
        />
        <Row
          onTap={() => go(0)}
          label="Offer the 15:30 to Marcus L."
          chevron
          leading={<Avatar name="Marcus L" size={22} tone={c.accent2} />}
          title="Marcus L."
          sub="Beard trim · after 3pm only"
          trailing={<Pill tone={c.accent2}>Offer 15:30</Pill>}
        />
      </ListGroup>
    </AppCanvas>
  )
}

/* ============================== PROPHY ============================= *
 * Chart-first. Everything is a card with one job, and red appears exactly
 * once in the whole app.
 * =================================================================== */

const PROPHY_PATIENTS = [
  { name: 'Sarah Malik', due: 'Overdue 12 days', overdue: true, last: 'Mar 24' },
  { name: 'Tom Reilly', due: 'Due in 3 days', overdue: false, last: 'May 12' },
  { name: 'Priya Kaur', due: 'Due in 9 days', overdue: false, last: 'May 18' },
  { name: 'Alex Nunez', due: 'Due in 3 weeks', overdue: false, last: 'Jun 02' },
]

function ProphyRecall({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [tab, setTab] = useChoice('prophy.tab', 0)
  const [booked, setBooked] = useScreenState<Array<string>>('prophy.booked', [])
  const shown = PROPHY_PATIENTS.filter((p) => (tab === 0 ? p.overdue : !p.overdue))

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <LargeTitle
        eyebrow="November"
        title="Recall"
        sub="14 patients due · 3 already booked"
      />
      <SearchField placeholder="Search patients" />
      <Segmented items={['Overdue', 'Due soon']} value={tab} onChange={setTab} />

      <ListGroup>
        {shown.map((p) => {
          const done = booked.includes(p.name)
          return (
            <Row
              key={p.name}
              onTap={() => {
                setBooked((cur) => (cur.includes(p.name) ? cur : [...cur, p.name]))
                window.setTimeout(() => go(1), 500)
              }}
              label={`Open ${p.name}`}
              leading={
                <Avatar name={p.name} tone={p.overdue ? '#F5333B' : c.accent} size={26} />
              }
              title={p.name}
              sub={`Last seen ${p.last}`}
              trailing={
                <Pill
                  tone={done ? c.accent : p.overdue ? '#F5333B' : undefined}
                  solid={done || p.overdue}
                >
                  {done ? 'Booked' : p.due}
                </Pill>
              }
            />
          )
        })}
      </ListGroup>

      <div className="px-[1.05rem]">
        <Card className="p-3">
          <p
            className="text-[8px] font-extrabold uppercase tracking-[0.14em]"
            style={{ color: 'var(--ink2)' }}
          >
            Recall rate, last 6 months
          </p>
          <div className="mt-2.5 flex h-12 items-end gap-1.5">
            {[42, 58, 46, 68, 55, 79].map((h, i) => (
              <span
                key={i}
                data-phone-bar
                className="flex-1 rounded-t"
                style={{
                  height: `${h}%`,
                  background:
                    i === 5
                      ? `linear-gradient(to top, ${c.accent}, ${c.accent2})`
                      : 'var(--fill)',
                }}
              />
            ))}
          </div>
          <div
            className="mt-1.5 flex justify-between text-[7.5px] font-bold"
            style={{ color: 'var(--ink2)' }}
          >
            {['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((m) => (
              <span key={m} className="flex-1 text-center">
                {m}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Recall is a chase, not a report. The list says who is overdue; this
          says what has already been done about it and what has not - which is
          the only part that stops the same patient being rung twice. */}
      <ListGroup header="Chased this week">
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <Check className="size-3" strokeWidth={2.8} />
            </Glyph>
          }
          title="14 reminders sent"
          sub="Text, then email at day three"
          trailing={<Pill tone="#1F9D55">Done</Pill>}
        />
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <Phone className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="3 need a call"
          sub="No answer after two reminders"
          trailing={<Pill tone={c.accent} solid>Today</Pill>}
          onTap={() => go(2)}
          label="See who needs a call"
          chevron
        />
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <Sparkles className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="9 rebooked"
          sub="Straight from the reminder"
          trailing={<span className="tabular-nums">64%</span>}
        />
      </ListGroup>
    </AppCanvas>
  )
}

function ProphyChart({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [tooth, setTooth] = useChoice('prophy.tooth', 12)
  // a chart where nothing can be marked is a picture of a chart
  const [flagged, setFlagged] = useScreenState<Array<number>>(
    'prophy.flagged',
    [3, 12],
  )

  const upper = [18, 17, 16, 15, 14, 13, 12, 11]
  const lower = [48, 47, 46, 45, 44, 43, 42, 41]

  const ToothRow = ({ teeth, offset }: { teeth: number[]; offset: number }) => (
    <div className="grid grid-cols-8 gap-1">
      {teeth.map((t, i) => {
        const idx = offset + i
        const on = flagged.includes(idx)
        const sel = tooth === idx
        return (
          <Tap
            key={t}
            press={false}
            ripple={c.accent}
            label={`Tooth ${t}`}
            onTap={() => {
              setTooth(idx)
              setFlagged((cur) =>
                cur.includes(idx) ? cur.filter((n) => n !== idx) : [...cur, idx],
              )
            }}
          >
            <span
              className="flex aspect-[3/4] flex-col items-center justify-center rounded-[5px] text-[7.5px] font-extrabold transition-all"
              style={{
                background: on
                  ? '#F5333B'
                  : sel
                    ? c.accent
                    : `color-mix(in srgb, ${c.accent2} 30%, transparent)`,
                color: on || sel ? '#fff' : 'var(--ink)',
                boxShadow: sel ? `0 0 0 1.5px ${c.accent}` : undefined,
              }}
            >
              {t}
            </span>
          </Tap>
        )
      })}
    </div>
  )

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <NavBar back="Recall" title="Sarah Malik" onBack={() => go(0)} right="Save" />

      <div className="mb-3 px-[1.05rem]">
        <Card className="space-y-1.5 p-3">
          <p
            className="text-[8px] font-extrabold uppercase tracking-[0.14em]"
            style={{ color: 'var(--ink2)' }}
          >
            Upper right &rarr; left
          </p>
          <ToothRow teeth={upper} offset={0} />
          <div className="py-0.5">
            <span className="block h-px" style={{ background: 'var(--hair)' }} />
          </div>
          <ToothRow teeth={lower} offset={8} />
          <p className="pt-1 text-[8px]" style={{ color: 'var(--ink2)' }}>
            Tap a tooth to flag it. {flagged.length} flagged.
          </p>
        </Card>
      </div>

      <ListGroup header="Notes on this visit">
        <Row
          leading={<Glyph tone="#F5333B" soft>!</Glyph>}
          title="Distal caries suspected"
          sub="Radiograph requested"
          trailing={<Pill tone="#F5333B">Flag</Pill>}
        />
        <Row
          leading={<Glyph tone={c.accent} soft><Check className="size-3" strokeWidth={3} /></Glyph>}
          title="Scale & polish completed"
          sub="Light calculus, lower anteriors"
        />
        <Row
          leading={<Glyph tone={c.accent} soft><Clock className="size-3" strokeWidth={2.4} /></Glyph>}
          title="Recall set to 6 months"
          sub="Next due 18 May"
          onTap={() => go(2)}
          label="See the day"
          chevron
        />
      </ListGroup>
    </AppCanvas>
  )
}

function ProphyDay({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [chair, setChair] = useChoice('prophy.chair', 0)
  const chairs = [
    {
      name: 'Surgery 1',
      who: 'Dr Ahmed',
      slots: [
        { t: '09:00', p: 'Sarah Malik', kind: 'Exam' },
        { t: '10:00', p: 'Tom Reilly', kind: 'Scale' },
        { t: '11:15', p: 'Open', kind: '' },
      ],
    },
    {
      name: 'Surgery 2',
      who: 'Nadia (hyg.)',
      slots: [
        { t: '09:30', p: 'Priya Kaur', kind: 'Hygiene' },
        { t: '10:45', p: 'Open', kind: '' },
        { t: '12:00', p: 'Alex Nunez', kind: 'Review' },
      ],
    },
  ]
  const active = chairs[chair]

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <LargeTitle eyebrow="Tue 18 Nov" title="Chair day" sub="6 booked · 2 gaps" />
      <Segmented
        items={chairs.map((ch) => ch.name)}
        value={chair}
        onChange={setChair}
      />

      <div className="mb-2 px-[1.05rem]">
        <span className="flex items-center gap-2">
          <Avatar name={active.who} size={22} />
          <span className="text-[10px] font-bold" style={{ color: 'var(--ink)' }}>
            {active.who}
          </span>
        </span>
      </div>

      <div className="space-y-1.5 px-[1.05rem]">
        {active.slots.map((s) => {
          const free = s.p === 'Open'
          return (
            <Tap
              key={s.t}
              ripple={c.accent}
              label={free ? `Fill the ${s.t} gap` : `Open ${s.p}`}
              onTap={() => go(free ? 0 : 1)}
            >
              <span
                className="flex items-center gap-2.5 rounded-xl p-2.5"
                style={{
                  background: free ? 'var(--fill)' : 'var(--card)',
                  boxShadow: free ? undefined : 'var(--shadow)',
                  border: free ? '1px dashed var(--hair)' : undefined,
                }}
              >
                <span
                  className="shrink-0 text-[10px] font-extrabold tabular-nums"
                  style={{ color: free ? 'var(--ink2)' : c.accent }}
                >
                  {s.t}
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span
                    className="block truncate text-[11px] font-bold"
                    style={{ color: free ? 'var(--ink2)' : 'var(--ink)' }}
                  >
                    {free ? 'Gap - 45 min' : s.p}
                  </span>
                  {s.kind ? (
                    <span className="block text-[9px]" style={{ color: 'var(--ink2)' }}>
                      {s.kind}
                    </span>
                  ) : null}
                </span>
                {free ? (
                  <Plus className="size-3.5 shrink-0" style={{ color: c.accent }} strokeWidth={2.8} />
                ) : (
                  <ChevronRight
                    className="size-3 shrink-0 opacity-50"
                    style={{ color: 'var(--ink2)' }}
                    strokeWidth={2.6}
                  />
                )}
              </span>
            </Tap>
          )
        })}
      </div>

      {/* A chair day is measured in chairs, not appointments - so the day
          closes on how full each surgery is and what would fill the rest. */}
      <div className="mt-3 mb-3 px-[1.05rem]">
        <Card className="p-3">
          <p
            className="text-[8px] font-extrabold uppercase tracking-[0.14em]"
            style={{ color: 'var(--ink2)' }}
          >
            Chairs today
          </p>
          <div className="mt-2 space-y-2">
            {[
              { room: 'Surgery 1 · Dr Amin', pct: 88 },
              { room: 'Surgery 2 · Hygiene', pct: 64 },
            ].map((r) => (
              <div key={r.room}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[9.5px] font-bold" style={{ color: 'var(--ink)' }}>
                    {r.room}
                  </span>
                  <span
                    className="text-[9px] font-extrabold tabular-nums"
                    style={{ color: c.accent }}
                  >
                    {r.pct}%
                  </span>
                </div>
                <div className="mt-1">
                  <Track pct={r.pct} tone={c.accent} height={4} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <ListGroup header="Would fill the 14:15">
        <Row
          leading={<Avatar name="Sarah Malik" size={22} tone="#F0463C" />}
          title="Sarah Malik"
          sub="Overdue 12 days · asked for afternoons"
          trailing={<Pill tone="#F0463C" solid>Overdue</Pill>}
        />
        <Row
          leading={<Avatar name="Alex Nunez" size={22} tone={c.accent} />}
          title="Alex Nunez"
          sub="Due in 3 weeks · happy to come early"
          trailing={<Pill tone={c.accent}>Offer</Pill>}
        />
      </ListGroup>
    </AppCanvas>
  )
}

function ProphyPlan({ c }: ScreenProps) {
  const [accepted, setAccepted] = useScreenState<Array<string>>('prophy.plan', [
    'Scale & polish',
  ])
  const items = [
    { name: 'Scale & polish', tooth: 'Full arch', price: 65 },
    { name: 'Composite filling', tooth: 'UR6 distal', price: 145 },
    { name: 'Radiograph', tooth: 'UR6', price: 30 },
    { name: 'Fluoride varnish', tooth: 'Full arch', price: 25 },
  ]
  const total = items.reduce((t, i) => t + i.price, 0)
  const done = items
    .filter((i) => accepted.includes(i.name))
    .reduce((t, i) => t + i.price, 0)

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <LargeTitle eyebrow="Sarah Malik" title="Treatment plan" />

      <div className="mb-3 px-[1.05rem]">
        <Card className="p-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-bold" style={{ color: 'var(--ink2)' }}>
              Accepted
            </span>
            <span
              className="text-[16.5px] font-extrabold tabular-nums"
              style={{ color: c.accent }}
            >
              £{done} <span style={{ color: 'var(--ink2)' }}>/ £{total}</span>
            </span>
          </div>
          <div className="mt-2">
            <Track pct={(done / total) * 100} height={6} />
          </div>
        </Card>
      </div>

      <ListGroup header="Tap to accept">
        {items.map((i) => {
          const on = accepted.includes(i.name)
          return (
            <Row
              key={i.name}
              active={on}
              onTap={() =>
                setAccepted((cur) =>
                  cur.includes(i.name)
                    ? cur.filter((n) => n !== i.name)
                    : [...cur, i.name],
                )
              }
              label={`${on ? 'Remove' : 'Accept'} ${i.name}`}
              leading={
                <span
                  className="flex size-4 items-center justify-center rounded-full transition-all"
                  style={
                    on
                      ? { background: c.accent, color: '#fff' }
                      : { boxShadow: 'inset 0 0 0 1.5px var(--hair)' }
                  }
                >
                  {on ? <Check className="size-2.5" strokeWidth={3.6} /> : null}
                </span>
              }
              title={i.name}
              sub={i.tooth}
              trailing={<span className="tabular-nums">£{i.price}</span>}
            />
          )
        })}
      </ListGroup>

      {/* A treatment plan is a conversation about money, so the total and the
          way of paying it belong on the plan, not in a letter a week later. */}
      <div className="mb-3 px-[1.05rem]">
        <Card className="p-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[9.5px] font-extrabold" style={{ color: 'var(--ink)' }}>
              Accepted so far
            </span>
            <span
              className="text-[16.5px] font-extrabold tabular-nums"
              style={{ color: c.accent }}
            >
              £{accepted.reduce(
                (t, name) => t + (items.find((i) => i.name === name)?.price ?? 0),
                0,
              )}
            </span>
          </div>
          <p className="mt-1 text-[9px]" style={{ color: 'var(--ink2)' }}>
            Of £{items.reduce((t, i) => t + i.price, 0)} proposed · payable over
            three months at no extra cost.
          </p>
        </Card>
      </div>

      <ListGroup header="Where this plan is">
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <Check className="size-3" strokeWidth={2.8} />
            </Glyph>
          }
          title="Discussed chairside"
          sub="18 Nov · Dr Amin"
          trailing={<Pill tone="#1F9D55">Done</Pill>}
        />
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <Clock className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="Awaiting the filling slot"
          sub="Next free chair: 26 Nov"
          trailing={<Pill tone={c.accent} solid>Book</Pill>}
        />
        <Row
          leading={
            <Glyph tone={c.accent} soft>
              <Clock className="size-3" strokeWidth={2.4} />
            </Glyph>
          }
          title="Recall after treatment"
          sub="Set to six months automatically"
          trailing={<span className="tabular-nums">May</span>}
        />
      </ListGroup>
    </AppCanvas>
  )
}

/* ============================== LEADR ============================== *
 * Pipeline board. Stages scroll sideways under a header that does not move,
 * so the stage being read never leaves the deals inside it.
 * =================================================================== */

/**
 * The board.
 *
 * `total` is written rather than summed off the deals: the values are display
 * strings with a currency and a k in them, and parsing money back out of its
 * own formatting to add it up is how a board ends up saying £0.
 */
const LEADR_STAGES = [
  {
    name: 'New',
    total: '£16.5k',
    deals: [
      { co: 'Northwind Ltd', v: '£12k', who: 'Dana P.', age: 1 },
      { co: 'Halcyon Foods', v: '£4.5k', who: 'Ravi S.', age: 2 },
    ],
  },
  {
    name: 'Contacted',
    total: '£34k',
    deals: [
      { co: 'Corley & Sons', v: '£26k', who: 'Dana P.', age: 9 },
      { co: 'Bright Metals', v: '£8k', who: 'Ravi S.', age: 3 },
    ],
  },
  {
    name: 'Proposal',
    total: '£41k',
    deals: [{ co: 'Pearcefield', v: '£41k', who: 'Dana P.', age: 4 }],
  },
]

function LeadrPipeline({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [open, setOpen] = useChoice('leadr.deal', 0)

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <LargeTitle
        eyebrow="Q4 · 5 people"
        title="Pipeline"
        sub="£91.5k open · 5 deals · 1 gone quiet"
      />

      {/*
        The board scrolls sideways; the header above it does not.

        The columns used to be 125px, which was fine when the kit was drawn a
        third smaller. At the current type scale a company name and a value no
        longer fit side by side in one, so every third card clipped mid-word
        and the stage after it was a sliver. They are wide enough to hold their
        own contents now, and the rail still shows a slice of the next stage,
        which is the only thing that says the board goes on.
      */}
      <Rail>
        {LEADR_STAGES.map((stage, si) => (
          <div
            key={stage.name}
            className="w-[158px] shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            {/* A stage header is worth more than a count. Five deals in
                Proposal and five in New are not the same pipeline, and the
                only number that tells them apart is the money. */}
            <div className="mb-2 px-0.5">
              <div className="flex items-baseline justify-between gap-1">
                <span
                  className="text-[9px] font-extrabold uppercase tracking-[0.1em]"
                  style={{ color: si === 0 ? c.accent : 'var(--ink2)' }}
                >
                  {stage.name}
                </span>
                <span
                  className="text-[9px] font-extrabold tabular-nums"
                  style={{ color: 'var(--ink)' }}
                >
                  {stage.total}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className="h-[3px] flex-1 rounded-full"
                  style={{
                    background:
                      si === 0
                        ? `linear-gradient(90deg, ${c.accent}, ${c.accent2})`
                        : 'var(--fill)',
                  }}
                />
                <span
                  className="text-[8px] font-bold tabular-nums"
                  style={{ color: 'var(--ink2)' }}
                >
                  {stage.deals.length}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {stage.deals.map((d, di) => {
                const key = si * 10 + di
                const cold = d.age >= 7
                return (
                  <Tap
                    key={d.co}
                    ripple={c.accent}
                    label={`Open ${d.co}`}
                    onTap={() => {
                      setOpen(key)
                      go(1)
                    }}
                  >
                    <span
                      className="relative block overflow-hidden rounded-xl p-2.5 text-left transition-all"
                      style={{
                        background: 'var(--card)',
                        boxShadow:
                          open === key
                            ? `inset 0 0 0 1px ${c.accent}, var(--shadow)`
                            : 'inset 0 0 0 0.5px var(--hair)',
                      }}
                    >
                      {/* the one deal that is dying wears the studio red down
                          its edge; everything healthy wears the stage colour */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full"
                        style={{ background: cold ? '#F5333B' : c.accent }}
                      />

                      <span className="block pl-2">
                        <span
                          className="block truncate text-[10px] font-extrabold"
                          style={{ color: 'var(--ink)' }}
                        >
                          {d.co}
                        </span>

                        <span
                          className="mt-0.5 block text-[15px] font-extrabold leading-none tabular-nums"
                          style={{ color: cold ? '#F5333B' : c.accent }}
                        >
                          {d.v}
                        </span>

                        <span className="mt-2 flex items-center gap-1.5">
                          <Avatar name={d.who} size={15} tone={c.accent2} />
                          <span
                            className="truncate text-[8.5px] font-semibold"
                            style={{ color: cold ? '#F5333B' : 'var(--ink2)' }}
                          >
                            {cold ? `quiet ${d.age}d` : `${d.age}d ago`}
                          </span>
                        </span>
                      </span>
                    </span>
                  </Tap>
                )
              })}
            </div>
          </div>
        ))}
      </Rail>

      {/* The board says where every deal is. Only this says which of them is
          dying - which is the entire reason this product exists, and it was
          the one thing the screen did not show. */}
      <ListGroup header="Gone quiet">
        <Row
          onTap={() => {
            setOpen(10)
            go(1)
          }}
          label="Open Corley & Sons"
          chevron
          leading={
            <Glyph tone="#F5333B" soft>
              <Clock className="size-3" strokeWidth={2.6} />
            </Glyph>
          }
          title="Corley & Sons"
          sub="No contact for 9 days"
          trailing={
            <Pill tone="#F5333B" solid>
              £26k
            </Pill>
          }
        />
        <Row
          onTap={() => go(2)}
          label="Open the Northwind nudge"
          chevron
          leading={
            <Glyph tone={c.accent} soft>
              <Clock className="size-3" strokeWidth={2.6} />
            </Glyph>
          }
          title="Northwind Ltd"
          sub="6 days · nudge fires Thursday"
          trailing={<span className="tabular-nums">£12k</span>}
        />
      </ListGroup>

      <div className="mb-3 px-[1.05rem]">
        <Card className="flex items-center justify-around p-3">
          <Stat n="£91.5k" label="Open" />
          <span className="h-7 w-px" style={{ background: 'var(--hair)' }} />
          <Stat n="9" label="Avg days" tone={c.accent} />
          <span className="h-7 w-px" style={{ background: 'var(--hair)' }} />
          <Stat n="3" label="Won" tone={c.accent2} />
        </Card>
      </div>

      <div className="px-[1.05rem]">
        <PrimaryButton label="Add a lead" onTap={() => go(1)}>
          <Plus className="size-3" strokeWidth={3} />
          Add a lead
        </PrimaryButton>
      </div>
    </AppCanvas>
  )
}

function LeadrDeal({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [stage, setStage] = useChoice('leadr.stage', 1)
  const stages = ['New', 'Contacted', 'Proposal', 'Won']
  /*
    A deal record is a thread, and a thread with three entries in it is a
    screenshot. Nine is what nine days of a real deal actually looks like -
    and the reason the "gone quiet" gap in the middle is legible at all.
  */
  const timeline = [
    { t: 'Today · 09:14', what: 'Proposal opened 3 times', kind: 'hot' },
    { t: 'Today · 08:02', what: 'Forwarded to their finance lead', kind: 'mail' },
    { t: '2d ago', what: 'Sent pricing PDF', kind: 'mail' },
    { t: '4d ago', what: 'Left a voicemail', kind: 'call' },
    { t: '6d ago', what: 'Nudge fired - no reply', kind: 'call' },
    { t: '9d ago', what: 'Discovery call · 34 min', kind: 'call' },
  ]

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <NavBar back="Pipeline" title="Corley & Sons" onBack={() => go(0)} right="Edit" />

      <div className="mb-3 px-[1.05rem]">
        <Card className="p-3">
          <div className="flex items-center gap-2.5">
            <Avatar name="Corley Sons" size={32} />
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-extrabold" style={{ color: 'var(--ink)' }}>
                Corley &amp; Sons
              </p>
              <p className="text-[9px]" style={{ color: 'var(--ink2)' }}>
                Owner: Dana P. · inbound
              </p>
            </div>
            <span
              className="text-[19px] font-extrabold tabular-nums"
              style={{ color: c.accent }}
            >
              £26k
            </span>
          </div>

          {/* the stage stepper: the one control that moves the deal */}
          <div className="mt-3 flex gap-1">
            {stages.map((s, i) => (
              <Tap
                key={s}
                press={false}
                ripple={c.accent}
                label={`Move to ${s}`}
                onTap={() => setStage(i)}
                className="flex-1"
              >
                <span className="block">
                  <span
                    className="block h-1 rounded-full transition-colors"
                    style={{
                      background:
                        i <= stage
                          ? i === 3
                            ? c.accent2
                            : c.accent
                          : 'var(--fill)',
                    }}
                  />
                  <span
                    className="mt-1 block text-center text-[7.5px] font-bold"
                    style={{ color: i === stage ? c.accent : 'var(--ink2)' }}
                  >
                    {s}
                  </span>
                </span>
              </Tap>
            ))}
          </div>
        </Card>
      </div>

      {/* the thread, on a real vertical rail */}
      <div className="relative px-[1.05rem]">
        <p
          className="mb-2 text-[8px] font-extrabold uppercase tracking-[0.14em]"
          style={{ color: 'var(--ink2)' }}
        >
          Activity
        </p>
        <span
          aria-hidden="true"
          className="absolute bottom-3 left-[1.42rem] top-7 w-px"
          style={{ background: 'var(--hair)' }}
        />
        <div className="space-y-2.5">
          {timeline.map((e) => (
            <div key={e.what} className="flex items-start gap-2.5">
              <span
                className="relative z-10 mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: e.kind === 'hot' ? c.accent : 'var(--card)',
                  boxShadow: e.kind === 'hot' ? undefined : 'inset 0 0 0 1px var(--hair)',
                  color: e.kind === 'hot' ? '#fff' : 'var(--ink2)',
                }}
              >
                {e.kind === 'hot' ? (
                  <Flame className="size-2" strokeWidth={2.8} />
                ) : e.kind === 'mail' ? (
                  <ArrowUpRight className="size-2" strokeWidth={3} />
                ) : (
                  <Phone className="size-2" strokeWidth={3} />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className="block text-[10.5px] font-bold"
                  style={{ color: 'var(--ink)' }}
                >
                  {e.what}
                </span>
                <span className="block text-[8px]" style={{ color: 'var(--ink2)' }}>
                  {e.t}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 px-[1.05rem]">
        <PrimaryButton label="Log the next follow-up" onTap={() => go(2)}>
          Set a nudge
        </PrimaryButton>
      </div>

      {/* The rest of what a five-person team keeps in its head: who is
          actually deciding, what has been promised, and the one date that
          makes the whole deal urgent or not. */}
      <ListGroup header="Who’s in it">
        <Row
          leading={<Avatar name="Helen Corley" size={26} tone={c.accent} />}
          title="Helen Corley"
          sub="Ops director · decision maker"
          trailing={<Pill tone={c.accent} solid>Champion</Pill>}
        />
        <Row
          leading={<Avatar name="Raj Menon" size={26} tone={c.accent2} />}
          title="Raj Menon"
          sub="Finance · signs it off"
          trailing={<Pill tone={c.accent2}>New</Pill>}
        />
      </ListGroup>

      <ListGroup header="The shape of it">
        <Row title="Value" trailing="£26,000" />
        <Row title="Expected close" trailing="12 Dec" />
        <Row title="Source" trailing="Inbound · site form" />
        <Row title="Last touched" trailing="9 days ago" />
      </ListGroup>
    </AppCanvas>
  )
}

function LeadrNudges({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [cleared, setCleared] = useScreenState<Array<string>>('leadr.cleared', [])
  const nudges = [
    { co: 'Corley & Sons', why: 'No contact for 9 days', due: 'Now', hot: true },
    { co: 'Halcyon Foods', why: 'Proposal expires Friday', due: 'Today', hot: true },
    { co: 'Bright Metals', why: 'Follow up after the demo', due: 'Tomorrow', hot: false },
    { co: 'Northwind Ltd', why: 'Check the budget cycle', due: 'Thu', hot: false },
  ]
  const shown = nudges.filter((n) => !cleared.includes(n.co))

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <LargeTitle
        title="Nudges"
        sub={`${shown.length} waiting · 2 overdue`}
        right={
          shown.length ? (
            <Pill tone="#F5333B" solid>
              {shown.filter((n) => n.hot).length} hot
            </Pill>
          ) : undefined
        }
      />

      <ListGroup>
        {shown.map((n) => (
          <Row
            key={n.co}
            onTap={() => go(1)}
            label={`Open ${n.co}`}
            leading={
              <Glyph tone={n.hot ? '#F5333B' : c.accent} soft={!n.hot}>
                <MapPin className="size-3" strokeWidth={2.4} />
              </Glyph>
            }
            title={n.co}
            sub={n.why}
            trailing={
              <Tap
                press={false}
                ripple={c.accent}
                label={`Clear the ${n.co} nudge`}
                onTap={() => setCleared((cur) => [...cur, n.co])}
                className="!w-auto"
              >
                <span
                  className="flex size-5 items-center justify-center rounded-full"
                  style={{ background: 'var(--fill)', color: 'var(--ink2)' }}
                >
                  <Check className="size-2.5" strokeWidth={3.4} />
                </span>
              </Tap>
            }
          />
        ))}
        {shown.length === 0 ? (
          <div className="px-3 py-7 text-center">
            <p className="text-[11px] font-bold" style={{ color: c.accent }}>
              Nothing is going cold.
            </p>
            <p className="mt-1 text-[9.5px]" style={{ color: 'var(--ink2)' }}>
              That is the whole job.
            </p>
          </div>
        ) : null}
      </ListGroup>

      {/* A nudge that fires once and gives up is a reminder. The escalation is
          the product, so the screen has to show it. */}
      <div className="mb-3 px-[1.05rem]">
        <Card className="p-3">
          <p
            className="text-[8px] font-extrabold uppercase tracking-[0.14em]"
            style={{ color: 'var(--ink2)' }}
          >
            How a nudge escalates
          </p>
          <div className="mt-2.5 space-y-2">
            {[
              { n: 'Day 3', what: 'A quiet badge on the deal', on: true },
              { n: 'Day 5', what: 'Push to whoever owns it', on: true },
              { n: 'Day 7', what: 'Top of the list, in red', on: true },
              { n: 'Day 10', what: 'Escalates to the team', on: false },
            ].map((s) => (
              <div key={s.n} className="flex items-center gap-2.5">
                <span
                  className="w-[38px] shrink-0 text-[8px] font-extrabold tabular-nums"
                  style={{ color: s.on ? c.accent : 'var(--ink2)' }}
                >
                  {s.n}
                </span>
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: s.on ? c.accent : 'var(--fill)' }}
                />
                <span className="text-[9.5px]" style={{ color: 'var(--ink)' }}>
                  {s.what}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <ListGroup header="Cleared this week">
        <Row
          leading={
            <Glyph tone="#1F9D55" soft>
              <Check className="size-3" strokeWidth={3} />
            </Glyph>
          }
          title="Pearcefield"
          sub="Called back the same afternoon"
          trailing={<Pill tone="#1F9D55">Done</Pill>}
        />
        <Row
          leading={
            <Glyph tone="#1F9D55" soft>
              <Check className="size-3" strokeWidth={3} />
            </Glyph>
          }
          title="Halcyon Foods"
          sub="Proposal re-sent Tuesday"
          trailing={<Pill tone="#1F9D55">Done</Pill>}
        />
      </ListGroup>
    </AppCanvas>
  )
}

function LeadrWeek({ c }: ScreenProps) {
  const { go } = usePhoneNav()
  const [day, setDay] = useChoice('leadr.day', 4)
  const bars = [38, 52, 44, 70, 88, 34, 20]
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <AppCanvas c={c} chrome={<TabBar c={c} action={TAB_ACTION[c.slug]} />}>
      <StatusBar />
      <LargeTitle eyebrow="Week 47" title="The week" sub="No report to run" />

      <div className="mb-3 px-[1.05rem]">
        <Card className="flex items-center justify-around p-3">
          <Stat n="12" label="New" />
          <span className="h-7 w-px" style={{ background: 'var(--hair)' }} />
          <Stat n="9" label="Moved" tone={c.accent} />
          <span className="h-7 w-px" style={{ background: 'var(--hair)' }} />
          <Stat n="3" label="Won" tone={c.accent2} />
        </Card>
      </div>

      <div className="mb-3 px-[1.05rem]">
        <Card className="p-3">
          <p
            className="text-[8px] font-extrabold uppercase tracking-[0.14em]"
            style={{ color: 'var(--ink2)' }}
          >
            Touches per day
          </p>
          <div className="mt-2.5 flex h-14 items-end gap-1.5">
            {bars.map((h, i) => (
              <Tap
                key={i}
                press={false}
                ripple={c.accent}
                label={`Show ${labels[i]}`}
                onTap={() => setDay(i)}
                className="flex h-full flex-1 items-end"
              >
                <span
                  data-phone-bar
                  className="block w-full rounded-t transition-colors"
                  style={{
                    height: `${h}%`,
                    background:
                      day === i
                        ? `linear-gradient(to top, ${c.accent}, ${c.accent2})`
                        : 'var(--fill)',
                  }}
                />
              </Tap>
            ))}
          </div>
          <div
            className="mt-1.5 flex justify-between text-[7.5px] font-bold"
            style={{ color: 'var(--ink2)' }}
          >
            {labels.map((l, i) => (
              <span key={i} className="flex-1 text-center">
                {l}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <ListGroup header="Closed this week">
        {[
          { co: 'Pearcefield', v: '£41k' },
          { co: 'Halcyon Foods', v: '£4.5k' },
          { co: 'Bright Metals', v: '£8k' },
        ].map((w) => (
          <Row
            key={w.co}
            onTap={() => go(1)}
            label={`Open ${w.co}`}
            chevron
            leading={
              <Glyph tone={c.accent2}>
                <Check className="size-3" strokeWidth={3.2} />
              </Glyph>
            }
            title={w.co}
            sub="Closed won"
            trailing={
              <span className="tabular-nums" style={{ color: c.accent2 }}>
                {w.v}
              </span>
            }
          />
        ))}
      </ListGroup>

      {/* The week is not only what closed. What went quiet in the same seven
          days is the number this product exists to make impossible to miss. */}
      <ListGroup header="Went quiet this week">
        <Row
          onTap={() => go(2)}
          label="Open the Corley & Sons nudge"
          chevron
          leading={
            <Glyph tone="#F5333B" soft>
              <Clock className="size-3" strokeWidth={2.6} />
            </Glyph>
          }
          title="Corley & Sons"
          sub="9 days since the last touch"
          trailing={
            <Pill tone="#F5333B" solid>
              £26k
            </Pill>
          }
        />
        <Row
          onTap={() => go(2)}
          label="Open the Northwind nudge"
          chevron
          leading={
            <Glyph tone={c.accent} soft>
              <Clock className="size-3" strokeWidth={2.6} />
            </Glyph>
          }
          title="Northwind Ltd"
          sub="6 days · nudge fires Thursday"
          trailing={<span className="tabular-nums">£12k</span>}
        />
      </ListGroup>

      <div className="px-[1.05rem]">
        <GhostButton label="See the whole pipeline" onTap={() => go(0)}>
          <ArrowUpRight className="size-2.5" strokeWidth={2.6} />
          Open the pipeline
        </GhostButton>
      </div>
    </AppCanvas>
  )
}

/* ============================= REGISTRY ============================= */

export type ConceptScreen = (props: ScreenProps) => ReactNode

export const CONCEPT_SCREENS: Record<string, ConceptScreen[]> = {
  fieldly: [FieldlyBoard, FieldlyJob, FieldlyProof, FieldlyWeek],
  stamp: [StampWallet, StampCard, StampRewards, StampNearby],
  slate: [SlateBook, SlateConfirmed, SlateVisits, SlateDesk],
  prophy: [ProphyRecall, ProphyChart, ProphyDay, ProphyPlan],
  leadr: [LeadrPipeline, LeadrDeal, LeadrNudges, LeadrWeek],
}
