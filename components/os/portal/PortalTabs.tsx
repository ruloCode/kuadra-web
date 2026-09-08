'use client'

import { clsx } from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function PortalTabs({ planCount }: { planCount: number }) {
  const pathname = usePathname()

  const tabs = [
    { href: '/os/portal', label: 'Calendario', count: 0 },
    { href: '/os/portal/plan', label: 'Plan del próximo mes', count: planCount },
  ]

  return (
    <div className="mb-6 inline-flex overflow-hidden rounded border border-line">
      {tabs.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 text-sm transition-colors',
              active ? 'bg-volt font-bold text-ink' : 'text-smoke/75 hover:text-smoke',
            )}
          >
            {tab.label}
            {tab.count ? (
              <span className="rounded-full bg-black/20 px-1.5 text-xs">{tab.count}</span>
            ) : null}
          </Link>
        )
      })}
    </div>
  )
}
