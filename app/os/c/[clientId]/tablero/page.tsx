import { BoardView } from '@/components/os/BoardView'
import { getClient } from '@/lib/os/dal/clients'
import { listTeam, piecesForClient } from '@/lib/os/dal/pieces'
import { today } from '@/lib/os/dates'

export default async function TableroPage({
  params,
}: PageProps<'/os/c/[clientId]/tablero'>) {
  const { clientId } = await params

  const [client, pieces, team] = await Promise.all([
    getClient(clientId),
    piecesForClient(clientId),
    listTeam(),
  ])

  return (
    <BoardView
      clientId={clientId}
      clientName={client.name}
      pieces={pieces}
      team={team}
      today={today()}
    />
  )
}
