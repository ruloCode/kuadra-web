'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

/**
 * Title-card intro: a counter runs to 100 behind a claqueta wipe, then the
 * panel splits and lifts. Runs once per tab (sessionStorage), so navigating
 * back doesn't re-play it.
 */
export default function Preloader() {
  const reduce = useReducedMotion()
  const [done, setDone] = useState(true)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (sessionStorage.getItem('kuadra-intro')) return
    sessionStorage.setItem('kuadra-intro', '1')
    setDone(false)
    document.body.style.overflow = 'hidden'
  }, [])

  useEffect(() => {
    if (done) return
    if (reduce) {
      setPct(100)
      const t = setTimeout(() => setDone(true), 250)
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
      else setTimeout(() => setDone(true), 320)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [done, reduce])

  useEffect(() => {
    if (done) document.body.style.overflow = ''
  }, [done])

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
              {String(pct).padStart(3, '0')}
            </span>
            <span className="u-label mb-3 hidden text-signal sm:block">Cargando portafolio</span>
          </div>

          {/* claqueta wipe — fills left to right as the counter climbs */}
          <div className="relative h-3 w-full overflow-hidden bg-line">
            <motion.div
              className="absolute inset-y-0 left-0 flex"
              style={{ width: `${pct}%` }}
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
