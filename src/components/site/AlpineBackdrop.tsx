import { Suspense, lazy, useEffect, useRef, useState } from 'react'
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
 * honestly. So the field is WebGL, and nothing is drawn.
 *
 * There was falling snow over the whole frame as well - two dozen drifting
 * specks on their own keyframes. It read as dust on the lens rather than
 * weather, and it moved across the one thing in the hero anybody is meant to
 * be looking at.
 *
 * Nothing in it is tinted by the product either. The concept's colour lives on
 * the glass of the device standing in front of this and nowhere else, which is
 * the same discipline the studio's own photograph has: monochrome, and one red.
 */

export function AlpineBackdrop({ c }: { c: Concept }) {
  const host = useRef<HTMLDivElement>(null)
  const scroll = useRef(0)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)

  // WebGL is client-only, and it is the most expensive thing in the hero - so
  // the page paints first and the field arrives behind it
  useEffect(() => {
    if (typeof window === 'undefined') return
    setReady(true)

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      setReduced(motion.matches)
    }
    sync()
    motion.addEventListener('change', sync)
    return () => {
      motion.removeEventListener('change', sync)
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

      {/*
        The picture, in the product's colour.

        The photograph is the studio's own: a snow ridge with red smoke coming
        off it. Five case studies share it, and on four of them that red is a
        sixth brand in a hero already carrying one. This blends the concept's
        accent over it on `color`, which takes the hue and leaves the
        luminosity - so the smoke turns the product's colour and the ridge
        stays a ridge. No parallax layer: it is flat colour over the whole
        frame, and has nothing to come out of register with.
      */}
      <span className="cs-sky__tint" />

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
    </div>
  )
}

export default AlpineBackdrop
