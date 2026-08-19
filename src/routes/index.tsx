import { createFileRoute } from '@tanstack/react-router'
import { SiteHeader } from '#/components/site/SiteHeader'
import { HomeHero } from '#/components/site/HomeHero'
import { HomeSeam } from '#/components/site/HomeSeam'
import { HomeApproach } from '#/components/site/HomeApproach'
import { HomeGlobal } from '#/components/site/HomeGlobal'
import { HomeWork } from '#/components/site/HomeWork'
import { HomeWhy } from '#/components/site/HomeWhy'
import { HomeCraft } from '#/components/site/HomeCraft'
import { HomeStart } from '#/components/site/HomeStart'
import { HomeFooter } from '#/components/site/HomeFooter'
import { seo } from '#/lib/seo'

export const Route = createFileRoute('/')({
  component: App,
  head: () => {
    const head = seo({
      title: 'MegaCloudWorks · App Design & Development Studio',
      description:
        'MegaCloudWorks is an app design & development studio crafting clean, fast, beautiful products. Our new home is almost ready.',
      path: '/',
    })
    return {
      ...head,
      links: [
        ...head.links,
        // the hero plate is referenced from a CSS background, so the browser
        // cannot find it until the stylesheet has parsed — which is the whole
        // first paint. Preloading it moves the request up to the document.
        {
          rel: 'preload',
          as: 'image',
          href: '/sky/welcome.webp',
          type: 'image/webp',
          fetchPriority: 'high',
        },
      ],
    }
  },
})

function App() {
  return (
    <main className="relative min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <SiteHeader fixed />
      <HomeHero />
      <HomeSeam />
      <HomeApproach />
      <HomeGlobal />
      <HomeWork />
      <HomeWhy />
      <HomeCraft />
      <HomeStart />
      <HomeFooter />
    </main>
  )
}
