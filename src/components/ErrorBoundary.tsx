import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

// Every production deploy rewrites the hashed chunk filenames (route
// components and a couple of homepage sections are lazy-loaded). A tab
// left open across a deploy, or one that served a stale cached index.html,
// will try to dynamic-import a chunk that Vercel has since pruned — that
// rejection throws, and with nothing to catch it React unmounts the whole
// tree to a blank white screen. A manual reload fetches the current
// index.html with correct hashes and works, which is exactly the "goes
// white, fine after reload, only on Vercel" symptom. This boundary
// recognises that specific failure and reloads once automatically
// (session-guarded so a genuinely broken deploy doesn't reload forever),
// and gives anything else a visible retry screen instead of silence.
const RELOAD_FLAG = 'mcw:chunk-reload'

function isChunkLoadError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  return /fetch dynamically imported module|loading dynamically imported module|importing a module script failed|loading chunk \d|dynamically imported module/i.test(
    message,
  )
}

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (isChunkLoadError(error) && typeof window !== 'undefined') {
      const alreadyRetried = window.sessionStorage.getItem(RELOAD_FLAG)
      if (!alreadyRetried) {
        window.sessionStorage.setItem(RELOAD_FLAG, '1')
        window.location.reload()
        return
      }
    }
    console.error('Render error caught by ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--paper)] px-6 text-center">
          <p className="font-sans text-lg font-bold text-[var(--ink)]">Something didn&rsquo;t load right.</p>
          <p className="max-w-xs text-sm leading-relaxed text-[var(--ink-soft)]">
            A quick reload usually fixes this.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
