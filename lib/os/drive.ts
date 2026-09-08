/**
 * Google Drive es el almacén de Kuadra: las piezas se guardan como link, no
 * como archivo subido. Estos helpers vienen del prototipo, donde ya estaban
 * probados contra los formatos de URL que Drive genera.
 */

/** Saca el id de un link de Drive, en cualquiera de sus dos formas. */
export function driveId(url: string | null | undefined): string | null {
  if (!url) return null
  const m = url.match(/\/d\/([\w-]+)|[?&]id=([\w-]+)/)
  return m ? (m[1] ?? m[2] ?? null) : null
}

/** Link de descarga directa, para que el cliente baje el archivo original. */
export function downloadLink(url: string | null | undefined): string | null {
  if (!url) return null
  const id = driveId(url)
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url
}

export type Preview =
  | { kind: 'drive'; src: string }
  | { kind: 'video'; src: string }
  | { kind: 'image'; src: string }
  | { kind: 'link'; src: string }
  | { kind: 'none' }

/** Cómo previsualizar un link: iframe de Drive, video, imagen o nada. */
export function previewFor(url: string | null | undefined): Preview {
  if (!url) return { kind: 'none' }
  const id = driveId(url)
  if (id) {
    return { kind: 'drive', src: `https://drive.google.com/file/d/${id}/preview` }
  }
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return { kind: 'video', src: url }
  if (/\.(jpe?g|png|webp|gif)(\?|$)/i.test(url)) return { kind: 'image', src: url }
  return { kind: 'link', src: url }
}
