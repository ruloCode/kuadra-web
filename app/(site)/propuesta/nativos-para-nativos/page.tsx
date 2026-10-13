import type { Metadata } from 'next'
import PropuestaView from '@/components/propuesta/PropuestaView'
import { NATIVOS } from '@/lib/propuesta'

export const metadata: Metadata = {
  title: `Propuesta para ${NATIVOS.client.name}`,
  description:
    'Un día de grabación en tu local, doce piezas para todo el mes y cada guion decidido con datos. Propuesta de contenido de Kuadra Film.',
  // A private commercial document: reachable by link, kept out of search.
  robots: { index: false, follow: false },
  openGraph: {
    title: `Propuesta para ${NATIVOS.client.name} · Kuadra Film`,
    description: 'Un día de grabación, un mes de contenido. Resultados medidos con datos.',
  },
}

export default function PropuestaNativos() {
  return <PropuestaView copy={NATIVOS} />
}
