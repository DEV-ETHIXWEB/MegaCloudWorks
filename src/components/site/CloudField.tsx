import { cn } from '#/lib/utils'

/**
 * One large cloud sitting around the phone that continuously cross-fades between
 * the four cloud shapes, so it reads as a single big, slowly-evolving cloud.
 *
 * The stage is tilted (rotated) to follow the rising diagonal behind the phone;
 * the inner ".cloud-slide" layer slides left↔right which - because its parent is
 * rotated - travels up and down that diagonal. A slow zoom keeps it alive.
 * Decorative and SSR-safe; under prefers-reduced-motion a single cloud is shown
 * statically (see styles.css).
 */
const CLOUDS = [
  '/cloud-1.webp',
  '/cloud-2.webp',
  '/cloud-3.webp',
  '/cloud-4.webp',
]
const CYCLE = 32 // seconds for a full loop through all four shapes

export function CloudField({
  className,
  stageClassName = 'left-[16%] top-[2%] h-[92%] w-[124%]',
}: {
  className?: string
  stageClassName?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
    >
      {/* tilted, zoomed-in stage positioned along the diagonal behind the phone */}
      <div
        className={cn('absolute', stageClassName)}
        style={{
          transform: 'rotate(-15deg)',
          transformOrigin: 'center',
          ['--cloud-o' as string]: 0.96,
        }}
      >
        {/* slides up/down the diagonal (parent is rotated) */}
        <div className="cloud-slide absolute inset-0">
          {CLOUDS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              loading="eager"
              decoding="async"
              className="cloud-cross absolute inset-0 h-full w-full max-w-none select-none object-contain object-center"
              style={{
                animationDuration: `${CYCLE}s`,
                animationDelay: `${-(i * CYCLE) / CLOUDS.length}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CloudField
