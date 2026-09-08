/**
 * Tipos de la base de datos de Kuadra OS.
 *
 * Escrito a partir de `supabase gen types`, pero con las columnas que tienen
 * CHECK constraint tipadas como uniones literales en vez de `string`: la base
 * ya sólo acepta esos valores, así que el compilador puede exigir lo mismo.
 *
 * Tras cada migración, contrastar con:
 *   npx supabase gen types typescript --project-id maoqrpcxlirbzpxzwdid
 */

export type Platform = 'ig' | 'tt' | 'both'
export type PieceType = 'reel' | 'carrusel'
export type PieceStatus =
  | 'grabar'
  | 'editar'
  | 'revision'
  | 'cambios'
  | 'aprobado'
  | 'publicado'
export type EventType =
  | 'created'
  | 'status'
  | 'note'
  | 'client_note'
  | 'change_request'
export type Stage =
  | 'nuevo'
  | 'conversando'
  | 'propuesta'
  | 'contrato'
  | 'firmado'
  | 'activo'
  | 'perdido'
export type PaymentStatus = 'pendiente' | 'pagado'
export type PagoState = 'al día' | 'pendiente'

export type ClientRow = {
  id: string
  name: string
  ig: string | null
  tt: string | null
  drive: string | null
  pago: PagoState
  created_at: string
}

export type ProfileRow = {
  id: string
  name: string
  roles: string[]
  client_id: string | null
  created_at: string
}

export type PieceRow = {
  id: number
  client_id: string
  scheduled_date: string
  platform: Platform
  piece_type: PieceType
  title: string
  link: string | null
  copy: string | null
  hashtags: string | null
  publish_time: string | null
  status: PieceStatus
  rounds: number
  plan_shared: boolean
  plan_ok: boolean
  guion: string | null
  assignee: string | null
  due: string | null
  created_at: string
}

export type EventRow = {
  id: number
  piece_id: number
  event_type: EventType
  body: string
  author_id: string | null
  at: string
}

export type ProspectRow = {
  id: number
  company: string
  contact: string | null
  role: string | null
  phone: string | null
  email: string | null
  ig: string | null
  web: string | null
  city: string | null
  stage: Stage
  next_date: string | null
  next_what: string | null
  notes: string | null
  created_at: string
}

export type PaymentRow = {
  id: number
  client_id: string
  month: string
  amount: number
  status: PaymentStatus
  paid_date: string | null
  invoice: string | null
  receipt: string | null
  created_at: string
}

/** Columnas que la base rellena sola y nunca se envían en un insert. */
type Generated = 'id' | 'created_at'

type TableOf<Row, InsertOptional extends keyof Row = never> = {
  Row: Row
  Insert: Omit<Row, Generated | InsertOptional> &
    Partial<Pick<Row, Extract<Generated | InsertOptional, keyof Row>>>
  Update: Partial<Row>
  Relationships: []
}

export type Database = {
  public: {
    Tables: {
      clients: TableOf<ClientRow, 'pago'>
      profiles: {
        Row: ProfileRow
        Insert: Omit<ProfileRow, 'created_at' | 'roles' | 'client_id'> &
          Partial<Pick<ProfileRow, 'created_at' | 'roles' | 'client_id'>>
        Update: Partial<ProfileRow>
        Relationships: []
      }
      pieces: TableOf<
        PieceRow,
        | 'link'
        | 'copy'
        | 'hashtags'
        | 'publish_time'
        | 'status'
        | 'rounds'
        | 'plan_shared'
        | 'plan_ok'
        | 'guion'
        | 'assignee'
        | 'due'
      >
      events: TableOf<EventRow, 'body' | 'author_id' | 'at'>
      prospects: TableOf<
        ProspectRow,
        | 'contact'
        | 'role'
        | 'phone'
        | 'email'
        | 'ig'
        | 'web'
        | 'city'
        | 'stage'
        | 'next_date'
        | 'next_what'
        | 'notes'
      >
      payments: TableOf<
        PaymentRow,
        'amount' | 'status' | 'paid_date' | 'invoice' | 'receipt'
      >
    }
    Views: { [_ in never]: never }
    Functions: {
      /** El cliente aprueba o retira su aprobación del plan del mes. */
      set_plan_ok: {
        Args: { p_piece_id: number; p_ok: boolean }
        Returns: undefined
      }
      /** El cliente marca (o desmarca) como publicada una pieza aprobada. */
      mark_published: {
        Args: { p_piece_id: number; p_published: boolean }
        Returns: undefined
      }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
