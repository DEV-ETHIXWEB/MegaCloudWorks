import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IPhoneMockup } from './IPhoneMockup'
import { PhoneNavProvider } from '../lib/phoneUI'
import { CONCEPT_SCREENS } from '../lib/conceptScreens'
import type { Concept } from '../content/concepts'

/**
 * One live, interactive phone for a concept: screens navigate each other
 * (tapping a job opens its detail, etc.) via PhoneNavProvider, and the strip
 * below lets a visitor jump straight to any of the four screens.
 */
export function ConceptPhone({
  concept,
  size = 'lg',
  initialIndex = 0,
}: {
  concept: Concept
  size?: 'sm' | 'md' | 'lg'
  initialIndex?: number
}) {
  const screens = CONCEPT_SCREENS[concept.slug] ?? []
  const [index, setIndex] = useState(initialIndex)
  const Screen = screens[index]

  if (!Screen) return null

  return (
    <div className="flex flex-col items-center">
      <PhoneNavProvider index={index} count={screens.length} onGo={setIndex}>
        <IPhoneMockup size={size} label={`${concept.name} · ${concept.screens[index]}`}>
          <Screen accent={concept.accent} />
        </IPhoneMockup>
      </PhoneNavProvider>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIndex((i) => (i - 1 + screens.length) % screens.length)}
          aria-label="Previous screen"
          className="surface-lift flex size-9 items-center justify-center rounded-full text-[var(--ink)]"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="min-w-[9rem] text-center text-sm font-semibold text-[var(--ink)]">
          {concept.screens[index]}
        </p>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % screens.length)}
          aria-label="Next screen"
          className="surface-lift flex size-9 items-center justify-center rounded-full text-[var(--ink)]"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {concept.screens.map((name, i) => (
          <button
            key={name}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to ${name}`}
            aria-current={i === index}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === index ? '1.5rem' : '0.4rem',
              background: i === index ? concept.accent : 'var(--line-strong)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
