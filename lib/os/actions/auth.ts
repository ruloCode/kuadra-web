'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/lib/os/supabase/server'

export type AuthState = { error: string | null }

/**
 * Supabase devuelve mensajes en inglés y a veces demasiado específicos sobre
 * si el correo existe. Aquí se traducen y se generalizan.
 */
function readableError(message: string): string {
  if (/invalid login credentials/i.test(message)) {
    return 'Correo o contraseña incorrectos.'
  }
  if (/email not confirmed/i.test(message)) {
    return 'Esta cuenta todavía no está confirmada.'
  }
  if (/rate limit|too many/i.test(message)) {
    return 'Demasiados intentos. Espera un momento y vuelve a probar.'
  }
  return 'No se pudo iniciar sesión. Inténtalo de nuevo.'
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '')

  if (!email || !password) {
    return { error: 'Escribe tu correo y tu contraseña.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: readableError(error.message) }

  // Sólo rutas internas: un `next` absoluto sería un open redirect.
  redirect(next.startsWith('/os') && !next.startsWith('//') ? next : '/os')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/os/login')
}

export async function updatePassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')

  if (password.length < 10) {
    return { error: 'La contraseña debe tener al menos 10 caracteres.' }
  }
  if (password !== confirm) {
    return { error: 'Las dos contraseñas no coinciden.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: 'No se pudo cambiar la contraseña.' }

  redirect('/os')
}
