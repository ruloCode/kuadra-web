'use client'

import Image from 'next/image'
import { CONTACT, waLink, waWith } from '@/lib/projects'
import Magnetic from './ui/Magnetic'
import Marquee from './ui/Marquee'
import Reveal from './ui/Reveal'
import SplitLines from './ui/SplitLines'

export default function Contacto() {
  return (
    <section id="contacto" className="scroll-mt-20 relative overflow-hidden border-t border-line pt-16 sm:pt-24 lg:pt-32">
      <div className="u-gutter">
        <Reveal>
          <span className="u-label flex items-center gap-3 text-volt">
            <span className="u-rec block h-2 w-2 rounded-full bg-volt" />
            Contacto
          </span>
        </Reveal>

        <h2 className="u-display mt-8 max-w-[13ch] text-[clamp(44px,10vw,150px)] text-smoke">
          <SplitLines lines={['Cuéntanos', 'qué hay', 'que rodar.']} accent={[2]} />
        </h2>

        <Reveal delay={0.2}>
          <p className="mt-9 max-w-[44ch] text-[clamp(16px,1.3vw,19px)] leading-relaxed text-smoke/75">
            Escríbenos con lo que tengas: una idea suelta, una fecha, un producto.
            Respondemos con alcance, tiempos y precio. Sin reuniones de una hora para
            explicar lo obvio.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-volt px-8 py-5 text-[16px] font-bold text-ink transition-colors hover:bg-smoke"
              >
                Escribir por WhatsApp
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
            <a
              href={waWith('Hola Kuadra, tengo una fecha en mente y quiero saber si tienen disponibilidad.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-line px-8 py-5 text-[16px] text-smoke transition-colors hover:border-volt hover:text-volt"
            >
              Tengo una fecha en mente
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-10 md:grid-cols-4">
            {[
              { k: 'Base', v: CONTACT.city },
              { k: 'Cobertura', v: 'Colombia' },
              { k: 'Canal', v: 'WhatsApp directo' },
              { k: 'Disponibilidad', v: 'Agenda abierta' },
            ].map((r) => (
              <div key={r.k}>
                <dt className="u-label text-signal">{r.k}</dt>
                <dd className="mt-2.5 text-[15px] text-smoke">{r.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* Oversized wordmark ticker — the sign-off */}
      <div className="mt-24 border-t border-line py-10">
        <Marquee duration={26}>
          <span className="flex items-center">
            <Image
              src="/brand/kuadra-wordmark-volt.svg"
              alt=""
              width={1335}
              height={440}
              className="mx-10 h-[clamp(48px,9vw,120px)] w-auto"
            />
            <span className="u-display whitespace-nowrap text-[clamp(48px,9vw,120px)] text-smoke/12">
              De tu cuadra, cuadro a cuadro
            </span>
            <span className="mx-10 block h-3 w-3 shrink-0 rounded-full bg-volt" />
          </span>
        </Marquee>
      </div>
    </section>
  )
}
