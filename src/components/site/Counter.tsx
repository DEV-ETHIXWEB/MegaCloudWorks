import { useEffect, useRef, useState } from 'react'

/**
 * A number that counts up the first time it is scrolled to.
 *
 * It runs off rAF rather than an interval so it tracks the display's
 * refresh, and it eases out - a linear count reaches its last few digits
 * as fast as its first and reads like a stopwatch rather than a tally
 * settling. Reduced motion gets the finished figure outright.
 */
export function Counter({
  to,
  suffix,
  suffixClassName,
  duration = 1400,
}: {
  to: number
  suffix?: string
  /** the suffix is often set apart - red, lighter - so it takes its own class */
  suffixClassName?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || typeof IntersectionObserver === 'undefined') {
      setShown(to)
      return
    }

    let frame = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()

        const started = performance.now()
        const run = (now: number) => {
          const t = Math.min((now - started) / duration, 1)
          // ease-out cubic: quick off the mark, slow into place
          setShown(Math.round(to * (1 - Math.pow(1 - t, 3))))
          if (t < 1) frame = requestAnimationFrame(run)
        }
        frame = requestAnimationFrame(run)
      },
      { threshold: 0.4 },
    )

    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [to, duration])

  return (
    <span ref={ref}>
      {shown}
      {suffix ? <span className={suffixClassName}>{suffix}</span> : null}
    </span>
  )
}

export default Counter
