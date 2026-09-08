import { ClientCalendar } from '@/components/os/portal/ClientCalendar'
import { piecesInRange, sharedPlan } from '@/lib/os/dal/pieces'
import { requireClientUser } from '@/lib/os/dal/session'
import {
  monthGrid,
  monthName,
  monthParam,
  parseMonth,
  shiftMonth,
  today,
} from '@/lib/os/dates'

export default async function PortalPage({ searchParams }: PageProps<'/os/portal'>) {
  const session = await requireClientUser()
  const { mes } = await searchParams

  const { y, m } = parseMonth(typeof mes === 'string' ? mes : undefined)
  const { cells, from, to } = monthGrid(y, m)

  // RLS ya recorta: el cliente sólo recibe lo aprobado, lo publicado y su plan.
  const [all, plan] = await Promise.all([
    piecesInRange(session.clientId, from, to),
    sharedPlan(session.clientId),
  ])
  const visible = all.filter((p) => p.status === 'aprobado' || p.status === 'publicado')

  const prev = shiftMonth(y, m, -1)
  const next = shiftMonth(y, m, 1)

  return (
    <ClientCalendar
      cells={cells}
      pieces={visible}
      today={today()}
      title={`${monthName(m)} ${y}`}
      prevHref={`/os/portal?mes=${monthParam(prev.y, prev.m)}`}
      nextHref={`/os/portal?mes=${monthParam(next.y, next.m)}`}
      todayHref="/os/portal"
      planCount={plan.length}
    />
  )
}
