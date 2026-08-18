import { Canvas } from '@react-three/fiber'
import { PhoneRig } from './PhoneRig'
import type { RigProps } from './PhoneRig'
import { CAMERA } from './story'

/**
 * The WebGL half of the story, split into its own chunk. three and drei are the
 * heaviest thing on the home page by a wide margin, and none of it is needed to
 * paint the copy or the contact panel - so the story lazy-loads this after
 * hydration rather than shipping it in the route bundle.
 */
export function PhoneCanvas(props: RigProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{
        fov: CAMERA.fov,
        position: [0, 0, CAMERA.z],
        near: 0.1,
        far: 40,
      }}
    >
      <PhoneRig {...props} />
    </Canvas>
  )
}

export default PhoneCanvas
