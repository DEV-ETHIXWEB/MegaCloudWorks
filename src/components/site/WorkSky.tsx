import { useEffect, useRef } from 'react'
import { cn } from '#/lib/utils'

/**
 * The drifting cloud bank behind the Work hero.
 *
 * It is one looping clip rather than a field of stills, so the movement is the
 * clip's own and nothing has to be faked in CSS. Three things are done to it:
 *
 *  - The source is white-backed, so it is composited with `multiply`: white
 *    drops out against the paper and only the pink survives. No alpha channel
 *    and no matte needed.
 *  - It plays /clouds-loop.mp4, which is video-cloud.mp4 with its bottom-right
 *    corner cropped away — that corner carried the generator's watermark, and
 *    cropping the file is the only way to be sure of it at every viewport.
 *  - It resolves out of haze over about two seconds on arrival, then is left
 *    alone; the drift after that is the footage.
 *
 * Decorative, SSR-safe, and paused under prefers-reduced-motion — the first
 * frame stays as a still.
 */
export function WorkSky({ className }: { className?: string }) {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = video.current
    if (!el || typeof window === 'undefined') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.pause()
      return
    }
    // autoplay is rejected on some setups until the page is interacted with;
    // a still cloud bank is a perfectly acceptable fallback
    void el.play().catch(() => {})
  }, [])

  return (
    <div aria-hidden="true" className={cn('work-sky', className)}>
      <video
        ref={video}
        className="work-sky__video"
        src="/clouds-loop.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
      />
      {/* the bank dissolves into the paper instead of ending on a line */}
      <span className="work-sky__fade" />
    </div>
  )
}

export default WorkSky
