import { useEffect } from 'react'
import { stagger, useAnimate } from 'motion/react'

/**
 * A line of copy that reveals word by word, each one un-blurring in as it
 * fades in — ported from Aceternity UI's Text Generate Effect. Used
 * sparingly (one short line) so it reads as a considered accent rather than
 * a gimmick applied everywhere.
 */
export function TextGenerateEffect({
  words,
  className = '',
  duration = 0.5,
}: {
  words: string
  className?: string
  duration?: number
}) {
  const [scope, animate] = useAnimate()
  const wordsArray = words.split(' ')
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced) return
    animate('span', { opacity: 1, filter: 'blur(0px)' }, { duration, delay: stagger(0.12) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope])

  return (
    <div ref={scope} className={className}>
      {wordsArray.map((word, i) => (
        <span key={word + i} style={reduced ? undefined : { opacity: 0, filter: 'blur(8px)' }}>
          {word}{' '}
        </span>
      ))}
    </div>
  )
}
