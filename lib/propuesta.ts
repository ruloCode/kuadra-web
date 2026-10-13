import { waWith } from './projects'

/**
 * Copy and data for commercial proposal pages. Shared proof (Bambú / Clandestine)
 * lives here once; each client brings its own offer, price and WhatsApp copy.
 *
 * Cifras de prueba: las del PDF vigente mandan. Bambú, +3.419 seguidores en
 * 10 días. Clandestine, de 100 a más de 3.000.
 */

export const wa = waWith

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
  listPrice?: string
}

export type Step = {
  n: string
  title: string
  body: string
  meta: string
}

export type Pilar = {
  n: string
  title: string
  body: string
}

export type Tarifario = {
  listTotal: string
  listItems: { label: string; value: string }[]
  launchSave: string
  launchPct: string
  afterSave: string
  afterPct: string
}

export type ProposalCopy = {
  client: {
    name: string
    short: string
    city: string
    instagram?: string
    address?: string
    ref: string
    date: string
    validity: string
  }
  hero: {
    kicker: string
    lines: string[]
    accent: number[]
    lede: string
    ghost: string
  }
  ticker: string[]
  statement: string
  statementAccent: string[]
  statementStats: { n: string; l: string }[]
  methodTitle: string[]
  methodAccent: number[]
  methodLede: string
  steps: Step[]
  plansTitle: string[]
  plansAccent: number[]
  plansLede: string
  plansNote: string
  plans: Plan[]
  cierre: { lines: string[]; body: string }
  waMain: string
  pillars?: Pilar[]
  tarifa?: Tarifario
  cupos?: { taken: number; total: number; body: string }
  arranque?: Step[]
  finePrint?: string
  /** Shorter page: less copy, more motion. Used for clients who skim. */
  compact?: boolean
}

export const KPIS = [
  {
    value: 192000,
    suffix: '',
    label: 'vistas del lanzamiento',
    sub: 'Todo el contenido publicado, Instagram',
  },
  {
    value: 3419,
    prefix: '+',
    suffix: '',
    label: 'seguidores en los primeros 10 días',
    sub: 'La cuenta arrancó en cero',
  },
  {
    value: 8996,
    suffix: '',
    label: 'interacciones del lanzamiento',
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
  period: string
  unit: string
  primary: Series
  secondary?: Series
  events: { at: number; label?: string }[]
  eventsLabel: string
  highlight: { at: number; note: string }
  lowNote: string
  stats: { v: string; l: string }[]
  summary: string
  note: string
  takeaway: string
  approx?: string
}

/** Bambú: 10 days of a launch. Daily shape is scaled to the real totals. */
const BAMBU_SHAPE = [18, 9, 5.5, 3.8, 12, 38, 26, 11, 5, 7.2]
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
 * Clandestine: community from 100 to more than 3.000. Start and end are the
 * published totals; the month-by-month shape is modelled.
 */
const CLANDESTINE_FOLLOWERS = [100, 180, 280, 420, 580, 780, 1100, 1500, 1950, 2400, 2750, 3100]

export const CASES: CaseData[] = [
  {
    key: 'bambu',
    name: 'Bambú Coliving',
    tag: 'Coliving · Puente Aranda',
    period: 'Lanzamiento · 10 días',
    unit: 'Día',
    primary: { label: 'vistas diarias', short: 'vistas', values: bambuViews },
    secondary: { label: 'seguidores acumulados', short: 'seguidores acumulados', values: bambuFollowers },
    events: [1, 5, 6].map((at) => ({ at })),
    eventsLabel: 'Publicación de contenido',
    highlight: {
      at: 6,
      note: 'Un solo reel. El día en que el negocio se vio como se merecía.',
    },
    lowNote: 'el valle más bajo',
    stats: [
      { v: '192K', l: 'vistas del lanzamiento' },
      { v: '+3.419', l: 'seguidores / 10 días' },
      { v: '100K+', l: 'un solo reel' },
    ],
    summary:
      'Lanzamiento de cuenta desde cero. Un día de grabación al mes, doce piezas, y un reel que superó las 100 mil vistas. En diez días, +3.419 seguidores.',
    note: 'Lee la curva de izquierda a derecha y vas a ver el negocio completo. Cada pico es una pieza publicada. Cada valle son los días en que no salió nada. El día 6 no fue suerte: fue un reel construido con la lista de tomas. Los seguidores no llegan en línea recta, llegan a saltos, exactamente cuando el contenido acierta. Por eso medimos pieza por pieza: para repetir ese día y acortar los valles.',
    takeaway:
      'Para tu local esto se traduce en algo simple: cada pieza que sale es una vitrina abierta, y cada semana sin publicar es una vitrina cerrada. Nuestro trabajo es que la vitrina no se cierre.',
  },
  {
    key: 'clandestine',
    name: 'Clandestine Pizza',
    tag: 'Pizzería · Bogotá',
    period: 'Objetivo: ganar Pizza Master',
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
      { v: '100 → 3.000+', l: 'seguidores' },
      { v: '2 años', l: 'seguidos de campeones' },
    ],
    summary:
      'Nos buscaron con un objetivo concreto: ganar Pizza Master. Convertimos a la gente que ya comía en el local en una comunidad lista para votar por ellos. De 100 a más de 3.000 seguidores, y campeones dos años seguidos.',
    note: 'Clandestine no nos pidió "más seguidores". Nos puso un objetivo de negocio: ganar Pizza Master. Así que el contenido se diseñó para eso. Activamos dentro del local a la gente que ya comía ahí, la pasamos a la cuenta y la preparamos para el día en que abrieran las inscripciones. La cuenta subió de 100 a más de 3.000 seguidores. El objetivo se cumplió, y no una vez: campeones dos años consecutivos.',
    takeaway:
      'Así usaríamos la pauta contigo: nunca para tapar contenido que no funciona, sino para multiplicar el que ya demostró que sí. Primero se mide, después se invierte. Dinos qué quieres ganar este año y armamos la campaña para eso.',
    approx: 'Curva mensual aproximada · inicio y cierre reales',
  },
]

export const NATIVOS: ProposalCopy = {
  client: {
    name: 'Nativos para Nativos',
    short: 'Nativos',
    city: 'Bogotá',
    ref: 'KDR—NPN—001',
    date: '02 · 09 · 2026',
    validity: '30 días',
  },
  hero: {
    kicker: 'Propuesta de contenido',
    lines: ['Nativos para Nativos', 'se ve mejor de lo que', 'se ve en Instagram.'],
    accent: [2],
    lede: 'Un día de grabación en tu local. Doce piezas listas para todo el mes. Y cada guion decidido con datos, no con intuición.',
    ghost: 'NATIVOS NATIVOS NATIVOS',
  },
  ticker: [
    'De tu cuadra, cuadro a cuadro',
    '1 día de grabación = 1 mes de contenido',
    '3.419 seguidores en 10 días',
    '100K+ vistas en un solo reel',
    'Clandestine: de 100 a 3.000+ y bicampeones',
    'Guiones decididos con datos',
  ],
  statement:
    'Un día de grabación en tu local. Doce piezas listas para todo el mes. Y cada guion decidido con datos, no con intuición.',
  statementAccent: ['local.', 'mes.', 'datos,'],
  statementStats: [
    { n: '8', l: 'reels al mes' },
    { n: '4', l: 'carruseles al mes' },
    { n: '1', l: 'jornada de rodaje' },
    { n: '4', l: 'revisiones con datos' },
  ],
  methodTitle: ['Cuatro horas', 'en tu local.', 'Cero', 'improvisación.'],
  methodAccent: [2, 3],
  methodLede: 'El mismo orden cada mes. Cuando llegamos a grabar ya sabemos qué plano va primero y por qué.',
  steps: [
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
  ],
  plansTitle: ['Tres formas', 'de empezar.'],
  plansAccent: [1],
  plansLede: 'Precios en pesos colombianos, sin permanencia. Los primeros tres meses tienen tarifa de lanzamiento.',
  plansNote:
    'Todos los planes incluyen la medición semanal con datos e IA y la entrega organizada y lista para publicar.',
  plans: [
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
      href: wa('Hola Kuadra, me interesa el plan Punto para Nativos para Nativos.'),
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
      href: wa('Hola Kuadra, me interesa el plan Punto que vende para Nativos para Nativos.'),
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
      href: wa('Hola Kuadra, Nativos para Nativos tiene varios puntos y queremos cotizar.'),
    },
  ],
  cierre: {
    lines: ['Un día tuyo.', 'Un mes', 'de contenido.'],
    body: 'Cuéntanos qué vende Nativos para Nativos, en qué barrio está el local y qué día podrías recibirnos. Te decimos exactamente cómo funcionaría en tu caso.',
  },
  waMain: wa('Hola Kuadra, vi la propuesta para Nativos para Nativos y quiero conversar.'),
}

export const AUTOSANDO: ProposalCopy = {
  client: {
    name: 'Autosando',
    short: 'Autosando',
    city: 'Bogotá',
    instagram: '@autosando.vehiculos',
    address: 'Cra 13A # 29-24',
    ref: 'KDR—ASD—001',
    date: '10 · 10 · 2026',
    validity: 'Hasta agotar 10 cupos',
  },
  hero: {
    kicker: 'Propuesta comercial · octubre 2026',
    lines: ['Un concesionario vende', 'todos los días.', 'Sus redes también', 'deberían.'],
    accent: [1, 3],
    lede: 'Reels y carruseles para el concesionario: inventario, entregas, financiación y tips, producidos en su punto de venta y con guiones definidos por datos.',
    ghost: 'AUTOSANDO AUTOSANDO',
  },
  ticker: [
    'Plan de contenido para Autosando',
    '12 piezas al mes · 1 jornada en el concesionario',
    '3.419 seguidores en 10 días',
    '100K+ vistas en un solo reel',
    'Clandestine: de 100 a 3.000+',
    '5 de 10 cupos de lanzamiento disponibles',
  ],
  statement:
    'Un día de grabación en el concesionario. Doce piezas listas para todo el mes. Inventario, entregas y financiación, con guiones definidos por datos.',
  statementAccent: ['concesionario.', 'mes.', 'datos.'],
  statementStats: [
    { n: '8', l: 'reels de hasta 1:30' },
    { n: '4', l: 'carruseles al mes' },
    { n: '1', l: 'jornada de hasta 4 horas' },
    { n: '7', l: 'días hábiles a la primera entrega' },
  ],
  methodTitle: ['Cuatro horas', 'en vitrina.', 'Cero', 'improvisación.'],
  methodAccent: [2, 3],
  methodLede:
    'Cuando llegamos al concesionario ya sabemos qué carro se graba primero, qué entrega se convierte en reel y qué tip va en carrusel.',
  steps: [
    {
      n: '01',
      title: 'Análisis del nicho y de la zona',
      body: 'Antes de grabar estudiamos quién compra carro en tu corredor, a qué hora y qué lo mueve, cruzando datos del sector automotor con lo que ya está funcionando en redes.',
      meta: 'Semana 0',
    },
    {
      n: '02',
      title: 'Lista de tomas sobre evidencia',
      body: 'Cada pieza se decide antes de llegar. Inventario, entregas, financiación y tips: el guion sale de datos, no de una tendencia suelta.',
      meta: 'Semana 0',
    },
    {
      n: '03',
      title: 'Jornada de grabación',
      body: 'Hasta cuatro horas en el punto de venta, con cámara, luz y audio profesional. Salen 8 reels de hasta 1:30 y 4 carruseles, con la línea gráfica de Autosando.',
      meta: 'Hasta 4 horas en el concesionario',
    },
    {
      n: '04',
      title: 'Medición semanal con datos e IA',
      body: 'Revisamos pieza por pieza. Lo que rota inventario se profundiza; lo que no, se reemplaza. Incluido en el servicio, con portal de seguimiento.',
      meta: 'Cada semana',
    },
  ],
  plansTitle: ['El plan básico.', 'Doce piezas al mes.'],
  plansAccent: [0],
  plansLede:
    'Precio de lanzamiento los primeros tres meses, IVA incluido. Sin permanencia después del mínimo de tres meses.',
  plansNote:
    'Incluye medición semanal con datos e IA, una ronda de ajustes por pieza y la entrega organizada por semana, lista para publicar.',
  plans: [
    {
      key: 'basico',
      tag: 'Plan básico',
      name: '12 piezas al mes',
      price: '$1.300.000',
      period: '/ mes · IVA del 19% incluido · meses 1–3',
      after: 'Desde el mes 4: $1.800.000 / mes IVA incluido',
      listPrice: '$2.237.200',
      items: [
        '8 reels de hasta 1:30 + 4 carruseles',
        '1 jornada de grabación en el concesionario, hasta 4 horas',
        'Línea gráfica de Autosando, copys y calendario listos',
        'Estrategia y guiones con IA de tendencias del sector automotor',
        '1 ronda de ajustes por pieza',
        'Primera entrega a los 7 días hábiles, con portal de seguimiento',
      ],
      cta: 'Quiero este plan por WhatsApp',
      href: wa(
        'Hola Kuadra, soy Autosando (@autosando.vehiculos). Vi la propuesta del plan básico a $1.300.000 y quiero reservar un cupo.',
      ),
      featured: true,
    },
  ],
  tarifa: {
    listTotal: '$2.237.200',
    listItems: [
      { label: 'Plan de contenido · 12 piezas, jornada, copys y calendario', value: '$1.200.000' },
      { label: 'Estrategia y guiones con IA', value: '$680.000' },
      { label: 'IVA del 19%', value: '$357.200' },
    ],
    launchSave: '$937.200',
    launchPct: '42%',
    afterSave: '$437.200',
    afterPct: '20%',
  },
  cupos: {
    taken: 5,
    total: 10,
    body: '5 de 10 cupos ya están tomados. El precio de lanzamiento aplica hasta completar los 10 cupos y cubre los primeros tres meses de cada contrato.',
  },
  pillars: [
    {
      n: '01',
      title: 'Inventario que rota',
      body: 'Reels de llegadas y disponibles, grabados en vitrina con el carro como protagonista.',
    },
    {
      n: '02',
      title: 'Entregas y confianza',
      body: 'Las entregas y testimonios que hoy ya graban, convertidos en reels con edición y narrativa profesional.',
    },
    {
      n: '03',
      title: 'Carruseles que asesoran',
      body: 'Tips, financiación y guías de revisión que posicionan a Autosando como el concesionario que aconseja.',
    },
  ],
  arranque: [
    {
      n: '01',
      title: 'Reunión de 30 minutos',
      body: 'Conocemos la marca, el punto de venta y el tono, y reservamos el cupo.',
      meta: 'Hoy',
    },
    {
      n: '02',
      title: 'Agendamos la jornada',
      body: 'Se agenda con el 50% del primer mes; el 50% restante se paga el día de la entrega.',
      meta: 'Cupo reservado',
    },
    {
      n: '03',
      title: 'Primera entrega en 7 días',
      body: 'Reels y carruseles listos y organizados por semana. Desde el segundo mes, mensualidad anticipada.',
      meta: '7 días hábiles',
    },
  ],
  finePrint:
    'El plan se contrata por un mínimo de tres meses y continúa mes a mes, con terminación mediante aviso escrito de quince días. Propuesta válida hasta agotar los 10 cupos. Valores en pesos colombianos.',
  cierre: {
    lines: ['Un día en vitrina.', 'Un mes', 'de contenido.'],
    body: 'Cuéntanos qué inventario hay que rotar esta semana y qué día podemos estar en Cra 13A # 29-24. Te confirmamos el cupo por WhatsApp.',
  },
  waMain: wa(
    'Hola Kuadra, soy Autosando. Vi la propuesta de contenido (12 piezas, $1.300.000 IVA incluido) y quiero conversar.',
  ),
}

/** @deprecated Use NATIVOS.client — kept so older imports keep compiling. */
export const CLIENT = NATIVOS.client
export const WA_MAIN = NATIVOS.waMain
export const TICKER = NATIVOS.ticker
export const STATEMENT = NATIVOS.statement
export const STATEMENT_ACCENT = new Set(NATIVOS.statementAccent)
export const STEPS = NATIVOS.steps
export const PLANS = NATIVOS.plans
