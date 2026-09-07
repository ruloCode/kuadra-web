'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import type { Project } from '@/lib/projects'

type Props = {
  project: Project
  index: number
  onOpen: (slug: string) => void
  /**
   * Aspect used on one-column layouts. From `lg` up the card instead fills the
   * row height set by `rowHeight`, so cards sharing a row end flush — mixing
   * aspect ratios across a row left dead space under the shorter card.
   */
  mobileAspect: string
  rowHeight: string
}

export default function WorkCard({ project, index, onOpen, mobileAspect, rowHeight }: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Slow inner drift — the image lags the card, which reads as depth.
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%'])

  const cover = project.shots[project.coverIndex] ?? project.shots[0]
  if (!cover) return null

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => onOpen(project.slug)}
      className="group relative block h-full w-full cursor-pointer text-left"
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay: (index % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`Ver caso ${project.client} — ${project.title}`}
    >
      <div className={`relative w-full overflow-hidden bg-carbon ${mobileAspect} ${rowHeight}`}>
        <motion.div className="absolute inset-[-6%]" style={{ y }}>
          <Image
            src={cover.src}
            alt={`${project.client} — ${project.title}`}
            fill
            sizes="(max-width: 1024px) 92vw, 46vw"
            placeholder="blur"
            blurDataURL={cover.blur}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </motion.div>

        {/* Legibility scrim, deepens on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/25 transition-opacity duration-500 group-hover:from-ink/90" />

        {/* Corner registration marks — camera-frame language */}
        <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-smoke/25 transition-colors duration-500 group-hover:border-volt" />
        <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-smoke/25 transition-colors duration-500 group-hover:border-volt" />

        {/* Top meta row */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6">
          <span className="u-label u-tabular text-smoke/70">{project.code}</span>
          <span className="u-label bg-ink/70 px-2.5 py-1.5 text-smoke backdrop-blur-sm">
            {project.categoryLabel}
          </span>
        </div>

        {/* Bottom title block */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h3 className="u-display text-[clamp(24px,3.2vw,44px)] text-smoke">
                {project.client}
              </h3>
              <p className="mt-1.5 max-w-[34ch] text-[13px] leading-snug text-smoke/70 sm:text-[15px]">
                {project.title}
              </p>
            </div>
            <span className="u-label u-tabular hidden shrink-0 text-signal sm:block">
              {project.year}
            </span>
          </div>

          {/*
            Slides up out of the edge on hover. Touch devices get no hover, so
            there the row is always open — otherwise the only affordance telling
            you the card is tappable would be invisible on a phone.
          */}
          <div className="mt-4 grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <span className="u-label inline-flex min-h-[44px] items-center gap-2 bg-volt px-4 py-2.5 text-ink">
                Ver caso · {project.deliverables}
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  )
}
