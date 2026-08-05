import { NotifyForm } from './NotifyForm'
import { CloudField } from './CloudField'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      {/* ---------- desktop: full-bleed layered backdrop ---------- */}
      {/* soft cloud bank drifting lower-left → upper-right, behind the phone */}
      <CloudField className="hidden lg:block" />
      {/* phone + rock cutout (transparent bg) on top, so the clouds pass BEHIND it */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[image:url('/phone-rock.webp')] bg-[length:70%] bg-[position:right_bottom] bg-no-repeat lg:block"
      />
      {/* left-weighted white scrim so the headline & copy stay readable over the clouds */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.45)_24%,rgba(255,255,255,0)_48%)] lg:block"
      />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-0 px-6 pt-28 sm:px-10 lg:min-h-screen lg:grid-cols-2 lg:gap-4 lg:px-20 lg:pb-0 lg:pt-0">
        {/* ---- left: copy (dark ink pinned — hero band is always light) ---- */}
        <div className="relative z-10 max-w-xl">
          <h1 className="reveal-up font-display text-[clamp(3.75rem,11vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.03em] text-[#101014]">
            <span className="block whitespace-nowrap">COMING</span>
            <span className="block whitespace-nowrap text-[var(--brand)]">
              SOON.
            </span>
          </h1>

          <p
            className="reveal-up mt-7 max-w-md text-lg leading-relaxed text-[#56575f]"
            style={{ animationDelay: '90ms' }}
          >
            MegaCloudWorks is an app design &amp; development studio crafting
            clean, fast, beautiful products. Our new home is almost ready.
          </p>

          <div className="reveal-up mt-9" style={{ animationDelay: '180ms' }}>
            <NotifyForm />
          </div>
        </div>

        {/* ---- mobile: the visual gets its own full-bleed block below the copy ---- */}
        <div className="relative -mx-6 mt-12 h-[26rem] overflow-hidden sm:-mx-10 sm:h-[32rem] lg:hidden">
          {/* clouds sit behind the phone, filling the block edge to edge */}
          <CloudField stageClassName="bottom-[-10%] right-[-10%] h-[85%] w-[150%]" />
          <img
            src="/phone-rock.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 size-full select-none object-cover object-[center_bottom]"
          />
          {/* soft top fade so the visual melts into the copy above it */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(to_bottom,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)]"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
