import { motion } from 'motion/react'

/**
 * The splash a MegaCloudWorks-built app shows for the half-second between
 * icon tap and first screen — used here as the phone's own content so the
 * hero's product moment reads as "an app starting up", not a static photo.
 */
export function AppLoadingScreen({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-[var(--paper)] px-8">
      <motion.img
        src="/logo-mark.svg"
        alt=""
        aria-hidden="true"
        className="size-14"
        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
          MegaCloudWorks
        </p>
        <div className="h-1 w-28 overflow-hidden rounded-full bg-[var(--paper-3)]">
          <motion.div
            className="h-full w-1/3 rounded-full"
            style={{ background: accent }}
            animate={{ x: ['-100%', '130%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
      </div>
    </div>
  )
}
