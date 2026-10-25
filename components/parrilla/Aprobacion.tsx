'use client'

import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import Claqueta from '../Claqueta'
import Wordmark from '../ui/Wordmark'
import Reveal from '../ui/Reveal'
import { wa } from '@/lib/propuesta'
import Comentarios from './Comentarios'
import { useParrilla } from './ParrillaContext'

const R = 88
const C = 2 * Math.PI * R

/** Anillo de avance: cuántas piezas van aprobadas. Se anima cada vez que cambia. */
function Anillo({ hechas, total }: { hechas: number; total: number }) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const p = useMotionValue(0)
  const dash = useTransform(p, (v) => `${v * C} ${C}`)

  useEffect(() => {
    if (!inView) return
    const to = total ? hechas / total : 0
    if (reduce) {
      p.set(to)
      return
    }
    const ctl = animate(p, to, { duration: 1.1, ease: [0.16, 1, 0.3, 1] })
    return () => ctl.stop()
  }, [hechas, total, inView, reduce, p])

  return (
    <div className="relative mx-auto h-[220px] w-[220px] shrink-0">
      <svg ref={ref} viewBox="0 0 220 220" className="h-full w-full -rotate-90">
        <circle cx="110" cy="110" r={R} fill="none" stroke="#1E1E1E" strokeWidth="14" />
        <motion.circle
          cx="110"
          cy="110"
          r={R}
          fill="none"
          stroke="#C6FF00"
          strokeWidth="14"
          strokeLinecap="butt"
          style={{ strokeDasharray: dash }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="u-display u-tabular text-[64px] leading-none text-smoke">
          {hechas}
          <span className="text-[28px] text-signal">/{total}</span>
        </span>
        <span className="u-label mt-2 text-signal">aprobadas</span>
      </div>
    </div>
  )
}

/** El cierre: avance, aprobar todo de una vez y un comentario general. */
export default function Aprobacion() {
  const { copy, aprobadas, estado, enviar } = useParrilla()
  const total = copy.piezas.length
  const pendientes = copy.piezas.filter((p) => !estado(p.id).aprobada)
  const [confirmar, setConfirmar] = useState(false)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const aprobarTodo = async () => {
    setOcupado(true)
    setError(null)
    for (const p of pendientes) {
      const err = await enviar({ piece: p.id, kind: 'approve' })
      if (err) {
        setError(err)
        break
      }
    }
    setOcupado(false)
    setConfirmar(false)
  }

  return (
    <>
      <Claqueta height={12} />
      {copy.comentarios ? (
        <section id="aprobar" className="scroll-mt-16 u-gutter py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="u-label flex items-center gap-3 text-volt">
                  <span className="u-rec block h-2 w-2 rounded-full bg-volt" />
                  Tu visto bueno
                </span>
              </Reveal>
              <div className="mt-8">
                <Anillo hechas={aprobadas} total={total} />
              </div>
              <div className="mt-8 text-center">
                {pendientes.length === 0 ? (
                  <p className="u-display text-[24px] text-volt">Parrilla aprobada. ¡A grabar!</p>
                ) : confirmar ? (
                  <div className="space-y-3">
                    <p className="text-[15px] text-smoke/85">
                      ¿Apruebas las {pendientes.length} piezas que faltan? Igual puedes seguir
                      comentando.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={aprobarTodo}
                        disabled={ocupado}
                        className="flex min-h-[52px] flex-[1.4] items-center justify-center bg-volt text-[15px] font-bold text-ink disabled:opacity-50"
                      >
                        {ocupado ? 'Aprobando…' : 'Sí, aprobar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmar(false)}
                        className="flex min-h-[52px] flex-1 items-center justify-center border border-line text-[15px] text-smoke"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmar(true)}
                    className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 bg-volt px-7 text-[16px] font-bold text-ink transition-colors hover:bg-smoke sm:w-auto"
                  >
                    Aprobar las {pendientes.length} que faltan
                  </button>
                )}
                {error && <p className="mt-3 text-[13px] text-danger">{error}</p>}
              </div>
            </div>

            <div className="lg:col-span-7">
              <h2 className="u-display max-w-[16ch] text-[clamp(30px,4.4vw,56px)] text-smoke">
                ¿Algo de la parrilla en general?
              </h2>
              <p className="mt-4 max-w-[50ch] text-[16px] leading-relaxed text-smoke/70">
                Temas que faltan, el orden de las semanas, el tono, lo que sea. Escríbelo y dale
                Enter: le llega al equipo y ajustamos antes de grabar.
              </p>
              <div className="mt-8">
                <Comentarios pieza="general" placeholder="Escribe aquí tu comentario general…" />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section id="aprobar" className="scroll-mt-16 u-gutter py-16 sm:py-24">
          <Reveal>
            <span className="u-label flex items-center gap-3 text-volt">
              <span className="u-rec block h-2 w-2 rounded-full bg-volt" />
              Tu visto bueno
            </span>
          </Reveal>
          <h2 className="u-display mt-6 max-w-[16ch] text-[clamp(34px,5.4vw,72px)] text-smoke">
            ¿Qué le cambiarías?
          </h2>
          <p className="mt-5 max-w-[50ch] text-[17px] leading-relaxed text-smoke/75">
            Temas que faltan, el orden de las semanas, el tono, lo que sea. Escríbenos y ajustamos
            antes de grabar. Si todo está bien, con un “aprobado” arrancamos.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={wa('Hola Kuadra, apruebo la parrilla de noviembre completa.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[56px] items-center justify-center gap-2 bg-volt px-7 text-[16px] font-bold text-ink transition-colors hover:bg-smoke"
            >
              Aprobar toda la parrilla ↗
            </a>
            <a
              href={wa('Hola Kuadra, sobre la parrilla de noviembre quiero cambiar:')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[56px] items-center justify-center gap-2 border border-line px-7 text-[16px] text-smoke transition-colors hover:border-volt hover:text-volt"
            >
              Pedir cambios
            </a>
          </div>
        </section>
      )}

      <footer className="u-gutter border-t border-line py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Wordmark className="h-6 w-auto text-smoke" />
            <span className="u-label text-signal">De tu cuadra, cuadro a cuadro.</span>
          </div>
          <a
            href={copy.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="u-label inline-flex min-h-[48px] items-center justify-center gap-2 border border-line px-5 text-smoke transition-colors hover:border-volt hover:text-volt"
          >
            ¿Prefieres hablarlo? WhatsApp ↗
          </a>
        </div>
      </footer>
    </>
  )
}
