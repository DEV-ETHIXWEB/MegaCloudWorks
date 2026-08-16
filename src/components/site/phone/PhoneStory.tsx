import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigate } from '@tanstack/react-router'
import type { StoryState } from './PhoneRig'
import { ScrollExpand } from './ScrollExpand'
import type { ScrollExpandController } from './ScrollExpand'
import { ProcessDetail } from './ProcessDetail'
import { GhostWord } from './GhostWord'
import { StudioBrief } from './StudioBrief'
import { STEPS } from './process'
import { LAUNCH_MEDIA } from './screens/LaunchScreen'
import { useSectionScroll } from './useSectionScroll'
import {
  ACT,
  FIRST_STEP_STOP,
  SCREEN,
  SNAP_POINTS,
  ZOOM_SCREEN_VH,
  ZOOM_VISIBLE_H,
  clamp,
  mix,
  range,
  stageAt,
} from './story'
import type { Stage } from './story'

import './phone-story.css'

const PhoneCanvas = lazy(() => import('./PhoneCanvas'))

/** Total scroll the story consumes. Five acts want room to breathe. */
const STORY_VH = 720

/**
 * The opening rectangle of the expanding panel, in stage percentages. It is
 * derived rather than tuned: the panel has to appear at exactly the size and
 * corner radius the phone's display is projected at once the phone has flown
 * in, otherwise the hand-off from the 3D screen to the DOM shows a seam.
 */
function openingRect(w: number, h: number) {
  if (w <= 0 || h <= 0) return { width: 26, height: 78, radius: 26 }
  return {
    height: ZOOM_SCREEN_VH * 100,
    width: (SCREEN.width / ZOOM_VISIBLE_H) * (h / w) * 100,
    radius: (SCREEN.radius / ZOOM_VISIBLE_H) * h,
  }
}

export function PhoneStory() {
  const navigate = useNavigate()

  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const welcome = useRef<HTMLDivElement>(null)
  const sky = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const wire = useRef<HTMLDivElement>(null)
  const detail = useRef<HTMLDivElement>(null)
  const ready = useRef<HTMLDivElement>(null)
  const hem = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const expand = useRef<ScrollExpandController | null>(null)

  const story = useRef<StoryState>({
    progress: 0,
    pointer: { x: 0, y: 0 },
    narrow: false,
    reduced: false,
  })

  const [mounted, setMounted] = useState(false)
  const [screen, setScreen] = useState<Stage>('boot')
  const [step, setStep] = useState(0)
  const [narrow, setNarrow] = useState(false)
  const [inView, setInView] = useState(true)
  const [rect, setRect] = useState(() => openingRect(0, 0))

  // the canvas is client-only; SSR renders the copy and the panel alone
  useEffect(() => setMounted(true), [])

  // one act per gesture, and the only thing that moves the page inside the
  // story — including the phone screen's own controls
  const { goTo } = useSectionScroll({
    sectionRef: section,
    points: SNAP_POINTS,
  })

  const openService = useCallback(
    (hash: string) => void navigate({ to: '/services', hash }),
    [navigate],
  )

  /**
   * Tapping a step on the device drives the story to it, rather than just
   * repainting the list — the display is a control surface.
   */
  const selectStep = useCallback(
    (index: number) => goTo(FIRST_STEP_STOP + index),
    [goTo],
  )

  /* ---------------------------------------------------------------- *
   * the master timeline
   * ---------------------------------------------------------------- */
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    const root = section.current
    const host = stage.current
    if (!root || !host) return

    const narrowQuery = window.matchMedia('(max-width: 1023px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncQueries = () => {
      story.current.narrow = narrowQuery.matches
      story.current.reduced = motionQuery.matches
      setNarrow(narrowQuery.matches)
    }
    syncQueries()
    narrowQuery.addEventListener('change', syncQueries)
    motionQuery.addEventListener('change', syncQueries)

    const measure = () =>
      setRect(openingRect(host.clientWidth, host.clientHeight))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(host)

    // the canvas is parked once the story has scrolled away
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '10% 0px' },
    )
    io.observe(host)

    // reduced motion gets the end state outright: no pinning, no scrubbing
    if (motionQuery.matches) {
      story.current.progress = 1
      setScreen('launch')
      setStep(STEPS.length - 1)
      expand.current?.setProgress(1)
      root.dataset.reduced = 'true'
      return () => {
        ro.disconnect()
        io.disconnect()
        narrowQuery.removeEventListener('change', syncQueries)
        motionQuery.removeEventListener('change', syncQueries)
      }
    }

    gsap.registerPlugin(ScrollTrigger)

    let lastScreen: Stage = 'boot'
    let lastStep = 0

    /** Fade and lift a copy layer over a window, then out again over another. */
    const band = (
      el: HTMLElement | null,
      inFrom: number,
      inTo: number,
      outFrom: number,
      outTo: number,
      lift = 30,
    ) => {
      if (!el) return
      const inn = range(story.current.progress, inFrom, inTo)
      const out = range(story.current.progress, outFrom, outTo)
      const shown = inn * (1 - out)
      el.style.opacity = `${shown}`
      el.style.transform = `translate3d(0, ${lift * (1 - inn) - lift * out}px, 0)`
      el.style.visibility = shown > 0.01 ? 'visible' : 'hidden'
    }

    const apply = (p: number) => {
      story.current.progress = p

      // the panel only starts opening once the phone has arrived …
      expand.current?.setProgress(range(p, ACT.expand[0], ACT.expand[1]))

      // … and until then it is not on screen at all: it fades up over the
      // display it is replacing, on the same rectangle, as the phone dissolves.
      // Once it is up it stays up — a form that dims while you are filling it
      // in is worse than a section that simply scrolls away like any other.
      if (panel.current) {
        const inn = range(p, ACT.handoff[0], ACT.handoff[1])
        panel.current.style.opacity = `${inn}`
        panel.current.style.visibility = inn > 0.005 ? 'visible' : 'hidden'
      }

      // the welcome is already on screen when the page loads, so its fade-in
      // window sits before the start of the scroll rather than inside it
      band(
        welcome.current,
        -0.02,
        0,
        ACT.welcome[1] - 0.03,
        ACT.signal[0] + 0.03,
        40,
      )
      // The sky belongs to the welcome. It clears before the rail so the later
      // acts keep the plain paper ground their contrast depends on — a card of
      // grey body copy over a bank of red cloud is unreadable.
      band(
        sky.current,
        -0.02,
        0,
        ACT.welcome[1] - 0.04,
        ACT.signal[0] + 0.04,
        0,
      )
      band(
        rail.current,
        ACT.signal[0] + 0.01,
        ACT.signal[0] + 0.07,
        ACT.signal[1] - 0.06,
        ACT.travel[0] + 0.02,
      )
      // the load line arrives a beat before the copy hung off it
      band(
        wire.current,
        ACT.signal[0] - 0.02,
        ACT.signal[0] + 0.02,
        ACT.signal[1] - 0.04,
        ACT.travel[0] + 0.02,
        0,
      )
      band(
        detail.current,
        ACT.travel[0] + 0.02,
        ACT.travel[1],
        ACT.process[1] - 0.02,
        ACT.zoom[0] + 0.04,
      )
      band(
        ready.current,
        ACT.zoom[0] + 0.02,
        ACT.zoom[1] - 0.04,
        ACT.handoff[0],
        ACT.handoff[1],
        20,
      )

      // the hem is only wanted where it does its job — at the very end, as the
      // pin releases. Left on, it would sit as a grey wash under the phone.
      if (hem.current) hem.current.style.opacity = `${range(p, 0.9, 0.99)}`

      const nextScreen = stageAt(p)
      if (nextScreen !== lastScreen) {
        lastScreen = nextScreen
        setScreen(nextScreen)
      }

      const nextStep = Math.min(
        STEPS.length - 1,
        Math.floor(range(p, ACT.travel[1], ACT.process[1]) * STEPS.length),
      )
      if (nextStep !== lastStep) {
        lastStep = nextStep
        setStep(nextStep)
      }

      // the rail draws itself in as the act opens
      host.style.setProperty(
        '--rail',
        `${range(p, ACT.signal[0] + 0.01, ACT.signal[0] + 0.12)}`,
      )
      // and the whole stage warms toward the brand as the story advances
      host.style.setProperty('--heat', `${mix(0.2, 1, range(p, 0.1, 0.8))}`)
    }

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom bottom',
      // no snapping here: useSectionScroll owns where the story comes to rest,
      // and a second opinion from GSAP would fight it at the ends of the section
      scrub: true,
      onUpdate: (self) => apply(clamp(self.progress)),
      onRefresh: (self) => apply(clamp(self.progress)),
    })

    // a coarse pointer has no hover position to track, and a stale tap would
    // leave the phone locked at whatever tilt the last touch implied
    const fine = window.matchMedia('(pointer: fine)').matches
    const onPointer = (e: PointerEvent) => {
      const b = host.getBoundingClientRect()
      story.current.pointer.x =
        clamp((e.clientX - b.left) / b.width, 0, 1) * 2 - 1
      story.current.pointer.y =
        clamp((e.clientY - b.top) / b.height, 0, 1) * 2 - 1
    }
    if (fine)
      window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      trigger.kill()
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      narrowQuery.removeEventListener('change', syncQueries)
      motionQuery.removeEventListener('change', syncQueries)
    }
  }, [])

  // the panel's opening rectangle changed — redraw at the current progress
  useEffect(() => {
    expand.current?.setProgress(
      range(story.current.progress, ACT.expand[0], ACT.expand[1]),
    )
  }, [rect])

  return (
    <section
      ref={section}
      id="story"
      className="phone-story"
      style={{ height: `${STORY_VH}vh` }}
      aria-label="MegaCloudWorks, from hello to hire us"
    >
      <div ref={stage} className="phone-story__stage">
        {/* ---------- the sky the welcome sits in ---------- */}
        <div ref={sky} className="phone-story__sky" aria-hidden="true">
          <div className="phone-story__sky-img" />
          <div className="phone-story__sky-scrim" />
        </div>

        {/* ---------- the 3D phone ---------- */}
        <div className="phone-story__canvas">
          {mounted ? (
            <Suspense fallback={null}>
              <PhoneCanvas
                state={story}
                stage={screen}
                activeStep={step}
                narrow={narrow}
                active={inView}
                onSelectStep={selectStep}
                onOpenService={openService}
              />
            </Suspense>
          ) : null}
        </div>

        {/* ---------- act one: the welcome ---------- */}
        <div
          ref={welcome}
          className="phone-story__copy phone-story__copy--left"
        >
          <p className="phone-story__eyebrow">MegaCloudWorks</p>
          <h1 className="phone-story__headline">
            We build
            <br />
            <span>the app</span>
            <br />
            you keep
            <br />
            describing.
          </h1>
          <p className="phone-story__lede">
            Design and development under one roof. Pick it up — the phone is the
            real thing, it follows your cursor, and everything on it works.
          </p>
        </div>

        {/* ---------- act two: the line loading across the top ---------- */}
        <div ref={wire} className="phone-story__wire" aria-hidden="true">
          <span className="phone-story__wire-track" />
          <span className="phone-story__wire-lit" />
          <span className="phone-story__wire-head" />
        </div>

        {/* the act itself is read off the display — the page only frames it */}
        <div ref={rail} className="phone-story__rail-head">
          <p className="phone-story__eyebrow">What we do best</p>
          <h2 className="phone-story__rail-title">
            Two studios,
            <span> one group.</span>
          </h2>
        </div>

        {/* ---------- act three: the process, in full ---------- */}
        <div
          ref={detail}
          className="phone-story__copy phone-story__copy--right"
        >
          <p className="phone-story__eyebrow">The process</p>
          <h2 className="phone-story__headline phone-story__headline--sm">
            Nine weeks,
            <br />
            <span>start to store.</span>
          </h2>
          <ProcessDetail active={step} />
        </div>

        {/* ---------- act four: the ready mark, behind the phone ----------
            The name sits across the top of the stage and the offer answers it
            from the bottom right, so the phone flies up through the middle of
            the two rather than past a single block of type. */}
        <div ref={ready} className="phone-story__ready" aria-hidden="true">
          <div className="phone-story__ready-top">
            <p className="phone-story__ready-kicker">Ready when you are</p>
            <GhostWord className="phone-story__ghost phone-story__ghost--name">
              MEGACLOUD WORKS
            </GhostWord>
          </div>
          <div className="phone-story__ready-foot">
            <GhostWord
              align="right"
              className="phone-story__ghost phone-story__ghost--honour"
            >
              IT WOULD BE OUR HONOUR TO WORK WITH YOU
            </GhostWord>
          </div>
        </div>

        {/* ---------- act five: the screen becomes the page ---------- */}
        <div ref={panel} className="phone-story__panel">
          <ScrollExpand
            driven
            controllerRef={expand}
            src={LAUNCH_MEDIA}
            alt=""
            startWidth={rect.width}
            startHeight={rect.height}
            startRadius={rect.radius}
            endRadius={0}
            mediaZoom={1.24}
            overlayScrim={0}
          >
            <div className="phone-panel">
              <div className="phone-panel__left">
                <p className="phone-panel__eyebrow">Ready when you are</p>
                <h2 className="phone-panel__title">
                  Tell us what
                  <br />
                  you&rsquo;re building.
                </h2>
                <p className="phone-panel__lede">
                  We take on a handful of projects at a time so each one gets
                  the whole studio. If the fit is wrong we will say so, and
                  point you somewhere better.
                </p>

                <dl className="phone-panel__facts">
                  <div>
                    <dt>Reply time</dt>
                    <dd>One business day</dd>
                  </div>
                  <div>
                    <dt>Typical build</dt>
                    <dd>Nine weeks</dd>
                  </div>
                  <div>
                    <dt>Where we are</dt>
                    <dd>India, building for US teams</dd>
                  </div>
                </dl>
              </div>

              <div className="phone-panel__card">
                <StudioBrief />
              </div>
            </div>
          </ScrollExpand>
        </div>

        {/* the foot of the stage fades to the seam colour, so the full-bleed
            panel does not end on a hard rule when the pin releases */}
        <div ref={hem} aria-hidden="true" className="phone-story__hem" />
      </div>
    </section>
  )
}

export default PhoneStory
