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
    // larger scale => bigger, rounder cumulus puffs
    vec2 p = vec2(uv.x * aspect, uv.y) * 2.5;

    // slow roll flowing up and to the RIGHT, following the flow arrows
    float t = uTime * 0.05;
    vec2 drift = vec2(-t * 0.75 + sin(uTime * 0.06) * 0.12, -t);

    // domain-warped billowing turbulence
    vec2 q = vec2(fbm(p + drift), fbm(p + vec2(3.1, 1.7) + drift * 1.1));
    float warp = 2.0;
    float f = fbm(p + q * warp + drift);
    // sample a touch higher up the field for fake top-down lighting
    float fu = fbm(p + vec2(0.0, 0.09) + q * warp + drift);

    // Pure white 2D cloud appearance - minimal shading for flat, clean look
    float lite = clamp((f - fu) * 3.0 + 0.7, 0.0, 1.0);

    vec3 litCol = vec3(1.0, 1.0, 1.0);        // bright white
    vec3 shadeCol = vec3(0.95, 0.95, 0.97);   // very light white-grey for subtle depth
    vec3 col = mix(shadeCol, litCol, lite);

    // shape the bank: full and opaque in the body, wispy translucent edges,
    // thinning toward the top.
    float rise = smoothstep(1.15, 0.0, uv.y);
    float bottomFade = smoothstep(0.0, 0.06, uv.y);

    // keep the clouds strictly to the RIGHT of the diagonal border (the red
    // line): the boundary leans right going up (~0.33 at the base -> ~0.55 at
    // the top), so nothing ever spills onto the headline / copy.
    float borderX = 0.33 + 0.22 * uv.y;
    float leftMask = smoothstep(borderX - 0.04, borderX + 0.12, uv.x);

    float alpha = smoothstep(0.30, 0.60, f);  // dense cloud cores stay opaque
    alpha = clamp(alpha * rise * bottomFade * leftMask * 1.55, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`

/**
 * SmokeBackground — a white/grey/red WebGL plume that rises behind the phone.
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
