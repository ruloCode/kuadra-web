'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import Wordmark from '../ui/Wordmark'
import { useParrilla } from './ParrillaContext'

const LINKS = [
  { href: '#resumen', label: 'Resumen' },
  { href: '#piezas', label: 'Piezas' },
  { href: '#guia', label: 'Guía' },
  { href: '#aprobar', label: 'Cierre' },
]

/** Cabecera: marca, para quién es, el avance de aprobación y la lectura. */
export default function ParrillaNav() {
  const { copy, aprobadas } = useParrilla()
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-ink/85 py-3 backdrop-blur-xl' : 'py-5'
      }`}
    >
      <nav className="u-gutter flex items-center justify-between gap-4">
        <a
          href="#top"
          className="flex min-w-0 items-center gap-3"
          aria-label="Kuadra — volver arriba"
        >
          <Wordmark className="h-5 w-auto shrink-0 text-smoke" />
          <span className="u-label hidden items-center gap-3 text-signal sm:flex">
            <span className="h-px w-5 bg-line" />
            Parrilla · {copy.client.name}
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative u-label text-smoke transition-colors hover:text-volt"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-volt transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {!copy.comentarios ? (
          <a
            href={copy.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="u-label inline-flex min-h-[40px] items-center gap-2 bg-volt px-4 text-ink transition-colors hover:bg-smoke"
          >
            Escríbenos ↗
          </a>
        ) : (
          <a
            href="#aprobar"
            className="u-label inline-flex min-h-[40px] items-center gap-2 border border-line px-3 text-smoke transition-colors hover:border-volt"
            aria-label={`${aprobadas} de ${copy.piezas.length} piezas aprobadas`}
          >
            <span className="text-volt">✓</span>
            <span className="u-tabular relative inline-flex overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={aprobadas}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-100%' }}
                  transition={{ duration: 0.3 }}
                >
                  {aprobadas}
                </motion.span>
              </AnimatePresence>
              /{copy.piezas.length}
            </span>
            <span className="hidden sm:inline">aprobadas</span>
          </a>
        )}
      </nav>

      <div className="absolute inset-x-0 bottom-0 h-px bg-line">
        <motion.div className="h-full w-full origin-left bg-volt" style={{ scaleX: progress }} />
      </div>
    </header>
  )
}

/** Barra del celular, una vez pasada la portada: ir a las piezas o a aprobar. */
export function ParrillaMobileBar() {
  const { aprobadas, copy, abierta } = useParrilla()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.9
      const nearEnd = window.scrollY + window.innerHeight > document.body.scrollHeight - 900
      setShow(past && !nearEnd)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && !abierta && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/92 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3">
            <a
              href="#piezas"
              className="u-label flex min-h-[52px] flex-1 items-center justify-center border border-line text-smoke"
            >
              Piezas
            </a>
            {copy.comentarios ? (
              <a
                href="#aprobar"
                className="flex min-h-[52px] flex-[1.4] items-center justify-center gap-2 bg-volt text-[15px] font-bold text-ink"
              >
                ✓ {aprobadas}/{copy.piezas.length} · Aprobar
              </a>
            ) : (
              <a
                href={copy.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[52px] flex-[1.4] items-center justify-center gap-2 bg-volt text-[15px] font-bold text-ink"
              >
                Escríbenos <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
