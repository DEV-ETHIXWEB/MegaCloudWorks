import { Suspense, useRef } from 'react'
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
}

export function PhoneRig({
  state,
  stage,
  activeStep,
  narrow,
  onSelectStep,
  onOpenService,
}: RigProps) {
  const group = useRef<THREE.Group>(null)
  const screen = useRef<THREE.Mesh>(null)
  const backlight = useRef<THREE.PointLight>(null)
  const screenHtml = useRef<HTMLDivElement>(null)
  const tilt = useRef({ x: 0, y: 0 })

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
  })

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
          <PhoneModel screenRef={screen} backlightRef={backlight} />
        </Suspense>

        {/* the live UI, drawn onto the display in a CSS3D layer so the contact
            form and the process list stay real DOM rather than a texture */}
        <Html
          transform
          // PhoneModel spins the shell to face the camera, so in this group's
          // space the display sits at +z and needs no rotation of its own
          position={[0, SCREEN.centerY, -SCREEN.z + 0.001]}
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
            {stage === 'boot' ? (
              <BootScreen onOpen={onOpenService} />
            ) : stage === 'signal' ? (
              <FamilyScreen landscape={!narrow} onOpen={onOpenService} />
            ) : stage === 'process' ? (
              <ProcessScreen active={activeStep} onSelect={onSelectStep} />
            ) : (
              <LaunchScreen />
            )}
          </div>
        </Html>
      </group>
    </>
  )
}

export default PhoneRig
