import { motion, type Variants } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
}

export function Reveal({
  children,
  delay = 0,
  className,
  style,
  as: As = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
  as?: 'div' | 'li'
}) {
  const Component = motion[As]
  return (
    <Component
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </Component>
  )
}
