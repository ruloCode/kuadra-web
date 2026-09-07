import { STATS } from '@/lib/projects'
import Counter from './ui/Counter'
import Reveal from './ui/Reveal'

export default function Numeros() {
  return (
    <section className="u-gutter py-12 sm:py-20 lg:py-24">
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-y border-line py-14 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="flex flex-col gap-3">
              <span className="u-display text-[clamp(40px,6vw,84px)] leading-none text-volt">
                <Counter to={s.value} suffix={s.suffix} />
              </span>
              <span className="u-label max-w-[16ch] text-signal">{s.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
