import { useEffect, useRef } from 'react'

/**
 * One act per gesture.
 *
 * GSAP's own `snap` settles *after* a scroll has already run, which means a
 * fast flick still tears through three acts before anything catches it - and
 * near the ends it fights the reader trying to leave the section. This takes
 * the opposite approach: while the story fills the viewport, a scroll gesture
 * is a discrete instruction to move to the next stop, and the page is animated
 * there. Nothing is ever half-shown.
 *
 * The lock is deliberately easy to escape:
 *
 * - at the first stop, scrolling up is not intercepted, so you leave upward;
 * - at the last stop, scrolling down is not intercepted, so the page carries
 *   on to the next section;
 * - anything scrollable under the pointer (the open brief, on a short window)
 *   gets the gesture first and only hands it over once it is at its own end;
 * - reduced-motion users never get it at all.
 *
 * Keyboard paging is wired to the same stops so the section is not a trap for
 * anyone driving with the keys.
 */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Which stop is nearest a given progress - used to resync after free scroll. */
function nearest(points: ReadonlyArray<number>, p: number) {
  let best = 0
  let bestGap = Infinity
  points.forEach((point, i) => {
    const gap = Math.abs(point - p)
    if (gap < bestGap) {
      bestGap = gap
      best = i
    }
  })
  return best
}

/** Can `el`, or something between it and the section, still scroll `dir`? */
function absorbedByInnerScroller(
  target: EventTarget | null,
  root: HTMLElement,
  dir: number,
) {
  let node = target instanceof Element ? target : null
  while (node && node !== root) {
    const style = getComputedStyle(node)
    const scrolls = /(auto|scroll)/.test(style.overflowY)
    if (scrolls && node.scrollHeight > node.clientHeight + 1) {
      const room =
        dir > 0
          ? node.scrollHeight - node.clientHeight - node.scrollTop
          : node.scrollTop
      if (room > 1) return true
    }
    node = node.parentElement
  }
  return false
}

export function useSectionScroll({
  sectionRef,
  points,
  enabled = true,
  onIndexChange,
}: {
  sectionRef: React.RefObject<HTMLElement | null>
  /** progress values, 0 → 1, in ascending order */
  points: ReadonlyArray<number>
  enabled?: boolean
  onIndexChange?: (index: number) => void
}) {
  const index = useRef(0)
  const animating = useRef(false)
  const goRef = useRef<(next: number) => void>(() => {})

  useEffect(() => {
    const root = sectionRef.current
    if (!root || !enabled || typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0

    const span = () => root.offsetHeight - window.innerHeight
    const scrollFor = (p: number) => root.offsetTop + span() * p

    /** Is the story the thing on screen right now? */
    const engaged = () => {
      const r = root.getBoundingClientRect()
      return r.top <= 1 && r.bottom >= window.innerHeight - 1
    }

    const go = (next: number) => {
      const target = Math.max(0, Math.min(points.length - 1, next))
      index.current = target
      onIndexChange?.(target)

      const from = window.scrollY
      const to = scrollFor(points[target])
      const distance = Math.abs(to - from)
      if (distance < 2) return

      // longer journeys get proportionally longer, but never brisk: the last
      // leg in particular is a whole section opening out of a phone screen and
      // wants to be watched rather than jumped
      const seconds = Math.min(
        2.2,
        0.75 + (distance / window.innerHeight) * 0.5,
      )
      const start = performance.now()
      animating.current = true

      if (raf) cancelAnimationFrame(raf)
      const tick = (now: number) => {
        const t = clamp01((now - start) / (seconds * 1000))
        // a long, symmetrical ease - no snap at either end
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        window.scrollTo(0, from + (to - from) * eased)
        if (t < 1) {
          raf = requestAnimationFrame(tick)
        } else {
          raf = 0
          animating.current = false
        }
      }
      raf = requestAnimationFrame(tick)
    }
    goRef.current = go

    const step = (dir: number, event: Event, target: EventTarget | null) => {
      if (!engaged()) return

      // A move already in flight owns the scroll position outright. Without
      // this the tail of a flick keeps arriving as native scrolling and drags
      // the page backwards underneath the animation.
      if (animating.current) {
        event.preventDefault()
        return
      }

      if (absorbedByInnerScroller(target, root, dir)) return

      const next = index.current + dir
      // at either end the gesture belongs to the page, not to us
      if (next < 0 || next > points.length - 1) return

      event.preventDefault()
      go(next)
    }

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 2) return
      step(e.deltaY > 0 ? 1 : -1, e, e.target)
    }

    let touchY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY
      const dy = touchY - y
      if (Math.abs(dy) < 36) return
      touchY = y
      step(dy > 0 ? 1 : -1, e, e.target)
    }

    const PAGE_KEYS: Record<string, number> = {
      ArrowDown: 1,
      PageDown: 1,
      ArrowUp: -1,
      PageUp: -1,
    }
    const onKey = (e: KeyboardEvent) => {
      const el = e.target
      // never steal keys from something being typed into
      if (
        el instanceof HTMLElement &&
        (el.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))
      ) {
        return
      }
      const dir = PAGE_KEYS[e.key]
      if (dir) step(dir, e, null)
    }

    /** Keep the index honest after any scrolling we did not drive. */
    const onScroll = () => {
      if (animating.current) return
      const s = span()
      if (s <= 0) return
      const p = clamp01((window.scrollY - root.offsetTop) / s)
      const found = nearest(points, p)
      if (found !== index.current) {
        index.current = found
        onIndexChange?.(found)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
    }
  }, [sectionRef, points, enabled, onIndexChange])

  /** Jump to a stop from outside - the phone screen uses this. */
  return { goTo: (i: number) => goRef.current(i) }
}

export default useSectionScroll
