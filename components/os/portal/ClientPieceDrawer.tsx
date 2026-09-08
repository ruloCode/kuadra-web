'use client'

import { useTransition } from 'react'

import { CopyBox } from '@/components/os/CopyBox'
import { Drawer } from '@/components/os/Drawer'
import { Preview } from '@/components/os/Preview'
import { Tag } from '@/components/os/StatusPill'
import { Btn, Label } from '@/components/os/ui'
import { markPublished } from '@/lib/os/actions/pieces'
import type { PieceRow } from '@/lib/os/database.types'
import { shortDate } from '@/lib/os/dates'
import { PLATFORM_LABEL, TYPE_LABEL } from '@/lib/os/domain'
import { downloadLink } from '@/lib/os/drive'

export function ClientPieceDrawer({
  piece,
  onClose,
}: {
  piece: PieceRow | null
  onClose: () => void
}) {
  const [pending, startTransition] = useTransition()
  const fullCopy = piece ? `${piece.copy ?? ''}\n\n${piece.hashtags ?? ''}`.trim() : ''

  return (
    <Drawer open={piece !== null} title="Contenido para publicar" onClose={onClose}>
      {piece ? (
        <div className="grid gap-5">
          <div className="flex gap-2">
            <Tag tone={piece.platform === 'tt' ? 'tt' : piece.platform === 'ig' ? 'ig' : 'neutral'}>
              {PLATFORM_LABEL[piece.platform]}
            </Tag>
            <Tag>{TYPE_LABEL[piece.piece_type]}</Tag>
          </div>

          <h2 className="u-display text-xl">{piece.title}</h2>

          <p className="text-sm text-signal">
            Publicar el {shortDate(piece.scheduled_date)} · {piece.publish_time ?? '—'}
            {' · '}
            {piece.piece_type === 'reel' ? 'Video vertical 9:16' : 'Carrusel de imágenes'}
          </p>

          <Preview link={piece.link} />

          {piece.link ? (
            <div className="flex gap-2">
              <Btn
                variant="solid"
                small
                onClick={() => window.open(downloadLink(piece.link)!, '_blank')}
              >
                Descargar
              </Btn>
              <Btn variant="ghost" small onClick={() => window.open(piece.link!, '_blank')}>
                Abrir en Drive ↗
              </Btn>
            </div>
          ) : (
            <p className="text-sm text-signal">El archivo todavía está en camino.</p>
          )}

          <div>
            <Label>Texto para la publicación</Label>
            <div className="mt-2">
              <CopyBox text={fullCopy} />
            </div>
          </div>

          <div className="border-t border-line pt-4">
            {piece.status === 'publicado' ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded bg-volt px-2 py-0.5 text-xs font-bold text-ink">
                  ✓ Publicado
                </span>
                <Btn
                  small
                  variant="ghost"
                  disabled={pending}
                  onClick={() => startTransition(() => markPublished(piece.id, false))}
                >
                  Desmarcar
                </Btn>
              </div>
            ) : (
              <Btn
                variant="solid"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await markPublished(piece.id, true)
                    onClose()
                  })
                }
              >
                Ya lo publiqué
              </Btn>
            )}
          </div>

          <p className="text-xs text-signal">
            Sube el video desde el archivo descargado, no desde un pantallazo:
            así conserva la calidad original.
          </p>
        </div>
      ) : null}
    </Drawer>
  )
}
