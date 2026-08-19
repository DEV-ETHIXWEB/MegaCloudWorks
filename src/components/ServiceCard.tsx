import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from './Reveal'

export function ServiceCard({
  n,
  title,
  desc,
  img,
  to,
  delay = 0,
}: {
  n: string
  title: string
  desc: string
  img: string
  to: string
  delay?: number
}) {
  return (
    <Reveal delay={delay}>
      <Link
        to={to}
        className="surface-lift group relative block h-full min-h-[280px] overflow-hidden p-7 no-underline"
      >
        <span className="kicker" data-n={n} />
        <h3 className="relative z-10 mt-6 font-sans text-2xl font-extrabold leading-tight tracking-tight text-[var(--ink)]">
          {title}
        </h3>
        <p className="relative z-10 mt-2 max-w-[10rem] text-sm leading-snug text-[var(--ink-soft)]">
          {desc}
        </p>
        <span className="relative z-10 mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-text)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Learn more <ArrowUpRight size={14} />
        </span>
        <img
          src={img}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute bottom-0 right-0 w-[55%] max-w-[180px] translate-x-2 translate-y-2 object-contain opacity-90 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0"
        />
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_100%_100%,rgba(245,51,59,0.1)_0%,transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>
    </Reveal>
  )
}
