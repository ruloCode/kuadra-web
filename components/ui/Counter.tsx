'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

type Props = {
  to: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
  /** Optional formatter for the running value (e.g. thousands separators). */
  format?: (n: number) => string
}

/** Counts up to `to` the first time it scrolls into view. */
export default function Counter({
  to,
  suffix = '',
  prefix = '',
  duration = 1600,
  className,
  format,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView || reduce) return
    let raf = 0
    let start: number | null = null
    const tick = (t: number) => {
      if (start === null) start = t
      const p = Math.min((t - start) / duration, 1)
      // easeOutExpo — fast out of the gate, settles precisely on the value
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setN(Math.round(eased * to))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration, reduce])

  return (
    <span ref={ref} className={`u-tabular ${className ?? ''}`}>
      {prefix}
      {format ? format(reduce ? to : n) : reduce ? to : n}
      {suffix}
    </span>
  )
}
