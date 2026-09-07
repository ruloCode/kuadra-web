'use client'

import { motion, useReducedMotion, type Variants } from 'motion/react'

type Props = {
  lines: string[]
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  /** Highlight these line indices in volt. */
  accent?: number[]
}

/**
 * Headline set line by line, each masked and pushed up from below — the text
 * slides out of a hard edge, like a title card.
 *
 * The viewport trigger lives on the OUTER wrapper on purpose. The inner spans
 * start translated fully outside their `overflow-hidden` mask, and
 * IntersectionObserver clips against ancestor overflow — so observing the inner
 * span directly would deadlock: it can never be "in view" until it animates,
 * and it never animates until it is in view. The wrapper is unclipped, so it
 * always fires, and the children follow through variant context.
 */
const container = (delay: number, stagger: number): Variants => ({
  hidden: {},
  show: { transition: { delayChildren: delay, staggerChildren: stagger } },
})

const child: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
}

export default function SplitLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  accent = [],
}: Props) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <span className={className}>
        {lines.map((line, i) => (
          <span
            key={i}
            className={`block ${lineClassName ?? ''} ${accent.includes(i) ? 'text-volt' : ''}`}
          >
            {line}
          </span>
        ))}
      </span>
    )
  }

  return (
    <motion.span
      className={`block ${className ?? ''}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={container(delay, stagger)}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className={`block ${lineClassName ?? ''} ${accent.includes(i) ? 'text-volt' : ''}`}
            variants={child}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
