'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react'
import Claqueta from '../Claqueta'
import { STATEMENT, STATEMENT_ACCENT } from '@/lib/propuesta'

function Word({
  word,
  range,
  progress,
  accent,
}: {
  word: string
  range: [number, number]
  progress: MotionValue<number>
  accent: boolean
}) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <span className="mr-[0.24em] inline-block">
      <motion.span style={{ opacity }} className={accent ? 'text-volt' : undefined}>
        {word}
      </motion.span>
    </span>
  )
}

/** The offer in one breath, lighting up word by word as it scrolls through. */
export default function Statement() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.3'] })
  const words = STATEMENT.split(' ')
  const rule = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1])

  return (
    <>
      <Claqueta height={12} />
      <section className="u-gutter border-b border-line py-20 sm:py-28 lg:py-36">
        <div ref={ref} className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-32">
              <span className="u-label flex items-center gap-3 text-volt">
                <span className="u-rec block h-2 w-2 shrink-0 rounded-full bg-volt" />
                La oferta
              </span>
              <div className="mt-6 hidden h-px w-full bg-line lg:block">
                <motion.div className="h-px w-full origin-left bg-volt" style={{ scaleX: rule }} />
              </div>
              <p className="mt-6 hidden max-w-[22ch] text-[13px] leading-relaxed text-signal lg:block">
                Lo que te proponemos, en una frase.
              </p>
            </div>
          </div>
          <div className="lg:col-span-9">
            <p className="u-display max-w-[20ch] text-[clamp(27px,5.2vw,72px)] leading-[1.08] text-smoke lg:max-w-[18ch]">
              {words.map((w, i) => {
                const start = i / words.length
                return (
                  <Word
                    key={i}
                    word={w}
                    range={[start, start + 1 / words.length]}
                    progress={reduce ? rule : scrollYProgress}
                    accent={STATEMENT_ACCENT.has(w)}
                  />
                )
              })}
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-line pt-8 lg:mt-16">
              {[
                ['8', 'reels al mes'],
                ['4', 'carruseles al mes'],
                ['1', 'jornada de rodaje'],
                ['4', 'revisiones con datos'],
              ].map(([a, b]) => (
                <span key={b} className="u-label flex items-baseline gap-2">
                  <span className="u-display text-[20px] text-volt">{a}</span>
                  <span className="text-signal">{b}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
