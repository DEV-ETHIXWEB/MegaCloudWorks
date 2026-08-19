import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'

/**
 * A stat's number counts up from 0 once it scrolls into view — the same
 * once-only, margin-triggered pattern Reveal uses for opacity/position,
 * driving a number instead so "40+ apps shipped" reads as a live tally
 * loading in rather than a static label.
 */
export function AnimatedStat({ value }: { value: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const match = value.match(/^(\d+)(.*)$/)
  const target = match ? Number(match[1]) : 0
  const suffix = match ? match[2] : ''
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView || !match) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setN(target)
      return
    }
    const duration = 1200
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setN(Math.round(eased * target))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target])

  return (
    <p ref={ref} className="font-sans text-5xl font-black tracking-tight text-white sm:text-6xl">
      {match ? n : value}
      {suffix}
    </p>
  )
}
