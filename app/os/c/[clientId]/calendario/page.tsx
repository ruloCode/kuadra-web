import { CalendarBoard } from '@/components/os/CalendarBoard'
import { listTeam, piecesInRange } from '@/lib/os/dal/pieces'
import {
  monthGrid,
  monthName,
  monthParam,
  parseMonth,
  shiftMonth,
  today,
} from '@/lib/os/dates'

export default async function CalendarioPage({
  params,
  searchParams,
}: PageProps<'/os/c/[clientId]/calendario'>) {
  const { clientId } = await params
  const { mes } = await searchParams

  const { y, m } = parseMonth(typeof mes === 'string' ? mes : undefined)
  const { cells, from, to } = monthGrid(y, m)

  const [pieces, team] = await Promise.all([
    piecesInRange(clientId, from, to),
    listTeam(),
  ])

  const prev = shiftMonth(y, m, -1)
  const next = shiftMonth(y, m, 1)
  const base = `/os/c/${clientId}/calendario`

  return (
    <CalendarBoard
      clientId={clientId}
      cells={cells}
      pieces={pieces}
      team={team}
      today={today()}
      title={`${monthName(m)} ${y}`}
      monthParam={monthParam(y, m)}
      prevHref={`${base}?mes=${monthParam(prev.y, prev.m)}`}
      nextHref={`${base}?mes=${monthParam(next.y, next.m)}`}
      todayHref={base}
    />
  )
}
