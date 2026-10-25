'use server'

import { createClient } from '@supabase/supabase-js'

import type { Database, FeedbackKind, ProposalFeedbackRow } from '@/lib/os/database.types'

/**
 * Comentarios y aprobaciones de las propuestas públicas. El cliente no tiene
 * cuenta, así que esto va como anon y sin cookies: quien valida la sala, los
 * tipos y los tamaños son las funciones de la base (0006), no esta capa.
 */

function anon() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}

export async function leerFeedback(room: string): Promise<ProposalFeedbackRow[]> {
  const { data, error } = await anon().rpc('proposal_feedback_list', { p_room: room })
  if (error) throw new Error('No se pudieron leer los comentarios.')
  return data ?? []
}

export type EnvioFeedback = {
  piece: string
  kind: FeedbackKind
  author: string
  body?: string
}

export type ResultadoFeedback =
  { ok: true; rows: ProposalFeedbackRow[] } | { ok: false; error: string }

/** Guarda y devuelve la sala completa, para que la vista quede al día de un viaje. */
export async function enviarFeedback(
  room: string,
  envio: EnvioFeedback,
): Promise<ResultadoFeedback> {
  const body = envio.body?.trim() ?? ''
  if (envio.kind === 'comment' && !body)
    return { ok: false, error: 'Escribe algo antes de enviar.' }
  if (body.length > 2000)
    return { ok: false, error: 'El comentario es muy largo (máx. 2.000 caracteres).' }

  const { error } = await anon().rpc('proposal_feedback_add', {
    p_room: room,
    p_piece: envio.piece.slice(0, 40),
    p_kind: envio.kind,
    p_author: envio.author.trim().slice(0, 60) || 'Cliente',
    p_body: body || null,
  })
  if (error)
    return { ok: false, error: 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.' }

  try {
    return { ok: true, rows: await leerFeedback(room) }
  } catch {
    return { ok: false, error: 'Se envió, pero no se pudo recargar la lista.' }
  }
}
