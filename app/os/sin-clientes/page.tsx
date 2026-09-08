import { Empty } from '@/components/os/ui'
import { requireTeam } from '@/lib/os/dal/session'

export default async function SinClientes() {
  await requireTeam()

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="max-w-md">
        <Empty title="Todavía no hay clientes">
          Cuando se cree el primer cliente en la base de datos, su calendario
          aparecerá aquí.
        </Empty>
      </div>
    </main>
  )
}
