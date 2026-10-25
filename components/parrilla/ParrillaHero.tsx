'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Marquee from '../ui/Marquee'
import SplitLines from '../ui/SplitLines'
import { useParrilla } from './ParrillaContext'

const EASE = [0.16, 1, 0.3, 1] as const

/** Portada: título, resumen en una frase y el documento leído como claqueta. */
export default function ParrillaHero() {
  const { copy } = useParrilla()
  const { client, hero, piezas } = copy
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -100])
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const ghostX = useTransform(scrollYProgress, [0, 1], reduce ? ['-4%', '-4%'] : ['-4%', '-30%'])

  const META = [
    { k: 'Para', v: client.name },
    { k: 'Campaña', v: client.cargo },
    { k: 'Fecha', v: client.fecha },
    { k: 'Ref', v: client.ref },
  ]
  const temas = piezas.map((p) => p.titulo)

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-24"
    >
      {/* Palabra fantasma detrás del título */}
      <motion.span
        aria-hidden="true"
        className="u-display pointer-events-none absolute left-0 top-[18%] whitespace-nowrap text-[clamp(160px,34vw,520px)] leading-none text-transparent [-webkit-text-stroke:1px_#1E1E1E]"
        style={{ x: ghostX, opacity: fade }}
      >
        SOACHA PROFUNDA
      </motion.span>

      <motion.div
        className="relative z-10 u-gutter flex flex-1 flex-col justify-center py-10"
        style={{ y, opacity: fade }}
      >
        <motion.div
          className="mb-7 flex flex-wrap items-center gap-3"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="u-label flex items-center gap-2 text-volt">
            <span className="u-rec block h-2 w-2 rounded-full bg-volt" />
            {hero.kicker}
          </span>
          <span className="h-px w-8 bg-line sm:w-16" />
          <span className="u-label text-signal">{client.cargo}</span>
        </motion.div>

        <h1 className="u-display max-w-[14ch] text-[clamp(52px,11vw,150px)] text-smoke">
          <SplitLines lines={hero.lines} accent={hero.accent} delay={0.25} stagger={0.1} />
        </h1>

        <motion.p
          className="mt-7 max-w-[46ch] text-[clamp(17px,1.4vw,21px)] leading-[1.5] text-smoke/85"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
        >
          {hero.lede}
        </motion.p>

        <motion.div
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.78, ease: EASE }}
        >
          <a
            href="#piezas"
            className="group inline-flex min-h-[56px] items-center justify-center gap-3 bg-volt px-7 text-[16px] font-bold text-ink transition-colors hover:bg-smoke"
          >
            Ver las {piezas.length} piezas
            <span className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
          </a>
          <a
            href="#resumen"
            className="inline-flex min-h-[56px] items-center justify-center gap-3 border border-line px-7 text-[16px] text-smoke transition-colors hover:border-volt hover:text-volt"
          >
            Leer el resumen
          </a>
        </motion.div>
        <motion.p
          className="mt-5 max-w-[44ch] text-[13px] leading-relaxed text-signal"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1 }}
        >
          Abre cada pieza para ver el guion. Puedes aprobarla o decirnos qué cambiar
          {copy.comentarios ? '' : ' por WhatsApp'}: te leemos y la ajustamos.
        </motion.p>
      </motion.div>

      <motion.div
        className="relative z-10"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="u-gutter u-rule flex flex-wrap gap-x-8 gap-y-2 py-4">
          {META.map((m) => (
            <span key={m.k} className="u-label flex items-baseline gap-2">
              <span className="text-signal">{m.k}</span>
              <span className="u-tabular text-smoke">{m.v}</span>
            </span>
          ))}
        </div>
        <div className="u-rule border-b border-line py-4">
          <Marquee duration={60}>
            {temas.map((t, i) => (
              <span key={i} className="flex items-center">
                <span className="u-display whitespace-nowrap px-6 text-[clamp(15px,1.4vw,20px)] tracking-[0.02em] text-smoke/85">
                  {t}
                </span>
                <span className="block h-1.5 w-1.5 shrink-0 rounded-full bg-volt" />
              </span>
            ))}
          </Marquee>
        </div>
      </motion.div>
    </section>
  )
}
