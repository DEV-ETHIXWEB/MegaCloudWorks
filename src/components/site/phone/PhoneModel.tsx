import { use, useLayoutEffect, useMemo } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import { warmPhoneModel } from './phoneAsset'
import { MODEL_SCALE, SCREEN } from './story'

/** The parsed shell, kept module-wide so a remount costs nothing. */
let shellPromise: Promise<THREE.Group> | null = null

function loadShell() {
  shellPromise ??= warmPhoneModel().then(
    (data) =>
      new Promise<THREE.Group>((resolve, reject) => {
        new GLTFLoader().parse(
          data,
          '',
          (gltf) => resolve(gltf.scene),
          (error) => reject(new Error(String(error))),
        )
      }),
  )
  return shellPromise
}

/**
 * The model ships with sensible studio PBR, but not with this site's — its
 * frame is a neutral graphite where the page wants near-black with a hard
 * clearcoat, and its display is white where the story needs black glass for the
 * DOM screen to sit on. The parts are named, so each one is swapped by name.
 */
function materialFor(name: string): THREE.Material {
  switch (name) {
    // body shell and side rails
    case 'Glossy Graphite Frame':
      return new THREE.MeshPhysicalMaterial({
        color: '#1b1b21',
        metalness: 0.92,
        roughness: 0.32,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
      })
    // the sheet over the display, and the notch cut into it
    case 'Black Glass':
      return new THREE.MeshPhysicalMaterial({
        color: '#0a0d16',
        metalness: 0.3,
        roughness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
      })
    /* The display itself. Unlit on purpose: the DOM screen is drawn over this
       rectangle, and anything the scene lights would show through the gaps in
       the markup as a grey wash rather than black glass. */
    case 'Screen White':
      return new THREE.MeshBasicMaterial({
        color: '#050507',
        toneMapped: false,
      })
    // camera lens
    case 'Camera Lens':
      return new THREE.MeshPhysicalMaterial({
        color: '#0a0d16',
        metalness: 1,
        roughness: 0.06,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
      })
    // side rails and the buttons cut into them
    case 'Buttons':
      return new THREE.MeshStandardMaterial({
        color: '#3a3a44',
        metalness: 0.85,
        roughness: 0.4,
      })
    // notch, earpiece, port, speaker — matte near-black
    default:
      return new THREE.MeshStandardMaterial({
        color: '#08080a',
        metalness: 0.4,
        roughness: 0.65,
      })
  }
}

/** The one spot of brand colour on the hardware, as the old shell had. */
const alertSwitch = () =>
  new THREE.MeshStandardMaterial({
    color: '#f5333b',
    emissive: '#f5333b',
    emissiveIntensity: 0.25,
    metalness: 0.2,
    roughness: 0.5,
  })

/**
 * The phone itself: the loaded shell and the backlight that spills out of its
 * display. Nothing here animates — the story drives the parent group so this
 * stays a plain, cheap subtree.
 */
export function PhoneModel({
  backlightRef,
  onReady,
}: {
  backlightRef?: React.RefObject<THREE.PointLight | null>
  /** the shell is in the scene — the DOM placeholder can go */
  onReady?: () => void
}) {
  const gltf = use(loadShell())

  // the loader caches one object per url, so work on a clone
  const shell = useMemo(() => {
    const clone = gltf.clone(true)
    const cache = new Map<string, THREE.Material>()

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      child.castShadow = true
      child.receiveShadow = true

      const source = Array.isArray(child.material)
        ? child.material[0]
        : child.material
      const key =
        child.name === 'Left_Button' ? 'alert' : source?.name || 'default'
      let mat = cache.get(key)
      if (!mat) {
        mat = key === 'alert' ? alertSwitch() : materialFor(key)
        cache.set(key, mat)
      }
      child.material = mat
    })

    /* The export carries a roll baked into every part's own matrix — the
       device is authored leaning about seven degrees. The story stages an
       upright phone and rolls it itself, so the lean is taken back out here;
       read off the model rather than typed in, so a re-export that fixes it
       needs no change. */
    let roll = 0
    clone.traverse((child) => {
      if (roll === 0 && child instanceof THREE.Mesh) {
        roll = new THREE.Euler().setFromQuaternion(child.quaternion).z
      }
    })
    clone.rotation.z = -roll

    // authored in millimetres, staged in world units
    clone.scale.setScalar(MODEL_SCALE)
    return clone
  }, [gltf])

  useLayoutEffect(() => {
    onReady?.()
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
    // the model is authored facing the camera and centred on its own body, so
    // it needs no spin and no offset of its own
    <group>
      <primitive object={shell} />

      {/* the glow the screen throws back onto the body and the scene: it sits
          out in front of the glass, on the display's own axis */}
      <pointLight
        ref={backlightRef}
        position={[0, SCREEN.centerY, SCREEN.z + 0.45]}
        color="#9fc4ff"
        intensity={0}
        distance={3}
        decay={2}
      />
    </group>
  )
}

// the fetch is already in flight from the story module; this starts the parse
// as soon as the chunk evaluates rather than waiting for the first render
void loadShell()

export default PhoneModel
