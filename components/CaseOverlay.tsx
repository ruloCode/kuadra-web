'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useLenis } from 'lenis/react'
import { PROJECTS, siblings, type Project } from '@/lib/projects'
import Claqueta from './Claqueta'
import Lightbox, { type Frame } from './Lightbox'
import VideoPlayer from './VideoPlayer'

type Props = {
  project: Project | null
  onClose: () => void
  /** Jump to another case without leaving the overlay. */
  onNavigate: (slug: string) => void
}

const EASE = [0.16, 1, 0.3, 1] as const

const clipLabel = (orient: 'land' | 'port', i: number, total: number) =>
  orient === 'port' ? 'Reel vertical' : total > 1 ? `Video ${String(i + 1).padStart(2, '0')}` : 'Video'

/** Full-screen case study: brief, credits, the clips and the complete set of frames. */
export default function CaseOverlay({ project, onClose, onNavigate }: Props) {
  const reduce = useReducedMotion()
  const lenis = useLenis()
  const open = project !== null

  // The page behind uses Lenis on the window: it swallows wheel/touch events
  // and scrolls the document, so the overlay never received them. Pause it
  // while the case is open; the panel itself is marked data-lenis-prevent.
  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
      lenis?.start()
    }
  }, [open, lenis])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[80] bg-ink"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Caso ${project.client}`}
        >
          {/* Keyed by slug: switching cases remounts the panel, which resets
              scroll, lightbox and any playing clip without effect juggling. */}
          <CasePanel key={project.slug} project={project} onClose={onClose} onNavigate={onNavigate} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CasePanel({ project, onClose, onNavigate }: { project: Project } & Omit<Props, 'project'>) {
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const [lb, setLb] = useState<number | null>(null)
  const playingRef = useRef<HTMLVideoElement | null>(null)

  // Scroll progress of the panel, drawn as a hairline under the sticky bar.
  const { scrollYProgress } = useScroll({ container: panelRef })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })

  const nav = siblings(project.slug)

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lb !== null) return // the lightbox owns the keyboard while open
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate(nav.next.slug)
      if (e.key === 'ArrowLeft') onNavigate(nav.prev.slug)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lb, onClose, onNavigate, nav.next.slug, nav.prev.slug])

  const handlePlay = useCallback((el: HTMLVideoElement) => {
    if (playingRef.current && playingRef.current !== el) playingRef.current.pause()
    playingRef.current = el
  }, [])

  const frames: Frame[] = project.shots.map((s) => ({
    ...s,
    code: project.code,
    client: project.client,
    categoryLabel: project.categoryLabel,
  }))

  const cover = project.shots[project.coverIndex] ?? project.shots[0]
  const total = String(PROJECTS.length).padStart(2, '0')
  const hasClips = project.clips.length > 0

  return (
    <>
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        data-lenis-prevent
        className="h-full overflow-y-auto overscroll-contain outline-none"
        initial={reduce ? false : { y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {/* Sticky bar */}
        <div className="sticky top-0 z-20 border-b border-line bg-ink/90 backdrop-blur-xl">
          <div className="u-gutter flex items-center justify-between gap-4 py-3 sm:py-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="u-rec block h-2 w-2 shrink-0 rounded-full bg-volt" />
              <span className="u-label u-tabular shrink-0 text-signal">{project.code}</span>
              <span className="truncate text-[15px] font-bold text-smoke">{project.client}</span>
              <span className="u-label u-tabular hidden shrink-0 text-signal md:block">
                {String(nav.index + 1).padStart(2, '0')} / {total}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => onNavigate(nav.prev.slug)}
                aria-label={`Caso anterior: ${nav.prev.client}`}
                className="hidden h-11 w-11 items-center justify-center border border-line text-smoke transition-colors hover:border-volt hover:text-volt sm:flex"
              >
                ←
              </button>
              <button
                onClick={() => onNavigate(nav.next.slug)}
                aria-label={`Caso siguiente: ${nav.next.client}`}
                className="hidden h-11 w-11 items-center justify-center border border-line text-smoke transition-colors hover:border-volt hover:text-volt sm:flex"
              >
                →
              </button>
              <button
                onClick={onClose}
                className="u-label group flex min-h-[44px] items-center gap-2.5 border border-line px-4 py-2.5 text-smoke transition-colors hover:border-volt hover:text-volt sm:ml-2"
              >
                Cerrar
                <span className="hidden text-signal transition-colors group-hover:text-volt sm:inline">ESC</span>
                <span className="sm:hidden" aria-hidden="true">
                  ✕
                </span>
              </button>
            </div>
          </div>
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-volt"
            style={{ scaleX: progress }}
          />
        </div>

        {/* Header */}
        <header className="u-gutter pb-10 pt-10 sm:pb-14 sm:pt-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            <span className="u-label flex items-center gap-3 text-volt">
              <span className="h-px w-8 bg-volt" />
              {project.categoryLabel}
              <span className="text-signal">· {project.year}</span>
            </span>
            <h2 className="u-display mt-5 max-w-[18ch] text-[clamp(36px,7vw,96px)] text-smoke">
              {project.title}
            </h2>
          </motion.div>
        </header>

        {/* Cover — full-bleed frame so the case opens on the work, not on text */}
        <motion.div
          className="relative w-full overflow-hidden bg-carbon"
          initial={reduce ? false : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        >
          <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
            <Image
              src={cover.src}
              alt={`${project.client} — ${project.title}`}
              fill
              sizes="100vw"
              priority
              placeholder="blur"
              blurDataURL={cover.blur}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />
            <span className="pointer-events-none absolute left-4 top-4 h-5 w-5 border-l border-t border-smoke/40" />
            <span className="pointer-events-none absolute right-4 top-4 h-5 w-5 border-r border-t border-smoke/40" />
            <span className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-b border-l border-smoke/40" />
            <span className="pointer-events-none absolute bottom-4 right-4 h-5 w-5 border-b border-r border-smoke/40" />
            <span className="u-label u-tabular absolute bottom-5 right-6 text-smoke/80 sm:right-8">
              {project.code} / {cover.id}
            </span>
          </div>
        </motion.div>

        {/* Brief + credits */}
        <div className="u-gutter grid gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <span className="u-label text-signal">El encargo</span>
            <p className="mt-4 max-w-[58ch] text-[clamp(17px,1.4vw,22px)] leading-[1.5] text-smoke/90">
              {project.brief}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {project.services.map((s) => (
                <span key={s} className="u-label border border-line px-3.5 py-2 text-smoke/80">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-7 border-t border-line pt-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {[
              { k: 'Cliente', v: project.client },
              { k: 'Año', v: project.year },
              { k: 'Locación', v: project.location },
              {
                k: 'Entrega',
                v: hasClips
                  ? `${project.shots.length} fotos · ${project.clips.length} ${project.clips.length === 1 ? 'video' : 'videos'}`
                  : project.deliverables,
              },
            ].map((r) => (
              <div key={r.k}>
                <dt className="u-label text-signal">{r.k}</dt>
                <dd className="mt-2 text-[15px] text-smoke">{r.v}</dd>
              </div>
            ))}
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="u-label group col-span-2 mt-2 inline-flex items-center gap-2 text-signal transition-colors hover:text-volt"
            >
              Ver en Behance
              <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
            </a>
          </dl>
        </div>

        <Claqueta height={10} />

        {/* Clips */}
        {hasClips && (
          <section className="u-gutter py-12 sm:py-16" aria-label="Video">
            <div className="mb-8 flex items-baseline justify-between gap-4">
              <h3 className="u-label flex items-center gap-3 text-smoke">
                <span className="u-rec block h-2 w-2 rounded-full bg-volt" />
                En movimiento
              </h3>
              <span className="u-label u-tabular text-signal">
                {String(project.clips.length).padStart(2, '0')} {project.clips.length === 1 ? 'clip' : 'clips'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">
              {project.clips.map((c, i) => {
                const port = c.orient === 'port'
                return (
                  <motion.div
                    key={c.id}
                    className={port ? 'mx-auto w-full max-w-[420px] lg:col-span-4' : 'lg:col-span-12'}
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ root: panelRef, once: true, amount: 0.15 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    <VideoPlayer
                      clip={c}
                      code={project.code}
                      client={project.client}
                      label={clipLabel(c.orient, i, project.clips.length)}
                      onPlay={handlePlay}
                    />
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        {/* Full set — masonry so portrait and landscape frames both breathe */}
        <section className={`u-gutter pb-12 sm:pb-16 ${hasClips ? 'pt-2 sm:pt-4' : 'pt-12 sm:pt-16'}`} aria-label="Set completo">
          <div
            className={`mb-8 flex items-baseline justify-between gap-4 ${hasClips ? 'border-t border-line pt-8' : ''}`}
          >
            <h3 className="u-label text-smoke">El set completo</h3>
            <span className="u-label u-tabular text-signal">
              {String(project.shots.length).padStart(2, '0')} fotos · toca para ampliar
            </span>
          </div>

          <div className="columns-2 gap-2 sm:gap-3 lg:columns-3 [&>*]:mb-2 sm:[&>*]:mb-3">
            {project.shots.map((s, i) => (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => setLb(i)}
                aria-label={`Ampliar ${project.client} pieza ${s.id}`}
                className="group relative block w-full break-inside-avoid overflow-hidden bg-carbon"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ root: panelRef, once: true, amount: 0.1 }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.05, ease: EASE }}
              >
                <Image
                  src={s.thumb}
                  alt={`${project.client} — pieza ${s.id}`}
                  width={s.w}
                  height={s.h}
                  sizes="(max-width: 1024px) 46vw, 31vw"
                  placeholder="blur"
                  blurDataURL={s.blur}
                  loading="lazy"
                  className="w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30" />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-2.5 opacity-0 transition-opacity duration-400 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                  <span className="u-label u-tabular bg-ink/80 px-2 py-1 text-smoke backdrop-blur-sm">
                    {project.code} / {s.id}
                  </span>
                  <span className="u-label bg-volt px-1.5 py-1 text-ink">＋</span>
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Prev / next case */}
        <footer className="border-t border-line">
          <div className="grid sm:grid-cols-2">
            {[
              { p: nav.prev, k: 'Anterior', next: false },
              { p: nav.next, k: 'Siguiente', next: true },
            ].map(({ p, k, next }) => {
              const c = p.shots[p.coverIndex] ?? p.shots[0]
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => onNavigate(p.slug)}
                  className={`group relative flex min-h-[220px] flex-col justify-end overflow-hidden text-left sm:min-h-[300px] ${
                    next ? 'border-t border-line sm:items-end sm:border-l sm:border-t-0 sm:text-right' : 'sm:items-start'
                  }`}
                  aria-label={`${k}: ${p.client} — ${p.title}`}
                >
                  {c && (
                    <Image
                      src={c.thumb}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover opacity-30 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:opacity-55"
                    />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
                  <span className="relative u-gutter flex flex-col gap-3 py-8">
                    <span className="u-label flex items-center gap-2 text-signal transition-colors group-hover:text-volt">
                      {!next && <span aria-hidden="true">←</span>}
                      {k} · {p.code}
                      {next && <span aria-hidden="true">→</span>}
                    </span>
                    <span className="u-display text-[clamp(28px,4vw,56px)] text-smoke">{p.client}</span>
                    <span className="text-[14px] text-smoke/70">{p.title}</span>
                  </span>
                </button>
              )
            })}
          </div>
          <div className="u-gutter u-rule flex flex-wrap items-center justify-between gap-4 py-6">
            <span className="u-label hidden text-signal md:block">← → para cambiar de caso · ESC para cerrar</span>
            <button
              onClick={onClose}
              className="u-label flex min-h-[44px] items-center gap-2 text-smoke transition-colors hover:text-volt"
            >
              Volver al portafolio
            </button>
          </div>
        </footer>
      </motion.div>

      <Lightbox frames={frames} index={lb} onClose={() => setLb(null)} onIndex={setLb} />
    </>
  )
}
