import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

// Vite's own module-preload polyfill fires this event when a chunk's
// <link rel="modulepreload"> fails (the same stale-deploy scenario the
// ErrorBoundary below handles for a failed dynamic import()) — belt and
// braces, since a preload failure doesn't always surface as a thrown
// error inside a component render. Session-guarded to match the
// boundary's reload-once behaviour.
window.addEventListener('vite:preloadError', () => {
  if (!window.sessionStorage.getItem('mcw:chunk-reload')) {
    window.sessionStorage.setItem('mcw:chunk-reload', '1')
    window.location.reload()
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
