'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { enviarFeedback, leerFeedback, type EnvioFeedback } from '@/lib/feedback'
import type { ProposalFeedbackRow } from '@/lib/os/database.types'
import type { ParrillaCopy } from '@/lib/parrilla'

/**
 * Quién comenta. Se recuerda en este navegador; si no hay nada guardado, se
 * asume que es el cliente, que es quien abre la página casi siempre.
 */
const AUTOR_KEY = 'kuadra-parrilla-autor'
const autorListeners = new Set<() => void>()
const subscribeAutor = (cb: () => void) => {
  autorListeners.add(cb)
  return () => {
    autorListeners.delete(cb)
  }
}
const readAutor = () => {
  try {
    return localStorage.getItem(AUTOR_KEY)
  } catch {
    return null
  }
}
const writeAutor = (v: string) => {
  try {
    localStorage.setItem(AUTOR_KEY, v)
  } catch {
    // Navegación privada: el nombre vale sólo para esta visita.
  }
  autorListeners.forEach((l) => l())
}

export type EstadoPieza = {
  aprobada: boolean
  /** La última (des)aprobación, para decir quién y cuándo. */
  ultima: ProposalFeedbackRow | null
  comentarios: ProposalFeedbackRow[]
  /** Comentarios y aprobaciones, en orden, para el hilo. */
  hilo: ProposalFeedbackRow[]
}

type Ctx = {
  copy: ParrillaCopy
  autor: string
  setAutor: (v: string) => void
  estado: (pieza: string) => EstadoPieza
  aprobadas: number
  enviar: (envio: Omit<EnvioFeedback, 'author'>) => Promise<string | null>
  abierta: string | null
  abrir: (id: string | null, tab?: Tab) => void
  tab: Tab
  setTab: (t: Tab) => void
  /** Texto que el guion le pasa a la caja de comentarios ("Escribir mi parte"). */
  borrador: string
  setBorrador: (v: string) => void
}

export type Tab = 'propuesta' | 'guion' | 'comentarios'

const ParrillaCtx = createContext<Ctx | null>(null)

let tempId = -1

export function ParrillaProvider({
  copy,
  inicial,
  children,
}: {
  copy: ParrillaCopy
  inicial: ProposalFeedbackRow[]
  children: ReactNode
}) {
  const [rows, setRows] = useState(inicial)
  const [abierta, setAbierta] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('propuesta')
  const [borrador, setBorrador] = useState('')
  const guardado = useSyncExternalStore(subscribeAutor, readAutor, () => null)
  const autor = guardado || copy.client.name

  // Al volver a la pestaña se recarga: el equipo y el cliente pueden tener la
  // página abierta a la vez y así ven lo que el otro dejó.
  useEffect(() => {
    if (!copy.comentarios) return
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      leerFeedback(copy.room)
        .then(setRows)
        .catch(() => {})
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [copy.room, copy.comentarios])

  const porPieza = useMemo(() => {
    const map = new Map<string, EstadoPieza>()
    for (const r of rows) {
      const e = map.get(r.piece) ?? { aprobada: false, ultima: null, comentarios: [], hilo: [] }
      e.hilo.push(r)
      if (r.kind === 'comment') e.comentarios.push(r)
      else {
        e.ultima = r
        e.aprobada = r.kind === 'approve'
      }
      map.set(r.piece, e)
    }
    return map
  }, [rows])

  const estado = useCallback(
    (pieza: string) =>
      porPieza.get(pieza) ?? { aprobada: false, ultima: null, comentarios: [], hilo: [] },
    [porPieza],
  )

  const aprobadas = copy.piezas.filter((p) => porPieza.get(p.id)?.aprobada).length

  const enviar = useCallback(
    async (envio: Omit<EnvioFeedback, 'author'>) => {
      // Optimista: aparece de inmediato y se reemplaza con lo que guardó la base.
      const temp: ProposalFeedbackRow = {
        id: tempId--,
        room: copy.room,
        piece: envio.piece,
        kind: envio.kind,
        author: autor,
        body: envio.body?.trim() || null,
        created_at: new Date().toISOString(),
      }
      setRows((prev) => [...prev, temp])
      const res = await enviarFeedback(copy.room, { ...envio, author: autor })
      if (res.ok) {
        setRows(res.rows)
        return null
      }
      setRows((prev) => prev.filter((r) => r.id !== temp.id))
      return res.error
    },
    [autor, copy.room],
  )

  const abrir = useCallback((id: string | null, t: Tab = 'propuesta') => {
    setAbierta(id)
    if (id) setTab(t)
  }, [])

  const value: Ctx = {
    copy,
    autor,
    setAutor: writeAutor,
    estado,
    aprobadas,
    enviar,
    abierta,
    abrir,
    tab,
    setTab,
    borrador,
    setBorrador,
  }

  return <ParrillaCtx.Provider value={value}>{children}</ParrillaCtx.Provider>
}

export function useParrilla() {
  const ctx = useContext(ParrillaCtx)
  if (!ctx) throw new Error('useParrilla fuera de ParrillaProvider')
  return ctx
}

const FECHA = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/Bogota',
})

export const fechaCorta = (iso: string) => FECHA.format(new Date(iso))
