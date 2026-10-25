'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { fechaCorta, useParrilla } from './ParrillaContext'

/**
 * Hilo de una pieza (o de la parrilla entera) y la caja para escribir. Enter
 * envía; Shift+Enter hace salto de línea. En el celular el teclado muestra
 * «Enviar» en vez de «Intro».
 */
export default function Comentarios({
  pieza,
  placeholder = 'Escribe un cambio, una idea o lo que no te guste…',
  autoFocus = false,
}: {
  pieza: string
  placeholder?: string
  autoFocus?: boolean
}) {
  const { estado, enviar, autor, setAutor, borrador, setBorrador } = useParrilla()
  const { hilo } = estado(pieza)
  // "Escribir mi parte" en el guion deja un borrador y salta a esta pestaña,
  // que se monta con él ya escrito.
  const [texto, setTexto] = useState(() => borrador)
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [editandoAutor, setEditandoAutor] = useState(false)
  const area = useRef<HTMLTextAreaElement>(null)
  const fin = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!borrador) return
    setBorrador('')
    const el = area.current
    if (!el) return
    el.focus()
    el.setSelectionRange(el.value.length, el.value.length)
  }, [borrador, setBorrador])

  useEffect(() => {
    if (autoFocus) area.current?.focus({ preventScroll: true })
  }, [autoFocus])

  // Altura automática: crece con el texto hasta un tope.
  useEffect(() => {
    const el = area.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`
  }, [texto])

  const mandar = async () => {
    const body = texto.trim()
    if (!body || enviando) return
    setEnviando(true)
    setError(null)
    setTexto('')
    const err = await enviar({ piece: pieza, kind: 'comment', body })
    setEnviando(false)
    if (err) {
      setError(err)
      setTexto(body)
      return
    }
    fin.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      mandar()
    }
  }

  return (
    <div>
      <ul className="space-y-3">
        {hilo.length === 0 && (
          <li className="border border-dashed border-line px-4 py-6 text-center text-[14px] text-signal">
            Aún no hay comentarios. Lo que escribas aquí le llega al equipo de Kuadra.
          </li>
        )}
        <AnimatePresence initial={false}>
          {hilo.map((r) =>
            r.kind === 'comment' ? (
              <motion.li
                key={r.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: r.id < 0 ? 0.6 : 1, y: 0 }}
                className="border border-line bg-carbon px-4 py-3"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[13px] font-bold text-smoke">{r.author}</span>
                  <span className="u-label u-tabular text-signal">
                    {r.id < 0 ? 'Enviando…' : fechaCorta(r.created_at)}
                  </span>
                </div>
                <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-relaxed text-smoke/85">
                  {r.body}
                </p>
              </motion.li>
            ) : (
              <motion.li
                key={r.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="u-label flex items-center gap-2 py-1 text-signal"
              >
                <span
                  className={`block h-1.5 w-1.5 rounded-full ${
                    r.kind === 'approve' ? 'bg-volt' : 'bg-signal'
                  }`}
                />
                <span className={r.kind === 'approve' ? 'text-volt' : undefined}>
                  {r.author} {r.kind === 'approve' ? 'aprobó' : 'quitó la aprobación'}
                </span>
                <span className="u-tabular">· {fechaCorta(r.created_at)}</span>
              </motion.li>
            ),
          )}
        </AnimatePresence>
      </ul>
      <div ref={fin} />

      <div className="mt-5">
        <div className="flex items-end gap-2 border border-line bg-carbon p-2 transition-colors focus-within:border-volt">
          <textarea
            ref={area}
            rows={1}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={onKey}
            enterKeyHint="send"
            maxLength={2000}
            placeholder={placeholder}
            aria-label="Escribe un comentario"
            className="min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-[16px] leading-snug text-smoke outline-none placeholder:text-signal"
          />
          <button
            type="button"
            onClick={mandar}
            disabled={!texto.trim() || enviando}
            aria-label="Enviar comentario"
            className="flex h-11 w-11 shrink-0 items-center justify-center bg-volt text-ink transition-opacity disabled:opacity-30"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
        </div>
        {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[12px] text-signal">
          {editandoAutor ? (
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                const v = String(new FormData(e.currentTarget).get('autor') ?? '').trim()
                if (v) setAutor(v.slice(0, 60))
                setEditandoAutor(false)
              }}
            >
              <input
                name="autor"
                defaultValue={autor}
                autoFocus
                maxLength={60}
                aria-label="Tu nombre"
                className="w-40 border border-line bg-ink px-2 py-1 text-[14px] text-smoke outline-none focus:border-volt"
              />
              <button type="submit" className="u-label text-volt">
                Listo
              </button>
            </form>
          ) : (
            <span>
              Comentas como <span className="text-smoke">{autor}</span> ·{' '}
              <button
                type="button"
                onClick={() => setEditandoAutor(true)}
                className="underline underline-offset-2 hover:text-volt"
              >
                cambiar
              </button>
            </span>
          )}
          <span className="hidden sm:inline">Enter envía · Shift + Enter, nueva línea</span>
        </div>
      </div>
    </div>
  )
}
