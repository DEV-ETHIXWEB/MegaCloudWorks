import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import type { Concept } from '#/lib/concepts'

const VolumetricSky = lazy(() => import('#/components/site/sky/VolumetricSky'))

/**
 * The weather every case study opens in.
 *
 * There is no drawn scenery here on purpose. A vector mountain is a sticker:
 * it holds one silhouette forever, it has to be re-tinted per concept, and at
 * any size above a phone it reads as clip art. What the studio's picture is
 * actually made of is weather - white cloud with movement inside it and one
 * red plume going through it - and weather is the part a shader can do
 * honestly. So the frame is snow, the field is WebGL, and nothing is drawn.
 *
 * Nothing in it is tinted by the product either. The concept's colour lives on
 * the glass of the device standing in front of this and nowhere else, which is
 * the same discipline the studio's own photograph has: monochrome, and one red.
 */

/**
 * A flake.
 *
 * Seeded from the concept's slug rather than Math.random: the hero is server
 * rendered, and a random layout on the server that disagrees with the client's
 * is a hydration mismatch on every single flake.
 */
function useFlakes(seed: string, count: number) {
  return useMemo(() => {
    let h = 2166136261
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    const rand = () => {
      h ^= h << 13
      h ^= h >>> 17
      h ^= h << 5
      return ((h >>> 0) % 10000) / 10000
    }

    return Array.from({ length: count }, () => {
      const size = 2 + rand() * 4
      return {
        left: rand() * 100,
        size,
        // the big ones are nearer, so they fall faster and drift further
        duration: 20 - size * 1.6 + rand() * 8,
        delay: -rand() * 26,
        drift: (rand() - 0.5) * 14,
        opacity: 0.3 + rand() * 0.45,
      }
    })
  }, [seed, count])
}

export function AlpineBackdrop({ c }: { c: Concept }) {
  const host = useRef<HTMLDivElement>(null)
  const scroll = useRef(0)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [narrow, setNarrow] = useState(false)

  // fewer flakes on a phone: the same count over a third of the width is
  // a snowstorm, and it is behind the only thing on the screen that matters
  const flakes = useFlakes(c.slug, narrow ? 12 : 26)

  // WebGL is client-only, and it is the most expensive thing in the hero - so
  // the page paints first and the field arrives behind it
  useEffect(() => {
    if (typeof window === 'undefined') return
    setReady(true)

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const small = window.matchMedia('(max-width: 767px)')
    const sync = () => {
      setReduced(motion.matches)
      setNarrow(small.matches)
    }
    sync()
    motion.addEventListener('change', sync)
    small.addEventListener('change', sync)
    return () => {
      motion.removeEventListener('change', sync)
      small.removeEventListener('change', sync)
    }
  }, [])

  // the shader thins the field out as the hero leaves; it reads the progress
  // from here rather than subscribing to scroll itself
  useEffect(() => {
    if (typeof window === 'undefined') return
    const node = host.current
    if (!node) return

    let frame = 0
    const measure = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      scroll.current = Math.max(
        0,
        Math.min(1, -rect.top / Math.max(rect.height * 0.8, 1)),
      )
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <div ref={host} aria-hidden="true" className="cs-sky">
      {/*
        The studio's own picture, and the ground everything else stands on.

        Blurred hard on purpose. Sharp, it is a photograph the case study is
        laid over and the page becomes a poster; at this radius it is the light
        in the room - the ridge is still legible as a shape, the red still
        reads as red, and there is nothing in it competing with the device for
        an eye. The slow drift keeps it from setting like wallpaper.
      */}
      <img
        src="/work/bg1.png"
        alt=""
        loading="eager"
        decoding="async"
        className="cs-sky__plate"
        data-sky-layer="plate"
      />

      {/* the light in the air, before anything moves in it */}
      <span className="cs-sky__haze" data-sky-layer="haze" />

      {/* cloud, and the studio's red going through it */}
      {ready ? (
        <div className="cs-sky__field" data-sky-layer="smoke">
          <Suspense fallback={null}>
            <VolumetricSky scroll={scroll} reduced={reduced} />
          </Suspense>
        </div>
      ) : null}

      <div className="cs-snow">
        {flakes.map((f, i) => (
          <span
            key={i}
            className="cs-snow__flake"
            style={
              {
                left: `${f.left}%`,
                height: f.size,
                width: f.size,
                opacity: f.opacity,
                animationDuration: `${f.duration}s`,
                animationDelay: `${f.delay}s`,
                '--drift': `${f.drift}rem`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}

export default AlpineBackdrop
