import { useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'motion/react'

/**
 * A radial glow that follows the cursor on hover — the same idea as
 * Aceternity's CardSpotlight, rebuilt on plain CSS/Motion instead of a
 * Three.js dot-matrix shader (this project has neither shadcn/ui nor
 * three/@react-three/fiber installed, and a WebGL canvas is a lot of
 * dependency for a corner-of-the-eye hover effect on three small cards).
 * Same mouse-tracking approach WobbleCard and ServiceCircles already use.
 */
export function CardSpotlight({
  children,
  color = 'rgba(255,255,255,0.12)',
  radius = 220,
  className = '',
}: {
  children: ReactNode
  /** the glow's color at its center */
  color?: string
  /** how far the glow reaches, in px */
  radius?: number
  className?: string
}) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [hovering, setHovering] = useState(false)
  // Touchscreens with no real pointer can fire a synthetic mouseenter on tap
  // (and sometimes never a matching mouseleave), which would otherwise leave
  // this glow stuck on after the user's finger lifts. Real hover devices
  // (mouse/trackpad) report `(hover: hover)`; touch-only ones don't, so the
  // effect simply never engages there instead of risking a stuck state.
  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!canHover) return
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 80%)`

  return (
    <div
      className={`relative ${className}`}
      onMouseMove={onMove}
      onMouseEnter={() => canHover && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300"
        style={{ background, opacity: hovering ? 1 : 0 }}
      />
      {children}
    </div>
  )
}
