/**
 * Casos con resultados medidos, para la sección «Resultados» de la home.
 *
 * Los mismos dos clientes aparecen en `lib/propuesta.ts`, pero allí viven como
 * series completas para dibujar la gráfica de la propuesta. Aquí sólo están las
 * cifras de titular. Si una cifra cambia hay que tocar los dos archivos.
 *
 * Regla de la marca: ninguna cifra se publica sin su ventana de tiempo, y
 * ningún resultado con pauta detrás se presenta como puramente orgánico.
 */

import { CASES, type CaseKey } from './propuesta'

export type Metrica = {
  /** Tal como se imprime: '192.000', '+3.419', '1.100 → 3.000+'. */
  valor: string
  etiqueta: string
  /** Ventana de tiempo. Obligatorio: no hay cifra sin periodo. */
  periodo: string
}

export type Caso = {
  slug: string
  cliente: string
  categoria: string
  resumen: string
  metricas: Metrica[]
  /** Pie de tarjeta cuando hubo pauta en el periodo medido. */
  notaPauta?: string
  instagram?: string
  /**
   * Curva de crecimiento para el fondo de la tarjeta. Es decoración: va
   * difuminada, sin ejes ni valores, y oculta a lectores de pantalla. Las
   * cifras que cuentan son las de `metricas`, que sí van en texto.
   */
  serie?: number[]
}

/**
 * Curva de crecimiento del caso, sacada de las series de `lib/propuesta.ts`.
 *
 * Bambú mide vistas diarias en `primary` —que suben y bajan con cada pieza—,
 * así que lo que crece es su curva de seguidores acumulados, en `secondary`.
 * Clandestine ya trae seguidores en `primary` y no tiene segunda serie.
 *
 * Ojo con la procedencia: en ambas el arranque y el cierre son reales, pero la
 * forma intermedia está modelada. La propuesta lo declara con una nota al pie;
 * aquí se sostiene porque el gráfico va borroso y sin escala, como textura.
 */
const crecimiento = (key: CaseKey): number[] => {
  const caso = CASES.find((c) => c.key === key)
  if (!caso) return []
  return (caso.secondary ?? caso.primary).values
}

export const CASOS: Caso[] = [
  {
    slug: 'bambu-coliving',
    cliente: 'Bambú Coliving',
    categoria: 'Coliving · Puente Aranda, Bogotá',
    resumen:
      'Tomamos la cuenta el día que nació y la llevamos desde cero seguidores. Un día de grabación al mes, doce piezas, y un reel que superó las cien mil vistas.',
    metricas: [
      { valor: '192.000', etiqueta: 'vistas', periodo: 'últimos 30 días' },
      { valor: '+3.419', etiqueta: 'seguidores', periodo: 'primeros 30 días, desde cero' },
      { valor: '8.996', etiqueta: 'interacciones', periodo: 'últimos 30 días' },
      { valor: '+100.000', etiqueta: 'vistas en un solo reel', periodo: 'una pieza' },
    ],
    notaPauta:
      'Resultados de contenido orgánico con apoyo puntual de pauta durante el periodo.',
    instagram: '@bambucoliving',
    serie: crecimiento('bambu'),
  },
  {
    slug: 'clandestine-pizza',
    cliente: 'Clandestine Pizza',
    categoria: 'Pizzería · Bogotá · 12 meses de trabajo',
    resumen:
      'Un año de contenido con un objetivo claro: construir una comunidad que votara por ellos en Pizza Master. La campaña se activó dentro del local, con los clientes.',
    metricas: [
      { valor: '1.100 → 3.000+', etiqueta: 'seguidores', periodo: '12 meses' },
      { valor: '2×', etiqueta: 'campeones Pizza Master', periodo: 'años consecutivos' },
      { valor: '12', etiqueta: 'meses de trabajo continuo', periodo: 'y contando' },
    ],
    // No venía en el brief. Se añade porque `lib/propuesta.ts` documenta que una
    // cuarta parte de ese crecimiento fue pauta, y la regla de arriba lo exige.
    notaPauta:
      'Tres cuartas partes del crecimiento fueron orgánicas. El resto, pauta dirigida sólo a piezas que ya funcionaban solas.',
    instagram: '@clandestinepizza',
    serie: crecimiento('clandestine'),
  },
]

type ValorAnimable =
  | { animable: false }
  | { animable: true; prefijo: string; numero: number; sufijo: string }

const SOLO_MILES = /^([+]?)(\d{1,3}(?:\.\d{3})*|\d+)(\D*)$/

/**
 * Decide si una métrica se puede contar de 0 al valor. Sólo las que son un
 * número limpio con separador de miles y, como mucho, un signo delante y un
 * símbolo detrás: '192.000', '+3.419', '2×'. Un valor como '1.100 → 3.000+'
 * son dos cifras y una flecha, así que se imprime tal cual.
 */
export const leerValor = (valor: string): ValorAnimable => {
  const m = SOLO_MILES.exec(valor.trim())
  if (!m) return { animable: false }
  const [, prefijo, digitos, sufijo] = m
  const numero = Number(digitos.replace(/\./g, ''))
  if (!Number.isFinite(numero)) return { animable: false }
  return { animable: true, prefijo, numero, sufijo }
}

const MILES = new Intl.NumberFormat('es-CO')

export const formatearMiles = (n: number) => MILES.format(n)
