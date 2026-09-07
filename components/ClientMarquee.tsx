import Marquee from './ui/Marquee'
import { PROJECTS } from '@/lib/projects'

const EXTRA = ['Bambú', 'MG', 'Diablos Tour', 'Cráneo & Lasser']

/** Ticker of client names, split by the rec dot. Doubles as a section break. */
export default function ClientMarquee() {
  const names = [...PROJECTS.map((p) => p.client), ...EXTRA]

  return (
    <div className="u-rule border-b border-line py-7">
      <Marquee duration={38} pauseOnHover>
        {names.map((n, i) => (
          <span key={`${n}-${i}`} className="flex items-center">
            <span className="u-display whitespace-nowrap px-8 text-[clamp(22px,3vw,40px)] text-smoke/85">
              {n}
            </span>
            <span className="block h-1.5 w-1.5 shrink-0 rounded-full bg-volt" />
          </span>
        ))}
      </Marquee>
    </div>
  )
}
