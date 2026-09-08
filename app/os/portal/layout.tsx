import Link from 'next/link'

import { Btn, Rec } from '@/components/os/ui'
import { signOut } from '@/lib/os/actions/auth'
import { getClient } from '@/lib/os/dal/clients'
import { sharedPlan } from '@/lib/os/dal/pieces'
import { requireClientUser } from '@/lib/os/dal/session'
import { PortalTabs } from '@/components/os/portal/PortalTabs'

export default async function PortalLayout({ children }: LayoutProps<'/os/portal'>) {
  const session = await requireClientUser()
  const [client, plan] = await Promise.all([
    getClient(session.clientId),
    sharedPlan(session.clientId),
  ])

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr]">
      <header className="flex flex-wrap items-center gap-4 border-b border-line bg-carbon px-5 py-2.5">
        <Link href="/os/portal" className="u-display flex items-center gap-2 text-lg">
          <Rec />
          KUADRA
        </Link>
        <span className="text-sm text-signal">{client.name}</span>
        <div className="flex-1" />
        <span className="text-xs text-smoke/75">{session.profile.name}</span>
        <form action={signOut}>
          <Btn type="submit" variant="ghost" small>
            Salir
          </Btn>
        </form>
      </header>

      <main className="overflow-auto p-6">
        <PortalTabs planCount={plan.length} />
        {children}
      </main>
    </div>
  )
}
