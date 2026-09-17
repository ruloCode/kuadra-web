'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react'

const TEXT =
  'No vendemos alcance. Vendemos imágenes que hacen que tu producto se vea como lo que vale. Se planea, se rueda, se entrega.'

/** Words the statement pivots on — held in volt once they light up. */
const ACCENT = new Set(['vale.', 'planea,', 'rueda,', 'entrega.'])

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

/**
 * Statement that lights up word by word as it scrolls through. On desktop it
 * reads as a spread: a fixed left rail carries the section label and a volt
 * rule that fills with reading progress, while the statement sits on the right
 * at a comfortable measure instead of a narrow centred column.
 */
export default function Manifiesto() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'start 0.25'] })
  const words = TEXT.split(' ')

  const ruleScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1])

  return (
    <section className="u-gutter border-y border-line py-20 sm:py-28 lg:py-36">
      <div ref={ref} className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Left rail — label, progress rule, attribution */}
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-32">
            <span className="u-label flex items-center gap-3 text-volt">
              <span className="u-rec block h-2 w-2 shrink-0 rounded-full bg-volt" />
              Manifiesto
            </span>

            <div className="mt-6 hidden h-px w-full origin-left bg-line lg:block">
              <motion.div className="h-px w-full origin-left bg-volt" style={{ scaleX: ruleScale }} />
            </div>

            <p className="mt-6 hidden max-w-[22ch] text-[13px] leading-relaxed text-signal lg:block">
              Lo que nos preguntan siempre, respondido de una vez.
            </p>

            <span className="u-label mt-8 hidden text-signal lg:block">Kuadra Film · Bogotá</span>
          </div>
        </div>

        {/* Statement */}
        <div className="lg:col-span-9">
          <p className="u-display max-w-[20ch] text-[clamp(27px,5.4vw,76px)] leading-[1.08] text-smoke lg:max-w-[17ch]">
            {words.map((w, i) => {
              const start = i / words.length
              return (
                <Word
                  key={i}
                  word={w}
                  range={[start, start + 1 / words.length]}
                  progress={scrollYProgress}
                  accent={ACCENT.has(w)}
                />
              )
            })}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-line pt-8 lg:mt-16">
            {[
              ['Sin', 'contratos de permanencia'],
              ['Sin', 'reuniones de relleno'],
              ['Sin', 'material de stock'],
            ].map(([a, b]) => (
              <span key={b} className="u-label flex items-baseline gap-2">
                <span className="text-volt">{a}</span>
                <span className="text-signal">{b}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
