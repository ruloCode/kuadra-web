'use client'

import { motion, useReducedMotion } from 'motion/react'
import Counter from '../ui/Counter'
import Magnetic from '../ui/Magnetic'
import Reveal from '../ui/Reveal'
import SplitLines from '../ui/SplitLines'
import { usePropuesta } from './PropuestaContext'

/** Ten launch slots as a claqueta grid — taken vs. still open. */
export default function Cupos() {
  const { cupos, waMain } = usePropuesta()
  const reduce = useReducedMotion()
  if (!cupos) return null

  const open = cupos.total - cupos.taken

  return (
    <section id="cupos" className="scroll-mt-20 u-gutter py-16 sm:py-24 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <span className="u-label flex items-center gap-3 text-volt">
              <span className="u-rec block h-2 w-2 shrink-0 rounded-full bg-volt" />
              Precio de lanzamiento
            </span>
          </Reveal>
          <h2 className="u-display mt-6 max-w-[12ch] text-[clamp(36px,5.4vw,78px)] text-smoke">
            <SplitLines lines={['Solo diez', 'cupos a este', 'precio.']} accent={[2]} />
          </h2>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-[40ch] text-[15px] leading-relaxed text-smoke/70 sm:text-[17px]">
              {cupos.body}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 flex items-end gap-3">
              <span className="u-display text-[clamp(64px,9vw,120px)] leading-none text-volt">
                <Counter to={open} duration={1400} />
              </span>
              <span className="u-label mb-3 text-signal">
                de {cupos.total} disponibles
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.28}>
            <Magnetic className="mt-8 inline-block">
              <a
                href={waMain}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-volt px-7 py-4 text-[15px] font-bold text-ink transition-colors hover:bg-smoke"
              >
                Reservar un cupo por WhatsApp
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {Array.from({ length: cupos.total }, (_, i) => {
              const taken = i < cupos.taken
              return (
                <motion.div
                  key={i}
                  className={`relative flex aspect-square flex-col items-center justify-center border ${
                    taken ? 'border-line bg-carbon' : 'border-volt/50 bg-ink'
                  }`}
                  initial={reduce ? false : { opacity: 0, scale: 0.86 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className={`u-label u-tabular ${taken ? 'text-signal' : 'text-volt'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`mt-1 text-[10px] uppercase tracking-[0.18em] ${taken ? 'text-signal' : 'text-smoke'}`}>
                    {taken ? 'Tomado' : 'Libre'}
                  </span>
                  {!taken && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 border border-volt"
                      animate={reduce ? {} : { opacity: [0.2, 0.85, 0.2] }}
                      transition={{ duration: 2.4, delay: i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
