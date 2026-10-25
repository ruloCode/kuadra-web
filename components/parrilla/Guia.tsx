'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Reveal from '../ui/Reveal'
import SplitLines from '../ui/SplitLines'
import { useParrilla } from './ParrillaContext'

const EASE = [0.16, 1, 0.3, 1] as const

/** Lo que dejamos por fuera, tachado con una línea que se dibuja al entrar. */
export function Fuera() {
  const { copy } = useParrilla()
  const reduce = useReducedMotion()
  return (
    <section className="u-gutter border-b border-line py-16 sm:py-24">
      <Reveal>
        <span className="u-label flex items-center gap-3 text-volt">
          <span className="h-px w-8 bg-volt" />
          Por ahora no
        </span>
      </Reveal>
      <h2 className="u-display mt-5 max-w-[16ch] text-[clamp(30px,4.6vw,60px)] text-smoke">
        <SplitLines lines={['Lo que', 'dejamos afuera.']} accent={[1]} />
      </h2>
      <ul className="mt-10 grid gap-x-10 sm:grid-cols-2">
        {copy.fuera.map((f, i) => (
          <li key={f.t} className="border-t border-line py-5">
            <span className="relative inline-block">
              <span className="u-display text-[22px] text-smoke/45">{f.t}</span>
              <motion.span
                aria-hidden="true"
                className="absolute left-0 right-0 top-1/2 h-[2px] origin-left bg-volt"
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 1 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: EASE }}
              />
            </span>
            <p className="mt-2 max-w-[44ch] text-[15px] leading-relaxed text-smoke/70">{f.d}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Cómo se cierran los videos: nombre pequeño, apellido grande. Boceto, no logo. */
function CierreMarca({ nombre }: { nombre: string }) {
  return (
    <div className="mt-6 border border-line bg-ink p-6">
      <span className="u-label text-signal">Boceto de cierre</span>
      <div className="mt-5 flex flex-col items-start">
        <span className="text-[18px] font-medium tracking-[0.3em] text-smoke/80 uppercase">
          {nombre}
        </span>
        <span className="u-display mt-1 text-[clamp(48px,12vw,84px)] leading-[0.85] text-transparent [-webkit-text-stroke:1.5px_#C6FF00]">
          APELLIDO
        </span>
      </div>
      <p className="mt-5 text-[13px] text-signal">
        El logo final llega con el manual de marca básico.
      </p>
    </div>
  )
}

/** Vestuario, marca, redes y fotos en pestañas; y lo que queda pendiente de cada lado. */
export default function Guia() {
  const { copy } = useParrilla()
  const [i, setI] = useState(0)
  const g = copy.guia[i]

  return (
    <section id="guia" className="scroll-mt-20 u-gutter bg-carbon py-16 sm:py-24">
      <Reveal>
        <span className="u-label flex items-center gap-3 text-volt">
          <span className="h-px w-8 bg-volt" />
          Para el día de grabación
        </span>
      </Reveal>
      <h2 className="u-display mt-5 max-w-[16ch] text-[clamp(30px,4.6vw,60px)] text-smoke">
        <SplitLines lines={['Imagen fresca,', 'sin uniforme.']} accent={[1]} />
      </h2>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div
            className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4"
            role="tablist"
          >
            {copy.guia.map((x, k) => (
              <button
                key={x.titulo}
                type="button"
                role="tab"
                aria-selected={i === k}
                onClick={() => setI(k)}
                className={`min-h-[48px] text-[14px] font-medium transition-colors ${
                  i === k ? 'bg-volt text-ink' : 'bg-carbon text-smoke/70 hover:text-smoke'
                }`}
              >
                {x.titulo}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={g.titulo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="mt-6 space-y-4">
                {g.items.map((it, k) => (
                  <li key={k} className="flex gap-3 text-[16px] leading-relaxed text-smoke/85">
                    <span className="u-tabular u-label mt-1.5 shrink-0 text-volt">0{k + 1}</span>
                    {it}
                  </li>
                ))}
              </ul>
              {g.titulo === 'Marca' && <CierreMarca nombre={copy.client.name} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-4 lg:col-span-5">
          {copy.pendientes.map((p) => (
            <div key={p.quien} className="border border-line bg-ink p-5">
              <span className="u-label text-volt">Pendiente · {p.quien}</span>
              <ul className="mt-4 space-y-3">
                {p.items.map((it) => (
                  <li key={it} className="flex gap-3 text-[15px] leading-snug text-smoke/85">
                    <span
                      className="mt-0.5 block h-4 w-4 shrink-0 border border-signal"
                      aria-hidden="true"
                    />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
