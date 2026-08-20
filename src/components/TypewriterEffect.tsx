import { Fragment, useEffect } from 'react'
import { motion, stagger, useAnimate, useInView } from 'motion/react'

type Word = { text: string; className?: string }

/**
 * Headline that types itself in, character by character, with a blinking
 * caret, ported from Aceternity UI's Typewriter Effect and retuned for
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
  startDelay = 0,
}: {
  words: Word[]
  className?: string
  cursorClassName?: string
  /** hold before the first character lands, so this can follow a static line */
  startDelay?: number
}) {
  const [scope, animate] = useAnimate()
  const isInView = useInView(scope)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!isInView || reduced) return
    // each character resolves out of a soft blur rather than just popping
    // in; the same blur-fade the homepage hero uses, so the reveal reads
    // as part of the site's motion language instead of a literal typewriter
    animate(
      'span[data-tw-char]',
      { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' },
      { duration: 0.34, delay: stagger(0.035, { startDelay }), ease: [0.22, 1, 0.36, 1] },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView])

  return (
    <span className={`inline ${className}`}>
      <span ref={scope} className="inline">
        {words.map((word, wi) => (
          <Fragment key={`w-${wi}`}>
            {/* `inline`, not `inline-block`: an inline-block word is an
                atomic box that text-wrap:balance cannot measure into, which
                left headlines breaking greedily and stranding the last word
                alone. whitespace-nowrap keeps each word's characters
                together so nothing breaks mid-word. */}
            <span className={`inline whitespace-nowrap ${word.className ?? ''}`}>
              {word.text.split('').map((char, ci) => (
                <span
                  key={`c-${ci}`}
                  data-tw-char
                  className="inline-block"
                  style={reduced ? undefined : { opacity: 0, filter: 'blur(6px)', transform: 'translateY(0.14em)' }}
                >
                  {char}
                </span>
              ))}
            </span>
            {/* the separator sits OUTSIDE the nowrap span on purpose: put
                it inside and it inherits nowrap, which removes the only
                break opportunity between words and pushes the whole line
                off the edge of the screen. */}
            {wi < words.length - 1 && ' '}
          </Fragment>
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
