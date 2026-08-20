import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { sendContact } from '#/server/contact'
import { StrokeText } from './StrokeText'
import { Dropdown } from './Dropdown'

import './home-start.css'

/* ------------------------------------------------------------------ *
 * marks
 * ------------------------------------------------------------------ */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
    </svg>
  )
}

function ArrowOut() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M20.5 11.5a7.6 7.6 0 0 1-8.2 7.6 8.4 8.4 0 0 1-3-.5L4 20.5l1.7-4.4A7.4 7.4 0 0 1 4.5 11.5 7.6 7.6 0 0 1 12.5 4a7.6 7.6 0 0 1 8 7.5Z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.3l3.3 2" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * the content
 * ------------------------------------------------------------------ */

const PROJECT_TYPES = [
  'Mobile app (iOS & Android)',
  'Web app',
  'Website',
  'Design only',
  'Something else',
] as const

const BUDGETS = [
  'Under $10k',
  '$10k – $25k',
  '$25k – $50k',
  '$50k+',
  'Not sure yet',
] as const

const START_WINDOWS = [
  'As soon as possible',
  'In the next month',
  'In two to three months',
  'Later this year',
  'Still deciding',
] as const

const TEAM_SIZES = [
  'Just me',
  '2 – 10 people',
  '11 – 50 people',
  '50+ people',
] as const

export function HomeStart() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState('')
  const [start, setStart] = useState('')
  const [team, setTeam] = useState('')
  const [budget, setBudget] = useState('')
  const [description, setDescription] = useState('')

  const send = useMutation({
    mutationFn: (input: Parameters<typeof sendContact>[0]['data']) =>
      sendContact({ data: input }),
    onSuccess: (result) => {
      toast.success(`Thanks ${result.name}, your brief is with us.`, {
        description: 'We reply to every enquiry within one business day.',
      })
      setName('')
      setEmail('')
      setPhone('')
      setType('')
      setStart('')
      setTeam('')
      setBudget('')
      setDescription('')
    },
    onError: (error: Error) =>
      toast.error(error.message || 'Something went wrong, please try again.'),
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    // the endpoint takes a fixed shape, so the extras ride in the brief
    const extras = [
      phone.trim() && `Phone: ${phone.trim()}`,
      team && `Team: ${team}`,
    ]
      .filter(Boolean)
      .join('\n')

    send.mutate({
      name,
      email,
      subject: type || 'New project brief',
      message: extras ? `${description}\n\n${extras}` : description,
      budget: budget || undefined,
      timeline: start || undefined,
    })
  }

  return (
    <section id="start" className="home-start">
      <div className="relative mx-auto max-w-[1360px] px-6 py-12 sm:px-10 lg:px-28 lg:py-12">
        {/* ---------- the heading, with its answer across from it ---------- */}
        <p className="start-kicker">Start a project</p>

        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-display text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-[var(--ink)]">
            Contact Us
          </h2>
          <p className="max-w-xs text-[0.875rem] leading-[1.55] text-[var(--ink-soft)] lg:text-right">
            Tell us what you&rsquo;re building and when you&rsquo;d like to
            start — we reply within one business day.
          </p>
        </div>

        {/* ---------- the brief, and the climb beside it ---------- */}
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
          <form className="start-panel" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
              <div>
                <label className="start-label" htmlFor="start-name">
                  Name
                </label>
                <div className="start-control">
                  <input
                    id="start-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="start-label" htmlFor="start-email">
                  Email
                </label>
                <div className="start-control">
                  <input
                    id="start-email"
                    type="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="start-label" htmlFor="start-phone">
                  Phone Number
                </label>
                <div className="start-control">
                  <input
                    id="start-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <Dropdown
                label="What are we building?"
                placeholder="Choose a project type…"
                value={type}
                options={PROJECT_TYPES}
                onChange={setType}
              />

              <Dropdown
                label="Preferred Start"
                placeholder="When would you like to begin?"
                value={start}
                options={START_WINDOWS}
                onChange={setStart}
                icon={<CalendarIcon />}
              />

              <Dropdown
                label="Team Size"
                placeholder="How big is your team?"
                value={team}
                options={TEAM_SIZES}
                onChange={setTeam}
              />

              <Dropdown
                label="Budget Range"
                placeholder="Select a range…"
                value={budget}
                options={BUDGETS}
                onChange={setBudget}
              />

              <div className="sm:col-span-2">
                <label className="start-label" htmlFor="start-message">
                  Message / Project Brief
                </label>
                <div className="start-control start-control--area">
                  <textarea
                    id="start-message"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Anything else we should know?"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2.5">
              <button
                type="submit"
                className="start-send"
                disabled={send.isPending}
              >
                {send.isPending ? 'Sending…' : 'Send Project Brief'}
              </button>
              <span className="start-send-disc" aria-hidden="true">
                <ArrowOut />
              </span>
            </div>
          </form>

          {/* the climb, with its tag and its welcome */}
          <div className="start-climb">
            <span className="start-climb__tag" aria-hidden="true">
              Your climb
            </span>

            {/* drawn rather than set: it is the one line on the page that
                is addressed to the reader, and it earns the flourish */}
            <span className="start-climb__note">
              <StrokeText
                text="Looking forward"
                fontSize={40}
                letterSpacing={-1.5}
                strokeColor="#101014"
                fillColor="#101014"
                strokeWidth={0.9}
                drawDuration={0.8}
                stagger={0.025}
                fillDelay={0.05}
                trigger="scroll"
              />
              <StrokeText
                text="to working with you."
                fontSize={40}
                letterSpacing={-1.5}
                strokeColor="var(--brand)"
                fillColor="var(--brand)"
                strokeWidth={0.9}
                drawDuration={0.8}
                stagger={0.025}
                fillDelay={0.18}
                trigger="scroll"
              />
            </span>
          </div>
        </div>

        {/* ---------- the three ways in ---------- */}
        <div className="start-reach mt-10">
          <div>
            <span className="start-reach__disc">
              <ChatIcon />
            </span>
            <h3 className="text-[1rem] font-bold tracking-[-0.02em] text-[var(--ink)]">
              Talk to us
            </h3>
            <p className="mt-1.5 text-[0.875rem] leading-[1.55] text-[var(--ink-soft)]">
              India, building for teams worldwide
            </p>
          </div>

          <div>
            <span className="start-reach__disc">
              <ClockIcon />
            </span>
            <h3 className="text-[1rem] font-bold tracking-[-0.02em] text-[var(--ink)]">
              Reply time
            </h3>
            <p className="mt-1.5 text-[0.875rem] leading-[1.55] text-[var(--ink-soft)]">
              Within one business day
              <br />
              Typical build: nine weeks
            </p>
          </div>

          <div>
            <span className="start-reach__disc">
              <MailIcon />
            </span>
            <h3 className="text-[1rem] font-bold tracking-[-0.02em] text-[var(--ink)]">
              Write to us
            </h3>
            <p className="mt-1.5 text-[0.875rem] leading-[1.55] text-[var(--ink-soft)]">
              <a
                href="mailto:hello@megacloudworks.com"
                className="no-underline transition-colors hover:text-[var(--brand)]"
              >
                hello@megacloudworks.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeStart
