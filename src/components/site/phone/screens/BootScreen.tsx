import { ArrowRight } from 'lucide-react'
import { ScreenShell, StatusBar } from './ScreenShell'

const TILES = [
  { label: 'Design', hash: 'app-design' },
  { label: 'Build', hash: 'app-development' },
  { label: 'Ship', hash: 'brand-ui' },
] as const

/**
 * Act one. The display is dark when the page arrives, then powers on: a glow
 * blooms out of the centre, the mark draws in, and the home UI settles behind
 * a greeting. Every step is a CSS animation on mount, so the boot plays itself
 * without the story timeline having to drive it.
 *
 * The tiles are real links — the screen is a working surface, not a picture of
 * one, so anything that looks pressable is.
 */
export function BootScreen({ onOpen }: { onOpen?: (hash: string) => void }) {
  return (
    <ScreenShell className="boot">
      {/* the display is off when the page arrives, then powers on: the black
          splits from a hot line and opens to reveal the UI underneath */}
      <span aria-hidden="true" className="boot__off" />
      <span aria-hidden="true" className="boot__flash" />

      <div className="boot__body">
        <StatusBar />

        <div className="boot__mark">
          <img src="/logo-mark.svg" alt="" width={46} height={46} />
        </div>

        <div className="boot__greeting">
          <p className="boot__hello">Hello, there.</p>
          <h2 className="boot__title">
            Welcome to
            <br />
            <span>MegaCloudWorks</span>
          </h2>
          <p className="boot__sub">
            An app design &amp; development studio. This is the part where we
            show you, instead of telling you.
          </p>
        </div>

        <div className="boot__tiles">
          {TILES.map((tile, i) => (
            <button
              key={tile.label}
              type="button"
              className="boot__tile"
              style={{ '--i': i } as React.CSSProperties}
              onClick={() => onOpen?.(tile.hash)}
            >
              {tile.label}
              <ArrowRight size={12} strokeWidth={2.6} />
            </button>
          ))}
        </div>

        <div className="boot__hint">
          <span className="boot__mouse">
            <i />
          </span>
          Scroll to begin
        </div>
      </div>
    </ScreenShell>
  )
}

export default BootScreen
