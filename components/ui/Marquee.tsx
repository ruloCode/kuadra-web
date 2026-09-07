'use client'

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Seconds for one full pass. Larger = slower. */
  duration?: number
  reverse?: boolean
  className?: string
  pauseOnHover?: boolean
}

/**
 * Infinite horizontal ticker. The track holds two identical halves and shifts
 * exactly -50%, so the seam lands on an identical frame and never visibly jumps.
 */
export default function Marquee({
  children,
  duration = 30,
  reverse = false,
  className = '',
  pauseOnHover = false,
}: Props) {
  return (
    <div className={`relative flex overflow-hidden ${className}`}>
      <div
        className={`flex w-max shrink-0 ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{
          animation: `marquee-x ${duration}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        <div className="flex shrink-0 items-center" aria-hidden={false}>
          {children}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
