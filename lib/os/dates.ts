const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const MONTHS_SHORT = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
]

/** Fecha ISO `YYYY-MM-DD` a partir de sus partes, sin pasar por Date. */
export function iso(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/** Hoy en la zona del servidor, como `YYYY-MM-DD`. */
export function today(): string {
  const n = new Date()
  return iso(n.getFullYear(), n.getMonth() + 1, n.getDate())
}

export const monthName = (m: number) => MONTHS[m - 1]

/** `2026-09-14` → `14 sep`. */
export function shortDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '—'
  const [, m, d] = isoDate.split('-')
  return `${Number(d)} ${MONTHS_SHORT[Number(m) - 1]}`
}

/** `2026-09` → `sep 26`. */
export function shortMonth(ym: string): string {
  const [y, m] = ym.split('-')
  return `${MONTHS_SHORT[Number(m) - 1]} ${y.slice(2)}`
}

export type Cell = { date: string; day: number; otherMonth: boolean }

/**
 * Las 42 celdas del calendario, empezando en lunes. Devuelve también el rango
 * completo para poder pedirle a Postgres sólo las piezas visibles: los días de
 * los meses vecinos que asoman en la rejilla cuentan.
 */
export function monthGrid(y: number, m: number): { cells: Cell[]; from: string; to: string } {
  const first = new Date(y, m - 1, 1)
  const start = (first.getDay() + 6) % 7 // lunes = 0
  const days = new Date(y, m, 0).getDate()
  const prevDays = new Date(y, m - 1, 0).getDate()

  const cells: Cell[] = []
  for (let i = 0; i < 42; i++) {
    let day: number
    let yy = y
    let mm = m
    let otherMonth = false

    if (i < start) {
      day = prevDays - start + i + 1
      otherMonth = true
      mm = m - 1
      if (mm < 1) { mm = 12; yy-- }
    } else if (i - start < days) {
      day = i - start + 1
    } else {
      day = i - start - days + 1
      otherMonth = true
      mm = m + 1
      if (mm > 12) { mm = 1; yy++ }
    }
    cells.push({ date: iso(yy, mm, day), day, otherMonth })
  }

  return { cells, from: cells[0].date, to: cells[41].date }
}

/** Lee `2026-09` de la URL; si no viene o es basura, cae en el mes actual. */
export function parseMonth(value: string | undefined): { y: number; m: number } {
  const match = value?.match(/^(\d{4})-(\d{2})$/)
  if (match) {
    const y = Number(match[1])
    const m = Number(match[2])
    if (m >= 1 && m <= 12) return { y, m }
  }
  const n = new Date()
  return { y: n.getFullYear(), m: n.getMonth() + 1 }
}

export const monthParam = (y: number, m: number) => `${y}-${String(m).padStart(2, '0')}`

export function shiftMonth(y: number, m: number, delta: number) {
  const d = new Date(y, m - 1 + delta, 1)
  return { y: d.getFullYear(), m: d.getMonth() + 1 }
}
