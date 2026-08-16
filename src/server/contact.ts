import { createServerFn } from '@tanstack/react-start'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ContactInput = {
  name: string
  email: string
  subject: string
  message: string
  /** optional brief, sent by the home-page studio brief but not by /contact */
  company?: string
  services?: Array<string>
  budget?: string
  timeline?: string
}

/** Free text we accept alongside an enquiry, capped so nothing unbounded lands. */
const shortText = (value: unknown, max = 120) =>
  typeof value === 'string' && value.trim()
    ? value.trim().slice(0, max)
    : undefined

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
    const {
      name,
      email,
      subject,
      message,
      company,
      services,
      budget,
      timeline,
    } = input as Record<string, unknown>

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
      company: shortText(company),
      // the brief's chips are a fixed set in the UI, but nothing stops a
      // handcrafted request, so the list is length- and size-capped here
      services: Array.isArray(services)
        ? services
            .filter((s): s is string => typeof s === 'string')
            .slice(0, 8)
            .map((s) => s.trim().slice(0, 60))
            .filter(Boolean)
        : undefined,
      budget: shortText(budget, 60),
      timeline: shortText(timeline, 60),
    }
  })
  .handler(async ({ data }): Promise<ContactResult> => {
    // TODO(production): this only logs — enquiries are not persisted or
    // delivered anywhere yet. Before launch, replace this block with a call
    // to an email provider (e.g. Resend, Postmark) or CRM webhook using an
    // API key read from an environment variable (e.g. RESEND_API_KEY),
    // never hardcoded here. `data` is already validated at this point.
    const brief = [
      data.company && `company: ${data.company}`,
      data.services?.length && `wants: ${data.services.join(', ')}`,
      data.budget && `budget: ${data.budget}`,
      data.timeline && `timeline: ${data.timeline}`,
    ]
      .filter(Boolean)
      .join(' · ')

    console.log(
      `[megacloudworks] new enquiry from ${data.name} <${data.email}> · ${data.subject}: ${data.message}${
        brief ? ` — ${brief}` : ''
      }`,
    )
    return { ok: true, name: data.name }
  })
