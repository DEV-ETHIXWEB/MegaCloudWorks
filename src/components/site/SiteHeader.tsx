import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'

import './site-header.css'

const NAV = [
  { label: 'What we do', to: '/services' },
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const

/**
 * Three lines that become a cross without the glyph ever being swapped — the
 * travel is in the stylesheet, keyed off `data-open` on the button.
 */
function BurgerLines() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line
        className="nav-burger__line nav-burger__line--top"
        x1="3.5"
        y1="7"
        x2="20.5"
        y2="7"
      />
      <line
        className="nav-burger__line nav-burger__line--mid"
        x1="3.5"
        y1="12"
        x2="20.5"
        y2="12"
      />
      <line
        className="nav-burger__line nav-burger__line--bottom"
        x1="3.5"
        y1="17"
        x2="20.5"
        y2="17"
      />
    </svg>
  )
}

function Chevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

/** How long the sheet's own close takes; it stays mounted for exactly that. */
const SHEET_EXIT_MS = 460

export function SiteHeader({
  tone = 'light',
  ctaLabel = 'Get in touch',
  fixed = false,
}: {
  tone?: 'light' | 'dark'
  ctaLabel?: string
  /**
   * Pin the header to the viewport instead of to the top of the document.
   * Pages whose first section is taller than one screen - the home story runs
   * to seven - need this, or the header scrolls away and never returns.
   */
  fixed?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [lifted, setLifted] = useState(false)
  /** the sheet is in the tree; it outlives `open` by the length of its exit */
  const [sheet, setSheet] = useState(false)
  /** the sheet has been told to play its entrance */
  const [shown, setShown] = useState(false)
  const close = () => setOpen(false)
  const dark = tone === 'dark'

  /**
   * Mount first, animate second.
   *
   * A node that appears with its open state already set has no from-state to
   * transition out of, so the panel would simply be there. Two frames of gap -
   * one for the browser to lay the sheet out, one for it to have painted the
   * closed state - and the entrance runs properly. Closing reverses it: the
   * flag drops immediately and the node is pulled once the exit has played.
   */
  useEffect(() => {
    if (open) {
      setSheet(true)
      let second = 0
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => setShown(true))
      })
      return () => {
        cancelAnimationFrame(first)
        cancelAnimationFrame(second)
      }
    }

    setShown(false)
    const id = window.setTimeout(() => setSheet(false), SHEET_EXIT_MS)
    return () => window.clearTimeout(id)
  }, [open])

  // A fixed bar has the whole page passing underneath it, so once anything has
  // scrolled it needs a ground of its own - over the phone story the nav would
  // otherwise sit on top of the copy with nothing between them. Only the
  // desktop bar takes this: below lg there is no bar to give a ground to.
  useEffect(() => {
    if (!fixed || typeof window === 'undefined') return
    const onScroll = () => setLifted(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [fixed])

  // while the mobile menu is up, the page behind it shouldn't scroll away
  // under the panel, and Escape should get you out of it
  useEffect(() => {
    if (!open) return

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const logo = dark ? '/logo-light.svg' : '/logo-resized.svg'
  const navLink = dark
    ? 'text-white/80 hover:text-white'
    : 'text-[var(--ink)] hover:text-[var(--brand)]'
  /* The floating burger below lg. There is no bar behind it, so the button has
     to carry its own ground: a frosted tile that reads on the paper of the
     welcome and on the artwork of the darker pages alike. */
  const burger = dark
    ? 'border-white/15 bg-[rgba(20,20,22,0.62)] text-white shadow-[0_10px_28px_rgba(0,0,0,0.45)]'
    : 'border-[rgba(16,16,20,0.10)] bg-[rgba(255,255,255,0.78)] text-[var(--ink)] shadow-[0_10px_28px_rgba(16,16,20,0.12)]'

  const position = fixed ? 'fixed' : 'absolute'

  return (
    <>
      {/* ---------------- desktop: the bar ---------------- */}
      <header
        className={`${position} inset-x-0 top-0 z-40 hidden transition-[background-color,box-shadow,backdrop-filter] duration-300 lg:block ${
          lifted
            ? dark
              ? 'bg-[rgba(10,10,12,0.5)] shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md'
              : 'bg-[rgba(255,255,255,0.5)] shadow-[0_1px_0_var(--line)] backdrop-blur-md'
            : ''
        }`}
      >
        {/* kept deliberately shallow: it is fixed over a seven-screen story, so
            every pixel of height is a pixel taken off every act underneath it */}
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-6 py-3 lg:px-20">
          <Link to="/" className="flex shrink-0 items-center no-underline">
            <img
              src={logo}
              alt="MegaCloudWorks"
              width={236}
              height={32}
              fetchPriority="high"
              className="h-[27px] w-auto"
            />
          </Link>

          <nav className="flex items-center gap-8">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative py-1 text-sm font-semibold no-underline transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:scale-x-0 after:bg-[var(--brand)] after:transition-transform after:content-[''] ${navLink}`}
                activeProps={{
                  className: 'text-[var(--brand)] after:scale-x-100',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Button asChild size="sm" className="h-9 px-4 text-[13px]">
            <Link to="/contact">{ctaLabel}</Link>
          </Button>
        </div>
      </header>

      {/* ---------------- mobile: no bar at all ----------------
          A bar at this width is a strip of chrome across the one screen the
          story has to work in, and on the home page it cut through the top of
          the stage. What is left is the two things a phone actually needs: a
          way into the nav, and the mark. Both float; the rail carrying them is
          transparent and click-through, so the viewport underneath stays the
          artwork's. */}
      <div
        className={`pointer-events-none ${position} inset-x-0 top-0 z-40 flex items-start justify-between px-4 pt-[max(0.875rem,env(safe-area-inset-top))] lg:hidden`}
      >
        {/* The mark, at the size it was drawn to be read at, on the same
            frosted ground as the burger. It floats over whatever the page is
            showing — and the contact panel scrolls a headline straight through
            this corner — so bare artwork behind it is not a bet worth taking;
            the tile still hugs the logo rather than reserving a bar's width. */}
        <Link
          to="/"
          aria-label="MegaCloudWorks, home"
          className={`pointer-events-auto flex h-11 shrink-0 items-center rounded-2xl border px-3 no-underline backdrop-blur-md ${burger}`}
        >
          <img
            src={logo}
            alt="MegaCloudWorks"
            width={236}
            height={32}
            fetchPriority="high"
            className="h-[26px] w-auto sm:h-[28px]"
          />
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          data-open={open ? 'true' : 'false'}
          className={`nav-burger pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-2xl border backdrop-blur-md transition-transform duration-200 active:scale-95 ${burger}`}
        >
          <BurgerLines />
        </button>
      </div>

      {/* ---------------- mobile: the menu ---------------- */}
      {sheet && (
        <div
          className="nav-sheet lg:hidden"
          data-open={shown ? 'true' : 'false'}
          data-tone={tone}
        >
          {/* tap anywhere off the sheet to dismiss */}
          <div
            aria-hidden="true"
            onClick={close}
            className="nav-sheet__scrim"
          />
          <div
            className="nav-sheet__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            {/* the sheet's own head mirrors the floating pair exactly — mark
                left, control right — so nothing appears to jump when it opens */}
            <div className="nav-sheet__head">
              <img
                src={logo}
                alt=""
                aria-hidden="true"
                width={236}
                height={32}
                className="nav-sheet__logo"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                data-open="true"
                className={`nav-burger inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition-transform duration-200 active:scale-95 ${burger}`}
              >
                <BurgerLines />
              </button>
            </div>

            {NAV.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={close}
                className="nav-sheet__link"
                style={{ '--i': i } as React.CSSProperties}
                activeProps={{ 'data-active': 'true' }}
              >
                <span className="nav-sheet__index">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item.label}
                <span className="nav-sheet__chev">
                  <Chevron />
                </span>
              </Link>
            ))}

            <div
              className="nav-sheet__cta"
              style={{ '--i': NAV.length } as React.CSSProperties}
            >
              <Button asChild className="h-12 w-full text-base">
                <Link to="/contact" onClick={close}>
                  {ctaLabel}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SiteHeader
