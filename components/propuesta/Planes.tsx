'use client'

import { motion, useReducedMotion } from 'motion/react'
import Magnetic from '../ui/Magnetic'
import Reveal from '../ui/Reveal'
import SplitLines from '../ui/SplitLines'
import { PLANS } from '@/lib/propuesta'

/**
 * Three columns split by hairlines, not three floating cards. The
 * recommended plan sits on carbon with a claqueta strip on top; the price is
 * the loudest thing in each column.
 */
export default function Planes() {
  const reduce = useReducedMotion()

  return (
    <section id="planes" className="scroll-mt-20 u-gutter py-16 sm:py-24 lg:py-32">
      <div className="mb-12 flex flex-col justify-between gap-8 border-b border-line pb-10 lg:flex-row lg:items-end">
        <div>
          <Reveal>
            <span className="u-label flex items-center gap-3 text-volt">
              <span className="h-px w-8 bg-volt" />
              Planes
            </span>
          </Reveal>
          <h2 className="u-display mt-6 max-w-[12ch] text-[clamp(36px,6vw,88px)] text-smoke">
            <SplitLines lines={['Tres formas', 'de empezar.']} accent={[1]} />
          </h2>
        </div>
        <Reveal delay={0.12}>
          <p className="max-w-[36ch] text-[15px] leading-relaxed text-smoke/70">
            Precios en pesos colombianos, sin permanencia. Los primeros tres meses tienen tarifa
            de lanzamiento.
          </p>
        </Reveal>
      </div>

      <div className="grid border border-line lg:grid-cols-3">
        {PLANS.map((p, i) => (
          <motion.div
            key={p.key}
            className={`relative flex flex-col p-7 sm:p-9 lg:p-10 ${
              p.featured ? 'bg-carbon' : ''
            } ${i > 0 ? 'border-t border-line lg:border-l lg:border-t-0' : ''}`}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {p.featured && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[6px]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, #C6FF00 0 22px, #1E1E1E 22px 44px)',
                }}
              />
            )}

            <div className="flex items-center justify-between gap-4">
              <span className={`u-label ${p.featured ? 'text-volt' : 'text-signal'}`}>{p.tag}</span>
              <span className="u-label u-tabular text-signal">0{i + 1}</span>
            </div>

            <h3 className="u-display mt-6 text-[clamp(22px,2.2vw,30px)] text-smoke">{p.name}</h3>

            <div className="mt-6">
              <span className="u-display u-tabular block text-[clamp(34px,3.6vw,52px)] leading-none text-volt">
                {p.price}
              </span>
              <span className="mt-2 block text-[13px] text-smoke/70">{p.period}</span>
              <span className="mt-1 block text-[13px] text-signal">{p.after}</span>
            </div>

            <ul className="mt-8 flex flex-col gap-3 border-t border-line pt-7 text-[15px] text-smoke/85">
              {p.items.map((it) => (
                <li key={it} className="flex gap-3">
                  <span className="mt-[9px] block h-1.5 w-1.5 shrink-0 bg-volt" />
                  {it}
                </li>
              ))}
            </ul>

            <div className="mt-10 pt-2 lg:mt-auto lg:pt-10">
              <Magnetic className="w-full">
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex w-full items-center justify-center gap-3 px-6 py-4 text-[15px] font-bold transition-colors ${
                    p.featured
                      ? 'bg-volt text-ink hover:bg-smoke'
                      : 'border border-line text-smoke hover:border-volt hover:text-volt'
                  }`}
                >
                  {p.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </Magnetic>
            </div>
          </motion.div>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mt-6 text-[13px] text-signal">
          Todos los planes incluyen la medición semanal con datos e IA y la entrega organizada
          y lista para publicar.
        </p>
      </Reveal>
    </section>
  )
}
