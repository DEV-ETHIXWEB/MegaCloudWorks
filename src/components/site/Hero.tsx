import { NotifyForm } from './NotifyForm'
import { SmokeBackground } from './SmokeBackground'

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-white bg-[image:url('/hero.webp')] bg-[length:70%] bg-[position:right_bottom] bg-no-repeat"
    >
      {/* ---- animated red smoke: above the baked-in smog, streaming top-right → lower-left ---- */}
      <SmokeBackground className="mix-blend-multiply" />

      {/* ---- re-stamp the phone AND rock on top so the smoke passes BEHIND them
              (pixel-aligned with the base image — the photo itself is untouched) ---- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[image:url('/foreground.webp')] bg-[length:70%] bg-[position:right_bottom] bg-no-repeat"
      />

      {/* ---- faint scrim behind the copy so it stays readable over the smoke ---- */}
      {/* desktop: left-weighted */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0.35)_32%,rgba(255,255,255,0)_58%)] lg:block"
      />
      {/* mobile: top-weighted (protects the stacked copy, lets smoke stay strong by the phone) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.55)_46%,rgba(255,255,255,0.18)_68%,rgba(255,255,255,0)_85%)] lg:hidden"
      />

      <div className="relative mx-auto grid min-h-screen max-w-[1200px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-2 lg:gap-4 lg:pb-0 lg:pt-0">
        {/* ---- left: copy (dark ink pinned — hero band is always light) ---- */}
        <div className="relative z-10 max-w-xl">
          <h1 className="reveal-up font-display text-[clamp(3rem,8.5vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.03em] text-[#101014]">
            <span className="block whitespace-nowrap">COMING</span>
            <span className="block whitespace-nowrap text-[var(--brand)]">
              SOON.
            </span>
          </h1>

          <p
            className="reveal-up mt-7 max-w-md text-lg leading-relaxed text-[#56575f]"
            style={{ animationDelay: '90ms' }}
          >
            Megacloud is an app design &amp; development studio crafting clean,
            fast, beautiful products. Our new home is almost ready.
          </p>

          <div className="reveal-up mt-9" style={{ animationDelay: '180ms' }}>
            <NotifyForm />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
