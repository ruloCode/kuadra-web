'use client'

import { motion, useReducedMotion } from 'motion/react'
import Reveal from '../ui/Reveal'
import SplitLines from '../ui/SplitLines'
import { usePropuesta } from './PropuestaContext'

/** Three content pillars as a viewfinder grid — hover lights the volt frame. */
export default function Pilares() {
  const { pillars } = usePropuesta()
  const reduce = useReducedMotion()
  if (!pillars?.length) return null

  return (
    <section id="oferta" className="scroll-mt-20 u-gutter py-16 sm:py-24 lg:py-32">
      <div className="mb-12 flex flex-col justify-between gap-8 border-b border-line pb-10 lg:flex-row lg:items-end">
        <div>
          <Reveal>
            <span className="u-label flex items-center gap-3 text-volt">
              <span className="h-px w-8 bg-volt" />
              Lo que se produce
            </span>
          </Reveal>
          <h2 className="u-display mt-6 max-w-[14ch] text-[clamp(36px,6vw,88px)] text-smoke">
            <SplitLines lines={['Tres formas', 'de vender', 'en vitrina.']} accent={[2]} />
          </h2>
        </div>
        <Reveal delay={0.12}>
          <p className="max-w-[36ch] text-[15px] leading-relaxed text-smoke/70">
            Cada carro que entra, cada entrega y cada crédito aprobado es una pieza. El plan
            convierte lo que ya pasa en el concesionario en alcance y confianza.
          </p>
        </Reveal>
      </div>

      <div className="grid border border-line lg:grid-cols-3">
        {pillars.map((p, i) => (
          <motion.article
            key={p.n}
            className={`group relative overflow-hidden p-7 sm:p-9 ${
              i > 0 ? 'border-t border-line lg:border-l lg:border-t-0' : ''
            }`}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-volt/[0.04] transition-transform duration-500 group-hover:scale-x-100" />
            <span className="absolute right-4 top-4 h-4 w-4 border-r border-t border-line transition-colors group-hover:border-volt" />
            <span className="u-label u-tabular text-volt">{p.n}</span>
            <h3 className="u-display relative mt-6 max-w-[12ch] text-[clamp(24px,2.4vw,34px)] text-smoke">
              {p.title}
            </h3>
            <p className="relative mt-5 max-w-[36ch] text-[15px] leading-relaxed text-smoke/70">
              {p.body}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
