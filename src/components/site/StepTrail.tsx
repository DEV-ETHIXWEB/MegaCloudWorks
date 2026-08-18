import { useCallback, useEffect, useState } from 'react'

/**
 * The dotted route of "How we work": one red trail sweeping between the four
 * marks - which sit left, right, left and centre - so it reads as a path being
 * walked rather than a rule being drawn: the same dashed line that climbs the
 * mountain in the CTA.
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
    // the wrappers, not the icons: an icon mid-reveal is translated and its
    // client rect would put this route's ends wherever the animation had got
    // to. The wrapper shrink-wraps the icon and never moves, so measuring it
    // gives the position the mark actually settles at.
    const icons = Array.from(
      el.querySelectorAll<HTMLElement>('.step-row__mark'),
    )
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

    // One curve per gap - no lead-in above the first mark and no tail below
    // the last, both of which read as loose dotted lines rather than as part
    // of the route.
    //
    // Two shapes, depending on what the gap has to cross. Marks on opposite
    // sides of the section get a plain S: the control points sit directly
    // below the mark it leaves and directly above the one it meets, so the
    // line drops out of one, sweeps across the middle and rises into the
    // other. Marks that share a column would have no curve at all that way,
    // so those lean out to one side instead.
    for (let i = 0; i < marks.length - 1; i += 1) {
      const a = marks[i]
      const b = marks[i + 1]
      const y1 = a.bottom + 12
      const y2 = b.top - 12
      const span = y2 - y1
      const crossing = Math.abs(b.x - a.x) > 40
      const lean = crossing
        ? 0
        : (i % 2 === 0 ? 1 : -1) * Math.min(62, box.width * 0.085)
      const pull = crossing ? 0.62 : 0.46

      next.push(
        `M ${a.x.toFixed(1)} ${y1.toFixed(1)} ` +
          `C ${(a.x + lean).toFixed(1)} ${(y1 + span * pull).toFixed(1)}, ` +
          `${(b.x + lean).toFixed(1)} ${(y2 - span * pull).toFixed(1)}, ` +
          `${b.x.toFixed(1)} ${y2.toFixed(1)}`,
      )
    }

    setSegments(next)
    setSize({ w: box.width, h: box.height })
  }, [scope])

  useEffect(() => {
    measure()

    // the display face swapping in re-wraps the copy and moves every mark
    // below it; without this the route stays aimed at the fallback layout
    let live = true
    void document.fonts.ready.then(() => {
      if (live) measure()
    })

    const el = scope.current
    if (!el || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => {
        live = false
        window.removeEventListener('resize', measure)
      }
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      live = false
      ro.disconnect()
    }
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
      {/* A dotted stroke cannot draw itself - its dash pattern is already
          spoken for - so each segment is revealed through a mask holding a
          solid stroke that does. pathLength normalises every segment to 100
          units, so one dash offset covers curves of any length. */}
      <defs>
        {segments.map((d, i) => (
          <mask
            key={i}
            id={`step-trail-wipe-${i}`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={size.w}
            height={size.h}
          >
            <path
              className={`step-trail__wipe ${active > i + 1 ? 'is-on' : ''}`}
              d={d}
              fill="none"
              stroke="#fff"
              strokeWidth="12"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="100"
            />
          </mask>
        ))}
      </defs>

      {segments.map((d, i) => (
        <path
          key={i}
          // segment i runs from mark i to mark i+1, so it is walked once the
          // mark below it has arrived
          className={`step-trail__seg ${active > i + 1 ? 'is-on' : ''}`}
          d={d}
          mask={`url(#step-trail-wipe-${i})`}
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
