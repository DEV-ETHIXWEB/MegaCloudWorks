import { Suspense, useEffect, useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { PhoneModel } from './PhoneModel'
import { StudioEnvironment } from './StudioEnvironment'
import { SCREEN, SCREEN_PX, SCREEN_SCALE, damp, markAt, poseAt } from './story'
import type { Stage } from './story'
import { BootScreen } from './screens/BootScreen'
import { FamilyScreen } from './screens/FamilyScreen'
import { ProcessScreen } from './screens/ProcessScreen'
import { LaunchScreen } from './screens/LaunchScreen'

/** How long one screen takes to dissolve into the next. Matches the CSS. */
const SWAP_MS = 420

export type StoryState = {
  /** master scroll progress, written by the ScrollTrigger on the DOM side */
  progress: number
  /** pointer position in -1..1, for the parallax tilt */
  pointer: { x: number; y: number }
  narrow: boolean
  reduced: boolean
}

/**
 * Everything inside the canvas. The phone's pose is recomputed every frame from
 * the story's progress and eased toward, which keeps the motion smooth even
 * when the scroll itself arrives in coarse jumps.
 */
export type RigProps = {
  state: React.RefObject<StoryState>
  stage: Stage
  activeStep: number
  /** portrait viewport: act two stays upright instead of turning */
  narrow: boolean
  /** the display is a control surface: tapping a step drives the scroll */
  onSelectStep?: (index: number) => void
  onOpenService?: (hash: string) => void
  /** fired once the shell is in the scene, so the DOM can drop its placeholder */
  onReady?: () => void
}

export function PhoneRig({
  state,
  stage,
  activeStep,
  narrow,
  onSelectStep,
  onOpenService,
  onReady,
}: RigProps) {
  const group = useRef<THREE.Group>(null)
  const backlight = useRef<THREE.PointLight>(null)
  const screenHtml = useRef<HTMLDivElement>(null)
  const tilt = useRef({ x: 0, y: 0 })

  /* ---- the screen the act before this one was showing, held while it fades ---- */
  const [leaving, setLeaving] = useState<Stage | null>(null)
  const shown = useRef(stage)

  useEffect(() => {
    if (stage === shown.current) return
    setLeaving(shown.current)
    shown.current = stage
    const id = window.setTimeout(() => setLeaving(null), SWAP_MS)
    return () => window.clearTimeout(id)
  }, [stage])

  const renderScreen = (which: Stage) =>
    which === 'boot' ? (
      <BootScreen onOpen={onOpenService} />
    ) : which === 'signal' ? (
      <FamilyScreen landscape={!narrow} onOpen={onOpenService} />
    ) : which === 'process' ? (
      <ProcessScreen active={activeStep} onSelect={onSelectStep} />
    ) : (
      <LaunchScreen />
    )

  /**
   * Priority −1, and the reason matters.
   *
   * The DOM screen is drawn by drei's <Html transform>, which reads this
   * group's world matrix inside its own frame callback. Callbacks run in
   * subscription order, and React mounts children before parents — so the
   * Html, a child of this component, was subscribing first and placing the
   * markup from the pose written on the *previous* frame while the GL model
   * drew the current one. One frame of skew, which reads as the screen
   * sliding off the glass whenever the phone moves.
   *
   * A negative priority sorts this callback ahead of it. Only a priority above
   * zero hands rendering over to the caller, so the automatic render stays.
   */
  useFrame((_, rawDelta) => {
    const g = group.current
    const s = state.current
    if (!g) return

    const dt = Math.min(rawDelta, 1 / 30)
    const pose = poseAt(s.progress, s.narrow)

    // pointer parallax, but only while the phone is still being presented —
    // once it is flying at the camera the tilt would fight the framing
    const parallax = s.reduced
      ? 0
      : 1 - Math.min(1, Math.max(0, (s.progress - 0.6) / 0.15))
    tilt.current.x = damp(tilt.current.x, -s.pointer.y * 0.16 * parallax, 6, dt)
    tilt.current.y = damp(tilt.current.y, s.pointer.x * 0.22 * parallax, 6, dt)

    const lambda = 9
    g.position.x = damp(g.position.x, pose.x, lambda, dt)
    g.position.y = damp(g.position.y, pose.y, lambda, dt)
    g.position.z = damp(g.position.z, pose.z, lambda, dt)
    g.rotation.x = damp(g.rotation.x, pose.rotX + tilt.current.x, lambda, dt)
    g.rotation.y = damp(g.rotation.y, pose.rotY + tilt.current.y, lambda, dt)
    g.rotation.z = damp(g.rotation.z, pose.rotZ, lambda, dt)

    const scale = pose.scale - 0.06 * (1 - pose.presence)
    g.scale.setScalar(damp(g.scale.x, scale, lambda, dt))
    g.visible = pose.presence > 0.01

    if (backlight.current) {
      backlight.current.intensity = damp(
        backlight.current.intensity,
        pose.backlight * pose.presence * 2.4,
        6,
        dt,
      )
    }

    // the DOM screen lives in a CSS3D layer, so it is faded through its own
    // wrapper rather than a material. It also stops taking clicks once it is
    // dissolving, so the panel underneath is not fighting a ghost for them.
    if (screenHtml.current) {
      screenHtml.current.style.opacity = `${pose.presence}`
      screenHtml.current.style.pointerEvents =
        pose.presence > 0.95 ? 'auto' : 'none'
      // the last screen's mark rides the scroll through a custom property, so
      // fading it costs nothing but a style write on an element already here
      screenHtml.current.style.setProperty(
        '--mark',
        markAt(s.progress).toFixed(3),
      )
    }
  }, -1)

  return (
    <>
      {/* studio lighting, built in-scene so nothing is fetched at runtime */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-4, 1, 2]} intensity={0.8} color="#ff6a3d" />
      <directionalLight
        position={[0, -3, -4]}
        intensity={0.5}
        color="#4c6fff"
      />

      <StudioEnvironment />

      <group ref={group}>
        <Suspense fallback={null}>
          <PhoneModel backlightRef={backlight} onReady={onReady} />
        </Suspense>

        {/* the live UI, drawn onto the display in a CSS3D layer so the contact
            form and the process list stay real DOM rather than a texture */}
        <Html
          transform
          // the model faces the camera, so the markup sits a hair in front of
          // the glass on the same axis
          position={[0, SCREEN.centerY, SCREEN.z + 0.001]}
          scale={SCREEN_SCALE}
          zIndexRange={[10, 0]}
          // the wrapper below owns pointer events so the empty space around the
          // display never eats a click meant for the page behind it
          style={{ pointerEvents: 'none' }}
        >
          <div
            ref={screenHtml}
            className="phone-screen-host"
            style={{ width: SCREEN_PX.w, height: SCREEN_PX.h }}
          >
            {/* The outgoing screen is held for the length of the dissolve and
                stacked under the incoming one. Act three is the reason: it goes
                from a white screen to a black one, and swapped outright that is
                a flash rather than a change of light. */}
            {leaving ? (
              <div className="phone-screen-swap is-out" key={`out-${leaving}`}>
                {renderScreen(leaving)}
              </div>
            ) : null}
            <div className="phone-screen-swap is-in" key={`in-${stage}`}>
              {renderScreen(stage)}
            </div>
          </div>
        </Html>
      </group>
    </>
  )
}

export default PhoneRig
