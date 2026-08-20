import { cn } from '#/lib/utils'

import './work-sky.css'

/**
 * The frame behind the Work hero.
 *
 * It used to be a looping cloud clip composited with `multiply` - a decent
 * trick that cost a megabyte of video to say "weather". This says it with the
 * studio's own photograph instead: a monochrome valley, black rock in the near
 * ground, and one red tent with red smoke coming off it.
 *
 * The picture is not decoration. Every other page on the site is derived from
 * it, so the index opening on it is the page saying where its own colour comes
 * from. Three layers do the work and none of them touch the subject: a wedge of
 * paper down the left where the headline sits, a hem at the foot where the
 * picture becomes the page, and one slow ember over the plume.
 *
 * Decorative, SSR-safe, and still under prefers-reduced-motion.
 */
export function WorkSky({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('work-sky', className)}>
      <img
        className="work-sky__plate"
        src="/work/work-bg.webp"
        /* a phone never needs the 1600px plate - it is overscanned and then
           veiled, so the 900px cut is indistinguishable and a third the bytes */
        srcSet="/work/work-bg-900.webp 900w, /work/work-bg.webp 1600w"
        sizes="(max-width: 900px) 100vw, 114vw"
        width={1600}
        height={900}
        alt=""
        /* the hero is the first thing on the route, so this is never lazy */
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      <span className="work-sky__ember" />
      <span className="work-sky__veil" />
      <span className="work-sky__hem" />
    </div>
  )
}

export default WorkSky
