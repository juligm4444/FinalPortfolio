/* npm run make:concrete — V3 §A.2
   Genera src/assets/textures/concrete.webp: una textura repetible de concreto
   (ruido fino, poros dispersos, vetas horizontales tenues de encofrado), en
   grises claros para usarse en `multiply` sobre --concrete-100.
   Sin red: todo se dibuja con un generador con semilla. El Chrome local de
   Playwright solo hace de codificador WebP. Falla si el archivo pasa de 60 KB. */
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(root, 'src/assets/textures/concrete.webp')
const SIZE = 512
const MAX_BYTES = 60 * 1024

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH
  const base = join(homedir(), '.cache/ms-playwright')
  if (!existsSync(base)) return undefined
  const dirs = readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse()
  for (const d of dirs) {
    const p = join(base, d, 'chrome-linux64/chrome')
    if (existsSync(p)) return p
  }
}

/* Runs inside the page. Everything wraps at SIZE, so the tile repeats with no seam. */
function paint(SIZE, quality) {
  let s = 20261114
  const rnd = () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  // Periodic value noise: a lattice of `cells` × `cells` random values, wrapped.
  const lattice = (cells) => {
    const g = new Float32Array(cells * cells)
    for (let i = 0; i < g.length; i++) g[i] = rnd()
    return (x, y) => {
      const fx = (x / SIZE) * cells
      const fy = (y / SIZE) * cells
      const x0 = Math.floor(fx)
      const y0 = Math.floor(fy)
      const tx = fx - x0
      const ty = fy - y0
      const sx = tx * tx * (3 - 2 * tx)
      const sy = ty * ty * (3 - 2 * ty)
      const at = (i, j) => g[(((j % cells) + cells) % cells) * cells + (((i % cells) + cells) % cells)]
      const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * sx
      const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * sx
      return a + (b - a) * sy
    }
  }
  const cloud = [lattice(4), lattice(9), lattice(23)]
  const fine = lattice(128)
  // Formwork: faint horizontal boards. Each board has its own tone and a soft joint.
  const boards = 3
  const boardTone = Array.from({ length: boards }, () => rnd())
  const grainY = lattice(64)

  const v = new Float32Array(SIZE * SIZE)
  for (let y = 0; y < SIZE; y++) {
    const by = (y / SIZE) * boards
    const bi = Math.floor(by)
    const bf = by - bi
    const joint = Math.exp(-Math.pow(Math.min(bf, 1 - bf) * 46, 2)) // dark line at the seam
    for (let x = 0; x < SIZE; x++) {
      let t = 0.99
      t += (cloud[0](x, y) - 0.5) * 0.035 + (cloud[1](x, y) - 0.5) * 0.03 + (cloud[2](x, y) - 0.5) * 0.025
      t += (fine(x, y) - 0.5) * 0.03 + (rnd() - 0.5) * 0.028
      // streaks along the board: stretched 12× in x
      t += (grainY(x / 12, y * 3) - 0.5) * 0.022
      t += (boardTone[bi] - 0.5) * 0.02
      t -= joint * 0.05
      v[y * SIZE + x] = t
    }
  }
  // Pores: scattered small pits, a few larger ones, with a lit lower lip.
  const pores = 420
  for (let i = 0; i < pores; i++) {
    const cx = rnd() * SIZE
    const cy = rnd() * SIZE
    const big = rnd() < 0.08
    const r = big ? 1.8 + rnd() * 2.2 : 0.5 + rnd() * 1.0
    const depth = big ? 0.2 + rnd() * 0.12 : 0.1 + rnd() * 0.14
    const R = Math.ceil(r + 2)
    for (let dy = -R; dy <= R; dy++)
      for (let dx = -R; dx <= R; dx++) {
        const d = Math.hypot(dx, dy * 1.25)
        const x = (((Math.round(cx) + dx) % SIZE) + SIZE) % SIZE
        const y = (((Math.round(cy) + dy) % SIZE) + SIZE) % SIZE
        const k = Math.max(0, 1 - d / r)
        v[y * SIZE + x] -= depth * k * k
        if (dy > 0 && d > r && d < r + 1.2) v[y * SIZE + x] += 0.018
      }
  }
  const c = document.createElement('canvas')
  c.width = c.height = SIZE
  const ctx = c.getContext('2d')
  const img = ctx.createImageData(SIZE, SIZE)
  let sum = 0
  let min = 1
  for (let i = 0; i < v.length; i++) {
    const t = Math.max(0.7, Math.min(1, v[i]))
    sum += t
    if (t < min) min = t
    const g = Math.round(t * 255)
    img.data[i * 4] = g
    img.data[i * 4 + 1] = g
    img.data[i * 4 + 2] = g
    img.data[i * 4 + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  return { url: c.toDataURL('image/webp', quality), mean: sum / v.length, min }
}

const browser = await chromium.launch({ executablePath: findChrome() })
const page = await browser.newPage()
let out = null
for (const q of [0.95, 0.9, 0.82, 0.72, 0.6, 0.45]) {
  const r = await page.evaluate(([S, qq, src]) => new Function(`return (${src})`)()(S, qq), [SIZE, q, paint.toString()])
  const buf = Buffer.from(r.url.split(',')[1], 'base64')
  out = { buf, q, mean: r.mean, min: r.min }
  if (buf.length < MAX_BYTES) break
}
await browser.close()
if (out.buf.length >= MAX_BYTES) {
  console.error(`make:concrete: ${out.buf.length} bytes, sobre el límite de ${MAX_BYTES}`)
  process.exit(1)
}
await mkdir(dirname(OUT), { recursive: true })
await writeFile(OUT, out.buf)
// the mean tone, read by check-contrast (text sits on this texture multiplied into the slab)
await writeFile(OUT.replace(/\.webp$/, '.json'), JSON.stringify({ mean: Number(out.mean.toFixed(4)), min: Number(out.min.toFixed(4)) }) + '\n')
console.log(
  `make:concrete: ${SIZE}×${SIZE}, ${(out.buf.length / 1024).toFixed(1)} KB (q=${out.q}), media ${out.mean.toFixed(3)}, mínimo ${out.min.toFixed(2)} → src/assets/textures/concrete.webp`
)
