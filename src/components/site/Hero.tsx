import { NotifyForm } from './NotifyForm'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* ---- right: composed hero visual (phone + smoke + rock), full-bleed on lg ---- */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] xl:w-[52%] lg:block">
        <img
          src="/hero.png"
          alt="Megacloud app on a phone rising from red smoke"
          className="reveal-up h-full w-full object-cover object-center"
          style={{ animationDelay: '120ms' }}
          fetchPriority="high"
        />
      </div>

      <div className="mx-auto grid min-h-screen max-w-[1200px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-2 lg:gap-4 lg:pb-0 lg:pt-0">
        {/* ---- left: copy ---- */}
        <div className="relative z-10 max-w-xl">
          <h1 className="reveal-up font-display text-[clamp(3rem,8.5vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.03em] text-[var(--ink)]">
            <span className="block whitespace-nowrap">COMING</span>
            <span className="block whitespace-nowrap text-[var(--brand)]">
              SOON.
            </span>
          </h1>

          <p
            className="reveal-up mt-7 max-w-md text-lg leading-relaxed text-[var(--ink-soft)]"
            style={{ animationDelay: '90ms' }}
          >
            Megacloud is an app design &amp; development studio crafting clean,
            fast, beautiful products. Our new home is almost ready.
          </p>

          <div className="reveal-up mt-9" style={{ animationDelay: '180ms' }}>
            <NotifyForm />
          </div>
        </div>

        {/* ---- mobile / tablet: inline hero visual ---- */}
        <div className="relative flex items-center justify-center lg:hidden">
          <img
            src="/hero.png"
            alt="Megacloud app on a phone rising from red smoke"
            className="reveal-up w-full max-w-[540px] object-contain"
            style={{ animationDelay: '120ms' }}
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
