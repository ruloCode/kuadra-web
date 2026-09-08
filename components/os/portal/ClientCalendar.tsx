'use client'

import { clsx } from 'clsx'
import { useState } from 'react'

import { ClientPieceDrawer } from '@/components/os/portal/ClientPieceDrawer'
import { BtnLink, Label, Rec } from '@/components/os/ui'
import type { PieceRow } from '@/lib/os/database.types'
import type { Cell } from '@/lib/os/dates'

const DOW = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export function ClientCalendar({
  cells,
  pieces,
  today,
  title,
  prevHref,
  nextHref,
  todayHref,
  planCount,
}: {
  cells: Cell[]
  pieces: PieceRow[]
  today: string
  title: string
  prevHref: string
  nextHref: string
  todayHref: string
  planCount: number
}) {
  const [selected, setSelected] = useState<PieceRow | null>(null)

  const byDate = new Map<string, PieceRow[]>()
  for (const piece of pieces) {
    const list = byDate.get(piece.scheduled_date)
    if (list) list.push(piece)
    else byDate.set(piece.scheduled_date, [piece])
  }

  const ready = pieces.filter((p) => p.status === 'aprobado').length

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>
            <Rec /> Tu calendario de publicación
          </Label>
          <h1 className="u-display mt-1.5 text-2xl">{title}</h1>
          <p className="mt-1.5 max-w-[70ch] text-sm text-signal">
            Haz clic en un día para ver el contenido, copiar el texto y
            descargarlo.
            {ready > 0 ? (
              <b className="ml-1 text-volt">
                {ready} pieza{ready > 1 ? 's' : ''} lista{ready > 1 ? 's' : ''} para
                publicar.
              </b>
            ) : null}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <BtnLink href={prevHref} variant="ghost" small aria-label="Mes anterior">
            ‹
          </BtnLink>
          <BtnLink href={todayHref} variant="ghost" small>
            Hoy
          </BtnLink>
          <BtnLink href={nextHref} variant="ghost" small aria-label="Mes siguiente">
            ›
          </BtnLink>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px border border-line bg-line">
        {DOW.map((d) => (
          <div key={d} className="u-label bg-carbon p-2 text-center">
            {d}
          </div>
        ))}

        {cells.map((cell) => (
          <div
            key={cell.date}
            className={clsx(
              'min-h-[112px] bg-ink p-1.5',
              cell.otherMonth && 'opacity-35',
              cell.date === today && 'outline-2 -outline-offset-2 outline-volt',
            )}
          >
            <div className="u-tabular u-display text-sm text-smoke/70">{cell.day}</div>

            {(byDate.get(cell.date) ?? []).map((piece) => (
              <button
                key={piece.id}
                type="button"
                onClick={() => setSelected(piece)}
                className={clsx(
                  'mt-1 flex w-full items-center gap-1.5 rounded border-l-[3px] border-l-volt bg-carbon px-1.5 py-1.5',
                  'text-left text-xs leading-tight hover:bg-panel',
                  piece.status === 'publicado' && 'opacity-55 line-through',
                )}
              >
                <span aria-hidden className="text-[0.6rem] opacity-70">
                  {piece.piece_type === 'reel' ? '▶' : '❏'}
                </span>
                <span className="truncate">{piece.title}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {planCount > 0 ? (
        <p className="mt-4 text-sm text-signal">
          Ya está listo el plan de contenido del próximo mes.{' '}
          <BtnLink href="/os/portal/plan" small className="ml-1">
            Ver el plan ({planCount})
          </BtnLink>
        </p>
      ) : null}

      <ClientPieceDrawer piece={selected} onClose={() => setSelected(null)} />
    </>
  )
}
