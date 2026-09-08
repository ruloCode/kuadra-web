import { notFound } from 'next/navigation'
import { cache } from 'react'

import type { EventRow, PieceRow, PieceStatus } from '@/lib/os/database.types'
import { createClient } from '@/lib/os/supabase/server'

/**
 * Ninguna de estas funciones filtra por permisos a mano: las policies de
 * Postgres ya recortan las filas. El `client_id` que se pasa es para acotar
 * la consulta, no para proteger nada.
 */

export const piecesInRange = cache(
  async (clientId: string, from: string, to: string): Promise<PieceRow[]> => {
    const supabase = await createClient()
    const { data } = await supabase
      .from('pieces')
      .select('*')
      .eq('client_id', clientId)
      .gte('scheduled_date', from)
      .lte('scheduled_date', to)
      .order('scheduled_date')
      .order('publish_time', { nullsFirst: true })
    return data ?? []
  },
)

export const piecesForClient = cache(async (clientId: string): Promise<PieceRow[]> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('pieces')
    .select('*')
    .eq('client_id', clientId)
    .order('scheduled_date')
  return data ?? []
})

export const piecesByStatus = cache(
  async (clientId: string, status: PieceStatus): Promise<PieceRow[]> => {
    const supabase = await createClient()
    const { data } = await supabase
      .from('pieces')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', status)
      .order('scheduled_date')
    return data ?? []
  },
)

/** Las piezas cuyo guion se compartió con el cliente y aún no están aprobadas. */
export const sharedPlan = cache(async (clientId: string): Promise<PieceRow[]> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('pieces')
    .select('*')
    .eq('client_id', clientId)
    .eq('plan_shared', true)
    .not('status', 'in', '("aprobado","publicado")')
    .order('scheduled_date')
  return data ?? []
})

export const getPiece = cache(async (id: number): Promise<PieceRow> => {
  const supabase = await createClient()
  const { data } = await supabase.from('pieces').select('*').eq('id', id).single()
  if (!data) notFound()
  return data
})

export const pieceEvents = cache(async (pieceId: number): Promise<EventRow[]> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('piece_id', pieceId)
    .order('at', { ascending: false })
  return data ?? []
})

/** Nombres del equipo, para pintar el autor de cada evento y el responsable. */
export const teamNames = cache(async (): Promise<Map<string, string>> => {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('id, name')
  return new Map((data ?? []).map((p) => [p.id, p.name]))
})

/** Sólo el equipo: es quien puede ser responsable de una pieza. */
export const listTeam = cache(async (): Promise<{ id: string; name: string }[]> => {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('id, name, roles').order('name')
  return (data ?? [])
    .filter((p) => p.roles.length > 0)
    .map(({ id, name }) => ({ id, name }))
})
