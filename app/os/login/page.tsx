import { LoginForm } from '@/components/os/LoginForm'
import { Rec } from '@/components/os/ui'

export default async function LoginPage({ searchParams }: PageProps<'/os/login'>) {
  const { next } = await searchParams
  const target = typeof next === 'string' ? next : ''

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_80%_20%,rgba(198,255,0,0.12),transparent_45%)] px-5">
      <div className="w-full max-w-[420px] border border-line bg-carbon p-8">
        <div className="-mx-8 -mt-8 mb-8 flex h-2">
          {Array.from({ length: 8 }, (_, i) => (
            <i
              key={i}
              className={i % 2 === 0 ? 'flex-1 bg-volt' : 'flex-1 bg-line'}
            />
          ))}
        </div>

        <h1 className="u-display flex items-center gap-2.5 text-3xl">
          <Rec />
          KUADRA OS
        </h1>
        <p className="mt-1 text-sm text-signal">Panel interno de Kuadra Film</p>

        <LoginForm next={target} />

        <p className="mt-6 text-xs text-signal">
          ¿Problemas para entrar? Escríbele a quien administra el panel: las
          cuentas se crean a mano, no hay registro abierto.
        </p>
      </div>
    </main>
  )
}
