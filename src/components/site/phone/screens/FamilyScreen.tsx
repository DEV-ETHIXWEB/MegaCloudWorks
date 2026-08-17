import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { BlurText } from '../../BlurText'
import { SCREEN_PX } from '../story'

/**
 * The beat the copy arrives on.
 *
 * The About hero can afford a slow cadence because the reader is parked on it;
 * here the act is one stop in a scroll story, and anything that is still
 * assembling when the reader has finished reading it feels broken. The whole
 * screen is now in under a second and a half, first line included.
 */
const BEAT_MS = 200
const BEATS = 6

/**
 * Act two, on the device: where MegaCloudWorks sits inside EthixWeb.
 *
 * On a wide screen the phone turns a quarter turn in the scene, so the content
 * here is pre-rotated by the same amount inside the portrait display, which
 * lands it upright — that is why the landscape branch is written at 712 × 340
 * rather than 340 × 712. A portrait viewport has no room for that, so there the
 * phone stays upright and the two studios stack instead.
 *
 * The copy arrives on the BlurText beat system the About hero uses, on its own
 * clock rather than on scroll — the act is a single resting stop, so there is
 * no scroll left to drive it with once you are here.
 */
export function FamilyScreen({
  landscape = true,
  onOpen,
}: {
  landscape?: boolean
  onOpen?: (hash: string) => void
}) {
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBeat(BEATS)
      return
    }
    // the first beat lands on arrival rather than one tick later: the header is
    // the anchor for everything under it and waiting on it reads as a stall
    let n = 1
    setBeat(1)
    const id = window.setInterval(() => {
      n += 1
      setBeat(n)
      if (n >= BEATS) window.clearInterval(id)
    }, BEAT_MS)
    return () => window.clearInterval(id)
  }, [])

  /* ---------- EthixWeb's half: their site's black and red ---------- */
  const them = (
    <section className="fam__col fam__col--them">
      <img
        src="/ethixweb-light.png"
        alt="EthixWeb"
        width={422}
        height={63}
        decoding="async"
        className="fam__logo"
        style={{ opacity: beat >= 1 ? 1 : 0 }}
      />

      <span className="fam__badge" data-in={beat >= 2}>
        EthixWeb
      </span>
      <BlurText
        as="div"
        text="Web design."
        animateBy="letters"
        start={beat >= 2}
        delay={16}
        stepDuration={0.22}
        className="fam__title"
      />
      <BlurText
        text="Sites that carry a brand properly and convert the people who land on them."
        start={beat >= 3}
        delay={13}
        stepDuration={0.2}
        className="fam__body"
      />

      {/* the parent statement belongs on the parent's side of the seam */}
      <BlurText
        as="span"
        text="MegaCloudWorks is part of EthixWeb"
        start={beat >= 1}
        delay={13}
        stepDuration={0.22}
        className="fam__kicker"
      />
    </section>
  )

  /* ---------- our half: the studio's own paper and red ---------- */
  const us = (
    <section className="fam__col fam__col--us">
      {/* our wordmark answers theirs across the seam, on the same line */}
      <img
        src="/logo-resized.svg"
        alt="MegaCloudWorks"
        width={236}
        height={32}
        decoding="async"
        className="fam__logo"
        style={{ opacity: beat >= 1 ? 1 : 0 }}
      />

      <span className="fam__badge fam__badge--us" data-in={beat >= 4}>
        MegaCloudWorks
      </span>
      <BlurText
        as="div"
        text="Fully working apps."
        animateBy="letters"
        start={beat >= 4}
        delay={16}
        stepDuration={0.22}
        className="fam__title fam__title--us"
      />
      <BlurText
        text="Not a prototype and not a demo — the product our clients actually asked for, in the store."
        start={beat >= 5}
        delay={13}
        stepDuration={0.2}
        className="fam__body"
      />

      <footer className="fam__foot" data-in={beat >= 6}>
        <BlurText
          as="span"
          text="One group, two studios — the web team and the app team sit in the same room."
          start={beat >= 6}
          delay={10}
          stepDuration={0.2}
        />
        <button
          type="button"
          className="fam__cta"
          onClick={() => onOpen?.('app-development')}
        >
          See what we build
          <ArrowRight size={13} strokeWidth={2.8} />
        </button>
      </footer>
    </section>
  )

  return (
    <div
      className={`phone-screen fam ${landscape ? '' : 'fam--portrait'}`.trim()}
      style={{ width: SCREEN_PX.w, height: SCREEN_PX.h }}
    >
      {/* the quarter turn that cancels out the phone's own, so everything
          inside can be written the right way up */}
      <div
        className="fam__rot"
        style={
          landscape
            ? { width: SCREEN_PX.h, height: SCREEN_PX.w }
            : { width: SCREEN_PX.w, height: SCREEN_PX.h }
        }
      >
        {them}
        {us}

        {/* the hand-off, sitting on the seam between the two houses */}
        <span className="fam__link" data-in={beat >= 3} aria-hidden="true">
          <ArrowRight size={14} strokeWidth={2.6} />
        </span>
      </div>
    </div>
  )
}

export default FamilyScreen
