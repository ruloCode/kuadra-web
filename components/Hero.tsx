'use client'

import { motion, useReducedMotion } from 'motion/react'
import HeroWall from './HeroWall'
import SplitLines from './ui/SplitLines'
import Magnetic from './ui/Magnetic'
import { waLink, TOTAL_SHOTS, PROJECTS } from '@/lib/projects'

const META = [
  { k: 'Base', v: 'Bogotá, CO' },
  { k: 'Desde', v: '2019' },
  { k: 'Proyectos', v: String(PROJECTS.length).padStart(2, '0') },
  { k: 'Piezas', v: String(TOTAL_SHOTS) },
]

export default function Hero() {
  const reduce = useReducedMotion()

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28">
      <HeroWall />

      <div className="relative z-10 u-gutter flex flex-1 flex-col justify-center py-10">
        <motion.div
          className="mb-8 flex items-center gap-3"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="u-rec block h-2 w-2 rounded-full bg-volt" />
          <span className="u-label text-smoke">Productora audiovisual</span>
          <span className="h-px w-8 bg-line sm:w-16" />
          <span className="u-label text-signal">Est. Bogotá</span>
        </motion.div>

        <h1 className="u-display max-w-[16ch] text-[clamp(44px,9.5vw,148px)] text-smoke">
          <SplitLines
            lines={['Marcas que', 'se ven como', 'lo que cobran.']}
            accent={[2]}
            delay={0.15}
            stagger={0.1}
          />
        </h1>

        <motion.p
          className="mt-8 max-w-[46ch] text-[clamp(16px,1.35vw,20px)] leading-[1.5] text-smoke/85"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          Fotografía comercial, video y dirección de arte para marcas que ya no pueden
          seguir publicando fotos tomadas con el celular.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
        >
          <Magnetic>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-volt px-7 py-4 text-[15px] font-bold text-ink transition-colors hover:bg-smoke"
            >
              Cotizar un proyecto
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </Magnetic>
          <a
            href="#trabajo"
            className="group inline-flex items-center gap-3 border border-line px-7 py-4 text-[15px] text-smoke transition-colors hover:border-volt hover:text-volt"
          >
            Ver el trabajo
            <span className="u-tabular text-signal transition-colors group-hover:text-volt">
              {TOTAL_SHOTS}
            </span>
          </a>
        </motion.div>
      </div>

      {/* Technical footer strip — the "camera readout" line */}
      <motion.div
        className="relative z-10 u-gutter u-rule flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-5"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {META.map((m) => (
            <span key={m.k} className="u-label flex items-baseline gap-2">
              <span className="text-signal">{m.k}</span>
              <span className="u-tabular text-smoke">{m.v}</span>
            </span>
          ))}
        </div>
        <a href="#trabajo" className="u-label flex items-center gap-2 text-signal hover:text-volt">
          Scroll
          <motion.span
            animate={reduce ? {} : { y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            ↓
          </motion.span>
        </a>
      </motion.div>
    </section>
  )
}
