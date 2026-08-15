import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface NodePoint {
  x: number
  y: number
  id: string
}

interface PathData {
  d: string
  nodes: NodePoint[]
  w: number
  h: number
}

// 6 organic radial particle angles for bead pop sparks
const PARTICLE_ANGLES = [0, 60, 120, 180, 240, 300].map((deg) => {
  const rad = (deg * Math.PI) / 180
  const dist = 18 + (deg % 40) * 0.3
  return {
    x: Math.cos(rad) * dist,
    y: Math.sin(rad) * dist,
  }
})

/**
 * Continuous Single-Thread Animation System.
 * Draws ONE unbroken red silk line from card 01 through card 02 to card 03
 * in a single, smooth 3.2-second on-screen flow with dynamic node pops.
 */
export function MadeThread({
  scope,
}: {
  scope: RefObject<HTMLElement | null>
}) {
  const svg = useRef<SVGSVGElement>(null)
  const [pathData, setPathData] = useState<PathData | null>(null)
  const [drawn, setDrawn] = useState(false)

  // 1. Measure shelves and construct ONE single continuous SVG path
  useEffect(() => {
    const el = scope.current
    if (!el || typeof window === 'undefined') return

    const draw = () => {
      const shelves = Array.from(
        el.querySelectorAll<HTMLElement>('.work-made__shelf'),
      )
      if (shelves.length < 2 || window.innerWidth < 900) {
        setPathData(null)
        return
      }

      const root = el.getBoundingClientRect()
      const ends = shelves.map((s) => {
        const r = s.getBoundingClientRect()
        return {
          left: r.left - root.left,
          right: r.right - root.left,
          y: r.top - root.top + r.height / 2,
        }
      })

      // Single unbroken path starting at Shelf 0 right end
      let d = `M ${ends[0].right} ${ends[0].y}`
      const nodes: NodePoint[] = [
        { x: ends[0].right, y: ends[0].y, id: 'node-0' },
      ]

      for (let i = 0; i < ends.length - 1; i++) {
        const a = ends[i]
        const b = ends[i + 1]
        const reach = (b.left - a.right) * 0.55

        if (i > 0) {
          // Traverse across shelf i from left to right
          d += ` L ${a.right} ${a.y}`
          nodes.push({ x: a.right, y: a.y, id: `node-${nodes.length}` })
        }

        // Curve from shelf i right to shelf i+1 left
        d += ` C ${a.right + reach} ${a.y}, ${b.left - reach} ${b.y}, ${b.left} ${b.y}`
        nodes.push({ x: b.left, y: b.y, id: `node-${nodes.length}` })
      }

      setPathData({
        d,
        nodes,
        w: root.width,
        h: root.height,
      })
    }

    draw()

    const ro = new ResizeObserver(draw)
    ro.observe(el)
    window.addEventListener('resize', draw)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', draw)
    }
  }, [scope])

  // 2. Intersection trigger for scroll arrival
  useEffect(() => {
    const el = svg.current
    if (!el || !pathData || drawn) return

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDrawn(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        setDrawn(true)
        io.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)

    const safety = window.setTimeout(() => setDrawn(true), 3500)
    return () => {
      window.clearTimeout(safety)
      io.disconnect()
    }
  }, [pathData, drawn])

  // 3. Continuous GSAP Draw Animation (3.2-second fluid flow 1 -> 3)
  useEffect(() => {
    const svgEl = svg.current
    if (!svgEl || !pathData || !drawn) return

    const ctx = gsap.context(() => {
      const pathEl = svgEl.querySelector<SVGPathElement>('.work-thread__path')
      const pulseEl = svgEl.querySelector<SVGPathElement>('.work-thread__pulse')
      const cometEl = svgEl.querySelector<SVGGElement>('.work-thread__comet')
      const nodeEls = svgEl.querySelectorAll<SVGGElement>('.work-thread__node')

      if (!pathEl) return
      const totalLen = Math.ceil(pathEl.getTotalLength())

      // Find exact path length corresponding to each node point
      const nodeLengths = pathData.nodes.map((node) => {
        let bestL = 0
        let minDist = Infinity
        for (let l = 0; l <= totalLen; l += 2) {
          const pt = pathEl.getPointAtLength(l)
          const dist = Math.hypot(pt.x - node.x, pt.y - node.y)
          if (dist < minDist) {
            minDist = dist
            bestL = l
          }
        }
        return bestL
      })

      // Hide path stroke & setup comet & nodes
      gsap.set(pathEl, {
        strokeDasharray: totalLen,
        strokeDashoffset: totalLen,
        opacity: 1,
      })
      if (pulseEl) {
        gsap.set(pulseEl, { opacity: 0 })
      }
      if (cometEl) {
        gsap.set(cometEl, { opacity: 0, scale: 0 })
        const p0 = pathEl.getPointAtLength(0)
        gsap.set(cometEl, { x: p0.x, y: p0.y })
      }

      // Hide all node beads, core, rings, and particles initially
      nodeEls.forEach((nodeGroup) => {
        const bead = nodeGroup.querySelector('.work-thread__bead')
        const core = nodeGroup.querySelector('.work-thread__bead-core')
        const rings = nodeGroup.querySelectorAll('.work-thread__ripple')
        const particles = nodeGroup.querySelectorAll('.work-thread__particle')

        gsap.set([bead, core], {
          scale: 0,
          opacity: 0,
          transformOrigin: '50% 50%',
        })
        gsap.set(rings, {
          scale: 0.5,
          opacity: 0,
          transformOrigin: '50% 50%',
        })
        gsap.set(particles, {
          scale: 1,
          opacity: 0,
          x: 0,
          y: 0,
          transformOrigin: '50% 50%',
        })
      })

      // Helper function to trigger a liquid pop on a specific node
      const popNode = (nodeIdx: number) => {
        const nodeGroup = nodeEls[nodeIdx]
        if (!nodeGroup) return

        const bead = nodeGroup.querySelector('.work-thread__bead')
        const core = nodeGroup.querySelector('.work-thread__bead-core')
        const rings = nodeGroup.querySelectorAll('.work-thread__ripple')
        const particles = nodeGroup.querySelectorAll('.work-thread__particle')

        // Bead bounce pop
        gsap.to(bead, {
          scale: 1.5,
          opacity: 1,
          duration: 0.35,
          ease: 'back.out(2.8)',
          onComplete: () => {
            gsap.to(bead, {
              scale: 1,
              duration: 0.45,
              ease: 'elastic.out(1.2, 0.4)',
            })
          },
        })

        gsap.to(core, {
          scale: 1,
          opacity: 1,
          duration: 0.25,
          ease: 'power2.out',
          delay: 0.08,
        })

        // Shockwaves burst
        rings.forEach((ring, rIdx) => {
          gsap.to(ring, {
            scale: 4.5 + rIdx * 2,
            opacity: rIdx === 0 ? 0.9 : 0.65,
            duration: 0.1,
            delay: rIdx * 0.08,
            onComplete: () => {
              gsap.to(ring, {
                opacity: 0,
                strokeWidth: 0.2,
                duration: 0.65,
                ease: 'power2.out',
              })
            },
          })
        })

        // Micro-particles burst
        particles.forEach((p, pIdx) => {
          const angle = PARTICLE_ANGLES[pIdx % PARTICLE_ANGLES.length]
          gsap.to(p, {
            x: angle.x * 1.3,
            y: angle.y * 1.3,
            opacity: 0.9,
            duration: 0.1,
            onComplete: () => {
              gsap.to(p, {
                x: angle.x * 2.1,
                y: angle.y * 2.1,
                scale: 0,
                opacity: 0,
                duration: 0.5,
                ease: 'power3.out',
              })
            },
          })
        })
      }

      // Track which nodes have popped
      const poppedNodes = new Set<number>()

      // Master Timeline: 3.2 seconds continuous smooth draw from 1 to 3
      const drawTl = gsap.timeline()

      // Pop Node 0 at t = 0s
      popNode(0)
      poppedNodes.add(0)

      // Fade in travelling comet spark
      drawTl.to(
        cometEl,
        {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          ease: 'power1.out',
        },
        0,
      )

      // Continuous draw from 0 to 1 over 3.2 seconds
      const drawProgress = { progress: 0 }
      drawTl.to(
        drawProgress,
        {
          progress: 1,
          duration: 3.2,
          ease: 'power2.inOut',
          onUpdate: () => {
            const p = drawProgress.progress
            const currentLen = p * totalLen

            // Update path dashoffset
            pathEl.style.strokeDashoffset = String(totalLen * (1 - p))

            // Update travelling comet position
            const pt = pathEl.getPointAtLength(currentLen)
            if (cometEl) {
              gsap.set(cometEl, { x: pt.x, y: pt.y })
            }

            // Check node arrivals and pop sequentially
            nodeLengths.forEach((nodeL, idx) => {
              if (idx > 0 && !poppedNodes.has(idx) && currentLen >= nodeL - 8) {
                poppedNodes.add(idx)
                popNode(idx)
              }
            })
          },
        },
        0,
      )

      // Fade out comet at the end of the line
      drawTl.to(
        cometEl,
        {
          opacity: 0,
          scale: 1.6,
          duration: 0.3,
          ease: 'power2.in',
        },
        3.1,
      )

      // Activate continuous energy pulse after draw completes
      drawTl.call(() => {
        if (pulseEl) {
          gsap.to(pulseEl, {
            opacity: 0.9,
            duration: 0.8,
          })
        }
      })
    }, svgEl)

    return () => ctx.revert()
  }, [pathData, drawn])

  // 4. Interactive Card Hover Physics
  useEffect(() => {
    const parentEl = scope.current
    const svgEl = svg.current
    if (!parentEl || !svgEl || !drawn || !pathData) return

    const items = parentEl.querySelectorAll<HTMLElement>('.work-made__item')
    const cleanupFns: Array<() => void> = []

    items.forEach((item, cardIdx) => {
      const onEnter = () => {
        const nodeEls = svgEl.querySelectorAll<SVGGElement>('.work-thread__node')
        const targetNodes: Element[] = []

        if (cardIdx === 0 && nodeEls[0]) targetNodes.push(nodeEls[0])
        if (cardIdx === 1 && nodeEls[1] && nodeEls[2]) {
          targetNodes.push(nodeEls[1], nodeEls[2])
        }
        if (cardIdx === 2 && nodeEls[3]) targetNodes.push(nodeEls[3])

        targetNodes.forEach((nodeGroup) => {
          const bead = nodeGroup.querySelector('.work-thread__bead')
          if (bead) {
            gsap.to(bead, {
              scale: 1.45,
              duration: 0.25,
              ease: 'back.out(3)',
              yoyo: true,
              repeat: 1,
            })
          }
        })
      }

      item.addEventListener('mouseenter', onEnter)
      cleanupFns.push(() => item.removeEventListener('mouseenter', onEnter))
    })

    return () => cleanupFns.forEach((fn) => fn())
  }, [scope, drawn, pathData])

  if (!pathData) return null

  return (
    <svg
      ref={svg}
      aria-hidden="true"
      data-drawn={drawn ? '' : undefined}
      className="work-thread"
      viewBox={`0 0 ${pathData.w} ${pathData.h}`}
      width={pathData.w}
      height={pathData.h}
      fill="none"
    >
      <defs>
        {/* Soft glowing ambient filter */}
        <filter id="thread-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Crisp pop glow filter */}
        <filter id="bead-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Subtle background track */}
      <path className="work-thread__path-bg" d={pathData.d} />

      {/* Main single continuous silk line */}
      <path
        className="work-thread__path"
        d={pathData.d}
        filter="url(#thread-glow)"
      />

      {/* Continuous energy pulse overlay */}
      <path className="work-thread__pulse" d={pathData.d} />

      {/* Travelling Comet Spark Head */}
      <g className="work-thread__comet">
        <circle r="9" fill="url(#bead-glow)" opacity="0.45" />
        <circle r="4" fill="#ffffff" />
        <circle r="2" fill="#ff4d55" />
      </g>

      {/* Node Bead Groups (positioned along the single continuous line) */}
      {pathData.nodes.map((node) => (
        <g key={node.id} className="work-thread__node">
          {/* Shockwave Ripples */}
          <circle
            className="work-thread__ripple work-thread__ripple--1"
            cx={node.x}
            cy={node.y}
            r="4"
          />
          <circle
            className="work-thread__ripple work-thread__ripple--2"
            cx={node.x}
            cy={node.y}
            r="4"
          />

          {/* Radial Micro-Particles */}
          {PARTICLE_ANGLES.map((_, pIdx) => (
            <circle
              key={pIdx}
              className="work-thread__particle"
              cx={node.x}
              cy={node.y}
              r="1.4"
              fill="#f5333b"
            />
          ))}

          {/* Main 3D Bead */}
          <circle
            className="work-thread__bead"
            cx={node.x}
            cy={node.y}
            r="5.5"
            filter="url(#bead-glow)"
          />

          {/* White Core Highlight */}
          <circle
            className="work-thread__bead-core"
            cx={node.x}
            cy={node.y}
            r="2"
          />
        </g>
      ))}
    </svg>
  )
}

export default MadeThread
