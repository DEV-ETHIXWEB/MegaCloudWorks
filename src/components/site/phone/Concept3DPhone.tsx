import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type * as THREE from 'three'
import { PhoneModel } from './PhoneModel'
import { CAMERA, SCREEN, SCREEN_SCALE } from './story'

export function Concept3DPhone({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  const screenRef = useRef<THREE.Mesh>(null)

  return (
    <div className={`relative h-[520px] w-full max-w-[320px] mx-auto ${className}`}>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{
          fov: CAMERA.fov,
          position: [0, 0, CAMERA.z],
          near: 0.1,
          far: 40,
        }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 8, 6]} intensity={1.4} />
        <directionalLight position={[-4, -6, -2]} intensity={0.4} color="#88aaff" />

        <Suspense fallback={null}>
          <group rotation={[0.08, Math.PI, 0]}>
            <PhoneModel screenRef={screenRef} />
            <Html
              transform
              occlude="blending"
              position={[0, SCREEN.centerY, SCREEN.z + 0.005]}
              rotation={[0, Math.PI, 0]}
              scale={SCREEN_SCALE}
            >
              <div className="ios h-[712px] w-[340px] overflow-hidden rounded-[44px] bg-[#0c0e12]">
                {children}
              </div>
            </Html>
          </group>
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Concept3DPhone
