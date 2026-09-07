'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import Reveal from './ui/Reveal'
import SplitLines from './ui/SplitLines'

// Inlined so the portrait gets the same blur-up treatment as the work frames
// without routing a one-off asset through the generated media manifest.
const NICO_BLUR =
  'data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAAAwBACdASoQABQAPxFysFAsJqSisAgBgCIJYwCo9CKRe+0hmZiZo/0a54AA/rFlulwD+EFb7/XhiAQiaijk4vUqyM/s8Cr6bBc0840DqtPFRAMuGIuFmZ/jtAoewXT6ONEf+FpSqVxumAAA'

const CAPABILITIES = [
  'Cámara cine y foto',
  'Iluminación propia',
  'Audio de campo',
  'Movilidad propia',
  'Estudio y locación',
  'Post y color',
]

export default function Estudio() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%'])

  return (
    <section id="estudio" className="scroll-mt-20 u-gutter py-16 sm:py-24 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div ref={ref} className="relative aspect-[4/5] w-full overflow-hidden bg-carbon">
            <motion.div className="absolute inset-[-8%]" style={{ y }}>
              <Image
                src="/brand/nico.webp"
                alt="Nicolás Delgado Rodríguez, director de Kuadra Film"
                fill
                sizes="(max-width: 1024px) 92vw, 40vw"
                placeholder="blur"
                blurDataURL={NICO_BLUR}
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
            <span className="u-label absolute bottom-5 left-5 flex items-center gap-2.5 bg-ink/75 px-3 py-2 text-smoke backdrop-blur-sm">
              <span className="u-rec block h-1.5 w-1.5 rounded-full bg-volt" />
              Nicolás Delgado R. · Dirección
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pt-6">
          <Reveal>
            <span className="u-label flex items-center gap-3 text-volt">
              <span className="h-px w-8 bg-volt" />
              Estudio
            </span>
          </Reveal>

          <h2 className="u-display mt-6 max-w-[16ch] text-[clamp(34px,5.2vw,74px)] text-smoke">
            <SplitLines lines={['Somos los', 'que van', 'a rodar.']} accent={[2]} />
          </h2>

          <Reveal delay={0.15}>
            <div className="mt-8 max-w-[54ch] space-y-5 text-[16px] leading-relaxed text-smoke/75 sm:text-[17px]">
              <p>
                Kuadra Film es un estudio audiovisual con base en Bogotá, dirigido por{' '}
                <span className="text-smoke">Nicolás Delgado Rodríguez</span>. Producción
                multimedia, dirección y producción de medios audiovisuales.
              </p>
              <p>
                No subcontratamos el rodaje. La persona con la que cotizas es la que llega
                con el equipo, monta la luz y después edita. Por eso el material se ve
                igual en la pieza uno y en la pieza cincuenta.
              </p>
              <p>
                Equipo propio y movilidad propia: estudio, local del cliente, calle o
                tarima. Donde haya que grabar, llegamos.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-8 sm:grid-cols-3">
              {CAPABILITIES.map((c) => (
                <span key={c} className="u-label flex items-center gap-2.5 text-smoke/80">
                  <span className="block h-1 w-1 shrink-0 bg-volt" />
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
