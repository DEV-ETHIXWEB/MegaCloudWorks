import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import type { Transition } from 'motion/react'

type Snapshot = Record<string, string | number>

const buildKeyframes = (from: Snapshot, steps: Array<Snapshot>) => {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ])

  const keyframes: Record<string, Array<string | number>> = {}
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])]
  })
  return keyframes
}

/**
 * Text that blurs into focus a word (or letter) at a time.
 *
 * By default it fires when it scrolls into view. Pass `start` to drive it from
 * outside instead — the scroll-choreographed bridge on the About page holds
 * each block until its beat in the sequence arrives.
 */
export function BlurText({
  text = '',
  delay = 200,
  className = '',
  as: Tag = 'p',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  start,
  onAnimationComplete,
  stepDuration = 0.35,
}: {
  text?: string
  delay?: number
  className?: string
  as?: 'p' | 'span' | 'div'
  animateBy?: 'words' | 'letters'
  direction?: 'top' | 'bottom'
  threshold?: number
  rootMargin?: string
  /** when supplied, the animation runs on this flag instead of on scroll */
  start?: boolean
  onAnimationComplete?: () => void
  stepDuration?: number
}) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const driven = start !== undefined

  useEffect(() => {
    if (driven) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setInView(true)
        observer.unobserve(el)
      },
      { threshold, rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, driven])

  const from = useMemo<Snapshot>(
    () =>
      direction === 'top'
        ? { filter: 'blur(10px)', opacity: 0, y: -22 }
        : { filter: 'blur(10px)', opacity: 0, y: 22 },
    [direction],
  )

  const to = useMemo<Array<Snapshot>>(
    () => [
      { filter: 'blur(5px)', opacity: 0.5, y: direction === 'top' ? 4 : -4 },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ],
    [direction],
  )

  const playing = driven ? start : inView
  const stepCount = to.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1),
  )
  const keyframes = buildKeyframes(from, to)

  const MotionTag = motion[Tag]

  return (
    <MotionTag ref={ref as never} className={className}>
      {elements.map((segment, index) => {
        const transition: Transition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
        }

        return (
          <motion.span
            key={index}
            className="inline-block will-change-[transform,filter,opacity]"
            initial={from}
            animate={playing ? keyframes : from}
            transition={transition}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
          >
            {segment === ' ' ? ' ' : segment}
            {animateBy === 'words' && index < elements.length - 1 && ' '}
          </motion.span>
        )
      })}
    </MotionTag>
  )
}

export default BlurText
