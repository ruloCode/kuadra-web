'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { PROJECTS } from '@/lib/projects'
import type { Shot } from '@/lib/media'

/**
 * Background wall of real frames: vertical columns drifting at different
 * speeds. Pure CSS transforms so it stays cheap, and it sits under a heavy
 * scrim so the headline always wins.
 */
export default function HeroWall() {
  const columns = useMemo(() => {
    // Interleave every project so the wall reads as one body of work, not five.
    const pool: Shot[] = []
    const decks = PROJECTS.map((p) => p.shots.filter((s) => s.orient === 'port'))
    const max = Math.max(...decks.map((d) => d.length))
    for (let i = 0; i < max; i++) {
      for (const d of decks) if (d[i]) pool.push(d[i])
    }
    const COLS = 6
    const cols: Shot[][] = Array.from({ length: COLS }, () => [])
    pool.forEach((s, i) => cols[i % COLS].push(s))
    // Each column needs enough frames to cover a full loop without gaps.
    return cols.map((c) => {
      const need = 7
      const out: Shot[] = []
      while (out.length < need) out.push(...c)
      return out.slice(0, need)
    })
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 flex justify-center gap-2 sm:gap-3">
        {columns.map((col, ci) => (
          <div
            key={ci}
            className={`relative w-[38vw] shrink-0 sm:w-[26vw] md:w-[19vw] lg:w-[15vw] ${
              ci > 3 ? 'hidden lg:block' : ci > 2 ? 'hidden md:block' : ''
            }`}
          >
            <div
              className="flex flex-col gap-2 sm:gap-3"
              style={{
                animation: `hero-drift-${ci % 2} ${52 + ci * 9}s linear infinite`,
                willChange: 'transform',
              }}
            >
              {[...col, ...col].map((s, i) => (
                <div
                  key={`${ci}-${i}`}
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: '3 / 4', background: s.hex }}
                >
                  <Image
                    src={s.thumb}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 38vw, (max-width: 1024px) 26vw, 15vw"
                    placeholder="blur"
                    blurDataURL={s.blur}
                    className="object-cover"
                    priority={ci < 3 && i < 2}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Scrim: dark enough for AA contrast on the headline, light enough to read the work */}
      <div className="absolute inset-0 bg-ink/72" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/40 to-ink" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />

      <style>{`
        @keyframes hero-drift-0 { from { transform: translate3d(0,0,0); } to { transform: translate3d(0,-50%,0); } }
        @keyframes hero-drift-1 { from { transform: translate3d(0,-50%,0); } to { transform: translate3d(0,0,0); } }
        @media (prefers-reduced-motion: reduce) {
          [style*="hero-drift"] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
