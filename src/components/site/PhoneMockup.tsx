import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Pause, Play, SkipForward } from 'lucide-react'
import { cn } from '#/lib/utils'
import { DashboardScreen } from './PhoneScreens'
import type { ConceptTrack } from '#/lib/concepts'

/**
 * PhoneMockup — the device, standing in 3D space.
 *
 * The frame is DOM rather than an image, so the screen stays a live React tree
 * that can be animated and swapped. What makes it read as an object rather
 * than a rounded rectangle is the depth: the whole device sits in a
 * perspective stage, the rail and buttons sit on their own Z planes so the
 * edge shows as it turns, and the specular sweep across the glass tracks the
 * same angle. The shadow underneath leans the opposite way, which is what
 * sells the whole thing.
 *
 * Two variants:
 *   full — answers the pointer, can be picked up and turned, island opens
 *   mini — answers the pointer too, but returns to the angle its card asks for
 *          and stays out of the way of the click that selects it
 *
 * Custom screen animations plug in through data-attributes, which GSAP queries
 * inside this component's scope:
 *
 *   data-phone-reveal  → any element that should stagger-in on mount
 *   data-phone-bar     → chart bars (grow from the baseline)
 */
export function PhoneMockup({
  className,
  children,
  live,
  track,
  accent = 'var(--brand)',
  variant = 'full',
  restY,
  onSwipe,
}: {
  className?: string
  children?: ReactNode
  /** label the Dynamic Island announces; re-announced whenever it changes */
  live?: string
  /** what the island plays when it is opened */
  track?: ConceptTrack
  accent?: string
  variant?: 'full' | 'mini'
  /** the angle the device returns to when nobody is pointing at it, degrees */
  restY?: number
  /**
   * Called when the screen is swiped or arrowed through: +1 for the next
   * screen, -1 for the previous one.
   */
  onSwipe?: (direction: 1 | -1) => void
}) {
  const scope = useRef<HTMLDivElement>(null)
  const device = useRef<HTMLDivElement>(null)
  const mini = variant === 'mini'

  // The island has three states. `idle` is the resting pill; `live` is the
  // brief announcement when the screen changes; `player` is the now-playing
  // activity, and it is the only one the reader opens themselves — so it wins
  // over an announcement rather than being interrupted by one.
  const [mode, setMode] = useState<'idle' | 'live' | 'player'>('idle')
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  // ---- the island announces each new screen, then folds back down --------
  const firstLive = useRef(true)
  useEffect(() => {
    if (mini || !live) return
    // no announcement for the screen that was simply there on arrival
    if (firstLive.current) {
      firstLive.current = false
      return
    }
    // never talk over the player the reader opened
    let cancelled = false
    setMode((cur) => (cur === 'player' ? cur : 'live'))
    const t = window.setTimeout(() => {
      if (!cancelled) setMode((cur) => (cur === 'live' ? 'idle' : cur))
    }, 2100)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [live, mini])

  // ---- the player's clock ------------------------------------------------
  const length = track?.length ?? 0
  useEffect(() => {
    if (!playing || !length) return
    const id = window.setInterval(
      () => setElapsed((s) => (s + 1 >= length ? 0 : s + 1)),
      1000,
    )
    return () => window.clearInterval(id)
  }, [playing, length])

  const openPlayer = useCallback(() => {
    setMode((cur) => {
      if (cur === 'player') return 'idle'
      // opening it starts it, the way a live activity would
      setPlaying(true)
      return 'player'
    })
  }, [])

  // ---- swiping between screens -------------------------------------------
  //
  // A touch drag across the glass moves to the next screen, the way it would
  // on the real thing. Deliberately touch-only: with a mouse the same gesture
  // already picks the device up and turns it, and one drag cannot mean two
  // things. Pointer devices get the dots, the arrow keys, and the tilt.
  const swipe = useRef<{ id: number; x: number; y: number } | null>(null)
  // which way the last change went, so the incoming screen slides in from the
  // side it was swiped from
  const [dir, setDir] = useState<1 | -1>(1)

  const go = useCallback(
    (d: 1 | -1) => {
      if (!onSwipe) return
      setDir(d)
      onSwipe(d)
    },
    [onSwipe],
  )

  const onScreenDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch' || !onSwipe) return
    swipe.current = { id: e.pointerId, x: e.clientX, y: e.clientY }
  }

  const onScreenUp = (e: React.PointerEvent) => {
    const s = swipe.current
    if (!s || s.id !== e.pointerId) return
    swipe.current = null

    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    // a swipe has to be decisively sideways, or it was a scroll that happened
    // to start on the screen
    if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.4) return
    go(dx < 0 ? 1 : -1)
  }

  const onScreenKey = (e: React.KeyboardEvent) => {
    if (!onSwipe) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
  }

  // ---- the tilt ----------------------------------------------------------
  //
  // Every device is handled by the same loop, full or mini, so all of them
  // answer the pointer. What differs is what they do when nobody is pointing:
  // the full one breathes on two slow sines, and a mini returns to the angle
  // its card wants it at.
  //
  // The full device can also be picked up — press and drag turns it further
  // than the pointer alone would, and letting go hands it back to the pointer.
  const rest = restY ?? (mini ? -15 : 0)
  useEffect(() => {
    const stage = scope.current
    const el = device.current
    if (!stage || !el || typeof window === 'undefined') return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    // where the device is pointed, and where it is being asked to point. The
    // gap between the two is closed a fraction per frame, which is what gives
    // the turn its weight — a direct assignment reads as a jitter.
    let rx = mini ? 4 : 0
    let ry = rest
    let toX = rx
    let toY = ry
    let pointing = false
    let frame = 0
    const start = performance.now()

    // how far the pointer can turn it, and how far a drag can
    const REACH = mini ? 16 : 13
    const GRIP = 32

    // a drag in progress: where it started and the angles it started from
    let drag: {
      id: number
      x: number
      y: number
      ry: number
      rx: number
    } | null = null

    const tick = (now: number) => {
      if (!pointing && !drag) {
        if (mini) {
          toY = rest
          toX = 4
        } else {
          // left alone, it breathes: two slow sines at different periods so
          // the drift never repeats on an obvious beat
          const t = (now - start) / 1000
          toY = Math.sin(t / 3.4) * 5.5
          toX = Math.sin(t / 4.9) * 3.2
        }
      }

      // a held device tracks the hand closely; a released one settles
      const ease = drag ? 0.22 : 0.08
      rx += (toX - rx) * ease
      ry += (toY - ry) * ease

      el.style.setProperty('--rx', `${rx.toFixed(3)}deg`)
      el.style.setProperty('--ry', `${ry.toFixed(3)}deg`)
      // the sweep runs across the glass in the direction the device is turned
      el.style.setProperty('--sheen', `${(50 - ry * 3.4).toFixed(2)}%`)
      // and the shadow leans the opposite way to the turn
      el.style.setProperty('--lean', `${(-ry * 0.7).toFixed(2)}px`)

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    const clamp = (v: number, limit: number) =>
      Math.max(-limit, Math.min(limit, v))

    const onMove = (e: PointerEvent) => {
      if (drag) {
        const box = stage.getBoundingClientRect()
        // a full drag across the stage is a full turn to the grip limit
        toY = clamp(
          drag.ry + ((e.clientX - drag.x) / box.width) * GRIP * 2,
          GRIP,
        )
        toX = clamp(drag.rx - ((e.clientY - drag.y) / box.height) * GRIP, GRIP)
        return
      }

      // a finger is already touching the thing it would be tilting
      if (e.pointerType === 'touch') return
      const box = stage.getBoundingClientRect()
      const nx = (e.clientX - box.left) / box.width - 0.5
      const ny = (e.clientY - box.top) / box.height - 0.5
      pointing = true
      toY = nx * REACH * 2
      toX = -ny * REACH * 1.5
    }

    const onLeave = () => {
      pointing = false
    }

    // only the full device is pickup-able: a mini lives inside a button, and
    // capturing its pointer would eat the click that selects the screen
    const onDown = (e: PointerEvent) => {
      if (mini) return
      // a touch drag here would be a swallowed scroll
      if (e.pointerType === 'touch') return
      // leave the island's own controls alone
      if ((e.target as HTMLElement).closest('.phone3d__island')) return
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, ry, rx }
      stage.setPointerCapture(e.pointerId)
      stage.dataset.held = ''
    }

    const onUp = (e: PointerEvent) => {
      if (!drag || drag.id !== e.pointerId) return
      drag = null
      delete stage.dataset.held
      if (stage.hasPointerCapture(e.pointerId))
        stage.releasePointerCapture(e.pointerId)
    }

    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)
    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointerup', onUp)
    stage.addEventListener('pointercancel', onUp)

    return () => {
      window.cancelAnimationFrame(frame)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onUp)
    }
  }, [mini, rest])

  // ---- the screen's own content animates itself in ------------------------
  useGSAP(
    () => {
      if (mini) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (reduce.matches) return

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-phone-reveal]', {
          y: 14,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.06,
        })
        .from(
          '[data-phone-bar]',
          {
            scaleY: 0,
            transformOrigin: 'center bottom',
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.05,
          },
          '-=0.35',
        )
    },
    { scope, dependencies: [live] },
  )

  const progress = length ? Math.min(100, (elapsed / length) * 100) : 0

  return (
    <div
      ref={scope}
      className={cn('phone3d', mini && 'phone3d--mini', className)}
    >
      <div
        ref={device}
        className="phone3d__device"
        /* a mini starts at its resting angle rather than square on; the tilt
           loop overwrites these same two properties from its first frame */
        style={
          mini
            ? ({ '--rx': '4deg', '--ry': `${rest}deg` } as React.CSSProperties)
            : undefined
        }
      >
        {/* the body's own thickness: a darker slab sitting behind the face,
            revealed along whichever edge the tilt turns away from */}
        <span aria-hidden="true" className="phone3d__body" />

        {/* buttons live off the side of the rail on their own Z plane, so
            they swing out from behind the device as it turns */}
        <span aria-hidden="true" className="phone3d__btn phone3d__btn--mute" />
        <span aria-hidden="true" className="phone3d__btn phone3d__btn--up" />
        <span aria-hidden="true" className="phone3d__btn phone3d__btn--down" />
        <span aria-hidden="true" className="phone3d__btn phone3d__btn--power" />

        <div className="phone3d__rail">
          {/* the black bezel between rail and display — the gap that makes it
              read as a screen set into a body rather than a coloured panel */}
          <div className="phone3d__bezel">
            <div
              className="phone3d__screen"
              onPointerDown={onScreenDown}
              onPointerUp={onScreenUp}
              onPointerCancel={() => {
                swipe.current = null
              }}
              onKeyDown={onScreenKey}
              tabIndex={onSwipe ? 0 : undefined}
              role={onSwipe ? 'group' : undefined}
              aria-label={
                onSwipe
                  ? `${live ?? 'App'} — swipe or use the arrow keys to change screen`
                  : undefined
              }
            >
              {/* keyed on the screen's name so React remounts it: the incoming
                  screen then slides in from the side it was swiped from */}
              <div
                key={live ?? 'screen'}
                className="phone3d__slide"
                data-dir={dir}
              >
                {children ?? <DashboardScreen />}
              </div>

              {/* ---- Dynamic Island ---- */}
              {mini ? (
                <span aria-hidden="true" className="phone3d__island">
                  <span className="phone3d__lens" />
                </span>
              ) : (
                <div className="phone3d__island" data-mode={mode}>
                  <button
                    type="button"
                    onClick={openPlayer}
                    aria-expanded={mode === 'player'}
                    aria-label={
                      track
                        ? `${mode === 'player' ? 'Close' : 'Open'} now playing: ${track.title} by ${track.artist}`
                        : 'Dynamic Island'
                    }
                    className="phone3d__islandHit"
                  />

                  <span aria-hidden="true" className="phone3d__lens" />

                  {/* resting / announcing: the screen's name */}
                  <span className="phone3d__islandLabel" aria-live="polite">
                    <span
                      aria-hidden="true"
                      className="phone3d__islandDot"
                      style={{ background: accent }}
                    />
                    {live}
                  </span>

                  {/* opened: the now-playing activity */}
                  {track ? (
                    <div className="phone3d__player">
                      <span
                        aria-hidden="true"
                        className="phone3d__art"
                        style={{
                          background: `linear-gradient(145deg, ${accent} 0%, ${accent}44 55%, #0b0b10 100%)`,
                        }}
                      >
                        {track.album.slice(0, 1)}
                      </span>

                      <span className="phone3d__meta">
                        <span className="phone3d__title">{track.title}</span>
                        <span className="phone3d__artist">{track.artist}</span>
                        <span
                          aria-hidden="true"
                          className="phone3d__progress"
                          data-playing={playing ? '' : undefined}
                        >
                          <span
                            className="phone3d__progressFill"
                            style={{
                              width: `${progress}%`,
                              background: accent,
                            }}
                          />
                        </span>
                      </span>

                      <span
                        aria-hidden="true"
                        className="phone3d__eq"
                        data-playing={playing ? '' : undefined}
                      >
                        <i style={{ background: accent }} />
                        <i style={{ background: accent }} />
                        <i style={{ background: accent }} />
                        <i style={{ background: accent }} />
                      </span>

                      <span className="phone3d__controls">
                        <button
                          type="button"
                          onClick={() => setPlaying((p) => !p)}
                          aria-label={playing ? 'Pause' : 'Play'}
                          className="phone3d__ctl"
                        >
                          {playing ? (
                            <Pause className="size-3" />
                          ) : (
                            <Play className="size-3" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setElapsed(0)}
                          aria-label="Skip to next track"
                          className="phone3d__ctl"
                        >
                          <SkipForward className="size-3" />
                        </button>
                      </span>
                    </div>
                  ) : null}
                </div>
              )}

              <span aria-hidden="true" className="phone3d__home" />
              <span aria-hidden="true" className="phone3d__glass" />
            </div>
          </div>
        </div>

        <span aria-hidden="true" className="phone3d__shadow" />
      </div>
    </div>
  )
}

export default PhoneMockup
