import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import type { Database } from '@/lib/os/database.types'

/**
 * Cliente para Server Components, Server Actions y Route Handlers.
 *
 * Hay que crear uno por request: nunca guardarlo en un módulo. Y sólo se usan
 * `getAll` / `setAll` — la API vieja de `get`/`set`/`remove` parte la sesión.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // Un Server Component no puede escribir cookies. No pasa nada:
            // proxy.ts ya refrescó la sesión antes de llegar aquí.
          }
        },
      },
    },
  )
}
