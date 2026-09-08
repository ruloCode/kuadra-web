import { ClientSwitcher } from '@/components/os/shell/ClientSwitcher'
import { SideNav } from '@/components/os/shell/SideNav'
import { Btn, Rec } from '@/components/os/ui'
import { signOut } from '@/lib/os/actions/auth'
import { getClient, listClients } from '@/lib/os/dal/clients'
import { piecesForClient } from '@/lib/os/dal/pieces'
import { requireTeam } from '@/lib/os/dal/session'
import { today } from '@/lib/os/dates'

export default async function ClientLayout({
  children,
  params,
}: LayoutProps<'/os/c/[clientId]'>) {
  const { clientId } = await params
  const session = await requireTeam()

  const [client, clients, pieces] = await Promise.all([
    getClient(clientId),
    listClients(),
    piecesForClient(clientId),
  ])

  const now = today()
  const counts = {
    revision: pieces.filter((p) => p.status === 'revision').length,
    entregas: pieces.filter(
      (p) =>
        ['grabar', 'editar', 'cambios'].includes(p.status) &&
        p.due !== null &&
        p.due < now,
    ).length,
  }

  return (
    <div className="grid h-screen grid-rows-[auto_1fr]">
      <header className="flex items-center gap-4 border-b border-line bg-carbon px-5 py-2.5">
        <span className="u-display flex items-center gap-2 text-lg">
          <Rec />
          KUADRA
        </span>
        <ClientSwitcher clients={clients} current={clientId} />
        <div className="flex-1" />
        <div className="text-right text-xs leading-tight text-smoke/75">
          <b className="block text-smoke">{session.profile.name}</b>
          {session.profile.roles.join(' · ')}
        </div>
        <form action={signOut}>
          <Btn type="submit" variant="ghost" small>
            Salir
          </Btn>
        </form>
      </header>

      <div className="grid min-h-0 grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden flex-col border-r border-line md:flex">
          <SideNav clientId={clientId} counts={counts} />
          <div className="mt-auto p-4 text-xs text-signal">
            {client.name}
            <br />
            Pago: {client.pago}
          </div>
        </aside>
        <main className="overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
