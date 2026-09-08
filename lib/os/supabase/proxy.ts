import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import type { Database } from '@/lib/os/database.types'

/** Rutas que se pueden ver sin sesión. */
const PUBLIC_PATHS = ['/os/login']

/**
 * Refresca el token en cada request y manda a /login a quien no tenga sesión.
 *
 * Es una comprobación optimista, no la última línea de defensa: quien manda
 * sobre los datos es RLS en Postgres, y encima de eso el DAL en lib/dal.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          supabaseResponse = NextResponse.next({ request })
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options)
          }
          // Sin estas cabeceras un CDN podría cachear la respuesta que trae
          // las cookies de sesión y servírsela a otra persona.
          for (const [key, value] of Object.entries(headers)) {
            supabaseResponse.headers.set(key, value)
          }
        },
      },
    },
  )

  // Nada de código entre createServerClient y getUser(): cualquier cosa en
  // medio provoca cierres de sesión aleatorios muy difíciles de rastrear.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/os/login'
    url.search = ''
    if (pathname !== '/') url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (user && pathname.startsWith('/os/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/os'
    url.search = ''
    return NextResponse.redirect(url)
  }

  // Se devuelve tal cual: construir otra respuesta aquí pierde las cookies.
  return supabaseResponse
}
