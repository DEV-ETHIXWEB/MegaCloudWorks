import { createFileRoute } from '@tanstack/react-router'
import { SiteHeader } from '#/components/site/SiteHeader'
import { Hero } from '#/components/site/Hero'
import { WhatWeDo } from '#/components/site/WhatWeDo'
import { SiteFooter } from '#/components/site/SiteFooter'
import { seo } from '#/lib/seo'

export const Route = createFileRoute('/')({
  component: App,
  head: () =>
    seo({
      title: 'MegaCloudWorks · App Design & Development Studio',
      description:
        'MegaCloudWorks is an app design & development studio crafting clean, fast, beautiful products. Our new home is almost ready.',
      path: '/',
    }),
})

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
