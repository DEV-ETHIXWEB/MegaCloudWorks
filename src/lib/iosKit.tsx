import { Fragment, useEffect, useState } from 'react'
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
  /* A face is an opaque slab of the concept's surface colour rather than a
     wash over the canvas. The hairline is the only non-colour in here: a
     single per-cent edge, the way the gallery draws it - lit from above on a
     dark app, drawn as a hairline on a paper one. */
  const face = c.appSurface
  const faceUp = c.appSurface2
  const hair =
    c.surface === 'dark' ? 'rgba(255,255,255,0.09)' : 'rgba(11,11,12,0.10)'

  switch (c.skin) {
    /* Fieldly - a tool. Square-ish, matte, welded to the canvas. */
    case 'industrial':
      return {
        '--r-card': '10px',
        '--r-group': '10px',
        '--r-btn': '10px',
        '--r-glyph': '6px',
        '--r-field': '8px',
        '--r-tab': '16px',
        '--r-pebble': '10px',
        '--r-sheet': '14px',
        '--card': face,
        '--card-2': faceUp,
        '--hair': hair,
        '--fill': faceUp,
        /* `0 0 #0000` rather than `none`: these two vars are composed into one
           comma-separated box-shadow, and `none` inside a shadow list voids the
           whole declaration */
        '--shadow':
          c.surface === 'dark'
            ? '0 0 #0000'
            : '0 10px 26px -18px rgba(11,11,12,0.5)',
        '--edge': '0 0 #0000',
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
        '--card': face,
        '--card-2': faceUp,
        '--hair': hair,
        '--fill': faceUp,
        '--shadow': '0 10px 24px -16px rgba(0,0,0,0.8)',
        '--edge': '0 0 #0000',
      }

    /* Slate - glass over a calendar. Translucent, crisp-edged, lifted. */
    case 'glass':
      return {
        '--r-card': '16px',
        '--r-group': '16px',
        '--r-btn': '12px',
        '--r-glyph': '8px',
        '--r-field': '10px',
        '--r-tab': '999px',
        '--r-pebble': '999px',
        '--r-sheet': '22px',
        '--card': `color-mix(in srgb, ${face} 78%, transparent)`,
        '--card-2': `color-mix(in srgb, ${faceUp} 82%, transparent)`,
        '--hair':
          c.surface === 'dark'
            ? 'rgba(255,255,255,0.11)'
            : 'rgba(11,11,12,0.12)',
        '--fill': faceUp,
        '--shadow': '0 12px 28px -20px rgba(0,0,0,0.9)',
        '--edge': 'inset 0 0.5px 0 rgba(255,255,255,0.1)',
      }

    /* Prophy - clinical. Flat, outlined, sitting *on* the canvas, not above it. */
    case 'clinical':
      return {
        '--r-card': '12px',
        '--r-group': '12px',
        '--r-btn': '10px',
        '--r-glyph': '7px',
        '--r-field': '8px',
        '--r-tab': '17px',
        '--r-pebble': '11px',
        '--r-sheet': '16px',
        '--card': face,
        '--card-2': faceUp,
        '--hair': hair,
        '--fill': faceUp,
        /* no drop by design: nothing in a surgery is floating */
        '--shadow': '0 0 #0000',
        '--edge': '0 0 #0000',
      }

    /* Leadr - the roundest, and the only one that glows. Its accent lands on
       the ink underneath every card rather than staying inside it. */
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
        '--card': face,
        '--card-2': faceUp,
        '--hair': `color-mix(in srgb, ${c.appAccent} 20%, rgba(255,255,255,0.07))`,
        '--fill': faceUp,
        '--shadow': `0 16px 34px -24px ${c.appAccent}`,
        '--edge': `inset 0 0 0 0.5px ${c.appAccent}26`,
      }

    default:
      return {
        '--r-card': '16px',
        '--r-group': '16px',
        '--r-btn': '12px',
        '--r-glyph': '6px',
        '--r-field': '8px',
        '--r-tab': '999px',
        '--r-pebble': '999px',
        '--r-sheet': '22px',
        '--card': face,
        '--card-2': faceUp,
        '--hair': hair,
        '--fill': faceUp,
        '--shadow': '0 0 #0000',
        '--edge': '0 0 #0000',
      }
  }
}

/** All the vars the kit reads. Set once, on the canvas. */
function themeVars(c: Concept): CSSProperties {
  return {
    '--a': c.appAccent,
    /* the accent lightened again - what accent-coloured *type* is set in, so a
       13px label never has to be legible in the graphic version of the colour */
    '--a-soft': c.appAccentSoft,
    '--a2': c.appAccent2,
    /* what goes on top of a filled accent. Bright mint and lavender take the
       app's own ink, never white. */
    '--on-a': c.appOnAccent,
    '--ink': c.appInk,
    '--ink2': c.appInkSoft,
    '--surf': c.appSurface,
    '--surf-2': c.appSurface2,
    /*
      The slab: the object that carries the day, and the thing legible on it.
      On paper it is the ink itself - a black card cut out of a white ground.
      On ink there is no blacker black to cut with, so it becomes the most
      lifted face the app has, and the relationship survives the inversion
      even though the hex does not.
    */
    '--slab': c.surface === 'dark' ? c.appSurface2 : c.appInk,
    '--on-slab': c.surface === 'dark' ? c.appInk : c.appSurface,
    '--slab-hair':
      c.surface === 'dark' ? 'rgba(255,255,255,0.12)' : 'transparent',
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
      data-nav={c.nav}
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
        background: `linear-gradient(155deg, ${c.appAccent} 0%, ${c.appSurface} 118%)`,
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

/**
 * The app launching, wherever the app appears.
 *
 * Every real app has this moment and no mockup ever does, which is exactly why
 * it is worth the second it costs. The case-study hero has always played it;
 * this is the same beat for every other device on the site, so a phone in a
 * grid boots like a phone rather than arriving fully dressed.
 *
 * Staggered by `delay` so a page of five does not flash them all at once, and
 * skipped outright when the reader has asked for less motion.
 */
export function Booting({
  c,
  delay = 0,
  hold = 620,
  children,
}: {
  c: Concept
  /** how long after mount this one starts, in ms */
  delay?: number
  /**
   * How long the launch screen is held before the app takes over. The hero of
   * a case study can afford the full beat; a page of ten devices cannot, and
   * turns this right down so the screens are simply there on arrival.
   */
  hold?: number
  children: ReactNode
}) {
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBooted(true)
      return
    }
    const t = window.setTimeout(() => setBooted(true), hold + delay)
    return () => window.clearTimeout(t)
  }, [delay, hold])

  return booted ? <>{children}</> : <LaunchScreen c={c} />
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
/*
 * One clock for the whole page.
 *
 * A page of devices used to run a timeout and an interval per status bar -
 * ten phones on the Work index meant ten timers all firing on the same minute
 * to write the same string. The tick lives at module scope instead: the first
 * status bar to mount starts it, the last to unmount stops it, and everything
 * in between is a subscription.
 */
const clockWatchers = new Set<(t: string) => void>()
let clockNow = '9:41'
let clockLead = 0
let clockInterval = 0

function readClock() {
  const now = new Date()
  const h = now.getHours() % 12 || 12
  return `${h}:${String(now.getMinutes()).padStart(2, '0')}`
}

function publishClock() {
  const next = readClock()
  if (next === clockNow) return
  clockNow = next
  clockWatchers.forEach((fn) => fn(next))
}

function watchClock(fn: (t: string) => void) {
  clockWatchers.add(fn)

  if (clockWatchers.size === 1) {
    publishClock()
    // wait out the rest of the current minute so the clock turns over on the
    // minute rather than 40 seconds into it, then settle into a plain interval
    clockLead = window.setTimeout(
      () => {
        publishClock()
        clockInterval = window.setInterval(publishClock, 60_000)
      },
      (60 - new Date().getSeconds()) * 1000,
    )
  }

  return () => {
    clockWatchers.delete(fn)
    if (clockWatchers.size) return
    if (clockLead) window.clearTimeout(clockLead)
    if (clockInterval) window.clearInterval(clockInterval)
    clockLead = 0
    clockInterval = 0
  }
}

function useClock() {
  const [time, setTime] = useState('9:41')

  useEffect(() => {
    if (typeof window === 'undefined') return
    setTime(readClock())
    return watchClock(setTime)
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
          <rect
            x="2.4"
            y="2.4"
            width="14"
            height="7.2"
            rx="2"
            fill="currentColor"
          />
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
        style={tone ? { background: tone, backgroundImage: 'none' } : undefined}
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
              color: 'var(--on-a)',
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
          ? { background: t, color: 'var(--on-a)' }
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
 * Navigation - five shapes cut from one stock
 * ------------------------------------------------------------------ */

/**
 * The concept's navigation - and the one piece of chrome the five deliberately
 * do *not* share.
 *
 * The material is common to all of them, the way it is in the gallery: a
 * translucent tint of the app's own surface, blurred and saturated, a hairline
 * along the edge, an icon per destination and a mark under the live one.
 * Content scrolls *through* it, which is the entire reason to frost something
 * rather than fill it.
 *
 * The shape is not. A console gets a squared bar welded to the bottom edge
 * with its labels showing; a wallet gets no bar at all and deals its
 * destinations out of a hamburger; a booking flow gets the floating capsule
 * with a thumb that slides; a clinical app gets a bar whose mark fades in
 * place because nothing chairside should travel; a pipeline gets the capsule
 * with the accent blooming out of whatever was tapped. See ConceptNav.
 *
 * Every shape drives the same router the arrows and the swipe do, so the case
 * study can be navigated entirely from inside the phone.
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
  if (c.nav === 'drawer') return <DrawerNav c={c} action={action} />
  return <BarNav c={c} action={action} />
}

/** The circular action that rides beside - or inside - every shape of bar. */
function TabAction({
  action,
  inline = false,
}: {
  action?: { icon: ConceptIconName; label: string; onTap?: () => void }
  /** true when the action sits in the bar rather than detached from it */
  inline?: boolean
}) {
  if (!action) return null
  const Icon = CONCEPT_ICONS[action.icon]
  return (
    <Tap
      press={false}
      ripple="var(--a)"
      label={action.label}
      onTap={action.onTap}
      className={inline ? 'ios-tabaction ios-tabaction--in' : 'ios-tabaction'}
    >
      <span className="ios-tabaction__inner">
        <Icon className="size-[16px]" strokeWidth={2.3} />
      </span>
    </Tap>
  )
}

/**
 * Four of the five shapes, which differ by what the indicator does rather than
 * by what they are made of.
 *
 * `--tab-i` is the live index, published on the bar so CSS can put the mark
 * where it belongs without a second element per tab. `key={bump}` remounts the
 * mark on every change, which is how the shapes that answer a tap with a
 * one-shot animation - the console's cut, the pipeline's bloom - replay it:
 * an animation cannot restart itself while it is still the same element.
 */
function BarNav({
  c,
  action,
}: {
  c: Concept
  action?: { icon: ConceptIconName; label: string; onTap?: () => void }
}) {
  const { index, go } = usePhoneNav()
  const [bump, setBump] = useState(0)

  return (
    <div className="ios-tabbar" data-nav={c.nav}>
      <nav
        className="ios-tabs"
        aria-label={`${c.name} tabs`}
        style={
          {
            '--tab-count': c.tabs.length,
            '--tab-i': index,
          } as CSSProperties
        }
      >
        {/* the mark, drawn once and moved - a rail on the console, a capsule
            under the booking flow, a lit lozenge on the pipeline. The clinical
            bar has none: its mark fades in under the icon instead. */}
        {c.nav === 'still' ? null : (
          <span key={bump} aria-hidden="true" className="ios-tabs__thumb" />
        )}

        {c.tabs.map((t, i) => {
          const Icon = CONCEPT_ICONS[t.icon]
          const on = index === i
          return (
            <Fragment key={t.label}>
              {/* the dock's action is not at one end of the bar - it is raised
                  out of the middle of it, so the destinations are dealt around
                  it rather than beside it */}
              {c.nav === 'dock' && i === c.tabs.length / 2 ? (
                <TabAction action={action} inline />
              ) : null}

              <Tap
                press={false}
                ripple="var(--a)"
                label={`Open ${t.label}`}
                /* siblings, not depth - a tab change cross-fades */
                onTap={() => {
                  setBump((b) => b + 1)
                  go(i, 'tab')
                }}
                className="ios-tab"
              >
                <span className="ios-tab__inner" data-on={on ? '' : undefined}>
                  <Icon
                    className="ios-tab__icon"
                    strokeWidth={on ? 2.3 : 1.8}
                  />
                  {/*
                    A dot, not a label and not a filled pebble - except on the
                    console, where the bar is squared, the labels stay on and a
                    dispatcher reads words rather than pictures, and on the
                    booking flow, where the live one opens to say its name.
                  */}
                  <span aria-hidden="true" className="ios-tab__dot" />
                  <span className="ios-tab__label">{t.label}</span>
                </span>
              </Tap>
            </Fragment>
          )
        })}

        {c.nav === 'capsule' ? <TabAction action={action} inline /> : null}
      </nav>

      {/* the short capsule has no room beside it for a detached circle, and
          nothing either side of it to detach *from*; the dock raises its own
          out of the middle - so both carry the action inside the bar */}
      {c.nav === 'capsule' || c.nav === 'dock' || c.nav === 'slab' ? null : (
        <TabAction action={action} />
      )}
    </div>
  )
}

/**
 * The wallet's navigation: a hamburger, and destinations that deal upwards.
 *
 * A wallet's whole screen is one big object - a balance card, a stack of shop
 * cards - and a permanent bar across the foot of it spends a fifth of the
 * glass saying something the reader needs twice a session. So there is no bar.
 * There is a thumb-height button, the name of where you are, and four cards
 * that come off the stack when it is pressed, each a beat behind the last.
 */
function DrawerNav({
  c,
  action,
}: {
  c: Concept
  action?: { icon: ConceptIconName; label: string; onTap?: () => void }
}) {
  const { index, go } = usePhoneNav()
  const [open, setOpen] = useState(false)

  return (
    <div className="ios-drawer" data-open={open ? '' : undefined}>
      {/* tapping anywhere else puts the cards back */}
      <Tap
        press={false}
        ripple="transparent"
        label="Close the menu"
        onTap={() => setOpen(false)}
        className="ios-drawer__scrim"
      >
        <span />
      </Tap>

      <nav className="ios-drawer__menu" aria-label={`${c.name} menu`}>
        {c.tabs.map((t, i) => {
          const Icon = CONCEPT_ICONS[t.icon]
          const on = index === i
          return (
            <Tap
              key={t.label}
              press={false}
              ripple="var(--a)"
              label={`Open ${t.label}`}
              onTap={() => {
                setOpen(false)
                go(i, 'tab')
              }}
              className="ios-drawer__item"
              /* the deal: one beat per card, counted from the bottom, so the
                 card nearest the thumb is the one that arrives first */
              style={
                {
                  '--d': `${(c.tabs.length - 1 - i) * 45}ms`,
                } as CSSProperties
              }
            >
              <span className="ios-drawer__card" data-on={on ? '' : undefined}>
                <Icon className="size-[15px]" strokeWidth={on ? 2.4 : 1.9} />
                {t.label}
              </span>
            </Tap>
          )
        })}
      </nav>

      <div className="ios-drawer__row">
        <Tap
          press={false}
          ripple="var(--a)"
          label={open ? 'Close the menu' : 'Open the menu'}
          onTap={() => setOpen((o) => !o)}
          className="ios-drawer__toggle"
        >
          <span className="ios-drawer__toggleInner">
            {/* three rules that fold into a cross */}
            <span aria-hidden="true" className="ios-drawer__bars">
              <i />
              <i />
              <i />
            </span>
          </span>
        </Tap>

        <span className="ios-drawer__now">{c.tabs[index]?.label}</span>

        <TabAction action={action} />
      </div>
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
