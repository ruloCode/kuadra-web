'use client'

import { previewFor } from '@/lib/os/drive'

/**
 * Previsualización de la pieza. Drive va en iframe porque sus links no son
 * archivos servibles directamente; un mp4 o un jpg alojados en otro sitio sí.
 */
export function Preview({ link, className }: { link: string | null; className?: string }) {
  const preview = previewFor(link)

  const frame =
    className ??
    'aspect-[9/16] max-h-[420px] w-full overflow-hidden border border-line bg-ink'

  if (preview.kind === 'none') {
    return (
      <div className={`${frame} grid place-items-center p-4 text-center text-sm text-signal`}>
        Sin archivo todavía.
        <br />
        <span className="text-xs">
          Pega el link de Drive en el editor y aquí aparece la vista previa.
        </span>
      </div>
    )
  }

  if (preview.kind === 'link') {
    return (
      <div className={`${frame} grid place-items-center gap-2 p-4 text-center text-sm text-signal`}>
        No hay vista previa para este link.
        <a
          href={preview.src}
          target="_blank"
          rel="noreferrer"
          className="text-volt underline"
        >
          Abrir ↗
        </a>
      </div>
    )
  }

  return (
    <div className={frame}>
      {preview.kind === 'drive' ? (
        <iframe
          src={preview.src}
          allow="autoplay"
          loading="lazy"
          className="size-full border-0"
          title="Vista previa"
        />
      ) : preview.kind === 'video' ? (
        <video src={preview.src} controls playsInline className="size-full object-contain" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- host arbitrario de Drive/CDN
        <img src={preview.src} alt="" className="size-full object-contain" />
      )}
    </div>
  )
}
