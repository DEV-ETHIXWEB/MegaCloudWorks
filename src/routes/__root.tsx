import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { Toaster } from '#/components/ui/sonner'
import { NotFound } from '#/components/site/NotFound'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'MegaCloudWorks · Coming Soon',
      },
      {
        name: 'description',
        content:
          'MegaCloudWorks is an app design & development studio crafting clean, fast, beautiful products. Our new home is almost ready.',
      },
      {
        name: 'theme-color',
        content: '#f5333b',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'MegaCloudWorks',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      // every headline on the site is set in Geologica, and the browser cannot
      // discover it until the stylesheet has parsed — which is late enough that
      // the first paint lands in the fallback face and reflows to this one.
      // Fonts are fetched anonymously even same-origin, hence the crossOrigin.
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/fonts/Geologica-Variable.woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/logo-mark.svg?v=2',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-32x32.png?v=2',
        sizes: '32x32',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-16x16.png?v=2',
        sizes: '16x16',
      },
      {
        rel: 'icon',
        href: '/favicon.ico?v=2',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png?v=2',
        sizes: '180x180',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[var(--brand-soft)]">
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
