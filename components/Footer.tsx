import { CONTACT, waLink } from '@/lib/projects'
import Claqueta from './Claqueta'
import Wordmark from './ui/Wordmark'

const NAV = [
  { href: '#trabajo', label: 'Trabajo' },
  { href: '#archivo', label: 'Archivo' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#proceso', label: 'Proceso' },
  { href: '#estudio', label: 'Estudio' },
]

const SOCIAL = [
  { href: CONTACT.behance, label: 'Behance' },
  { href: CONTACT.instagram, label: 'Instagram' },
  { href: waLink, label: 'WhatsApp' },
]

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <Claqueta height={10} />
      <div className="u-gutter grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Wordmark className="h-6 w-auto text-smoke" />
          <p className="mt-5 max-w-[30ch] text-[14px] leading-relaxed text-signal">
            Productora audiovisual. Fotografía, video y dirección de arte para marcas.
          </p>
        </div>

        <nav aria-label="Secciones">
          <span className="u-label text-signal">Navegación</span>
          <ul className="mt-4 sm:mt-5 sm:space-y-2.5">
            {NAV.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex min-h-[40px] items-center text-[14px] text-smoke/80 transition-colors hover:text-volt sm:min-h-0">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <span className="u-label text-signal">Contacto</span>
          <ul className="mt-4 sm:mt-5 sm:space-y-2.5">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center text-[14px] text-smoke/80 transition-colors hover:text-volt sm:min-h-0"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="u-gutter u-rule flex flex-wrap items-center justify-between gap-4 py-6">
        <span className="u-label text-signal">
          © {new Date().getFullYear()} Kuadra Film · {CONTACT.city}
        </span>
        <span className="u-label text-signal">De tu cuadra, cuadro a cuadro</span>
      </div>
    </footer>
  )
}
