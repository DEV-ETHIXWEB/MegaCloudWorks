import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'

export function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--paper)] text-[var(--ink)]">
      <PageMeta title="Page not found" description="This page doesn't exist." path="/404" />
      <SiteHeader />
      <div className="flex flex-1 flex-col items-center justify-center px-[var(--edge)] py-32 text-center">
        <p className="kicker" data-n="404">
          Not found
        </p>
        <h1 className="mt-6 font-sans text-[clamp(2.4rem,6vw,4.5rem)] font-black tracking-[-0.03em]">
          That page went <span className="text-[var(--brand)]">offline.</span>
        </h1>
        <p className="mt-4 max-w-sm text-[var(--ink-soft)]">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link to="/" className="edge-hard mt-8 inline-flex rounded-full bg-[var(--brand)] px-7 py-3.5 text-sm font-bold text-white no-underline">
          Back to home
        </Link>
      </div>
      <SiteFooter />
    </main>
  )
}
