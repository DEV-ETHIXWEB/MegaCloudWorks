import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import './home-process.css'

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
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
    </svg>
  )
}

function PenIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M15 4.5 19.5 9 8 20.5H3.5V16z" />
      <path d="m12.5 7 4.5 4.5M4 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
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

function RocketIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M13.5 4.5c3.5-2 6 0 6 0s2 2.5 0 6c-1.7 3-6.2 6.6-6.2 6.6l-6.4-6.4S10.5 6.2 13.5 4.5Z" />
      <path d="M8.5 15.5 5 19M7 12.5 4 13l2-3.5M11.5 17l-.5 3 3.5-2" />
      <circle cx="14.5" cy="9.5" r="1.4" />
    </svg>
  )
}

function CheckIcon({
  size = 13,
  width = 2.6,
}: {
  size?: number
  width?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...stroke}
      strokeWidth={width}
      aria-hidden
    >
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  )
}

function ArrowRight({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M4 12h15M13.5 6.5 20 12l-6.5 5.5" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.3l3.3 2" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
    </svg>
  )
}

function TeamIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="9" cy="9.5" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 7.2a3 3 0 0 1 0 5.6M17.5 19a5.3 5.3 0 0 0-2-4.1" />
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

function GlobeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5a14 14 0 0 1 0 17 14 14 0 0 1 0-17Z" />
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * the artefacts - what each step actually hands over
 * ------------------------------------------------------------------ */

/**
 * A step's artefact, drawn at 300px wide and scaled into its column.
 *
 * Scaling rather than narrowing keeps the type and spacing inside exactly
 * as designed; a squeezed column would re-wrap every row in them.
 */
function Art({
  children,
  height,
  scale = 0.6,
}: {
  children: ReactNode
  /** how tall the slot is, in rem, once the artefact has been scaled */
  height: number
  scale?: number
}) {
  return (
    <div
      className="process-art"
      style={
        { height: `${height}rem`, '--art-scale': scale } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <div className="process-art__stage">{children}</div>
    </div>
  )
}

/* ---- 01 Define: the brief ---- */

function StrategyBrief() {
  return (
    <div className="pa-card">
      <p className="text-[0.8rem] font-bold tracking-[-0.01em]">
        Strategy Brief
      </p>
      <div className="mt-2 h-px bg-[var(--line)]" />

      <p className="mt-3 text-[0.65rem] font-semibold">Problem</p>
      <div className="mt-1.5 space-y-1.5">
        <div className="pa-bar w-full" />
        <div className="pa-bar w-[70%]" />
      </div>

      <p className="mt-4 text-[0.65rem] font-semibold">Target users</p>
      <div className="mt-2 flex items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="pa-avatar"
            style={{ marginLeft: i ? '-0.5rem' : 0 }}
          />
        ))}
        <span className="ml-2 grid size-[1.9rem] place-items-center rounded-full bg-[var(--paper-2)] text-[0.55rem] font-bold text-[var(--ink-soft)]">
          +12
        </span>
      </div>

      <p className="mt-4 text-[0.65rem] font-semibold">MVP scope</p>
      <ul className="mt-2 space-y-2">
        {[92, 74, 84, 60].map((w) => (
          <li key={w} className="flex items-center gap-2">
            <span className="size-[0.35rem] flex-none rounded-full bg-[var(--brand)]" />
            <span className="pa-bar flex-1" style={{ width: `${w}%` }} />
            <ArrowRight size={9} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---- 02 Design: the screen ---- */

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

function StatusBar() {
  return (
    <div className="pa-status">
      <span>9:41</span>
      <span className="inline-flex items-end gap-[0.08rem] opacity-70">
        <i className="block h-[0.16rem] w-[0.13rem] bg-current" />
        <i className="block h-[0.22rem] w-[0.13rem] bg-current" />
        <i className="block h-[0.3rem] w-[0.13rem] bg-current" />
      </span>
    </div>
  )
}

function DesignScreen() {
  return (
    <div className="pa-phone">
      <div className="pa-screen">
        <span className="pa-screen__notch" />
        <StatusBar />

        <p className="text-[0.7rem] font-bold tracking-[-0.01em]">
          Good morning, Alex 👋
        </p>

        <p className="mt-1.5 flex items-center gap-1 rounded-full bg-[var(--paper-2)] px-1.5 py-[0.28rem] text-[0.5rem] text-[var(--ink-faint)]">
          <svg width="8" height="8" viewBox="0 0 24 24" {...stroke}>
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>
          Search anything…
        </p>

        <div className="mt-2 rounded-[0.7rem] border border-[var(--line)] p-1.5">
          <p className="text-[0.44rem] text-[var(--ink-faint)]">
            Total balance
          </p>
          <p className="text-[0.82rem] font-extrabold tracking-[-0.03em]">
            $24,680.50
          </p>
          <svg
            className="pa-spark mt-1"
            viewBox="0 0 120 38"
            preserveAspectRatio="none"
            style={{ height: '2.1rem' }}
            aria-hidden
          >
            <path d="M2 30 L14 24 L24 28 L34 17 L44 23 L56 11 L66 18 L76 12 L88 19 L100 8 L112 13 L118 5" />
          </svg>
          <p className="mt-0.5 flex gap-1 text-[0.44rem]">
            <span className="font-bold text-[var(--brand)]">↑ 12.5%</span>
            <span className="text-[var(--ink-faint)]">vs last month</span>
          </p>
        </div>

        <p className="mt-2 text-[0.5rem] font-bold">Quick actions</p>
        <div className="mt-1 grid grid-cols-4 gap-1">
          {QUICK.map((action) => (
            <div key={action.label} className="grid place-items-center gap-0.5">
              <span className="grid size-[1.4rem] place-items-center rounded-[0.4rem] bg-[var(--paper-2)]">
                <svg width="10" height="10" viewBox="0 0 24 24" {...stroke}>
                  <path d={action.d} />
                </svg>
              </span>
              <span className="text-[0.38rem] text-[var(--ink-faint)]">
                {action.label}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-2 text-[0.5rem] font-bold">Recent activity</p>
        {ACTIVITY.map((row) => (
          <div
            key={row.t}
            className="flex items-center gap-1 border-b border-[rgba(16,16,20,0.06)] py-[0.28rem]"
          >
            <span
              className="size-[0.95rem] flex-none rounded-[0.28rem]"
              style={{
                background: row.up
                  ? 'rgba(34,197,94,0.16)'
                  : 'rgba(99,102,241,0.14)',
              }}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.45rem] font-semibold">
                {row.t}
              </span>
              <span className="block truncate text-[0.38rem] text-[var(--ink-faint)]">
                {row.w}
              </span>
            </span>
            <span
              className="text-[0.44rem] font-bold"
              style={{ color: row.up ? '#16a34a' : 'var(--brand)' }}
            >
              {row.a}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---- 03 Build: the pipeline ---- */

function BuildWindow() {
  return (
    <div className="pa-code">
      <div className="pa-code__tabs">
        <span data-on="">api.js</span>
        <span>user.controller.ts</span>
        <span>db.js</span>
      </div>

      <pre>
        <code>
          <span className="tok-key">const</span> app ={' '}
          <span className="tok-fn">require</span>(
          <span className="tok-str">'express'</span>)();
          {'\n'}
          {'\n'}app.<span className="tok-fn">get</span>(
          <span className="tok-str">'/api/dashboard'</span>,{' '}
          <span className="tok-key">async</span> ({'\n'} req, res) =&gt; {'{'}
          {'\n'} <span className="tok-key">const</span> data ={' '}
          <span className="tok-key">await</span>{' '}
          <span className="tok-fn">getDashboard</span>({'\n'} req.
          <span className="tok-prop">user</span>.id);
          {'\n'} res.<span className="tok-fn">json</span>({'{'}{' '}
          <span className="tok-prop">success</span>:{' '}
          <span className="tok-key">true</span>, data {'}'});
          {'\n'}
          {'}'});
        </code>
      </pre>

      <div className="pa-code__panel">
        <p className="text-[0.62rem] font-semibold">Build status</p>
        <p className="mt-1 flex items-center gap-1.5 text-[0.58rem] text-[#c9cbd4]">
          <span className="grid size-[0.85rem] place-items-center rounded-full bg-[#22c55e] text-[#06210f]">
            <CheckIcon size={7} width={3.4} />
          </span>
          All checks passed
        </p>
      </div>

      <div className="pa-code__panel">
        <p className="text-[0.62rem] font-semibold">Deploy to production</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="pa-code__meter flex-1">
            <span style={{ width: '100%' }} />
          </span>
          <span className="text-[0.55rem] font-semibold">100%</span>
        </div>
      </div>
    </div>
  )
}

/* ---- 04 Launch: the listing ---- */

function LiveScreen() {
  return (
    <div className="pa-phone">
      <div className="pa-screen">
        <span className="pa-screen__notch" />
        <StatusBar />

        {/* the little burst of confetti the moment a build goes live */}
        <div className="relative mt-7 grid place-items-center">
          {[
            { x: -46, y: -14 },
            { x: 44, y: -20 },
            { x: -36, y: 40 },
            { x: 42, y: 34 },
            { x: 0, y: -34 },
          ].map((dot) => (
            <span
              key={`${dot.x}:${dot.y}`}
              className="absolute size-[0.22rem] rounded-full bg-[var(--brand)] opacity-60"
              style={{ translate: `${dot.x}px ${dot.y}px` }}
            />
          ))}
          <span className="pa-live">
            <CheckIcon size={30} width={2.4} />
          </span>
        </div>

        <p className="mt-4 text-center text-[0.85rem] font-extrabold tracking-[-0.02em]">
          You&rsquo;re live!
        </p>
        <p className="mt-1 text-center text-[0.5rem] leading-snug text-[var(--ink-soft)]">
          Your app is live and
          <br />
          ready for users.
        </p>

        <p className="mt-4 rounded-[0.5rem] bg-[var(--ink)] py-[0.42rem] text-center text-[0.52rem] font-semibold text-white">
          View on App Store
        </p>
        <p className="mt-1.5 rounded-[0.5rem] border border-[var(--line-strong)] py-[0.42rem] text-center text-[0.52rem] font-semibold">
          Share your app
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * the content
 * ------------------------------------------------------------------ */

const STEPS = [
  {
    index: '01',
    title: 'Define',
    icon: <TargetIcon />,
    note: 'We clarify the problem, validate the idea and define what matters most.',
    checks: ['Market & user research', 'Product strategy', 'Scope & roadmap'],
    art: <StrategyBrief />,
    height: 10,
    scale: 0.47,
  },
  {
    index: '02',
    title: 'Design',
    icon: <PenIcon />,
    note: 'We design intuitive experiences and interfaces people love to use.',
    checks: ['User flows', 'Wireframes', 'UI/UX design', 'Prototyping'],
    art: <DesignScreen />,
    height: 17,
    scale: 0.45,
  },
  {
    index: '03',
    title: 'Build',
    icon: <CodeIcon />,
    note: 'We build scalable, secure and high-performance apps.',
    checks: [
      'Clean code',
      'Secure architecture',
      'API development',
      'Testing & QA',
    ],
    art: <BuildWindow />,
    height: 10.5,
    scale: 0.47,
  },
  {
    index: '04',
    title: 'Launch',
    icon: <RocketIcon />,
    note: 'We test, deploy and support you to launch with confidence.',
    checks: [
      'Deployment',
      'App store release',
      'Monitoring',
      'Ongoing support',
    ],
    art: <LiveScreen />,
    height: 17,
    scale: 0.45,
  },
] as const

const FACTS = [
  {
    icon: <ClockIcon />,
    value: 'One business day',
    label: 'Average reply time',
  },
  {
    icon: <CalendarIcon />,
    value: 'Nine weeks',
    label: 'Typical build timeline',
  },
  { icon: <TeamIcon />, value: 'One team', label: 'End-to-end ownership' },
  {
    icon: <ShieldIcon />,
    value: 'Quality first',
    label: 'Scalable. Secure. Reliable.',
  },
  {
    icon: <GlobeIcon />,
    value: 'Global delivery',
    label: 'India-based, worldwide',
  },
] as const

/** The wave the four numbers are strung along, with a head at each gap. */
const TRACK =
  'M 3 22 C 8 8, 16 8, 22 22 S 33 36, 40 24 C 45 15, 52 12, 59 22 ' +
  'S 70 36, 78 24 S 90 12, 97 20'

export function HomeProcess() {
  return (
    <section id="process" className="home-process">
      <div className="relative mx-auto max-w-[1600px] px-6 py-12 sm:px-10 lg:px-20 lg:py-6">
        {/* ---------- the pitch ---------- */}
        <p className="text-[0.8125rem] font-bold uppercase tracking-[0.28em] text-[var(--brand)]">
          How we build
        </p>

        <h2 className="mt-4 font-display text-[clamp(1.9rem,3vw,2.9rem)] font-extrabold leading-[1.03] tracking-[-0.04em] text-[var(--ink)]">
          Nine weeks.
          <br />
          Start to <span className="text-[var(--brand)]">store.</span>
        </h2>

        <p className="mt-4 max-w-sm text-[0.9375rem] leading-[1.55] text-[var(--ink-soft)]">
          A proven 4-step process that keeps things clear, moves fast and builds
          apps that last.
        </p>

        <Link to="/services" className="process-link mt-6">
          <span className="process-link__disc">
            <ArrowRight />
          </span>
          <span className="process-link__label">See the full process</span>
        </Link>

        {/* ---------- the four steps ---------- */}
        <div className="relative mt-7">
          <svg
            className="process-track hidden lg:block"
            viewBox="0 0 100 44"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path d={TRACK} />
            {[27, 51.5, 76].map((x) => (
              <polygon key={x} points={`${x},20 ${x - 1.4},16 ${x - 1.4},24`} />
            ))}
          </svg>

          <ol className="relative grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <li key={step.index}>
                <span className="process-step__index">{step.index}</span>

                <div className="mt-5 flex gap-3">
                  {/* what the step is */}
                  <div className="w-[8.5rem] flex-none">
                    <span className="process-step__icon">{step.icon}</span>

                    <h3 className="mt-3.5 text-[1.3rem] font-extrabold tracking-[-0.03em] text-[var(--ink)]">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-[0.875rem] leading-[1.5] text-[var(--ink-soft)]">
                      {step.note}
                    </p>

                    <ul className="mt-3.5 space-y-1.5">
                      {step.checks.map((check) => (
                        <li key={check} className="process-step__check">
                          <CheckIcon />
                          {check}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* and what it hands over */}
                  <Art height={step.height} scale={step.scale}>
                    {step.art}
                  </Art>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ---------- the facts ---------- */}
        <dl className="mt-7 grid grid-cols-1 gap-x-4 gap-y-6 rounded-[1.5rem] border border-[var(--line)] bg-white px-6 py-5 shadow-[0_24px_60px_-45px_rgba(16,16,20,0.35)] sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-[var(--line)] lg:px-1">
          {FACTS.map((fact) => (
            <div key={fact.value} className="flex items-start gap-3 lg:px-4">
              <span className="process-fact__tile">{fact.icon}</span>
              <div>
                <dt className="text-[0.95rem] font-bold tracking-[-0.02em] text-[var(--ink)]">
                  {fact.value}
                </dt>
                <dd className="mt-0.5 text-[0.8125rem] leading-snug text-[var(--ink-soft)]">
                  {fact.label}
                </dd>
                <span className="process-fact__rule" />
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default HomeProcess
