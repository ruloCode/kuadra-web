import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
const BASE_HEADERS = {
  'User-Agent': UA,
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
}
let COOKIE = ''

async function getHtml(url, depth = 0) {
  const res = await fetch(url, { headers: { ...BASE_HEADERS, ...(COOKIE ? { Cookie: COOKIE } : {}) }, redirect: 'follow' })
  const text = await res.text()
  const m = text.match(/js_challenge_value=([a-f0-9]+)/)
  if (m && depth < 3) {
    COOKIE = `js_challenge_value=${m[1]}`
    console.log('  ↻ challenge solved, retrying')
    await new Promise(r => setTimeout(r, 400))
    return getHtml(url, depth + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return text
}

const TARGETS = [
  { id: '169101925', slug: 'yum', url: 'https://www.behance.net/gallery/169101925/YUM-Digital-Marketing-Campaign' },
  { id: '168084613', slug: 'la-tdc', url: 'https://www.behance.net/gallery/168084613/La-TDC-Photography-Video-and-Desing' },
  { id: '134450951', slug: 'deporte', url: 'https://www.behance.net/gallery/134450951/FOTOGRAFIA-Y-VIDEOS-DE-DEPORTE' },
  { id: '252460809', slug: 'fxa-moda', url: 'https://www.behance.net/gallery/252460809/SESION-DE-FOTOS-MODA-(FXA)' },
  { id: '144473091', slug: 'kevin-florez', url: 'https://www.behance.net/gallery/144473091/Concierto-Kevin-Florez' },
]

const OUT = process.argv[2] || './out'

function meta(html, prop) {
  const re = new RegExp(`<meta[^>]*(?:property|name)=['"]${prop}['"][^>]*content=['"]([^'"]*)['"]`, 'i')
  const m = html.match(re)
  if (m) return m[1]
  const re2 = new RegExp(`<meta[^>]*content=['"]([^'"]*)['"][^>]*(?:property|name)=['"]${prop}['"]`, 'i')
  const m2 = html.match(re2)
  return m2 ? m2[1] : null
}

function decodeEnt(s) {
  if (!s) return s
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
}

// Pull every distinct project_modules asset, keeping the largest available variant per asset id.
function extractImages(html, projectId) {
  const rx = /https:\/\/mir-s3-cdn-cf\.behance\.net\/project_modules\/([a-z0-9_]+)\/([a-z0-9]+)(\d{9})\.([a-z0-9]+)\.(jpg|jpeg|png|gif)/gi
  const byAsset = new Map()
  const rank = (size) => {
    if (size.startsWith('max_3840')) return 100
    if (size.startsWith('max_1200')) return 80
    if (size.startsWith('2800')) return 90
    if (size.startsWith('1400')) return 70
    if (size.startsWith('disp')) return 60
    const n = parseInt(size, 10)
    return Number.isFinite(n) ? Math.min(n / 100, 50) : 10
  }
  let m
  while ((m = rx.exec(html))) {
    const [url, size, prefix, pid, hash, ext] = m
    if (pid !== projectId) continue
    const key = `${prefix}.${hash}`
    const score = rank(size) + (size.includes('_webp') ? 1 : 0)
    const prev = byAsset.get(key)
    if (!prev || score > prev.score) byAsset.set(key, { url, score, ext, size, key })
  }
  // Preserve document order of first appearance
  const order = []
  const seen = new Set()
  const rx2 = /project_modules\/[a-z0-9_]+\/([a-z0-9]+)(\d{9})\.([a-z0-9]+)\./gi
  let m2
  while ((m2 = rx2.exec(html))) {
    if (m2[2] !== projectId) continue
    const key = `${m2[1]}.${m2[3]}`
    if (!seen.has(key) && byAsset.has(key)) { seen.add(key); order.push(byAsset.get(key)) }
  }
  return order
}

function extractVideos(html) {
  const set = new Set()
  const rx = /https:\/\/[^"'\\\s]+\.(?:mp4|m3u8)(?:\?[^"'\\\s]*)?/gi
  let m
  while ((m = rx.exec(html))) set.add(decodeEnt(m[0].replace(/\\u002F/g, '/')))
  return [...set]
}

async function download(url, dest) {
  if (existsSync(dest)) return 'cached'
  const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://www.behance.net/' } })
  if (!res.ok) return `HTTP ${res.status}`
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(dest, buf)
  return buf.length
}

const manifest = []
for (const t of TARGETS) {
  console.log(`\n▶ ${t.slug} (${t.id})`)
  let html
  try { html = await getHtml(t.url) } catch (e) { console.log('  ✖', e.message); continue }
  const title = decodeEnt(meta(html, 'og:title')) || t.slug
  const description = decodeEnt(meta(html, 'og:description')) || ''
  const cover = meta(html, 'og:image')
  const imgs = extractImages(html, t.id)
  const vids = extractVideos(html)
  console.log(`  title: ${title}`)
  console.log(`  images: ${imgs.length}  videos: ${vids.length}`)

  const dir = path.join(OUT, t.slug)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, '_page.html'), html)

  const files = []
  let i = 0
  for (const img of imgs) {
    i++
    const ext = img.url.includes('_webp') ? 'webp' : img.ext
    const name = `${String(i).padStart(2, '0')}-${img.key}.${ext}`
    const dest = path.join(dir, name)
    const r = await download(img.url, dest)
    console.log(`    ${name}  ${typeof r === 'number' ? (r / 1024).toFixed(0) + 'kb' : r}  [${img.size}]`)
    files.push({ name, src: img.url, variant: img.size, bytes: typeof r === 'number' ? r : null })
  }
  manifest.push({ ...t, title, description, cover, videos: vids, files })
}

await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log('\n✔ manifest written')
console.log(manifest.map(p => `${p.slug}: ${p.files.length} files, ${p.videos.length} videos`).join('\n'))
