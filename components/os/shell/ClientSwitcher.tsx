'use client'

import { usePathname, useRouter } from 'next/navigation'

import type { ClientRow } from '@/lib/os/database.types'

/** Cambiar de cliente conserva la vista: del calendario de uno al del otro. */
export function ClientSwitcher({
  clients,
  current,
}: {
  clients: ClientRow[]
  current: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  // /os/c/<cliente>/<vista>
  const view = pathname.split('/')[4] ?? 'calendario'

  return (
    <select
      aria-label="Cliente"
      value={current}
      onChange={(e) => router.push(`/os/c/${e.target.value}/${view}`)}
      className="w-auto min-w-[200px] px-2.5 py-1.5 text-sm"
    >
      {clients.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  )
}
