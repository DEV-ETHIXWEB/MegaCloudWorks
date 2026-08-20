import { useEffect, useRef } from 'react'

import { TECH } from './TechMarks'

import './home-craft.css'

/* ------------------------------------------------------------------ *
 * marks
 * ------------------------------------------------------------------ */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function TargetIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="m14.5 9.5 5-5M17 4.6l.4 2 2 .4" />
    </svg>
  )
}

function FlowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <rect x="9" y="3" width="6" height="4.5" rx="1.2" />
      <rect x="3" y="16.5" width="6" height="4.5" rx="1.2" />
      <rect x="15" y="16.5" width="6" height="4.5" rx="1.2" />
      <path d="M12 7.5v4.5M6 16.5V12h12v4.5" />
    </svg>
  )
}

function PenIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M15 4.5 19.5 9 8 20.5H3.5V16z" />
      <path d="m12.5 7 4.5 4.5" />
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5.5l-3 13" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M12 3 19 6v5.5c0 4.2-2.9 7.6-7 9.5-4.1-1.9-7-5.3-7-9.5V6z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  )
}

function RocketIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M13.5 4.5c3.5-2 6 0 6 0s2 2.5 0 6c-1.7 3-6.2 6.6-6.2 6.6l-6.4-6.4S10.5 6.2 13.5 4.5Z" />
      <path d="M8.5 15.5 5 19M7 12.5 4 13l2-3.5M11.5 17l-.5 3 3.5-2" />
      <circle cx="14.5" cy="9.5" r="1.4" />
    </svg>
  )
}

function TickIcon() {
  return (
    <svg
      width="7"
      height="7"
      viewBox="0 0 24 24"
      {...stroke}
      strokeWidth={3.2}
      aria-hidden
    >
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg
      width="6"
      height="6"
      viewBox="0 0 24 24"
      {...stroke}
      strokeWidth={2.6}
      aria-hidden
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}

function CloudUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M7 18h9.5a3.7 3.7 0 0 0 .5-7.4 5.2 5.2 0 0 0-9.8-1A3.6 3.6 0 0 0 7 18Z" />
      <path d="M12 15v-5M9.7 12.2 12 9.9l2.3 2.3" />
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * the artefacts
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 * the choreography
 *
 * Every artefact on the table is drawn in the order a build actually
 * happens: the wireframe is blocked out, the flow is joined up, the
 * screen loads, the route is typed, the suite goes green and only then
 * does the release fire. One clock, kept here in seconds and handed to
 * the stylesheet as `--d` on each part, so the timing is readable in one
 * place while the motion itself stays in CSS.
 * ------------------------------------------------------------------ */

/**
 * How fast the queue runs. The order below is written in beats; this is
 * what a beat is worth in seconds, so the whole table can be sped up or
 * slowed down from one number.
 */
const RATE = 0.55

/** a part's cue, in seconds from the moment the table comes into view */
const cue = (at: number) =>
  ({ '--d': `${(at * RATE).toFixed(2)}s` }) as React.CSSProperties

/* One queue, not six things at once: the table is read left to right in
   the order asked for - the code, the flow, the wireframe, the screen, the
   suite, the release - and each artefact waits for the one before it to
   finish. Every panel's parts are cued from its own start, so the order
   here is the only thing that has to change to re-cut the sequence. */
const T_START = 0.15

/** the beat between one artefact finishing and the next beginning */
const GAP = 0.15

type Tok = { t: string; c?: string }

const CODE: Array<Array<Tok>> = [
  [
    { t: 'const ', c: 'craft-tok-key' },
    { t: 'app = ' },
    { t: 'express', c: 'craft-tok-fn' },
    { t: '();' },
  ],
  [],
  [
    { t: 'app.' },
    { t: 'get', c: 'craft-tok-fn' },
    { t: '(' },
    { t: "'/api/dashboard'", c: 'craft-tok-str' },
    { t: ', ' },
    { t: 'async', c: 'craft-tok-key' },
    { t: ' (req, res) => {' },
  ],
  [{ t: '  ' }, { t: 'try', c: 'craft-tok-key' }, { t: ' {' }],
  [
    { t: '    ' },
    { t: 'const', c: 'craft-tok-key' },
    { t: ' data = ' },
    { t: 'await', c: 'craft-tok-key' },
    { t: ' ' },
    { t: 'getDashboard', c: 'craft-tok-fn' },
    { t: '(' },
  ],
  [{ t: '      req.user.id' }],
  [{ t: '    );' }],
  [
    { t: '    res.' },
    { t: 'json', c: 'craft-tok-fn' },
    { t: '({ success: ' },
    { t: 'true', c: 'craft-tok-key' },
    { t: ', data });' },
  ],
  [{ t: '  } ' }, { t: 'catch', c: 'craft-tok-key' }, { t: ' (error) {' }],
  [
    { t: '    res.' },
    { t: 'status', c: 'craft-tok-fn' },
    { t: '(' },
    { t: '500', c: 'craft-tok-num' },
    { t: ').' },
    { t: 'json', c: 'craft-tok-fn' },
    { t: '({ error: error.message });' },
  ],
  [{ t: '  }' }],
  [{ t: '});' }],
]

/** each line's cue, how long it takes to type, and how many steps that is */
const CODE_RUN = (() => {
  let at = T_START
  return CODE.map((line) => {
    const n = Math.max(
      line.reduce((sum, tok) => sum + tok.t.length, 0),
      1,
    )
    const dur = Math.max(0.07, n * 0.008)
    const row = { at, dur, n }
    at += dur + 0.025
    return row
  })
})()

const CODE_LAST = CODE_RUN[CODE_RUN.length - 1]
const T_CODE_END = CODE_LAST.at + CODE_LAST.dur

/* 02 the flow: three boxes, each written into and joined to the next,
   then the three leaves */
const T_FLOW = T_CODE_END + GAP
const T_FLOW_END = T_FLOW + 1.45 + 2 * 0.12 + 0.42

/* 03 the wireframe: eleven blocks dealt out */
const T_WIRE = T_FLOW_END + GAP
const T_WIRE_END = T_WIRE + 10 * 0.07 + 0.42

/* 04 the screen, loading a part at a time */
const T_UI = T_WIRE_END + GAP
const T_UI_END = T_UI + 1.79 + 0.5

/* 05 the suite, and 06 the release once it is green */
const T_TESTS = T_UI_END + GAP
const T_DEPLOY = T_TESTS + 4 * 0.32 + 0.15

/* ------------------------------ the flow ------------------------------ */

function UserFlowPanel() {
  const steps = ['Splash', 'Onboarding', 'Home']
  const leaves = ['Search', 'Category', 'Profile']

  return (
    <div
      className="craft-panel"
      style={
        {
          left: '10%',
          top: '0%',
          width: '20%',
          '--float-dur': '7.5s',
        } as React.CSSProperties
      }
    >
      <p className="craft-panel__label">User Flow</p>

      {steps.map((step, i) => (
        <div key={step}>
          {/* the box lands, its label is written into it, then the line
              reaches down for the next one */}
          <span className="craft-node craft-pop" style={cue(T_FLOW + i * 0.45)}>
            <span className="craft-fade" style={cue(T_FLOW + i * 0.45 + 0.16)}>
              {step}
            </span>
          </span>
          <span
            className="craft-arrow craft-draw"
            style={cue(T_FLOW + i * 0.45 + 0.3)}
          />
        </div>
      ))}

      <div className="grid grid-cols-3 gap-1">
        {leaves.map((leaf, i) => (
          <span
            key={leaf}
            className="craft-node craft-node--leaf craft-pop"
            style={cue(T_FLOW + 1.45 + i * 0.12)}
          >
            <span className="craft-fade" style={cue(T_FLOW + 1.6 + i * 0.12)}>
              {leaf}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* --------------------------- the wireframe --------------------------- */

function WireframePanel() {
  /* the blocks pop in the order a wireframe gets drawn: chrome first,
     then the hero, the cards, the copy and the tab bar */
  const pop = (i: number) => cue(T_WIRE + i * 0.07)

  return (
    <div
      className="craft-panel"
      style={
        {
          left: '0%',
          top: '44%',
          width: '18%',
          '--float-dur': '9s',
          '--float-delay': '-2s',
        } as React.CSSProperties
      }
    >
      <p className="craft-panel__label">Wireframe</p>
      <div className="craft-wire">
        <div className="flex items-center gap-1">
          <span
            className="craft-wire__block craft-pop size-[0.35rem] rounded-full"
            style={pop(0)}
          />
          <span
            className="craft-wire__block craft-pop h-[0.25rem] flex-1"
            style={pop(1)}
          />
        </div>
        <div
          className="craft-wire__block craft-pop mt-1.5 h-[2.6rem] w-full"
          style={pop(2)}
        />
        <div className="mt-1.5 grid grid-cols-2 gap-1">
          <span
            className="craft-wire__block craft-pop h-[1.4rem]"
            style={pop(3)}
          />
          <span
            className="craft-wire__block craft-pop h-[1.4rem]"
            style={pop(4)}
          />
        </div>
        <div className="mt-1.5 space-y-1">
          <span
            className="craft-wire__block craft-pop block h-[0.25rem] w-full"
            style={pop(5)}
          />
          <span
            className="craft-wire__block craft-pop block h-[0.25rem] w-[70%]"
            style={pop(6)}
          />
        </div>
        <div className="mt-2 flex justify-around border-t border-[var(--line)] pt-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="craft-wire__block craft-pop size-[0.45rem] rounded-full"
              style={pop(7 + i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const QUICK = [
  { label: 'Send', d: 'M12 19V6M7 11l5-5 5 5' },
  { label: 'Receive', d: 'M12 5v13M7 13l5 5 5-5' },
  { label: 'Analytics', d: 'M6 18v-5M12 18V7M18 18v-8' },
  { label: 'More', d: 'M6 12h.01M12 12h.01M18 12h.01' },
] as const

const ACTIVITY = [
  { t: 'Payment received', w: 'Today, 10:30 AM', a: '+$2,500', up: true },
  { t: 'Subscription', w: 'May 14, 8:15 AM', a: '-$29', up: false },
  { t: 'Shopping', w: 'May 13, 6:20 PM', a: '-$120', up: false },
] as const

/* ---------------------------- the screen ---------------------------- */

function UiDesignPanel() {
  return (
    <div
      className="craft-panel"
      style={
        {
          left: '29%',
          top: '3%',
          width: '24%',
          '--float-dur': '8s',
          '--float-delay': '-4s',
        } as React.CSSProperties
      }
    >
      <p className="craft-panel__label">UI Design</p>

      {/* the screen loads the way a real one does: greeting, search,
          balance, then the two lists under it */}
      <div className="craft-screen">
        <p className="craft-rise text-[0.6rem] font-bold" style={cue(T_UI)}>
          Good morning, Alex 👋
        </p>

        <p
          className="craft-rise mt-1.5 flex items-center gap-1 rounded-full bg-white/8 px-1.5 py-[0.22rem] text-[0.45rem] text-white/50"
          style={cue(T_UI + 0.14)}
        >
          <svg width="7" height="7" viewBox="0 0 24 24" {...stroke}>
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>
          Search anything…
        </p>

        <div
          className="craft-screen__card craft-rise mt-1.5"
          style={cue(T_UI + 0.3)}
        >
          <p className="text-[0.42rem] text-white/50">Total balance</p>
          <p className="text-[0.72rem] font-extrabold tracking-[-0.02em]">
            $24,680.50
          </p>
          <svg
            className="craft-screen__spark mt-1 block w-full"
            viewBox="0 0 120 32"
            preserveAspectRatio="none"
            style={{ height: '1.5rem' }}
            aria-hidden
          >
            {/* the trace draws itself once the card has landed */}
            <path
              className="craft-trace"
              pathLength={100}
              style={cue(T_UI + 0.48)}
              d="M2 26 L14 20 L24 24 L34 14 L44 19 L56 9 L66 15 L76 10 L88 16 L100 6 L112 11 L118 4"
            />
          </svg>
          <p
            className="craft-fade mt-0.5 text-[0.4rem]"
            style={cue(T_UI + 1.1)}
          >
            <span className="font-bold text-[var(--brand)]">↑ 12.5%</span>{' '}
            <span className="text-white/50">vs last month</span>
          </p>
        </div>

        <p
          className="craft-rise mt-1.5 text-[0.45rem] font-semibold"
          style={cue(T_UI + 1.2)}
        >
          Quick actions
        </p>
        <div className="mt-1 grid grid-cols-4 gap-1">
          {QUICK.map((action, i) => (
            <span
              key={action.label}
              className="craft-pop grid justify-items-center gap-0.5"
              style={cue(T_UI + 1.3 + i * 0.09)}
            >
              <span className="craft-screen__tile">
                <svg width="9" height="9" viewBox="0 0 24 24" {...stroke}>
                  <path d={action.d} />
                </svg>
              </span>
              <span className="text-[0.35rem] text-white/50">
                {action.label}
              </span>
            </span>
          ))}
        </div>

        <p
          className="craft-rise mt-1.5 text-[0.45rem] font-semibold"
          style={cue(T_UI + 1.7)}
        >
          Recent activity
        </p>
        <div className="mt-1 space-y-1">
          {ACTIVITY.map((row, i) => (
            <div
              key={row.t}
              className="craft-screen__row craft-slide"
              style={cue(T_UI + 1.8 + i * 0.12)}
            >
              <span className="craft-screen__tile size-[0.9rem] rounded-[0.28rem]" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.42rem] font-semibold">
                  {row.t}
                </span>
                <span className="block truncate text-[0.35rem] text-white/45">
                  {row.w}
                </span>
              </span>
              <span
                className="text-[0.42rem] font-bold"
                style={{ color: row.up ? '#4ade80' : 'var(--brand)' }}
              >
                {row.a}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ----------------------------- the code -----------------------------
 *
 * Held as tokens per line rather than one block of markup, because the
 * typing is per line: each line is clipped to nothing and wiped open in
 * `steps(characters)`, which is what gives it a terminal's tick instead
 * of a smooth slide. */

function CleanCodePanel() {
  return (
    <div
      className="craft-panel craft-panel--dark"
      style={
        {
          left: '56%',
          top: '6%',
          width: '33%',
          '--float-dur': '8.5s',
          '--float-delay': '-1s',
        } as React.CSSProperties
      }
    >
      <p className="craft-panel__label">Clean Code</p>
      <div className="craft-code">
        <div className="craft-code__gutter">
          {CODE_RUN.map((row, i) => (
            <div key={i} className="craft-fade" style={cue(row.at)}>
              {i + 1}
            </div>
          ))}
        </div>
        <pre>
          <code>
            {CODE.map((line, i) => (
              <span
                key={i}
                className="craft-code__line"
                style={
                  {
                    '--d': `${CODE_RUN[i].at.toFixed(2)}s`,
                    '--dur': `${CODE_RUN[i].dur.toFixed(2)}s`,
                    '--n': CODE_RUN[i].n,
                  } as React.CSSProperties
                }
              >
                <span className="craft-code__ink">
                  {line.length ? (
                    line.map((tok, j) => (
                      <span key={j} className={tok.c}>
                        {tok.t}
                      </span>
                    ))
                  ) : (
                    <>{' '}</>
                  )}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}

/* --------------------------- the test run --------------------------- */

const TESTS = [
  'Functional testing',
  'Performance testing',
  'Security testing',
  'Usability testing',
] as const

function TestingPanel() {
  return (
    <div
      className="craft-panel"
      style={
        {
          left: '55%',
          top: '55%',
          width: '19%',
          '--float-dur': '7s',
          '--float-delay': '-3s',
        } as React.CSSProperties
      }
    >
      <p className="craft-panel__label">Testing &amp; QA</p>
      {TESTS.map((test, i) => (
        <div key={test} className="craft-test">
          {/* grey until its case passes, then it lights */}
          <span
            className="craft-test__tick craft-pass"
            style={cue(T_TESTS + i * 0.32)}
          >
            <TickIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.5rem] font-semibold">
              {test}
            </span>
            <span
              className="craft-fade block text-[0.42rem] text-[var(--ink-faint)]"
              style={cue(T_TESTS + i * 0.32 + 0.16)}
            >
              Passed
            </span>
          </span>
          <span className="text-[var(--ink-faint)]">
            <ChevronIcon />
          </span>
        </div>
      ))}
    </div>
  )
}

/* ---------------------------- the release ---------------------------- */

function DeploymentPanel() {
  return (
    <div
      className="craft-panel"
      style={
        {
          left: '76%',
          top: '60%',
          width: '18%',
          '--float-dur': '9.5s',
          '--float-delay': '-5s',
        } as React.CSSProperties
      }
    >
      <p className="craft-panel__label">Deployment</p>
      {/* nothing here moves until the suite is green */}
      <div className="craft-dial">
        <span className="craft-dial__ring craft-spin" style={cue(T_DEPLOY)} />
        <span
          className="craft-dial__core craft-lift"
          style={cue(T_DEPLOY + 0.45)}
        >
          <CloudUpIcon />
        </span>
      </div>
      <p
        className="craft-rise mt-1.5 text-center text-[0.6rem] font-bold"
        style={cue(T_DEPLOY + 0.75)}
      >
        Deployed
      </p>
      <p
        className="craft-rise text-center text-[0.45rem] text-[var(--ink-faint)]"
        style={cue(T_DEPLOY + 0.85)}
      >
        v1.2.0
      </p>
      <p
        className="craft-rise mt-1 text-center text-[0.45rem] leading-snug text-[var(--ink-soft)]"
        style={cue(T_DEPLOY + 0.95)}
      >
        Live on App Store
        <br />
        &amp; Play Store
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * the content
 * ------------------------------------------------------------------ */

const DISCIPLINES = [
  {
    icon: <TargetIcon />,
    title: 'Strategy',
    body: 'We start on the problem, not the feature list - the goal, the market and the constraints, all validated before a line is written. That means the workshops, the competitor teardown and the numbers that decide whether a build is worth starting at all.',
  },
  {
    icon: <FlowIcon />,
    title: 'User Experience',
    body: 'Flows are mapped before they are drawn, so the first time someone opens the app they already know where they are going. Every screen earns its place in the journey, and the dead ends are found on paper rather than in your first round of reviews.',
  },
  {
    icon: <PenIcon />,
    title: 'UI Design',
    body: 'Interfaces built on a real system - type, spacing and colour that still hold together on the twentieth screen, not just the first. The components are documented and handed over, so the look survives every feature added after we have finished.',
  },
  {
    icon: <CodeIcon />,
    title: 'Development',
    body: 'Scalable architecture and clean, tested code, written so the next developer on it reads the work as easily as we do. Sensible dependencies, reviewed pull requests and a repository your own team can pick up without a handover call.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Testing',
    body: 'Functional, performance and security passes on every build, so what ships stays stable and fast under a real load. Devices, edge cases and the awkward network conditions your users actually have, checked before release rather than after it.',
  },
  {
    icon: <RocketIcon />,
    title: 'Deployment',
    body: 'Shipped to both stores and looked after once it is there - releases, monitoring, and the fixes that follow. Store listings, staged rollouts and the version after this one, planned with you rather than dropped on you.',
  },
] as const

/**
 * The table's own clock.
 *
 * The parts are hidden by the stylesheet only while `data-play` is on the
 * table, and that attribute is written here - so a browser that never
 * runs this effect shows the finished artefacts rather than an empty
 * box. Once the table reaches the screen it flips to `run` and every
 * part fires off its own `--d`.
 */
function useSequence() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') return

    el.dataset.play = 'armed'
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.dataset.play = 'run'
        io.disconnect()
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return ref
}

export function HomeCraft() {
  const collage = useSequence()

  return (
    <section id="craft" className="home-craft">
      {/* ---------- one screen: the claim, the table, the run, the toolkit ---------- */}
      <div className="craft-pane">
        <div className="craft-pane__body relative mx-auto max-w-[1360px] px-6 py-10 sm:px-10 lg:px-28 lg:py-6">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
            {/* ---------- the claim ---------- */}
            <div>
              <span className="craft-tick" aria-hidden="true" />
              <p className="text-[0.8125rem] font-bold uppercase tracking-[0.28em] text-[var(--brand)]">
                Behind the build
              </p>

              <h2 className="mt-4 font-display text-[clamp(1.8rem,2.8vw,2.6rem)] font-extrabold leading-[1.03] tracking-[-0.04em] text-[var(--ink)]">
                Thoughtful process.
                <br />
                Solid <span className="text-[var(--brand)]">engineering.</span>
              </h2>

              <p className="mt-3.5 max-w-md text-[0.9375rem] leading-[1.55] text-[var(--ink-soft)]">
                Every piece matters, every time.
              </p>
            </div>

            {/* ---------- what a build leaves behind ---------- */}
            <div ref={collage} className="craft-collage" aria-hidden="true">
              <UserFlowPanel />
              <WireframePanel />
              <UiDesignPanel />
              <CleanCodePanel />
              <TestingPanel />
              <DeploymentPanel />
            </div>
          </div>

          {/* ---------- the six disciplines, one to a line ---------- */}
          <ul className="craft-run mt-10">
            {DISCIPLINES.map((item) => (
              <li key={item.title} className="craft-run__item">
                <span className="craft-strip__tile">{item.icon}</span>
                <h3 className="craft-run__name">{item.title}</h3>
                <p className="craft-run__note">{item.body}</p>
              </li>
            ))}
          </ul>

          {/* ---------- and what it is all built with, straight
              under the run rather than a screen away ---------- */}
          <p className="mt-20 text-center text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-[var(--ink-faint)]">
            Technologies we work with
          </p>

          {/* the chips ride a belt: one row, doubled, sliding for ever. The
              copy is hidden from assistive tech so the list is read once. */}
          <div className="craft-marquee mt-5">
            <div className="craft-marquee__track">
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  className="craft-marquee__row"
                  aria-hidden={copy === 1 ? 'true' : undefined}
                >
                  {TECH.map((tool) => (
                    <li key={tool.name} className="craft-tech">
                      {tool.mark}
                      {tool.name}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          {/* the studio's own mark, standing between the belt and the
              contact form below - flat, no bloom */}
          <div className="craft-sign mt-24 lg:mt-28">
            <span className="craft-sign__rule" aria-hidden="true" />
            <img
              src="/logo-resized.svg"
              alt="MegaCloudWorks"
              width={210}
              height={54}
              loading="lazy"
              decoding="async"
              className="craft-sign__mark"
            />
            <span className="craft-sign__rule" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeCraft
