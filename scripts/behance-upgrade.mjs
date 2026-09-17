import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
const OUT = './out'
const manifest = JSON.parse(await readFile(path.join(OUT, 'manifest.json'), 'utf8'))
const H = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36', Referer: 'https://www.behance.net/' }

const MASTERS = './masters'
await mkdir(MASTERS, { recursive: true })

let ok = 0, fail = 0
for (const p of manifest) {
  await mkdir(path.join(MASTERS, p.slug), { recursive: true })
  const jobs = p.files.map(async (f) => {
    // rebuild URL at max_1200_webp regardless of the variant originally found
    const m = f.src.match(/project_modules\/[a-z0-9_]+\/(.+)$/)
    if (!m) return
    const url = `https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/${m[1]}`
    const base = f.name.replace(/\.(webp|jpg|jpeg|png|gif)$/i, '')
    const dest = path.join(MASTERS, p.slug, `${base}.webp`)
    try {
      const res = await fetch(url, { headers: H, redirect: 'follow' })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const buf = Buffer.from(await res.arrayBuffer())
      await writeFile(dest, buf)
      f.master = path.relative('.', dest); f.masterBytes = buf.length
      ok++
    } catch (e) { console.log('  ✖', p.slug, base, e.message); fail++ }
  })
  // modest concurrency
  for (let i = 0; i < jobs.length; i += 6) await Promise.all(jobs.slice(i, i + 6))
  console.log(`✔ ${p.slug}: ${p.files.length}`)
}
await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log(`\ndone ok=${ok} fail=${fail}`)
