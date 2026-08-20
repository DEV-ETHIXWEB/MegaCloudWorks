import { useEffect } from 'react'
import { motion, stagger, useAnimate, useInView } from 'motion/react'

type Word = { text: string; className?: string }

/**
 * Headline that types itself in, character by character, with a blinking
 * caret — ported from Aceternity UI's Typewriter Effect and retuned for
 * this site: brand-red caret instead of blue, a quicker per-character
 * stagger so a full headline never keeps the reader waiting, and words
 * kept as inline-block units so the line still wraps naturally on mobile
 * (characters never split mid-word).
 *
 * Under prefers-reduced-motion the text is simply present from the start.
 */
export function TypewriterEffect({
  words,
  className = '',
  cursorClassName = '',
}: {
  words: Word[]
  className?: string
  cursorClassName?: string
}) {
  const [scope, animate] = useAnimate()
  const isInView = useInView(scope)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!isInView || reduced) return
    animate(
      'span[data-tw-char]',
      { opacity: 1, transform: 'translateY(0px)' },
      { duration: 0.22, delay: stagger(0.035), ease: 'easeOut' },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView])

  return (
    <span className={`inline ${className}`}>
      <span ref={scope} className="inline">
        {words.map((word, wi) => (
          <span key={`w-${wi}`} className={`inline-block whitespace-nowrap ${word.className ?? ''}`}>
            {word.text.split('').map((char, ci) => (
              <span
                key={`c-${ci}`}
                data-tw-char
                className="inline-block"
                style={reduced ? undefined : { opacity: 0, transform: 'translateY(0.12em)' }}
              >
                {char}
              </span>
            ))}
            {/* a real space *between* words so the line can still break
                there — but never after the last one, or the caret ends up
                floating a word-space away from the final character */}
            {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </span>
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75, repeat: Infinity, repeatType: 'reverse' }}
        className={`ml-[0.12em] inline-block w-[3px] rounded-sm bg-[var(--brand)] align-baseline ${cursorClassName}`}
        style={{ height: '0.72em' }}
      />
    </span>
  )
}
