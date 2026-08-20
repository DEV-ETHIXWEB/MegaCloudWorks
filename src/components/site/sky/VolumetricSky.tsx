import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScreenQuad } from '@react-three/drei'
import * as THREE from 'three'

/**
 * The weather, in WebGL.
 *
 * The studio's own picture is a snow ridge losing itself in cloud with red
 * smoke pouring off it. Two soft-edged divs and a blur filter can suggest that
 * from a distance; they cannot do the thing that actually makes cloud read as
 * cloud, which is that its *interior* keeps moving while its silhouette drifts.
 * So this is a raymarch-free but genuinely volumetric-looking field: domain
 * warped fractal noise, two banks at different depths, and a smoke column that
 * is a second noise field advected upward through the first.
 *
 * It renders as a fullscreen triangle with alpha, over nothing. The page's own
 * white is the sky; this only ever adds the grey a cloud makes and the red the
 * studio makes.
 */

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  // ScreenQuad hands over a single oversized triangle already in clip space
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const FRAG = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uAspect;
uniform float uScroll;
uniform vec3  uSmoke;

/* ---- value noise ------------------------------------------------------ */

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),                hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

/*
  Five octaves, rotated between each one.

  The rotation matters more than the octave count: stacking noise on the same
  axes leaves a visible grid at low frequencies, and a cloud with a grid in it
  is a texture. Six octaves is the point of diminishing returns at this size,
  and five keeps a mid-range laptop at frame rate with the phone's own canvas
  running beside it.
*/
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(1.62, 1.2, -1.2, 1.62);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p;
    a *= 0.5;
  }
  return v;
}

/** Domain-warped fbm - what turns smooth blobs into something with weather in it. */
float clouds(vec2 p, float t) {
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(
    fbm(p + 3.4 * q + vec2(1.7, 9.2) + 0.15 * t),
    fbm(p + 3.4 * q + vec2(8.3, 2.8) - 0.12 * t)
  );
  return fbm(p + 3.0 * r);
}

void main() {
  vec2 uv = vUv;
  vec2 p = vec2(uv.x * uAspect, uv.y);

  float t = uTime * 0.014;

  /* ---- the far bank: high, slow, and almost all silhouette ---- */

  float far = clouds(p * 1.5 + vec2(t * 1.4, 0.0), t * 0.6);
  float farBand =
    smoothstep(0.12, 0.62, uv.y) * (1.0 - smoothstep(0.72, 1.02, uv.y));
  float farD = smoothstep(0.42, 0.86, far) * farBand;

  /* ---- the near bank: lower, faster, and the one with edges ---- */

  float near = clouds(p * 2.9 - vec2(t * 2.6, t * 0.35), t);
  float nearBand =
    smoothstep(-0.05, 0.34, uv.y) * (1.0 - smoothstep(0.44, 0.86, uv.y));
  float nearD = smoothstep(0.38, 0.78, near) * nearBand;

  /*
    Cloud is not white on a white page - it is the grey it casts.

    The density is split: the bulk shades toward a cool slate, and the
    steepest part of the gradient is left near white, which is what reads as
    a lit edge. Without the second term the field is a smudge.
  */
  float density = clamp(farD * 0.62 + nearD * 0.9, 0.0, 1.0);
  float lit = smoothstep(0.55, 0.95, near) * nearBand;

  /*
    Held well back, because there is now a photograph underneath.

    At full strength this field was the hero's weather; with the plate visible
    behind it, the same alpha reads as a grey wash laid over a picture that
    already has cloud in it. What it is for now is movement - the interior of
    the fog shifting over a still frame - so it contributes about a third of
    what it used to, and the red is what actually shows.
  */
  vec3 shade = mix(vec3(0.78, 0.82, 0.868), vec3(1.0), lit);
  float alpha = density * 0.3;

  /* ---- the red, coming off the ridge on the right ---- */

  /*
    A column, not a cloud: the noise is sampled with y running against time so
    the field itself climbs, and it is masked into a plume that leans as it
    rises - narrow and dense at the vent, wide and thin at the top.
  */
  float rise = uTime * 0.05;
  float smokeN = clouds(p * 2.2 + vec2(-t * 0.9, -rise), t * 1.4);

  float lean = uv.x - 0.055 * (uv.y - 0.18);
  float column =
    smoothstep(0.86, 0.63, lean) * smoothstep(0.44, 0.66, lean);
  float column2 = smoothstep(1.02, 0.82, lean) * smoothstep(0.70, 0.86, lean);

  float vent = smoothstep(0.06, 0.3, uv.y) * (1.0 - smoothstep(0.42, 0.92, uv.y));
  float smokeD =
    smoothstep(0.34, 0.78, smokeN) * (column * 0.9 + column2 * 0.7) * vent;

  /*
    Composited over the cloud rather than added to it: smoke that lightens the
    grey it passes through is lit from inside, which is a flare, not smoke.
  */
  vec3 col = mix(shade, uSmoke, clamp(smokeD * 1.5, 0.0, 1.0));
  alpha = clamp(alpha + smokeD * 0.85, 0.0, 1.0);

  // the whole field thins out as the hero leaves, so the section below it
  // arrives on clean paper rather than through fog
  alpha *= 1.0 - uScroll * 0.85;

  if (alpha < 0.004) discard;
  gl_FragColor = vec4(col, alpha);
}
`

export type VolumetricSkyProps = {
  /** 0 … 1, how far the hero has scrolled away */
  scroll: React.RefObject<number>
  /** the studio red - a constant across all five concepts */
  smoke?: string
  reduced?: boolean
  /**
   * Whether the hero is still on screen.
   *
   * The field costs the same whether or not anybody can see it, and a case
   * study is a long page - so once the hero has left, it stops. It holds its
   * last frame rather than clearing, so coming back up the page finds the
   * weather where it was left.
   */
  visible?: boolean
}

function Field({
  scroll,
  smoke = '#f5333b',
  reduced = false,
}: VolumetricSkyProps) {
  const mat = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1.6 },
      uScroll: { value: 0 },
      uSmoke: { value: new THREE.Color(smoke) },
    }),
    [smoke],
  )

  useFrame(({ size }, delta) => {
    const m = mat.current
    if (!m) return
    // under reduced motion the field is still drawn - it is a picture, and a
    // picture is not what anyone is asking to be spared - it simply holds
    if (!reduced) m.uniforms.uTime.value += Math.min(delta, 0.05)
    m.uniforms.uAspect.value = size.width / Math.max(size.height, 1)
    m.uniforms.uScroll.value = scroll.current ?? 0
  })

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </ScreenQuad>
  )
}

export function VolumetricSky(props: VolumetricSkyProps) {
  return (
    <Canvas
      /*
        Well below the device's cap, and below 1:1 as well.

        This is a full-bleed fullscreen shader with five octaves in it, run
        twice for the two banks and again for the smoke column: the pixel
        count is the entire cost. It was drawing at up to 1.25x, which on a
        laptop hero is three million pixels of fractal noise every frame and
        the reason the device standing in front of it stuttered.

        The smallest feature in the field is about forty pixels across, so
        there is nothing in it that survives to a single pixel anyway. Drawn
        at two thirds and let up to size, it is the same weather for a
        quarter of the work - and the upscale is a blur across cloud, which
        is cloud.
      */
      dpr={[0.6, 0.8]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      frameloop={props.reduced || props.visible === false ? 'demand' : 'always'}
    >
      <Field {...props} />
    </Canvas>
  )
}

export default VolumetricSky
