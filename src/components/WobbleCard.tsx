import type { ReactNode, MouseEvent } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'

// matches the previous 0.15s ease-out settle by feel
const TILT_SPRING = { stiffness: 420, damping: 34, mass: 0.4 }

/**
 * A card that tilts gently toward the cursor, ported from Aceternity UI's
 * Wobble Card (two-depth mouse-parallax: the outer shell tracks the cursor,
 * the inner content drifts the opposite way at a slightly larger scale, so
 * it reads as one surface with real depth rather than a flat hover state).
 * Kept deliberately restrained here: a smaller max travel distance than the
 * original, our own `.grain-overlay` texture in place of its external
 * noise.webp, and no default background: the caller's own content (a
 * gradient hero, a photo) supplies that.
 *
 * The tilt itself lives entirely in Motion values, not React state: a raw
 * mousemove can fire far more often than a frame, so setState-per-pixel
 * here was re-rendering on every one of those events — and once the
 * `glass` surface's backdrop-blur is behind it, each of those re-renders
 * gets a lot pricier to repaint. Motion values update the transform
 * directly on the node without touching React, same approach
 * CardSpotlight already uses for its cursor glow.
 */
export function WobbleCard({
  children,
  containerClassName = '',
  className = '',
  surface = 'lift',
}: {
  children: ReactNode
  containerClassName?: string
  className?: string
  /** which surface treatment supplies the card's background/border/shadow */
  surface?: 'lift' | 'glass'
}) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, TILT_SPRING)
  const y = useSpring(rawY, TILT_SPRING)
  const innerScale = useSpring(1, TILT_SPRING)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Touch-only devices can fire a synthetic mouseenter on tap with no
  // matching mouseleave, which would otherwise leave the tilt stuck after
  // the finger lifts. Only engage on devices that report real hover support.
  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduced || !canHover) return
    const rect = e.currentTarget.getBoundingClientRect()
    rawX.set((e.clientX - (rect.left + rect.width / 2)) / 26)
    rawY.set((e.clientY - (rect.top + rect.height / 2)) / 26)
  }

  const outerTransform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`
  const innerX = useTransform(x, (v) => -v * 0.6)
  const innerY = useTransform(y, (v) => -v * 0.6)
  const innerTransform = useMotionTemplate`translate3d(${innerX}px, ${innerY}px, 0) scale3d(${innerScale}, ${innerScale}, 1)`

  return (
    <motion.section
      onMouseMove={onMove}
      onMouseEnter={() => canHover && innerScale.set(1.015)}
      onMouseLeave={() => {
        rawX.set(0)
        rawY.set(0)
        innerScale.set(1)
      }}
      style={{ transform: outerTransform }}
      className={`${surface === 'glass' ? 'surface-glass-card' : 'surface-lift'} relative mx-auto w-full overflow-hidden ${containerClassName}`}
    >
      <motion.div style={{ transform: innerTransform }} className={`h-full ${className}`}>
        {children}
      </motion.div>
    </motion.section>
  )
}
