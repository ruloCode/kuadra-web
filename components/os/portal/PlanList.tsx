'use client'

import { clsx } from 'clsx'
import { useState, useTransition } from 'react'

import { Btn, Empty, Label, Rec } from '@/components/os/ui'
import { addClientNote, setPlanOk } from '@/lib/os/actions/pieces'
import type { EventRow, PieceRow } from '@/lib/os/database.types'
import { shortDate } from '@/lib/os/dates'
import { PLATFORM_LABEL, TYPE_LABEL } from '@/lib/os/domain'

export function PlanList({
  pieces,
  notes,
}: {
  pieces: PieceRow[]
  notes: Record<number, EventRow[]>
}) {
  const [commenting, setCommenting] = useState<number | null>(null)
  const [text, setText] = useState('')
  const [pending, startTransition] = useTransition()

  const approved = pieces.filter((p) => p.plan_ok).length

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>
            <Rec /> Antes de grabar
          </Label>
          <h1 className="u-display mt-1.5 text-2xl">
            Plan de contenido del próximo mes
          </h1>
          <p className="mt-1.5 max-w-[70ch] text-sm text-signal">
            Esto es lo que vamos a grabar y cómo. Revísalo antes de la jornada:
            cambiar una idea aquí toma un minuto; cambiarla después de grabada,
            no. Aprueba lo que te guste y coméntanos lo que quieras ajustar.
          </p>
        </div>

        {pieces.length > 0 ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-signal">
              {approved} de {pieces.length} aprobadas
            </span>
            <Btn
              small
              variant="solid"
              disabled={pending || approved === pieces.length}
              onClick={() =>
                startTransition(async () => {
                  for (const piece of pieces) {
                    if (!piece.plan_ok) await setPlanOk(piece.id, true)
                  }
                })
              }
            >
              Aprobar todo el plan
            </Btn>
          </div>
        ) : null}
      </div>

      {pieces.length === 0 ? (
        <Empty title="Todavía no hay plan publicado">
          Cuando el equipo de Kuadra comparta el plan del próximo mes, lo verás
          aquí antes de la jornada de grabación.
        </Empty>
      ) : (
        <div className="grid gap-3">
          {pieces.map((piece) => (
            <article
              key={piece.id}
              className={clsx(
                'rounded border bg-carbon p-4',
                piece.plan_ok ? 'border-volt' : 'border-line',
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-[#2d2d2d] px-2 py-0.5 text-[0.68rem] font-bold tracking-[0.12em] uppercase">
                    {PLATFORM_LABEL[piece.platform]}
                  </span>
                  <span className="rounded bg-[#2d2d2d] px-2 py-0.5 text-[0.68rem] font-bold tracking-[0.12em] uppercase">
                    {TYPE_LABEL[piece.piece_type]}
                  </span>
                  <b className="u-display ml-1 text-base">{piece.title}</b>
                </div>
                <span className="text-sm text-signal">
                  Para publicar el {shortDate(piece.scheduled_date)}
                </span>
              </div>

              {piece.guion ? (
                <pre className="mt-3 max-h-56 overflow-auto rounded border border-line bg-ink p-3 text-sm whitespace-pre-wrap">
                  {piece.guion}
                </pre>
              ) : (
                <p className="mt-3 text-sm text-signal">Guion en preparación.</p>
              )}

              {piece.copy ? (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm text-signal">
                    Ver el texto propuesto para la publicación
                  </summary>
                  <pre className="mt-2 rounded border border-line bg-ink p-3 text-sm whitespace-pre-wrap">
                    {`${piece.copy}\n\n${piece.hashtags ?? ''}`.trim()}
                  </pre>
                </details>
              ) : null}

              {(notes[piece.id] ?? []).length > 0 ? (
                <ul className="mt-3 ml-1.5 grid gap-2 border-l-2 border-line pl-4 text-sm">
                  {notes[piece.id].map((n) => (
                    <li key={n.id} className="relative">
                      <span className="absolute top-1.5 -left-[1.35rem] size-2 rounded-full bg-volt" />
                      {n.body}
                      <span className="block text-xs text-signal">
                        {new Date(n.at).toLocaleDateString('es-CO')}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                {piece.plan_ok ? (
                  <>
                    <span className="rounded bg-[#233d0f] px-2 py-1 text-xs font-bold text-volt">
                      ✓ Aprobada por ti
                    </span>
                    <Btn
                      small
                      variant="ghost"
                      disabled={pending}
                      onClick={() => startTransition(() => setPlanOk(piece.id, false))}
                    >
                      Deshacer
                    </Btn>
                  </>
                ) : (
                  <Btn
                    small
                    variant="solid"
                    disabled={pending}
                    onClick={() => startTransition(() => setPlanOk(piece.id, true))}
                  >
                    Me gusta, grábenlo así
                  </Btn>
                )}
                <Btn
                  small
                  variant="ghost"
                  onClick={() => {
                    setCommenting(commenting === piece.id ? null : piece.id)
                    setText('')
                  }}
                >
                  Comentar o pedir un cambio
                </Btn>
              </div>

              {commenting === piece.id ? (
                <div className="mt-3 grid gap-2 rounded border border-line bg-ink p-3">
                  <span className="u-label">¿Qué quieres ajustar de esta idea?</span>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    autoFocus
                    className="min-h-20"
                  />
                  <div className="flex gap-2">
                    <Btn
                      small
                      variant="solid"
                      disabled={pending || !text.trim()}
                      onClick={() =>
                        startTransition(async () => {
                          await addClientNote(piece.id, text)
                          if (piece.plan_ok) await setPlanOk(piece.id, false)
                          setCommenting(null)
                        })
                      }
                    >
                      Enviar a Kuadra
                    </Btn>
                    <Btn small variant="ghost" onClick={() => setCommenting(null)}>
                      Cancelar
                    </Btn>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </>
  )
}
