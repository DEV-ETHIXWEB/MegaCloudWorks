import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Libraries that are big, shared by several route chunks, and needed by none of
 * the first paint. Left alone, Rollup hoists anything two chunks share up into
 * the entry, so the home page was paying for the animation runtime the About
 * hero uses. Naming them here keeps them async: whoever needs them fetches
 * them, everyone else never sees them.
 */
const ASYNC_LIBS: Record<string, Array<string>> = {
  motion: ['motion', 'motion-dom', 'motion-utils', 'framer-motion'],
  icons: ['lucide-react'],
  toast: ['sonner'],
}

function libChunk(id: string) {
  if (!id.includes('node_modules')) return
  const parts = id.split('node_modules/')
  const path = parts[parts.length - 1]
  for (const [chunk, packages] of Object.entries(ASYNC_LIBS)) {
    if (packages.some((name) => path.startsWith(`${name}/`))) return chunk
  }
}

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    nitro({
      // the node preset serves public assets uncompressed unless the build
      // writes the compressed copies next to them
      compressPublicAssets: { gzip: true, brotli: true },

      // Everything under /assets is content-hashed and already served
      // immutable. Files in public/ are not, and were going out with no
      // cache-control at all — a revalidation round trip per visit for the
      // font, the model and every plate on the page.
      routeRules: {
        '/fonts/**': {
          headers: { 'cache-control': 'public, max-age=31536000, immutable' },
        },
        '/models/**': {
          headers: { 'cache-control': 'public, max-age=31536000, immutable' },
        },
        // art can be replaced under the same name, so it revalidates weekly
        // rather than being pinned for a year
        '/**/*.webp': {
          headers: {
            'cache-control':
              'public, max-age=604800, stale-while-revalidate=86400',
          },
        },
        '/**/*.svg': {
          headers: {
            'cache-control':
              'public, max-age=604800, stale-while-revalidate=86400',
          },
        },
        '/**/*.mp4': {
          headers: {
            'cache-control':
              'public, max-age=604800, stale-while-revalidate=86400',
          },
        },
      },
    }),
    viteReact(),
  ],

  build: {
    rollupOptions: {
      output: { manualChunks: libChunk },
    },
  },

  // honour PORT when a launcher assigns one, otherwise keep the usual 3000
  server: {
    port: Number(process.env.PORT) || 3000,
    host: '0.0.0.0',
    allowedHosts: ['.trycloudflare.com'],
  },
})

export default config
