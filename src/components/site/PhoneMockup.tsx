import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '#/lib/utils'
import { DashboardScreen } from './PhoneScreens'

/**
 * PhoneMockup — the "reactable" mobile surface.
 *
 * The device frame is pure CSS/DOM (not an image) so the screen is a live,
 * animatable React tree. Custom animations plug in through data-attributes,
 * which GSAP queries inside this component's scope:
 *
 *   data-phone-float   → the whole device (idle float)
 *   data-phone-reveal  → any element that should stagger-in on mount
 *   data-phone-bar     → chart bars (grow from the baseline)
 *
 * Any screen passed as `children` that uses those attributes is animated
 * automatically. Pass your own screen to swap the content:
 *
 *   <PhoneMockup><MyScreen /></PhoneMockup>
 */
export function PhoneMockup({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      if (reduceMotion) return

      const intro = gsap.timeline({
        defaults: { ease: 'power3.out' },
      })

      intro
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

      // Idle float — a gentle "the product is alive" motion.
      gsap.to('[data-phone-float]', {
        y: -10,
        duration: 3.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    },
    { scope },
  )

  return (
    <div ref={scope} className={cn('relative w-full', className)}>
      <div
        data-phone-float
        className="relative mx-auto aspect-[300/620] w-full max-w-[300px] will-change-transform"
      >
        {/* device frame */}
        <div className="absolute inset-0 rounded-[2.75rem] bg-[#0a0a0c] p-[3px] shadow-[0_40px_80px_-24px_rgba(10,10,12,0.55),0_10px_30px_-12px_rgba(245,51,59,0.35)]">
          <div className="relative h-full w-full overflow-hidden rounded-[2.55rem] border border-white/5 bg-[var(--paper)]">
            {/* dynamic-island / notch */}
            <div className="absolute left-1/2 top-2.5 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-[#0a0a0c]" />
            {/* screen content */}
            <div className="h-full w-full overflow-hidden">
              {children ?? <DashboardScreen />}
            </div>
          </div>
        </div>
        {/* side buttons */}
        <div className="absolute -left-[3px] top-24 h-10 w-[3px] rounded-l bg-[#050506]" />
        <div className="absolute -left-[3px] top-36 h-14 w-[3px] rounded-l bg-[#050506]" />
        <div className="absolute -right-[3px] top-32 h-16 w-[3px] rounded-r bg-[#050506]" />
      </div>
    </div>
  )
}

export default PhoneMockup
