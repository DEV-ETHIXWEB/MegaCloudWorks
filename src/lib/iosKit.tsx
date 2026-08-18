import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import type { Concept, ConceptIconName } from '#/lib/concepts'
import { CONCEPT_ICONS } from '#/lib/conceptIcons'
import { Tap, usePhoneNav } from '#/lib/phoneUI'

/**
 * The iOS chrome every concept screen is built out of.
 *
 * The screens used to draw their own headers, their own buttons and their own
 * idea of a list row, which meant five concepts that were different by accident
 * rather than on purpose. This is the shared substrate: status bar, navigation
 * bar, grouped lists, sheets, segmented controls and the glass tab bar - all
 * proportioned for a ~300px screen, which is roughly 0.78× a real iPhone, so
 * the type scale here is Apple's scaled by that.
 *
 * Concept identity comes from the theme, not from re-inventing the furniture:
 * `AppCanvas` publishes the concept's palette as custom properties and every
 * component below reads them. A concept differs by colour, by surface (dark or
 * light) and by which of these pieces its flow uses - never by having its own
 * private version of a tab bar.
 */

/* ------------------------------------------------------------------ *
 * Canvas
 * ------------------------------------------------------------------ */

/**
 * The material each app is cut from.
 *
 * Colour is not an identity. Recoloured, five apps sharing one kit are still
 * visibly one app - the tell is the geometry: same corner radius on every card,
 * same capsule tab bar, same shadow. So the skin owns everything *under*
 * colour, and the five differ before a single hue is applied:
 *
 *   industrial  small radii, squared tab bar, filled tiles, no shadow at all
 *   paper       generous radii, warm opaque stock, a soft printed drop
 *   glass       translucent faces, crisp hairlines, a cool lifted shadow
 *   clinical    tight radii, flat outlined cards, deliberately no elevation
 *   neon        the roundest, elevated, with an accent bloom under everything
 *
 * `dark` decides the two treatments a face can have; the skin decides which of
 * them, how round, and how far off the canvas it sits.
 */
type SkinVars = Record<string, string>

function skinVars(c: Concept): SkinVars {
  const dark = c.surface === 'dark'
  const face = dark ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.92)'
  const faceUp = dark ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.7)'

  switch (c.skin) {
    /* Fieldly - a tool. Square-ish, matte, welded to the canvas. */
    case 'industrial':
      return {
        '--r-card': '8px',
        '--r-group': '8px',
        '--r-btn': '8px',
        '--r-glyph': '5px',
        '--r-field': '6px',
        '--r-tab': '14px',
        '--r-pebble': '9px',
        '--r-sheet': '12px',
        '--card': dark ? 'rgba(255,255,255,0.062)' : '#FFFFFF',
        '--card-2': dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.62)',
        '--hair': dark ? 'rgba(255,255,255,0.14)' : 'rgba(20,24,31,0.16)',
        '--fill': dark ? 'rgba(255,255,255,0.085)' : 'rgba(20,24,31,0.06)',
        /* `0 0 #0000` rather than `none`: these two vars are composed into one
           comma-separated box-shadow, and `none` inside a shadow list voids the
           whole declaration */
        '--shadow': '0 0 #0000',
        '--edge': dark
          ? 'inset 0 0.5px 0 rgba(255,255,255,0.16)'
          : 'inset 0 0 0 1px rgba(20,24,31,0.09)',
      }

    /* Stamp - printed stock. Round, warm, with a real drop under it. */
    case 'paper':
      return {
        '--r-card': '18px',
        '--r-group': '18px',
        '--r-btn': '999px',
        '--r-glyph': '9px',
        '--r-field': '12px',
        '--r-tab': '999px',
        '--r-pebble': '999px',
        '--r-sheet': '26px',
        '--card': '#FFFCF6',
        '--card-2': 'rgba(255,252,246,0.72)',
        '--hair': 'rgba(42,26,18,0.12)',
        '--fill': 'rgba(42,26,18,0.055)',
        '--shadow': '0 8px 20px -10px rgba(64,34,20,0.34)',
        '--edge': 'inset 0 0 0 0.5px rgba(42,26,18,0.06)',
      }

    /* Slate - glass over a calendar. Translucent, crisp-edged, lifted. */
    case 'glass':
      return {
        '--r-card': '15px',
        '--r-group': '15px',
        '--r-btn': '12px',
        '--r-glyph': '8px',
        '--r-field': '10px',
        '--r-tab': '999px',
        '--r-pebble': '999px',
        '--r-sheet': '22px',
        '--card': 'rgba(255,255,255,0.78)',
        '--card-2': 'rgba(255,255,255,0.56)',
        '--hair': 'rgba(15,26,43,0.13)',
        '--fill': 'rgba(15,26,43,0.055)',
        '--shadow': '0 10px 26px -14px rgba(15,26,43,0.4)',
        '--edge': 'inset 0 0.5px 0 rgba(255,255,255,0.9)',
      }

    /* Prophy - clinical. Flat, outlined, sitting *on* the canvas, not above it. */
    case 'clinical':
      return {
        '--r-card': '11px',
        '--r-group': '11px',
        '--r-btn': '9px',
        '--r-glyph': '7px',
        '--r-field': '8px',
        '--r-tab': '17px',
        '--r-pebble': '11px',
        '--r-sheet': '16px',
        '--card': '#FFFFFF',
        '--card-2': 'rgba(255,255,255,0.66)',
        '--hair': 'rgba(5,39,34,0.14)',
        '--fill': 'rgba(5,39,34,0.05)',
        /* no drop by design: nothing in a surgery is floating */
        '--shadow': '0 0 #0000',
        '--edge': 'inset 0 0 0 1px rgba(5,39,34,0.1)',
      }

    /* Leadr - the roundest, and the only one that glows. On a light canvas the
       bloom becomes a coloured lift rather than an emission, but it is still
       the only skin here that throws its accent onto the surface below it. */
    case 'neon':
      return {
        '--r-card': '20px',
        '--r-group': '20px',
        '--r-btn': '14px',
        '--r-glyph': '11px',
        '--r-field': '13px',
        '--r-tab': '999px',
        '--r-pebble': '999px',
        '--r-sheet': '28px',
        '--card': dark ? 'rgba(255,255,255,0.062)' : '#FFFFFF',
        '--card-2': dark ? 'rgba(255,255,255,0.105)' : `${c.accent}0d`,
        '--hair': dark ? 'rgba(255,255,255,0.1)' : `${c.accent}24`,
        '--fill': dark ? 'rgba(255,255,255,0.075)' : `${c.accent}12`,
        '--shadow': dark
          ? `0 14px 34px -20px ${c.accent}`
          : `0 16px 34px -22px ${c.accent}b3`,
        '--edge': `inset 0 0 0 0.5px ${c.accent}${dark ? '2e' : '1f'}`,
      }

    default:
      return {
        '--r-card': '14px',
        '--r-group': '13px',
        '--r-btn': '11px',
        '--r-glyph': '6px',
        '--r-field': '8px',
        '--r-tab': '999px',
        '--r-pebble': '999px',
        '--r-sheet': '22px',
        '--card': face,
        '--card-2': faceUp,
        '--hair': dark ? 'rgba(255,255,255,0.11)' : 'rgba(19,36,48,0.1)',
        '--fill': dark ? 'rgba(255,255,255,0.08)' : 'rgba(19,36,48,0.06)',
        '--shadow': dark ? '0 0 #0000' : '0 6px 18px -8px rgba(19,36,48,0.28)',
        '--edge': '0 0 #0000',
      }
  }
}

/** All the vars the kit reads. Set once, on the canvas. */
function themeVars(c: Concept): CSSProperties {
  return {
    '--a': c.accent,
    '--a2': c.accent2,
    '--ink': c.appInk,
    '--ink2': c.appInkSoft,
    '--glass': c.glass,
    ...skinVars(c),
    background: `linear-gradient(178deg, ${c.appBg[0]} 0%, ${c.appBg[1]} 100%)`,
    color: c.appInk,
  } as CSSProperties
}

/**
 * The whole app screen: themed canvas, scrolling body, fixed chrome.
 *
 * Children are the scrolling content. Anything that should not scroll - the
 * tab bar, a sheet - is passed as `chrome` and rendered above it.
 */
export function AppCanvas({
  c,
  children,
  chrome,
  sheet,
  sheetOpen = false,
  /** extra bottom padding so content clears a floating tab bar */
  inset = true,
}: {
  c: Concept
  children: ReactNode
  /** fixed furniture that belongs to the app - the tab bar */
  chrome?: ReactNode
  /**
   * A presented sheet. Separate from `chrome` because it sits *outside* the
   * stage: iOS presents a sheet by shrinking the screen it came from and
   * rounding its corners, so the sheet has to be a sibling of the thing it is
   * pushing back, not a child of it.
   */
  sheet?: ReactNode
  /**
   * Whether that sheet is currently presented.
   *
   * Deliberately separate from `sheet` itself: the sheet element is always
   * mounted so it can animate in and out, so its mere presence says nothing
   * about whether the screen behind it should be pushed back.
   */
  sheetOpen?: boolean
  inset?: boolean
}) {
  return (
    <div
      className="ios"
      data-surface={c.surface}
      data-skin={c.skin}
      data-sheet={sheetOpen ? '' : undefined}
      style={themeVars(c)}
    >
      <div className="ios__stage">
        <div className={`ios__scroll ${inset ? 'ios__scroll--inset' : ''}`}>
          {children}
        </div>
        {chrome}
      </div>
      {sheet}
      <HomeIndicator />
    </div>
  )
}

/**
 * The app launching.
 *
 * Every real app has this moment and no mockup ever does, which is exactly why
 * it is worth the second it costs: the wordmark on the brand canvas, a
 * determinate-looking progress hairline, then the first screen. It plays once
 * per concept, so moving between screens afterwards is instant.
 */
export function LaunchScreen({ c }: { c: Concept }) {
  return (
    <div
      className="ios ios-launch"
      data-surface={c.surface}
      data-skin={c.skin}
      style={{
        ...themeVars(c),
        background: `linear-gradient(155deg, ${c.accent} 0%, ${c.accentInk} 118%)`,
      }}
    >
      <div className="ios-launch__body">
        <span className="ios-launch__mark">{c.name.slice(0, 1)}</span>
        <span className="ios-launch__name">{c.name}</span>
        <span className="ios-launch__tagline">{c.tagline}</span>
      </div>
      <span aria-hidden="true" className="ios-launch__track">
        <span className="ios-launch__fill" />
      </span>
      <HomeIndicator />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Status bar
 * ------------------------------------------------------------------ */

/**
 * The clock, and the three glyphs on the right.
 *
 * The clock is the real one. Every mockup on the internet says 9:41, which is
 * exactly why it reads as a mockup - a reader glancing at the device and
 * seeing their own time is the cheapest and most convincing signal that this
 * is a running app rather than a picture of one.
 *
 * It starts at Apple's 9:41 so the server and the first client render agree,
 * then takes the real time on mount and keeps it. Minute-granular, so the
 * interval is cheap.
 */
function useClock() {
  const [time, setTime] = useState('9:41')

  useEffect(() => {
    let interval = 0

    const tick = () => {
      const now = new Date()
      const h = now.getHours() % 12 || 12
      setTime(`${h}:${String(now.getMinutes()).padStart(2, '0')}`)
    }

    tick()

    // wait out the rest of the current minute so the clock turns over on the
    // minute rather than 40 seconds into it, then settle into a plain interval
    const lead = window.setTimeout(
      () => {
        tick()
        interval = window.setInterval(tick, 60_000)
      },
      (60 - new Date().getSeconds()) * 1000,
    )

    return () => {
      window.clearTimeout(lead)
      if (interval) window.clearInterval(interval)
    }
  }, [])

  return time
}

/** The status bar: live clock on the left, signal/wifi/battery on the right. */
export function StatusBar() {
  const time = useClock()

  return (
    <div className="ios-status" aria-hidden="true">
      <span className="ios-status__time">{time}</span>
      <span className="ios-status__right">
        <svg viewBox="0 0 17 11" className="ios-status__glyph" width="11">
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={i * 4.4}
              y={7.5 - i * 2.4}
              width="2.9"
              height={3.5 + i * 2.4}
              rx="0.9"
              fill="currentColor"
            />
          ))}
        </svg>
        <svg viewBox="0 0 16 12" className="ios-status__glyph" width="10">
          <path
            d="M8 10.4 5.9 8.2a3 3 0 0 1 4.2 0zM8 6.1a5.6 5.6 0 0 0-4 1.7L2.6 6.3a7.6 7.6 0 0 1 10.8 0L12 7.8a5.6 5.6 0 0 0-4-1.7ZM8 2.2c-2.6 0-5 1-6.8 2.7L0 3.6A11.5 11.5 0 0 1 16 3.6l-1.2 1.3A9.5 9.5 0 0 0 8 2.2Z"
            fill="currentColor"
          />
        </svg>
        <svg viewBox="0 0 26 12" className="ios-status__glyph" width="15">
          <rect
            x="0.6"
            y="0.6"
            width="21"
            height="10.8"
            rx="3.2"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1.1"
          />
          <rect x="2.4" y="2.4" width="14" height="7.2" rx="2" fill="currentColor" />
          <path
            d="M23.4 4.1c1.4.5 1.4 3.3 0 3.8Z"
            fill="currentColor"
            fillOpacity="0.45"
          />
        </svg>
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Navigation bars
 * ------------------------------------------------------------------ */

/** The iOS large title, with an optional eyebrow and a trailing control. */
export function LargeTitle({
  eyebrow,
  title,
  sub,
  right,
}: {
  eyebrow?: string
  title: string
  sub?: string
  right?: ReactNode
}) {
  return (
    <header className="ios-large" data-phone-reveal>
      <div className="ios-large__row">
        <div className="min-w-0">
          {eyebrow ? <p className="ios-large__eyebrow">{eyebrow}</p> : null}
          <h1 className="ios-large__title">{title}</h1>
        </div>
        {right ? <div className="ios-large__right">{right}</div> : null}
      </div>
      {sub ? <p className="ios-large__sub">{sub}</p> : null}
    </header>
  )
}

/** The compact bar a pushed screen gets, with a real back affordance. */
export function NavBar({
  back,
  title,
  onBack,
  right,
}: {
  back?: string
  title: string
  onBack?: () => void
  right?: ReactNode
}) {
  return (
    <header className="ios-nav" data-phone-reveal>
      {back ? (
        <Tap
          press={false}
          ripple="var(--a)"
          label={`Back to ${back}`}
          onTap={onBack}
          className="ios-nav__back"
        >
          <span className="ios-nav__backInner">
            <ChevronLeft className="size-3" strokeWidth={2.8} />
            {back}
          </span>
        </Tap>
      ) : (
        <span />
      )}
      <span className="ios-nav__title">{title}</span>
      <span className="ios-nav__right">{right}</span>
    </header>
  )
}

/** The rounded search field that sits under a large title. */
export function SearchField({ placeholder }: { placeholder: string }) {
  return (
    <div className="ios-search" data-phone-reveal>
      <Search className="size-2.5 shrink-0" strokeWidth={2.6} />
      {placeholder}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Controls
 * ------------------------------------------------------------------ */

/** iOS segmented control - a track, and a thumb that slides between cells. */
export function Segmented({
  items,
  value,
  onChange,
}: {
  items: string[]
  value: number
  onChange: (i: number) => void
}) {
  return (
    <div className="ios-seg" data-phone-reveal>
      <span
        aria-hidden="true"
        className="ios-seg__thumb"
        style={{
          width: `calc((100% - 4px) / ${items.length})`,
          transform: `translateX(${value * 100}%)`,
        }}
      />
      {items.map((label, i) => (
        <Tap
          key={label}
          press={false}
          ripple="var(--a)"
          label={`Show ${label}`}
          onTap={() => onChange(i)}
          className="ios-seg__cell"
        >
          <span data-on={value === i ? '' : undefined}>{label}</span>
        </Tap>
      ))}
    </div>
  )
}

/** The full-width filled button at the bottom of a screen. */
export function PrimaryButton({
  children,
  onTap,
  label,
  tone,
}: {
  children: ReactNode
  onTap?: () => void
  label?: string
  /** overrides the accent - used for the "done" state */
  tone?: string
}) {
  return (
    <Tap ripple="#ffffff" label={label} onTap={onTap}>
      <span
        className="ios-btn"
        style={
          tone
            ? { background: tone, backgroundImage: 'none' }
            : undefined
        }
      >
        {children}
      </span>
    </Tap>
  )
}

/** The quieter companion to PrimaryButton. */
export function GhostButton({
  children,
  onTap,
  label,
}: {
  children: ReactNode
  onTap?: () => void
  label?: string
}) {
  return (
    <Tap ripple="var(--a)" label={label} onTap={onTap}>
      <span className="ios-btn ios-btn--ghost">{children}</span>
    </Tap>
  )
}

/* ------------------------------------------------------------------ *
 * Surfaces
 * ------------------------------------------------------------------ */

/** A plain card. `glass` frosts it instead of filling it. */
export function Card({
  children,
  className = '',
  glass = false,
  style,
}: {
  children: ReactNode
  className?: string
  glass?: boolean
  style?: CSSProperties
}) {
  return (
    <div
      className={`ios-card ${glass ? 'ios-card--glass' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

/** iOS inset grouped list: one rounded block, hairlines between rows. */
export function ListGroup({
  header,
  children,
}: {
  header?: string
  children: ReactNode
}) {
  return (
    <section className="ios-group" data-phone-reveal>
      {header ? <p className="ios-group__header">{header}</p> : null}
      <div className="ios-group__body">{children}</div>
    </section>
  )
}

/** A row inside a ListGroup. Tappable when given `onTap`. */
export function Row({
  leading,
  title,
  sub,
  trailing,
  chevron = false,
  onTap,
  label,
  active = false,
}: {
  leading?: ReactNode
  title: ReactNode
  sub?: ReactNode
  trailing?: ReactNode
  chevron?: boolean
  onTap?: () => void
  label?: string
  active?: boolean
}) {
  const inner = (
    <span className="ios-row" data-active={active ? '' : undefined}>
      {leading ? <span className="ios-row__lead">{leading}</span> : null}
      <span className="ios-row__text">
        <span className="ios-row__title">{title}</span>
        {sub ? <span className="ios-row__sub">{sub}</span> : null}
      </span>
      {trailing ? <span className="ios-row__trail">{trailing}</span> : null}
      {chevron ? (
        <ChevronRight className="ios-row__chev size-2.5" strokeWidth={2.6} />
      ) : null}
    </span>
  )

  if (!onTap) return inner
  return (
    <Tap ripple="var(--a)" label={label} onTap={onTap}>
      {inner}
    </Tap>
  )
}

/** The small coloured disc a row leads with. */
export function Glyph({
  children,
  tone,
  soft = false,
}: {
  children: ReactNode
  tone?: string
  soft?: boolean
}) {
  return (
    <span
      className="ios-glyph"
      style={
        soft
          ? {
              background: `color-mix(in srgb, ${tone ?? 'var(--a)'} 18%, transparent)`,
              color: tone ?? 'var(--a)',
            }
          : {
              background: tone ?? 'var(--a)',
              color: '#fff',
            }
      }
    >
      {children}
    </span>
  )
}

/** A capsule status chip. */
export function Pill({
  children,
  tone,
  solid = false,
}: {
  children: ReactNode
  tone?: string
  solid?: boolean
}) {
  const t = tone ?? 'var(--a)'
  return (
    <span
      className="ios-pill"
      style={
        solid
          ? { background: t, color: '#fff' }
          : {
              background: `color-mix(in srgb, ${t} 16%, transparent)`,
              color: t,
            }
      }
    >
      {children}
    </span>
  )
}

/**
 * A bottom sheet, presented over the screen it came from.
 *
 * Deliberately not a page: the point of a sheet is that the thing you just did
 * is still visible behind it.
 */
export function Sheet({
  open,
  children,
  onDismiss,
}: {
  open: boolean
  children: ReactNode
  onDismiss?: () => void
}) {
  return (
    <div className="ios-sheet" data-open={open ? '' : undefined}>
      <Tap
        press={false}
        ripple="transparent"
        label="Dismiss"
        onTap={onDismiss}
        className="ios-sheet__scrim"
      >
        <span />
      </Tap>
      <div className="ios-sheet__panel">
        <span aria-hidden="true" className="ios-sheet__grabber" />
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * The glass tab bar
 * ------------------------------------------------------------------ */

/**
 * The concept's tab bar - the one piece of chrome every concept shares.
 *
 * It is real glass: a translucent tint with a backdrop blur and saturation
 * boost, a bright hairline along its top edge, and a soft lift underneath.
 * Content scrolls *through* it, which is the entire reason to frost something
 * rather than fill it.
 *
 * Two shapes. `floating` is the detached pill - used by the concepts whose
 * content runs edge to edge underneath it. `docked` is the full-width bar
 * pinned to the bottom, for the flows where the content wants the extra width.
 *
 * Each tab is a screen: the bar drives the same router the arrows and the
 * swipe do, so the case study can be navigated entirely from inside the phone.
 */
export function TabBar({
  c,
  action,
}: {
  c: Concept
  /**
   * The detached circular button that rides beside the bar.
   *
   * Not decoration: current iOS lifts one screen-level action - search, new,
   * scan - out of the tab capsule and gives it its own circle, so a
   * destination and an action never sit in the same control. Apple News,
   * Photos, TV and GitHub all ship exactly this.
   */
  action?: { icon: ConceptIconName; label: string; onTap?: () => void }
}) {
  const { index, go } = usePhoneNav()
  const ActionIcon = action ? CONCEPT_ICONS[action.icon] : null

  return (
    <div className="ios-tabbar">
      <nav
        className="ios-tabs"
        aria-label={`${c.name} tabs`}
        style={{ '--tab-count': c.tabs.length } as CSSProperties}
      >
        {c.tabs.map((t, i) => {
          const Icon = CONCEPT_ICONS[t.icon]
          const on = index === i
          return (
            <Tap
              key={t.label}
              press={false}
              ripple="var(--a)"
              label={`Open ${t.label}`}
              /* siblings, not depth - a tab change cross-fades */
              onTap={() => go(i, 'tab')}
              className="ios-tab"
            >
              <span className="ios-tab__inner" data-on={on ? '' : undefined}>
                <Icon className="ios-tab__icon" strokeWidth={on ? 2.3 : 1.8} />
                {/*
                  A dot, not a label and not a filled pebble.

                  The bar used to carry an icon, a word and a tinted lozenge per
                  destination - three ways of saying the same thing, at a size
                  where the word was four pixels tall and unreadable anyway. One
                  dot under the live icon says it once, and gives the icons room
                  to be big enough to recognise.
                */}
                <span aria-hidden="true" className="ios-tab__dot" />
              </span>
            </Tap>
          )
        })}
      </nav>

      {ActionIcon ? (
        <Tap
          press={false}
          ripple="var(--a)"
          label={action!.label}
          onTap={action!.onTap}
          className="ios-tabaction"
        >
          <span className="ios-tabaction__inner">
            <ActionIcon className="size-[16px]" strokeWidth={2.3} />
          </span>
        </Tap>
      ) : null}
    </div>
  )
}

/**
 * The gesture bar at the foot of the screen.
 *
 * Rendered by the canvas rather than by the tab bar, because it belongs to the
 * device and not to the navigation - the floating-pill layouts still have one
 * underneath the pill, exactly as an iPhone does.
 */
export function HomeIndicator() {
  return <span aria-hidden="true" className="ios-home" />
}

/* ------------------------------------------------------------------ *
 * Small helpers the screens reach for repeatedly
 * ------------------------------------------------------------------ */

/** A stat cell - a big number over a small label. */
export function Stat({
  n,
  label,
  tone,
}: {
  n: string
  label: string
  tone?: string
}) {
  return (
    <span className="ios-stat">
      <span className="ios-stat__n" style={tone ? { color: tone } : undefined}>
        {n}
      </span>
      <span className="ios-stat__label">{label}</span>
    </span>
  )
}

/** A thin progress track. */
export function Track({
  pct,
  tone,
  height = 5,
}: {
  pct: number
  tone?: string
  height?: number
}) {
  return (
    <span className="ios-track" style={{ height }}>
      <span
        className="ios-track__fill"
        style={{
          width: `${Math.max(0, Math.min(100, pct))}%`,
          background: tone ?? 'linear-gradient(90deg, var(--a), var(--a2))',
        }}
      />
    </span>
  )
}

/** The person-shaped disc used wherever a record has a human on it. */
export function Avatar({
  name,
  tone,
  size = 26,
}: {
  name: string
  tone?: string
  size?: number
}) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
  return (
    <span
      className="ios-avatar"
      style={{
        width: size,
        height: size,
        background: tone
          ? `linear-gradient(150deg, ${tone}, color-mix(in srgb, ${tone} 45%, #000))`
          : 'linear-gradient(150deg, var(--a), var(--a2))',
        fontSize: size * 0.36,
      }}
    >
      {initials}
    </span>
  )
}
