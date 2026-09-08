import { clsx } from 'clsx'

import type { PieceStatus } from '@/lib/os/database.types'
import { STATUS_LABEL, STATUS_STYLE } from '@/lib/os/domain'

export function StatusPill({
  status,
  className,
}: {
  status: PieceStatus
  className?: string
}) {
  return (
    <span
      className={clsx(
        'inline-block rounded px-2 py-0.5 text-xs font-bold',
        STATUS_STYLE[status].pill,
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

export function Tag({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode
  tone?: 'neutral' | 'ig' | 'tt'
}) {
  return (
    <span
      className={clsx(
        'inline-block rounded px-2 py-0.5 text-[0.68rem] font-bold tracking-[0.12em] uppercase',
        tone === 'ig' && 'bg-[#3a2440] text-[#f0a0ff]',
        tone === 'tt' && 'bg-[#1f3a3a] text-[#8ff5ee]',
        tone === 'neutral' && 'bg-[#2d2d2d] text-smoke/80',
      )}
    >
      {children}
    </span>
  )
}
