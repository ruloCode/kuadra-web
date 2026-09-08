import { createBrowserClient } from '@supabase/ssr'

import type { Database } from '@/lib/os/database.types'

/** Cliente para Client Components. La sesión vive en cookies, no en memoria. */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  )
}
