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
    vec2 p = vec2(uv.x * aspect, uv.y) * 3.1;

    // drift the pattern toward the lower-left over time (top-right -> lower-left stream)
    float t = uTime * 0.09;
    vec2 drift = vec2(t, t);

    // domain warp for billowing turbulence
    vec2 q = vec2(fbm(p + drift), fbm(p + vec2(5.2, 1.3) + drift));
    float f = fbm(p + q * 1.9 + drift * 1.35);

    // dense, high-contrast smoke body — intensified now that it's confined
    float d = smoothstep(0.10, 0.80, f);
    d = pow(d, 0.82);

    // red for mix-blend-multiply: white == no tint, deep red == heavy tint
    vec3 col = mix(vec3(1.0), vec3(0.76, 0.03, 0.07), d);
    col = mix(col, vec3(0.98, 0.24, 0.18), smoothstep(0.76, 1.05, f)); // hot cores

    // keep the smoke strictly BELOW the hand-drawn cut line, which runs from
    // top-right (~0.95, 0.72) down to lower-left (~0.37, 0.0) in uv space.
    // Shrinking the region concentrates the plume so it reads much stronger.
    float lineY = 1.25 * uv.x - 0.46;
    float underLine = 1.0 - smoothstep(-0.05, 0.12, uv.y - lineY);

    // no edge fade — let the plume reach the section's right/bottom edges
    // (the diagonal cut line already shapes its upper boundary)
    float alpha = clamp(d * 1.6, 0.0, 1.0) * underLine;
    gl_FragColor = vec4(col, alpha);
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
