'use client'

import { clsx } from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITEMS = [
  { slug: 'calendario', label: 'Calendario' },
  { slug: 'tablero', label: 'Tablero' },
  { slug: 'revision', label: 'Sala de revisión' },
  { slug: 'entregas', label: 'Entregas' },
] as const

export function SideNav({
  clientId,
  counts,
}: {
  clientId: string
  counts: Partial<Record<string, number>>
}) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {ITEMS.map((item) => {
        const href = `/os/c/${clientId}/${item.slug}`
        const active = pathname === href
        const count = counts[item.slug]

        return (
          <Link
            key={item.slug}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={clsx(
              'flex items-center justify-between rounded px-3 py-2.5 text-sm transition-colors',
              active
                ? 'bg-volt font-bold text-ink'
                : 'text-smoke/75 hover:bg-carbon hover:text-smoke',
            )}
          >
            <span>{item.label}</span>
            {count ? (
              <span
                className={clsx(
                  'rounded-full px-1.5 text-xs',
                  active ? 'bg-black/20' : 'bg-black/30',
                )}
              >
                {count}
              </span>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}
