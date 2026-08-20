import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
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

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduced ? undefined : { opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function AppRoutes() {
  return (
    <PageTransition>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
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
      </Suspense>
    </PageTransition>
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
