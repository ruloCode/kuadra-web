'use client'

import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Reveal from '../ui/Reveal'
import SplitLines from '../ui/SplitLines'
import type { Hito, Pieza } from '@/lib/parrilla'
import { useParrilla } from './ParrillaContext'

const EASE = [0.16, 1, 0.3, 1] as const

const ICONO: Record<Pieza['formato'], string> = {
  Reel: '▶',
  Carrusel: '▦',
  'Video + shorts': '◉',
}

type Filtro = 'todas' | 'pendientes' | 'aprobadas' | 'comentadas'

function Ficha({ pieza, i }: { pieza: Pieza; i: number }) {
  const { abrir, estado, copy } = useParrilla()
  const reduce = useReducedMotion()
  const { aprobada, comentarios } = estado(pieza.id)
  const sala = copy.comentarios
  return (
    <motion.button
      type="button"
      layout
      onClick={() => abrir(pieza.id)}
      className={`group relative flex w-full flex-col overflow-hidden border p-4 text-left transition-colors sm:p-5 ${
        aprobada ? 'border-volt/60 bg-volt/[0.05]' : 'border-line bg-ink hover:border-signal'
      }`}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: EASE }}
    >
      <span
        aria-hidden="true"
        className="u-display u-tabular pointer-events-none absolute -right-2 -top-4 text-[96px] leading-none text-smoke/[0.04] transition-colors group-hover:text-volt/10"
      >
        {pieza.n}
      </span>
      <span className="flex items-center justify-between gap-3">
        <span className="u-label flex items-center gap-2 text-signal">
          <span className="u-tabular text-smoke">{pieza.n}</span>
          <span className={aprobada ? 'text-volt' : 'text-smoke/60'}>{ICONO[pieza.formato]}</span>
          {pieza.formato}
        </span>
        <span className="u-label u-tabular text-signal">{pieza.duracion}</span>
      </span>
      <span className="u-display mt-4 block text-[22px] leading-[1.02] text-smoke">
        {pieza.titulo}
      </span>
      <span className="mt-2 block text-[14px] leading-relaxed text-smoke/65">{pieza.linea}</span>
      <span className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-3">
        {sala ? (
          <span
            className={`u-label flex items-center gap-2 ${aprobada ? 'text-volt' : 'text-signal'}`}
          >
            <span
              className={`block h-1.5 w-1.5 rounded-full ${aprobada ? 'bg-volt' : 'bg-signal'}`}
            />
            {aprobada ? 'Aprobada' : 'Por revisar'}
            {comentarios.length > 0 && (
              <span className="u-tabular text-smoke/70">· 💬 {comentarios.length}</span>
            )}
          </span>
        ) : (
          <span className="u-label text-signal">{pieza.locacion}</span>
        )}
        <span className="u-label text-smoke transition-colors group-hover:text-volt">
          Ver guion →
        </span>
      </span>
    </motion.button>
  )
}

/** Todas las piezas, agrupadas por semana y filtrables por estado. */
export default function Piezas() {
  const { copy, estado, aprobadas } = useParrilla()
  const [filtro, setFiltro] = useState<Filtro>('todas')

  const pasa = (p: Pieza) => {
    const e = estado(p.id)
    if (filtro === 'pendientes') return !e.aprobada
    if (filtro === 'aprobadas') return e.aprobada
    if (filtro === 'comentadas') return e.comentarios.length > 0
    return true
  }
  const comentadas = copy.piezas.filter((p) => estado(p.id).comentarios.length > 0).length
  const FILTROS: { k: Filtro; l: string; n: number }[] = [
    { k: 'todas', l: 'Todas', n: copy.piezas.length },
    { k: 'pendientes', l: 'Por revisar', n: copy.piezas.length - aprobadas },
    { k: 'aprobadas', l: 'Aprobadas', n: aprobadas },
    { k: 'comentadas', l: 'Con comentarios', n: comentadas },
  ]

  const grupos = [
    ...copy.semanas.map((s) => ({
      key: `s${s.n}`,
      titulo: `Semana ${s.n}`,
      meta: s.rango,
      piezas: copy.piezas.filter((p) => p.semana === s.n),
      extra: false,
    })),
    {
      key: 'extra',
      titulo: '5 videos adicionales',
      meta: 'Se ubican al aprobarlos',
      piezas: copy.piezas.filter((p) => p.bloque === 'adicional'),
      extra: true,
    },
  ]
    .map((g) => ({ ...g, piezas: g.piezas.filter(pasa) }))
    .filter((g) => g.piezas.length > 0)

  return (
    <section id="piezas" className="scroll-mt-16 u-gutter border-b border-line py-16 sm:py-24">
      <Reveal>
        <span className="u-label flex items-center gap-3 text-volt">
          <span className="h-px w-8 bg-volt" />
          Las piezas · noviembre
        </span>
      </Reveal>
      <h2 className="u-display mt-5 max-w-[16ch] text-[clamp(30px,4.6vw,60px)] text-smoke">
        <SplitLines lines={['Cada contenido,', 'con su guion.']} accent={[1]} />
      </h2>
      <Reveal delay={0.1}>
        <p className="mt-5 max-w-[50ch] text-[16px] leading-relaxed text-smoke/70">
          Toca una pieza para ver la propuesta y el guion. Donde dice ✍️ va tu parte
          {copy.comentarios
            ? ': escríbela en los comentarios'
            : ': mándanosla por WhatsApp desde ahí mismo'}
          . Grabamos todo en una jornada y elegimos juntos con qué video salimos.
        </p>
      </Reveal>

      {/* Filtros: en el celular se deslizan de lado */}
      {copy.comentarios && (
        <div className="-mx-5 mt-8 overflow-x-auto px-5 sm:mx-0 sm:px-0" data-lenis-prevent>
          <div className="flex w-max gap-2">
            {FILTROS.map((f) => (
              <button
                key={f.k}
                type="button"
                onClick={() => setFiltro(f.k)}
                aria-pressed={filtro === f.k}
                className={`flex min-h-[44px] items-center gap-2 border px-4 text-[14px] transition-colors ${
                  filtro === f.k
                    ? 'border-volt bg-volt text-ink'
                    : 'border-line text-smoke hover:border-signal'
                }`}
              >
                {f.l}
                <span
                  className={`u-tabular text-[12px] ${filtro === f.k ? 'text-ink/70' : 'text-signal'}`}
                >
                  {f.n}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 space-y-12">
        {grupos.length === 0 && (
          <p className="border border-dashed border-line px-4 py-10 text-center text-signal">
            Nada por aquí con este filtro.
          </p>
        )}
        {grupos.map((g) => (
          <div key={g.key}>
            <div
              className={`flex items-baseline justify-between gap-4 border-b pb-3 ${
                g.extra ? 'border-dashed border-volt/50' : 'border-line'
              }`}
            >
              <span className={`u-display text-[22px] ${g.extra ? 'text-volt' : 'text-smoke'}`}>
                {g.titulo}
              </span>
              <span className="u-label u-tabular text-signal">{g.meta}</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.piezas.map((p, i) => (
                <Ficha key={p.id} pieza={p} i={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const PUNTO: Record<Hito['estado'], string> = {
  hecho: 'bg-signal',
  proximo: 'bg-volt',
  meta: 'bg-smoke',
  pendiente: 'border border-dashed border-volt bg-ink',
}

/** Lo que viene, en una línea de tiempo que se dibuja al bajar. */
export function Agenda() {
  const { copy } = useParrilla()
  const ref = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.6'] })
  const scaleY = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1])

  return (
    <section className="u-gutter bg-carbon py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <span className="u-label flex items-center gap-3 text-volt">
                <span className="h-px w-8 bg-volt" />
                Agenda
              </span>
            </Reveal>
            <h2 className="u-display mt-5 max-w-[12ch] text-[clamp(30px,4vw,54px)] text-smoke">
              <SplitLines lines={['Lo que', 'sigue.']} accent={[1]} />
            </h2>
          </div>
        </div>
        <ol ref={ref} className="relative lg:col-span-8">
          <span className="absolute bottom-2 left-[7px] top-2 w-px bg-line" aria-hidden="true">
            <motion.span className="block h-full w-full origin-top bg-volt" style={{ scaleY }} />
          </span>
          {copy.hitos.map((h, i) => (
            <motion.li
              key={h.titulo}
              className="relative pb-8 pl-9 last:pb-0"
              initial={reduce ? false : { opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.05 * i, ease: EASE }}
            >
              <span
                className={`absolute left-0 top-1 block h-[15px] w-[15px] rounded-full ${PUNTO[h.estado]}`}
              />
              <span className="u-label u-tabular text-volt">{h.fecha}</span>
              <h3
                className={`mt-1 text-[18px] font-bold ${h.estado === 'hecho' ? 'text-smoke/50 line-through' : 'text-smoke'}`}
              >
                {h.titulo}
              </h3>
              <p className="mt-1 max-w-[50ch] text-[15px] leading-relaxed text-smoke/70">
                {h.detalle}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
