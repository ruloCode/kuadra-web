import Reveal from '../ui/Reveal'
import SplitLines from '../ui/SplitLines'
import { CASES } from '@/lib/propuesta'

export default function Casos() {
  return (
    <section id="casos" className="scroll-mt-20 u-gutter pb-16 sm:pb-24 lg:pb-32">
      <div className="mb-12 flex flex-col justify-between gap-8 border-b border-line pb-10 lg:flex-row lg:items-end">
        <div>
          <Reveal>
            <span className="u-label flex items-center gap-3 text-volt">
              <span className="h-px w-8 bg-volt" />
              Casos
            </span>
          </Reveal>
          <h2 className="u-display mt-6 max-w-[14ch] text-[clamp(36px,6vw,88px)] text-smoke">
            <SplitLines lines={['Negocios que ya', 'se ven como', 'se merecen.']} accent={[2]} />
          </h2>
        </div>
        <Reveal delay={0.12}>
          <p className="max-w-[36ch] text-[15px] leading-relaxed text-smoke/70">
            Cuentas locales, en Bogotá, con el mismo formato que te proponemos: un rodaje al mes
            y medición semanal.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {CASES.map((c, i) => (
          <Reveal key={c.key} delay={i * 0.1} className="h-full">
            <article className="group relative flex h-full flex-col border border-line bg-carbon p-7 transition-colors duration-300 hover:border-volt sm:p-9">
              {/* corner tick — echoes the viewfinder */}
              <span className="absolute right-4 top-4 h-4 w-4 border-r border-t border-line transition-colors group-hover:border-volt" />

              <span className="u-label text-volt">{c.tag}</span>
              <h3 className="u-display mt-4 text-[clamp(26px,3vw,40px)] text-smoke">{c.name}</h3>

              <div className="mt-7 grid grid-cols-3 gap-4">
                {c.stats.map((s) => (
                  <div key={s.l} className="border-l-2 border-volt pl-3">
                    <b className="u-display u-tabular block text-[clamp(18px,2.1vw,28px)] leading-none text-smoke">
                      {s.v}
                    </b>
                    <span className="mt-1.5 block text-[12px] text-signal">{s.l}</span>
                  </div>
                ))}
              </div>

              <p className="mt-7 max-w-[48ch] text-[15px] leading-relaxed text-smoke/70">{c.summary}</p>

              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="u-label mt-8 inline-flex w-fit items-center gap-2 border border-line px-5 py-3 text-smoke transition-colors group-hover:border-volt hover:bg-volt hover:text-ink"
              >
                Ver la cuenta ↗
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
