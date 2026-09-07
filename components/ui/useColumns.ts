'use client'

import { useEffect, useState } from 'react'

/**
 * How many masonry columns are actually rendered at the current width.
 * The archive teaser is defined in *rows*, so it needs the live column count —
 * hard-coding the widest breakpoint's value gave three rows on a phone.
 */
export function useColumns(density: 2 | 3 | 4): number {
  const at = (w: number) => {
    if (w < 640) return density === 2 ? 1 : 2
    if (w < 1024) return density === 2 ? 2 : 3
    return density
  }

  // Start from the widest case so the server-rendered markup matches the
  // desktop layout, then correct on mount.
  const [cols, setCols] = useState<number>(density)

  useEffect(() => {
    const update = () => setCols(at(window.innerWidth))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [density])

  return cols
}
