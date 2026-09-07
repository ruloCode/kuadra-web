'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import SplitLines from '../ui/SplitLines'
import Magnetic from '../ui/Magnetic'
import Marquee from '../ui/Marquee'
import Hud from './Hud'
import { CLIENT, TICKER, WA_MAIN } from '@/lib/propuesta'

const META = [
  { k: 'Preparada para', v: CLIENT.name },
  { k: 'Fecha', v: CLIENT.date },
  { k: 'Vigencia', v: CLIENT.validity },
  { k: 'Ref', v: CLIENT.ref },
]

export default function PropHero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Copy drifts up and fades as the hero scrolls away; the ghost word slides
  // the other way, so the two planes separate like a parallax title card.
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -120])
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const ghostX = useTransform(scrollYProgress, [0, 1], reduce ? ['-6%', '-6%'] : ['-6%', '-34%'])
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28"
    >
      <Hud progress={scrollYProgress} ghostX={ghostX} ghostOpacity={ghostOpacity} />

      <motion.div
        className="relative z-10 u-gutter flex flex-1 flex-col justify-center py-10"
        style={{ y, opacity: fade }}
      >
        <motion.div
          className="mb-8 flex flex-wrap items-center gap-3"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="u-label text-volt">Propuesta de contenido</span>
          <span className="h-px w-8 bg-line sm:w-16" />
          <span className="u-label text-signal">
            {CLIENT.name} · {CLIENT.city}
          </span>
        </motion.div>

        <h1 className="u-display max-w-[22ch] text-[clamp(40px,7vw,104px)] text-smoke">
          <SplitLines
            lines={['Nativos para Nativos', 'se ve mejor de lo que', 'se ve en Instagram.']}
            accent={[2]}
            delay={0.25}
            stagger={0.1}
          />
        </h1>

        <motion.p
          className="mt-8 max-w-[52ch] text-[clamp(16px,1.35vw,20px)] leading-[1.5] text-smoke/85"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          Un día de grabación en tu local. Doce piezas listas para todo el mes. Y cada guion
          decidido con datos, no con intuición.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
        >
          <Magnetic>
            <a
              href="#planes"
              className="group inline-flex items-center gap-3 bg-volt px-7 py-4 text-[15px] font-bold text-ink transition-colors hover:bg-smoke"
            >
              Ver planes
              <span className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
            </a>
          </Magnetic>
          <a
            href="#resultados"
            className="group inline-flex items-center gap-3 border border-line px-7 py-4 text-[15px] text-smoke transition-colors hover:border-volt hover:text-volt"
          >
            Ver resultados
            <span className="u-tabular text-signal transition-colors group-hover:text-volt">192K</span>
          </a>
          <a
            href={WA_MAIN}
            target="_blank"
            rel="noopener noreferrer"
            className="u-label hidden items-center gap-2 text-signal transition-colors hover:text-volt sm:inline-flex"
          >
            o escríbenos ahora ↗
          </a>
        </motion.div>
      </motion.div>

      {/* document readout + ticker */}
      <motion.div
        className="relative z-10"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="u-gutter u-rule flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-5">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {META.map((m) => (
              <span key={m.k} className="u-label flex items-baseline gap-2">
                <span className="text-signal">{m.k}</span>
                <span className="u-tabular text-smoke">{m.v}</span>
              </span>
            ))}
          </div>
          <a href="#resultados" className="u-label flex items-center gap-2 text-signal hover:text-volt">
            Scroll
            <motion.span
              animate={reduce ? {} : { y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
          </a>
        </div>
        <div className="u-rule border-b border-line py-4">
          <Marquee duration={34}>
            {TICKER.map((t, i) => (
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
