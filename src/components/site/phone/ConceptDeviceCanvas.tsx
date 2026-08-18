import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Html } from '@react-three/drei'
import * as THREE from 'three'
import { PhoneNavRelay } from '#/lib/phoneUI'
import type { PhoneNavValue } from '#/lib/phoneUI'
import { PhoneModel } from './PhoneModel'
import {
  DEVICE_CAMERA,
  DEVICE_PX,
  DEVICE_SCREEN_SCALE,
  DEVICE_SCREEN_Y,
  DEVICE_SCREEN_Z,
  SCROLL_TURN,
  TILT,
  damp,
} from './deviceStage'

/**
 * Live state the rig reads every frame.
 *
 * A ref rather than props: pointer moves and scroll fire far more often than
 * React should re-render a WebGL scene, and the whole point of the device is
 * that it responds without the page thinking about it.
 */
export type DeviceState = {
  /** −1 … 1, pointer position across the hero */
  px: number
  py: number
  /** 0 … 1, how far the hero has scrolled past */
  scroll: number
  /** true while the pointer is over the device's own area */
  near: boolean
  reduced: boolean
}

export type ConceptDeviceCanvasProps = {
  state: React.RefObject<DeviceState>
  /** the concept's accent - the colour the glass throws onto the shell */
  accent: string
  /** bumped whenever the screen changes, so the glass flares on the change */
  pulse: number
  /** the page's router, carried across the canvas boundary - see PhoneNavRelay */
  nav: PhoneNavValue
  children?: React.ReactNode
}

/**
 * The phone, alive.
 *
 * Four motions run at once and none of them is a keyframe:
 *
 *   breathe   a slow rise and fall on y, plus a hair of scale, so the object
 *             has weight and is not simply parked
 *   sway      an offset roll on a different period to the breath, which is
 *             what stops the two reading as one loop
 *   answer    the pointer pushes it, and it damps back - the tilt is not
 *             linear to the cursor, it lags it, which is the whole difference
 *             between a hover effect and something being held
 *   turn      scroll rotates it away as the hero leaves, so the device hands
 *             the page over rather than being cut off by it
 */
function Rig({ state, accent, pulse, nav, children }: ConceptDeviceCanvasProps) {
  const rig = useRef<THREE.Group>(null)
  const screen = useRef<THREE.Mesh>(null)
  const backlight = useRef<THREE.PointLight>(null)
  const rim = useRef<THREE.PointLight>(null)

  // where the rig actually is, as opposed to where it is being asked to be
  const now = useRef({ rotX: 0.12, rotY: -0.5, rotZ: 0, y: -0.5, scale: 0.94 })
  // 0 → just mounted, 1 → fully arrived; drives the one-shot entrance
  const arrival = useRef(0)
  // decays after every screen change, and is added to the backlight
  const flare = useRef(0)
  const lastPulse = useRef(pulse)

  const tint = useRef(new THREE.Color(accent))

  useFrame((_, rawDelta) => {
    const group = rig.current
    const s = state.current
    if (!group || !s) return

    // a tab-out can hand back a delta of several seconds; clamped, or the
    // damping below resolves in one frame and the arrival is never seen
    const dt = Math.min(rawDelta, 0.05)
    const t = performance.now() / 1000

    if (pulse !== lastPulse.current) {
      lastPulse.current = pulse
      flare.current = 1
    }
    flare.current = Math.max(0, flare.current - dt * 2.6)

    if (s.reduced) {
      group.position.set(0, 0, 0)
      group.rotation.set(0, 0, 0)
      group.scale.setScalar(1)
      if (backlight.current) backlight.current.intensity = 2.4
      if (rim.current) rim.current.intensity = 1.1
      return
    }

    // ~0.55s to stand up, so the device has finished arriving inside the
    // page's two-second arrival budget even when the WebGL chunk lands late
    arrival.current = Math.min(1, arrival.current + dt * 1.8)
    const a = 1 - Math.pow(1 - arrival.current, 4)

    /* ---- the pose being asked for ---- */

    // the pointer's pull falls off once it leaves the device's neighbourhood,
    // so a cursor crossing the far side of the hero doesn't yank it
    const pull = s.near ? 1 : 0.45
    const turn = s.scroll * SCROLL_TURN

    const wantRotY = s.px * TILT.y * pull + turn
    const wantRotX = -s.py * TILT.x * pull + s.scroll * 0.1
    const wantRotZ = Math.sin(t * 0.42) * 0.019 - s.px * 0.035 * pull
    const wantY = Math.sin(t * 0.62) * 0.031 - s.scroll * 0.34
    const wantScale = 1 + Math.sin(t * 0.9) * 0.005

    /* ---- and the pose it arrives at ---- */

    const n = now.current
    n.rotY = damp(n.rotY, wantRotY, 3.4, dt)
    n.rotX = damp(n.rotX, wantRotX, 3.4, dt)
    n.rotZ = damp(n.rotZ, wantRotZ, 2.6, dt)
    n.y = damp(n.y, wantY, 3.1, dt)
    n.scale = damp(n.scale, wantScale, 3.8, dt)

    // the entrance is a blend toward the live pose rather than a separate
    // animation, so a pointer move during it is answered immediately
    group.rotation.set(n.rotX, n.rotY, n.rotZ)
    group.position.set(0, n.y - (1 - a) * 0.42, -(1 - a) * 0.5)
    group.scale.setScalar(n.scale * (0.93 + a * 0.07))

    /* ---- the light the screen makes ---- */

    if (backlight.current) {
      const idle = 2.1 + Math.sin(t * 1.7) * 0.16
      backlight.current.intensity = (idle + flare.current * 3.4) * a
    }
    if (rim.current) {
      rim.current.intensity = (0.85 + flare.current * 0.9) * a
    }
  })

  return (
    <>
      {/* Snow light: a broad, almost shadowless key from above, one cold
          bounce from below to stand in for the ground, and a warm kicker so
          the graphite body does not go blue-grey all over. */}
      <ambientLight intensity={1.25} />
      <hemisphereLight args={['#ffffff', '#c9d6e4', 1.1]} />
      <directionalLight position={[3.4, 6.2, 5.4]} intensity={2.1} />
      <directionalLight position={[-4.6, 1.4, 3]} intensity={0.7} color="#dce9f7" />
      <directionalLight position={[0, -3.4, 2.2]} intensity={0.34} color="#ffffff" />

      {/* the accent, thrown from behind the device onto whatever is around it */}
      <pointLight
        ref={rim}
        position={[0, -0.2, -0.9]}
        color={tint.current}
        intensity={0}
        distance={4.5}
        decay={2}
      />

      <group ref={rig}>
        {/*
          Only the shell suspends.

          The OBJ is a network request and the app is not: putting them under
          one boundary means the glass stays empty until the hardware arrives,
          which is the wrong way round - the point of the whole page is the
          software. So the model gets its own boundary and the screen renders
          the instant WebGL is up, with the body materialising around it.
        */}
        <Suspense fallback={null}>
          <PhoneModel screenRef={screen} backlightRef={backlight} />
        </Suspense>

        {/* The app itself, drawn on the glass.
            Parented outside PhoneModel's own group, which is spun a half turn
            to face the display at the camera - so this uses the mirrored z and
            no rotation of its own. */}
        <Html
          transform
          position={[0, DEVICE_SCREEN_Y, DEVICE_SCREEN_Z]}
          scale={DEVICE_SCREEN_SCALE}
          zIndexRange={[10, 0]}
          wrapperClass="cdev__html"
        >
          <div
            className="cdev__glass"
            style={{ width: DEVICE_PX.w, height: DEVICE_PX.h }}
          >
            <PhoneNavRelay value={nav}>{children}</PhoneNavRelay>
            {/* the one thing a flat mockup never has: a reflection that
                belongs to the room rather than to the screenshot */}
            <span aria-hidden="true" className="cdev__sheen" />
          </div>
        </Html>
      </group>

      {/* the device stands on snow, so it has to put something back on it */}
      <ContactShadows
        position={[0, -0.86, 0]}
        opacity={0.34}
        scale={4}
        blur={2.8}
        far={1.4}
        resolution={512}
        color="#1d2733"
      />
    </>
  )
}

export function ConceptDeviceCanvas(props: ConceptDeviceCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{
        fov: DEVICE_CAMERA.fov,
        position: [0, 0, DEVICE_CAMERA.z],
        near: 0.1,
        far: 30,
      }}
    >
      <Rig {...props} />
    </Canvas>
  )
}

export default ConceptDeviceCanvas
