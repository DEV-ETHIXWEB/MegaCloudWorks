import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle2, Loader2 } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'
type Fields = { name: string; email: string; subject: string; message: string }
type Errors = Partial<Record<keyof Fields, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(f: Fields): Errors {
  const errors: Errors = {}
  if (f.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(f.email.trim())) errors.email = 'Please enter a valid email address.'
  if (f.subject.trim().length < 2) errors.subject = 'Please enter a subject.'
  if (f.message.trim().length < 10) errors.message = 'Please tell us a little about your project.'
  return errors
}

function fieldClasses(hasError: boolean) {
  return [
    'peer w-full rounded-xl border bg-white px-4 pb-2.5 pt-6 text-[15px] text-[var(--ink)] outline-none transition-colors',
    hasError
      ? 'border-[var(--brand)]'
      : 'border-[var(--line)] hover:border-[var(--line-strong)] focus:border-[var(--brand)]',
  ].join(' ')
}

function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  textarea = false,
  autoComplete,
}: {
  id: keyof Fields
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  error?: string
  disabled?: boolean
  textarea?: boolean
  autoComplete?: string
}) {
  const filled = value.length > 0
  const cls = fieldClasses(!!error)
  return (
    <div>
      <div className="relative">
        {textarea ? (
          <textarea
            id={id}
            rows={6}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={`${cls} resize-none disabled:cursor-not-allowed disabled:opacity-60`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            autoComplete={autoComplete}
            inputMode={type === 'email' ? 'email' : undefined}
            className={`${cls} disabled:cursor-not-allowed disabled:opacity-60`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        )}
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 top-4 text-[15px] transition-all peer-focus:text-[var(--brand-text)] ${
            error ? 'text-[var(--brand-text)]' : 'text-[var(--ink-faint)]'
          } ${filled ? '-translate-y-2 scale-[0.72]' : ''}`}
          style={{ transformOrigin: 'left top' }}
        >
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-semibold text-[var(--brand-text)]">
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm() {
  const [fields, setFields] = useState<Fields>({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (k: keyof Fields) => (v: string) => setFields((f) => ({ ...f, [k]: v }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const v = validate(fields)
    setErrors(v)
    if (Object.keys(v).length > 0) return

    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setErrorMsg('Something went wrong sending your message. Please try again or email us directly.')
      setStatus('error')
    }
  }

  const reset = () => {
    setFields({ name: '', email: '', subject: '', message: '' })
    setErrors({})
    setStatus('idle')
  }

  return (
    <div className="surface-lift @container relative overflow-hidden p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-[0_18px_40px_-18px_rgba(245,51,59,0.8)]">
              <CheckCircle2 size={30} />
            </span>
            <h3 className="mt-6 font-sans text-2xl font-extrabold tracking-tight">
              Thanks, {fields.name.split(' ')[0] || 'there'}.
            </h3>
            <p className="mt-2 max-w-xs text-[var(--ink-soft)]">
              Your message is in. A person reads it and replies within one business day, no
              autoresponder.
            </p>
            <button
              type="button"
              onClick={reset}
              className="edge-hard mt-7 flex min-h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-[var(--ink)]"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <fieldset disabled={status === 'loading'} className="space-y-5 border-0 p-0 m-0">
              <div className="grid gap-5 @sm:grid-cols-2">
                <Field id="name" label="Name" value={fields.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                <Field id="email" label="Email" type="email" value={fields.email} onChange={set('email')} error={errors.email} autoComplete="email" />
              </div>
              <Field id="subject" label="Subject" value={fields.subject} onChange={set('subject')} error={errors.subject} />
              <Field id="message" label="Message" value={fields.message} onChange={set('message')} error={errors.message} textarea />
            </fieldset>

            {status === 'error' && (
              <p role="alert" className="rounded-lg bg-[var(--brand-soft)] px-4 py-3 text-sm font-medium text-[var(--brand-text)]">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="edge-hard inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-8 py-4 text-base font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-10"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending…
                </>
              ) : (
                'Submit'
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
