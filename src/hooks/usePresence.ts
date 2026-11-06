import { useEffect, useState } from 'react'

/**
 * Keeps a component mounted long enough to play its exit animation.
 * Returns whether to render it and the data-state ("open" | "closed") that drives the CSS animation.
 */
export function usePresence(open: boolean, exitMs = 200) {
  const [mounted, setMounted] = useState(open)
  useEffect(() => {
    if (open) { setMounted(true); return }
    const t = setTimeout(() => setMounted(false), exitMs)
    return () => clearTimeout(t)
  }, [open, exitMs])
  return { mounted: open || mounted, state: (open ? 'open' : 'closed') as 'open' | 'closed' }
}
