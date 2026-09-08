'use client'

import { clsx } from 'clsx'
import { useState, useTransition } from 'react'

import { PieceDrawer } from '@/components/os/PieceDrawer'
import { Tag } from '@/components/os/StatusPill'
import { Label, Rec } from '@/components/os/ui'
import { requestChanges, setPieceStatus } from '@/lib/os/actions/pieces'
import type { PieceRow, PieceStatus } from '@/lib/os/database.types'
import { shortDate } from '@/lib/os/dates'
import { STATUSES } from '@/lib/os/domain'

export function BoardView({
  clientId,
  clientName,
  pieces,
  team,
  today,
}: {
  clientId: string
  clientName: string
  pieces: PieceRow[]
  team: { id: string; name: string }[]
  today: string
}) {
  const [selected, setSelected] = useState<PieceRow | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const [over, setOver] = useState<PieceStatus | null>(null)
  const [, startTransition] = useTransition()

  const names = new Map(team.map((t) => [t.id, t.name]))

  function drop(status: PieceStatus) {
    setOver(null)
    const id = dragging
    setDragging(null)
    if (id === null) return

    const piece = pieces.find((p) => p.id === id)
    if (!piece || piece.status === status) return

    if (status === 'cambios') {
      const note = prompt('¿Qué cambio se pidió?')
      if (note === null) return
      startTransition(() => requestChanges(id, note))
      return
    }
    startTransition(() => setPieceStatus(id, status))
  }

  return (
    <>
      <div className="mb-6">
        <Label>
          <Rec /> Producción · {clientName}
        </Label>
        <h1 className="u-display mt-1.5 text-2xl">Tablero</h1>
        <p className="mt-1.5 text-sm text-signal">
          Arrastra entre columnas. Cada movimiento queda en el historial de la
          pieza.
        </p>
      </div>

      <div className="grid grid-flow-col auto-cols-[minmax(200px,1fr)] gap-3 overflow-x-auto pb-2">
        {STATUSES.map((column) => {
          const items = pieces.filter((p) => p.status === column.key)
          return (
            <section
              key={column.key}
              onDragOver={(e) => {
                e.preventDefault()
                setOver(column.key)
              }}
              onDragLeave={() => setOver((v) => (v === column.key ? null : v))}
              onDrop={(e) => {
                e.preventDefault()
                drop(column.key)
              }}
              className={clsx(
                'flex min-h-[240px] flex-col gap-2 rounded border bg-carbon p-2.5 transition-colors',
                over === column.key ? 'border-volt' : 'border-line',
              )}
            >
              <h2 className="u-label flex justify-between">
                <span>{column.label}</span>
                <span>{items.length}</span>
              </h2>

              {items.map((piece) => {
                const late =
                  piece.due !== null &&
                  piece.due < today &&
                  !['aprobado', 'publicado'].includes(piece.status)

                return (
                  <button
                    key={piece.id}
                    type="button"
                    draggable
                    onDragStart={() => setDragging(piece.id)}
                    onDragEnd={() => setDragging(null)}
                    onClick={() => setSelected(piece)}
                    className={clsx(
                      'cursor-grab rounded border bg-ink p-2.5 text-left text-sm active:cursor-grabbing',
                      late ? 'border-danger' : 'border-line',
                      dragging === piece.id && 'opacity-40',
                    )}
                  >
                    <b className="mb-1.5 block leading-tight">{piece.title}</b>
                    <div className="flex flex-wrap gap-1.5">
                      <Tag tone={piece.platform === 'tt' ? 'tt' : piece.platform === 'ig' ? 'ig' : 'neutral'}>
                        {piece.platform}
                      </Tag>
                      <Tag>{piece.piece_type}</Tag>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-signal">
                      <span>Publica {shortDate(piece.scheduled_date)}</span>
                      <span>
                        {piece.assignee ? (names.get(piece.assignee) ?? '—') : '—'}
                      </span>
                    </div>
                    {!piece.link ? (
                      <div className="mt-1 text-xs text-amber">sin archivo</div>
                    ) : null}
                  </button>
                )
              })}
            </section>
          )
        })}
      </div>

      <PieceDrawer
        clientId={clientId}
        piece={selected}
        newDate={null}
        team={team}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
