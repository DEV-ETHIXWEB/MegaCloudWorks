import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { sendContact } from '#/server/contact'
import { cn } from '#/lib/utils'

/**
 * One field, with its label riding above the text once there is anything to
 * label. A placeholder alone is not a label — it is gone the moment you type,
 * which leaves a filled form with no visible names on any of its boxes — so
 * the caption floats up and stays.
 */
function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  inputMode,
  rows,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoComplete?: string
  inputMode?: 'email'
  /** supplied for the one field that is a textarea */
  rows?: number
}) {
  const filled = value.trim().length > 0
  const shared =
    'contact-input peer w-full rounded-2xl border border-[var(--line)] bg-transparent px-5 text-base text-[var(--ink)] outline-none selection:bg-[var(--brand)] selection:text-white sm:text-[15px]'

  return (
    <div className={cn('contact-field-wrap', filled && 'is-filled')}>
      {rows ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          placeholder=" "
          className={cn(
            shared,
            'min-h-[11rem] flex-1 resize-y pb-4 pt-7 sm:min-h-[13rem]',
          )}
        />
      ) : (
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          placeholder=" "
          className={cn(shared, 'h-14 pb-1 pt-5')}
        />
      )}

      <label htmlFor={id} className="contact-label">
        {label}
      </label>

      {/* the focus mark: a red rule that draws itself in from the left along
          the foot of the field, rather than the border simply changing colour */}
      <span aria-hidden="true" className="contact-underline" />
    </div>
  )
}

export function ContactForm({ className }: { className?: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () => sendContact({ data: { name, email, subject, message } }),
    onSuccess: (result) => {
      // the panel itself becomes the acknowledgement; the toast is kept for
      // screen readers and for anyone who has already scrolled past it
      setSent(result.name)
      toast.success(`Thanks, ${result.name}.`, {
        description: "Your message is in, we'll reply within one business day.",
      })
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    },
    onError: (error) => {
      toast.error('Something went wrong', {
        description:
          error instanceof Error
            ? error.message
            : 'Please try again in a moment.',
      })
    },
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (mutation.isPending) return
    mutation.mutate()
  }

  if (sent) {
    return (
      <div
        className={cn(
          'contact-sent flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20',
          className,
        )}
      >
        {/* the smoke off the summit plate, drifting up behind the mark */}
        <span aria-hidden="true" className="contact-sent__plume" />

        <span className="contact-sent__seal relative flex size-16 items-center justify-center rounded-full">
          <svg
            viewBox="0 0 48 48"
            className="size-8"
            fill="none"
            aria-hidden="true"
          >
            <path
              className="contact-sent__tick"
              d="M13 24.5 L21 32.5 L35 16.5"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={100}
            />
          </svg>
        </span>

        <h2 className="contact-sent__line mt-6 font-display text-2xl font-extrabold tracking-tight text-[var(--ink)]">
          Thanks, {sent}.
        </h2>
        <p className="contact-sent__line contact-sent__line--late mt-2 max-w-[26rem] text-[15px] leading-relaxed text-[var(--ink-soft)]">
          Your message is in. A person reads it and replies within one business
          day &mdash; no autoresponder.
        </p>

        <button
          type="button"
          onClick={() => setSent(null)}
          className="contact-sent__line contact-sent__line--late mt-7 text-sm font-semibold text-[var(--ink)] underline-offset-4 transition-colors hover:text-[var(--brand)]"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn('flex flex-col gap-3', className)}
      noValidate
    >
      <Field
        id="contact-name"
        label="Name"
        value={name}
        onChange={setName}
        autoComplete="name"
      />
      <Field
        id="contact-email"
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
      />
      <Field
        id="contact-subject"
        label="Subject"
        value={subject}
        onChange={setSubject}
      />
      <Field
        id="contact-message"
        label="Message"
        value={message}
        onChange={setMessage}
        rows={7}
      />

      <button
        type="submit"
        disabled={mutation.isPending}
        className="cta-diagonal mt-1 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[var(--brand)] text-[15px] font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? 'Sending…' : 'Submit'}
      </button>
    </form>
  )
}

export default ContactForm
