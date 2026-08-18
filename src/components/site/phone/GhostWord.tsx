import { useEffect, useRef } from 'react'
import { cn } from '#/lib/utils'

/**
 * Oversized outlined type sitting behind something else, with a band of brand
 * light sweeping along the stroke - the same treatment the giant CONTACT wears
 * behind the contact form, reused here so the two pages speak with one voice.
 *
 * The band follows the pointer once there is one, and runs its own slow loop
 * until then (and on touch, where there is no hover position to track).
 */
export function GhostWord({
  children,
  className,
  align = 'left',
}: {
  children: string
  className?: string
  align?: 'left' | 'center' | 'right'
}) {
  const root = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let frame = 0
    let x = 0

    const write = () => {
      frame = 0
      el.style.setProperty('--sweep', x.toFixed(4))
    }

    const onMove = (e: PointerEvent) => {
      x = Math.min(Math.max(e.clientX / window.innerWidth, 0), 1)
      if (!el.classList.contains('is-tracking')) el.classList.add('is-tracking')
      if (frame) return
      frame = window.requestAnimationFrame(write)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <p
      ref={root}
      aria-hidden="true"
      className={cn(
        'ghost-word pointer-events-none select-none font-display font-extrabold',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className,
      )}
    >
      <span className="ghost-word__base">{children}</span>
      <span className="ghost-word__glow">{children}</span>
    </p>
  )
}

export default GhostWord
