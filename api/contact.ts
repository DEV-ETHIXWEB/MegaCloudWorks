export const config = { runtime: 'edge' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  let body: { name?: string; email?: string; subject?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 })
  }

  const name = (body.name ?? '').trim()
  const email = (body.email ?? '').trim()
  const subject = (body.subject ?? '').trim()
  const message = (body.message ?? '').trim()

  if (name.length < 2 || !EMAIL_RE.test(email) || subject.length < 2 || message.length < 10) {
    return new Response(JSON.stringify({ error: 'Invalid form data' }), { status: 400 })
  }

  const apiKey = process.env.SMTP2GO_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL
  const fromEmail = process.env.CONTACT_FROM_EMAIL
  if (!apiKey || !toEmail || !fromEmail) {
    console.error('Missing SMTP2GO_API_KEY, CONTACT_TO_EMAIL, or CONTACT_FROM_EMAIL')
    return new Response(JSON.stringify({ error: 'Server is not configured to send email' }), { status: 500 })
  }

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
  `

  try {
    const res = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        to: [toEmail],
        sender: fromEmail,
        reply_to: email,
        subject: `New contact form message: ${subject}`,
        html_body: html,
        text_body: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      }),
    })

    const data = (await res.json()) as { data?: { succeeded?: number } }
    if (!res.ok || !data?.data?.succeeded) {
      console.error('SMTP2GO send failed', res.status, data)
      return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 502 })
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    console.error('SMTP2GO request error', err)
    return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 502 })
  }
}
