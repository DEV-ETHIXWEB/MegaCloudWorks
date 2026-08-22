import { Suspense, lazy } from 'react'
import type { Location } from 'react-router-dom'
import { BrowserRouter, Routes, Route, useLocation, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { DebugOverlay } from './components/DebugOverlay'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Services } from './pages/Services'
import { Work } from './pages/Work'
import { Contact } from './pages/Contact'
import { NotFound } from './pages/NotFound'

// Case-study detail pulls in the full 20-screen interactive phone UI
// library (~1600 lines), split out so it only loads when a project is
// actually opened, not on every route.
const WorkDetail = lazy(() => import('./pages/WorkDetail').then((m) => ({ default: m.WorkDetail })))

// Original 6-way concept comparison, kept for reference, not part of the
// production site's information architecture, so it's split out too.
const Gallery = lazy(() => import('./pages/Gallery').then((m) => ({ default: m.Gallery })))
const Minimalism = lazy(() => import('./pages/Minimalism').then((m) => ({ default: m.Minimalism })))
const Swiss = lazy(() => import('./pages/Swiss').then((m) => ({ default: m.Swiss })))
const Brutalism = lazy(() => import('./pages/Brutalism').then((m) => ({ default: m.Brutalism })))
const Neumorphism = lazy(() => import('./pages/Neumorphism').then((m) => ({ default: m.Neumorphism })))
const Glassmorphism = lazy(() => import('./pages/Glassmorphism').then((m) => ({ default: m.Glassmorphism })))
const Claymorphism = lazy(() => import('./pages/Claymorphism').then((m) => ({ default: m.Claymorphism })))

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--paper)]">
      <div className="size-8 animate-spin rounded-full border-2 border-[var(--line-strong)] border-t-[var(--brand)]" />
    </div>
  )
}

function PageTransition({
  location,
  children,
}: {
  location: Location
  children: React.ReactNode
}) {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Fade the incoming page in; don't fade the outgoing one out. `mode="wait"`
  // plus an exit fade means a stretch where the old page has reached opacity 0
  // and the new one hasn't started — against the near-white --paper body that
  // reads as a white flash on every single navigation, which is the symptom
  // this whole transition was accused of. Entering-only keeps the intended
  // softness with nothing ever fully blank, and it removes the exit/enter
  // handoff that was stranding pages at opacity 0 (see AppRoutes).
  return (
    <motion.div
      key={location.pathname}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function AppRoutes() {
  // `location` is read once here and handed to BOTH the transition wrapper and
  // <Routes>. That pairing is the fix for the white screen: <Routes> with no
  // `location` prop resolves against the router context instead, so the moment
  // the URL changed the *outgoing* wrapper re-rendered with the *incoming*
  // page inside it — the fade-out then ran over the new page and left it
  // parked at opacity 0 indefinitely, which is why the screen went white and
  // only a reload (or some later unrelated re-render) brought it back. Pinning
  // <Routes> to an explicit location keeps each wrapper rendering the route it
  // was created for.
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const debug = searchParams.get('debug') === '1'

  // Suspense sits outside the fade: a lazy chunk that's still downloading
  // renders its spinner at full opacity immediately, rather than the
  // spinner itself being born inside a motion.div whose enter animation
  // starts from opacity: 0 — that combination was the white-screen bug,
  // a blank frame during every lazy-route transition until the fade
  // caught up with the fetch.
  return (
    <Suspense fallback={<RouteFallback />}>
      <PageTransition location={location}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/contact" element={<Contact />} />

          {/* concept comparison: reference only */}
          <Route path="/concepts" element={<Gallery />} />
          <Route path="/concepts/minimalism" element={<Minimalism />} />
          <Route path="/concepts/swiss" element={<Swiss />} />
          <Route path="/concepts/brutalism" element={<Brutalism />} />
          <Route path="/concepts/neumorphism" element={<Neumorphism />} />
          <Route path="/concepts/glassmorphism" element={<Glassmorphism />} />
          <Route path="/concepts/claymorphism" element={<Claymorphism />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
      {debug && <DebugOverlay />}
    </Suspense>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
