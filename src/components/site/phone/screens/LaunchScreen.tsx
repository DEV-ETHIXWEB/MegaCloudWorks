import { ScreenShell } from './ScreenShell'

export const LAUNCH_MEDIA = '/sky/contact.webp'

/**
 * The last act, on the device. The display drops its UI and goes full-bleed on
 * the same artwork the expanding panel uses, so when the DOM panel takes over
 * from the 3D screen there is nothing to see change - only the frame growing.
 *
 * The mark sits lit in the middle of the glass and burns off as the story turns
 * toward the brief: `--mark` is written straight onto the screen host by the
 * frame loop, so the fade rides the scroll without re-rendering anything.
 */
export function LaunchScreen() {
  return (
    <ScreenShell className="launch">
      <img
        src={LAUNCH_MEDIA}
        alt=""
        className="launch__media"
        draggable={false}
        fetchPriority="low"
        decoding="async"
      />

      <div className="launch__mark">
        <span aria-hidden="true" className="launch__halo" />
        <img src="/logo-mark.svg" alt="MegaCloudWorks" />
      </div>

      <div className="launch__label">
        <span className="launch__kicker">Ready when you are</span>
        <span className="launch__line" />
      </div>
    </ScreenShell>
  )
}

export default LaunchScreen
