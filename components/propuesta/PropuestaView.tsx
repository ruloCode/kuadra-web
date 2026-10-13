'use client'

import type { ProposalCopy } from '@/lib/propuesta'
import Arranque from './Arranque'
import Casos from './Casos'
import Cierre from './Cierre'
import Cupos from './Cupos'
import Grafica from './Grafica'
import Metodo from './Metodo'
import Pilares from './Pilares'
import Planes from './Planes'
import PropHero from './PropHero'
import PropMobileCta from './PropMobileCta'
import PropNav from './PropNav'
import { PropuestaProvider } from './PropuestaContext'
import Resultados from './Resultados'
import Statement from './Statement'

export default function PropuestaView({ copy }: { copy: ProposalCopy }) {
  return (
    <PropuestaProvider value={copy}>
      <PropNav />
      <main className="pb-[84px] sm:pb-0">
        <PropHero />
        <Resultados />
        <Grafica />
        <Casos />
        <Statement />
        {copy.pillars ? <Pilares /> : null}
        <Metodo />
        <Planes />
        {copy.cupos ? <Cupos /> : null}
        {copy.arranque ? <Arranque /> : null}
      </main>
      <Cierre />
      <PropMobileCta />
    </PropuestaProvider>
  )
}
