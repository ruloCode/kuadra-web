'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Reveal from '../ui/Reveal'
import SplitLines from '../ui/SplitLines'
import { STEPS } from '@/lib/propuesta'

function Step({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // The oversized numeral moves slower than the copy, so it reads as a
  // backdrop plane rather than part of the text block.
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['18%', '-18%'])
  const lit = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0.08, 0.28, 0.08])

  return (
    <motion.article
      ref={ref}
      className="relative overflow-hidden border-t border-line py-14 sm:py-20 lg:py-24"
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.span
        aria-hidden="true"
        className="u-display u-tabular pointer-events-none absolute -right-[0.08em] top-1/2 -translate-y-1/2 text-[clamp(140px,26vw,360px)] leading-none text-volt"
        style={{ y, opacity: lit }}
      >
        {step.n}
      </motion.span>

      <div className="relative grid gap-5 sm:grid-cols-[6ch_1fr] sm:gap-10">
        <span className="u-label u-tabular pt-2 text-volt">{step.n}</span>
        <div className="max-w-[46ch] sm:pr-[10vw]">
          <span className="u-label text-signal">{step.meta}</span>
          <h3 className="u-display mt-3 max-w-[16ch] text-[clamp(24px,2.9vw,42px)] text-smoke">{step.title}</h3>
          <p className="mt-5 text-[15px] leading-relaxed text-smoke/70 sm:text-[17px]">{step.body}</p>
        </div>
      </div>
      {index === STEPS.length - 1 && <span className="absolute inset-x-0 bottom-0 h-px bg-line" />}
    </motion.article>
  )
}

/**
 * Four steps with their numerals blown up and bleeding off the right edge,
 * each on its own parallax plane. The headline stays pinned on the left while
 * the list scrolls past, and a volt rule tracks how far you've read.
 */
export default function Metodo() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end 0.7'] })
  const rule = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1])

  return (
    <section id="metodo" className="scroll-mt-20 u-gutter bg-carbon py-16 sm:py-24 lg:py-32">
      <div ref={ref} className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <span className="u-label flex items-center gap-3 text-volt">
                <span className="h-px w-8 bg-volt" />
                Método
              </span>
            </Reveal>
            <h2 className="u-display mt-6 max-w-[14ch] text-[clamp(34px,3.8vw,58px)] text-smoke">
              <SplitLines lines={['Cuatro horas', 'en tu local.', 'Cero', 'improvisación.']} accent={[2, 3]} />
            </h2>
            <div className="mt-8 hidden h-px w-full bg-line lg:block">
              <motion.div className="h-px w-full origin-left bg-volt" style={{ scaleX: rule }} />
            </div>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-smoke/70">
                El mismo orden cada mes. Cuando llegamos a grabar ya sabemos qué plano va
                primero y por qué.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7">
          {STEPS.map((s, i) => (
            <Step key={s.n} step={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
