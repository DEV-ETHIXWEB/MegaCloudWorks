import { createServerFn } from '@tanstack/react-start'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ContactInput = {
  name: string
  email: string
  message: string
}

export type ContactResult = { ok: true; name: string }

/**
 * sendContact — TanStack Start server function backing the Contact form.
 *
 * Validates on the server and (in a real deployment) is where you'd forward
 * the enquiry to your inbox / CRM. For now it acknowledges so the UI has a
 * real end-to-end round-trip.
 */
export const sendContact = createServerFn({ method: 'POST' })
  .validator((input: unknown): ContactInput => {
    if (typeof input !== 'object' || input === null) {
      throw new Error('Something went wrong — please try again.')
    }
    const { name, email, message } = input as Record<string, unknown>

    if (typeof name !== 'string' || name.trim().length < 2) {
      throw new Error('Please enter your name.')
    }
    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
      throw new Error('Please enter a valid email address.')
    }
    if (typeof message !== 'string' || message.trim().length < 10) {
      throw new Error('Please tell us a little about your project.')
    }

    return {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    }
  })
  .handler(async ({ data }): Promise<ContactResult> => {
    // TODO: forward to your inbox / CRM / email provider.
    console.log(
      `[megacloudworks] new enquiry from ${data.name} <${data.email}>: ${data.message}`,
    )
    return { ok: true, name: data.name }
  })
