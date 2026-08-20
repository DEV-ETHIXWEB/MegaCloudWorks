import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { NAV, BRAND } from '../content/site'

type Tone = 'light' | 'dark'

/**
 * Auto-detects whether the header is currently floating over a dark/brand
 * band by checking which [data-header-tone] section sits at the header's own
 * height; pages with a single background pass a fixed `tone` instead and
 * this never has anything to find, so it's a no-op there.
 */
function useAutoTone(fixedTone?: Tone): Tone {
  const [tone, setTone] = useState<Tone>(fixedTone ?? 'light')

  useEffect(() => {
    if (fixedTone) return

    const probeY = 48 // sits inside the fixed header's own height
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-header-tone]'))
    if (sections.length === 0) return

    const onScroll = () => {
      const hit = sections.find((el) => {
        const r = el.getBoundingClientRect()
        return r.top <= probeY && r.bottom >= probeY
      })
      setTone((hit?.dataset.headerTone as Tone) ?? 'light')
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [fixedTone])

  return tone
}

export function SiteHeader({ tone: fixedTone }: { tone?: Tone }) {
  const [open, setOpen] = useState(false)
  const [lifted, setLifted] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const close = () => setOpen(false)
  const tone = useAutoTone(fixedTone)
  const dark = tone === 'dark'

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div
        className={`mx-auto flex max-w-[1360px] items-center justify-between gap-3 rounded-2xl px-4 py-2.5 transition-[background-color,border-color,box-shadow] duration-300 sm:px-6 ${
          lifted || open
            ? dark
              ? 'surface-glass-dark shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
              : 'surface-glass shadow-[0_8px_32px_rgba(16,16,20,0.1)]'
            : 'border border-transparent bg-transparent'
        }`}
      >
        <Link to="/" className="flex shrink-0 items-center gap-2 no-underline" onClick={close}>
          <img
            src={dark ? '/logo-light.svg' : '/logo-resized.svg'}
            alt={BRAND.name}
            width={200}
            height={27}
            className="h-[22px] w-auto sm:h-[25px]"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setHovered(null)}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onMouseEnter={() => setHovered(item.to)}
              className={({ isActive }) =>
                `relative rounded-full px-4 py-2 text-sm font-semibold no-underline transition-colors ${
                  isActive
                    ? 'text-[var(--brand-text)]'
                    : dark
                      ? 'text-white/80 hover:text-white'
                      : 'text-[var(--ink)] hover:text-[var(--brand-text)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* subtle pill that glides between nav items to mark the
                      current page: one shared layoutId so it tweens
                      position instead of popping, kept low-contrast so it
                      reads as a hint rather than a highlight */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className={`absolute inset-0 -z-10 rounded-full ${dark ? 'bg-white/10' : 'bg-[var(--ink)]/[0.05]'}`}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {/* the same pill, previewed on hover: its own layoutId so
                      it glides from item to item as the cursor moves, and
                      fades in/out rather than popping; a touch fainter than
                      the active-page pill so the two stay legible together */}
                  {!isActive && (
                    <AnimatePresence>
                      {hovered === item.to && (
                        <motion.span
                          layoutId="nav-hover-pill"
                          className={`absolute inset-0 -z-10 rounded-full ${dark ? 'bg-white/[0.07]' : 'bg-[var(--ink)]/[0.035]'}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                    </AnimatePresence>
                  )}
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="edge-hard hidden h-9 items-center justify-center rounded-full bg-[var(--brand)] px-5 text-[13px] font-bold text-white no-underline sm:inline-flex"
          >
            Get in touch
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden ${
              dark ? 'text-white hover:bg-white/10' : 'text-[var(--ink)] hover:bg-[var(--paper-2)]'
            }`}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              aria-hidden="true"
              className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="surface-glass mx-auto mt-2 max-w-[1360px] rounded-2xl p-2 shadow-[0_18px_44px_rgba(16,16,20,0.18)] lg:hidden"
            >
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={close}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3.5 text-base font-semibold no-underline transition-colors ${
                      isActive ? 'bg-[var(--brand-soft)] text-[var(--brand-text)]' : 'text-[var(--ink)] hover:bg-[var(--paper-2)]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                onClick={close}
                className="mt-1 flex h-12 w-full items-center justify-center rounded-xl bg-[var(--brand)] text-base font-bold text-white no-underline"
              >
                Get in touch
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
