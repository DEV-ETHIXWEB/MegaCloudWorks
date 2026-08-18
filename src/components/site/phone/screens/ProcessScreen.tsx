import { ScreenShell, StatusBar } from './ScreenShell'
import { STEPS } from '../process'

/**
 * Act three, on the device. The display becomes the studio's process and the
 * active step follows the scroll - the phone is standing in for the product
 * being built. Tapping a step drives the scroll to it, so the list is a control
 * rather than a picture of one.
 */
export function ProcessScreen({
  active,
  onSelect,
}: {
  active: number
  onSelect?: (index: number) => void
}) {
  const progress = ((active + 1) / STEPS.length) * 100

  return (
    <ScreenShell className="proc">
      <div className="proc__body">
        <StatusBar />

        <header className="proc__head">
          <p className="proc__eyebrow">How we work</p>
          <h2 className="proc__title">Four steps, no surprises</h2>
          <div className="proc__meter">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="proc__count">
            {String(active + 1).padStart(2, '0')} /{' '}
            {String(STEPS.length).padStart(2, '0')}
          </p>
        </header>

        <ol className="proc__list">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            const state =
              i === active ? 'is-active' : i < active ? 'is-done' : ''
            return (
              <li key={step.title} className={`proc__item ${state}`.trim()}>
                <button type="button" onClick={() => onSelect?.(i)}>
                  <span className="proc__icon">
                    <Icon size={17} strokeWidth={2.2} />
                  </span>
                  <span className="proc__text">
                    <span className="proc__row">
                      <strong>{step.title}</strong>
                      <em>{step.meta}</em>
                    </span>
                    <span className="proc__blurb">{step.blurb}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="proc__foot">
          <span className="proc__dot" />
          Building live - keep scrolling
        </div>
      </div>
    </ScreenShell>
  )
}

export default ProcessScreen
