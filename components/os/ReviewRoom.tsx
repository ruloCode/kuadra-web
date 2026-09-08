'use client'

import { useState, useTransition } from 'react'

import { CopyBox } from '@/components/os/CopyBox'
import { PieceDrawer } from '@/components/os/PieceDrawer'
import { Preview } from '@/components/os/Preview'
import { Tag } from '@/components/os/StatusPill'
import { Btn, Empty, Label, Rec } from '@/components/os/ui'
import {
  approveAllInReview,
  requestChanges,
  setPieceStatus,
} from '@/lib/os/actions/pieces'
import type { PieceRow } from '@/lib/os/database.types'
import { shortDate } from '@/lib/os/dates'
import { PLATFORM_LABEL, TYPE_LABEL } from '@/lib/os/domain'

export function ReviewRoom({
  clientId,
  clientName,
  pieces,
  team,
}: {
  clientId: string
  clientName: string
  pieces: PieceRow[]
  team: { id: string; name: string }[]
}) {
  const [selected, setSelected] = useState<PieceRow | null>(null)
  const [asking, setAsking] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [pending, startTransition] = useTransition()

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>
            <Rec /> Reunión con {clientName}
          </Label>
          <h1 className="u-display mt-1.5 text-2xl">Sala de revisión</h1>
          <p className="mt-1.5 max-w-[70ch] text-sm text-signal">
            Comparte esta pantalla con el cliente. Pieza por pieza: previsualiza,
            aprueba o registra el cambio. Lo aprobado aparece de inmediato en su
            calendario.
          </p>
        </div>
        {pieces.length > 1 ? (
          <Btn
            small
            disabled={pending}
            onClick={() => {
              if (!confirm(`¿Aprobar las ${pieces.length} piezas en revisión?`)) return
              startTransition(() => approveAllInReview(clientId))
            }}
          >
            Aprobar todas ({pieces.length})
          </Btn>
        ) : null}
      </div>

      {pieces.length === 0 ? (
        <Empty title="Nada en revisión">
          Cuando el editor mueva piezas a «En revisión», aparecen aquí listas
          para la reunión.
        </Empty>
      ) : (
        <div className="grid gap-3">
          {pieces.map((piece) => (
            <article
              key={piece.id}
              className="grid gap-4 rounded border border-line bg-carbon p-4 md:grid-cols-[200px_1fr]"
            >
              <Preview
                link={piece.link}
                className="aspect-[9/16] max-h-[300px] w-full overflow-hidden border border-line bg-ink"
              />

              <div className="min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <b className="u-display text-base">{piece.title}</b>
                  <div className="flex gap-1.5">
                    <Tag tone={piece.platform === 'tt' ? 'tt' : piece.platform === 'ig' ? 'ig' : 'neutral'}>
                      {PLATFORM_LABEL[piece.platform]}
                    </Tag>
                    <Tag>{TYPE_LABEL[piece.piece_type]}</Tag>
                  </div>
                </div>

                <p className="mt-2 text-sm text-signal">
                  Publica {shortDate(piece.scheduled_date)} · {piece.publish_time ?? '—'}
                  {' · '}
                  {piece.rounds} ronda{piece.rounds === 1 ? '' : 's'} de cambios
                  {piece.rounds >= 1 ? (
                    <span className="text-amber"> · la siguiente es cobrable</span>
                  ) : null}
                </p>

                <div className="mt-3 max-h-32 overflow-auto">
                  <CopyBox text={`${piece.copy ?? ''}\n\n${piece.hashtags ?? ''}`.trim()} />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Btn
                    small
                    variant="solid"
                    disabled={pending}
                    onClick={() =>
                      startTransition(() =>
                        setPieceStatus(piece.id, 'aprobado', 'aprobada en reunión'),
                      )
                    }
                  >
                    Aprobar
                  </Btn>
                  <Btn
                    small
                    variant="danger"
                    onClick={() => {
                      setAsking(asking === piece.id ? null : piece.id)
                      setNote('')
                    }}
                  >
                    Pedir cambios
                  </Btn>
                  <Btn small variant="ghost" onClick={() => setSelected(piece)}>
                    Detalle
                  </Btn>
                </div>

                {asking === piece.id ? (
                  <div className="mt-3 grid gap-2 rounded border border-line bg-ink p-3">
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
                            setAsking(null)
                          })
                        }
                      >
                        Registrar cambio
                      </Btn>
                      <Btn small variant="ghost" onClick={() => setAsking(null)}>
                        Cancelar
                      </Btn>
                    </div>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

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
