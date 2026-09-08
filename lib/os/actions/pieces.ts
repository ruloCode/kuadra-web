'use server'

import { refresh } from 'next/cache'

import type {
  EventType,
  PieceStatus,
  PieceType,
  Platform,
} from '@/lib/os/database.types'
import { requireClientUser, requireTeam } from '@/lib/os/dal/session'
import { STATUS_LABEL } from '@/lib/os/domain'
import { createClient } from '@/lib/os/supabase/server'

/**
 * Cada acción vuelve a comprobar el rol. Una Server Action es un endpoint POST
 * alcanzable sin pasar por la UI, así que no basta con que el botón esté
 * escondido: RLS es la red de seguridad, esto es la primera puerta.
 */

async function logEvent(
  pieceId: number,
  eventType: EventType,
  body: string,
  authorId: string,
) {
  const supabase = await createClient()
  await supabase
    .from('events')
    .insert({ piece_id: pieceId, event_type: eventType, body, author_id: authorId })
}

function readPieceForm(formData: FormData) {
  const text = (k: string) => {
    const v = String(formData.get(k) ?? '').trim()
    return v === '' ? null : v
  }
  return {
    title: String(formData.get('title') ?? '').trim(),
    scheduled_date: String(formData.get('scheduled_date') ?? ''),
    publish_time: text('publish_time'),
    platform: String(formData.get('platform') ?? 'both') as Platform,
    piece_type: String(formData.get('piece_type') ?? 'reel') as PieceType,
    link: text('link'),
    copy: text('copy'),
    hashtags: text('hashtags'),
    guion: text('guion'),
    due: text('due'),
    assignee: text('assignee'),
    plan_shared: formData.get('plan_shared') === 'on',
    status: String(formData.get('status') ?? 'grabar') as PieceStatus,
  }
}

export type PieceFormState = { error: string | null }

export async function createPiece(
  clientId: string,
  _prev: PieceFormState,
  formData: FormData,
): Promise<PieceFormState> {
  const session = await requireTeam()
  const values = readPieceForm(formData)

  if (!values.title) return { error: 'Ponle un título a la pieza.' }
  if (!values.scheduled_date) return { error: 'Falta la fecha de publicación.' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pieces')
    .insert({ ...values, client_id: clientId })
    .select('id')
    .single()

  if (error || !data) return { error: 'No se pudo crear la pieza.' }

  await logEvent(data.id, 'created', 'Pieza creada', session.userId)
  refresh()
  return { error: null }
}

export async function updatePiece(
  pieceId: number,
  _prev: PieceFormState,
  formData: FormData,
): Promise<PieceFormState> {
  const session = await requireTeam()
  const values = readPieceForm(formData)

  if (!values.title) return { error: 'Ponle un título a la pieza.' }
  if (!values.scheduled_date) return { error: 'Falta la fecha de publicación.' }

  const supabase = await createClient()

  const { data: before } = await supabase
    .from('pieces')
    .select('status, rounds')
    .eq('id', pieceId)
    .single()
  if (!before) return { error: 'La pieza ya no existe.' }

  const movedToChanges =
    values.status === 'cambios' && before.status !== 'cambios'

  const { error } = await supabase
    .from('pieces')
    .update({
      ...values,
      rounds: movedToChanges ? before.rounds + 1 : before.rounds,
    })
    .eq('id', pieceId)

  if (error) return { error: 'No se pudo guardar.' }

  if (before.status !== values.status) {
    await logEvent(
      pieceId,
      'status',
      `${STATUS_LABEL[before.status as PieceStatus]} → ${STATUS_LABEL[values.status]}`,
      session.userId,
    )
  } else {
    await logEvent(pieceId, 'note', 'Pieza editada', session.userId)
  }

  refresh()
  return { error: null }
}

/** Mover en el tablero, aprobar en la sala de revisión, o resolver cambios. */
export async function setPieceStatus(
  pieceId: number,
  status: PieceStatus,
  note?: string,
) {
  const session = await requireTeam()
  const supabase = await createClient()

  const { data: before } = await supabase
    .from('pieces')
    .select('status, rounds')
    .eq('id', pieceId)
    .single()
  if (!before || before.status === status) return

  const movedToChanges = status === 'cambios' && before.status !== 'cambios'

  await supabase
    .from('pieces')
    .update({
      status,
      rounds: movedToChanges ? before.rounds + 1 : before.rounds,
    })
    .eq('id', pieceId)

  const label = `${STATUS_LABEL[before.status as PieceStatus]} → ${STATUS_LABEL[status]}`
  await logEvent(
    pieceId,
    'status',
    note ? `${label} · ${note}` : label,
    session.userId,
  )
  refresh()
}

export async function requestChanges(pieceId: number, note: string) {
  const session = await requireTeam()
  await setPieceStatus(pieceId, 'cambios')
  await logEvent(
    pieceId,
    'change_request',
    note.trim() || '(sin detalle)',
    session.userId,
  )
  refresh()
}

/** Arrastrar una pieza a otro día del calendario. */
export async function reschedulePiece(pieceId: number, date: string) {
  const session = await requireTeam()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return

  const supabase = await createClient()
  const { data: before } = await supabase
    .from('pieces')
    .select('scheduled_date')
    .eq('id', pieceId)
    .single()
  if (!before || before.scheduled_date === date) return

  await supabase.from('pieces').update({ scheduled_date: date }).eq('id', pieceId)
  await logEvent(
    pieceId,
    'note',
    `Reprogramada del ${before.scheduled_date} al ${date}`,
    session.userId,
  )
  refresh()
}

export async function approveAllInReview(clientId: string) {
  const session = await requireTeam()
  const supabase = await createClient()

  const { data: pending } = await supabase
    .from('pieces')
    .select('id')
    .eq('client_id', clientId)
    .eq('status', 'revision')
  if (!pending?.length) return

  await supabase
    .from('pieces')
    .update({ status: 'aprobado' })
    .eq('client_id', clientId)
    .eq('status', 'revision')

  for (const piece of pending) {
    await logEvent(
      piece.id,
      'status',
      'En revisión → Aprobado · aprobada en reunión',
      session.userId,
    )
  }
  refresh()
}

/** Comparte con el cliente el guion de todas las piezas en preparación del mes. */
export async function sharePlanForMonth(clientId: string, ym: string) {
  const session = await requireTeam()
  const supabase = await createClient()

  const { data: pieces } = await supabase
    .from('pieces')
    .select('id')
    .eq('client_id', clientId)
    .eq('plan_shared', false)
    .gte('scheduled_date', `${ym}-01`)
    .lte('scheduled_date', `${ym}-31`)
    .not('status', 'in', '("aprobado","publicado")')
  if (!pieces?.length) return

  await supabase
    .from('pieces')
    .update({ plan_shared: true })
    .in('id', pieces.map((p) => p.id))

  for (const piece of pieces) {
    await logEvent(
      piece.id,
      'note',
      'Guion compartido con el cliente',
      session.userId,
    )
  }
  refresh()
}

export async function deletePiece(pieceId: number) {
  await requireTeam()
  const supabase = await createClient()
  await supabase.from('pieces').delete().eq('id', pieceId)
  refresh()
}

/* ----------------------------------------------------- acciones del cliente */

/**
 * El cliente no tiene permiso de UPDATE sobre `pieces`: RLS se lo deniega.
 * Todo lo que puede cambiar pasa por estas dos funciones SECURITY DEFINER,
 * que vuelven a comprobar la propiedad de la pieza dentro de Postgres.
 */

export async function setPlanOk(pieceId: number, ok: boolean) {
  await requireClientUser()
  const supabase = await createClient()
  await supabase.rpc('set_plan_ok', { p_piece_id: pieceId, p_ok: ok })
  refresh()
}

export async function markPublished(pieceId: number, published: boolean) {
  await requireClientUser()
  const supabase = await createClient()
  await supabase.rpc('mark_published', {
    p_piece_id: pieceId,
    p_published: published,
  })
  refresh()
}

export async function addClientNote(pieceId: number, text: string) {
  const session = await requireClientUser()
  const body = text.trim()
  if (!body) return

  const supabase = await createClient()
  await supabase.from('events').insert({
    piece_id: pieceId,
    event_type: 'client_note',
    body,
    author_id: session.userId,
  })
  refresh()
}
