import { useCallback, useEffect, useState } from 'react'

/**
 * The dotted spine of "How we work": a single red route running down the
 * middle of the section, bulging left and right between the marks so it reads
 * as a trail being walked rather than a rule being drawn — the same dashed
 * line that climbs the mountain in the CTA.
 *
 * The geometry is measured from the marks themselves, so it survives a
 * reflow, a font swap or a resize, and each length is a separate path: a
 * segment only appears once the step below it has arrived, which keeps the
 * route tied to the scroll instead of to a timer.
 */
export function StepTrail({
  scope,
  active,
}: {
  /** the list holding the rows; the spine is positioned against it */
  scope: React.RefObject<HTMLElement | null>
  /** how many rows have arrived so far */
  active: number
}) {
  const [segments, setSegments] = useState<Array<string>>([])
  const [size, setSize] = useState({ w: 0, h: 0 })

  const measure = useCallback(() => {
    const el = scope.current
    if (!el) return

    const box = el.getBoundingClientRect()
    const icons = Array.from(el.querySelectorAll<SVGSVGElement>('.step-icon'))
    if (icons.length < 2) return

    const marks = icons.map((icon) => {
      const r = icon.getBoundingClientRect()
      return {
        x: r.left - box.left + r.width / 2,
        top: r.top - box.top,
        bottom: r.bottom - box.top,
      }
    })

    const next: Array<string> = []

    // One lean per gap, alternating sides — no lead-in above the first mark
    // and no tail below the last, both of which read as loose dotted lines
    // rather than as part of the route. The control points sit near the ends
    // of each run, so the line leaves and arrives straight down the spine and
    // only bends in the middle: one curve, not three.
    for (let i = 0; i < marks.length - 1; i += 1) {
      const a = marks[i]
      const b = marks[i + 1]
      const lean = (i % 2 === 0 ? 1 : -1) * Math.min(62, box.width * 0.085)
      const y1 = a.bottom + 10
      const y2 = b.top - 10
      const span = y2 - y1

      next.push(
        `M ${a.x.toFixed(1)} ${y1.toFixed(1)} ` +
          `C ${(a.x + lean).toFixed(1)} ${(y1 + span * 0.46).toFixed(1)}, ` +
          `${(b.x + lean).toFixed(1)} ${(y2 - span * 0.46).toFixed(1)}, ` +
          `${b.x.toFixed(1)} ${y2.toFixed(1)}`,
      )
    }

    setSegments(next)
    setSize({ w: box.width, h: box.height })
  }, [scope])

  useEffect(() => {
    measure()
    const el = scope.current
    if (!el || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure, scope])

  if (!segments.length) return null

  return (
    <svg
      aria-hidden="true"
      className="step-trail"
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      fill="none"
    >
      {segments.map((d, i) => (
        <path
          key={i}
          // segment i runs from mark i to mark i+1, so it is walked once the
          // mark below it has arrived
          className={`step-trail__seg ${active > i + 1 ? 'is-on' : ''}`}
          d={d}
          stroke="var(--brand)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="7 9"
        />
      ))}
    </svg>
  )
}

export default StepTrail
