'use client'

import { motion, useReducedMotion } from 'motion/react'
import Reveal from '../ui/Reveal'
import SplitLines from '../ui/SplitLines'
import { usePropuesta } from './PropuestaContext'

/** Kickoff timeline: the line fills as the three steps enter view. */
export default function Arranque() {
  const { arranque, finePrint } = usePropuesta()
  const reduce = useReducedMotion()
  if (!arranque?.length) return null

  return (
    <section id="arranque" className="scroll-mt-20 u-gutter bg-carbon py-16 sm:py-24 lg:py-32">
      <div className="mb-12 flex flex-col justify-between gap-8 border-b border-line pb-10 lg:flex-row lg:items-end">
        <div>
          <Reveal>
            <span className="u-label flex items-center gap-3 text-volt">
              <span className="h-px w-8 bg-volt" />
              Cómo arrancamos
            </span>
          </Reveal>
          <h2 className="u-display mt-6 max-w-[12ch] text-[clamp(36px,6vw,88px)] text-smoke">
            <SplitLines lines={['Tres pasos.', 'Siete días', 'a la entrega.']} accent={[1]} />
          </h2>
        </div>
        <Reveal delay={0.12}>
          <p className="max-w-[36ch] text-[15px] leading-relaxed text-smoke/70">
            Reservamos el cupo en la primera llamada. La jornada se agenda con el 50% del primer
            mes; el resto, el día de la entrega.
          </p>
        </Reveal>
      </div>

      <div className="relative grid gap-0 lg:grid-cols-3">
        <motion.span
          aria-hidden="true"
          className="absolute left-0 top-5 hidden h-px origin-left bg-volt lg:block"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%' }}
        />

        {arranque.map((s, i) => (
          <motion.article
            key={s.n}
            className={`relative pt-2 ${i > 0 ? 'border-t border-line lg:border-t-0 lg:pl-10' : ''} py-10 lg:py-4`}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.12 * i, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="relative z-10 flex h-10 w-10 items-center justify-center border border-volt bg-ink">
              <span className="u-label u-tabular text-volt">{s.n}</span>
            </span>
            <span className="u-label mt-6 block text-signal">{s.meta}</span>
            <h3 className="u-display mt-3 max-w-[16ch] text-[clamp(22px,2.2vw,30px)] text-smoke">
              {s.title}
            </h3>
            <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-smoke/70">{s.body}</p>
          </motion.article>
        ))}
      </div>

      {finePrint ? (
        <p className="mt-10 max-w-[72ch] border-t border-line pt-8 text-[13px] leading-relaxed text-signal">
          {finePrint}
        </p>
      ) : null}
    </section>
  )
}
