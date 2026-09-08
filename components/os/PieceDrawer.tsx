'use client'

import { useEffect, useState, useTransition } from 'react'

import { CopyBox } from '@/components/os/CopyBox'
import { Drawer } from '@/components/os/Drawer'
import { PieceForm } from '@/components/os/PieceForm'
import { Preview } from '@/components/os/Preview'
import { StatusPill, Tag } from '@/components/os/StatusPill'
import { Btn, Label } from '@/components/os/ui'
import {
  deletePiece,
  requestChanges,
  setPieceStatus,
} from '@/lib/os/actions/pieces'
import type { EventRow, PieceRow } from '@/lib/os/database.types'
import { shortDate } from '@/lib/os/dates'
import { PLATFORM_LABEL, TYPE_LABEL } from '@/lib/os/domain'
import { downloadLink } from '@/lib/os/drive'
import { createClient } from '@/lib/os/supabase/client'

const EVENT_LABEL: Record<string, string> = {
  created: 'Creación',
  status: 'Estado',
  note: 'Nota',
  client_note: 'Comentario del cliente',
  change_request: 'Cambio pedido',
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="u-label block">{label}</span>
      <span className="text-sm">{children}</span>
    </div>
  )
}

type DrawerProps = {
  clientId: string
  piece: PieceRow | null
  newDate: string | null
  team: { id: string; name: string }[]
  onClose: () => void
}

/**
 * El cuerpo va en su propio componente con `key`: al pasar de una pieza a otra
 * se remonta, y así el modo edición, el borrador del comentario y el historial
 * arrancan limpios sin tener que resetearlos a mano desde un efecto.
 */
export function PieceDrawer(props: DrawerProps) {
  const { piece, newDate, onClose } = props
  const open = piece !== null || newDate !== null

  return (
    <Drawer
      open={open}
      title={piece === null ? 'Nueva pieza' : 'Pieza'}
      onClose={onClose}
    >
      {open ? <PieceDrawerBody key={piece ? `p${piece.id}` : `n${newDate}`} {...props} /> : null}
    </Drawer>
  )
}

function PieceDrawerBody({ clientId, piece, newDate, team, onClose }: DrawerProps) {
  const creating = piece === null
  const [editing, setEditing] = useState(creating)
  const [askingChanges, setAskingChanges] = useState(false)
  const [note, setNote] = useState('')
  const [events, setEvents] = useState<EventRow[] | null>(null)
  const [pending, startTransition] = useTransition()

  const pieceId = piece?.id ?? null

  // El historial se pide desde el navegador: son varias decenas de filas por
  // pieza y no vale la pena arrastrarlas con el calendario entero. Al terminar
  // una mutación `pending` vuelve a false y se recarga solo.
  useEffect(() => {
    if (pieceId === null) return
    let alive = true
    createClient()
      .from('events')
      .select('*')
      .eq('piece_id', pieceId)
      .order('at', { ascending: false })
      .then(({ data }) => {
        if (alive) setEvents(data ?? [])
      })
    return () => {
      alive = false
    }
  }, [pieceId, pending])

  const names = new Map(team.map((t) => [t.id, t.name]))
  const fullCopy = piece ? `${piece.copy ?? ''}\n\n${piece.hashtags ?? ''}`.trim() : ''
  const clientNotes = events?.filter((e) => e.event_type === 'client_note') ?? []

  return (
    <>
      {editing ? (
        <PieceForm
          clientId={clientId}
          piece={piece}
          defaultDate={newDate ?? piece?.scheduled_date ?? ''}
          team={team}
          onDone={onClose}
          onCancel={() => (creating ? onClose() : setEditing(false))}
        />
      ) : piece ? (
        <div className="grid gap-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <Tag tone={piece.platform === 'tt' ? 'tt' : piece.platform === 'ig' ? 'ig' : 'neutral'}>
                {PLATFORM_LABEL[piece.platform]}
              </Tag>
              <Tag>{TYPE_LABEL[piece.piece_type]}</Tag>
            </div>
            <StatusPill status={piece.status} />
          </div>

          <h2 className="u-display text-xl">{piece.title}</h2>

          <div className="grid grid-cols-2 gap-4">
            <Meta label="Publicar el">
              {shortDate(piece.scheduled_date)} · {piece.publish_time ?? '—'}
            </Meta>
            <Meta label="Responsable">
              {piece.assignee ? (names.get(piece.assignee) ?? '—') : 'Sin asignar'}
            </Meta>
            <Meta label="Límite interno">{shortDate(piece.due)}</Meta>
            <Meta label="Rondas de cambios">{piece.rounds}</Meta>
          </div>

          <Preview link={piece.link} />

          {piece.link ? (
            <div className="flex gap-2">
              <Btn
                variant="solid"
                small
                onClick={() => window.open(downloadLink(piece.link)!, '_blank')}
              >
                Descargar
              </Btn>
              <Btn
                variant="ghost"
                small
                onClick={() => window.open(piece.link!, '_blank')}
              >
                Abrir en Drive ↗
              </Btn>
            </div>
          ) : (
            <p className="text-sm text-amber">Falta el archivo en Drive.</p>
          )}

          <div>
            <Label>Texto para la publicación</Label>
            <div className="mt-2">
              <CopyBox text={fullCopy} />
            </div>
          </div>

          {piece.guion ? (
            <div>
              <Label>Guion · sólo Kuadra</Label>
              <div className="mt-2 max-h-56 overflow-auto">
                <CopyBox text={piece.guion} label="Guion" />
              </div>
            </div>
          ) : null}

          {piece.rounds > 1 ? (
            <p className="rounded bg-[#3b3419] px-3 py-2 text-sm text-amber">
              Esta pieza lleva {piece.rounds} rondas de cambios. Según contrato,
              la ronda adicional es cobrable.
            </p>
          ) : null}

          {piece.plan_shared ? (
            <p className="text-sm">
              {piece.plan_ok ? (
                <span className="text-volt">✓ El cliente aprobó el guion</span>
              ) : (
                <span className="text-signal">
                  Guion compartido · el cliente no lo ha aprobado todavía
                </span>
              )}
            </p>
          ) : null}

          {clientNotes.length ? (
            <div className="rounded bg-[#3b3419] px-3 py-2 text-sm text-amber">
              <b className="block">El cliente comentó:</b>
              {clientNotes.map((e) => (
                <p key={e.id} className="mt-1">
                  «{e.body}»
                </p>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 border-t border-line pt-4">
            <Btn small onClick={() => setEditing(true)}>
              Editar
            </Btn>
            {piece.status === 'revision' ? (
              <>
                <Btn
                  small
                  variant="solid"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await setPieceStatus(piece.id, 'aprobado', 'aprobada en reunión')
                      onClose()
                    })
                  }
                >
                  Aprobar
                </Btn>
                <Btn small variant="danger" onClick={() => setAskingChanges((v) => !v)}>
                  Pedir cambios
                </Btn>
              </>
            ) : null}
            {piece.status === 'cambios' ? (
              <Btn
                small
                variant="solid"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await setPieceStatus(piece.id, 'revision', 'cambios resueltos')
                    onClose()
                  })
                }
              >
                Cambios listos → revisión
              </Btn>
            ) : null}
            <Btn
              small
              variant="danger"
              disabled={pending}
              onClick={() => {
                if (!confirm(`¿Eliminar «${piece.title}»? No se puede deshacer.`)) return
                startTransition(async () => {
                  await deletePiece(piece.id)
                  onClose()
                })
              }}
            >
              Eliminar
            </Btn>
          </div>

          {askingChanges ? (
            <div className="grid gap-2 rounded border border-line bg-ink p-3">
              <span className="u-label">¿Qué cambios pidió el cliente?</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                autoFocus
                className="min-h-20"
              />
              <div className="flex gap-2">
                <Btn
                  small
                  variant="solid"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await requestChanges(piece.id, note)
                      onClose()
                    })
                  }
                >
                  Registrar cambio
                </Btn>
                <Btn small variant="ghost" onClick={() => setAskingChanges(false)}>
                  Cancelar
                </Btn>
              </div>
            </div>
          ) : null}

          <div>
            <Label>Historial</Label>
            <ol className="mt-3 ml-1.5 grid gap-3 border-l-2 border-line pl-4">
              {events === null ? (
                <li className="text-sm text-signal">Cargando…</li>
              ) : events.length === 0 ? (
                <li className="text-sm text-signal">Sin eventos.</li>
              ) : (
                events.map((e) => (
                  <li key={e.id} className="relative text-sm">
                    <span className="absolute top-1.5 -left-[1.35rem] size-2 rounded-full bg-volt" />
                    {e.body}
                    <span className="mt-0.5 block text-xs text-signal">
                      {EVENT_LABEL[e.event_type] ?? e.event_type} ·{' '}
                      {e.author_id ? (names.get(e.author_id) ?? 'Cliente') : 'Sistema'} ·{' '}
                      {new Date(e.at).toLocaleString('es-CO', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </span>
                  </li>
                ))
              )}
            </ol>
          </div>
        </div>
      ) : null}
    </>
  )
}
