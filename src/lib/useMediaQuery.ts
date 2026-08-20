import { useCallback, useSyncExternalStore } from 'react'

/**
 * A media query, as state.
 *
 * For the cases where `hidden lg:block` isn't enough - a block that is cheap
 * to hide but expensive to *build* should not be built at all on the side of
 * the breakpoint that never shows it.
 *
 * The server snapshot is always `false`, and the desktop branch is the one the
 * markup is written for, so callers pass the query that describes the *narrow*
 * side. First client render then agrees with the server, and the subscription
 * corrects it on anything that doesn't match.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined') return () => {}
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () =>
      typeof window === 'undefined' ? false : window.matchMedia(query).matches,
    () => false,
  )
}

export default useMediaQuery
