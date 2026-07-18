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
    float t = uTime * 0.08;

    // domain warp + upward drift for a billowing smoke feel
    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
    float f = fbm(p + q * 1.6 + vec2(0.0, -t * 1.5));
    f = smoothstep(0.12, 1.0, f);

    vec3 dark = vec3(0.04, 0.04, 0.05);
    vec3 red = vec3(0.86, 0.10, 0.14);
    vec3 hot = vec3(1.0, 0.42, 0.30);
    vec3 col = mix(dark, red, smoothstep(0.2, 0.72, f));
    col = mix(col, hot, smoothstep(0.72, 1.0, f) * 0.85);

    // fade at the horizontal edges so the plume reads as a column
    float edge = smoothstep(0.0, 0.32, uv.x) * smoothstep(0.0, 0.3, 1.0 - uv.x);
    float alpha = clamp(f * 1.25, 0.0, 1.0) * edge;

    gl_FragColor = vec4(col, alpha * 0.92);
  }
`

/**
 * SmokeBackground — the red/black WebGL plume behind the phone.
 * Rendered with OGL (WebGL1) and mounted client-side only, so it is SSR-safe.
 * A CSS gradient sits behind it (see the hero) as a graceful fallback if the
 * context can't be created.
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
