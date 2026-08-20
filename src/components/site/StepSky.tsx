import { useEffect, useRef, useState } from 'react'

/**
 * The ground behind "How we work": the artwork's two ridges, cut out of it
 * and pinned to the section's margins - the upper one high on the right, the
 * lower one along the bottom left.
 *
 * They are set out at the edges rather than laid under the section as one
 * plate, because the middle of this band is where every word of it sits. The
 * pieces travel with the page, and fade up as the band arrives so the section
 * does not start on a hard edge.
 */
export function StepSky() {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    const band = el?.closest('section')
    if (!el || !band) return

    let frame = 0
    const read = () => {
      frame = 0
      setShown(band.getBoundingClientRect().top < window.innerHeight)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const on = shown ? 'is-on' : ''

  return (
    <div ref={ref} aria-hidden="true" className="step-sky">
      <img
        src="/about/ridge-right.webp"
        alt=""
        loading="lazy"
        decoding="async"
        className={`step-sky__ridge step-sky__ridge--right ${on}`}
      />
      <img
        src="/about/ridge-left.webp"
        alt=""
        loading="lazy"
        decoding="async"
        className={`step-sky__ridge step-sky__ridge--left ${on}`}
      />
    </div>
  )
}

export default StepSky
