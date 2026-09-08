'use client'

import { clsx } from 'clsx'
import { useState } from 'react'

import { PieceDrawer } from '@/components/os/PieceDrawer'
import { StatusPill, Tag } from '@/components/os/StatusPill'
import { Btn } from '@/components/os/ui'
import type { PieceRow } from '@/lib/os/database.types'
import { shortDate } from '@/lib/os/dates'

export function DeliveryTable({
  clientId,
  pieces,
  team,
  today,
}: {
  clientId: string
  pieces: PieceRow[]
  team: { id: string; name: string }[]
  today: string
}) {
  const [selected, setSelected] = useState<PieceRow | null>(null)
  const names = new Map(team.map((t) => [t.id, t.name]))

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {['Pieza', 'Estado', 'Responsable', 'Límite interno', 'Publica', 'Archivo', ''].map(
                (h) => (
                  <th
                    key={h}
                    className="u-label border-b border-line px-2.5 py-2 text-left"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {pieces.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-2.5 py-6 text-center text-signal">
                  Todo entregado.
                </td>
              </tr>
            ) : (
              pieces.map((piece) => {
                const late = piece.due !== null && piece.due < today
                return (
                  <tr key={piece.id} className="align-top">
                    <td
                      className={clsx(
                        'border-b border-line px-2.5 py-3',
                        late && 'border-l-[3px] border-l-danger',
                      )}
                    >
                      <b className="block">{piece.title}</b>
                      <div className="mt-1 flex gap-1.5">
                        <Tag tone={piece.platform === 'tt' ? 'tt' : piece.platform === 'ig' ? 'ig' : 'neutral'}>
                          {piece.platform}
                        </Tag>
                        <Tag>{piece.piece_type}</Tag>
                      </div>
                    </td>
                    <td className="border-b border-line px-2.5 py-3">
                      <StatusPill status={piece.status} />
                    </td>
                    <td className="border-b border-line px-2.5 py-3">
                      {piece.assignee ? (names.get(piece.assignee) ?? '—') : '—'}
                    </td>
                    <td className="u-tabular border-b border-line px-2.5 py-3">
                      {shortDate(piece.due)}
                      {late ? <span className="ml-1 text-danger">vencida</span> : null}
                    </td>
                    <td className="u-tabular border-b border-line px-2.5 py-3">
                      {shortDate(piece.scheduled_date)}
                    </td>
                    <td className="border-b border-line px-2.5 py-3">
                      {piece.link ? (
                        <span className="text-volt">✓</span>
                      ) : (
                        <span className="text-amber">falta</span>
                      )}
                    </td>
                    <td className="border-b border-line px-2.5 py-3">
                      <Btn small variant="ghost" onClick={() => setSelected(piece)}>
                        Abrir
                      </Btn>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
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
