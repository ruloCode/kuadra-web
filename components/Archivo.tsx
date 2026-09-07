'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { PROJECTS, CATEGORIES, type Category } from '@/lib/projects'
import Lightbox, { type Frame } from './Lightbox'
import { useColumns } from './ui/useColumns'
import Reveal from './ui/Reveal'
import SplitLines from './ui/SplitLines'

type Filter = Category | 'todo'

/**
 * The collapsed teaser shows ROWS x (live column count) items, so every column
 * holds exactly two frames and the section reads as two rows at any width.
 */
const DENSITY = [
  { key: 2, label: 'L', cls: 'columns-1 sm:columns-2' },
  { key: 3, label: 'M', cls: 'columns-2 sm:columns-3' },
  { key: 4, label: 'S', cls: 'columns-2 sm:columns-3 lg:columns-4' },
] as const

const ROWS = 2

/**
 * The full archive: every frame from every set, filterable. Interleaved so the
 * default view reads as one body of work rather than five stacked galleries.
 */
export default function Archivo() {
  const [filter, setFilter] = useState<Filter>('todo')
  const [density, setDensity] = useState<2 | 3 | 4>(3)
  const [lb, setLb] = useState<number | null>(null)
  const cols = useColumns(density)
  // Showing all 111 frames inline made this section a 20k-pixel wall before the
  // next one. The tag filters already cover browsing, so the default is a
  // two-row teaser and everything else is one click away.
  const [showAll, setShowAll] = useState(false)
  const reduce = useReducedMotion()

  const allFrames = useMemo<(Frame & { category: Category })[]>(() => {
    const decks = PROJECTS.map((p) =>
      p.shots.map((s) => ({
        ...s,
        code: p.code,
        client: p.client,
        categoryLabel: p.categoryLabel,
        category: p.category,
      })),
    )
    // Round-robin across projects so adjacent tiles rarely come from the same set.
    const out: (Frame & { category: Category })[] = []
    const max = Math.max(...decks.map((d) => d.length))
    for (let i = 0; i < max; i++) for (const d of decks) if (d[i]) out.push(d[i])
    return out
  }, [])

  const frames = useMemo(
    () => (filter === 'todo' ? allFrames : allFrames.filter((f) => f.category === filter)),
    [allFrames, filter],
  )

  const counts = useMemo(() => {
    const c: Record<string, number> = { todo: allFrames.length }
    for (const f of allFrames) c[f.category] = (c[f.category] ?? 0) + 1
    return c
  }, [allFrames])

  const densityCfg = DENSITY.find((d) => d.key === density)!
  const teaser = cols * ROWS
  const visible = useMemo(
    () => (showAll ? frames : frames.slice(0, teaser)),
    [frames, showAll, teaser],
  )
  const hidden = frames.length - visible.length
  const gridCls = densityCfg.cls

  return (
    <section id="archivo" className="scroll-mt-20 relative u-gutter py-16 sm:py-24 lg:py-32">
      <div className="mb-10 border-b border-line pb-8">
        <Reveal>
          <span className="u-label flex items-center gap-3 text-volt">
            <span className="h-px w-8 bg-volt" />
            Archivo
          </span>
        </Reveal>
        <div className="mt-6 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <h2 className="u-display max-w-[16ch] text-[clamp(38px,6.5vw,92px)] text-smoke">
            <SplitLines lines={['Todo lo que', 'entregamos.']} accent={[1]} />
          </h2>
          <Reveal delay={0.12}>
            <p className="max-w-[36ch] text-[15px] leading-relaxed text-smoke/70">
              Sin selección de portafolio ni maquillaje: el material completo de los
              cinco casos, tal como salió de post.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Control rail — tag filter + view density */}
      <div className="sticky top-[64px] z-30 -mx-[clamp(20px,5vw,80px)] mb-8 border-y border-line bg-ink/85 px-[clamp(20px,5vw,80px)] py-3.5 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="-mx-1 flex items-center gap-x-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:gap-y-2 sm:overflow-visible sm:px-0">
            {CATEGORIES.map((c) => {
              const active = filter === c.key
              return (
                <button
                  key={c.key}
                  onClick={() => {
                    setFilter(c.key)
                    setShowAll(false)
                    setLb(null)
                  }}
                  className={`u-label group relative flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-2 transition-colors sm:min-h-0 ${
                    active ? 'text-ink' : 'text-signal hover:text-smoke'
                  }`}
                  aria-pressed={active}
                >
                  {active && (
                    <motion.span
                      layoutId="archivo-pill"
                      className="absolute inset-0 bg-volt"
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span className="relative">{c.label}</span>
                  <span
                    className={`relative u-tabular text-[9px] ${
                      active ? 'text-ink/60' : 'text-signal/70'
                    }`}
                  >
                    {counts[c.key] ?? 0}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <span className="u-label text-signal">Vista</span>
            <div className="flex border border-line">
              {DENSITY.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDensity(d.key)}
                  aria-label={`Densidad ${d.label}`}
                  aria-pressed={density === d.key}
                  className={`u-label h-11 w-11 transition-colors sm:h-9 sm:w-9 ${
                    density === d.key ? 'bg-volt text-ink' : 'text-signal hover:text-smoke'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`relative ${
          hidden > 0
            ? '[mask-image:linear-gradient(to_bottom,#000_78%,transparent_100%)]'
            : ''
        }`}
      >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${filter}-${density}-${showAll}`}
          className={`${gridCls} gap-2 sm:gap-3 [&>*]:mb-2 sm:[&>*]:mb-3`}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {visible.map((f, i) => (
            <motion.button
              key={`${f.code}-${f.id}`}
              type="button"
              onClick={() => setLb(i)}
              className="group relative block w-full break-inside-avoid overflow-hidden bg-carbon"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.6, delay: (i % 6) * 0.03, ease: [0.16, 1, 0.3, 1] }}
              aria-label={`Ampliar ${f.client} pieza ${f.id}`}
            >
              <Image
                src={f.thumb}
                alt={`${f.client} — pieza ${f.id}`}
                width={f.w}
                height={f.h}
                sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 24vw"
                placeholder="blur"
                blurDataURL={f.blur}
                loading="lazy"
                className="w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/35" />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-2.5 opacity-0 transition-opacity duration-400 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                <span className="u-label u-tabular bg-ink/85 px-2 py-1 text-smoke backdrop-blur-sm">
                  {f.client}
                </span>
                <span className="u-label bg-volt px-1.5 py-1 text-ink">＋</span>
              </span>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
      </div>

      {(hidden > 0 || showAll) && (
        <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="group inline-flex min-h-[52px] items-center gap-3 border border-line px-7 py-4 text-[15px] text-smoke transition-colors hover:border-volt hover:text-volt sm:px-8"
          >
            {showAll ? 'Mostrar menos' : 'Mostrar todo'}
            <span className="u-label u-tabular text-signal transition-colors group-hover:text-volt">
              {showAll ? '−' : `+${hidden}`}
            </span>
          </button>
          <span className="u-label u-tabular text-signal">
            {visible.length} de {frames.length} piezas
          </span>
        </div>
      )}

      <Lightbox frames={visible} index={lb} onClose={() => setLb(null)} onIndex={setLb} />
    </section>
  )
}
