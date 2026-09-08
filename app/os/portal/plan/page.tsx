import { PlanList } from '@/components/os/portal/PlanList'
import type { EventRow } from '@/lib/os/database.types'
import { sharedPlan } from '@/lib/os/dal/pieces'
import { requireClientUser } from '@/lib/os/dal/session'
import { createClient } from '@/lib/os/supabase/server'

export default async function PlanPage() {
  const session = await requireClientUser()
  const pieces = await sharedPlan(session.clientId)

  // Los comentarios que el propio cliente ya dejó sobre cada idea.
  const notes: Record<number, EventRow[]> = {}
  if (pieces.length > 0) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('event_type', 'client_note')
      .in('piece_id', pieces.map((p) => p.id))
      .order('at')

    for (const event of data ?? []) {
      ;(notes[event.piece_id] ??= []).push(event)
    }
  }

  return <PlanList pieces={pieces} notes={notes} />
}
