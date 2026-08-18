/**
 * Geometry and timing for the case-study device.
 *
 * The home page's story flies one phone through five acts and needs its own
 * numbers for that. A case study needs the opposite: one phone, standing in
 * one place, alive enough that you believe it is switched on. So the stage
 * measurements are shared with `story.ts` - same model, same display plane -
 * and everything about *behaviour* lives here.
 */

import { FRONT_Z, SCREEN } from './story'

/**
 * CSS pixel size of the DOM screen.
 *
 * The iOS kit is proportioned for a ~300px display (its type scale is Apple's
 * scaled by 0.78), and the story's 340px screen quietly runs the whole kit
 * 13% small - which is most of why the screens read empty. Authoring at 300
 * puts the kit back at the size it was drawn for.
 *
 * The height is not chosen: it is 300 divided by the display's real aspect, so
 * the DOM rectangle covers the glass exactly with no letterbox.
 */
export const DEVICE_PX = {
  w: 300,
  h: Math.round(300 / (SCREEN.width / SCREEN.height)),
} as const

/** drei's <Html transform> maps one CSS pixel to 10/400 world units. */
const HTML_PX_TO_UNITS = 10 / 400

/** Scale that makes the DOM screen cover the display exactly. */
export const DEVICE_SCREEN_SCALE = SCREEN.width / (DEVICE_PX.w * HTML_PX_TO_UNITS)

/**
 * Where the DOM screen sits.
 *
 * PhoneModel spins its whole subtree a half turn so the display faces the
 * camera, which puts the glass at *positive* z. Anything parented outside that
 * group - as the screen is, so a re-render of the app does not touch the
 * loaded shell - has to use the mirrored value, or it ends up behind the body
 * facing into the scene.
 */
export const DEVICE_SCREEN_Z = -(FRONT_Z - 0.002) + 0.004

/** Vertical centre of the display, in the same mirrored space. */
export const DEVICE_SCREEN_Y = SCREEN.centerY

/**
 * Camera. Closer than the story's, because here the device is the subject of a
 * hero rather than one element travelling through a scene - but not so close
 * that a full pointer tilt swings a corner out of frame.
 */
export const DEVICE_CAMERA = { fov: 30, z: 3.12 } as const

/** How far the pointer can push the device, in radians. */
export const TILT = { y: 0.34, x: 0.2 } as const

/** How far scroll turns it, over the height of the hero. */
export const SCROLL_TURN = 0.42

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Frame-rate independent exponential approach. */
export const damp = (
  current: number,
  target: number,
  lambda: number,
  dt: number,
) => current + (target - current) * (1 - Math.exp(-lambda * dt))
