import { Link } from '@tanstack/react-router'
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

function ArrowOut() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

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

function UserFlowPanel() {
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
      <span className="craft-node">Splash</span>
      <span className="craft-arrow" />
      <span className="craft-node">Onboarding</span>
      <span className="craft-arrow" />
      <span className="craft-node">Home</span>
      <span className="craft-arrow" />
      <div className="grid grid-cols-3 gap-1">
        {['Search', 'Category', 'Profile'].map((leaf) => (
          <span key={leaf} className="craft-node craft-node--leaf">
            {leaf}
          </span>
        ))}
      </div>
    </div>
  )
}

function WireframePanel() {
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
          <span className="craft-wire__block size-[0.35rem] rounded-full" />
          <span className="craft-wire__block h-[0.25rem] flex-1" />
        </div>
        <div className="craft-wire__block mt-1.5 h-[2.6rem] w-full" />
        <div className="mt-1.5 grid grid-cols-2 gap-1">
          <span className="craft-wire__block h-[1.4rem]" />
          <span className="craft-wire__block h-[1.4rem]" />
        </div>
        <div className="mt-1.5 space-y-1">
          <span className="craft-wire__block block h-[0.25rem] w-full" />
          <span className="craft-wire__block block h-[0.25rem] w-[70%]" />
        </div>
        <div className="mt-2 flex justify-around border-t border-[var(--line)] pt-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="craft-wire__block size-[0.45rem] rounded-full"
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
      <div className="craft-screen">
        <p className="text-[0.6rem] font-bold">Good morning, Alex 👋</p>

        <p className="mt-1.5 flex items-center gap-1 rounded-full bg-white/8 px-1.5 py-[0.22rem] text-[0.45rem] text-white/50">
          <svg width="7" height="7" viewBox="0 0 24 24" {...stroke}>
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>
          Search anything…
        </p>

        <div className="craft-screen__card mt-1.5">
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
            <path d="M2 26 L14 20 L24 24 L34 14 L44 19 L56 9 L66 15 L76 10 L88 16 L100 6 L112 11 L118 4" />
          </svg>
          <p className="mt-0.5 text-[0.4rem]">
            <span className="font-bold text-[var(--brand)]">↑ 12.5%</span>{' '}
            <span className="text-white/50">vs last month</span>
          </p>
        </div>

        <p className="mt-1.5 text-[0.45rem] font-semibold">Quick actions</p>
        <div className="mt-1 grid grid-cols-4 gap-1">
          {QUICK.map((action) => (
            <span
              key={action.label}
              className="grid justify-items-center gap-0.5"
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

        <p className="mt-1.5 text-[0.45rem] font-semibold">Recent activity</p>
        <div className="mt-1 space-y-1">
          {ACTIVITY.map((row) => (
            <div key={row.t} className="craft-screen__row">
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
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre>
          <code>
            <span className="craft-tok-key">const</span> app ={' '}
            <span className="craft-tok-fn">express</span>();
            {'\n'}
            {'\n'}app.<span className="craft-tok-fn">get</span>(
            <span className="craft-tok-str">'/api/dashboard'</span>,{' '}
            <span className="craft-tok-key">async</span> (req, res) =&gt; {'{'}
            {'\n'} <span className="craft-tok-key">try</span> {'{'}
            {'\n'} <span className="craft-tok-key">const</span> data ={' '}
            <span className="craft-tok-key">await</span>{' '}
            <span className="craft-tok-fn">getDashboard</span>({'\n'}{' '}
            req.user.id
            {'\n'} );
            {'\n'} res.<span className="craft-tok-fn">json</span>({'{'} success:{' '}
            <span className="craft-tok-key">true</span>, data {'}'});
            {'\n'} {'}'} <span className="craft-tok-key">catch</span> (error){' '}
            {'{'}
            {'\n'} res.<span className="craft-tok-fn">status</span>(
            <span className="craft-tok-num">500</span>).
            <span className="craft-tok-fn">json</span>({'{'} error:
            error.message {'}'});
            {'\n'} {'}'}
            {'\n'}
            {'}'});
          </code>
        </pre>
      </div>
    </div>
  )
}

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
      {TESTS.map((test) => (
        <div key={test} className="craft-test">
          <span className="craft-test__tick">
            <TickIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.5rem] font-semibold">
              {test}
            </span>
            <span className="block text-[0.42rem] text-[var(--ink-faint)]">
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
      <div className="craft-dial">
        <span className="craft-dial__ring" />
        <span className="craft-dial__core">
          <CloudUpIcon />
        </span>
      </div>
      <p className="mt-1.5 text-center text-[0.6rem] font-bold">Deployed</p>
      <p className="text-center text-[0.45rem] text-[var(--ink-faint)]">
        v1.2.0
      </p>
      <p className="mt-1 text-center text-[0.45rem] leading-snug text-[var(--ink-soft)]">
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
    body: 'The right problem, properly validated.',
  },
  {
    icon: <FlowIcon />,
    title: 'User Experience',
    body: 'Flows that feel obvious to use.',
  },
  {
    icon: <PenIcon />,
    title: 'UI Design',
    body: 'Interfaces users actually love.',
  },
  {
    icon: <CodeIcon />,
    title: 'Development',
    body: 'Scalable architecture, clean code.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Testing',
    body: 'Secure, stable, fast at scale.',
  },
  {
    icon: <RocketIcon />,
    title: 'Deployment',
    body: 'From beta to store, and after.',
  },
] as const

/** The route threading the artefacts, bottom left to top right. */
const ROUTE = 'M 2 96 C 18 92, 30 84, 44 74 S 66 58, 78 40 S 92 18, 99 6'

const STOPS = [
  { x: 20, y: 90 },
  { x: 44, y: 74 },
  { x: 66, y: 55 },
  { x: 86, y: 27 },
] as const

export function HomeCraft() {
  return (
    <section id="craft" className="home-craft">
      <div className="relative mx-auto max-w-[1360px] px-6 py-10 sm:px-10 lg:px-28 lg:py-6">
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
              We go beyond code. Every piece matters, every time.
            </p>

            <Link to="/services" className="craft-link mt-7">
              <span className="craft-link__disc">
                <ArrowOut />
              </span>
              <span className="craft-link__label">See how we build</span>
            </Link>
          </div>

          {/* ---------- what a build leaves behind ---------- */}
          <div className="craft-collage" aria-hidden="true">
            <svg
              className="craft-collage__route"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path className="craft-route-glow" d={ROUTE} />
              <path className="craft-route-body" d={ROUTE} />
              <path className="craft-route-core" d={ROUTE} />
              {STOPS.map((stop) => (
                <circle
                  key={stop.x}
                  className="craft-route-stop"
                  cx={stop.x}
                  cy={stop.y}
                  r="0.9"
                />
              ))}
            </svg>

            <UserFlowPanel />
            <WireframePanel />
            <UiDesignPanel />
            <CleanCodePanel />
            <TestingPanel />
            <DeploymentPanel />
          </div>
        </div>

        {/* ---------- the six disciplines ---------- */}
        <ul className="craft-strip mt-5 grid grid-cols-2 gap-y-6 px-6 py-4 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-[var(--line)] lg:px-2">
          {DISCIPLINES.map((item) => (
            <li key={item.title} className="lg:px-6">
              <span className="craft-strip__tile">{item.icon}</span>
              <h3 className="mt-3 text-[1rem] font-bold tracking-[-0.02em] text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[0.8125rem] leading-[1.45] text-[var(--ink-soft)]">
                {item.body}
              </p>
              <span className="craft-strip__rule" />
            </li>
          ))}
        </ul>

        {/* ---------- and what it is all built with ---------- */}
        <p className="mt-8 text-center text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-[var(--ink-faint)]">
          Technologies we work with
        </p>

        {/* the chips ride a belt: one row, doubled, sliding for ever. The
            copy is hidden from assistive tech so the list is read once. */}
        <div className="craft-marquee mt-4">
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
      </div>
    </section>
  )
}

export default HomeCraft
