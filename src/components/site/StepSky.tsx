import { useEffect, useRef, useState } from 'react'

/**
 * The sky behind "How we work": three painted plates that cross-fade as the
 * reader walks the four steps, so the climb reads as one continuous ascent —
 * thin high air at the start, thickening, and finally the cloud bank the
 * rocket launches out of.
 *
 *   01 – 02   sky-1   a near-empty sky, two wisps
 *   03        sky-2   more cloud, drifting in
 *   04        sky-3   the full bank, piled along the ground
 *
 * The plates are pinned with `position: sticky` inside the band, so one
 * screenful of sky is held under the whole section rather than a single frame
 * being stretched over its several screens of height.
 *
 * Which plate is showing is worked out from scroll position rather than from
 * the rows' one-way "has arrived" flags: the sky has to fall back down the
 * stack when the reader scrolls up again, not stay at 04 forever.
 */

const PLATES = [
  {
    src: '/about/sky-1.png',
    alt: '',
  },
  { src: '/about/sky-2.png', alt: '' },
  { src: '/about/sky-3.png', alt: '' },
] as const

/** step index → plate index */
const PLATE_FOR_STEP = [0, 0, 1, 2]

export function StepSky() {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [plate, setPlate] = useState(0)

  useEffect(() => {
    const el = ref.current
    const band = el?.closest('section')
    if (!el || !band) return

    const rows = Array.from(band.querySelectorAll<HTMLElement>('[data-step]'))

    let frame = 0
    const read = () => {
      frame = 0

      // the band is red from its very top, so the first plate is showing
      // before any row has arrived — hence starting at 0 rather than at -1
      let step = 0
      // a row counts as the one being read once its top has climbed past the
      // upper-middle of the window, which is roughly where its mark sits
      const line = window.innerHeight * 0.55
      rows.forEach((row, i) => {
        if (row.getBoundingClientRect().top <= line) step = i
      })

      setPlate(PLATE_FOR_STEP[step] ?? 0)
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

  return (
    <div ref={ref} aria-hidden="true" className="step-sky">
      <div className="step-sky__hold">
        {PLATES.map((p, i) => (
          <img
            key={p.src}
            src={p.src}
            alt=""
            // the first plate is up the moment the band turns red, so it is
            // fetched with the page; the other two are wanted a screen or two
            // later and load as the band comes into range
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'low'}
            decoding="async"
            className={`step-sky__plate ${shown && plate === i ? 'is-on' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default StepSky
