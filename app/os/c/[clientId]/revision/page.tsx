import { ReviewRoom } from '@/components/os/ReviewRoom'
import { getClient } from '@/lib/os/dal/clients'
import { listTeam, piecesByStatus } from '@/lib/os/dal/pieces'

export default async function RevisionPage({
  params,
}: PageProps<'/os/c/[clientId]/revision'>) {
  const { clientId } = await params

  const [client, pieces, team] = await Promise.all([
    getClient(clientId),
    piecesByStatus(clientId, 'revision'),
    listTeam(),
  ])

  return (
    <ReviewRoom
      clientId={clientId}
      clientName={client.name}
      pieces={pieces}
      team={team}
    />
  )
}
