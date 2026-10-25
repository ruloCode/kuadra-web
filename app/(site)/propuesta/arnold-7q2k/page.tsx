import type { Metadata } from 'next'
import { connection } from 'next/server'
import ParrillaView from '@/components/parrilla/ParrillaView'
import { leerFeedback } from '@/lib/feedback'
import type { ProposalFeedbackRow } from '@/lib/os/database.types'
import { ARNOLD } from '@/lib/parrilla'

export const metadata: Metadata = {
  title: `Parrilla de noviembre · ${ARNOLD.client.name}`,
  description:
    'Diecisiete piezas para la precampaña: propuesta, guion y aprobación de cada contenido.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'La Soacha que nadie muestra · Kuadra Film',
    description: 'Parrilla de noviembre: guiones, propuesta y aprobación de cada pieza.',
  },
}

export default async function ParrillaArnold() {
  let inicial: ProposalFeedbackRow[] = []
  if (ARNOLD.comentarios) {
    // Los comentarios cambian con cada visita: así la página no se prerenderiza.
    await connection()
    try {
      inicial = await leerFeedback(ARNOLD.room)
    } catch {
      // Sin conexión a la base la parrilla se lee igual; enviar avisará del error.
    }
  }
  return <ParrillaView copy={ARNOLD} inicial={inicial} />
}
