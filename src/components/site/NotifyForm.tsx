import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { subscribe } from '#/server/subscribe'

export function NotifyForm() {
  const [email, setEmail] = useState('')

  const mutation = useMutation({
    mutationFn: (value: string) => subscribe({ data: value }),
    onSuccess: (result) => {
      toast.success("You're on the list.", {
        description: `We'll email ${result.email} the moment we launch.`,
      })
      setEmail('')
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
    mutation.mutate(email)
  }

  return (
    <div id="notify">
      <form
        onSubmit={onSubmit}
        className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
        noValidate
      >
        <Input
          id="notify-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@email.com"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="sm:h-12"
          required
        />
        <Button
          type="submit"
          size="lg"
          disabled={mutation.isPending}
          className="shrink-0"
        >
          {mutation.isPending ? 'Adding…' : 'Notify me'}
        </Button>
      </form>

      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        Or say hello —{' '}
        <a
          href="mailto:hello@megacloudworks.com"
          className="font-semibold text-[var(--ink)] underline decoration-[var(--brand)] decoration-2 underline-offset-2 hover:text-[var(--brand)]"
        >
          hello@megacloudworks.com
        </a>
      </p>
    </div>
  )
}

export default NotifyForm
