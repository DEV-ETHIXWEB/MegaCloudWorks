import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * A studio reflection environment, painted rather than loaded.
 *
 * The phone body is metal, and metal with no environment renders as a black
 * slab — but drei's <Environment> drags in the HDR/gainmap loaders, which is
 * most of a megabyte of client bundle for a map we would never fetch. A 64×32
 * canvas run through PMREM gives the same job: a bright overhead key, brand red
 * raking in from one side, a cool bounce from the other.
 */
export function StudioEnvironment() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)

  useLayoutEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // ground to sky: a soft studio falloff
    const sky = ctx.createLinearGradient(0, 0, 0, 32)
    sky.addColorStop(0, '#ffffff')
    sky.addColorStop(0.42, '#8f94a6')
    sky.addColorStop(0.6, '#26262e')
    sky.addColorStop(1, '#0a0a0d')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, 64, 32)

    // the two rim sources, placed a quarter turn either side of the camera
    const rim = (x: number, color: string) => {
      const g = ctx.createRadialGradient(x, 13, 0, x, 13, 16)
      g.addColorStop(0, color)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 64, 32)
    }
    rim(12, 'rgba(245, 51, 59, 0.85)')
    rim(52, 'rgba(120, 165, 255, 0.7)')

    const texture = new THREE.CanvasTexture(canvas)
    texture.mapping = THREE.EquirectangularReflectionMapping
    texture.colorSpace = THREE.SRGBColorSpace

    const pmrem = new THREE.PMREMGenerator(gl)
    const target = pmrem.fromEquirectangular(texture)
    scene.environment = target.texture

    return () => {
      scene.environment = null
      target.dispose()
      pmrem.dispose()
      texture.dispose()
    }
  }, [gl, scene])

  return null
}

export default StudioEnvironment
