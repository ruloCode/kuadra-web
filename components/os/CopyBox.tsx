'use client'

import { useState } from 'react'

import { Btn } from '@/components/os/ui'

/** El copy listo para pegar en Instagram o TikTok, con botón de copiar. */
export function CopyBox({ text, label = 'Texto' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Safari sin permiso de portapapeles: seleccionar a mano y ya.
      return
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="relative rounded border border-line bg-ink p-3 pr-24 text-sm whitespace-pre-wrap">
      {text || <span className="text-signal">Sin texto todavía.</span>}
      {text ? (
        <Btn
          type="button"
          variant="solid"
          small
          onClick={copy}
          className="absolute top-2 right-2"
        >
          {copied ? '✓ Copiado' : `Copiar ${label.toLowerCase()}`}
        </Btn>
      ) : null}
    </div>
  )
}
