import { createFileRoute, Link } from '@tanstack/react-router'
import { PageShell } from '#/components/site/PageShell'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/about')({ component: About })

const PRINCIPLES = [
  {
    title: 'Small team, senior hands',
    body: 'You work directly with the people doing the work — no account managers relaying messages, no juniors learning on your budget.',
  },
  {
    title: 'Design and code together',
    body: 'We design what we can build and build what we design, so nothing gets lost in a handoff between two different vendors.',
  },
  {
    title: 'Ship, then sharpen',
    body: 'We get something real in front of users early, then refine with evidence instead of guessing behind closed doors.',
  },
  {
    title: 'Honest about scope',
    body: "We'll tell you what's worth building now, what can wait, and what you don't need at all — even when it means a smaller project.",
  },
]

function About() {
  return (
    <PageShell
      eyebrow="About"
      title="A studio, not a factory."
      intro="Megacloudworks is a compact design & development studio. We help founders and teams turn ideas into products that feel considered — fast, clean, and genuinely nice to use."
    >
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-5 text-[17px] leading-relaxed text-[var(--ink-soft)]">
          <p>
            We started Megacloudworks because too much software is either
            beautiful but broken, or solid but joyless. We think you shouldn&apos;t
            have to choose. The best products come from designers and engineers
            solving problems in the same room, at the same time.
          </p>
          <p>
            So that&apos;s how we work — as one team across the whole journey, from
            the first messy sketch to the version that&apos;s live and growing. We
            keep our roster small on purpose, so the people you meet are the
            people who do the work.
          </p>
          <p className="text-[var(--ink)]">
            If that sounds like the kind of partner you&apos;ve been looking for,
            we&apos;d love to hear what you&apos;re building.
          </p>
        </div>

        <div className="grid gap-6 rounded-3xl border border-[var(--line)] bg-[var(--paper-2)] p-6 sm:p-8">
          {PRINCIPLES.map((p) => (
            <div key={p.title}>
              <h3 className="font-display text-lg font-bold text-[var(--ink)]">
                {p.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-soft)]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 flex flex-col items-start gap-5 rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--ink)]">
            Work with us
          </h2>
          <p className="mt-2 text-[var(--ink-soft)]">
            See what we do, or skip ahead and tell us about your project.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button asChild variant="outline" size="lg">
            <Link to="/services">Our services</Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/contact">Get in touch</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
