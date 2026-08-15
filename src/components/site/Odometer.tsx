/**
 * A number that rolls up to its value like a counter on a dial.
 *
 * Each digit is a column of 0–9 repeated three times; landing on the third
 * copy means the column spins twice before it settles, which is what makes it
 * read as a mechanism rather than a slide. Later digits are held back a beat
 * so the number resolves left to right.
 *
 * There is no JavaScript in the animation at all: the roll is a transform that
 * fires when an ancestor gains `data-shown`, so it rides the page's own reveal
 * system and inherits its reduced-motion behaviour.
 */
export function Odometer({
  value,
  pad = 2,
  className = '',
}: {
  value: number
  /** minimum number of digits, zero-filled */
  pad?: number
  className?: string
}) {
  const digits = String(value).padStart(pad, '0').split('')

  return (
    <span className={`odo ${className}`} role="text" aria-label={String(value)}>
      {digits.map((d, i) => (
        <span key={i} aria-hidden="true" className="odo__slot">
          <span
            className="odo__col"
            style={
              {
                '--d': Number(d),
                '--i': i,
              } as React.CSSProperties
            }
          >
            {/* three passes of 0–9: the column lands on the last one */}
            {Array.from({ length: 30 }, (_, n) => (
              <i key={n}>{n % 10}</i>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}

export default Odometer
