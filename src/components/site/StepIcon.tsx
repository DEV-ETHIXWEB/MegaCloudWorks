/**
 * The four "How we work" marks: Understand, Design, Build, Ship & Evolve.
 *
 * Same four ideas - a magnifier over the data, an artboard being drawn on,
 * blocks going up, a launch - on a shared isometric grid so they read as one
 * set: every solid has a lit top face, a mid-tone left face and a darker
 * right face, all lit from the same corner.
 *
 * The solids are white and grey, not charcoal. These marks only ever appear
 * on the red band, and a near-black object on a painted sky reads as cut out
 * of a different picture - white-in-the-light and grey-in-the-shade is the
 * same palette the clouds around them are drawn in.
 *
 * That inverts where the accents can go. On a charcoal solid the live part
 * could be white; on a white one it has to be red, and anything floating in
 * open air has to stay white or it disappears into the band behind it. So
 * `-live` is for details sitting ON a solid and `AIR` for anything with red
 * behind it. Both are fixed values rather than tokens: `.on-brand` rewrites
 * `--brand` to white, which is the opposite of what a mark on red needs.
 *
 * They are inline SVG rather than <img> because the step cascade lights them
 * one at a time (see .step-icon in styles.css) - a glow has to reach the
 * geometry, and an <img> is opaque to CSS.
 */

type Props = { step: 1 | 2 | 3 | 4; className?: string }

// one shared light: top faces white, left faces mid grey, right faces darker
const FACE = {
  top: '#ffffff',
  left: '#dcdee6',
  right: '#b4b7c4',
} as const

/** details drawn on a light face, which have to be darker than it */
const INK = '#787c8b'
const INK_SOFT = '#b6b9c4'

/** the live part of a scene when it sits on a solid */
const RED = '#f5333b'
const RED_DEEP = '#c81f27'

/** anything floating with the red band behind it stays white */
const AIR = '#ffffff'

export function StepIcon({ step, className = '' }: Props) {
  const id = `step-icon-${step}`

  return (
    <svg
      viewBox="0 0 96 96"
      className={`step-icon ${className}`}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#edeff4" />
        </linearGradient>
        {/* the live part, for details that sit on a solid */}
        <linearGradient id={`${id}-live`} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={RED} />
          <stop offset="55%" stopColor={RED} />
          <stop offset="100%" stopColor={RED_DEEP} />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#e6e8ef" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id={`${id}-pool`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--icon-accent)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--icon-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* the red pool under each solid is what the glow animation swells */}
      <ellipse
        className="step-icon__pool"
        cx="48"
        cy="76"
        rx="30"
        ry="10"
        fill={`url(#${id}-pool)`}
      />

      {/* the weather the mark stands in - see <Sky> */}
      <Sky layer="back" />

      <g className="step-icon__art">
        {step === 1 && <Understand id={id} />}
        {step === 2 && <Design id={id} />}
        {step === 3 && <Build id={id} />}
        {step === 4 && <Ship id={id} />}
      </g>

      <Sky layer="front" />
    </svg>
  )
}

/**
 * The cloud the mark stands in.
 *
 * The band these marks sit on is a painted sky, and a charcoal solid dropped
 * straight onto it reads as pasted on rather than as part of the scene. Two
 * banks fix that: one behind, so cloud shows between the mark and the horizon,
 * and one in front, so the mark's base disappears into it the way the ridge
 * does on the About hero. Every shape is white at a low alpha, which over the
 * band's red comes out as the same lighter red the sky plates are painted in -
 * so this is one palette, not a second one.
 *
 * Each bank is a single group with one opacity, so the circles that build a
 * cloud never show their overlaps.
 */
function Sky({ layer }: { layer: 'back' | 'front' }) {
  if (layer === 'back') {
    return (
      <g className="step-icon__sky step-icon__sky--back" fill="#fff">
        <g
          className="step-icon__cloud"
          style={cloud({
            o: 0.34,
            from: -14,
            x: 2.2,
            y: 1,
            period: 23,
            delay: 120,
          })}
        >
          <circle cx="26" cy="84" r="11" />
          <circle cx="42" cy="79" r="14" />
          <circle cx="58" cy="82" r="12" />
          <circle cx="72" cy="86" r="9" />
          <rect x="14" y="85" width="68" height="14" rx="7" />
        </g>
      </g>
    )
  }

  return (
    <g className="step-icon__sky step-icon__sky--front" fill="#fff">
      <g
        className="step-icon__cloud"
        style={cloud({
          o: 0.6,
          from: -20,
          x: 2.8,
          y: 1.2,
          period: 27,
          delay: 260,
        })}
      >
        <circle cx="20" cy="91" r="8" />
        <circle cx="32" cy="88" r="9.5" />
        <rect x="9" y="90" width="36" height="11" rx="5.5" />
      </g>
      <g
        className="step-icon__cloud"
        style={cloud({
          o: 0.52,
          from: 22,
          x: -2.4,
          y: 0.9,
          period: 33,
          delay: 340,
        })}
      >
        <circle cx="68" cy="92" r="7" />
        <circle cx="79" cy="89" r="8.5" />
        <rect x="59" y="91" width="33" height="10" rx="5" />
      </g>
    </g>
  )
}

/** the per-cloud knobs the CSS reads: settled opacity, where it drifts in
 *  from, how far it wanders on each axis, how long a round trip takes, and
 *  its place in the stagger */
function cloud({
  o,
  from,
  x,
  y,
  period,
  delay,
}: {
  o: number
  from: number
  x: number
  y: number
  period: number
  delay: number
}) {
  return {
    '--cloud-o': o,
    '--cloud-from': `${from}px`,
    '--cloud-x': `${x}px`,
    '--cloud-y': `${y}px`,
    '--cloud-p': `${period}s`,
    '--cloud-d': `${delay}ms`,
  } as React.CSSProperties
}

/* -------------------------------------------------------------------- *
 * 01 - Understand: a magnifier held over a stack of data slabs
 * -------------------------------------------------------------------- */
function Understand({ id }: { id: string }) {
  return (
    <>
      {/* the slab being read, two plates deep */}
      <path d="M48 62 L74 74 L48 86 L22 74 Z" fill={FACE.right} />
      <path d="M22 74 L48 86 L48 90 L22 78 Z" fill={FACE.right} />
      <path d="M74 74 L48 86 L48 90 L74 78 Z" fill={FACE.left} />

      <path d="M48 54 L74 66 L48 78 L22 66 Z" fill={`url(#${id}-top)`} />
      <path d="M22 66 L48 78 L48 82 L22 70 Z" fill={FACE.left} />
      <path d="M74 66 L48 78 L48 82 L74 70 Z" fill={FACE.right} />

      {/* Three rows of readings across the top plate. The plate is the diamond
          (48,54) (74,66) (48,78) (22,66) - in the isometric axes A=(26,12) and
          B=(-26,12) about its centre (48,66) it is the square |s| ≤ 0.5 and
          |u| ≤ 0.5, so a point centre + sA + uB is on the surface only while
          both hold. The rows run along A and step along B; every end below
          sits well inside, with room left over for the round cap. The third
          row used to be plotted at u = -0.58 - off the far edge - and hung in
          mid-air beside the slab. */}
      <g className="step-icon__rows" stroke={RED} strokeLinecap="round">
        <path d="M37.9 64.9 L50.3 70.7" strokeWidth="2.4" opacity="0.95" />
        <path d="M42.3 63.4 L53.7 68.6" strokeWidth="2.4" opacity="0.6" />
        <path d="M47.7 62.3 L56.1 66.1" strokeWidth="2.4" opacity="0.32" />
      </g>

      {/* the glass - the ring is in open air, so it stays white */}
      <g className="step-icon__lens">
        <circle
          cx="50"
          cy="34"
          r="17"
          fill={`url(#${id}-glass)`}
          stroke={AIR}
          strokeWidth="6"
        />
        <path
          d="M40 28 A 13 13 0 0 1 52 22"
          fill="none"
          stroke={INK_SOFT}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M62.5 46.5 L71 55"
          stroke={FACE.right}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M63.5 45.5 L70 52"
          stroke={FACE.top}
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.8"
        />
      </g>
    </>
  )
}

/* -------------------------------------------------------------------- *
 * 02 - Design: an artboard on the grid with a curve being drawn onto it
 * -------------------------------------------------------------------- */
function Design({ id }: { id: string }) {
  return (
    <>
      {/* artboard */}
      <path d="M48 46 L80 62 L48 78 L16 62 Z" fill={`url(#${id}-top)`} />
      <path d="M16 62 L48 78 L48 84 L16 68 Z" fill={FACE.left} />
      <path d="M80 62 L48 78 L48 84 L80 68 Z" fill={FACE.right} />

      {/* the layout being set out on it - darker than the board it is on */}
      <g opacity="0.9">
        <path d="M40 54 L56 62 L40 70 L24 62 Z" fill={INK_SOFT} opacity="0.5" />
        <path d="M32 62 L48 54" stroke={INK_SOFT} strokeWidth="1.4" />
        <path d="M48 70 L64 62" stroke={INK_SOFT} strokeWidth="1.4" />
      </g>

      {/* the stroke being laid down: the curve draws itself while the stylus
          rides along it (the pen's keyframes are this same bezier, sampled at
          quarters - see .step-icon__pen in styles.css) */}
      {/* the stroke and its handles are all in open air - white */}
      <path
        className="step-icon__curve"
        d="M26 40 C 34 20, 60 40, 70 20"
        fill="none"
        stroke={AIR}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="26" cy="40" r="4" fill={AIR} stroke={AIR} strokeWidth="2.4" />
      <circle
        className="step-icon__endpoint"
        cx="70"
        cy="20"
        r="4"
        fill={AIR}
      />

      {/* stylus, tip at (57,52) - every offset in the write keyframes is
          measured from there */}
      <g className="step-icon__pen">
        <path d="M60 44 L74 30 L79 35 L65 49 Z" fill={FACE.top} />
        {/* the nib is the live end, and it sits on the pen - so it is red */}
        <path d="M60 44 L65 49 L57 52 Z" fill={`url(#${id}-live)`} />
        <path
          d="M74 30 L79 35"
          stroke={INK}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </>
  )
}

/* -------------------------------------------------------------------- *
 * 03 - Build: blocks going up, the top one still coming in
 * -------------------------------------------------------------------- */
function Build({ id }: { id: string }) {
  const cube = (x: number, y: number, w: number, h: number, d: number) => ({
    top: `M ${x} ${y} L ${x + w} ${y + h} L ${x} ${y + 2 * h} L ${x - w} ${y + h} Z`,
    left: `M ${x - w} ${y + h} L ${x} ${y + 2 * h} L ${x} ${y + 2 * h + d} L ${x - w} ${y + h + d} Z`,
    right: `M ${x + w} ${y + h} L ${x} ${y + 2 * h} L ${x} ${y + 2 * h + d} L ${x + w} ${y + h + d} Z`,
  })

  // the slab, then two courses sitting on its surface, then the red block
  // still coming down - each cube's bottom vertex is placed on the face
  // below it rather than eyeballed, so the stack never floats
  const base = cube(48, 58, 26, 11, 7)
  const left = cube(36, 49, 12, 6, 11)
  const right = cube(60, 49, 12, 6, 11)
  const cap = cube(48, 26, 12, 6, 11)

  return (
    <>
      <path d={base.top} fill={`url(#${id}-top)`} />
      <path d={base.left} fill={FACE.left} />
      <path d={base.right} fill={FACE.right} />

      <path d={left.top} fill={`url(#${id}-top)`} />
      <path d={left.left} fill={FACE.left} />
      <path d={left.right} fill={FACE.right} />

      <path d={right.top} fill={`url(#${id}-top)`} />
      <path d={right.left} fill={FACE.left} />
      <path d={right.right} fill={FACE.right} />

      {/* The block still on its way down - the only red solid in the set. Its
          top face stays white so the cube keeps a silhouette against the band
          it is falling through; the two faces in shade carry the red. */}
      <g className="step-icon__drop">
        <path d={cap.top} fill={FACE.top} />
        <path d={cap.left} fill={RED} />
        <path d={cap.right} fill={RED_DEEP} />
      </g>
    </>
  )
}

/* -------------------------------------------------------------------- *
 * 04 - Ship & Evolve: a launch off the pad, trail still burning
 * -------------------------------------------------------------------- */
function Ship({ id }: { id: string }) {
  return (
    <>
      {/* pad */}
      <path d="M48 64 L74 76 L48 88 L22 76 Z" fill={`url(#${id}-top)`} />
      <path d="M22 76 L48 88 L48 92 L22 80 Z" fill={FACE.left} />
      <path d="M74 76 L48 88 L48 92 L74 80 Z" fill={FACE.right} />

      {/* exhaust rolling out across the pad on lift-off - white, like the
          cloud it is joining rather than a dark smudge on it */}
      <g className="step-icon__smoke">
        <circle cx="38" cy="70" r="7" fill={AIR} opacity="0.72" />
        <circle cx="58" cy="70" r="6" fill={AIR} opacity="0.6" />
        <circle cx="48" cy="74" r="8" fill={AIR} opacity="0.5" />
      </g>

      <g className="step-icon__craft">
        {/* fins sit against the band, so they take the grey of a shaded face */}
        <path d="M42 44 L34 52 L42 52 Z" fill={FACE.right} />
        <path d="M56 44 L64 52 L56 52 Z" fill={FACE.right} />

        {/* body: lit left face, shaded right face, on the same grid */}
        <path d="M49 8 C 58 18, 58 38, 56 52 L49 56 Z" fill={FACE.right} />
        <path
          d="M49 8 C 40 18, 40 38, 42 52 L49 56 Z"
          fill={`url(#${id}-top)`}
        />

        {/* the nose is the live part and it sits on the body, so it is red;
            the window is a cut into a white hull, so it is ink */}
        <path
          d="M49 8 C 54 14, 56 20, 56 24 L42 24 C 42 20, 44 14, 49 8 Z"
          fill={`url(#${id}-live)`}
        />
        <circle cx="49" cy="34" r="5" fill={INK} opacity="0.55" />

        {/* the burn hangs in open air below the craft - white */}
        <path
          className="step-icon__flame"
          d="M49 56 C 53 60, 54 66, 49 72 C 44 66, 45 60, 49 56 Z"
          fill={AIR}
        />
      </g>
    </>
  )
}

export default StepIcon
