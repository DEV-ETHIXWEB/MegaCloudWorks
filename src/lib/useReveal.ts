import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Blocks arriving into focus as they reach the screen.
 *
 * Mark anything with `data-reveal`. The value picks how it arrives - see
 * styles.css for the four:
 *
 *   data-reveal          rise: up and out of a blur (the default)
 *   data-reveal="mask"   a wipe upward, for headings and big type
 *   data-reveal="sweep"  a wipe from the left, for rules and wide images
 *   data-reveal="scale"  settles in from slightly too far away, for plates
 *
 * Add `data-reveal-stagger` and the element's own children are dealt out one
 * after another instead of arriving together; each child is given its index as
 * `--i`, which the stylesheet turns into a delay.
 *
 * The hidden state is only ever applied here, in JavaScript. A block whose
 * observer never runs is therefore simply visible - the failure mode is "no
 * animation", never "no content". A dead-observer timer covers the rest.
 */
export function useReveal(
  root: RefObject<HTMLElement | null>,
  /** re-arm when this changes - e.g. the route's slug */
  key?: unknown,
) {
  useEffect(() => {
    const scope = root.current
    if (!scope || typeof window === 'undefined') return

    const blocks = Array.from(
      scope.querySelectorAll<HTMLElement>('[data-reveal]'),
    )
    if (!blocks.length) return

    const show = (el: HTMLElement) => el.setAttribute('data-shown', '')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce || typeof IntersectionObserver === 'undefined') {
      blocks.forEach(show)
      return
    }

    // a stagger group hands each child its place in the queue
    scope
      .querySelectorAll<HTMLElement>('[data-reveal-stagger]')
      .forEach((group) => {
        Array.from(group.children).forEach((child, i) => {
          if (!(child instanceof HTMLElement)) return
          child.dataset.revealChild = ''
          child.style.setProperty('--i', String(i))
        })
      })

    blocks.forEach((el) => el.setAttribute('data-armed', ''))

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          // Trigger ONLY when the element intersects the screen or is above the fold
          if (e.isIntersecting || e.boundingClientRect.top < window.innerHeight) {
            show(e.target as HTMLElement)
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -5% 0px' },
    )

    blocks.forEach((el) => io.observe(el))

    return () => {
      io.disconnect()
    }
  }, [root, key])
}

export default useReveal
