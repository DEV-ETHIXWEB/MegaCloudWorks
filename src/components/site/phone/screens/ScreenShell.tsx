import type { ReactNode } from 'react'
import { SCREEN_PX } from '../story'

/**
 * The fixed-size canvas every phone screen is authored on. Screens are written
 * as ordinary 340×736 mobile UI here and scaled into world units by the stage,
 * so nothing inside has to think about three.js.
 */
export function ScreenShell({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`phone-screen ${className}`.trim()}
      style={{ width: SCREEN_PX.w, height: SCREEN_PX.h }}
    >
      {children}
    </div>
  )
}

/** The status bar every screen carries, so the display reads as a real device. */
export function StatusBar() {
  return (
    <div className="phone-status">
      <span className="phone-status__time">9:41</span>
      <span className="phone-status__icons">
        <span className="phone-status__bars">
          <i style={{ height: 4 }} />
          <i style={{ height: 6 }} />
          <i style={{ height: 8 }} />
          <i style={{ height: 10 }} />
        </span>
        <span className="phone-status__battery" />
      </span>
    </div>
  )
}

export default ScreenShell
