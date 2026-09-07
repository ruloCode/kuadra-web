'use client'

import Image from 'next/image'
import { useCallback, useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Shot } from '@/lib/media'

export type Frame = Shot & { code: string; client: string; categoryLabel: string }

type Props = {
  frames: Frame[]
  index: number | null
  onClose: () => void
  onIndex: (i: number) => void
}

export default function Lightbox({ frames, index, onClose, onIndex }: Props) {
  const reduce = useReducedMotion()
  const open = index !== null && frames[index] !== undefined

  const next = useCallback(() => {
    if (index === null) return
    onIndex((index + 1) % frames.length)
  }, [index, frames.length, onIndex])

  const prev = useCallback(() => {
    if (index === null) return
    onIndex((index - 1 + frames.length) % frames.length)
  }, [index, frames.length, onIndex])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    // Restore whatever was there — inside the case overlay the body is already locked.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose, next, prev])

  const f = open ? frames[index!] : null

  return (
    <AnimatePresence>
      {f && (
        <motion.div
          className="fixed inset-0 z-[85] flex flex-col bg-ink/97 backdrop-blur-md"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${f.client} — pieza ${f.id}`}
        >
          <div className="flex items-center justify-between gap-4 u-gutter py-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="u-rec block h-2 w-2 shrink-0 rounded-full bg-volt" />
              <span className="u-label u-tabular text-signal">
                {f.code} / {f.id}
              </span>
              <span className="truncate text-[14px] text-smoke">{f.client}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="u-label u-tabular mr-2 hidden text-signal sm:block">
                {String(index! + 1).padStart(2, '0')} — {String(frames.length).padStart(2, '0')}
              </span>
              <button
                onClick={prev}
                aria-label="Anterior"
                className="flex h-11 w-11 items-center justify-center border border-line text-smoke transition-colors hover:border-volt hover:text-volt"
              >
                ←
              </button>
              <button
                onClick={next}
                aria-label="Siguiente"
                className="flex h-11 w-11 items-center justify-center border border-line text-smoke transition-colors hover:border-volt hover:text-volt"
              >
                →
              </button>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="ml-2 flex h-11 w-11 items-center justify-center border border-line text-smoke transition-colors hover:border-volt hover:text-volt"
              >
                ✕
              </button>
            </div>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center px-4 pb-4"
            onClick={onClose}
          >
            <motion.div
              key={`${f.src}`}
              className="relative flex h-full w-full items-center justify-center"
              initial={reduce ? false : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={f.src}
                alt={`${f.client} — pieza ${f.id}`}
                width={f.w}
                height={f.h}
                sizes="92vw"
                placeholder="blur"
                blurDataURL={f.blur}
                className="max-h-full w-auto max-w-full object-contain"
                priority
              />
            </motion.div>
          </div>

          <div className="u-gutter u-rule flex items-center justify-between gap-4 py-4">
            <span className="u-label text-signal">{f.categoryLabel}</span>
            <span className="u-label hidden text-signal md:block">← → para navegar · ESC para cerrar</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
