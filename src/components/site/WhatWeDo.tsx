import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const ITEMS = [
  {
    img: '/card-design.webp',
    title: 'App Design',
    desc: 'Thoughtful UX and polished interfaces.',
    to: '/services',
    hash: 'app-design',
    imgY: 'translate-y-[7px] group-hover:translate-y-0',
  },
  {
    img: '/card-development.webp',
    title: 'App Development',
    desc: 'Clean, and performant code, shipped on time.',
    to: '/services',
    hash: 'app-development',
    imgY: 'translate-y-5 group-hover:translate-y-3',
  },
  {
    img: '/card-brand.webp',
    title: 'Brand & UI',
    desc: 'Visual systems that feel cohesive.',
    to: '/services',
    hash: 'brand-ui',
    imgY: 'translate-y-5 group-hover:translate-y-3',
  },
] as const

export function WhatWeDo() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 42,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="what-we-do"
      className="scroll-mt-24 px-6 py-20 sm:px-10 sm:py-28 lg:px-20"
    >
      <div className="mx-auto max-w-[1600px]">
        <div
          data-reveal
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink-faint)]">
            What we do
          </p>
          <Link
            to="/services"
            className="text-sm font-semibold text-[var(--brand)] no-underline transition-opacity hover:opacity-70"
          >
            View all services →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              hash={item.hash}
              data-reveal
              className="group relative block min-h-[240px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6 no-underline shadow-[0_1px_2px_rgba(16,16,20,0.04)] transition-all duration-300 hover:shadow-[0_18px_44px_rgba(16,16,20,0.10),0_0_40px_rgba(245,51,59,0.15)]"
            >
              {/* Red glow background on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(245,51,59,0.08)_0%,transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <h3 className="relative z-10 font-display text-2xl font-extrabold leading-tight tracking-tight text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="relative z-10 mt-2 max-w-[9.5rem] text-sm leading-snug text-[var(--ink-soft)]">
                {item.desc}
              </p>
              <span className="relative z-10 mt-4 inline-block text-sm font-semibold text-[var(--brand)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Learn more →
              </span>
              <img
                src={item.img}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className={`pointer-events-none absolute bottom-0 right-0 w-[60%] max-w-[190px] translate-x-3 object-contain transition-transform duration-300 ${item.imgY}`}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhatWeDo
