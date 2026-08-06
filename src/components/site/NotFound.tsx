import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '#/components/site/SiteHeader'
import { SiteFooter } from '#/components/site/SiteFooter'
import { Button } from '#/components/ui/button'

export function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--paper)] text-[var(--ink)]">
      <SiteHeader />

      <section className="flex flex-1 items-center px-6 pb-24 pt-36 sm:px-10 lg:px-20 lg:pt-44">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.28em] text-[var(--brand)]">
            404
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-[var(--ink)]">
            Page not found.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
            The page you&rsquo;re looking for doesn&rsquo;t exist or may have
            moved.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/" className="flex items-center gap-2">
                <span>Back to home</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/work">See our work</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default NotFound
