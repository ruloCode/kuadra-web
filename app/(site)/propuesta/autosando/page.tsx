import type { Metadata } from 'next'
import PropuestaView from '@/components/propuesta/PropuestaView'
import { AUTOSANDO } from '@/lib/propuesta'

export const metadata: Metadata = {
  title: `Propuesta para ${AUTOSANDO.client.name}`,
  description:
    'Plan de contenido para Autosando: 12 piezas al mes, una jornada en el concesionario y guiones definidos por datos. Precio de lanzamiento $1.300.000 IVA incluido.',
  robots: { index: false, follow: false },
  openGraph: {
    title: `Propuesta para ${AUTOSANDO.client.name} · Kuadra Film`,
    description:
      'Un día en vitrina, un mes de contenido. 8 reels y 4 carruseles para rotar inventario.',
  },
}

export default function PropuestaAutosando() {
  return <PropuestaView copy={AUTOSANDO} />
}
