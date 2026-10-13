export type Punto = [number, number]

/**
 * Catmull-Rom → Bézier cúbica: la curva pasa exactamente por cada punto en vez
 * de aproximarlo. Lo usan la gráfica de la propuesta y la curva de fondo de la
 * home, así que vive aquí y no dentro de un componente.
 */
export function suavizar(p: Punto[]): string {
  if (p.length === 0) return ''
  let d = `M${p[0][0]},${p[0][1]}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`
  }
  return d
}
