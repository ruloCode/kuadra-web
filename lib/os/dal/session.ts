import { redirect } from 'next/navigation'
import { cache } from 'react'

import type { ProfileRow } from '@/lib/os/database.types'
import { createClient } from '@/lib/os/supabase/server'

export type Session = {
  userId: string
  email: string
  profile: ProfileRow
}

/**
 * Quién está pidiendo esto. `cache()` la memoiza por request, así que un
 * layout y sus páginas la pueden llamar sin repetir consultas.
 *
 * Siempre `getUser()`, nunca `getSession()`: lo segundo lee la cookie sin
 * validarla contra el servidor de auth y es falsificable.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  if (!profile) return null

  return { userId: user.id, email: user.email ?? '', profile }
})

/** Es del equipo si tiene al menos un rol: mismo criterio que private.is_team(). */
export const isTeam = (profile: ProfileRow) => profile.roles.length > 0

export async function requireSession(): Promise<Session> {
  const session = await getSession()
  if (!session) redirect('/os/login')
  return session
}

/** Para todo lo que vive bajo /c/[clientId]. */
export async function requireTeam(): Promise<Session> {
  const session = await requireSession()
  if (!isTeam(session.profile)) redirect('/os/portal')
  return session
}

/** Para el portal. Devuelve el clientId ya resuelto y no nulo. */
export async function requireClientUser(): Promise<Session & { clientId: string }> {
  const session = await requireSession()
  if (isTeam(session.profile)) redirect('/os')
  if (!session.profile.client_id) redirect('/os/sin-acceso')
  return { ...session, clientId: session.profile.client_id }
}
