import type { Metadata, Viewport } from 'next'
import { Archivo_Black, Space_Grotesk } from 'next/font/google'
import './globals.css'

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

/**
 * Raíz común al sitio público y al panel interno. Sólo pone el documento y las
 * tipografías: cada zona monta su propio chrome en su layout.
 *
 *   app/(site)  → kuadrafilm.com — landing, portafolio y propuestas
 *   app/os      → el panel, detrás de login
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://www.kuadrafilm.com'),
}

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es-CO" className={`${archivoBlack.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
