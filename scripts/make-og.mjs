/**
 * Renders an Open Graph card (1200x630) from an HTML template in public/.
 *
 * The card is drawn in a real browser rather than composited with sharp so it
 * gets the actual Archivo Black / Space Grotesk webfonts — librsvg has no
 * access to them. Captured at 2x and downsampled for crisp type.
 *
 *   1. npm run start   (the card loads its assets from the running server)
 *   2. node scripts/make-og.mjs                       # home card
 *      node scripts/make-og.mjs --in /_og-propuesta.html \
 *        --out app/propuesta/nativos-para-nativos     # proposal card
 *
 * Writes opengraph-image.png and twitter-image.png into --out (default: app/).
 *
 * Needs playwright available; it is not a project dependency, so pass a path to
 * an install via PLAYWRIGHT_PATH if `import('playwright')` fails. Set
 * PLAYWRIGHT_CHANNEL=chrome to use the system Chrome instead of a bundled build.
 */
import sharp from 'sharp'
import { createRequire } from 'node:module'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const ORIGIN = process.env.OG_ORIGIN ?? 'http://localhost:4321'
const require = createRequire(import.meta.url)

const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag)
  return i === -1 ? fallback : process.argv[i + 1]
}
const IN = arg('--in', '/_og.html')
const OUT = arg('--out', 'app')

let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  const p = process.env.PLAYWRIGHT_PATH
  if (!p) throw new Error('playwright not found — set PLAYWRIGHT_PATH to an install')
  ;({ chromium } = require(p))
}

const b = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL })
const page = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 })
await page.goto(`${ORIGIN}${IN}`, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1500)
const shot = await page.screenshot()
await b.close()

const out = await sharp(shot).resize(1200, 630).png({ compressionLevel: 9 }).toBuffer()
await mkdir(OUT, { recursive: true })
await sharp(out).toFile(path.join(OUT, 'opengraph-image.png'))
await sharp(out).toFile(path.join(OUT, 'twitter-image.png'))
console.log(`og written to ${OUT} from ${IN} — ${(out.length / 1024).toFixed(0)}kb`)
