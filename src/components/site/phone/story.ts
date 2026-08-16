/**
 * Shared geometry + timing for the interactive phone story.
 *
 * The supplied model (raw-assets/Phone by Alex Safayan) is a low-poly OBJ with
 * no display mesh and no usable material names beyond `usemtl` ids, so the
 * screen is generated here instead of read off the model. Every number below is
 * measured from the model's own front plane, which after recentering sits at
 * z = -0.06 spanning exactly x ±0.35 and y ±0.73.
 */

/** Offset that moves the model's body centre onto the origin. */
export const MODEL_OFFSET = [0.005, -0.074, 0.011] as const

/** Front face of the phone body, in recentred model space. */
export const FRONT_Z = -0.06

/**
 * The generated display.
 *
 * The body's front face spans exactly x ±0.35 and y ±0.73, and the model's
 * earpiece slot starts at y 0.666 — which is the one hard limit here, since the
 * display cannot run under it. Everywhere else the bezel is cut to 0.025, so
 * the glass reaches nearly to the edge of the shell.
 */
export const SCREEN = {
  width: 0.65,
  height: 1.36,
  /** the top is fixed by the earpiece, so the extra height comes off the chin */
  centerY: -0.025,
  radius: 0.062,
  /** floated in front of the body so it never z-fights */
  z: FRONT_Z - 0.002,
} as const

export const SCREEN_ASPECT = SCREEN.width / SCREEN.height

/**
 * CSS pixel size of the DOM screen. Content is authored at this size and then
 * scaled into world units, so screens can be written as ordinary mobile UI.
 */
export const SCREEN_PX = { w: 340, h: 712 } as const

/**
 * drei's <Html transform> maps one CSS pixel to (distanceFactor || 10) / 400
 * world units before the group's own scale is applied, so the scale that makes
 * the DOM screen cover the display exactly has to divide that out.
 */
const HTML_PX_TO_UNITS = 10 / 400
export const SCREEN_SCALE = SCREEN.width / (SCREEN_PX.w * HTML_PX_TO_UNITS)

/**
 * Camera. Close enough that the phone is a presence rather than a prop — the
 * body covers about two thirds of the viewport height at rest — while still
 * leaving the last act somewhere to fly to.
 */
export const CAMERA = { fov: 30, z: 4.4 } as const

/** How much of the viewport height the display fills once the phone lands. */
export const ZOOM_SCREEN_VH = 0.78

const TAN_HALF_FOV = Math.tan((CAMERA.fov * Math.PI) / 180 / 2)

/** Visible world height at a given distance from the camera. */
export const visibleHeightAt = (distance: number) => 2 * distance * TAN_HALF_FOV

/** World z the phone must reach for its screen to cover ZOOM_SCREEN_VH. */
export const ZOOM_Z =
  CAMERA.z - SCREEN.height / ZOOM_SCREEN_VH / (2 * TAN_HALF_FOV)

/** Visible world height once zoomed — used to size the DOM hand-off panel. */
export const ZOOM_VISIBLE_H = SCREEN.height / ZOOM_SCREEN_VH

/* ------------------------------------------------------------------ *
 * Act boundaries along the master scroll progress (0 → 1)
 * ------------------------------------------------------------------ */
export const ACT = {
  /** boot + welcome, phone held right of centre */
  welcome: [0.0, 0.14],
  /** the rail: what we do best, read off a line loading across the top */
  signal: [0.14, 0.3],
  /** phone travels left and grows into the process */
  travel: [0.3, 0.4],
  process: [0.4, 0.62],
  /**
   * The last act is given nearly a third of the story to itself. Turning a
   * phone screen into a full page is the biggest move here, and at the pace the
   * earlier acts run at it went past before it registered — so the fly-in, the
   * hand-off and the opening each get real distance rather than sharing a
   * sliver at the end.
   */
  zoom: [0.62, 0.82],
  /**
   * The hand-off. The phone has stopped moving, so the DOM panel can take its
   * place on exactly the rectangle the display is projected at — one fades out
   * as the other fades in, and only then does the frame start to open.
   */
  handoff: [0.82, 0.9],
  /**
   * The screen becomes the page. This deliberately finishes short of 1 so the
   * last stretch of the pin is a hold: the panel sits open and clickable for a
   * real amount of scroll instead of flashing past at the very end.
   */
  expand: [0.9, 0.97],
} as const

/**
 * Where the story rests — one stop per gesture.
 *
 * Each is the middle of an act, or through the process the middle of a step, so
 * whatever a scroll lands on is a complete picture and never a transition
 * caught halfway. useSectionScroll walks this list.
 */
const PROCESS_BAND = (ACT.process[1] - ACT.travel[1]) / 4

export const SNAP_POINTS = [
  0,
  (ACT.signal[0] + ACT.signal[1]) / 2,
  ACT.travel[1] + PROCESS_BAND * 0.5,
  ACT.travel[1] + PROCESS_BAND * 1.5,
  ACT.travel[1] + PROCESS_BAND * 2.5,
  ACT.travel[1] + PROCESS_BAND * 3.5,
  ACT.zoom[1] - 0.02,
  0.995,
] as const

/** Index into SNAP_POINTS of the first process step. */
export const FIRST_STEP_STOP = 2

/* ------------------------------------------------------------------ *
 * Easing helpers (kept dependency-free so the r3f frame loop stays cheap)
 * ------------------------------------------------------------------ */
export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v)

/** Normalised position of `x` inside [a, b], clamped. */
export const range = (x: number, a: number, b: number) =>
  clamp((x - a) / (b - a || 1e-6))

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = range(x, edge0, edge1)
  return t * t * (3 - 2 * t)
}

/** Slightly weightier than smoothstep — used for the big positional moves. */
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export const mix = (a: number, b: number, t: number) => a + (b - a) * t

/** Frame-rate independent exponential approach. */
export const damp = (
  current: number,
  target: number,
  lambda: number,
  dt: number,
) => mix(current, target, 1 - Math.exp(-lambda * dt))

/* ------------------------------------------------------------------ *
 * The pose the phone holds at a given master progress
 * ------------------------------------------------------------------ */
export type PhonePose = {
  x: number
  y: number
  z: number
  rotX: number
  rotY: number
  rotZ: number
  /** 0 → screen dark, 1 → screen at full backlight */
  backlight: number
  /** 0 → invisible, 1 → solid; the phone dissolves as the panel takes over */
  presence: number
  scale: number
}

/** A quarter turn counter-clockwise — act two lays the phone on its side. */
export const LANDSCAPE = Math.PI / 2

export function poseAt(p: number, narrow: boolean): PhonePose {
  // the phone turns on its side and comes to the middle for act two, swings
  // back upright and left for the process, then centres and flies in
  const toRail = easeInOut(range(p, ACT.signal[0], ACT.signal[0] + 0.1))
  const toLeft = easeInOut(range(p, ACT.travel[0], ACT.travel[1]))
  const toCentre = easeInOut(range(p, ACT.zoom[0], ACT.zoom[1]))

  const restRight = narrow ? 0 : 0.52
  const restLeft = narrow ? 0 : -0.62

  // act two is the phone's act: it takes the middle of the stage, on its side
  const x = mix(mix(mix(restRight, 0, toRail), restLeft, toLeft), 0, toCentre)
  const rotY = mix(mix(mix(-0.3, 0, toRail), 0.2, toLeft), 0, toCentre)
  // the quarter turn is a wide-screen move only: laid on its side inside a
  // portrait viewport the display would be 712px of content across 375px of
  // glass, which is a picture of text rather than text
  const rotZ = mix(
    mix(mix(0.05, narrow ? 0.02 : LANDSCAPE, toRail), -0.05, toLeft),
    0,
    toCentre,
  )
  const rotX = mix(mix(0.05, 0, toRail), 0, toCentre)

  // the fly-in: only the last act moves the phone along z
  const z = mix(0, ZOOM_Z, toCentre)

  // wide layouts get a shallow rise, so the travel reads as an arc rather than
  // a slide; narrow ones have no room sideways, so the phone trades places with
  // the copy vertically instead — low under the welcome, high above the process
  const y = mix(
    narrow
      ? mix(mix(-0.44, -0.22, toRail), 0.5, toLeft)
      : // held a touch low in the welcome so the bigger phone clears the
        // fixed header rather than tucking under it
        mix(
          mix(-0.06, -0.24, toRail),
          -0.05 + Math.sin(toLeft * Math.PI) * 0.07,
          toLeft,
        ),
    0,
    toCentre,
  )

  // Act two is read off the display itself, so the phone is held much larger
  // there — on its side it is 1.36 wide, and at this scale that covers half the
  // stage. The process act is the next largest; everything eases back to 1 for
  // the hand-off.
  const rail = narrow ? 0.84 : 1.42
  const presentation = mix(
    mix(narrow ? 0.9 : 1.28, rail, toRail),
    narrow ? 0.9 : 1.26,
    toLeft,
  )

  return {
    x,
    y,
    z,
    rotX,
    rotY,
    rotZ,
    backlight: smoothstep(0, 0.05, p),
    presence: 1 - smoothstep(ACT.handoff[0], ACT.handoff[1], p),
    // must reach exactly 1 by the end of the fly-in: the DOM panel takes over
    // on the rectangle the display is projected at, and that assumes no scale
    scale: mix(presentation, 1, toCentre),
  }
}

/**
 * How lit the mark on the last screen is.
 *
 * It holds at full through the fly-in and then burns off as the story turns
 * toward the brief, finishing a beat before the phone itself dissolves — so the
 * glass is already empty by the time the panel takes its place, rather than the
 * mark and the device going at once.
 */
export const markAt = (p: number) =>
  1 - smoothstep(ACT.zoom[1] - 0.05, ACT.handoff[0] + 0.03, p)

/** Which screen the display is showing at a given progress. */
export type Stage = 'boot' | 'signal' | 'process' | 'launch'

export function stageAt(p: number): Stage {
  if (p < ACT.signal[0]) return 'boot'
  if (p < ACT.travel[0] + 0.03) return 'signal'
  if (p < ACT.zoom[0] + 0.02) return 'process'
  return 'launch'
}
