/**
 * Shared geometry + timing for the interactive phone story.
 *
 * The device is raw-assets/megacloudworks_phone_3d_model.glb — a purpose-built
 * shell whose parts and materials are named (Phone_Body, Front_Glass, Screen,
 * Top_Notch …), authored in millimetres, centred on its own origin and facing
 * +Z. Everything below is read off that model rather than eyeballed: the body
 * spans x ±35.5 and y ±74, and the display sits at x ±31.9, y ±70.4, z 4.60
 * with a 5.6 corner.
 */

/**
 * The shell the story loads. It lives here rather than beside the loader so the
 * route bundle can start fetching it without importing anything from three.
 */
export const PHONE_MODEL_URL = '/models/phone/phone.glb'

/**
 * Millimetres to world units.
 *
 * Chosen so the body lands on exactly the footprint the story was staged
 * around — 0.70 wide, 1.46 tall — which is why every pose, camera distance and
 * hand-off rectangle in this file carries over from the model it replaces.
 */
export const MODEL_SCALE = 0.7 / 71

/** The display, in world units, straight off the model's Screen mesh. */
export const SCREEN = {
  width: 63.8 * MODEL_SCALE,
  height: 140.8 * MODEL_SCALE,
  /** the glass is centred on the body's own axis */
  centerY: 0,
  radius: 5.6 * MODEL_SCALE,
  /** the front face of the glass; the DOM screen floats a hair in front */
  z: 4.6 * MODEL_SCALE,
} as const

export const SCREEN_ASPECT = SCREEN.width / SCREEN.height

/**
 * CSS pixel size of the DOM screen. Content is authored at this size and then
 * scaled into world units, so screens can be written as ordinary mobile UI.
 * The height is the width carried through the glass's own aspect, so the
 * markup covers the display exactly with nothing letterboxed at the ends.
 */
export const SCREEN_PX = { w: 340, h: 750 } as const

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
  /**
   * The process act. On a wide stage the phone goes hard left and the argument
   * stands beside it. Narrow, it only steps off centre: far enough that the
   * device and the card below it read as two things laid on the stage rather
   * than one stack, and not so far that the display leaves the viewport.
   */
  const restLeft = narrow ? -0.07 : -0.62

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
      ? // the process pose used to run the phone off the top of the stage,
        // straight through the floating mark. It now hangs from just under
        // that line and stops clear of the card
        mix(mix(-0.45, -0.24, toRail), 0.38, toLeft)
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
  /**
   * Act two is read off the display, so the device is held at its largest here.
   * Narrow, it stays upright and takes the whole band between the rail title
   * and the foot of the stage — at 0.84 it was a small object in a lot of empty
   * paper, and the screen it is being read off was the thing paying for it. The
   * ceiling is the short viewport: 1.08 still clears the title on a 667.
   */
  const rail = narrow ? 1.08 : 1.42
  // narrow: the display is only ~230px across here, and everything written on
  // it is authored at 340. Every point of scale is a point of legibility, so
  // the device is held as large as fits between the welcome copy and the foot
  // of the viewport — the boot screen's own scroll cue is the last thing on it
  // and has to stay on screen.
  // The process act is the exception: there the card carries the argument and
  // the device is only the illustration of it, so it gives up the height the
  // card needs rather than fighting it for the stage.
  const presentation = mix(
    mix(narrow ? 0.95 : 1.28, rail, toRail),
    narrow ? 0.8 : 1.26,
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
