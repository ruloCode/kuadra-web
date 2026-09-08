import { signOut } from '@/lib/os/actions/auth'
import { Btn } from '@/components/os/ui'
import { requireSession } from '@/lib/os/dal/session'

export default async function SinAcceso() {
  const session = await requireSession()

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="max-w-md border border-line bg-carbon p-8 text-center">
        <h1 className="u-display text-xl">Tu cuenta todavía no tiene acceso</h1>
        <p className="mt-3 text-sm text-signal">
          Entraste como <b className="text-smoke">{session.email}</b>, pero esta
          cuenta aún no está asociada a un cliente ni al equipo de Kuadra.
          Alguien del equipo tiene que asignártelo.
        </p>
        <form action={signOut} className="mt-6">
          <Btn type="submit" variant="ghost">Salir</Btn>
        </form>
      </div>
    </main>
  )
}
