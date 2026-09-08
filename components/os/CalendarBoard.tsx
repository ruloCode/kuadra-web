'use client'

import { clsx } from 'clsx'
import { useState, useTransition } from 'react'

import { PieceDrawer } from '@/components/os/PieceDrawer'
import { Btn, BtnLink, Label, Rec } from '@/components/os/ui'
import { reschedulePiece, sharePlanForMonth } from '@/lib/os/actions/pieces'
import type { PieceRow } from '@/lib/os/database.types'
import type { Cell } from '@/lib/os/dates'
import { STATUSES, STATUS_STYLE } from '@/lib/os/domain'

const DOW = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export function CalendarBoard({
  clientId,
  cells,
  pieces,
  team,
  today,
  title,
  monthParam,
  prevHref,
  nextHref,
  todayHref,
}: {
  clientId: string
  cells: Cell[]
  pieces: PieceRow[]
  team: { id: string; name: string }[]
  today: string
  title: string
  monthParam: string
  prevHref: string
  nextHref: string
  todayHref: string
}) {
  const [selected, setSelected] = useState<PieceRow | null>(null)
  const [newDate, setNewDate] = useState<string | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const byDate = new Map<string, PieceRow[]>()
  for (const piece of pieces) {
    const list = byDate.get(piece.scheduled_date)
    if (list) list.push(piece)
    else byDate.set(piece.scheduled_date, [piece])
  }

  function drop(date: string) {
    setOver(null)
    const id = dragging
    setDragging(null)
    if (id === null) return
    startTransition(() => reschedulePiece(id, date))
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>
            <Rec /> Calendario
          </Label>
          <h1 className="u-display mt-1.5 text-2xl">{title}</h1>
          <p className="mt-1.5 text-sm text-signal">
            Arrastra una pieza a otro día para reprogramarla. El cliente sólo ve
            lo aprobado y lo publicado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <BtnLink href={prevHref} variant="ghost" small aria-label="Mes anterior">
            ‹
          </BtnLink>
          <BtnLink href={todayHref} variant="ghost" small>
            Hoy
          </BtnLink>
          <BtnLink href={nextHref} variant="ghost" small aria-label="Mes siguiente">
            ›
          </BtnLink>
          <Btn
            variant="ghost"
            small
            disabled={pending}
            onClick={() => {
              if (!confirm('¿Compartir con el cliente el guion de las piezas en preparación de este mes?')) return
              startTransition(() => sharePlanForMonth(clientId, monthParam))
            }}
          >
            Compartir plan del mes
          </Btn>
          <Btn variant="solid" small onClick={() => setNewDate(cells[10].date)}>
            + Nueva pieza
          </Btn>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px border border-line bg-line">
        {DOW.map((d) => (
          <div key={d} className="u-label bg-carbon p-2 text-center">
            {d}
          </div>
        ))}

        {cells.map((cell) => {
          const items = byDate.get(cell.date) ?? []
          return (
            <div
              key={cell.date}
              onDragOver={(e) => {
                e.preventDefault()
                setOver(cell.date)
              }}
              onDragLeave={() => setOver((v) => (v === cell.date ? null : v))}
              onDrop={(e) => {
                e.preventDefault()
                drop(cell.date)
              }}
              className={clsx(
                'group relative min-h-[112px] bg-ink p-1.5 transition-colors',
                cell.otherMonth && 'opacity-35',
                cell.date === today && 'outline-2 -outline-offset-2 outline-volt',
                over === cell.date && 'bg-[#1f2a08]',
              )}
            >
              <div className="u-tabular u-display text-sm text-smoke/70">{cell.day}</div>

              <button
                type="button"
                onClick={() => setNewDate(cell.date)}
                aria-label={`Nueva pieza el ${cell.date}`}
                className="absolute top-1 right-1 px-1 text-volt opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              >
                +
              </button>

              {items.map((piece) => (
                <button
                  key={piece.id}
                  type="button"
                  draggable
                  onDragStart={() => setDragging(piece.id)}
                  onDragEnd={() => setDragging(null)}
                  onClick={() => setSelected(piece)}
                  className={clsx(
                    'mt-1 flex w-full items-center gap-1.5 rounded border-l-[3px] bg-carbon px-1.5 py-1',
                    'cursor-grab text-left text-xs leading-tight hover:bg-panel active:cursor-grabbing',
                    STATUS_STYLE[piece.status].chip,
                    dragging === piece.id && 'opacity-40',
                  )}
                >
                  <span aria-hidden className="text-[0.6rem] opacity-70">
                    {piece.piece_type === 'reel' ? '▶' : '❏'}
                  </span>
                  <span className="truncate">{piece.title}</span>
                  {piece.plan_shared ? (
                    <span
                      className="ml-auto text-[0.6rem] text-volt"
                      title="Guion compartido con el cliente"
                    >
                      {piece.plan_ok ? '✓' : '◎'}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <span
            key={s.key}
            className={clsx('rounded px-2 py-0.5 text-xs font-bold', STATUS_STYLE[s.key].pill)}
          >
            {s.label}
          </span>
        ))}
      </div>

      <PieceDrawer
        clientId={clientId}
        piece={selected}
        newDate={selected ? null : newDate}
        team={team}
        onClose={() => {
          setSelected(null)
          setNewDate(null)
        }}
      />
    </>
  )
}
