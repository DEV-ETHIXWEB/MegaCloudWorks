/**
 * The four "How we work" marks: Understand, Design, Build, Ship & Evolve.
 *
 * These replace the flat black line drawings that shipped first. Same four
 * ideas — a magnifier over the data, an artboard being drawn on, blocks going
 * up, a launch — redrawn on a shared isometric grid so they read as one set:
 * every solid has a lit top face, a mid-tone left face and a dark right face,
 * lit from the same corner, with the brand red carrying the "live" part of
 * each scene.
 *
 * They are inline SVG rather than <img> because the step cascade lights them
 * one at a time (see .step-icon in styles.css) — a glow has to reach the
 * geometry, and an <img> is opaque to CSS.
 */

type Props = { step: 1 | 2 | 3 | 4; className?: string }

// one shared light: top faces bright, left faces mid, right faces dark
const FACE = {
  top: '#3a3a46',
  left: '#23232c',
  right: '#15151b',
} as const

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
          <stop offset="0%" stopColor="#4a4a58" />
          <stop offset="100%" stopColor={FACE.top} />
        </linearGradient>
        <linearGradient id={`${id}-brand`} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="var(--icon-accent)" />
          <stop offset="55%" stopColor="var(--icon-accent)" />
          <stop offset="100%" stopColor="var(--icon-accent-mid)" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.35" />
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

      <g className="step-icon__art">
        {step === 1 && <Understand id={id} />}
        {step === 2 && <Design id={id} />}
        {step === 3 && <Build id={id} />}
        {step === 4 && <Ship id={id} />}
      </g>
    </svg>
  )
}

/* -------------------------------------------------------------------- *
 * 01 — Understand: a magnifier held over a stack of data slabs
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

      {/* three rows of readings across the top plate */}
      <g className="step-icon__rows" stroke="var(--icon-accent)" strokeLinecap="round">
        <path d="M36 62 L52 70" strokeWidth="2.4" opacity="0.9" />
        <path d="M44 58 L58 65" strokeWidth="2.4" opacity="0.55" />
        <path d="M52 54 L62 59" strokeWidth="2.4" opacity="0.3" />
      </g>

      {/* the glass */}
      <g className="step-icon__lens">
        <circle
          cx="50"
          cy="34"
          r="17"
          fill={`url(#${id}-glass)`}
          stroke={`url(#${id}-brand)`}
          strokeWidth="6"
        />
        <path
          d="M40 28 A 13 13 0 0 1 52 22"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M62.5 46.5 L71 55"
          stroke={FACE.left}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M63.5 45.5 L70 52"
          stroke={FACE.top}
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
    </>
  )
}

/* -------------------------------------------------------------------- *
 * 02 — Design: an artboard on the grid with a curve being drawn onto it
 * -------------------------------------------------------------------- */
function Design({ id }: { id: string }) {
  return (
    <>
      {/* artboard */}
      <path d="M48 46 L80 62 L48 78 L16 62 Z" fill={`url(#${id}-top)`} />
      <path d="M16 62 L48 78 L48 84 L16 68 Z" fill={FACE.left} />
      <path d="M80 62 L48 78 L48 84 L80 68 Z" fill={FACE.right} />

      {/* the layout being set out on it */}
      <g opacity="0.9">
        <path d="M40 54 L56 62 L40 70 L24 62 Z" fill="#ffffff" opacity="0.12" />
        <path
          d="M32 62 L48 54"
          stroke="#fff"
          strokeWidth="1.4"
          opacity="0.28"
        />
        <path
          d="M48 70 L64 62"
          stroke="#fff"
          strokeWidth="1.4"
          opacity="0.28"
        />
      </g>

      {/* the stroke being laid down: the curve draws itself while the stylus
          rides along it (the pen's keyframes are this same bezier, sampled at
          quarters — see .step-icon__pen in styles.css) */}
      <path
        className="step-icon__curve"
        d="M26 40 C 34 20, 60 40, 70 20"
        fill="none"
        stroke={`url(#${id}-brand)`}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle
        cx="26"
        cy="40"
        r="4"
        fill="#fff"
        stroke="var(--icon-accent)"
        strokeWidth="2.4"
      />
      <circle className="step-icon__endpoint" cx="70" cy="20" r="4" fill="var(--icon-accent)" />

      {/* stylus, tip at (57,52) — every offset in the write keyframes is
          measured from there */}
      <g className="step-icon__pen">
        <path d="M60 44 L74 30 L79 35 L65 49 Z" fill={FACE.top} />
        <path d="M60 44 L65 49 L57 52 Z" fill={`url(#${id}-brand)`} />
        <path
          d="M74 30 L79 35"
          stroke="#5a5a68"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </>
  )
}

/* -------------------------------------------------------------------- *
 * 03 — Build: blocks going up, the top one still coming in
 * -------------------------------------------------------------------- */
function Build({ id }: { id: string }) {
  const cube = (x: number, y: number, w: number, h: number, d: number) => ({
    top: `M ${x} ${y} L ${x + w} ${y + h} L ${x} ${y + 2 * h} L ${x - w} ${y + h} Z`,
    left: `M ${x - w} ${y + h} L ${x} ${y + 2 * h} L ${x} ${y + 2 * h + d} L ${x - w} ${y + h + d} Z`,
    right: `M ${x + w} ${y + h} L ${x} ${y + 2 * h} L ${x} ${y + 2 * h + d} L ${x + w} ${y + h + d} Z`,
  })

  // the slab, then two courses sitting on its surface, then the red block
  // still coming down — each cube's bottom vertex is placed on the face
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

      {/* the block still on its way down — the only red solid in the set */}
      <g className="step-icon__drop">
        <path d={cap.top} fill={`url(#${id}-brand)`} />
        <path d={cap.left} fill="var(--icon-accent-mid)" />
        <path d={cap.right} fill="var(--icon-accent-deep)" />
      </g>

    </>
  )
}

/* -------------------------------------------------------------------- *
 * 04 — Ship & Evolve: a launch off the pad, trail still burning
 * -------------------------------------------------------------------- */
function Ship({ id }: { id: string }) {
  return (
    <>
      {/* pad */}
      <path d="M48 64 L74 76 L48 88 L22 76 Z" fill={`url(#${id}-top)`} />
      <path d="M22 76 L48 88 L48 92 L22 80 Z" fill={FACE.left} />
      <path d="M74 76 L48 88 L48 92 L74 80 Z" fill={FACE.right} />

      {/* exhaust rolling out across the pad on lift-off */}
      <g className="step-icon__smoke">
        <circle cx="38" cy="70" r="7" fill="#3a3a46" opacity="0.5" />
        <circle cx="58" cy="70" r="6" fill="#3a3a46" opacity="0.4" />
        <circle cx="48" cy="74" r="8" fill="#4a4a58" opacity="0.35" />
      </g>

      <g className="step-icon__craft">
        {/* fins */}
        <path d="M42 44 L34 52 L42 52 Z" fill="var(--icon-accent-mid)" />
        <path d="M56 44 L64 52 L56 52 Z" fill="var(--icon-accent-mid)" />

        {/* body: lit left face, dark right face, so it sits on the same grid */}
        <path
          d="M49 8 C 58 18, 58 38, 56 52 L49 56 Z"
          fill={FACE.right}
        />
        <path
          d="M49 8 C 40 18, 40 38, 42 52 L49 56 Z"
          fill={`url(#${id}-top)`}
        />

        {/* nose and window */}
        <path d="M49 8 C 54 14, 56 20, 56 24 L42 24 C 42 20, 44 14, 49 8 Z" fill={`url(#${id}-brand)`} />
        <circle cx="49" cy="34" r="5" fill={`url(#${id}-glass)`} />

        {/* burn */}
        <path
          className="step-icon__flame"
          d="M49 56 C 53 60, 54 66, 49 72 C 44 66, 45 60, 49 56 Z"
          fill={`url(#${id}-brand)`}
        />
      </g>
    </>
  )
}

export default StepIcon
