import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { BlurText } from './BlurText'

const THEN = ['Web design', 'Marketing sites', 'Brand & content'] as const
const NOW = ['App design', 'App development', 'UI / UX systems'] as const

// Ethixweb's own positioning, from ethixweb.com — "We run the tech. You run
// the business." Kept close to their wording so the two studios read as one
// team with a new focus rather than a rebrand.
const ETHIXWEB_COPY =
  'Ethixweb runs the tech so clients can run the business: websites, SEO and ads, CRM integrations, AI booking agents, the whole digital operation. Years of shipping that work for real businesses is where this team learned to build.'

const MEGACLOUD_COPY =
  'MegaCloudWorks points that same team at apps. Product design, native and cross-platform builds, and the interface systems holding them together. Same hands, same standards, aimed at teams who need software rather than a site.'

/**
 * The Ethixweb → MegaCloudWorks bridge: two studio blocks set on a diagonal,
 * wired together by a neon line.
 *
 * The beats, in order:
 *
 *   stage 0  the Ethixweb wordmark alone, centred in the card
 *   stage 1  it docks top-left; its description and services blur in
 *   stage 2  the line finishes its crossing and the cloud flickers awake
 *   stage 3  the MegaCloudWorks description and services blur in
 *
 * The sequence plays itself once, on entry — it is a story with its own pace,
 * not something the scrollbar should be able to rush, stall or reverse. The
 * connector is measured from the live positions of the two anchors, so it
 * re-aims on resize and follows the blocks when they stack on narrow screens.
 */
export function StudioBridge() {
  const root = useRef<HTMLDivElement>(null)
  const mark = useRef<HTMLImageElement>(null)
  const cloud = useRef<HTMLImageElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const wire = useRef<SVGPathElement>(null)
  const halo = useRef<SVGPathElement>(null)
  const head = useRef<SVGCircleElement>(null)
  const fade = useRef<SVGLinearGradientElement>(null)

  const [armed, setArmed] = useState(false)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const el = root.current
    if (!el || typeof window === 'undefined') return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setStage(3)
      return
    }

    setArmed(true)

    let ctx: gsap.Context
    try {
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        let length = 0

        /**
         * Re-aims the connector. It leaves the last letter of the ETHIXWEB
         * wordmark, dives straight down into the gutter between the two rows —
         * clearing the Ethixweb paragraph that sits to its right — then runs
         * the full width of the card into the cloud on the far side.
         */
        // Layout-space box of a node relative to the card. Deliberately not
        // getBoundingClientRect: the wordmark is mid-flight from the centre
        // when the connector is first measured, and its client rect would put
        // the line's origin wherever the animation happens to be. offsetLeft
        // ignores transforms, so this is always where the mark *lands*.
        const at = (node: Element | null) => {
          if (!(node instanceof HTMLElement)) return null
          let x = 0
          let y = 0
          let n: HTMLElement | null = node
          while (n && n !== el) {
            x += n.offsetLeft
            y += n.offsetTop
            n = n.offsetParent as HTMLElement | null
          }
          return { x, y, w: node.offsetWidth, h: node.offsetHeight }
        }

        const aim = () => {
          const box = el.getBoundingClientRect()
          const a = at(mark.current)
          const b = at(cloud.current)
          const path = wire.current
          const bloom = halo.current
          if (!a || !b || !path || !bloom || !svg.current) return

          svg.current.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`)

          const sx = a.x + a.w + 10
          const sy = a.y + a.h / 2
          const ex = b.x - 16
          const ey = b.y + b.h / 2

          // The first control point sits just right of the wordmark and only
          // barely below it, so the line leaves as if it were a continuation
          // of the type rather than dropping off a cliff.
          const d =
            `M ${sx} ${sy} ` +
            `C ${sx + (ex - sx) * 0.16} ${sy + (ey - sy) * 0.16}, ` +
            `${sx + (ex - sx) * 0.45} ${ey + (ey - sy) * 0.05}, ` +
            `${ex} ${ey}`

          // the stroke gradient runs along the line, so the first stretch can
          // fade up out of nothing instead of starting on a blunt cap
          const flow = fade.current
          if (flow) {
            flow.setAttribute('x1', `${sx}`)
            flow.setAttribute('y1', `${sy}`)
            flow.setAttribute('x2', `${ex}`)
            flow.setAttribute('y2', `${ey}`)
          }

          path.setAttribute('d', d)
          bloom.setAttribute('d', d)

          length = path.getTotalLength()
          for (const node of [path, bloom]) {
            node.style.strokeDasharray = `${length}`
            node.style.strokeDashoffset = `${length}`
          }
        }

        // where the wordmark starts from: the middle of the card
        const centreX = () => {
          const box = el.getBoundingClientRect()
          const a = mark.current?.getBoundingClientRect()
          if (!a) return 0
          return box.left + (box.width - a.width) / 2 - a.left
        }
        const centreY = () => {
          const box = el.getBoundingClientRect()
          const a = mark.current?.getBoundingClientRect()
          if (!a) return 0
          return box.top + box.height * 0.36 - a.top
        }

        aim()
        window.addEventListener('resize', aim)

        // The timeline is deliberately NOT attached to the ScrollTrigger:
        // an attached animation is owned by the trigger, and `once` kills the
        // trigger the moment it fires, which stops the timeline a beat later.
        // The trigger's only job here is to say "now".
        const tl = gsap.timeline({ paused: true })

        // Content must never be hostage to an animation. If the sequence
        // hasn't finished well after it should have — a throttled ticker in a
        // background tab, a browser in low-power mode — snap it to the end so
        // the copy is simply there.
        let guard: ReturnType<typeof setTimeout> | undefined

        ScrollTrigger.create({
          trigger: el,
          // fires earlier than it used to, so the sequence is already under
          // way by the time the card is properly on screen
          start: 'top 88%',
          once: true,
          onEnter: () => {
            aim()
            tl.play(0)
            guard = setTimeout(() => {
              if (tl.progress() < 1) tl.progress(1)
              setStage(3)
            }, 6000)
          },
        })

        tl
          // the wordmark leaves the middle of the card and docks top-left
          .fromTo(
            mark.current,
            { x: centreX, y: centreY, scale: 1.16 },
            { x: 0, y: 0, scale: 1, ease: 'power2.inOut', duration: 0.7 },
            0,
          )
          .call(() => setStage(1), undefined, 0.72)
          // the crossing: brisk enough that the copy is never kept waiting
          .fromTo(
            [wire.current, halo.current],
            { strokeDashoffset: () => length },
            {
              strokeDashoffset: 0,
              ease: 'power1.inOut',
              duration: 1.15,
              onUpdate: () => {
                const path = wire.current
                const dot = head.current
                if (!path || !dot || !length) return
                const off = Number(gsap.getProperty(path, 'strokeDashoffset'))
                const tip = path.getPointAtLength(length - off)
                dot.setAttribute('cx', `${tip.x}`)
                dot.setAttribute('cy', `${tip.y}`)
              },
            },
            0.85,
          )
          // ...glowing harder the closer it gets
          .fromTo(
            [halo.current, head.current],
            { opacity: 0 },
            { opacity: 1, ease: 'power2.in', duration: 1.15 },
            0.85,
          )
          // contact: the cloud comes up out of the dark and flickers awake
          .call(() => setStage(2), undefined, 2)
          .fromTo(
            cloud.current,
            { opacity: 0.28 },
            { opacity: 1, ease: 'power1.out', duration: 0.4 },
            2,
          )
          // the head is spent once it has delivered its charge
          .to(head.current, { opacity: 0, duration: 0.4 }, 2.1)
          .call(() => setStage(3), undefined, 2.35)

        return () => {
          window.removeEventListener('resize', aim)
          if (guard) clearTimeout(guard)
        }
      }, el)
    } catch {
      // if the animation layer fails, show the finished card rather than
      // leaving half the content invisible
      setArmed(false)
      setStage(3)
      return
    }

    return () => ctx.revert()
  }, [])

  // content is only held back once we know the sequence is actually running
  const veil = (from: number) =>
    armed && stage < from ? 'pointer-events-none opacity-0' : 'opacity-100'

  return (
    <div
      ref={root}
      className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-5 py-10 sm:px-10 sm:py-14"
    >
      {/* The connector, measured from the marks themselves. Below the
          two-column breakpoint the blocks stack and the diagonal has nowhere
          to go without crossing the copy, so it is faded out rather than
          removed — the path still has to be measurable for the draw. */}
      <svg
        ref={svg}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0 sm:opacity-100"
      >
        <defs>
          <linearGradient
            ref={fade}
            id="bridge-flow"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0" />
            <stop offset="14%" stopColor="var(--brand)" stopOpacity="0.55" />
            <stop offset="30%" stopColor="var(--brand)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="1" />
          </linearGradient>
          <filter
            id="bridge-bloom"
            x="-40%"
            y="-400%"
            width="180%"
            height="900%"
          >
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <path
          ref={halo}
          fill="none"
          stroke="url(#bridge-flow)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0"
          filter="url(#bridge-bloom)"
        />
        <path
          ref={wire}
          fill="none"
          stroke="url(#bridge-flow)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle
          ref={head}
          r="3.5"
          fill="#fff"
          opacity="0"
          className="bridge-head"
        />
      </svg>

      {/* ---- row one: Ethixweb left, its story right ---- */}
      <div className="relative z-10 grid gap-8 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] sm:gap-14">
        <div>
          <img
            ref={mark}
            src="/ethixweb-black.png"
            alt="Ethixweb"
            className="h-6 w-auto sm:h-7"
            loading="eager"
            decoding="async"
          />

          <div className={`mt-5 transition-opacity duration-300 ${veil(1)}`}>
            <BlurText
              text="Then"
              start={stage >= 1}
              delay={60}
              className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--ink-faint)] sm:text-[11px]"
            />
            <BlurText
              text="Web & Marketing"
              start={stage >= 1}
              delay={80}
              className="mt-1.5 text-sm font-bold uppercase tracking-[0.14em] text-[var(--ink)]"
            />

            <ul className="mt-5 flex flex-col gap-3">
              {THEN.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 rounded-full ring-1 ring-[var(--ink-faint)]"
                  />
                  <BlurText
                    as="span"
                    text={item}
                    start={stage >= 1}
                    delay={60}
                    stepDuration={0.3}
                    className="text-sm font-medium text-[var(--ink-soft)]"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          className={`max-w-[46ch] border-l border-[var(--line)] pl-5 text-sm leading-[1.75] text-[var(--ink-soft)] transition-opacity duration-500 sm:pl-8 sm:text-[15px] ${veil(
            1,
          )}`}
        >
          {ETHIXWEB_COPY}
        </p>
      </div>

      {/* ---- row two: MegaCloudWorks' story left, the studio right ---- */}
      {/* the gap between the rows was tuned for a long diagonal; pulled in so
          the two marks sit closer together and the whole card — escape hatch
          included — lands inside one screen */}
      <div className="relative z-10 mt-12 grid gap-8 sm:mt-16 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] sm:gap-14">
        <p
          className={`order-2 max-w-[46ch] border-l border-[var(--line)] pl-5 text-sm leading-[1.75] text-[var(--ink-soft)] transition-opacity duration-500 sm:order-1 sm:ml-auto sm:border-l-0 sm:border-r sm:pl-0 sm:pr-8 sm:text-right sm:text-[15px] ${veil(
            3,
          )}`}
        >
          {MEGACLOUD_COPY}
        </p>

        <div className="order-1 sm:order-2 sm:flex sm:flex-col sm:items-end sm:text-right">
          <img
            ref={cloud}
            src="/logo-mark.svg"
            alt="MegaCloudWorks"
            className={`bridge-cloud h-9 w-auto sm:-mt-8 sm:h-10 ${
              stage >= 2 ? 'is-live' : ''
            } ${armed && stage < 1 ? 'opacity-0' : ''}`}
            loading="eager"
            decoding="async"
          />

          <div
            className={`mt-5 sm:flex sm:flex-col sm:items-end ${veil(3)} transition-opacity duration-300`}
          >
            <BlurText
              text="Now"
              start={stage >= 3}
              delay={60}
              className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--brand)] sm:text-[11px]"
            />
            <BlurText
              text="App Design & Development"
              start={stage >= 3}
              delay={70}
              className="mt-1.5 text-sm font-bold uppercase tracking-[0.14em] text-[var(--ink)]"
            />

            <ul className="mt-5 flex flex-col gap-3">
              {NOW.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 sm:flex-row-reverse"
                >
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 rounded-full bg-[var(--brand)]"
                  />
                  <BlurText
                    as="span"
                    text={item}
                    start={stage >= 3}
                    delay={60}
                    stepDuration={0.3}
                    className="text-sm font-semibold text-[var(--ink)]"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ---- escape hatch ---- */}
      <div
        className={`relative z-10 mt-14 flex flex-col items-center gap-4 border-t border-[var(--line)] pt-8 transition-opacity duration-500 ${veil(
          3,
        )}`}
      >
        <p className="text-sm text-[var(--ink-soft)]">
          Looking for websites instead?
        </p>
        <a
          href="https://ethixweb.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--brand)] px-6 text-sm font-semibold text-white no-underline transition-colors hover:bg-[var(--brand-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
        >
          Visit Ethixweb
          <span className="sr-only">(opens in a new tab)</span>
          <ArrowRight className="size-4" strokeWidth={2.4} />
        </a>
      </div>
    </div>
  )
}

export default StudioBridge
