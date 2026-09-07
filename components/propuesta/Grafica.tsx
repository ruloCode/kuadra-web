'use client'

import { useEffect, useRef, useState, type PointerEvent } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import Reveal from '../ui/Reveal'
import { CASES, type CaseKey } from '@/lib/propuesta'

const W = 1000
const PT = 30

const fmt = (n: number) => n.toLocaleString('es-CO')

/**
 * Rounds a series maximum up to a value whose quarters are round numbers, so
 * the axis reads 40K / 30K / 20K / 10K instead of 37.831 / 28.373 / 18.915.
 * The 5% cushion keeps the peak from touching the ceiling.
 */
const STEPS = [1, 1.2, 1.6, 2, 2.4, 3.2, 4, 4.8, 6, 8, 10]
function niceMax(raw: number) {
  const v = raw * 1.05
  const mag = 10 ** Math.floor(Math.log10(v))
  const step = STEPS.find((x) => v / mag <= x) ?? 10
  return step * mag
}

/** Catmull-Rom → cubic Bézier, so the curve passes through every point. */
function smooth(p: [number, number][]) {
  let d = `M${p[0][0]},${p[0][1]}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`
  }
  return d
}

/** Dot on the curve, plus the point's own value and an optional caption. */
function Marker({
  x,
  y,
  value,
  caption,
  anchor,
  at,
  drawn,
  k,
}: {
  x: number
  y: number
  value?: string
  caption?: string
  anchor: 'start' | 'middle' | 'end'
  at: number
  drawn: MotionValue<number>
  k: number
}) {
  const opacity = useTransform(drawn, [at, Math.min(1, at + 0.06)], [0, 1])
  return (
    <motion.g style={{ opacity }}>
      <circle cx={x} cy={y} r={7 * k} fill="#C6FF00" stroke="#0D0D0D" strokeWidth={3 * k} />
      {value && (
        <text
          x={x}
          y={y - (caption ? 30 : 16) * k}
          textAnchor={anchor}
          fill="#C6FF00"
          fontSize={12 * k}
          fontFamily="var(--font-display)"
          stroke="#131313"
          strokeWidth={4 * k}
          paintOrder="stroke"
        >
          {value}
        </text>
      )}
      {caption && (
        <text
          x={x}
          y={y - 14 * k}
          textAnchor={anchor}
          fill="#A8A8A8"
          fontSize={10.5 * k}
          stroke="#131313"
          strokeWidth={4 * k}
          paintOrder="stroke"
        >
          {caption}
        </text>
      )}
    </motion.g>
  )
}

/**
 * One chart, two stories. Each case brings its own series: Bambú is thirty
 * days of daily views with followers dashed behind; Clandestine is twelve
 * months of followers with the campaign milestones marked.
 *
 * Every value a reader needs is printed on the chart — the peak in a callout,
 * the floor labelled, each published piece carrying its own number — so the
 * curve can be read at a glance and the scrubber is a bonus, not a
 * requirement.
 */
export default function Grafica() {
  const [key, setKey] = useState<CaseKey>('bambu')
  const [hover, setHover] = useState<number | null>(null)
  const [tall, setTall] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const c = CASES.find((x) => x.key === key)!
  const prim = c.primary.values
  const sec = c.secondary?.values

  // Phone viewBox is taller and everything inside scales up so the axis text
  // and markers stay legible at ~350px wide.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const set = () => setTall(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])
  const H = tall ? 640 : 420
  const PL = tall ? 112 : 60
  const PR = sec ? (tall ? 112 : 60) : tall ? 46 : 24
  const PB = tall ? 74 : 44
  const fs = tall ? 30 : 11
  const k = tall ? 2.4 : 1

  // Scroll draws the line the first time; toggling re-runs a timed draw.
  const { scrollYProgress } = useScroll({ target: box, offset: ['start 0.92', 'start 0.3'] })
  const toggled = useMotionValue(1)
  const drawn = useTransform(() => (reduce ? 1 : Math.min(scrollYProgress.get(), toggled.get())))
  const areaOpacity = useTransform(drawn, [0.55, 1], [0, 1])
  const secOpacity = useTransform(drawn, [0.6, 1], [0, 0.85])
  const noteOpacity = useTransform(drawn, [0.45, 0.7], [0, 1])

  const select = (next: CaseKey) => {
    if (next === key) return
    setKey(next)
    setHover(null)
    if (reduce) return
    toggled.set(0)
    animate(toggled, 1, { duration: 1.6, ease: [0.16, 1, 0.3, 1] })
  }

  const n = prim.length
  const maxP = niceMax(Math.max(...prim))
  const maxS = sec ? niceMax(Math.max(...sec)) : 1
  const x = (i: number) => PL + (i * (W - PL - PR)) / (n - 1)
  const yP = (v: number) => H - PB - (v / maxP) * (H - PT - PB)
  const yS = (v: number) => H - PB - (v / maxS) * (H - PT - PB)

  // Positions as percentages of the viewBox, for the HTML annotation layer.
  const left = (i: number) => (x(i) / W) * 100
  const top = (v: number) => (yP(v) / H) * 100
  /** 0 at the top of the plot, 1 at the bottom. */
  const depth = (v: number) => (yP(v) - PT) / (H - PT - PB)

  const dLine = smooth(prim.map((v, i) => [x(i), yP(v)] as [number, number]))
  const dArea = `${dLine} L${x(n - 1)},${H - PB} L${x(0)},${H - PB} Z`
  const dSec = sec ? smooth(sec.map((v, i) => [x(i), yS(v)] as [number, number])) : ''

  const onPointer = (e: PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * (W - PL - PR)
    setHover(Math.max(0, Math.min(n - 1, Math.round(px / ((W - PL - PR) / (n - 1))))))
  }

  const xLabels =
    n > 12
      ? tall
        ? [1, 10, 20, 30]
        : [1, 5, 10, 15, 20, 25, 30]
      : tall
        ? [1, 4, 8, 12]
        : Array.from({ length: n }, (_, i) => i + 1)

  const eventAt = (i: number) => c.events.find((e) => e.at === i + 1)
  // One unit for the whole chart, so the axis never mixes "38K" with "9.458".
  const unitFor = (max: number) => (v: number) =>
    max >= 20000 && v >= 1000 ? `${Math.round(v / 1000)}K` : fmt(Math.round(v))
  const fmtPoint = unitFor(maxP)
  const fmtSec = unitFor(maxS)

  const hi = c.highlight.at - 1
  const lowIdx = prim.indexOf(Math.min(...prim))

  // The callout sits beside the point when the point is near the ceiling,
  // above it otherwise — so it never spills out of the plot.
  const hiSide = depth(prim[hi]) < 0.35 ? (hi <= n / 2 ? 'right' : 'left') : 'above'
  const lowAbove = depth(prim[lowIdx]) > 0.7

  return (
    <section id="grafica" className="scroll-mt-24 u-gutter pb-16 sm:pb-24 lg:pb-32">
      <Reveal>
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-8 lg:flex-row lg:items-end">
          <div>
            <span className="u-label flex items-center gap-3 text-volt">
              <span className="h-px w-8 bg-volt" />
              {c.period}
            </span>
            <h3 className="u-display mt-5 max-w-[22ch] text-[clamp(24px,3.2vw,44px)] text-smoke">
              Así se ve el crecimiento de verdad: con picos y con valles.
            </h3>
          </div>

          <div className="inline-flex w-fit border border-line" role="tablist" aria-label="Caso">
            {CASES.map((cs) => {
              const on = cs.key === key
              return (
                <button
                  key={cs.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => select(cs.key)}
                  className={`u-label px-4 py-3 transition-colors sm:px-5 ${
                    on ? 'bg-volt text-ink' : 'text-smoke/70 hover:text-volt'
                  }`}
                >
                  {cs.name}
                </button>
              )
            })}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1} amount={0.1}>
        <div ref={box} className="relative mt-8 border border-line bg-carbon p-3 sm:p-5">
          <div className="relative">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="block h-auto w-full"
              role="img"
              aria-label={`${c.primary.label} de ${c.name}, ${c.period}`}
            >
              <defs>
                <linearGradient id="prop-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#C6FF00" stopOpacity=".32" />
                  <stop offset="1" stopColor="#C6FF00" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* grid + axes */}
              {[0, 1, 2, 3, 4].map((g) => {
                const y = PT + (g * (H - PT - PB)) / 4
                return (
                  <g key={g}>
                    <line x1={PL} x2={W - PR} y1={y} y2={y} stroke="#1E1E1E" />
                    <text x={PL - 10} y={y + fs / 3} textAnchor="end" fill="#6E6E6E" fontSize={fs}>
                      {fmtPoint(maxP * (1 - g / 4))}
                    </text>
                    {sec && (
                      <text
                        x={W - PR + 10}
                        y={y + fs / 3}
                        textAnchor="start"
                        fill="#6E6E6E"
                        fontSize={fs}
                      >
                        {fmtSec(maxS * (1 - g / 4))}
                      </text>
                    )}
                  </g>
                )
              })}
              {xLabels.map((d) => (
                <text
                  key={d}
                  x={x(d - 1)}
                  y={H - PB + fs * 2}
                  textAnchor="middle"
                  fill="#6E6E6E"
                  fontSize={fs}
                >
                  {c.unit} {d}
                </text>
              ))}

              {/* series — keyed so a case switch remounts cleanly */}
              <g key={key}>
                <motion.path d={dArea} fill="url(#prop-area)" style={{ opacity: areaOpacity }} />
                <motion.path
                  d={dLine}
                  fill="none"
                  stroke="#C6FF00"
                  strokeWidth={3 * k}
                  strokeLinecap="round"
                  style={{ pathLength: drawn }}
                />
                {sec && (
                  <motion.path
                    d={dSec}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={2 * k}
                    strokeDasharray={`${6 * k} ${6 * k}`}
                    style={{ opacity: secOpacity }}
                  />
                )}
                {c.events.map((ev) => {
                  const i = ev.at - 1
                  const pos = i / (n - 1)
                  // On desktop the peak is spelled out in the callout, so the
                  // marker stays bare; on phones the callout moves below the
                  // chart and the marker carries the number itself.
                  const bare = i === hi && !tall
                  return (
                    <Marker
                      key={ev.at}
                      x={x(i)}
                      y={yP(prim[i])}
                      value={bare ? undefined : fmtPoint(prim[i])}
                      caption={bare ? undefined : ev.label}
                      anchor={pos < 0.12 ? 'start' : pos > 0.88 ? 'end' : 'middle'}
                      at={pos}
                      drawn={drawn}
                      k={k}
                    />
                  )
                })}
              </g>

              {/* scrubber */}
              {hover !== null && (
                <g pointerEvents="none">
                  <line
                    x1={x(hover)}
                    x2={x(hover)}
                    y1={PT}
                    y2={H - PB}
                    stroke="#C6FF00"
                    strokeDasharray="3 4"
                  />
                  <circle cx={x(hover)} cy={yP(prim[hover])} r={5 * k} fill="#C6FF00" />
                  {sec && <circle cx={x(hover)} cy={yS(sec[hover])} r={4 * k} fill="#FFFFFF" />}
                </g>
              )}
              <rect
                x={PL}
                y={PT}
                width={W - PL - PR}
                height={H - PT - PB}
                fill="transparent"
                onPointerMove={onPointer}
                onPointerDown={onPointer}
                onPointerLeave={() => setHover(null)}
                style={{ touchAction: 'pan-y' }}
              />
            </svg>

            {/* Always-on annotations, desktop only — on phones there is no
                room to float a panel over the plot without covering the
                curve, so the same reading moves below the chart. Hidden while
                scrubbing, when the tooltip says the same thing at the cursor. */}
            {!tall && (
              <motion.div
                className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${
                  hover !== null ? 'opacity-0' : ''
                }`}
                style={{ opacity: noteOpacity }}
              >
                {/* the peak, spelled out */}
                <div
                  className={`absolute w-[250px] border border-volt/55 bg-ink px-4 py-3 ${
                    hiSide === 'above'
                      ? '-translate-x-1/2 -translate-y-full'
                      : hiSide === 'left'
                        ? '-translate-x-full -translate-y-1/2'
                        : '-translate-y-1/2'
                  }`}
                  style={{
                    left: `${left(hi)}%`,
                    top: `${top(prim[hi])}%`,
                    marginTop: hiSide === 'above' ? -16 : 0,
                    marginLeft: hiSide === 'right' ? 20 : hiSide === 'left' ? -20 : 0,
                  }}
                >
                  <span className="u-label text-signal">
                    {c.unit} {c.highlight.at}
                  </span>
                  <div className="u-display u-tabular mt-1.5 text-[clamp(19px,2.1vw,27px)] leading-none text-volt">
                    {fmt(prim[hi])}{' '}
                    <span className="text-[0.52em] tracking-normal">{c.primary.short}</span>
                  </div>
                  {sec && c.secondary && (
                    <div className="u-tabular mt-2 text-[12px] leading-snug text-smoke/85">
                      {fmt(sec[hi])} {c.secondary.short}
                    </div>
                  )}
                  <p className="mt-2.5 border-t border-line pt-2.5 text-[11.5px] leading-snug text-signal">
                    {c.highlight.note}
                  </p>
                </div>

                {/* the floor — chipped so it stays legible over the fill */}
                <div
                  className={`absolute whitespace-nowrap bg-ink/85 px-1.5 py-0.5 text-[12px] leading-tight text-signal ${
                    lowAbove ? '-translate-y-full' : ''
                  } ${
                    left(lowIdx) < 15
                      ? ''
                      : left(lowIdx) > 85
                        ? '-translate-x-full'
                        : '-translate-x-1/2'
                  }`}
                  style={{
                    left: `${left(lowIdx)}%`,
                    top: `${top(prim[lowIdx])}%`,
                    marginTop: lowAbove ? -14 : 16,
                  }}
                >
                  <span className="u-tabular text-smoke/85">{fmt(prim[lowIdx])}</span> · {c.lowNote}
                </div>
              </motion.div>
            )}
          </div>

          {hover !== null && (
            <div
              className="pointer-events-none absolute top-6 z-10 border border-volt bg-ink px-3 py-2 text-[12px] leading-relaxed text-smoke sm:top-8"
              style={
                hover > n * 0.65
                  ? { right: `${100 - (x(hover) / W) * 100}%`, marginRight: 12 }
                  : { left: `${(x(hover) / W) * 100}%`, marginLeft: 12 }
              }
            >
              <b className="text-volt">
                {c.unit} {hover + 1}
              </b>
              <br />
              {fmt(prim[hover])} {c.primary.label}
              {sec && c.secondary && (
                <>
                  <br />
                  {fmt(sec[hover])} {c.secondary.label}
                </>
              )}
              {eventAt(hover) && (
                <>
                  <br />
                  <b className="text-volt">● {eventAt(hover)!.label ?? 'publicación'}</b>
                </>
              )}
            </div>
          )}

          {/* Phone reading of the same two points the desktop overlay marks. */}
          {tall && (
            <div className="mt-4 border-t border-line pt-4">
              <div className="flex items-baseline gap-3">
                <span className="mt-1 block h-2.5 w-2.5 shrink-0 rounded-full bg-volt" />
                <div>
                  <span className="u-label text-signal">
                    {c.unit} {c.highlight.at} · el pico
                  </span>
                  <div className="u-display u-tabular mt-1.5 text-[26px] leading-none text-volt">
                    {fmt(prim[hi])} <span className="text-[0.5em] tracking-normal">{c.primary.short}</span>
                  </div>
                  {sec && c.secondary && (
                    <div className="u-tabular mt-2 text-[13px] text-smoke/85">
                      {fmt(sec[hi])} {c.secondary.short}
                    </div>
                  )}
                  <p className="mt-2 text-[13px] leading-snug text-signal">{c.highlight.note}</p>
                </div>
              </div>
              <p className="mt-4 border-t border-line pt-3 text-[13px] text-signal">
                <span className="u-tabular text-smoke/85">{fmt(prim[lowIdx])}</span> · {c.lowNote} ({c.unit}{' '}
                {lowIdx + 1})
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 px-1 text-[13px] text-smoke/70">
            <span className="flex items-center gap-2">
              <i className="block h-[3px] w-6 bg-volt" />
              <span className="first-letter:uppercase">{c.primary.label}</span>
            </span>
            {c.secondary && (
              <span className="flex items-center gap-2">
                <i className="block w-6 border-t-2 border-dashed border-smoke" />
                <span className="first-letter:uppercase">{c.secondary.label}</span>
              </span>
            )}
            <span className="flex items-center gap-2">
              <i className="block h-2.5 w-2.5 rounded-full bg-volt ring-2 ring-ink ring-offset-1 ring-offset-volt" />{' '}
              {c.eventsLabel}
            </span>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-14">
          <p className="text-[15px] leading-relaxed text-smoke/70 sm:text-[16px] lg:col-span-7">
            {c.approx && (
              <span className="u-label mr-3 inline-block bg-line px-2 py-1 text-smoke/80">
                {c.approx}
              </span>
            )}
            {c.note}
          </p>
          <div className="border-l-2 border-volt pl-5 lg:col-span-5">
            <span className="u-label text-volt">Qué significa para ti</span>
            <p className="mt-3 text-[15px] leading-relaxed text-smoke sm:text-[16px]">
              {c.takeaway}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
