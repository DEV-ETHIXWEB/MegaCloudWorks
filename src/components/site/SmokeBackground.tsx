import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import { cn } from '#/lib/utils'

const vertex = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p = p * 2.0 + vec2(37.0, 17.0);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2(uv.x * aspect, uv.y) * 3.0;

    // rise: scroll the noise field downward so plumes travel UP the screen.
    // a little horizontal sway makes the column billow instead of sliding straight.
    float t = uTime * 0.14;
    vec2 drift = vec2(sin(uTime * 0.11) * 0.12, -t);

    // domain warp for billowing turbulence
    vec2 q = vec2(fbm(p + drift), fbm(p + vec2(3.1, 1.7) + drift * 1.15));
    float f = fbm(p + q * 2.2 + drift);

    float d = smoothstep(0.14, 0.88, f);
    d = pow(d, 1.1);

    // colour body: soft grey where the smoke is thin, deepening to charcoal /
    // near-black in the dense folds. natural, neutral smoke.
    vec3 grey = vec3(0.50, 0.50, 0.53);
    vec3 black = vec3(0.05, 0.05, 0.06);
    vec3 col = mix(grey, black, smoothstep(0.30, 0.96, d));

    // RED SMOG on the right band (behind the phone's right edge + over the rock):
    // neutral grey through the centre-left, blending decisively to red smoke as
    // it approaches the right edge — lighter red where thin, deep red where dense.
    float redZone = smoothstep(0.68, 0.84, uv.x);
    vec3 red = vec3(0.84, 0.08, 0.11);
    vec3 redDeep = vec3(0.34, 0.02, 0.03);
    vec3 redSmoke = mix(red, redDeep, smoothstep(0.35, 0.95, d));
    col = mix(col, redSmoke, redZone);

    // rise & dissipate: dense near the base, thinning gradually toward the top.
    float rise = smoothstep(1.18, 0.04, uv.y);
    float bottomFade = smoothstep(0.0, 0.08, uv.y);
    // concentrate behind the phone/rock on the right, clear the copy on the left.
    float rightBias = smoothstep(0.10, 0.55, uv.x);

    // wispier, more natural edges — thin smoke stays translucent, only the
    // dense cores build up opacity.
    float body = pow(d, 1.35);
    float alpha = clamp(body * rise * bottomFade * rightBias * 1.45, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`

/**
 * SmokeBackground — a grey/black/red WebGL plume that rises behind the phone.
 * Rendered with OGL (WebGL1) and mounted client-side only, so it is SSR-safe.
 * Draws its own colour with normal alpha (no blend mode needed); if the context
 * can't be created it simply stays transparent over the hero's white base.
 */
export function SmokeBackground({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let renderer: Renderer
    try {
      renderer = new Renderer({
        webgl: 1,
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      })
    } catch {
      return // no WebGL — the CSS gradient fallback stays visible
    }

    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)

    const canvas = gl.canvas as HTMLCanvasElement
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    el.appendChild(canvas)

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    const resize = () => {
      const { clientWidth, clientHeight } = el
      renderer.setSize(clientWidth, clientHeight)
      program.uniforms.uResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
      ]
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let raf = 0
    const start = performance.now()
    const loop = (now: number) => {
      program.uniforms.uTime.value = (now - start) / 1000
      renderer.render({ scene: mesh })
      raf = requestAnimationFrame(loop)
    }

    if (reduceMotion) {
      program.uniforms.uTime.value = 8
      renderer.render({ scene: mesh })
    } else {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.remove()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
    />
  )
}

export default SmokeBackground
