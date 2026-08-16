import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * The interaction layer the concept screens are built on.
 *
 * The screens used to be pictures of apps: correct down to the badge colours
 * and completely inert. This makes them answer. Two things are provided:
 *
 *  - `Tap`, which is the only way anything in a screen becomes touchable. It
 *    presses in under the finger, throws a ripple from the exact point of
 *    contact, and is a real button underneath, so it works from the keyboard
 *    and reads correctly to a screen reader.
 *  - `PhoneNav`, the little router the screens navigate each other with. The
 *    concept page already owns which screen is showing; this hands that same
 *    control to the screens themselves, so tapping a job opens the job.
 *
 * Nothing here assumes a provider is present: outside one, `usePhoneNav`
 * returns a no-op. The mini phones on the concept page render the same screen
 * components with no router behind them, and they must stay inert rather than
 * throw.
 */

type PhoneNavValue = {
  /** index of the screen currently on the glass */
  index: number
  /** how many screens this concept has */
  count: number
  /** show screen `i`, clamped into range */
  go: (i: number) => void
  /** the next screen, wrapping at the end */
  next: () => void
  /** the previous screen, wrapping at the start */
  back: () => void
  /** false in the mini phones, where nothing is wired up */
  live: boolean
  /** see useScreenState — the store that outlives a screen change */
  store: Record<string, unknown>
  write: (key: string, value: unknown) => void
}

const NOOP: PhoneNavValue = {
  index: 0,
  count: 0,
  go: () => {},
  next: () => {},
  back: () => {},
  live: false,
  store: {},
  write: () => {},
}

const PhoneNavContext = createContext<PhoneNavValue>(NOOP)

export function PhoneNavProvider({
  index,
  count,
  onGo,
  children,
}: {
  index: number
  count: number
  onGo: (i: number) => void
  children: ReactNode
}) {
  const go = useCallback(
    (i: number) => {
      if (count < 1) return
      onGo(((i % count) + count) % count)
    },
    [count, onGo],
  )

  // Only the screen you are looking at is mounted, so anything a screen
  // remembers in its own useState is thrown away the moment you leave it — you
  // would tick a patient off, walk to their chart, come back, and find the tick
  // gone. The store lives up here instead, where it outlives the screens.
  const [store, setStore] = useState<Record<string, unknown>>({})
  const write = useCallback(
    (key: string, value: unknown) =>
      setStore((cur) => (cur[key] === value ? cur : { ...cur, [key]: value })),
    [],
  )

  return (
    <PhoneNavContext.Provider
      value={{
        index,
        count,
        go,
        next: () => go(index + 1),
        back: () => go(index - 1),
        live: true,
        store,
        write,
      }}
    >
      {children}
    </PhoneNavContext.Provider>
  )
}

export function usePhoneNav() {
  return useContext(PhoneNavContext)
}

/**
 * Anything in a screen that can be touched.
 *
 * Renders a button, so Enter and Space work and the element is reachable by
 * tab. The press state is driven from pointer events rather than :active
 * because it has to survive the finger sliding a few pixels — on a real phone
 * a tap that wobbles is still a tap.
 */
export function Tap({
  children,
  onTap,
  label,
  className = '',
  style,
  /** the ripple's colour; defaults to the concept accent passed by the screen */
  ripple = 'currentColor',
  /** the whole row presses in — off for small controls that should only flash */
  press = true,
  disabled = false,
}: {
  children: ReactNode
  onTap?: () => void
  label?: string
  className?: string
  style?: React.CSSProperties
  ripple?: string
  press?: boolean
  disabled?: boolean
}) {
  const { live } = usePhoneNav()
  const [down, setDown] = useState(false)
  // one ripple element per tap, keyed so a fast double-tap animates twice
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([])
  const seq = useRef(0)

  const spawn = (e: React.PointerEvent<HTMLButtonElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    const id = ++seq.current
    setRipples((cur) => [
      ...cur,
      { id, x: e.clientX - box.left, y: e.clientY - box.top },
    ])
    // matches the ripple's animation length in styles.css
    window.setTimeout(
      () => setRipples((cur) => cur.filter((r) => r.id !== id)),
      620,
    )
  }

  // Outside a provider — the mini phones in the screen picker — there is
  // nothing to touch, and each of those phones already sits inside the
  // picker's own button. Rendering another button there would nest one inside
  // the other, which is invalid and makes the outer one unclickable in places.
  // A plain span keeps the layout identical and stays out of the way.
  if (!live) {
    return (
      <span className={`phone-tap phone-tap--inert ${className}`} style={style}>
        {children}
      </span>
    )
  }

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={label}
      data-down={down ? '' : undefined}
      className={`phone-tap ${press ? '' : 'phone-tap--flat'} ${className}`}
      style={{ ...style, ['--ripple' as string]: ripple }}
      onPointerDown={(e) => {
        if (disabled) return
        setDown(true)
        spawn(e)
      }}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      onPointerCancel={() => setDown(false)}
      onClick={(e) => {
        // the glass sits inside a device that can be picked up and turned;
        // a tap on a control is not also a grab
        e.stopPropagation()
        onTap?.()
      }}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          className="phone-tap__ripple"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </button>
  )
}

/**
 * Screen state that survives leaving the screen.
 *
 * Same shape as useState, including the updater-function form, but the value
 * is kept by the provider under `key` rather than by the component. Outside a
 * provider it degrades to a plain useState, which is what the inert mini phones
 * want anyway.
 *
 * Keys are per concept, since one provider wraps one concept's four screens.
 */
export function useScreenState<T>(key: string, initial: T) {
  const { live, store, write } = usePhoneNav()
  const local = useState(initial)

  if (!live) return local

  const value = (key in store ? store[key] : initial) as T
  const set = (next: T | ((cur: T) => T)) =>
    write(
      key,
      typeof next === 'function' ? (next as (cur: T) => T)(value) : next,
    )

  return [value, set] as [T, (next: T | ((cur: T) => T)) => void]
}

/**
 * A row that is selected by touching it — the state most of these screens were
 * faking with a hardcoded "the first one is highlighted".
 *
 * Seeded with whichever row the screen was drawn with, so it still looks right
 * before anything has been touched.
 */
export function useChoice(key: string, initial = 0) {
  return useScreenState(key, initial)
}
