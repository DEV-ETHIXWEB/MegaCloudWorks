import { useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import gsap from 'gsap'
import { Clock, Mail, Users2 } from 'lucide-react'
import { SiteHeader } from '#/components/site/SiteHeader'
import { SiteFooter } from '#/components/site/SiteFooter'
import { ContactForm } from '#/components/site/ContactForm'

export const Route = createFileRoute('/contact')({ component: Contact })

const DETAILS = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@megacloudworks.com',
    href: 'mailto:hello@megacloudworks.com',
  },
  {
    icon: Clock,
    label: 'Response time',
    value: 'Within one business day',
  },
  {
    icon: Users2,
    label: 'Engagements',
    value: 'Project work & ongoing partnerships',
  },
]

function Contact() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const ctx = gsap.context(() => {
      gsap.from('[data-hero]', {
        y: 34,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={root}
      className="relative min-h-screen overflow-hidden bg-[var(--paper)] text-[var(--ink)]"
    >
      {/* decorative backdrop — glow, diagonal line, accent dot */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-40 top-0 h-[46rem] w-[46rem] rounded-full opacity-70 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(245,51,59,0.14) 0%, rgba(255,106,61,0.08) 40%, rgba(255,255,255,0) 72%)',
          }}
        />
        <div className="absolute right-[6%] top-[20%] h-px w-[55%] origin-left rotate-[22deg] bg-gradient-to-r from-transparent via-[rgba(16,16,20,0.12)] to-transparent" />
        <span className="absolute right-[20%] top-[48%] size-1.5 rounded-full bg-[var(--brand)] shadow-[0_0_18px_4px_rgba(245,51,59,0.5)]" />
      </div>

      <SiteHeader />

      <section className="relative px-6 pb-24 pt-36 sm:px-10 lg:px-20 lg:pb-32 lg:pt-44">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* ---- left: heading + contact details ---- */}
          <div>
            <div data-hero className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-7 w-1 rounded-full bg-[var(--brand)]"
              />
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--ink-faint)]">
                How to contact us
              </p>
            </div>

            <h1
              data-hero
              className="mt-5 font-display text-[clamp(3rem,7vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.03em] text-[var(--ink)]"
            >
              Let&apos;s build something.
            </h1>

            <p
              data-hero
              className="mt-6 max-w-md text-lg leading-relaxed text-[var(--ink-soft)]"
            >
              Tell us what you&apos;re working on and where you&apos;re
              headed. We read every message and reply personally.
            </p>

            <div className="mt-14 flex flex-wrap gap-x-12 gap-y-8">
              {DETAILS.map((d) => (
                <div data-hero key={d.label} className="max-w-[13rem]">
                  <d.icon
                    className="size-4 text-[var(--brand)]"
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                    {d.label}
                  </p>
                  {d.href ? (
                    <a
                      href={d.href}
                      className="mt-1 inline-block whitespace-nowrap font-display text-base font-bold text-[var(--ink)] no-underline transition-colors hover:text-[var(--brand)]"
                    >
                      {d.value}
                    </a>
                  ) : (
                    <p className="mt-1 font-display text-base font-bold text-[var(--ink)]">
                      {d.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ---- right: get in touch card ---- */}
          <div
            data-hero
            className="relative rounded-3xl border-2 border-[var(--brand)] bg-[var(--paper-2)] p-6 shadow-[0_0_0_1px_rgba(245,51,59,0.15),0_20px_60px_-24px_rgba(245,51,59,0.35)] sm:p-8"
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-[var(--brand)] shadow-[0_0_10px_2px_rgba(245,51,59,0.7)]"
              />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                Get in touch
              </p>
            </div>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default Contact
