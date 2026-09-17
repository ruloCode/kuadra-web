'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { waLink } from '@/lib/projects'
import Magnetic from './ui/Magnetic'
import Wordmark from './ui/Wordmark'

const LINKS = [
  { href: '#trabajo', label: 'Trabajo' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#proceso', label: 'Proceso' },
  { href: '#estudio', label: 'Estudio' },
]

const BOG_TIME = new Intl.DateTimeFormat('es-CO', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'America/Bogota',
})

/**
 * The clock lives outside React: the server has no wall time to render, so the
 * snapshot is cached in a module and only bumped when the second actually
 * changes — useSyncExternalStore needs a stable value between reads.
 */
let clockSnapshot = ''
const getClock = () => clockSnapshot
const getServerClock = () => ''
const subscribeClock = (onChange: () => void) => {
  const tick = () => {
    const next = BOG_TIME.format(new Date())
    if (next !== clockSnapshot) {
      clockSnapshot = next
      onChange()
    }
  }
  tick()
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)
}

/** Live Bogotá time — the "we are on the clock" cue borrowed from studio sites. */
function Clock() {
  const t = useSyncExternalStore(subscribeClock, getClock, getServerClock)
  return (
    <span className="u-label u-tabular text-signal" suppressHydrationWarning>
      {t ? `BOG ${t}` : 'BOG ——:——:——'}
    </span>
  )
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-line bg-ink/80 py-3 backdrop-blur-xl'
            : 'border-b border-transparent py-5'
        }`}
      >
        <nav className="u-gutter flex items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-3" aria-label="Kuadra Film — inicio">
            <Wordmark className="h-5 w-auto shrink-0 text-smoke" />
            <span className="u-label hidden text-signal sm:inline">Film</span>
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

          <div className="flex items-center gap-5">
            <span className="hidden lg:block">
              <Clock />
            </span>
            <Magnetic className="hidden sm:block">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="u-label inline-flex items-center gap-2 bg-volt px-5 py-3 text-ink transition-colors hover:bg-smoke"
              >
                Cotizar
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 9L9 1M9 1H2.5M9 1V7.5" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </a>
            </Magnetic>

            <button
              onClick={() => setOpen((v) => !v)}
              className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
            >
              <span
                className={`block h-px w-5 bg-smoke transition-transform duration-300 ${
                  open ? 'translate-y-[3px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-px w-5 bg-smoke transition-transform duration-300 ${
                  open ? '-translate-y-[3px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink u-gutter md:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="u-display border-b border-line py-5 text-[clamp(34px,11vw,56px)] text-smoke"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="u-label mt-8 inline-flex w-fit items-center gap-2 bg-volt px-6 py-4 text-ink"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                Cotizar por WhatsApp
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
