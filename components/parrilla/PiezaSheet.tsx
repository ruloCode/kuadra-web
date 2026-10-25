'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { waPieza, type Pieza } from '@/lib/parrilla'
import Comentarios from './Comentarios'
import { fechaCorta, useParrilla, type Tab } from './ParrillaContext'

const EASE = [0.16, 1, 0.3, 1] as const

const TABS: { k: Tab; l: string }[] = [
  { k: 'propuesta', l: 'Propuesta' },
  { k: 'guion', l: 'Guion' },
  { k: 'comentarios', l: 'Comentarios' },
]

/**
 * Una pieza abierta: pantalla completa en el celular, panel lateral en
 * escritorio. Tres pestañas y, siempre a mano abajo, aprobar o comentar.
 */
export default function PiezaSheet() {
  const { abierta, abrir, copy } = useParrilla()
  const reduce = useReducedMotion()
  const lenis = useLenis()
  const pieza = copy.piezas.find((p) => p.id === abierta) ?? null
  const open = pieza !== null

  // Lenis maneja el scroll de la ventana y se tragaría el del panel.
  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') abrir(null)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      lenis?.start()
    }
  }, [open, lenis, abrir])

  return (
    <AnimatePresence>
      {pieza && (
        <motion.div
          className="fixed inset-0 z-[80] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Pieza ${pieza.n}: ${pieza.titulo}`}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => abrir(null)}
            className="absolute inset-0 hidden cursor-default bg-ink/70 backdrop-blur-sm sm:block"
          />
          <motion.div
            className="relative flex h-full w-full flex-col border-line bg-ink sm:max-w-[620px] sm:border-l"
            initial={reduce ? false : { y: '6%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: '6%', opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Panel key={pieza.id} pieza={pieza} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Panel({ pieza }: { pieza: Pieza }) {
  const { abrir, tab, setTab, estado, copy, enviar, setBorrador } = useParrilla()
  const tabs = copy.comentarios ? TABS : TABS.filter((t) => t.k !== 'comentarios')
  const scroller = useRef<HTMLDivElement>(null)
  const { aprobada, ultima, comentarios } = estado(pieza.id)
  const [error, setError] = useState<string | null>(null)
  const [ocupado, setOcupado] = useState(false)

  const i = copy.piezas.findIndex((p) => p.id === pieza.id)
  const prev = copy.piezas[i - 1]
  const next = copy.piezas[i + 1]
  const semana = copy.semanas.find((s) => s.n === pieza.semana)

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [tab])

  const toggle = async () => {
    setOcupado(true)
    setError(null)
    const err = await enviar({ piece: pieza.id, kind: aprobada ? 'unapprove' : 'approve' })
    setOcupado(false)
    if (err) setError(err)
  }

  const escribirParte = (t: string) => {
    setBorrador(`Mi parte (${t}): `)
    setTab('comentarios')
  }

  return (
    <>
      {/* Barra superior */}
      <div className="border-b border-line">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="u-rec block h-2 w-2 shrink-0 rounded-full bg-volt" />
            <span className="u-label u-tabular text-signal">
              {pieza.n} / {String(copy.piezas.length).padStart(2, '0')}
            </span>
            <span className="u-label truncate text-smoke/70">
              {pieza.formato} · {semana ? `Semana ${semana.n}` : 'Adicional'}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              disabled={!prev}
              onClick={() => prev && abrir(prev.id, tab)}
              aria-label="Pieza anterior"
              className="flex h-10 w-10 items-center justify-center border border-line text-smoke disabled:opacity-25"
            >
              ←
            </button>
            <button
              type="button"
              disabled={!next}
              onClick={() => next && abrir(next.id, tab)}
              aria-label="Pieza siguiente"
              className="flex h-10 w-10 items-center justify-center border border-line text-smoke disabled:opacity-25"
            >
              →
            </button>
            <button
              type="button"
              onClick={() => abrir(null)}
              aria-label="Cerrar"
              className="ml-1 flex h-10 w-10 items-center justify-center bg-smoke text-ink"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <div ref={scroller} data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain">
        <div className="px-4 pb-6 pt-6 sm:px-6">
          <h2 className="u-display text-[clamp(28px,7vw,40px)] text-smoke">{pieza.titulo}</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-smoke/70">{pieza.linea}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {[pieza.duracion, pieza.locacion, pieza.vestuario].filter(Boolean).map((m) => (
              <span key={m} className="border border-line px-2.5 py-1.5 text-[12px] text-smoke/80">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Pestañas */}
        <div className="sticky top-0 z-10 border-y border-line bg-ink/95 backdrop-blur-xl">
          <div
            className={`grid ${tabs.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}
            role="tablist"
          >
            {tabs.map((t) => (
              <button
                key={t.k}
                role="tab"
                aria-selected={tab === t.k}
                onClick={() => setTab(t.k)}
                className={`relative min-h-[48px] text-[14px] font-medium transition-colors ${
                  tab === t.k ? 'text-volt' : 'text-smoke/60'
                }`}
              >
                {t.l}
                {t.k === 'comentarios' && comentarios.length > 0 && (
                  <span className="u-tabular ml-1.5 bg-volt px-1.5 py-0.5 text-[11px] font-bold text-ink">
                    {comentarios.length}
                  </span>
                )}
                {tab === t.k && (
                  <motion.span
                    layoutId="tab-rule"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-volt"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-6 sm:px-6">
          {tab === 'propuesta' && <Propuesta pieza={pieza} />}
          {tab === 'guion' && (
            <Guion pieza={pieza} onParte={copy.comentarios ? escribirParte : null} />
          )}
          {tab === 'comentarios' && copy.comentarios && <Comentarios pieza={pieza.id} />}
        </div>
      </div>

      {/* Acciones */}
      {copy.comentarios ? (
        <div className="border-t border-line bg-ink px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 sm:px-6">
          {error && <p className="mb-2 text-[13px] text-danger">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggle}
              disabled={ocupado}
              className={`relative flex min-h-[52px] flex-[1.4] items-center justify-center gap-2 overflow-hidden text-[15px] font-bold transition-colors ${
                aprobada ? 'border border-volt text-volt' : 'bg-volt text-ink'
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={aprobada ? 'si' : 'no'}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2"
                >
                  {aprobada ? '✓ Aprobada' : 'Aprobar pieza'}
                </motion.span>
              </AnimatePresence>
            </button>
            <button
              type="button"
              onClick={() => setTab('comentarios')}
              className="flex min-h-[52px] flex-1 items-center justify-center border border-line text-[15px] text-smoke"
            >
              Pedir cambios
            </button>
          </div>
          {aprobada && ultima && (
            <p className="u-label mt-2 text-center text-signal">
              Aprobada por {ultima.author} · {fechaCorta(ultima.created_at)} · toca para quitarla
            </p>
          )}
        </div>
      ) : (
        <div className="border-t border-line bg-ink px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 sm:px-6">
          <div className="flex gap-2">
            <a
              href={waPieza(pieza, 'Apruebo')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[52px] flex-[1.4] items-center justify-center gap-2 bg-volt text-[15px] font-bold text-ink"
            >
              Aprobar por WhatsApp
            </a>
            <a
              href={waPieza(pieza, 'Quiero cambios')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[52px] flex-1 items-center justify-center border border-line text-[15px] text-smoke"
            >
              Pedir cambios
            </a>
          </div>
        </div>
      )}
    </>
  )
}

function Propuesta({ pieza }: { pieza: Pieza }) {
  return (
    <div className="space-y-6">
      <div>
        <span className="u-label text-volt">Por qué esta pieza</span>
        <p className="mt-3 text-[16px] leading-relaxed text-smoke/85">{pieza.propuesta}</p>
      </div>
      <div className="relative overflow-hidden border border-volt/40 bg-volt/[0.04] p-4">
        <span className="u-label text-volt">Gancho visual · primeros segundos</span>
        <p className="mt-2 text-[15px] leading-relaxed text-smoke">{pieza.gancho}</p>
      </div>
      <div className="grid gap-3">
        <Dato k="Radicado" v={pieza.radicado} icon="▣" />
        {pieza.verificar && <Dato k="Hay que soportar" v={pieza.verificar} icon="!" />}
        {pieza.nota && <Dato k="Ojo" v={pieza.nota} icon="•" />}
      </div>
    </div>
  )
}

function Dato({ k, v, icon }: { k: string; v: string; icon: string }) {
  return (
    <div className="flex gap-3 border-t border-line pt-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-line text-[11px] text-volt">
        {icon}
      </span>
      <div>
        <span className="u-label text-signal">{k}</span>
        <p className="mt-1 text-[15px] leading-relaxed text-smoke/85">{v}</p>
      </div>
    </div>
  )
}

function Guion({ pieza, onParte }: { pieza: Pieza; onParte: ((t: string) => void) | null }) {
  const reduce = useReducedMotion()
  return (
    <ol className="relative">
      <span className="absolute bottom-3 left-[5px] top-3 w-px bg-line" aria-hidden="true" />
      {pieza.guion.map((b, i) => (
        <motion.li
          key={i}
          className="relative pb-6 pl-7 last:pb-0"
          initial={reduce ? false : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
        >
          <span
            className={`absolute left-0 top-1.5 block h-[11px] w-[11px] rounded-full border-2 border-ink ${
              b.tipo === 'arnold' ? 'bg-volt' : b.tipo === 'cierre' ? 'bg-smoke' : 'bg-signal'
            }`}
            aria-hidden="true"
          />
          <span className="u-label u-tabular text-volt">{b.t}</span>
          {b.tipo === 'arnold' ? (
            <div className="mt-2 border border-dashed border-volt/70 p-4">
              <span className="u-label text-volt">✍️ Tu parte</span>
              <p className="mt-1.5 text-[13px] text-signal">{b.plano}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-smoke">{b.texto}</p>
              {onParte ? (
                <button
                  type="button"
                  onClick={() => onParte(b.t)}
                  className="u-label mt-3 inline-flex min-h-[40px] items-center gap-2 bg-volt px-3 text-ink"
                >
                  Escribir mi parte →
                </button>
              ) : (
                <a
                  href={waPieza(pieza, `Mi parte (${b.t}):`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-label mt-3 inline-flex min-h-[40px] items-center gap-2 bg-volt px-3 text-ink"
                >
                  Enviar mi parte por WhatsApp ↗
                </a>
              )}
            </div>
          ) : (
            <div className={`mt-2 ${b.tipo === 'cierre' ? 'border-l-2 border-smoke pl-3' : ''}`}>
              <p className="text-[13px] leading-snug text-signal">{b.plano}</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-smoke">{b.texto}</p>
            </div>
          )}
        </motion.li>
      ))}
    </ol>
  )
}
