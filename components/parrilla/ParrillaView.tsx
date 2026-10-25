'use client'

import type { ProposalFeedbackRow } from '@/lib/os/database.types'
import type { ParrillaCopy } from '@/lib/parrilla'
import Claqueta from '../Claqueta'
import Aprobacion from './Aprobacion'
import Graficas from './Graficas'
import Guia, { Fuera } from './Guia'
import ParrillaHero from './ParrillaHero'
import ParrillaNav, { ParrillaMobileBar } from './ParrillaNav'
import { ParrillaProvider } from './ParrillaContext'
import PiezaSheet from './PiezaSheet'
import Piezas, { Agenda } from './Piezas'
import Resumen, { Sello } from './Resumen'

export default function ParrillaView({
  copy,
  inicial,
}: {
  copy: ParrillaCopy
  inicial: ProposalFeedbackRow[]
}) {
  return (
    <ParrillaProvider copy={copy} inicial={inicial}>
      <ParrillaNav />
      <main className="pb-[84px] sm:pb-0">
        <ParrillaHero />
        <Resumen />
        <Sello />
        <Piezas />
        <Graficas />
        <Agenda />
        <Fuera />
        <Guia />
        <Aprobacion />
      </main>
      <Claqueta height={8} />
      <ParrillaMobileBar />
      <PiezaSheet />
    </ParrillaProvider>
  )
}
