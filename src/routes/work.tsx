import { createFileRoute, Link } from '@tanstack/react-router'
import { PageShell } from '#/components/site/PageShell'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/work')({ component: Work })

type Project = {
  name: string
  category: string
  blurb: string
  tags: string[]
  img?: string
  gradient?: string
}

const PROJECTS: Project[] = [
  {
    name: 'Finlytics',
    category: 'Fintech · iOS & Web',
    blurb:
      'A personal-finance dashboard that turns messy transaction data into clear, glanceable insight.',
    tags: ['Product design', 'React', 'Data viz'],
    img: '/showcase-app.png',
  },
  {
    name: 'Halo',
    category: 'Health & wellness · Mobile',
    blurb:
      'A habit and mood tracker built around gentle nudges rather than streak-shaming.',
    tags: ['UX research', 'Design system', 'React Native'],
    img: '/design.png',
  },
  {
    name: 'Ledger',
    category: 'Developer tools · Platform',
    blurb:
      'An API platform and docs experience that makes integration feel like a five-minute job.',
    tags: ['API design', 'Docs', 'Web app'],
    img: '/code.png',
  },
  {
    name: 'Meridian',
    category: 'E-commerce · Brand & Web',
    blurb:
      'A full rebrand and storefront rebuild for a home-goods label moving direct-to-consumer.',
    tags: ['Brand', 'UI system', 'Storefront'],
    gradient:
      'linear-gradient(135deg, var(--brand) 0%, var(--brand-2) 100%)',
  },
]

function Work() {
  return (
    <PageShell
      eyebrow="Selected work"
      title="Products we've helped ship."
      intro="A look at the kind of work we do — from first concept to launched product. Case studies with the full story are on the way."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <article
            key={p.name}
            className="group overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper)] shadow-[0_1px_2px_rgba(16,16,20,0.04)] transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(16,16,20,0.10)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[var(--paper-2)]">
              {p.img ? (
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div
                  className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  style={{ backgroundImage: p.gradient }}
                />
              )}
            </div>

            <div className="p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                {p.category}
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-[var(--ink)]">
                {p.name}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-soft)]">
                {p.blurb}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-[var(--line)] bg-[var(--paper-2)] px-3 py-1 text-xs font-medium text-[var(--ink-soft)]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      {/* ---- CTA ---- */}
      <div className="mt-20 flex flex-col items-start gap-5 rounded-3xl border border-[var(--line)] bg-[var(--paper-2)] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--ink)]">
            Could your product be next?
          </h2>
          <p className="mt-2 text-[var(--ink-soft)]">
            We take on a handful of projects at a time. Tell us about yours.
          </p>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link to="/contact">Start a project</Link>
        </Button>
      </div>
    </PageShell>
  )
}
