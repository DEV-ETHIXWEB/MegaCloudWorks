import { Mail, Clock, MapPin, ArrowUpRight } from 'lucide-react'
import { PageMeta } from '../components/PageMeta'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { Reveal } from '../components/Reveal'
import { ContactForm } from '../components/ContactForm'
import { CONTACT_HERO, DETAILS, NEXT } from '../content/contact'

const ICONS = [Mail, Clock, MapPin]

export function Contact() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--paper-2)] text-[var(--ink)]">
      <PageMeta
        title="Contact"
        description="Tell us what you're working on. MegaCloudWorks replies personally within one business day."
        path="/contact"
      />
      <SiteHeader />

      <section className="relative overflow-hidden px-[var(--edge)] pb-24 pt-36 sm:pt-44">
        {/* atmosphere — a clearly visible top wash in the brand colours,
            a Swiss grid texture, and two large soft glows kept off to the
            sides so neither competes with the centered watermark word or
            the heading sitting on top of it */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[46rem]"
          style={{
            background:
              'radial-gradient(120% 65% at 50% 0%, rgba(245,51,59,0.22), transparent 72%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 -z-20 opacity-[0.9]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(16,16,20,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16,16,20,0.08) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 75% 65% at 50% 15%, black 35%, transparent 90%)',
          }}
        />
        <div
          className="pointer-events-none absolute left-[6%] top-6 -z-20 size-[26rem] rounded-full opacity-[0.55] blur-[90px]"
          style={{ background: 'radial-gradient(circle, var(--brand), transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute right-[6%] top-52 -z-20 size-[22rem] rounded-full opacity-[0.4] blur-[90px]"
          style={{ background: 'radial-gradient(circle, var(--brand-2), transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-[var(--container)] text-center">
          {/* giant background word — filled into the same box the heading
              sits in and centered on it, so its size is always relative to
              the heading's own footprint and it can never grow past it */}
          <p
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 flex select-none items-center justify-center overflow-hidden whitespace-nowrap font-sans font-black leading-none tracking-tight text-transparent"
            style={{
              fontSize: 'clamp(3rem, 16vw, 11rem)',
              WebkitTextStroke: '1.5px rgba(16,16,20,0.07)',
            }}
          >
            {CONTACT_HERO.word}
          </p>

          <h1 className="relative font-sans text-[clamp(2.6rem,6.5vw,4.6rem)] font-black tracking-[-0.03em]">
            {CONTACT_HERO.h1}
          </h1>
          <p className="relative mx-auto mt-4 max-w-lg text-lg text-[var(--ink-soft)]">{CONTACT_HERO.sub}</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-[var(--container)] gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* details card */}
          <Reveal className="md:col-span-1 lg:col-span-2 self-start">
            <div className="surface-lift p-2">
              {DETAILS.map((d, i) => {
                const Icon = ICONS[i]
                const row = (
                  <div className="flex items-center gap-4 rounded-2xl p-5 transition-colors hover:bg-[var(--paper-2)]">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--paper-2)] text-[var(--brand)]">
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">{d.label}</p>
                      <p className="mt-0.5 break-words font-semibold text-[var(--ink)]">{d.value}</p>
                    </div>
                    {d.href && <ArrowUpRight size={16} className="shrink-0 text-[var(--ink-faint)]" />}
                  </div>
                )
                return d.href ? (
                  <a key={d.label} href={d.href} className="block no-underline">
                    {row}
                  </a>
                ) : (
                  <div key={d.label}>{row}</div>
                )
              })}
            </div>

            {/* what happens next */}
            <div className="mt-8 space-y-6">
              {NEXT.map((n) => (
                <div key={n.n} className="border-t border-[var(--line)] pt-5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm font-black text-[var(--brand)]">{n.n}</span>
                    <p className="font-sans text-base font-bold tracking-tight">{n.title}</p>
                  </div>
                  <p className="mt-1.5 text-sm text-[var(--ink-soft)]">{n.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* form */}
          <Reveal delay={0.1} className="md:col-span-1 lg:col-span-3">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
