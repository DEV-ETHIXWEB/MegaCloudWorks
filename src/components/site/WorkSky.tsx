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
        src="/work/work-bg.jpeg"
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
