'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Claqueta from '../Claqueta'
import Magnetic from '../ui/Magnetic'
import Reveal from '../ui/Reveal'
import SplitLines from '../ui/SplitLines'
import Wordmark from '../ui/Wordmark'
import { CONTACT } from '@/lib/projects'
import { CLIENT, WA_MAIN, wa } from '@/lib/propuesta'

/**
 * Volt sign-off. The block is the one place the page flips to light-on-volt,
 * and a giant ghost wordmark slides behind the headline as you reach it.
 */
export default function Cierre() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['10%', '-10%'])

  return (
    <>
      <section ref={ref} className="relative overflow-hidden bg-volt text-ink">
        <motion.span
          aria-hidden="true"
          className="u-display pointer-events-none absolute -bottom-[0.12em] left-0 whitespace-nowrap text-[clamp(120px,24vw,380px)] leading-none text-ink/[0.07]"
          style={{ x }}
        >
          KUADRA · KUADRA · KUADRA
        </motion.span>

        <div className="relative u-gutter py-20 sm:py-28 lg:py-36">
          <Reveal>
            <span className="u-label flex items-center gap-3 text-ink/70">
              <span className="u-rec block h-2 w-2 rounded-full bg-ink" />
              Siguiente paso
            </span>
          </Reveal>

          <h2 className="u-display mt-8 max-w-[13ch] text-[clamp(44px,9vw,140px)] text-ink">
            <SplitLines lines={['Un día tuyo.', 'Un mes', 'de contenido.']} />
          </h2>

          <Reveal delay={0.2}>
            <p className="mt-9 max-w-[46ch] text-[clamp(16px,1.3vw,19px)] leading-relaxed text-ink/80">
              Cuéntanos qué vende {CLIENT.name}, en qué barrio está el local y qué día podrías
              recibirnos. Te decimos exactamente cómo funcionaría en tu caso.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Magnetic>
                <a
                  href={WA_MAIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-ink px-8 py-5 text-[16px] font-bold text-volt transition-colors hover:bg-smoke hover:text-ink"
                >
                  Escríbenos por WhatsApp
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </Magnetic>
              <a
                href={wa(
                  `Hola Kuadra, somos ${CLIENT.name}. Queremos agendar la jornada de grabación.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-ink/40 px-8 py-5 text-[16px] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-volt"
              >
                Quiero agendar el rodaje
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-ink/25 pt-10 md:grid-cols-4">
              {[
                { k: 'Preparada para', v: CLIENT.name },
                { k: 'Vigencia', v: CLIENT.validity },
                { k: 'Canal', v: 'WhatsApp · mismo día hábil' },
                { k: 'Ref', v: CLIENT.ref },
              ].map((r) => (
                <div key={r.k}>
                  <dt className="u-label text-ink/60">{r.k}</dt>
                  <dd className="mt-2.5 text-[15px] font-medium text-ink">{r.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-line">
        <Claqueta height={10} />
        <div className="u-gutter flex flex-wrap items-center justify-between gap-6 py-8">
          <Link href="/" className="flex items-center gap-4" aria-label="Kuadra Film — inicio">
            <Wordmark className="h-5 w-auto text-smoke" />
            <span className="u-label hidden text-signal sm:inline">De tu cuadra, cuadro a cuadro</span>
          </Link>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <Link href="/" className="u-label text-signal transition-colors hover:text-volt">
              kuadrafilm.com
            </Link>
            <span className="u-label text-signal">
              © {new Date().getFullYear()} Kuadra Film · {CONTACT.city}
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
