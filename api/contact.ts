export const config = { runtime: 'edge' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SITE_URL = 'https://www.megacloudworks.com/'

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

/** Fires one SMTP2GO send and reports whether SMTP2GO actually accepted it
 *  (checks the real per-message accept count, not just HTTP 200). */
async function sendViaSmtp2go(
  apiKey: string,
  payload: { to: string[]; sender: string; reply_to?: string; subject: string; html_body: string; text_body: string },
): Promise<{ ok: true } | { ok: false; status: number; data: unknown }> {
  const res = await fetch('https://api.smtp2go.com/v3/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ api_key: apiKey, ...payload }),
  })
  const data = (await res.json()) as { data?: { succeeded?: number } }
  if (!res.ok || !data?.data?.succeeded) {
    return { ok: false, status: res.status, data }
  }
  return { ok: true }
}

/* ------------------------------------------------------------------ *
 * Email template
 *
 * Table-based HTML so it renders consistently in Outlook desktop (which
 * uses Word's rendering engine and ignores most modern CSS/flexbox), Gmail,
 * and Apple Mail alike. No external assets: the wordmark is styled text,
 * not an image, so there is nothing that can fail to load. Every color
 * below is the site's own brand token, inlined, since email clients strip
 * <style> blocks and CSS custom properties unpredictably.
 * ------------------------------------------------------------------ */

const BRAND = '#f5333b'
const INK = '#101014'
const INK_SOFT = '#56575f'
const INK_FAINT = '#63646a'
const PAPER = '#ffffff'
const PAPER_2 = '#f7f7f8'
const LINE = '#e6e6e9'

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

function wordmark() {
  // the site's own header lockup (cloud mark + wordmark, one image), rasterized
  // from public/logo-resized.svg — SVG has unreliable support in Outlook
  // desktop, so email uses a PNG export of the exact same artwork instead
  return `<img src="${SITE_URL}logo-email.png" width="170" height="23" alt="MegaCloudWorks" style="display:block;width:170px;height:23px;">`
}

function emailShell(opts: { preheader: string; body: string }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>MegaCloudWorks</title>
</head>
<body style="margin:0;padding:0;background-color:${PAPER_2};font-family:${FONT_STACK};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(opts.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAPER_2};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:${PAPER};border:1px solid ${LINE};border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px;border-bottom:1px solid ${LINE};">
              ${wordmark()}
            </td>
          </tr>
          ${opts.body}
          <tr>
            <td style="padding:24px 32px;background-color:${PAPER_2};border-top:1px solid ${LINE};">
              <p style="margin:0;font-family:${FONT_STACK};font-size:13px;font-weight:700;color:${INK};">MegaCloudWorks</p>
              <p style="margin:4px 0 0;font-family:${FONT_STACK};font-size:12px;color:${INK_FAINT};">
                <a href="mailto:hello@megacloudworks.com" style="color:${INK_FAINT};text-decoration:none;">hello@megacloudworks.com</a>
                &nbsp;&middot;&nbsp;
                <a href="${SITE_URL}" style="color:${INK_FAINT};text-decoration:none;">megacloudworks.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function infoRow(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${LINE};">
      <p style="margin:0 0 2px;font-family:${FONT_STACK};font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${INK_FAINT};">${label}</p>
      <p style="margin:0;font-family:${FONT_STACK};font-size:14px;color:${INK};word-break:break-word;">${value}</p>
    </td>
  </tr>`
}

function buildLeadEmailHtml(name: string, email: string, subject: string, message: string) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')

  const body = `
    <tr>
      <td style="padding:32px;">
        <p style="margin:0 0 8px;font-family:${FONT_STACK};font-size:11px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND};">New website inquiry</p>
        <h1 style="margin:0 0 12px;font-family:${FONT_STACK};font-size:22px;font-weight:800;letter-spacing:-0.02em;color:${INK};">New contact form submission</h1>
        <p style="margin:0 0 24px;font-family:${FONT_STACK};font-size:14px;line-height:1.6;color:${INK_SOFT};">A new inquiry has been submitted through the MegaCloudWorks website.</p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAPER_2};border:1px solid ${LINE};border-radius:12px;padding:16px 20px;margin:0 0 20px;">
          ${infoRow('Name', safeName)}
          ${infoRow('Email', safeEmail)}
          ${infoRow('Subject', safeSubject)}
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAPER};border:1px solid ${LINE};border-radius:12px;padding:16px 20px;margin:0 0 24px;">
          <tr>
            <td>
              <p style="margin:0 0 8px;font-family:${FONT_STACK};font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${INK_FAINT};">Message</p>
              <p style="margin:0;font-family:${FONT_STACK};font-size:14px;line-height:1.65;color:${INK};">${safeMessage}</p>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="border-radius:10px;background-color:${BRAND};">
              <a href="mailto:${encodeURIComponent(email)}" style="display:inline-block;padding:12px 22px;font-family:${FONT_STACK};font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;">Reply to ${safeName}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 28px;">
        <p style="margin:0;font-family:${FONT_STACK};font-size:12px;color:${INK_FAINT};">This message was generated from the MegaCloudWorks website contact form.</p>
      </td>
    </tr>`

  return emailShell({ preheader: `A new contact form submission has been received from ${name}.`, body })
}

function buildLeadEmailText(name: string, email: string, subject: string, message: string) {
  return `New website inquiry\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nReply directly to this email to respond to ${name}.\nThis message was generated from the MegaCloudWorks website contact form.`
}

function buildConfirmationEmailHtml(name: string, subject: string, message: string) {
  const firstName = name.split(' ')[0] || 'there'
  const safeFirstName = escapeHtml(firstName)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')

  const body = `
    <tr>
      <td style="padding:32px;">
        <p style="margin:0 0 8px;font-family:${FONT_STACK};font-size:11px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND};">Message received</p>
        <h1 style="margin:0 0 12px;font-family:${FONT_STACK};font-size:22px;font-weight:800;letter-spacing:-0.02em;color:${INK};">Thanks for reaching out, ${safeFirstName}.</h1>
        <p style="margin:0 0 24px;font-family:${FONT_STACK};font-size:14px;line-height:1.65;color:${INK_SOFT};">
          Thank you for contacting MegaCloudWorks. We've successfully received your message and our team will review it shortly.
          Someone from our team will get back to you as soon as possible.
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAPER_2};border:1px solid ${LINE};border-radius:12px;padding:16px 20px;margin:0 0 24px;">
          <tr>
            <td style="padding-bottom:12px;border-bottom:1px solid ${LINE};">
              <p style="margin:0 0 2px;font-family:${FONT_STACK};font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${INK_FAINT};">Subject</p>
              <p style="margin:0;font-family:${FONT_STACK};font-size:14px;color:${INK};">${safeSubject}</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:12px;">
              <p style="margin:0 0 2px;font-family:${FONT_STACK};font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${INK_FAINT};">Message</p>
              <p style="margin:0;font-family:${FONT_STACK};font-size:14px;line-height:1.65;color:${INK};">${safeMessage}</p>
            </td>
          </tr>
        </table>

        <p style="margin:0 0 24px;font-family:${FONT_STACK};font-size:14px;line-height:1.65;color:${INK_SOFT};">We appreciate you getting in touch and look forward to speaking with you.</p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="border-radius:10px;background-color:${INK};">
              <a href="${SITE_URL}" style="display:inline-block;padding:12px 22px;font-family:${FONT_STACK};font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;">Visit MegaCloudWorks</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 28px;">
        <p style="margin:0;font-family:${FONT_STACK};font-size:12px;color:${INK_FAINT};">You received this email because you submitted the contact form on the MegaCloudWorks website.</p>
      </td>
    </tr>`

  return emailShell({ preheader: "Thanks for reaching out to MegaCloudWorks. We've received your message.", body })
}

function buildConfirmationEmailText(name: string, subject: string, message: string) {
  const firstName = name.split(' ')[0] || 'there'
  return `Thanks for reaching out, ${firstName}.\n\nThank you for contacting MegaCloudWorks.\n\nWe've received your message and our team will review it and get back to you as soon as possible.\n\nYour submission:\nSubject: ${subject}\nMessage: ${message}\n\nWe appreciate you getting in touch and look forward to speaking with you.\n\nMegaCloudWorks\nhello@megacloudworks.com\n${SITE_URL}`
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

  try {
    // the business notification is the critical send: the visitor only sees
    // success once this lead has actually reached hello@megacloudworks.com
    const leadResult = await sendViaSmtp2go(apiKey, {
      to: [toEmail],
      sender: fromEmail,
      reply_to: email,
      subject: `New Website Inquiry — ${subject}`,
      html_body: buildLeadEmailHtml(name, email, subject, message),
      text_body: buildLeadEmailText(name, email, subject, message),
    })

    if (!leadResult.ok) {
      console.error('SMTP2GO lead send failed', leadResult.status, leadResult.data)
      return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 502 })
    }

    // the customer confirmation is best-effort: the lead is already in the
    // business's inbox, so a failure here must not fail the request and
    // send the visitor back to resubmit (which would create a duplicate lead)
    try {
      const confirmationResult = await sendViaSmtp2go(apiKey, {
        to: [email],
        sender: fromEmail,
        reply_to: fromEmail,
        subject: 'We received your message — MegaCloudWorks',
        html_body: buildConfirmationEmailHtml(name, subject, message),
        text_body: buildConfirmationEmailText(name, subject, message),
      })

      if (!confirmationResult.ok) {
        console.error('SMTP2GO customer confirmation failed', confirmationResult.status, confirmationResult.data)
      }
    } catch (err) {
      console.error('SMTP2GO customer confirmation request error', err)
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    console.error('SMTP2GO request error', err)
    return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 502 })
  }
}
