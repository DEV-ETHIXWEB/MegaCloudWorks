import { createServerFn } from '@tanstack/react-start'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ContactInput = {
  name: string
  email: string
  subject: string
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
      throw new Error('Something went wrong, please try again.')
    }
    const { name, email, subject, message } = input as Record<string, unknown>

    if (typeof name !== 'string' || name.trim().length < 2) {
      throw new Error('Please enter your name.')
    }
    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
      throw new Error('Please enter a valid email address.')
    }
    if (typeof subject !== 'string' || subject.trim().length < 2) {
      throw new Error('Please enter a subject.')
    }
    if (typeof message !== 'string' || message.trim().length < 10) {
      throw new Error('Please tell us a little about your project.')
    }

    return {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    }
  })
  .handler(async ({ data }): Promise<ContactResult> => {
    // TODO(production): this only logs — enquiries are not persisted or
    // delivered anywhere yet. Before launch, replace this block with a call
    // to an email provider (e.g. Resend, Postmark) or CRM webhook using an
    // API key read from an environment variable (e.g. RESEND_API_KEY),
    // never hardcoded here. `data` is already validated at this point.
    console.log(
      `[megacloudworks] new enquiry from ${data.name} <${data.email}> · ${data.subject}: ${data.message}`,
    )
    return { ok: true, name: data.name }
  })
