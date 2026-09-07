import type { Metadata, Viewport } from 'next'
import { Archivo_Black, Space_Grotesk } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import Preloader from '@/components/Preloader'

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const SITE = 'https://www.kuadrafilm.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
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

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${archivoBlack.variable} ${spaceGrotesk.variable}`}>
      <body className="u-grain antialiased">
        <Preloader />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
