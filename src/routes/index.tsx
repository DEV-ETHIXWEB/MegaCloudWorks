import { createFileRoute } from '@tanstack/react-router'
import { SiteHeader } from '#/components/site/SiteHeader'
import { Hero } from '#/components/site/Hero'
import { WhatWeDo } from '#/components/site/WhatWeDo'
import { SiteFooter } from '#/components/site/SiteFooter'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="relative min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <SiteHeader />
      <Hero />
      <WhatWeDo />
      <SiteFooter />
    </main>
  )
}
