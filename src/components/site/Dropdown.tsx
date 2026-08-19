import { useEffect, useId, useRef, useState } from 'react'

import './dropdown.css'

/**
 * A select the site can style.
 *
 * A native `<select>` renders its list with the operating system, which
 * is why the one control on the page that could not be made to match the
 * rest was the only one that mattered. This is the standard listbox
 * pattern instead: a button that owns the value, a list that opens under
 * it, and the keyboard behaviour people expect - arrows to move, Enter
 * or Space to take, Escape to leave, Tab or a click outside to dismiss.
 */
export function Dropdown({
  label,
  value,
  placeholder,
  options,
  onChange,
  icon,
}: {
  label: string
  value: string
  placeholder: string
  options: ReadonlyArray<string>
  onChange: (value: string) => void
  /** shown at the right of the button in place of the chevron */
  icon?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrap = useRef<HTMLDivElement>(null)
  const id = useId()

  // pointing anywhere else, or pressing Escape, closes it
  useEffect(() => {
    if (!open) return

    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const take = (option: string) => {
    onChange(option)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActive((i) => (i + step + options.length) % options.length)
      return
    }
    if (open && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      take(options[active])
    }
  }

  return (
    <div className="dd" ref={wrap}>
      <span className="dd__label" id={`${id}-label`}>
        {label}
      </span>

      <button
        type="button"
        className="dd__button"
        data-open={open ? 'true' : undefined}
        data-empty={value ? undefined : 'true'}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        onClick={() => {
          setOpen((o) => !o)
          setActive(Math.max(0, options.indexOf(value)))
        }}
        onKeyDown={onKeyDown}
      >
        <span className="dd__value">{value || placeholder}</span>
        <span className="dd__icon">
          {icon ?? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m6 9.5 6 6 6-6" />
            </svg>
          )}
        </span>
      </button>

      {open ? (
        <ul className="dd__list" role="listbox" aria-labelledby={`${id}-label`}>
          {options.map((option, i) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={option === value}
                className="dd__option"
                data-active={i === active ? 'true' : undefined}
                data-on={option === value ? 'true' : undefined}
                onPointerEnter={() => setActive(i)}
                onClick={() => take(option)}
              >
                {option}
                {option === value ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="m4 12.5 5 5L20 6.5" />
                  </svg>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default Dropdown
