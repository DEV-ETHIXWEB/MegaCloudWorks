import { useLayoutEffect, useMemo, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as THREE from 'three'
import { MODEL_OFFSET, SCREEN } from './story'

export const PHONE_OBJ_URL = '/models/phone/phone.obj'

/**
 * The OBJ ships with SketchUp's default palette — flat mid-blues and greys that
 * read as a toy. The `usemtl` ids survive the load as `material.name`, so each
 * one is swapped here for a material that belongs on this site: graphite body,
 * true-black grilles and lenses, brand red on the alert switch.
 */
function materialFor(name: string): THREE.Material {
  switch (name) {
    // body shell and side rails
    case 'mat17':
    case 'mat16':
      return new THREE.MeshPhysicalMaterial({
        color: '#1b1b21',
        metalness: 0.92,
        roughness: 0.32,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
      })
    // grilles, camera housings, home indicator — matte near-black
    case 'mat23':
      return new THREE.MeshStandardMaterial({
        color: '#08080a',
        metalness: 0.4,
        roughness: 0.65,
      })
    // camera lenses (the OBJ marks these translucent)
    case 'mat24':
    case 'mat25':
      return new THREE.MeshPhysicalMaterial({
        color: '#0a0d16',
        metalness: 1,
        roughness: 0.06,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
      })
    // front sensor
    case 'mat5':
      return new THREE.MeshStandardMaterial({
        color: '#0d1626',
        metalness: 0.8,
        roughness: 0.25,
      })
    // alert switch — the one spot of brand colour on the hardware
    case 'mat8':
      return new THREE.MeshStandardMaterial({
        color: '#f5333b',
        emissive: '#f5333b',
        emissiveIntensity: 0.25,
        metalness: 0.2,
        roughness: 0.5,
      })
    default:
      return new THREE.MeshStandardMaterial({
        color: '#3a3a44',
        metalness: 0.85,
        roughness: 0.4,
      })
  }
}

/** Rounded-rectangle geometry for the display the model does not ship with. */
function useScreenGeometry() {
  return useMemo(() => {
    const { width: w, height: h, radius: r } = SCREEN
    const shape = new THREE.Shape()
    const x = -w / 2
    const y = -h / 2
    shape.moveTo(x + r, y)
    shape.lineTo(x + w - r, y)
    shape.quadraticCurveTo(x + w, y, x + w, y + r)
    shape.lineTo(x + w, y + h - r)
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    shape.lineTo(x + r, y + h)
    shape.quadraticCurveTo(x, y + h, x, y + h - r)
    shape.lineTo(x, y + r)
    shape.quadraticCurveTo(x, y, x + r, y)
    return new THREE.ShapeGeometry(shape, 12)
  }, [])
}

export type PhoneModelHandle = {
  root: THREE.Group | null
  backlight: THREE.PointLight | null
}

/**
 * The phone itself: the loaded shell, a generated display, and the backlight
 * that spills out of it. Nothing here animates — the story drives the parent
 * group so this stays a plain, cheap subtree.
 */
export function PhoneModel({
  screenRef,
  backlightRef,
}: {
  /** the display mesh, so the story can parent DOM screens to it */
  screenRef?: React.RefObject<THREE.Mesh | null>
  backlightRef?: React.RefObject<THREE.PointLight | null>
}) {
  const obj = useLoader(OBJLoader, PHONE_OBJ_URL)
  const screenGeo = useScreenGeometry()
  const shellRef = useRef<THREE.Group>(null)

  // the loader caches one object per url, so work on a clone
  const shell = useMemo(() => {
    const clone = obj.clone(true)
    const cache = new Map<string, THREE.Material>()

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      child.castShadow = true
      child.receiveShadow = true

      const source = Array.isArray(child.material)
        ? child.material[0]
        : child.material
      const key = source?.name || 'default'
      let mat = cache.get(key)
      if (!mat) {
        mat = materialFor(key)
        cache.set(key, mat)
      }
      child.material = mat
    })

    return clone
  }, [obj])

  useLayoutEffect(() => {
    return () => {
      shell.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const m = child.material
          if (Array.isArray(m)) m.forEach((x) => x.dispose())
          else m?.dispose()
        }
      })
    }
  }, [shell])

  return (
    // the model is authored with its display on -Z, so the whole shell is spun
    // to face the camera; the screen mesh below undoes the spin for its own
    // geometry so anything parented to it reads the right way round
    <group ref={shellRef} rotation={[0, Math.PI, 0]}>
      {/* the model's own origin sits off-centre; this puts the body on 0,0,0 */}
      <primitive object={shell} position={[...MODEL_OFFSET]} />

      {/* generated display — black glass that the DOM screen is drawn onto */}
      <mesh
        ref={screenRef}
        geometry={screenGeo}
        position={[0, SCREEN.centerY, SCREEN.z]}
        rotation={[0, Math.PI, 0]}
      >
        <meshBasicMaterial color="#050507" toneMapped={false} />
      </mesh>

      {/* the glow the screen throws back onto the body and the scene */}
      <pointLight
        ref={backlightRef}
        position={[0, SCREEN.centerY, SCREEN.z - 0.45]}
        color="#9fc4ff"
        intensity={0}
        distance={3}
        decay={2}
      />
    </group>
  )
}

useLoader.preload(OBJLoader, PHONE_OBJ_URL)

export default PhoneModel
