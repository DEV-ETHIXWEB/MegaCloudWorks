import { useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import gsap from 'gsap'
import { Clock, Mail, Users2 } from 'lucide-react'
import { SiteHeader } from '#/components/site/SiteHeader'
import { SiteFooter } from '#/components/site/SiteFooter'
import { ContactForm } from '#/components/site/ContactForm'
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
      <SiteHeader />

      <section className="relative px-6 pb-20 pt-28 sm:px-10 sm:pb-24 sm:pt-32 lg:px-20 lg:pb-32 lg:pt-40">
        {/* ---- centered heading ---- */}
        <div className="mx-auto max-w-xl text-center">
          <h1
            data-hero
            className="font-display text-[clamp(2.75rem,6.5vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--ink)]"
          >
            Get In <span className="text-[var(--brand)]">Touch</span>
          </h1>
          <p
            data-hero
            className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg"
          >
            Tell us what you&rsquo;re working on and where you&rsquo;re headed.
            We read every message and reply personally.
          </p>
        </div>

        {/* ---- unified contact card ---- */}
        <div
          data-hero
          className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper)] shadow-[0_20px_60px_-24px_rgba(16,16,20,0.15)] sm:mt-16"
        >
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
            {/* ---- left: contact info over photo ---- */}
            <div className="relative flex min-h-[22rem] flex-col overflow-hidden p-6 sm:min-h-[30rem] sm:p-10 lg:min-h-[36rem]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[image:url('/contact-background.png')] bg-cover bg-[position:85%_100%] bg-no-repeat"
              />
              {/* on mobile the photo sits directly under the copy, so a soft
                  paper wash keeps the text legible over it */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--paper)_0%,rgba(255,255,255,0.72)_55%,rgba(255,255,255,0)_100%)] lg:hidden"
              />

              <div className="relative max-w-[18rem] sm:max-w-[16rem]">
                <h2 className="font-display text-xl font-extrabold tracking-tight text-[var(--ink)] sm:text-2xl">
                  Contact information
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                  Reach out any time, we read every message and reply personally
                  within one business day.
                </p>

                <div className="mt-8 space-y-5">
                  {DETAILS.map((d) => (
                    <div key={d.label} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)]">
                        <d.icon
                          className="size-4 text-[var(--brand)]"
                          strokeWidth={2.2}
                          aria-hidden="true"
                        />
                      </span>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                          {d.label}
                        </p>
                        {d.href ? (
                          <a
                            href={d.href}
                            className="text-sm font-bold text-[var(--ink)] no-underline transition-colors hover:text-[var(--brand)]"
                          >
                            {d.value}
                          </a>
                        ) : (
                          <p className="text-sm font-bold text-[var(--ink)]">
                            {d.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ---- right: form ---- */}
            <div className="flex border-t border-[var(--line)] p-6 sm:p-10 lg:border-l lg:border-t-0">
              <ContactForm className="flex flex-1 flex-col" />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default Contact
