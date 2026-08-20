import { useState } from 'react'
import type { ReactNode, MouseEvent } from 'react'
import { motion } from 'motion/react'

/**
 * A card that tilts gently toward the cursor — ported from Aceternity UI's
 * Wobble Card (two-depth mouse-parallax: the outer shell tracks the cursor,
 * the inner content drifts the opposite way at a slightly larger scale, so
 * it reads as one surface with real depth rather than a flat hover state).
 * Kept deliberately restrained here: a smaller max travel distance than the
 * original, our own `.grain-overlay` texture in place of its external
 * noise.webp, and no default background — the caller's own content (a
 * gradient hero, a photo) supplies that.
 */
export function WobbleCard({
  children,
  containerClassName = '',
  className = '',
}: {
  children: ReactNode
  containerClassName?: string
  className?: string
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    setPos({
      x: (e.clientX - (rect.left + rect.width / 2)) / 26,
      y: (e.clientY - (rect.top + rect.height / 2)) / 26,
    })
  }

  return (
    <motion.section
      onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false)
        setPos({ x: 0, y: 0 })
      }}
      style={{
        transform: hovering ? `translate3d(${pos.x}px, ${pos.y}px, 0)` : 'translate3d(0px, 0px, 0)',
        transition: 'transform 0.15s ease-out',
      }}
      className={`surface-lift relative mx-auto w-full overflow-hidden ${containerClassName}`}
    >
      <motion.div
        style={{
          transform: hovering
            ? `translate3d(${-pos.x * 0.6}px, ${-pos.y * 0.6}px, 0) scale3d(1.015, 1.015, 1)`
            : 'translate3d(0px, 0px, 0) scale3d(1, 1, 1)',
          transition: 'transform 0.15s ease-out',
        }}
        className={`h-full ${className}`}
      >
        {children}
      </motion.div>
    </motion.section>
  )
}
