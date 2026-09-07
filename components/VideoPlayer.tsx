'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { Clip } from '@/lib/video'

type Props = {
  clip: Clip
  code: string
  client: string
  label: string
  /** Called when playback starts so siblings can pause. */
  onPlay?: (el: HTMLVideoElement) => void
  className?: string
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

/**
 * Poster-first player. Nothing is fetched until the viewer taps play — the
 * audience is on mobile data — and once playing the native controls take over.
 */
export default function VideoPlayer({ clip, code, client, label, onPlay, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle')
  const reduce = useReducedMotion()

  const start = async () => {
    const v = ref.current
    if (!v) return
    setState('loading')
    try {
      await v.play()
    } catch {
      setState('idle')
    }
  }

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const onPlaying = () => {
      setState('playing')
      onPlay?.(v)
    }
    const onPause = () => setState('paused')
    const onEnded = () => setState('paused')
    v.addEventListener('playing', onPlaying)
    v.addEventListener('pause', onPause)
    v.addEventListener('ended', onEnded)
    return () => {
      v.removeEventListener('playing', onPlaying)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('ended', onEnded)
    }
  }, [onPlay])

  const showPoster = state === 'idle' || state === 'loading'

  return (
    <figure className={`group relative overflow-hidden bg-carbon ${className ?? ''}`}>
      <div className="relative w-full" style={{ aspectRatio: `${clip.w} / ${clip.h}` }}>
        <video
          ref={ref}
          src={clip.src}
          poster={clip.poster}
          preload="none"
          playsInline
          controls={!showPoster}
          className="absolute inset-0 h-full w-full bg-ink"
          aria-label={`${client} — ${label}`}
        />

        {showPoster && (
          <button
            type="button"
            onClick={start}
            aria-label={`Reproducir ${label} de ${client}`}
            className="absolute inset-0 flex cursor-pointer items-end justify-start text-left"
          >
            <Image
              src={clip.poster}
              alt=""
              fill
              sizes={clip.orient === 'port' ? '(max-width: 640px) 92vw, 420px' : '(max-width: 1024px) 92vw, 1200px'}
              placeholder="blur"
              blurDataURL={clip.blur}
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/30 transition-colors duration-500 group-hover:from-ink/90" />

            {/* Corner marks — same camera-frame language as the cards */}
            <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-smoke/30 transition-colors duration-500 group-hover:border-volt" />
            <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-smoke/30 transition-colors duration-500 group-hover:border-volt" />

            {/* Play control */}
            <motion.span
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-volt text-ink shadow-[0_0_0_0_rgba(198,255,0,0.35)] sm:h-20 sm:w-20"
              animate={
                reduce || state === 'loading'
                  ? {}
                  : { boxShadow: ['0 0 0 0 rgba(198,255,0,0.35)', '0 0 0 18px rgba(198,255,0,0)'] }
              }
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            >
              {state === 'loading' ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
              ) : (
                <svg width="22" height="24" viewBox="0 0 22 24" fill="currentColor" aria-hidden="true" className="ml-1">
                  <path d="M0 0L22 12L0 24V0Z" />
                </svg>
              )}
            </motion.span>

            <span className="relative z-10 flex w-full items-end justify-between gap-3 p-4 sm:p-5">
              <span className="min-w-0">
                <span className="u-label u-tabular block text-smoke/70">
                  {code} / {clip.id}
                </span>
                <span className="mt-1 block truncate text-[14px] font-bold text-smoke sm:text-[15px]">{label}</span>
              </span>
              <span className="u-label u-tabular shrink-0 bg-ink/80 px-2 py-1 text-smoke backdrop-blur-sm">
                {fmt(clip.duration)}
              </span>
            </span>
          </button>
        )}
      </div>
    </figure>
  )
}
