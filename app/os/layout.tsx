import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Kuadra OS', template: '%s · Kuadra OS' },
  description: 'Panel interno de Kuadra Film',
  robots: { index: false, follow: false },
}

/**
 * El panel. Comparte documento y tipografías con el sitio, pero nada más: ni
 * grano fílmico ni scroll de Lenis, que aquí sólo estorban.
 *
 * La clase `os-app` acota los estilos propios del panel (formularios, hairlines
 * más marcados) para que no se filtren al sitio público.
 */
export default function OsLayout({ children }: LayoutProps<'/os'>) {
  return <div className="os-app">{children}</div>
}
