import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { StepIcon } from './StepIcon'

export type Step = {
  n: string
  icon: 1 | 2 | 3 | 4
  title: string
  desc: string
}

/** which side of the section this beat sits on */
export type StepSide = 'left' | 'right' | 'center'

/**
 * One beat of "How we work": the mark takes a side of the section and its copy
 * sits beside it, so the route drawn between the marks swings across the page
 * rather than running straight down it. The last beat lands in the middle —
 * the two sides converging on the ship.
 *
 * Each row arms itself — the mark only starts working, and the copy only
 * arrives, once that row is the thing you are looking at. Nothing here is on a
 * page-load timer, so the four steps are paced by the scroll rather than
 * racing each other while off screen.
 */
export function StepRow({
  step,
  index,
  side,
  onLit,
}: {
  step: Step
  index: number
  side: StepSide
  onLit: (index: number) => void
}) {
  const ref = useRef<HTMLLIElement>(null)
  const [lit, setLit] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setLit(true)
      onLit(index)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        // a row the reader has already passed — a reload part-way down the
        // page, a jump to an anchor, a flick of the wheel that skips it —
        // is simply already arrived; it must never be left invisible
        const passed = entries.some((e) => e.boundingClientRect.bottom < 0)
        if (!passed && !entries.some((e) => e.isIntersecting)) return
        setLit(true)
        onLit(index)
        io.disconnect()
      },
      // a third of the row has to be up before it counts as arrived, which
      // on a phone means one step at a time rather than all four at once
      { threshold: 0.34, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [index, onLit])

  const centred = side === 'center'

  return (
    <li
      ref={ref}
      data-step
      data-side={side}
      style={{ '--i': index } as CSSProperties}
      className={`step-row grid grid-cols-1 items-center gap-5 sm:gap-10 ${
        centred
          ? 'sm:grid-cols-1 sm:justify-items-center'
          : 'sm:grid-cols-2 sm:gap-12'
      } ${lit ? 'is-lit' : ''}`}
    >
      {/* on a side row both cells are pinned to row 1: grid auto-placement is
          sparse, so a copy block placed in column 2 would otherwise push the
          mark that follows it in the DOM down into a second row. The centred
          row wants exactly that stacking, so it pins nothing. */}
      <div
        className={`step-row__copy order-2 text-center ${
          centred
            ? ''
            : side === 'left'
              ? 'sm:order-none sm:col-start-2 sm:row-start-1 sm:text-left'
              : 'sm:order-none sm:col-start-1 sm:row-start-1 sm:text-right'
        }`}
      >
        <p className="step-num font-display text-[2.75rem] font-extrabold leading-none tracking-tight text-[var(--brand)] sm:text-[3.25rem]">
          {step.n}
        </p>
        <h3 className="step-copy mt-3 font-display text-xl font-extrabold tracking-tight text-[var(--ink)] sm:text-2xl">
          {step.title}
        </h3>
        <p
          className={`step-copy step-copy--late mx-auto mt-2 max-w-[24rem] text-[15px] leading-relaxed text-[var(--ink-soft)] ${
            centred ? '' : side === 'left' ? 'sm:mx-0' : 'sm:ml-auto sm:mr-0'
          }`}
        >
          {step.desc}
        </p>
      </div>

      <div
        // the centred row keeps the mark above its copy at every width, so the
        // route arriving from 03 lands on the mark rather than being cut off
        // by the type on its way down
        // a side mark is pushed to the outer edge of its column, which — the
        // column being half the page — puts it out at the page's margin
        className={`order-1 flex justify-center ${
          centred
            ? ''
            : side === 'left'
              ? 'sm:order-none sm:col-start-1 sm:row-start-1 sm:justify-start'
              : 'sm:order-none sm:col-start-2 sm:row-start-1 sm:justify-end'
        }`}
      >
        <StepIcon
          step={step.icon}
          className="step-row__icon h-36 w-36 sm:h-48 sm:w-48 lg:h-56 lg:w-56"
        />
      </div>
    </li>
  )
}

export default StepRow
