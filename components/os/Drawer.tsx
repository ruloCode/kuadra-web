'use client'

import { clsx } from 'clsx'
import { useEffect } from 'react'

import { Btn } from '@/components/os/ui'

/** Panel lateral. Se cierra con Escape o clicando el fondo. */
export function Drawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div
        onClick={onClose}
        className={clsx(
          'fixed inset-0 z-30 bg-black/50 transition-opacity',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <aside
        aria-hidden={!open}
        className={clsx(
          'fixed top-0 right-0 z-40 flex h-screen w-full max-w-[520px] flex-col',
          'border-l border-line bg-carbon transition-transform duration-200',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <b className="u-display text-base">{title}</b>
          <Btn type="button" variant="ghost" small onClick={onClose}>
            Cerrar
          </Btn>
        </header>
        <div className="flex-1 overflow-auto p-5">{open ? children : null}</div>
      </aside>
    </>
  )
}
