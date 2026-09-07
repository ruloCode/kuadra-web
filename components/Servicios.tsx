'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { SERVICES } from '@/lib/projects'
import Reveal from './ui/Reveal'
import SplitLines from './ui/SplitLines'

/** Accordion list — one row open at a time, numbered like a shot list. */
export default function Servicios() {
  const [open, setOpen] = useState(0)

  return (
    <section id="servicios" className="scroll-mt-20 u-gutter py-16 sm:py-24 lg:py-32">
      <div className="mb-12 flex flex-col justify-between gap-8 border-b border-line pb-10 lg:flex-row lg:items-end">
        <div>
          <Reveal>
            <span className="u-label flex items-center gap-3 text-volt">
              <span className="h-px w-8 bg-volt" />
              Servicios
            </span>
          </Reveal>
          <h2 className="u-display mt-6 max-w-[14ch] text-[clamp(38px,6.5vw,92px)] text-smoke">
            <SplitLines lines={['Lo que', 'hacemos.']} accent={[1]} />
          </h2>
        </div>
        <Reveal delay={0.12}>
          <p className="max-w-[36ch] text-[15px] leading-relaxed text-smoke/70">
            Cubrimos la cadena completa. Puedes contratar una parte o el proyecto
            entero, pero nunca vas a tener que coordinar tres proveedores.
          </p>
        </Reveal>
      </div>

      <div className="border-t border-line">
        {SERVICES.map((s, i) => {
          const isOpen = open === i
          return (
            <div key={s.n} className="border-b border-line">
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="group flex w-full items-center gap-5 py-7 text-left sm:gap-8"
                aria-expanded={isOpen}
              >
                <span
                  className={`u-label u-tabular shrink-0 transition-colors ${
                    isOpen ? 'text-volt' : 'text-signal group-hover:text-smoke'
                  }`}
                >
                  {s.n}
                </span>
                <span
                  className={`u-display flex-1 text-[clamp(21px,3.4vw,44px)] transition-colors ${
                    isOpen ? 'text-volt' : 'text-smoke group-hover:text-volt'
                  }`}
                >
                  {s.title}
                </span>
                <span
                  className={`relative flex h-9 w-9 shrink-0 items-center justify-center border transition-colors ${
                    isOpen ? 'border-volt' : 'border-line group-hover:border-volt'
                  }`}
                  aria-hidden="true"
                >
                  <span className={`absolute h-px w-3.5 ${isOpen ? 'bg-volt' : 'bg-smoke'}`} />
                  <span
                    className={`absolute h-3.5 w-px transition-transform duration-400 ${
                      isOpen ? 'scale-y-0 bg-volt' : 'bg-smoke'
                    }`}
                  />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-6 pb-9 sm:grid-cols-[1fr_auto] sm:gap-12 sm:pl-[calc(2rem+3ch)]">
                      <p className="max-w-[52ch] text-[15px] leading-relaxed text-smoke/75">
                        {s.body}
                      </p>
                      <div className="flex flex-wrap content-start gap-2">
                        {s.tags.map((t) => (
                          <span
                            key={t}
                            className="u-label border border-line px-3 py-1.5 text-signal"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
