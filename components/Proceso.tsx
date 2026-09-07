'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react'
import { PROCESS } from '@/lib/projects'
import Reveal from './ui/Reveal'
import SplitLines from './ui/SplitLines'

type StepProps = {
  step: (typeof PROCESS)[number]
  index: number
  total: number
  progress: MotionValue<number>
  reduce: boolean
}

function Step({ step, index, total, progress, reduce }: StepProps) {
  // Each card shrinks a little more the deeper it sits in the stack.
  const scale = useTransform(
    progress,
    [index / total, 1],
    reduce ? [1, 1] : [1, 1 - (total - index) * 0.035],
  )

  // The staircase offset is smaller on phones — --proceso-pin/--proceso-step are
  // defined per breakpoint in globals.css so this stays one inline value.
  const top = `calc(var(--proceso-pin) + ${index} * var(--proceso-step))`

  return (
    <motion.article
      style={{ scale, top }}
      className="sticky mb-4 origin-top border border-line bg-carbon p-6 sm:mb-5 sm:p-10 lg:p-14"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-16">
        <span className="u-display u-tabular shrink-0 text-[clamp(44px,7vw,104px)] leading-none text-volt/25">
          {step.n}
        </span>
        <div className="max-w-[46ch]">
          <h3 className="u-display text-[clamp(24px,3.4vw,46px)] text-smoke">{step.title}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-smoke/70 sm:text-[17px]">
            {step.body}
          </p>
        </div>
      </div>
    </motion.article>
  )
}

/**
 * Stacking cards: each step pins under the previous one and scales back
 * slightly, so the four stages physically pile up as you scroll.
 */
export default function Proceso() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section id="proceso" className="scroll-mt-20 u-gutter py-16 sm:py-24 lg:py-32">
      <div className="mb-14 flex flex-col justify-between gap-8 border-b border-line pb-10 lg:flex-row lg:items-end">
        <div>
          <Reveal>
            <span className="u-label flex items-center gap-3 text-volt">
              <span className="h-px w-8 bg-volt" />
              Proceso
            </span>
          </Reveal>
          <h2 className="u-display mt-6 max-w-[14ch] text-[clamp(38px,6.5vw,92px)] text-smoke">
            <SplitLines lines={['Cuatro', 'pasos.']} accent={[1]} />
          </h2>
        </div>
        <Reveal delay={0.12}>
          <p className="max-w-[36ch] text-[15px] leading-relaxed text-smoke/70">
            El mismo orden en cada proyecto, sea una sesión de producto o el
            cubrimiento de un concierto.
          </p>
        </Reveal>
      </div>

      <div ref={ref} className="relative">
        {PROCESS.map((p, i) => (
          <Step
            key={p.n}
            step={p}
            index={i}
            total={PROCESS.length}
            progress={scrollYProgress}
            reduce={reduce}
          />
        ))}
      </div>
    </section>
  )
}
