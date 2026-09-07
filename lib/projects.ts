import { MEDIA, type Shot } from './media'
import { VIDEO, type Clip } from './video'

export type Category = 'gastronomia' | 'producto' | 'deporte' | 'moda' | 'envivo'

export const CATEGORIES: { key: Category | 'todo'; label: string }[] = [
  { key: 'todo', label: 'Todo' },
  { key: 'gastronomia', label: 'Gastronomía' },
  { key: 'producto', label: 'Producto' },
  { key: 'deporte', label: 'Deporte' },
  { key: 'moda', label: 'Moda' },
  { key: 'envivo', label: 'En vivo' },
]

export type Project = {
  slug: string
  code: string
  client: string
  title: string
  year: string
  category: Category
  categoryLabel: string
  summary: string
  brief: string
  services: string[]
  deliverables: string
  location: string
  href: string
  /** index into MEDIA[slug] used as the cover */
  coverIndex: number
  /** curated indices shown in the mosaic, in order */
  featured: number[]
  shots: Shot[]
  /** self-hosted clips transcoded from the Behance (Adobe CCV) embeds */
  clips: Clip[]
}

const P = (p: Omit<Project, 'shots' | 'clips'>): Project => ({
  ...p,
  shots: MEDIA[p.slug] ?? [],
  clips: VIDEO[p.slug] ?? [],
})

export const PROJECTS: Project[] = [
  P({
    slug: 'yum',
    code: 'KDR—001',
    client: 'YUM!',
    title: 'Toda la carta en una jornada',
    year: '2023',
    category: 'gastronomia',
    categoryLabel: 'Gastronomía',
    summary:
      'Campaña digital completa para una marca de sándwiches: producto, cocina y equipo grabados en un solo día de rodaje.',
    brief:
      'YUM! necesitaba renovar toda su comunicación digital sin cerrar el local. Montamos set dentro de la cocina y fotografiamos la carta completa entre servicio y servicio. El resultado alimentó menús impresos, redes y publicidad pagada durante todo el año.',
    services: ['Dirección de arte', 'Fotografía de producto', 'Video', 'Retoque', 'Piezas para campaña'],
    deliverables: '26 piezas',
    location: 'Bogotá, Colombia',
    href: 'https://www.behance.net/gallery/169101925/YUM-Digital-Marketing-Campaign',
    coverIndex: 5,
    featured: [5, 3, 12, 8, 22, 15, 2, 9],
  }),
  P({
    slug: 'la-tdc',
    code: 'KDR—002',
    client: 'La TDC',
    title: 'Producto bajo neón',
    year: '2023',
    category: 'producto',
    categoryLabel: 'Producto',
    summary:
      'El catálogo visual más extenso que hemos producido: fotografía, video y diseño para toda la línea de producto de la marca.',
    brief:
      'Un catálogo entero construido desde cero. Iluminación de color como firma visual, packaging fotografiado en estudio y en calle, y un sistema de piezas que la marca sigue usando en cada lanzamiento.',
    services: ['Fotografía de producto', 'Video', 'Diseño gráfico', 'Identidad aplicada', 'Dirección de arte'],
    deliverables: '55 piezas',
    location: 'Bogotá, Colombia',
    href: 'https://www.behance.net/gallery/168084613/La-TDC-Photography-Video-and-Desing',
    coverIndex: 19,
    featured: [4, 19, 30, 11, 44, 7, 25, 38, 16, 50],
  }),
  P({
    slug: 'deporte',
    code: 'KDR—003',
    client: 'Fitgure',
    title: 'Esto es generación fitness',
    year: '2022',
    category: 'deporte',
    categoryLabel: 'Deporte',
    summary:
      'Fotografía y video deportivo en exteriores de Bogotá para el lanzamiento de marca de una plataforma de entrenamiento.',
    brief:
      'Rodaje en calle, parque y gimnasio con atletas reales. Luz natural en horas límite —amanecer y contraluz de tarde— para que el esfuerzo se viera de verdad. De ahí salió el sistema de piezas gráficas de la campaña.',
    services: ['Fotografía deportiva', 'Video', 'Dirección', 'Piezas gráficas'],
    deliverables: '12 piezas',
    location: 'Bogotá, Colombia',
    href: 'https://www.behance.net/gallery/134450951/FOTOGRAFIA-Y-VIDEOS-DE-DEPORTE',
    coverIndex: 0,
    featured: [0, 2, 4, 9, 5, 10],
  }),
  P({
    slug: 'fxa-moda',
    code: 'KDR—004',
    client: 'FXA',
    title: 'Editorial en el centro',
    year: '2026',
    category: 'moda',
    categoryLabel: 'Moda',
    summary:
      'Sesión editorial de moda y accesorios entre arquitectura colonial y fachadas de color del centro de Bogotá.',
    brief:
      'Dos looks, dos locaciones, una jornada. Interiores patrimoniales para la línea formal y calle empedrada para la línea casual, siempre con el producto legible en cuadro. Formato vertical pensado para catálogo y redes.',
    services: ['Dirección de arte', 'Fotografía de moda', 'Scouting de locación', 'Retoque'],
    deliverables: '10 piezas',
    location: 'Bogotá, Colombia',
    href: 'https://www.behance.net/gallery/252460809/SESION-DE-FOTOS-MODA-(FXA)',
    coverIndex: 0,
    featured: [0, 2, 5, 7, 3, 9],
  }),
  P({
    slug: 'kevin-florez',
    code: 'KDR—005',
    client: 'Kevin Flórez',
    title: 'Concierto, sin segunda toma',
    year: '2022',
    category: 'envivo',
    categoryLabel: 'En vivo',
    summary:
      'Cubrimiento fotográfico y audiovisual del concierto: tarima, público y backstage en una sola noche.',
    brief:
      'Lo que pasa en vivo pasa una vez. Dos cuerpos de cámara, gran angular en tarima y cobertura de público, entregando material listo para publicar mientras el show todavía estaba en boca de todos.',
    services: ['Cubrimiento en vivo', 'Fotografía de concierto', 'Video', 'Entrega express'],
    deliverables: '8 piezas',
    location: 'Colombia',
    href: 'https://www.behance.net/gallery/144473091/Concierto-Kevin-Florez',
    coverIndex: 7,
    featured: [2, 6, 4, 0, 7, 1],
  }),
]

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug)

export const TOTAL_SHOTS = PROJECTS.reduce((n, p) => n + p.shots.length, 0)
export const TOTAL_CLIPS = PROJECTS.reduce((n, p) => n + p.clips.length, 0)

/** Neighbours in portfolio order, wrapping at both ends. */
export const siblings = (slug: string) => {
  const i = PROJECTS.findIndex((p) => p.slug === slug)
  const n = PROJECTS.length
  return {
    prev: PROJECTS[(i - 1 + n) % n],
    next: PROJECTS[(i + 1) % n],
    index: i,
  }
}

export const SERVICES = [
  {
    n: '01',
    title: 'Producción audiovisual',
    body: 'Dirección, cámara, luz y sonido. Comerciales, institucionales, marca y contenido para redes. Equipo propio y movilidad para rodar donde haya que rodar.',
    tags: ['Comercial', 'Institucional', 'Marca', 'Reel vertical'],
  },
  {
    n: '02',
    title: 'Fotografía comercial',
    body: 'Producto, gastronomía, moda, retrato corporativo y arquitectura. Set en estudio o montado en tu local, con retoque incluido y entrega en los formatos que uses.',
    tags: ['Producto', 'Gastronomía', 'Moda', 'Retrato'],
  },
  {
    n: '03',
    title: 'Dirección de arte',
    body: 'Antes de encender la cámara: referencia visual, paleta, styling y plan de tomas. Que cada pieza se vea de la misma marca y no de cinco marcas distintas.',
    tags: ['Concepto', 'Styling', 'Paleta', 'Plan de tomas'],
  },
  {
    n: '04',
    title: 'Post y entrega',
    body: 'Edición, color, motion y masterizado por formato. Todo llega organizado, nombrado y descargable, listo para publicar sin pasar por otro proveedor.',
    tags: ['Edición', 'Color', 'Motion', 'Máster'],
  },
  {
    n: '05',
    title: 'Cubrimiento de eventos',
    body: 'Conciertos, lanzamientos, activaciones y corporativo. Cobertura completa con entrega express del material clave mientras el evento sigue vivo.',
    tags: ['Concierto', 'Lanzamiento', 'Activación', 'Express'],
  },
  {
    n: '06',
    title: 'Contenido por suscripción',
    body: 'Un día de rodaje al mes, un banco de piezas para todo el mes. Pensado para marcas que necesitan alimentar sus canales sin montar un equipo interno.',
    tags: ['Mensual', 'Banco de piezas', 'Copys', 'Calendario'],
  },
] as const

export const PROCESS = [
  {
    n: '01',
    title: 'Lectura',
    body: 'Entendemos qué vende la marca, a quién y en qué canal. Salimos con una referencia visual concreta, no con una idea bonita.',
  },
  {
    n: '02',
    title: 'Preproducción',
    body: 'Plan de tomas, locación, styling, permisos y cronograma. Cuando llega el día de rodaje ya sabemos cada plano que vamos a hacer.',
  },
  {
    n: '03',
    title: 'Rodaje',
    body: 'Un equipo compacto que entra, monta, graba y desmonta sin frenar tu operación. Se rueda contra la lista, no contra la improvisación.',
  },
  {
    n: '04',
    title: 'Entrega',
    body: 'Edición, color y máster por formato. Carpeta organizada, nombrada y tuya, con los archivos originales disponibles cuando los pidas.',
  },
] as const

export const STATS = [
  { value: 5, suffix: '', label: 'Proyectos publicados' },
  { value: TOTAL_SHOTS, suffix: '', label: 'Piezas en este portafolio' },
  { value: 6, suffix: '+', label: 'Años produciendo' },
  { value: 1, suffix: ' día', label: 'Rodaje típico por proyecto' },
] as const

export const CONTACT = {
  whatsapp: '573181997207',
  whatsappLabel: 'WhatsApp',
  instagram: 'https://www.instagram.com/',
  behance: 'https://www.behance.net/mestizo_xd',
  city: 'Bogotá, Colombia',
  waMessage: 'Hola Kuadra, vi el portafolio y quiero cotizar un proyecto.',
} as const

/** WhatsApp is the only inbound channel, so every CTA builds its link here. */
export const waWith = (message: string) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`

export const waLink = waWith(CONTACT.waMessage)
