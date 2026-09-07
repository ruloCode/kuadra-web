'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import Counter from '../ui/Counter'
import Reveal from '../ui/Reveal'
import SplitLines from '../ui/SplitLines'
import { KPIS } from '@/lib/propuesta'

const fmt = (n: number) => n.toLocaleString('es-CO')

function Kpi({ kpi, index }: { kpi: (typeof KPIS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const prefix = 'prefix' in kpi ? kpi.prefix : ''

  return (
    <div ref={ref} className="relative border-t border-line py-8 sm:py-10">
      {/* volt rule that draws across once the number is on screen */}
      <motion.span
        className="absolute left-0 top-0 h-px w-full origin-left bg-volt"
        initial={reduce ? false : { scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.25 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)] xl:items-end xl:gap-10">
        <span className="u-display whitespace-nowrap text-[clamp(52px,7.6vw,108px)] leading-[0.9] text-volt">
          <Counter to={kpi.value} prefix={prefix} suffix={kpi.suffix} format={fmt} duration={1900} />
        </span>
        <div>
          <p className="text-[clamp(16px,1.4vw,20px)] font-medium text-smoke">{kpi.label}</p>
          <p className="mt-1.5 text-[14px] text-signal">{kpi.sub}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Case numbers as a spread: a sticky statement on the left, the four figures
 * stacked on the right with a volt rule drawing in above each one.
 */
export default function Resultados() {
  return (
    <section id="resultados" className="scroll-mt-20 u-gutter py-16 sm:py-24 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <span className="u-label flex items-center gap-3 text-volt">
                <span className="u-rec block h-2 w-2 shrink-0 rounded-full bg-volt" />
                Resultados reales · Bambú Coliving
              </span>
            </Reveal>
            <h2 className="u-display mt-6 max-w-[14ch] text-[clamp(36px,5.4vw,78px)] text-smoke">
              <SplitLines lines={['Los números', 'de un lanzamiento', 'hecho desde cero.']} accent={[2]} />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-[40ch] text-[15px] leading-relaxed text-smoke/70 sm:text-[17px]">
                Tomamos la cuenta de Bambú Coliving el día que nació y la llevamos desde cero
                seguidores. Esto es lo que pasó en los primeros treinta días.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
                {[
                  ['Canal', 'Instagram'],
                  ['Periodo', '30 días'],
                  ['Rodajes', '1'],
                ].map(([k, v]) => (
                  <span key={k} className="u-label flex items-baseline gap-2">
                    <span className="text-signal">{k}</span>
                    <span className="text-smoke">{v}</span>
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7">
          {KPIS.map((k, i) => (
            <Kpi key={k.label} kpi={k} index={i} />
          ))}
          <div className="border-t border-line" />
        </div>
      </div>
    </section>
  )
}
