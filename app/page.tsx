import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import ClientMarquee from '@/components/ClientMarquee'
import Manifiesto from '@/components/Manifiesto'
import Work from '@/components/Work'
import Claqueta from '@/components/Claqueta'
import Numeros from '@/components/Numeros'
import Archivo from '@/components/Archivo'
import Servicios from '@/components/Servicios'
import Proceso from '@/components/Proceso'
import Estudio from '@/components/Estudio'
import Contacto from '@/components/Contacto'
import Footer from '@/components/Footer'
import MobileCta from '@/components/MobileCta'
import { PROJECTS, CONTACT } from '@/lib/projects'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.kuadrafilm.com/#studio',
  name: 'Kuadra Film',
  description:
    'Productora audiovisual en Bogotá: fotografía comercial, video, dirección de arte y post para marcas.',
  slogan: 'De tu cuadra, cuadro a cuadro',
  telephone: `+${CONTACT.whatsapp}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Bogotá', addressCountry: 'CO' },
  areaServed: 'Colombia',
  founder: { '@type': 'Person', name: 'Nicolás Delgado Rodríguez' },
  sameAs: [CONTACT.behance],
  makesOffer: PROJECTS.map((p) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'CreativeWork', name: `${p.client} — ${p.title}`, url: p.href },
  })),
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="pb-[84px] sm:pb-0">
        <Hero />
        <ClientMarquee />
        <Manifiesto />
        <Claqueta height={12} />
        <Work />
        <Numeros />
        <Archivo />
        <Claqueta height={12} />
        <Servicios />
        <Proceso />
        <Estudio />
        <Contacto />
      </main>
      <Footer />
      <MobileCta />
    </>
  )
}
