import { redirect } from 'next/navigation'

import { listClients } from '@/lib/os/dal/clients'
import { isTeam, requireSession } from '@/lib/os/dal/session'

/**
 * La raíz no pinta nada: manda a cada quien a su sitio según el rol.
 */
export default async function Home() {
  const session = await requireSession()

  if (!isTeam(session.profile)) {
    redirect(session.profile.client_id ? '/os/portal' : '/os/sin-acceso')
  }

  const clients = await listClients()
  if (clients.length === 0) redirect('/os/sin-clientes')

  redirect(`/os/c/${clients[0].id}/calendario`)
}
