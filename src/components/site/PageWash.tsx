import { useEffect, useState } from 'react'

/**
 * The page's own background, which the scroll flips between paper and brand.
 *
 * Sections declare the colour they want to be read on with `data-band`; this
 * paints a single fixed sheet behind everything and cross-fades it as the
 * reader approaches the next band, rather than every section carrying its own
 * block of colour with a seam between them. The switch happens while the
 * incoming section is still mostly below the fold, so its copy is never
 * caught mid-fade in a colour it wasn't written for.
 */
export function PageWash() {
  const [tone, setTone] = useState<'paper' | 'brand'>('paper')

  useEffect(() => {
    if (typeof window === 'undefined') return

    // the line the top of a band has to cross to take over the page
    const LINE = 0.72
    let frame = 0

    const pick = () => {
      frame = 0
      const bands = Array.from(
        document.querySelectorAll<HTMLElement>('[data-band]'),
      )
      if (!bands.length) return

      const edge = window.innerHeight * LINE
      let next: 'paper' | 'brand' = 'paper'

      for (const band of bands) {
        const box = band.getBoundingClientRect()
        // the band owns the page from the moment its top crosses the line
        // until its own bottom has gone by
        if (box.top <= edge && box.bottom > 0) {
          next = band.dataset.band === 'brand' ? 'brand' : 'paper'
        }
      }

      setTone((cur) => (cur === next ? cur : next))
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(pick)
    }

    pick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div aria-hidden="true" className="page-wash" data-tone={tone} />
}

export default PageWash
