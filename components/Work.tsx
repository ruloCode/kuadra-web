'use client'

import { useCallback, useState } from 'react'
import { PROJECTS, getProject, TOTAL_SHOTS } from '@/lib/projects'
import WorkCard from './WorkCard'
import CaseOverlay from './CaseOverlay'
import Reveal from './ui/Reveal'
import SplitLines from './ui/SplitLines'

/**
 * Editorial mosaic — widths stay uneven so the eye moves, but the two cards in
 * a row share one height. Mixing aspect ratios inside a 12-column row made the
 * row stretch to the taller card and left ~240px of dead space under the other.
 */
const ROW_A = 'lg:aspect-auto lg:h-[clamp(440px,40vw,640px)]'
const ROW_B = 'lg:aspect-auto lg:h-[clamp(440px,40vw,640px)]'
const ROW_C = 'lg:aspect-auto lg:h-[clamp(360px,32vw,540px)]'

const LAYOUT: { span: string; mobileAspect: string; rowHeight: string }[] = [
  { span: 'lg:col-span-7', mobileAspect: 'aspect-[4/5]', rowHeight: ROW_A },
  { span: 'lg:col-span-5', mobileAspect: 'aspect-[4/5]', rowHeight: ROW_A },
  { span: 'lg:col-span-5', mobileAspect: 'aspect-[4/5]', rowHeight: ROW_B },
  { span: 'lg:col-span-7', mobileAspect: 'aspect-[4/5]', rowHeight: ROW_B },
  { span: 'lg:col-span-12', mobileAspect: 'aspect-[16/11]', rowHeight: ROW_C },
]

export default function Work() {
  const [open, setOpen] = useState<string | null>(null)
  const handleOpen = useCallback((slug: string) => setOpen(slug), [])
  const handleClose = useCallback(() => setOpen(null), [])

  return (
    <section id="trabajo" className="scroll-mt-20 relative u-gutter py-16 sm:py-24 lg:py-32">
      <div className="mb-14 flex flex-col justify-between gap-8 border-b border-line pb-10 lg:flex-row lg:items-end">
        <div>
          <Reveal>
            <span className="u-label flex items-center gap-3 text-volt">
              <span className="h-px w-8 bg-volt" />
              Trabajo seleccionado
            </span>
          </Reveal>
          <h2 className="u-display mt-6 max-w-[14ch] text-[clamp(38px,6.5vw,92px)] text-smoke">
            <SplitLines lines={['Casos', 'reales.']} accent={[1]} />
          </h2>
        </div>

        <Reveal delay={0.15} className="max-w-[38ch]">
          <p className="text-[15px] leading-relaxed text-smoke/70">
            Cinco marcas, cinco problemas distintos, un mismo método. Abre cualquiera
            para ver el set completo tal como se entregó.
          </p>
          <div className="mt-6 flex gap-8">
            <span className="u-label flex items-baseline gap-2">
              <span className="u-tabular text-[28px] leading-none text-volt">
                {String(PROJECTS.length).padStart(2, '0')}
              </span>
              <span className="text-signal">Casos</span>
            </span>
            <span className="u-label flex items-baseline gap-2">
              <span className="u-tabular text-[28px] leading-none text-volt">{TOTAL_SHOTS}</span>
              <span className="text-signal">Piezas</span>
            </span>
          </div>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-3 sm:gap-4 lg:grid-cols-12">
        {PROJECTS.map((p, i) => {
          const l = LAYOUT[i] ?? LAYOUT[0]
          return (
            <div key={p.slug} className={l.span}>
              <WorkCard
                project={p}
                index={i}
                mobileAspect={l.mobileAspect}
                rowHeight={l.rowHeight}
                onOpen={handleOpen}
              />
            </div>
          )
        })}
      </div>

      <CaseOverlay
        project={open ? (getProject(open) ?? null) : null}
        onClose={handleClose}
        onNavigate={handleOpen}
      />
    </section>
  )
}
