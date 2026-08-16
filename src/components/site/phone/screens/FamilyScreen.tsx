import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { BlurText } from '../../BlurText'
import { SCREEN_PX } from '../story'

/** Beats per second-ish — the same unhurried cadence the About hero runs at. */
const BEAT_MS = 420
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
    let n = 0
    const id = window.setInterval(() => {
      n += 1
      setBeat(n)
      if (n >= BEATS) window.clearInterval(id)
    }, BEAT_MS)
    return () => window.clearInterval(id)
  }, [])

  const head = (
    <header className="fam__head">
      <img
        src="/ethixweb-black.png"
        alt="EthixWeb"
        className="fam__logo"
        style={{ opacity: beat >= 1 ? 1 : 0 }}
      />
      <span className="fam__rule" data-in={beat >= 1} />
      <BlurText
        as="span"
        text="MegaCloudWorks is part of EthixWeb"
        start={beat >= 1}
        delay={26}
        stepDuration={0.3}
        className="fam__kicker"
      />
    </header>
  )

  const columns = (
    <div className="fam__cols">
      <section className="fam__col">
        <span className="fam__badge" data-in={beat >= 2}>
          EthixWeb
        </span>
        <BlurText
          as="div"
          text="Web design."
          animateBy="letters"
          start={beat >= 2}
          delay={30}
          stepDuration={0.3}
          className="fam__title"
        />
        <BlurText
          text="Sites that carry a brand properly and convert the people who land on them."
          start={beat >= 3}
          delay={26}
          stepDuration={0.28}
          className="fam__body"
        />
      </section>

      <span className="fam__link" data-in={beat >= 3} aria-hidden="true">
        <ArrowRight size={14} strokeWidth={2.6} />
      </span>

      <section className="fam__col fam__col--us">
        <span className="fam__badge fam__badge--us" data-in={beat >= 4}>
          MegaCloudWorks
        </span>
        <BlurText
          as="div"
          text="Fully working apps."
          animateBy="letters"
          start={beat >= 4}
          delay={30}
          stepDuration={0.3}
          className="fam__title fam__title--us"
        />
        <BlurText
          text="Not a prototype and not a demo — the product our clients actually asked for, in the store."
          start={beat >= 5}
          delay={26}
          stepDuration={0.28}
          className="fam__body"
        />
      </section>
    </div>
  )

  const foot = (
    <footer className="fam__foot" data-in={beat >= 6}>
      <BlurText
        as="span"
        text="One group, two studios — the web team and the app team sit in the same room."
        start={beat >= 6}
        delay={20}
        stepDuration={0.26}
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
        {head}
        {columns}
        {foot}
      </div>
    </div>
  )
}

export default FamilyScreen
