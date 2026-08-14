import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { sendContact } from '#/server/contact'
import { cn } from '#/lib/utils'

const fieldLabel =
  'mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]'

export function ContactForm({ className }: { className?: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const mutation = useMutation({
    mutationFn: () => sendContact({ data: { name, email, subject, message } }),
    onSuccess: (result) => {
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

  return (
    <form
      onSubmit={onSubmit}
      className={cn('flex flex-col gap-5', className)}
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={fieldLabel}>
            Your name
          </label>
          <Input
            id="contact-name"
            autoComplete="name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={fieldLabel}>
            Email
          </label>
          <Input
            id="contact-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className={fieldLabel}>
          Subject
        </label>
        <Input
          id="contact-subject"
          placeholder="What's this about?"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-1 flex-col">
        <label htmlFor="contact-message" className={fieldLabel}>
          About your project
        </label>
        <textarea
          id="contact-message"
          rows={6}
          placeholder="What are you building, and where are you today?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="min-h-[10rem] w-full flex-1 resize-y rounded-2xl border border-[var(--line-strong)] bg-[var(--paper)] px-5 py-3.5 text-base sm:min-h-[12rem] sm:text-sm text-[var(--ink)] shadow-sm outline-none transition-[color,box-shadow] placeholder:text-[var(--ink-faint)] selection:bg-[var(--brand)] selection:text-white focus-visible:border-[var(--brand)] focus-visible:ring-[3px] focus-visible:ring-[var(--brand-soft)]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={mutation.isPending}
          className="w-full sm:w-auto"
        >
          {mutation.isPending ? 'Sending…' : 'Send message'}
        </Button>
        <p className="text-sm text-[var(--ink-soft)]">
          Prefer email?{' '}
          <a
            href="mailto:hello@megacloudworks.com"
            className="font-semibold text-[var(--ink)] no-underline hover:text-[var(--brand)]"
          >
            hello@megacloudworks.com
          </a>
        </p>
      </div>
    </form>
  )
}

export default ContactForm
