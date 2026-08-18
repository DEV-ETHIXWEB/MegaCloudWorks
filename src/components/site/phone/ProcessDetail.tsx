import { Check } from 'lucide-react'
import { STEPS } from './process'

/**
 * The full account of whichever step the phone is showing. The device carries
 * the summary; this carries the argument - icon, the weeks it takes, the long
 * form, and what you actually get out of it.
 *
 * Only the active step is mounted so the entrance animation replays on every
 * change; `key` on the card is what makes React treat each step as a new node.
 */
export function ProcessDetail({ active }: { active: number }) {
  const step = STEPS[Math.min(active, STEPS.length - 1)]
  const Icon = step.icon

  return (
    <div className="detail">
      <ol className="detail__ticks" aria-hidden="true">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={
              i === active ? 'is-active' : i < active ? 'is-done' : undefined
            }
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
          </li>
        ))}
      </ol>

      <div className="detail__card" key={step.title}>
        <div className="detail__top">
          <span className="detail__icon">
            <Icon size={26} strokeWidth={2} />
          </span>
          <span className="detail__meta">{step.meta}</span>
        </div>

        <h3 className="detail__title">{step.title}</h3>
        <p className="detail__body">{step.detail}</p>

        <ul className="detail__points">
          {step.points.map((point, i) => (
            <li key={point} style={{ '--i': i } as React.CSSProperties}>
              <Check size={14} strokeWidth={3} />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProcessDetail
