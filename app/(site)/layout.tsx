import type { Metadata } from 'next'

import Preloader from '@/components/Preloader'
import SmoothScroll from '@/components/SmoothScroll'

const SITE = 'https://www.kuadrafilm.com'

export const metadata: Metadata = {
  title: {
    default: 'Kuadra Film — Productora audiovisual en Bogotá',
    template: '%s · Kuadra Film',
  },
  description:
    'Productora audiovisual en Bogotá. Fotografía comercial, video, dirección de arte y post para marcas. De tu cuadra, cuadro a cuadro.',
  keywords: [
    'productora audiovisual Bogotá',
    'fotografía comercial Colombia',
    'video para marcas',
    'fotografía de producto',
    'dirección de arte',
    'Kuadra Film',
  ],
  authors: [{ name: 'Kuadra Film' }],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: SITE,
    siteName: 'Kuadra Film',
    title: 'Kuadra Film — Productora audiovisual en Bogotá',
    description:
      'Fotografía comercial, video, dirección de arte y post para marcas. De tu cuadra, cuadro a cuadro.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kuadra Film — Productora audiovisual en Bogotá',
    description: 'Fotografía comercial, video, dirección de arte y post para marcas.',
  },
  icons: {
    icon: '/brand/kuadra-isotipo.svg',
    apple: '/brand/kuadra-isotipo.svg',
  },
}

/**
 * El sitio público. El grano fílmico y el scroll suave de Lenis viven aquí y
 * no en la raíz: el panel no los quiere —en una tabla densa el grano estorba y
 * Lenis pelea con el scroll de los drawers.
 */
export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="u-grain">
      <Preloader />
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  )
}
