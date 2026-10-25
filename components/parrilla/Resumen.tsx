'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import Counter from '../ui/Counter'
import Reveal from '../ui/Reveal'
import SplitLines from '../ui/SplitLines'
import { useParrilla } from './ParrillaContext'

/** El resumen en cuatro ideas y las cifras de la parrilla contando hacia arriba. */
export default function Resumen() {
  const { copy } = useParrilla()
  return (
    <section id="resumen" className="scroll-mt-20 u-gutter border-b border-line py-16 sm:py-24">
      <Reveal>
        <span className="u-label flex items-center gap-3 text-volt">
          <span className="h-px w-8 bg-volt" />
          En resumen
        </span>
      </Reveal>
      <h2 className="u-display mt-5 max-w-[16ch] text-[clamp(32px,5vw,64px)] text-smoke">
        <SplitLines lines={['Organizar la', 'indignación.']} accent={[1]} />
      </h2>

      <div className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
        {copy.stats.map((s) => (
          <div key={s.l} className="bg-ink px-4 py-6 sm:px-6 sm:py-8">
            <span className="u-display block text-[clamp(40px,6vw,72px)] leading-none text-volt">
              <Counter to={s.n} suffix={s.suffix} />
            </span>
            <span className="u-label mt-3 block text-signal">{s.l}</span>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {copy.resumen.map((r, i) => (
          <Reveal key={r.k} delay={i * 0.06}>
            <div className="border-t border-line pt-5">
              <span className="u-label u-tabular text-signal">
                0{i + 1} · {r.k}
              </span>
              <p className="mt-3 max-w-[48ch] text-[17px] leading-relaxed text-smoke/85">{r.v}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Paso({
  paso,
  i,
  total,
  progress,
}: {
  paso: { n: string; t: string; d: string }
  i: number
  total: number
  progress: MotionValue<number>
}) {
  const at = i / total
  const lit = useTransform(progress, [at, at + 0.12], [0, 1])
  const bg = useTransform(lit, (v) => (v > 0.5 ? '#C6FF00' : '#131313'))
  const fg = useTransform(lit, (v) => (v > 0.5 ? '#0D0D0D' : '#6E6E6E'))
  const opacity = useTransform(lit, [0, 1], [0.35, 1])
  return (
    <li className="relative flex gap-4 pb-8 last:pb-0 lg:flex-col lg:pb-0">
      <motion.span
        className="u-display u-tabular relative z-10 flex h-12 w-12 shrink-0 items-center justify-center border border-line text-[15px]"
        style={{ backgroundColor: bg, color: fg }}
      >
        {paso.n}
      </motion.span>
      <motion.div style={{ opacity }}>
        <h3 className="u-display text-[22px] text-smoke">{paso.t}</h3>
        <p className="mt-1.5 max-w-[28ch] text-[15px] leading-relaxed text-smoke/70">{paso.d}</p>
      </motion.div>
    </li>
  )
}

/**
 * El diferencial: ningún video sale sin documento. Los cinco pasos se encienden
 * a medida que se leen, y la línea que los une se va llenando.
 */
export function Sello() {
  const { copy } = useParrilla()
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.55'] })
  const progress = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1])

  return (
    <section className="u-gutter bg-carbon py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <span className="u-label flex items-center gap-3 text-volt">
              <span className="u-rec block h-2 w-2 rounded-full bg-volt" />
              Tu sello
            </span>
          </Reveal>
          <h2 className="u-display mt-5 max-w-[12ch] text-[clamp(30px,4vw,54px)] text-smoke">
            <SplitLines lines={['Cada video,', 'un radicado.']} accent={[1]} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[38ch] text-[16px] leading-relaxed text-smoke/70">
              Aquí mucha gente habla y ataca, pero no llega a nada. Tú llegas con el documento. Que
              la respuesta salga de la administración, no de nosotros.
            </p>
          </Reveal>
        </div>
        <div ref={ref} className="relative lg:col-span-8">
          {/* La línea que une los pasos: vertical en el celular, horizontal en escritorio */}
          <span
            className="absolute bottom-6 left-6 top-6 w-px bg-line lg:hidden"
            aria-hidden="true"
          >
            <motion.span
              className="block h-full w-full origin-top bg-volt"
              style={{ scaleY: progress }}
            />
          </span>
          <span
            className="absolute left-6 right-6 top-6 hidden h-px bg-line lg:block"
            aria-hidden="true"
          >
            <motion.span
              className="block h-full w-full origin-left bg-volt"
              style={{ scaleX: progress }}
            />
          </span>
          <ol className="relative lg:grid lg:grid-cols-5 lg:gap-6">
            {copy.sello.map((p, i) => (
              <Paso key={p.n} paso={p} i={i} total={copy.sello.length} progress={progress} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
