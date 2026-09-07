import type { Metadata } from 'next'
import PropNav from '@/components/propuesta/PropNav'
import PropHero from '@/components/propuesta/PropHero'
import Resultados from '@/components/propuesta/Resultados'
import Grafica from '@/components/propuesta/Grafica'
import Casos from '@/components/propuesta/Casos'
import Statement from '@/components/propuesta/Statement'
import Metodo from '@/components/propuesta/Metodo'
import Planes from '@/components/propuesta/Planes'
import Cierre from '@/components/propuesta/Cierre'
import PropMobileCta from '@/components/propuesta/PropMobileCta'
import { CLIENT } from '@/lib/propuesta'

export const metadata: Metadata = {
  title: `Propuesta para ${CLIENT.name}`,
  description:
    'Un día de grabación en tu local, doce piezas para todo el mes y cada guion decidido con datos. Propuesta de contenido de Kuadra Film.',
  // A private commercial document: reachable by link, kept out of search.
  robots: { index: false, follow: false },
  openGraph: {
    title: `Propuesta para ${CLIENT.name} · Kuadra Film`,
    description: 'Un día de grabación, un mes de contenido. Resultados medidos con datos.',
  },
}

export default function PropuestaNativos() {
  return (
    <>
      <PropNav />
      <main className="pb-[84px] sm:pb-0">
        <PropHero />
        <Resultados />
        <Grafica />
        <Casos />
        <Statement />
        <Metodo />
        <Planes />
        <Cierre />
      </main>
      <PropMobileCta />
    </>
  )
}
