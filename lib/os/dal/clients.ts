import { notFound } from 'next/navigation'
import { cache } from 'react'

import type { ClientRow } from '@/lib/os/database.types'
import { createClient } from '@/lib/os/supabase/server'

/** Todos los clientes que quien pregunta puede ver (RLS decide cuáles). */
export const listClients = cache(async (): Promise<ClientRow[]> => {
  const supabase = await createClient()
  const { data } = await supabase.from('clients').select('*').order('name')
  return data ?? []
})

export const getClient = cache(async (id: string): Promise<ClientRow> => {
  const supabase = await createClient()
  const { data } = await supabase.from('clients').select('*').eq('id', id).single()
  // RLS devuelve vacío tanto si no existe como si no hay permiso; para quien
  // pregunta las dos cosas son lo mismo, y 404 no filtra cuál de las dos es.
  if (!data) notFound()
  return data
})
