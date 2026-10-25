'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import Counter from '../ui/Counter'
import Reveal from '../ui/Reveal'
import SplitLines from '../ui/SplitLines'
import type { Formato } from '@/lib/parrilla'
import { useParrilla } from './ParrillaContext'

const EASE = [0.16, 1, 0.3, 1] as const
const fmt = (n: number) => n.toLocaleString('es-CO')

/**
 * Metas de seguidores como barras que crecen al entrar en pantalla. Los meses
 * sin cifra (hoy, enero) quedan punteados: se dibujan, pero no se inventan.
 */
function Metas() {
  const { copy } = useParrilla()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduce = useReducedMotion()
  const max = Math.max(...copy.metas.map((m) => m.seguidores ?? 0)) * 1.15
  const H = 220

  return (
    <div ref={ref} className="border border-line bg-ink p-5 sm:p-7">
      <div className="flex items-baseline justify-between gap-4">
        <span className="u-label text-volt">Meta de seguidores</span>
        <span className="u-label text-signal">Instagram</span>
      </div>
      <div className="mt-8 grid grid-cols-4 items-end gap-3 sm:gap-5" style={{ height: H + 60 }}>
        {copy.metas.map((m, i) => {
          const h = m.seguidores ? (m.seguidores / max) * H : H * 0.22
          return (
            <div key={m.mes} className="flex h-full flex-col justify-end">
              <motion.span
                className="u-display u-tabular mb-2 block text-center text-[clamp(15px,2.4vw,22px)] text-smoke"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.12 }}
              >
                {m.seguidores ? fmt(m.seguidores) : '—'}
              </motion.span>
              <motion.div
                className={
                  m.seguidores
                    ? 'w-full origin-bottom bg-volt'
                    : 'w-full origin-bottom border border-dashed border-signal/60'
                }
                style={{ height: h }}
                initial={reduce ? false : { scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: EASE }}
              />
              <span className="u-label mt-3 block text-center text-smoke">{m.mes}</span>
            </div>
          )
        })}
      </div>
      <ul className="mt-6 grid gap-2 border-t border-line pt-5 sm:grid-cols-2">
        {copy.metas.map((m) => (
          <li key={m.mes} className="flex gap-2 text-[13px] text-smoke/70">
            <span className="u-label w-9 shrink-0 text-signal">{m.mes}</span>
            {m.nota}
          </li>
        ))}
      </ul>
    </div>
  )
}

const TONOS: Record<Formato, string> = {
  Reel: '#C6FF00',
  Carrusel: '#F2F2F2',
  'Video + shorts': '#8FB800',
}

/** Mezcla de formatos: una dona que se dibuja por tramos. */
function Mezcla() {
  const { copy } = useParrilla()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduce = useReducedMotion()

  const conteo = (Object.keys(TONOS) as Formato[])
    .map((f) => ({ f, n: copy.piezas.filter((p) => p.formato === f).length }))
    .filter((x) => x.n > 0)
  const total = copy.piezas.length
  const R = 70
  const C = 2 * Math.PI * R
  const GAP = 4
  let acc = 0

  return (
    <div ref={ref} className="border border-line bg-ink p-5 sm:p-7">
      <span className="u-label text-volt">Mezcla de formatos</span>
      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <div className="relative h-[180px] w-[180px] shrink-0">
          <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
            <circle cx="90" cy="90" r={R} fill="none" stroke="#1E1E1E" strokeWidth="18" />
            {conteo.map(({ f, n }, i) => {
              const len = (n / total) * C
              const offset = acc
              acc += len
              return (
                <motion.circle
                  key={f}
                  cx="90"
                  cy="90"
                  r={R}
                  fill="none"
                  stroke={TONOS[f]}
                  strokeWidth="18"
                  strokeDashoffset={-offset}
                  initial={reduce ? false : { strokeDasharray: `0 ${C}` }}
                  animate={
                    inView || reduce ? { strokeDasharray: `${Math.max(len - GAP, 0)} ${C}` } : {}
                  }
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.25, ease: EASE }}
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="u-display text-[44px] leading-none text-smoke">
              <Counter to={total} />
            </span>
            <span className="u-label mt-1 text-signal">piezas</span>
          </div>
        </div>
        <ul className="w-full space-y-3">
          {conteo.map(({ f, n }) => (
            <li key={f} className="flex items-center gap-3 border-b border-line pb-3 last:border-0">
              <span className="block h-3 w-3 shrink-0" style={{ background: TONOS[f] }} />
              <span className="flex-1 text-[15px] text-smoke">{f}</span>
              <span className="u-display u-tabular text-[20px] text-smoke">{n}</span>
            </li>
          ))}
          <li className="text-[13px] leading-relaxed text-signal">
            Todo se publica en Instagram y Facebook. TikTok, además, con contenido orgánico diario.
          </li>
        </ul>
      </div>
    </div>
  )
}

export default function Graficas() {
  const { copy } = useParrilla()
  return (
    <section className="u-gutter border-b border-line py-16 sm:py-24">
      <Reveal>
        <span className="u-label flex items-center gap-3 text-volt">
          <span className="h-px w-8 bg-volt" />
          Las cifras
        </span>
      </Reveal>
      <h2 className="u-display mt-5 max-w-[16ch] text-[clamp(30px,4.6vw,60px)] text-smoke">
        <SplitLines lines={['Comunidad real,', 'no bots.']} accent={[1]} />
      </h2>
      <Reveal delay={0.1}>
        <p className="mt-5 max-w-[50ch] text-[16px] leading-relaxed text-smoke/70">
          De nada sirve tener mucha gente si nadie comenta. Queremos personas que se informen,
          opinen y compartan. Primero construimos la casa: cuenta profesional, contenido constante y
          seguidores que sí son de Soacha.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Metas />
        <Mezcla />
      </div>

      <Reveal className="mt-4">
        <div className="relative overflow-hidden border border-volt/40 bg-volt/[0.04] p-6 sm:p-8">
          <span className="u-label text-volt">{copy.prueba.titulo}</span>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-8">
            <span className="u-display text-[clamp(64px,12vw,140px)] leading-[0.85] text-volt">
              <Counter to={500} suffix="K" />
            </span>
            <p className="max-w-[52ch] text-[16px] leading-relaxed text-smoke/85">
              {copy.prueba.detalle}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
