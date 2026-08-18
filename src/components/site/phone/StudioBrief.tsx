import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { sendContact } from '#/server/contact'
import { cn } from '#/lib/utils'

const SERVICES = [
  'App design',
  'App development',
  'Brand & UI system',
  'Rescue an existing app',
] as const

const BUDGETS = ['Under $10k', '$10k - $25k', '$25k - $60k', '$60k+'] as const

const TIMELINES = ['ASAP', 'Next quarter', 'Just exploring'] as const

/** One chip in the brief. Chips are the whole point of the first step: nobody
 *  types a budget into a free-text box, but everybody will tap a range. */
function Chip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn('brief__chip', selected && 'is-on')}
    >
      {selected ? <Check size={13} strokeWidth={3.2} /> : null}
      {label}
    </button>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  inputMode,
  rows,
  optional,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoComplete?: string
  inputMode?: 'email'
  rows?: number
  optional?: boolean
}) {
  const filled = value.trim().length > 0
  const shared =
    'contact-input peer w-full rounded-2xl border border-[var(--line)] bg-white px-5 text-base text-[var(--ink)] outline-none selection:bg-[var(--brand)] selection:text-white sm:text-[15px]'

  return (
    <div className={cn('contact-field-wrap', filled && 'is-filled')}>
      {rows ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={!optional}
          placeholder=" "
          className={cn(shared, 'min-h-[7.5rem] flex-1 resize-y pb-4 pt-7')}
        />
      ) : (
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={!optional}
          placeholder=" "
          className={cn(shared, 'h-14 pb-1 pt-5')}
        />
      )}
      <label htmlFor={id} className="contact-label">
        {label}
        {optional ? <span className="brief__opt"> - optional</span> : null}
      </label>
      <span aria-hidden="true" className="contact-underline" />
    </div>
  )
}

/**
 * The studio brief - the enquiry form the expanded panel carries.
 *
 * It asks more than the plain contact form does, but almost all of it is taps:
 * what you want, roughly what you can spend, roughly when. Those three answers
 * are what decide whether we are the right studio for the job, and asking for
 * them here saves the two emails it would otherwise take to find out.
 *
 * Nothing but name, email and a description is actually required - the chips
 * are there for people who want to be precise, not a gate for people who don't.
 */
export function StudioBrief({ className }: { className?: string }) {
  const [services, setServices] = useState<Array<string>>([])
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState<string | null>(null)

  const toggle = (value: string) =>
    setServices((current) =>
      current.includes(value)
        ? current.filter((s) => s !== value)
        : [...current, value],
    )

  // a live sense of how much of the brief is filled in, so the form reads as
  // something being completed rather than a wall of empty boxes
  const filled = useMemo(() => {
    const checks = [
      services.length > 0,
      Boolean(budget),
      Boolean(timeline),
      name.trim().length > 1,
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
      message.trim().length > 9,
    ]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
  }, [services, budget, timeline, name, email, message])

  const mutation = useMutation({
    mutationFn: () =>
      sendContact({
        data: {
          name,
          email,
          subject: services.length ? services.join(' + ') : 'New enquiry',
          message,
          company,
          services,
          budget,
          timeline,
        },
      }),
    onSuccess: (result) => {
      setSent(result.name)
      toast.success(`Thanks, ${result.name}.`, {
        description: "Your brief is in, we'll reply within one business day.",
      })
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
      <div className={cn('brief brief--sent', className)}>
        <span className="brief__seal">
          <Check size={26} strokeWidth={3} />
        </span>
        <h3 className="brief__sent-title">Thanks, {sent}.</h3>
        <p className="brief__sent-body">
          Your brief is in. A person reads it and replies within one business
          day - no autoresponder, no sequence.
        </p>
        <button
          type="button"
          className="brief__again"
          onClick={() => {
            setSent(null)
            setServices([])
            setBudget('')
            setTimeline('')
            setName('')
            setEmail('')
            setCompany('')
            setMessage('')
          }}
        >
          Send another brief
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className={cn('brief', className)} noValidate>
      <header className="brief__head">
        <div>
          <p className="brief__step">Start a project</p>
          <h3 className="brief__title">Tell us the shape of it</h3>
        </div>
        <span className="brief__gauge" aria-hidden="true">
          <span style={{ width: `${filled}%` }} />
        </span>
      </header>

      <fieldset className="brief__set">
        <legend>What do you need?</legend>
        <div className="brief__chips">
          {SERVICES.map((s) => (
            <Chip
              key={s}
              label={s}
              selected={services.includes(s)}
              onClick={() => toggle(s)}
            />
          ))}
        </div>
      </fieldset>

      <div className="brief__pair">
        <fieldset className="brief__set">
          <legend>Budget</legend>
          <div className="brief__chips">
            {BUDGETS.map((b) => (
              <Chip
                key={b}
                label={b}
                selected={budget === b}
                onClick={() => setBudget(budget === b ? '' : b)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="brief__set">
          <legend>Timeline</legend>
          <div className="brief__chips">
            {TIMELINES.map((t) => (
              <Chip
                key={t}
                label={t}
                selected={timeline === t}
                onClick={() => setTimeline(timeline === t ? '' : t)}
              />
            ))}
          </div>
        </fieldset>
      </div>

      <div className="brief__fields">
        <div className="brief__row">
          <Field
            id="brief-name"
            label="Name"
            value={name}
            onChange={setName}
            autoComplete="name"
          />
          <Field
            id="brief-company"
            label="Company"
            value={company}
            onChange={setCompany}
            autoComplete="organization"
            optional
          />
        </div>
        <Field
          id="brief-email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <Field
          id="brief-message"
          label="What are you building?"
          value={message}
          onChange={setMessage}
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="brief__send"
      >
        {mutation.isPending ? (
          <>
            <Loader2 size={17} className="brief__spin" strokeWidth={2.6} />
            Sending…
          </>
        ) : (
          <>
            Send the brief
            <ArrowRight size={17} strokeWidth={2.6} />
          </>
        )}
      </button>

      <p className="brief__note">
        Replies come from a person, within one business day.
      </p>
    </form>
  )
}

export default StudioBrief
