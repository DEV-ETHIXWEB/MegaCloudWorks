import { createServerFn } from '@tanstack/react-start'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type SubscribeResult = { ok: true; email: string }

/**
 * subscribe — TanStack Start server function backing the "Notify me" form.
 *
 * Validates the email on the server and (in a real deployment) is where you'd
 * persist it / hand it to your ESP. For now it just acknowledges so the UI has
 * a real end-to-end round-trip to react to.
 */
export const subscribe = createServerFn({ method: 'POST' })
  .validator((email: unknown): string => {
    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
      throw new Error('Please enter a valid email address.')
    }
    return email.trim().toLowerCase()
  })
  .handler(async ({ data: email }): Promise<SubscribeResult> => {
    // TODO: persist to a store / forward to your email provider.
    console.log(`[megacloudworks] new signup: ${email}`)
    return { ok: true, email }
  })
