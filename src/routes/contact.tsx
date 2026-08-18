import { useCallback, useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight, Clock, Mail, MapPin } from 'lucide-react'
import { SiteHeader } from '#/components/site/SiteHeader'
import { SiteFooter } from '#/components/site/SiteFooter'
import { ContactForm } from '#/components/site/ContactForm'
import { BlurText } from '#/components/site/BlurText'
import { seo } from '#/lib/seo'

export const Route = createFileRoute('/contact')({
  component: Contact,
  head: () =>
    seo({
      title: 'Contact',
      description:
        'Tell us what you’re working on. MegaCloudWorks replies personally within one business day.',
      path: '/contact',
    }),
})

type Detail = {
  icon: typeof Mail
  label: string
  value: string
  /** only the rows that go somewhere carry one */
  href?: string
}

const DETAILS: Array<Detail> = [
  {
    icon: Mail,
    label: 'Email us',
    value: 'hello@megacloudworks.com',
    href: 'mailto:hello@megacloudworks.com',
  },
  {
    icon: Clock,
    label: 'Reply time',
    value: 'Within one business day',
  },
  {
    icon: MapPin,
    label: 'Where we are',
    value: 'India, building for US teams',
  },
]

// What happens after the send button - the beat that used to be dead space
// under the form. It is not decoration: a form posted into silence is the
// thing people hesitate over, and saying what follows is what settles it.
const NEXT = [
  {
    n: '01',
    title: 'You send it',
    body: 'Straight to the team building the work, not a shared inbox.',
  },
  {
    n: '02',
    title: 'We read it properly',
    body: 'A person reads it and works out who should answer.',
  },
  {
    n: '03',
    title: 'You hear back',
    body: 'A real reply within one business day. No autoresponder.',
  },
] as const

function Contact() {
  // the entry runs on the same beat system the About hero uses - one clock,
  // one language for big type across the site
  const [beat, setBeat] = useState(0)

  // the "what happens next" strip is below the fold on most screens, so it is
  // armed by arrival rather than by the page-load clock
  const next = useRef<HTMLOListElement>(null)
  const [nextIn, setNextIn] = useState(false)

  // the lit band across the giant CONTACT follows the pointer once there is
  // one; until then it runs its own slow loop (see .contact-word__glow)
  const word = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = word.current
    if (!el || typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // a coarse pointer has no hover position to track, and the listener would
    // only fire on taps - leave the loop running there
    if (!window.matchMedia('(pointer: fine)').matches) return

    let frame = 0
    let x = 0

    const write = () => {
      frame = 0
      el.style.setProperty('--sweep', x.toFixed(4))
    }

    const onMove = (e: PointerEvent) => {
      x = Math.min(Math.max(e.clientX / window.innerWidth, 0), 1)
      if (!el.classList.contains('is-tracking')) el.classList.add('is-tracking')
      if (frame) return
      frame = window.requestAnimationFrame(write)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setBeat(99)
      return
    }

    const marks = [60, 260, 520, 760, 980, 1180]
    const timers = marks.map((ms, i) =>
      window.setTimeout(() => setBeat(i + 1), ms),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [])

  useEffect(() => {
    const el = next.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNextIn(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.some(
          (e) => e.isIntersecting || e.boundingClientRect.bottom < 0,
        )
        if (!seen) return
        setNextIn(true)
        io.disconnect()
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--paper)] text-[var(--ink)]">
      <span aria-hidden="true" className="contact-glow" />

      <SiteHeader />

      <section className="relative px-6 pb-24 pt-32 sm:px-10 sm:pb-28 sm:pt-36 lg:px-20 lg:pb-32 lg:pt-44">
        {/* The page's own title, drawn as outline only and sitting behind
            everything. Two copies stacked exactly: the faint one is always
            there, and the lit one is masked to a band that follows the
            pointer across the page - falling back to a slow loop until the
            pointer has been anywhere near it. */}
        <p
          ref={word}
          aria-hidden="true"
          className={`contact-word pointer-events-none absolute inset-x-0 top-20 select-none text-center font-display font-extrabold sm:top-28 lg:top-32 ${
            beat >= 1 ? 'is-in' : ''
          }`}
        >
          <span className="contact-word__base">CONTACT</span>
          <span className="contact-word__glow">CONTACT</span>
        </p>

        <div className="relative mx-auto grid max-w-[1180px] items-start gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8">
          {/* ---- left: who you are writing to ---- */}
          <div>
            <h1 className="font-display text-[clamp(2.5rem,5.4vw,3.75rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-[var(--ink)]">
              <BlurText
                as="span"
                text="Get in touch"
                animateBy="letters"
                start={beat >= 2}
                delay={30}
                stepDuration={0.32}
                className="block"
              />
            </h1>

            <BlurText
              text="Tell us what you’re building and where you’re headed. We read every message and reply personally."
              start={beat >= 3}
              delay={28}
              stepDuration={0.3}
              className="mt-4 max-w-[26rem] text-[15px] leading-relaxed text-[var(--ink-soft)]"
            />

            {/* One card for all three, with the summit plate behind them: the
                photograph is anchored to the bottom so the ridge line sits
                along the card's foot, and a paper wash over it keeps the rows
                on solid white where the type is. */}
            <Glowable
              className={`contact-card contact-reach relative mt-10 overflow-hidden rounded-3xl sm:mt-14 ${
                beat >= 4 ? 'is-in' : ''
              }`}
            >
              <span aria-hidden="true" className="contact-reach__art" />
              <span aria-hidden="true" className="contact-reach__haze" />
              <span aria-hidden="true" className="contact-reach__wash" />

              <ul className="relative m-0 flex list-none flex-col p-0">
                {DETAILS.map((d, i) => {
                  const inner = (
                    <>
                      <span className="contact-tile flex size-12 shrink-0 items-center justify-center rounded-2xl">
                        <d.icon
                          className="size-5 text-[var(--ink)]"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-bold text-[var(--ink)]">
                          {d.label}
                        </span>
                        <span className="mt-0.5 block truncate text-sm text-[var(--ink-soft)]">
                          {d.value}
                        </span>
                      </span>

                      {/* only the row that goes somewhere gets the arrow; the
                          other two keep the slot filled with a dim marker so
                          the rows still line up, without dressing plain
                          information up as a button */}
                      {d.href ? (
                        <span className="contact-go flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--ink)]">
                          <ArrowUpRight
                            className="size-4"
                            strokeWidth={2.2}
                            aria-hidden="true"
                          />
                        </span>
                      ) : (
                        <span
                          aria-hidden="true"
                          className="flex size-9 shrink-0 items-center justify-center"
                        >
                          <span className="size-1.5 rounded-full bg-[var(--ink-faint)]" />
                        </span>
                      )}
                    </>
                  )

                  return (
                    <li
                      key={d.label}
                      className="contact-row-in border-b border-[var(--line)] last:border-b-0"
                      style={{ '--row': `${i * 110}ms` } as React.CSSProperties}
                    >
                      {d.href ? (
                        <a
                          href={d.href}
                          className="contact-row flex items-center gap-4 p-4 no-underline sm:p-5"
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 p-4 sm:p-5">
                          {inner}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>

              {/* the room the ridge needs to read as a photograph rather than
                  as a texture behind the last row */}
              <div aria-hidden="true" className="h-36 sm:h-44" />
            </Glowable>
          </div>

          {/* ---- right: the form ---- */}
          <Glowable
            className={`contact-panel rounded-3xl p-3 sm:p-4 ${
              beat >= 4 ? 'is-in' : ''
            }`}
          >
            <ContactForm className="h-full" />
          </Glowable>
        </div>

        {/* ---- what happens after you press send ---- */}
        <ol
          ref={next}
          className={`contact-next relative mx-auto mt-14 grid max-w-[1180px] list-none grid-cols-1 gap-6 p-0 sm:mt-20 sm:grid-cols-3 sm:gap-8 ${
            nextIn ? 'is-in' : ''
          }`}
        >
          {NEXT.map((step, i) => (
            <li
              key={step.n}
              className="contact-next__step"
              style={{ '--step': `${i * 140}ms` } as React.CSSProperties}
            >
              <span aria-hidden="true" className="contact-next__rule" />
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
                {step.n}
              </p>
              <h2 className="mt-2 font-display text-lg font-extrabold tracking-tight text-[var(--ink)]">
                {step.title}
              </h2>
              <p className="mt-1.5 max-w-[26ch] text-sm leading-relaxed text-[var(--ink-soft)]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <SiteFooter />
    </div>
  )
}

/**
 * A surface that lights its own edge nearest the pointer.
 *
 * Adapted from the BorderGlow pattern: proximity to the edge sets how bright
 * the ring is and the pointer's bearing from the centre sets which part of it
 * shows, through a conic mask. Both are written straight to the node as
 * custom properties - a render per pointermove would reconcile the whole card
 * sixty times a second for a light that moves a few pixels.
 *
 * The listener is only attached on a device that actually has a pointer, so
 * phones carry none of it.
 */
function Glowable({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return

    const box = el.getBoundingClientRect()
    const cx = box.width / 2
    const cy = box.height / 2
    const dx = e.clientX - box.left - cx
    const dy = e.clientY - box.top - cy

    // how far out towards the edge the pointer is, 0 at the centre and 1 on
    // the border - measured per axis so it tracks the box's own proportions
    // rather than a circle inscribed in it
    const edge = Math.min(Math.max(Math.abs(dx) / cx, Math.abs(dy) / cy), 1)

    // bearing from the centre, clockwise from twelve o'clock, which is the
    // frame the conic mask is written in
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
    if (angle < 0) angle += 360

    el.style.setProperty('--edge', edge.toFixed(3))
    el.style.setProperty('--bearing', `${angle.toFixed(1)}deg`)
  }, [])

  const onPointerLeave = useCallback(() => {
    ref.current?.style.setProperty('--edge', '0')
  }, [])

  return (
    <div
      ref={ref}
      className={`contact-lit ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <span aria-hidden="true" className="contact-lit__ring" />
      {children}
    </div>
  )
}

export default Contact
