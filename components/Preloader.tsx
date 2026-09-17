'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

/**
 * Whether the intro should play is a client-only fact: the server can't read
 * sessionStorage. It's read once per mount and cached in a ref so that writing
 * the flag below doesn't flip the answer mid-animation.
 */
const noStoreUpdates = () => () => {}

/**
 * Title-card intro: a counter runs to 100 behind a claqueta wipe, then the
 * panel splits and lifts. Runs once per tab (sessionStorage), so navigating
 * back doesn't re-play it.
 */
export default function Preloader() {
  const reduce = useReducedMotion()
  const playRef = useRef<boolean | null>(null)
  const getShouldPlay = useCallback(() => {
    if (playRef.current === null) playRef.current = !sessionStorage.getItem('kuadra-intro')
    return playRef.current
  }, [])
  const shouldPlay = useSyncExternalStore(noStoreUpdates, getShouldPlay, () => false)

  const [finished, setFinished] = useState(false)
  const [pct, setPct] = useState(0)
  const done = finished || !shouldPlay
  /** Reduced motion skips the count-up, so the counter shows its end state. */
  const shown = reduce ? 100 : pct

  useEffect(() => {
    if (shouldPlay) sessionStorage.setItem('kuadra-intro', '1')
  }, [shouldPlay])

  // El scroll se suelta en cuanto la intro termina, no cuando se desmonta:
  // el componente sigue montado después del exit de AnimatePresence.
  useEffect(() => {
    document.body.style.overflow = done ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [done])

  useEffect(() => {
    if (done) return
    if (reduce) {
      const t = setTimeout(() => setFinished(true), 250)
      return () => clearTimeout(t)
    }
    let raf = 0
    let start: number | null = null
    const DUR = 1500
    const tick = (t: number) => {
      if (start === null) start = t
      const p = Math.min((t - start) / DUR, 1)
      setPct(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => setFinished(true), 320)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [done, reduce])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink u-gutter py-8"
          exit={{ y: '-100%' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <div className="flex items-center gap-3">
            <span className="u-rec block h-2 w-2 rounded-full bg-volt" />
            <span className="u-label text-signal">Kuadra Film · Bogotá</span>
          </div>

          <div className="flex items-end justify-between gap-6">
            <span className="u-display u-tabular text-[clamp(72px,22vw,260px)] leading-[0.8] text-smoke">
              {String(shown).padStart(3, '0')}
            </span>
            <span className="u-label mb-3 hidden text-signal sm:block">Cargando portafolio</span>
          </div>

          {/* claqueta wipe — fills left to right as the counter climbs */}
          <div className="relative h-3 w-full overflow-hidden bg-line">
            <motion.div
              className="absolute inset-y-0 left-0 flex"
              style={{ width: `${shown}%` }}
              transition={{ duration: 0 }}
            >
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, #C6FF00 0 24px, #2A2A2A 24px 48px)',
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
