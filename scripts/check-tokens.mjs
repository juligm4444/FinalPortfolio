/* npm run check:tokens — ACABADO §2: cero hex fuera de src/styles/index.css.
   Falla si encuentra #rgb / #rrggbb / #rrggbbaa en JS, JSX, CSS, HTML o la
   config de Tailwind. Excepciones por nombre: la paleta que un caso documenta
   como información (src/data/swatches.js). Los 0xRRGGBB de canvas WebGL no son
   hex CSS y no se revisan. */
import { readdir, readFile } from 'node:fs/promises'
import { resolve, relative, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ALLOW = new Set(['src/styles/index.css', 'src/data/swatches.js'])
const EXT = /\.(jsx?|css|html)$/
const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) yield* walk(p)
    else if (EXT.test(e.name)) yield p
  }
}

const files = [resolve(root, 'index.html'), resolve(root, 'tailwind.config.js')]
for await (const f of walk(resolve(root, 'src'))) files.push(f)

let bad = 0
for (const f of files) {
  const rel = relative(root, f)
  if (ALLOW.has(rel)) continue
  const lines = (await readFile(f, 'utf8')).split('\n')
  lines.forEach((line, i) => {
    // `#` de anclas y selectores: solo cuenta si parece un color y no es un id/href
    for (const m of line.matchAll(HEX)) {
      const before = line.slice(Math.max(0, m.index - 6), m.index)
      if (/href=["']?$|to=["']?$|url\(["']?$/.test(before)) continue
      if (/^#(?:main|root)$/.test(m[0])) continue
      console.error(`${rel}:${i + 1}  ${m[0]}`)
      bad++
    }
  })
}
if (bad) {
  console.error(`\ncheck:tokens: ${bad} hex fuera de src/styles/index.css`)
  process.exit(1)
}
console.log('check:tokens: ok')
