import { waWith } from './projects'

/**
 * Copy and data for the commercial proposal page. Everything a person might
 * want to edit before sending the link lives here, not in the components.
 */

export const CLIENT = {
  name: 'Nativos para Nativos',
  short: 'Nativos',
  city: 'Bogotá',
  ref: 'KDR—NPN—001',
  date: '02 · 09 · 2026',
  validity: '30 días',
} as const

export const wa = waWith

export const WA_MAIN = wa(
  `Hola Kuadra, vi la propuesta para ${CLIENT.name} y quiero conversar.`,
)

export const TICKER = [
  'De tu cuadra, cuadro a cuadro',
  '1 día de grabación = 1 mes de contenido',
  '192.000 vistas en 30 días',
  '3.419 seguidores desde cero',
  'Clandestine: bicampeones de Pizza Master',
  'Guiones decididos con datos',
] as const

export const KPIS = [
  {
    value: 192000,
    suffix: '',
    label: 'vistas en 30 días',
    sub: 'Todo el contenido publicado, Instagram',
  },
  {
    value: 3419,
    prefix: '+',
    suffix: '',
    label: 'seguidores en los primeros 30 días',
    sub: 'La cuenta arrancó en cero',
  },
  {
    value: 8996,
    suffix: '',
    label: 'interacciones en 30 días',
    sub: 'Likes, comentarios, guardados y compartidos',
  },
  {
    value: 100,
    suffix: 'K+',
    label: 'vistas en un solo reel',
    sub: 'Un contenido, más de cien mil personas',
  },
] as const

export type CaseKey = 'bambu' | 'clandestine'

export type Series = { label: string; short: string; values: number[] }

export type CaseData = {
  key: CaseKey
  name: string
  tag: string
  href: string
  /** Shown in the chart kicker, e.g. "Últimos 30 días". */
  period: string
  /** X-axis unit: "Día" or "Mes". */
  unit: string
  /** Volt line. */
  primary: Series
  /** Dashed white line, optional. */
  secondary?: Series
  /** Markers on the primary line; `at` is 1-indexed. Value is read from the data. */
  events: { at: number; label?: string }[]
  eventsLabel: string
  /** The one point that gets a full callout box, always visible. */
  highlight: { at: number; note: string }
  /** Caption for the lowest point of the series. */
  lowNote: string
  /** Three figures for the case card. */
  stats: { v: string; l: string }[]
  summary: string
  note: string
  /** Turns the case into an argument for this client. Closes the section. */
  takeaway: string
  /** Small badge next to the note when part of the curve is modelled. */
  approx?: string
}

/** Bambú: 30 days of a launch. Daily shape is scaled to the real totals. */
const BAMBU_SHAPE = [
  18, 14, 9, 5.5, 3.8, 2.9, 2.4, 2.1, 6.5, 9.8, 5.2, 3.1, 2.3, 2.0, 12, 38, 26, 11, 5, 3.2, 2.4,
  2.1, 4.5, 7.2, 3.9, 2.6, 2.0, 1.8, 3.1, 4.6,
]
const BAMBU_VIEWS = 192000
const BAMBU_FOLLOWERS = 3419
const bambuSum = BAMBU_SHAPE.reduce((a, b) => a + b, 0)
const bambuViews = BAMBU_SHAPE.map((v) => Math.round((v / bambuSum) * BAMBU_VIEWS))
const bambuFollowers = bambuViews
  .reduce<number[]>((out, v) => {
    const prev = out.length ? out[out.length - 1] : 0
    out.push(prev + (v / BAMBU_VIEWS) * BAMBU_FOLLOWERS)
    return out
  }, [])
  .map(Math.round)

/**
 * Clandestine: twelve months of community building. Start and end follower
 * counts are real (1.100 → more than 4.000); the month-by-month shape is
 * modelled. Three quarters of the growth was organic; paid only ever went
 * behind pieces that were already working on their own.
 */
const CLANDESTINE_FOLLOWERS = [
  1100, 1180, 1320, 1580, 1760, 1950, 2180, 2420, 2700, 3350, 3800, 4120,
]

export const CASES: CaseData[] = [
  {
    key: 'bambu',
    name: 'Bambú Coliving',
    tag: 'Coliving · Puente Aranda',
    href: 'https://www.instagram.com/',
    period: 'Lanzamiento · 30 días',
    unit: 'Día',
    primary: { label: 'vistas diarias', short: 'vistas', values: bambuViews },
    secondary: { label: 'seguidores acumulados', short: 'seguidores acumulados', values: bambuFollowers },
    events: [1, 9, 16, 23].map((at) => ({ at })),
    eventsLabel: 'Publicación de contenido',
    highlight: { at: 16, note: 'Un solo reel. Un día en que treinta y tres mil personas vieron el negocio.' },
    lowNote: 'el valle más bajo',
    stats: [
      { v: '192K', l: 'vistas / 30 días' },
      { v: '+3.419', l: 'seguidores desde 0' },
      { v: '9K', l: 'interacciones' },
    ],
    summary:
      'Lanzamiento de cuenta desde cero. Un día de grabación al mes, doce piezas, y un reel que superó las 100 mil vistas en su primera semana.',
    note: 'Lee la curva de izquierda a derecha y vas a ver el negocio completo. Cada pico es una pieza publicada. Cada valle son los días en que no salió nada. El día 16 no fue suerte: fue un reel construido con la lista de tomas, y ese solo día trajo 33.778 vistas y empujó la cuenta a 2.162 seguidores. Los seguidores no llegan en línea recta, llegan a saltos, exactamente cuando el contenido acierta. Por eso medimos pieza por pieza: para repetir el día 16 y acortar los valles.',
    takeaway: 'Para tu local esto se traduce en algo simple: cada pieza que sale es una vitrina abierta, y cada semana sin publicar es una vitrina cerrada. Nuestro trabajo es que la vitrina no se cierre.',
  },
  {
    key: 'clandestine',
    name: 'Clandestine Pizza',
    tag: 'Pizzería · Bogotá · 12 meses',
    href: 'https://www.instagram.com/',
    period: 'Objetivo: ganar Pizza Master · 12 meses',
    unit: 'Mes',
    primary: { label: 'seguidores', short: 'seguidores', values: CLANDESTINE_FOLLOWERS },
    events: [
      { at: 3, label: 'Campaña en el local' },
      { at: 6, label: 'Pauta sobre lo que ya funcionaba' },
      { at: 10, label: 'Campeones' },
    ],
    eventsLabel: 'Hito de la campaña',
    highlight: { at: 10, note: 'Objetivo cumplido: campeones de Pizza Master. Y repetido al año siguiente.' },
    lowNote: 'punto de partida',
    stats: [
      { v: '2×', l: 'campeones de Pizza Master' },
      { v: '+3.000', l: 'seguidores · de 1.100 a más de 4.000' },
      { v: '25%', l: 'del crecimiento con pauta dirigida' },
    ],
    summary:
      'Nos buscaron con un objetivo concreto: ganar Pizza Master. Convertimos a la gente que ya comía en el local en una comunidad lista para votar por ellos. De 1.100 a más de 4.000 seguidores, y campeones dos años seguidos.',
    note: 'Clandestine no nos pidió "más seguidores". Nos puso un objetivo de negocio: ganar Pizza Master. Así que el contenido se diseñó para eso. Activamos dentro del local a la gente que ya comía ahí, la pasamos a la cuenta y la preparamos para el día en que abrieran las inscripciones. La cuenta subió de 1.100 a más de 4.000 seguidores en el año. Tres cuartas partes de ese crecimiento fueron orgánicas. El 25% restante lo pusimos en pauta, y nunca a ciegas: solo detrás de los videos que ya estaban funcionando solos, para llevarlos más lejos. El objetivo se cumplió, y no una vez: campeones dos años consecutivos.',
    takeaway: 'Así usaríamos la pauta contigo: nunca para tapar contenido que no funciona, sino para multiplicar el que ya demostró que sí. Primero se mide, después se invierte. Dinos qué quieres ganar este año y armamos la campaña para eso.',
    approx: 'Curva mensual aproximada · inicio y cierre reales',
  },
]

export const STATEMENT =
  'Un día de grabación en tu local. Doce piezas listas para todo el mes. Y cada guion decidido con datos, no con intuición.'

export const STATEMENT_ACCENT = new Set(['local.', 'mes.', 'datos,'])

export const STEPS = [
  {
    n: '01',
    title: 'Análisis del nicho y de la zona',
    body: 'Antes de grabar estudiamos quién compra, a qué hora y qué lo mueve, cruzando datos demográficos con investigación publicada sobre consumo y contenido.',
    meta: 'Semana 0',
  },
  {
    n: '02',
    title: 'Lista de tomas sobre evidencia',
    body: 'Cada pieza se decide antes de llegar, con base en estudios revisados por pares. Nada de consejos de gurús ni tendencias sin respaldo.',
    meta: 'Semana 0',
  },
  {
    n: '03',
    title: 'Jornada de grabación',
    body: 'Un día, equipo profesional, tu producto y tu gente. Salen 8 reels y 4 carruseles con sus textos y calendario.',
    meta: '4 horas en tu local',
  },
  {
    n: '04',
    title: 'Medición semanal con datos e IA',
    body: 'Revisamos pieza por pieza: retención, guardados, compartidos. Lo que funciona se profundiza; lo que no, se reemplaza. Incluido en el servicio.',
    meta: 'Cada semana',
  },
] as const

export type Plan = {
  key: string
  tag: string
  name: string
  price: string
  period: string
  after: string
  items: string[]
  cta: string
  href: string
  featured?: boolean
}

export const PLANS: Plan[] = [
  {
    key: 'punto',
    tag: 'Para empezar',
    name: 'Punto',
    price: '$600.000',
    period: '/ mes · meses 1–3',
    after: 'Luego $800.000 / mes',
    items: [
      '8 reels + 4 carruseles al mes',
      '1 jornada de grabación en tu local',
      'Textos y calendario listos',
      'Estrategia con análisis de datos e IA',
    ],
    cta: 'Quiero este plan',
    href: wa(`Hola Kuadra, me interesa el plan Punto para ${CLIENT.name}.`),
  },
  {
    key: 'vende',
    tag: 'Recomendado',
    name: 'Punto que vende',
    price: '$1.050.000',
    period: '/ mes · meses 1–3',
    after: 'Contenido + gestión de pauta',
    items: [
      'Todo el plan Punto',
      'Gestión de pauta hasta $2M de inversión',
      'Campañas de clic a WhatsApp y tráfico al local',
      'Reporte mensual: cuánto costó cada cliente',
      'Ahorro de $400.000 el primer mes',
    ],
    cta: 'Quiero este plan',
    href: wa(`Hola Kuadra, me interesa el plan Punto que vende para ${CLIENT.name}.`),
    featured: true,
  },
  {
    key: 'red',
    tag: 'Para varios puntos',
    name: 'Red',
    price: 'A la medida',
    period: '· desde 3 puntos',
    after: 'Tarifa decreciente por punto',
    items: [
      'Una sola línea de producción',
      'Manual de redes para todas las sedes',
      'Contenido de marca compartido',
      'Datos consolidados de toda la red',
    ],
    cta: 'Cotizar',
    href: wa(`Hola Kuadra, ${CLIENT.name} tiene varios puntos y queremos cotizar.`),
  },
]
