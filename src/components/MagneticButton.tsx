import { useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

type Props = {
  children: ReactNode
  to?: string
  href?: string
  variant?: 'solid' | 'outline' | 'ghost' | 'edge-hover'
  size?: 'md' | 'lg'
  className?: string
}

export function MagneticButton({ children, to, href, variant = 'solid', size = 'md', className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // A magnetic pull that actually reads as magnetic rather than the button
  // chasing the cursor: displacement is clamped to a couple of pixels
  // regardless of how large the button is or how close to its edge the
  // cursor gets, so the effect stays a subtle nudge, not a slide.
  const MAX_PULL = 2

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = clamp(((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * MAX_PULL, -MAX_PULL, MAX_PULL)
    const y = clamp(((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * MAX_PULL, -MAX_PULL, MAX_PULL)
    setPos({ x, y })
  }

  const reset = () => setPos({ x: 0, y: 0 })

  const base =
    variant === 'solid'
      ? 'edge-hard bg-[var(--brand)] text-white'
      : variant === 'outline'
        ? 'border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white'
        : variant === 'edge-hover'
          ? 'edge-hard-onhover bg-[var(--paper)] text-[var(--ink)]'
          : 'text-[var(--ink)] hover:text-[var(--brand-text)]'

  const sizing = size === 'lg' ? 'px-8 py-4 text-base' : 'px-6 py-3 text-sm'

  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-bold no-underline transition-colors ${base} ${sizing} ${className}`

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.5 }}
      className="inline-block"
    >
      {to ? (
        <Link to={to} className={cls}>
          {children}
        </Link>
      ) : (
        <a href={href} className={cls}>
          {children}
        </a>
      )}
    </motion.div>
  )

  return content
}
