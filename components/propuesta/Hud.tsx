'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, type MotionValue } from 'motion/react'

/** Running timecode at 24 fps, written straight to the DOM (no re-renders). */
function Timecode() {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    let raf = 0
    const t0 = performance.now()
    const pad = (n: number) => String(n).padStart(2, '0')
    const tick = (t: number) => {
      const s = (t - t0) / 1000
      const f = Math.floor((s % 1) * 24)
      const h = Math.floor(s / 3600)
      const m = Math.floor((s % 3600) / 60)
      const sec = Math.floor(s % 60)
      if (ref.current) ref.current.textContent = `${pad(h)}:${pad(m)}:${pad(sec)}:${pad(f)}`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  return (
    <span ref={ref} className="u-tabular">
      00:00:00:00
    </span>
  )
}

/** Audio meter: a handful of bars breathing at different rates. */
function Meter() {
  return (
    <span className="flex h-3 items-end gap-[3px]" aria-hidden="true">
      {[0.5, 0.9, 0.7, 1, 0.6, 0.8].map((h, i) => (
        <span
          key={i}
          className="block w-[3px] origin-bottom bg-volt"
          style={{
            height: `${h * 100}%`,
            animation: `hud-meter ${0.9 + i * 0.17}s ease-in-out ${i * 0.08}s infinite alternate`,
          }}
        />
      ))}
    </span>
  )
}

const CORNERS = [
  'left-0 top-0 border-l border-t',
  'right-0 top-0 border-r border-t',
  'bottom-0 left-0 border-b border-l',
  'bottom-0 right-0 border-b border-r',
]

type Props = {
  /** Scroll progress of the hero (0 at top, 1 when it has left the viewport). */
  progress: MotionValue<number>
  ghostX: MotionValue<string>
  ghostOpacity: MotionValue<number>
}

/**
 * Camera-viewfinder overlay for the hero: framing brackets that snap in,
 * a live timecode, a REC pill, and a faint grid. Everything is decorative and
 * hidden from assistive tech; the copy lives in the hero itself.
 */
export default function Hud({ ghostX, ghostOpacity }: Props) {
  const reduce = useReducedMotion()
  const spring = { duration: 1, ease: [0.16, 1, 0.3, 1] as const }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #F2F2F2 1px, transparent 1px), linear-gradient(to bottom, #F2F2F2 1px, transparent 1px)',
          backgroundSize: 'clamp(48px, 8vw, 120px) clamp(48px, 8vw, 120px)',
          maskImage: 'radial-gradient(ellipse at 70% 40%, black 30%, transparent 75%)',
        }}
      />

      {/* volt glow */}
      <div
        className="absolute -bottom-[30%] -right-[15%] h-[70vw] w-[70vw] max-h-[760px] max-w-[760px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(198,255,0,.16), transparent 62%)',
        }}
      />

      {/* ghost word, driven by scroll */}
      <motion.div
        className="u-display absolute bottom-[18%] left-0 whitespace-nowrap text-[clamp(120px,26vw,420px)] leading-none text-transparent"
        style={{
          x: ghostX,
          opacity: ghostOpacity,
          WebkitTextStroke: '1px rgba(242,242,242,0.10)',
        }}
      >
        NATIVOS NATIVOS NATIVOS
      </motion.div>

      {/* framing brackets */}
      <div className="absolute inset-[clamp(16px,3.5vw,44px)] top-[clamp(88px,12vh,120px)]">
        {CORNERS.map((c, i) => (
          <motion.span
            key={c}
            className={`absolute h-7 w-7 border-smoke/60 sm:h-9 sm:w-9 ${c}`}
            initial={reduce ? false : { opacity: 0, scale: 1.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring, delay: 0.2 + i * 0.07 }}
          />
        ))}

        {/* readouts */}
        <motion.div
          className="u-label absolute left-12 top-1 flex items-center gap-3 text-smoke/80"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <span className="u-rec block h-2 w-2 rounded-full bg-volt" />
          REC
          <span className="hidden sm:inline">
            <Timecode />
          </span>
        </motion.div>

        <motion.div
          className="u-label absolute right-12 top-1 hidden items-center gap-3 text-smoke/60 sm:flex"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          A-CAM · 4K · 24 fps
          <Meter />
        </motion.div>

        <motion.div
          className="u-label absolute bottom-1 left-12 hidden text-smoke/50 sm:block"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          ISO 800 · 1/50 · T2.8
        </motion.div>

        <motion.div
          className="u-label absolute bottom-1 right-12 hidden text-smoke/50 sm:block"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Propuesta · 01 / 01
        </motion.div>

        {/* focus reticle — breathes slowly */}
        <motion.span
          className="absolute right-[18%] top-[38%] hidden h-14 w-14 rounded-full border border-volt/40 lg:block"
          animate={reduce ? {} : { scale: [1, 1.12, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-volt" />
        </motion.span>
      </div>

      <style>{`
        @keyframes hud-meter { from { transform: scaleY(0.25); } to { transform: scaleY(1); } }
        @media (prefers-reduced-motion: reduce) { [style*="hud-meter"] { animation: none !important; } }
      `}</style>
    </div>
  )
}
