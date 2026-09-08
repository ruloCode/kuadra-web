import type { NextRequest } from 'next/server'

import { updateSession } from '@/lib/os/supabase/proxy'

/**
 * En Next.js 16 esto ya no es `middleware.ts`: el fichero es `proxy.ts`, la
 * función se llama `proxy` y corre siempre en runtime nodejs.
 *
 * Sólo actúa sobre /os. El sitio público es estático y no necesita sesión, así
 * que no tiene por qué pagar el coste de una comprobación de auth por request.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/os', '/os/((?!_next/static|_next/image).*)'],
}
