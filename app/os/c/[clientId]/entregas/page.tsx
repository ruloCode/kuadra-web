import { DeliveryTable } from '@/components/os/DeliveryTable'
import { Label, Rec, Stat } from '@/components/os/ui'
import { getClient } from '@/lib/os/dal/clients'
import { listTeam, piecesForClient } from '@/lib/os/dal/pieces'
import { today } from '@/lib/os/dates'

const PENDING = ['grabar', 'editar', 'cambios', 'revision']

export default async function EntregasPage({
  params,
}: PageProps<'/os/c/[clientId]/entregas'>) {
  const { clientId } = await params

  const [client, pieces, team] = await Promise.all([
    getClient(clientId),
    piecesForClient(clientId),
    listTeam(),
  ])

  const now = today()
  const pending = pieces
    .filter((p) => PENDING.includes(p.status))
    .sort((a, b) => (a.due ?? a.scheduled_date).localeCompare(b.due ?? b.scheduled_date))

  const delivered = pieces.filter((p) => ['aprobado', 'publicado'].includes(p.status))
  const late = pending.filter((p) => p.due !== null && p.due < now)
  const noFile = pieces.filter((p) => !p.link && p.status !== 'grabar')
  const published = pieces.filter((p) => p.status === 'publicado')

  return (
    <>
      <div className="mb-6">
        <Label>
          <Rec /> {client.name}
        </Label>
        <h1 className="u-display mt-1.5 text-2xl">Entregas y vencimientos</h1>
        <p className="mt-1.5 text-sm text-signal">
          Lo que falta para que el mes esté completo. Esta es la pantalla de
          cada mañana.
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat value={pieces.length} label="piezas en total" tone="smoke" />
        <Stat value={delivered.length} label="entregadas al cliente" />
        <Stat
          value={late.length}
          label="vencidas"
          tone={late.length ? 'danger' : 'volt'}
        />
        <Stat
          value={noFile.length}
          label="sin archivo en Drive"
          tone={noFile.length ? 'amber' : 'volt'}
        />
        <Stat value={published.length} label="publicadas por el cliente" />
      </div>

      <DeliveryTable clientId={clientId} pieces={pending} team={team} today={now} />
    </>
  )
}
