import { createFileRoute } from '@tanstack/react-router'
import { PageShell } from '#/components/site/PageShell'
import { ContactForm } from '#/components/site/ContactForm'

export const Route = createFileRoute('/contact')({ component: Contact })

const DETAILS = [
  {
    label: 'Email',
    value: 'hello@megacloudworks.com',
    href: 'mailto:hello@megacloudworks.com',
  },
  {
    label: 'Response time',
    value: 'Within one business day',
  },
  {
    label: 'Engagements',
    value: 'Project work & ongoing partnerships',
  },
]

function Contact() {
  return (
    <PageShell
      eyebrow="Contact"
      title="Let's build something."
      intro="Tell us what you're working on and where you're headed. We read every message and reply personally."
    >
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-6 shadow-[0_1px_2px_rgba(16,16,20,0.04)] sm:p-8">
          <ContactForm />
        </div>

        <aside className="flex flex-col gap-8">
          {DETAILS.map((d) => (
            <div key={d.label}>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                {d.label}
              </p>
              {d.href ? (
                <a
                  href={d.href}
                  className="mt-1 inline-block font-display text-lg font-bold text-[var(--ink)] no-underline transition-colors hover:text-[var(--brand)]"
                >
                  {d.value}
                </a>
              ) : (
                <p className="mt-1 font-display text-lg font-bold text-[var(--ink)]">
                  {d.value}
                </p>
              )}
            </div>
          ))}

          <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
            No forms-into-the-void here. A real person on our team will get back
            to you — usually with a couple of questions and a suggested next
            step.
          </p>
        </aside>
      </div>
    </PageShell>
  )
}
