import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Vercel sets this at build time; lets the debug overlay report exactly
    // which commit a visitor's browser is actually running.
    'import.meta.env.VITE_COMMIT_SHA': JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA ?? 'local'),
  },
})
