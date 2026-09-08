import type { PieceStatus, PieceType, Platform } from '@/lib/os/database.types'

/** Los seis estados, en el orden real del flujo de producción. */
export const STATUSES: { key: PieceStatus; label: string }[] = [
  { key: 'grabar', label: 'Por grabar' },
  { key: 'editar', label: 'Por editar' },
  { key: 'revision', label: 'En revisión' },
  { key: 'cambios', label: 'Cambios' },
  { key: 'aprobado', label: 'Aprobado' },
  { key: 'publicado', label: 'Publicado' },
]

export const STATUS_LABEL = Object.fromEntries(
  STATUSES.map((s) => [s.key, s.label]),
) as Record<PieceStatus, string>

/**
 * Lo único que el cliente ve de una pieza por estado.
 * Es un espejo de la policy `pieces_client_read`: la fuente de verdad está en
 * Postgres, esto sólo evita pintar botones que la base va a rechazar.
 */
export const CLIENT_VISIBLE: PieceStatus[] = ['aprobado', 'publicado']

export const PLATFORM_LABEL: Record<Platform, string> = {
  ig: 'Instagram',
  tt: 'TikTok',
  both: 'Instagram + TikTok',
}

export const TYPE_LABEL: Record<PieceType, string> = {
  reel: 'Reel',
  carrusel: 'Carrusel',
}

/** Clases de color por estado, para chips, tarjetas y píldoras. */
export const STATUS_STYLE: Record<PieceStatus, { chip: string; pill: string }> = {
  grabar: {
    chip: 'border-l-signal',
    pill: 'bg-[#2a2a2a] text-[#bbb]',
  },
  editar: {
    chip: 'border-l-amber',
    pill: 'bg-[#3b3419] text-amber',
  },
  revision: {
    chip: 'border-l-[#7fb8ff]',
    pill: 'bg-[#1e2e45] text-[#7fb8ff]',
  },
  cambios: {
    chip: 'border-l-danger',
    pill: 'bg-[#4a1f1f] text-danger',
  },
  aprobado: {
    chip: 'border-l-volt',
    pill: 'bg-[#233d0f] text-volt',
  },
  publicado: {
    chip: 'border-l-volt bg-[#1f2a08]',
    pill: 'bg-volt text-ink',
  },
}

export const ROLES = [
  'admin',
  'estratega',
  'cuentas',
  'editor',
  'productor',
] as const
export type Role = (typeof ROLES)[number]
