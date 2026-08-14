import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { StepIcon } from './StepIcon'

export type Step = {
  n: string
  icon: 1 | 2 | 3 | 4
  title: string
  desc: string
}

/**
 * One beat of "How we work", set on a timeline: the mark rides the spine down
 * the middle of the section and its copy sits to one side, swapping sides each
 * step so the eye zig-zags down the page.
 *
 * Each row arms itself — the mark only starts working, and the copy only
 * arrives, once that row is the thing you are looking at. Nothing here is on a
 * page-load timer, so the four steps are paced by the scroll rather than
 * racing each other while off screen.
 */
export function StepRow({
  step,
  index,
  onLit,
}: {
  step: Step
  index: number
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

  const flipped = index % 2 === 1

  return (
    <li
      ref={ref}
      data-step
      style={{ '--i': index } as CSSProperties}
      className={`step-row grid grid-cols-1 items-center gap-5 sm:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)] sm:gap-8 ${
        lit ? 'is-lit' : ''
      }`}
    >
      {/* both cells are pinned to row 1: grid auto-placement is sparse, so a
          copy block placed in column 3 would otherwise push the mark that
          follows it in the DOM down into a second row */}
      <div
        className={`step-row__copy order-2 text-center sm:order-none sm:row-start-1 ${
          flipped
            ? 'sm:col-start-3 sm:text-left'
            : 'sm:col-start-1 sm:text-right'
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
            flipped ? 'sm:mx-0' : 'sm:ml-auto sm:mr-0'
          }`}
        >
          {step.desc}
        </p>
      </div>

      <div className="order-1 flex justify-center sm:order-none sm:col-start-2 sm:row-start-1">
        <StepIcon
          step={step.icon}
          className="step-row__icon h-28 w-28 sm:h-32 sm:w-32"
        />
      </div>
    </li>
  )
}

export default StepRow
