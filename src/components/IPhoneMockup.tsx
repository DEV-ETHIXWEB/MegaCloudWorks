import type { ReactNode } from 'react'

type Size = 'sm' | 'md' | 'lg'

// max-width caps per size; the frame always shrinks to fill its own grid
// cell first (width: 100%, up to the cap) so two phones side by side never
// force horizontal overflow on a narrow phone screen.
const MAX_WIDTH: Record<Size, number> = { sm: 200, md: 250, lg: 300 }
const ASPECT = 2.06

export function IPhoneMockup({
  children,
  size = 'md',
  className = '',
  label,
}: {
  children: ReactNode
  size?: Size
  className?: string
  /** accessible name for the screen content, e.g. "Fieldly · Dispatch Board" */
  label?: string
}) {
  const maxWidth = MAX_WIDTH[size]

  return (
    <div
      className={`iphone-frame w-full ${className}`}
      style={{ maxWidth, aspectRatio: `1 / ${ASPECT}` }}
      role={label ? 'group' : undefined}
      aria-label={label}
    >
      <div className="iphone-frame__island" aria-hidden="true" />
      {/* the glass is always its own paper: reset ink/paper tokens here so
          screens still read correctly when the phone sits on an .on-brand
          (white-on-red) section instead of the normal light page */}
      <div className="iphone-frame__screen reset-surface h-full w-full">{children}</div>
    </div>
  )
}
