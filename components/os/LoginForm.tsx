'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { Btn, Field } from '@/components/os/ui'
import { signIn, type AuthState } from '@/lib/os/actions/auth'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <Btn type="submit" variant="solid" disabled={pending} className="w-full justify-center">
      {pending ? 'Entrando…' : 'Entrar'}
    </Btn>
  )
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<AuthState, FormData>(signIn, {
    error: null,
  })

  return (
    <form action={formAction} className="mt-6 grid gap-4">
      <input type="hidden" name="next" value={next} />

      <Field label="Correo">
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          placeholder="tu@correo.com"
        />
      </Field>

      <Field label="Contraseña">
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>

      {state.error ? (
        <p
          role="alert"
          className="rounded border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {state.error}
        </p>
      ) : null}

      <Submit />
    </form>
  )
}
