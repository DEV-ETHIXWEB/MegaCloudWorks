import { useEffect, useState } from 'react'

/**
 * Forensic diagnostic overlay for tracking down device-specific rendering
 * bugs that don't reproduce in any emulator/BrowserStack session — visible
 * only when a report is actively being chased (?debug=1 in the URL), never
 * to a normal visitor. Renders every metric a real bug report needs
 * (viewport vs visualViewport vs screen, DPR, UA) plus a recursive
 * containment scan that catches an element rendering outside its parent's
 * box even when document.scrollWidth reports no overflow at all — the
 * class of bug that only shows up as a bad screenshot, never as a
 * horizontal scrollbar.
 */

type Offender = {
  selector: string
  reason: string
  rect: string
  parentRect: string
  overflowPx: number
  possiblyAnimated: boolean
}

function describeEl(el: Element): string {
  const tag = el.tagName.toLowerCase()
  const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 3).join('.') : ''
  return cls ? `${tag}.${cls}` : tag
}

function scanContainment(tolerance = 1): Offender[] {
  const offenders: Offender[] = []
  const all = document.querySelectorAll<HTMLElement>('body *')
  for (const el of all) {
    const parent = el.parentElement
    if (!parent) continue
    const cs = getComputedStyle(el)
    if (cs.position === 'fixed' || cs.position === 'sticky') continue
    // decorative bleed (blur circles, corner accents) is always
    // pointer-events:none and always meant to spill past its card —
    // real content a visitor could read or tap never sets this
    if (cs.pointerEvents === 'none') continue
    // decorative/intentionally-overflowing elements opt out with this marker
    if (el.closest('[data-allow-overflow]')) continue

    const rect = el.getBoundingClientRect()
    const parentRect = parent.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) continue

    const parentOverflow = getComputedStyle(parent).overflow
    const parentClipsX = parentOverflow === 'hidden' || getComputedStyle(parent).overflowX === 'hidden'
    const parentClipsY = parentOverflow === 'hidden' || getComputedStyle(parent).overflowY === 'hidden'

    // a JS-driven animation (Motion, WAAPI) writes directly to el.style —
    // distinct from a permanent transform set via a stylesheet/className —
    // so a mid-flight sweep or slide reads as "possibly animated" rather
    // than silently dropped: still reported, just flagged as likely noise
    const possiblyAnimated = el.style.transform !== '' || el.getAnimations().length > 0

    // only flag against a parent that is SUPPOSED to contain this child
    // (i.e. clips overflow) — a plain non-clipping parent is expected to
    // have children extend past it (that's normal flow), so it's not a bug
    if (parentClipsX) {
      if (rect.right > parentRect.right + tolerance) {
        offenders.push({
          selector: describeEl(el),
          reason: 'right edge exceeds clipping parent',
          rect: `${rect.left.toFixed(1)},${rect.top.toFixed(1)} ${rect.width.toFixed(1)}x${rect.height.toFixed(1)}`,
          parentRect: `${parentRect.left.toFixed(1)},${parentRect.top.toFixed(1)} ${parentRect.width.toFixed(1)}x${parentRect.height.toFixed(1)}`,
          overflowPx: rect.right - parentRect.right,
          possiblyAnimated,
        })
      }
      if (rect.left < parentRect.left - tolerance) {
        offenders.push({
          selector: describeEl(el),
          reason: 'left edge exceeds clipping parent',
          rect: `${rect.left.toFixed(1)},${rect.top.toFixed(1)} ${rect.width.toFixed(1)}x${rect.height.toFixed(1)}`,
          parentRect: `${parentRect.left.toFixed(1)},${parentRect.top.toFixed(1)} ${parentRect.width.toFixed(1)}x${parentRect.height.toFixed(1)}`,
          overflowPx: parentRect.left - rect.left,
          possiblyAnimated,
        })
      }
    }
    if (parentClipsY) {
      if (rect.bottom > parentRect.bottom + tolerance) {
        offenders.push({
          selector: describeEl(el),
          reason: 'bottom edge exceeds clipping parent',
          rect: `${rect.left.toFixed(1)},${rect.top.toFixed(1)} ${rect.width.toFixed(1)}x${rect.height.toFixed(1)}`,
          parentRect: `${parentRect.left.toFixed(1)},${parentRect.top.toFixed(1)} ${parentRect.width.toFixed(1)}x${parentRect.height.toFixed(1)}`,
          overflowPx: rect.bottom - parentRect.bottom,
          possiblyAnimated,
        })
      }
    }
  }
  // biggest offenders first, capped so the report stays readable
  return offenders.sort((a, b) => b.overflowPx - a.overflowPx).slice(0, 25)
}

function buildReport(): string {
  const nav = navigator
  const vv = window.visualViewport
  const lines = [
    `--- MegaCloudWorks diagnostic report ---`,
    `time: ${new Date().toISOString()}`,
    `url: ${location.href}`,
    `commit: ${import.meta.env.VITE_COMMIT_SHA ?? 'unknown'}`,
    ``,
    `userAgent: ${nav.userAgent}`,
    `platform: ${nav.platform ?? 'n/a'}`,
    `devicePixelRatio: ${window.devicePixelRatio}`,
    ``,
    `window.innerWidth/innerHeight: ${window.innerWidth} x ${window.innerHeight}`,
    `screen.width/height: ${screen.width} x ${screen.height}`,
    `document.documentElement.clientWidth/clientHeight: ${document.documentElement.clientWidth} x ${document.documentElement.clientHeight}`,
    `document.documentElement.scrollWidth/scrollHeight: ${document.documentElement.scrollWidth} x ${document.documentElement.scrollHeight}`,
    `document.body.scrollWidth: ${document.body.scrollWidth}`,
    vv
      ? `visualViewport width/height/scale/offsetLeft/offsetTop: ${vv.width} x ${vv.height} scale=${vv.scale} offset=(${vv.offsetLeft},${vv.offsetTop})`
      : `visualViewport: unavailable`,
    `prefers-reduced-motion: ${window.matchMedia('(prefers-reduced-motion: reduce)').matches}`,
    `orientation: ${screen.orientation ? screen.orientation.type : 'n/a'}`,
  ]

  const offenders = scanContainment()
  const staticCount = offenders.filter((o) => !o.possiblyAnimated).length
  lines.push(
    '',
    `containment scan: ${offenders.length} offender(s) found (${staticCount} static, ${offenders.length - staticCount} mid-animation — a mid-animation hit is often just a slide/sweep caught mid-motion, not a bug)`,
  )
  offenders.forEach((o, i) => {
    lines.push(
      `  [${i + 1}]${o.possiblyAnimated ? ' [ANIMATED]' : ''} ${o.selector} — ${o.reason}, overflow ${o.overflowPx.toFixed(1)}px`,
      `      el:     ${o.rect}`,
      `      parent: ${o.parentRect}`,
    )
  })

  return lines.join('\n')
}

export function DebugOverlay() {
  const [report, setReport] = useState('')
  const [copied, setCopied] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const update = () => setReport(buildReport())
    update()
    const id = window.setInterval(update, 1000)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [tick])

  const offenderCount = Number(report.match(/containment scan: (\d+)/)?.[1] ?? 0)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2147483647,
        background: 'rgba(10,10,14,0.94)',
        color: offenderCount > 0 ? '#ff6a6a' : '#7CFC9A',
        fontFamily: 'ui-monospace, monospace',
        fontSize: 11,
        lineHeight: 1.5,
        maxHeight: '45vh',
        overflowY: 'auto',
        padding: '10px 12px',
        borderTop: '2px solid #f5333b',
      }}
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setTick((t) => t + 1)}
          style={{ background: '#f5333b', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 700 }}
        >
          Refresh
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(report)
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1500)
            } catch {
              /* clipboard API unavailable; report is still visible to select/copy manually */
            }
          }}
          style={{ background: '#222', color: 'white', border: '1px solid #444', borderRadius: 4, padding: '4px 10px', fontWeight: 700 }}
        >
          {copied ? 'Copied ✓' : 'Copy report'}
        </button>
        <span style={{ color: '#999', alignSelf: 'center' }}>
          {offenderCount} offender{offenderCount === 1 ? '' : 's'} · diagnostic mode (?debug=1)
        </span>
      </div>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{report}</pre>
    </div>
  )
}
