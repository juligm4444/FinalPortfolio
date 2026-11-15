/* npm run check:contrast — contraste por cálculo, no a ojo (V4 §1 paleta).
   Pares de tokens contra AA 4.5:1: texto sobre muro (losa con textura), énfasis
   bloom-ink, etiquetas en el pelo de los botones y blanco de los íconos de pelo.
   El texto ya no pisa la escena salvo en el hero; ese caso se mide sobre la
   captura en scripts/check-hero-contrast.mjs. */
import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const css = await readFile(resolve(root, 'src/styles/index.css'), 'utf8')
const token = (name) => {
  const m = new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(css)
  if (!m) throw new Error(`token --${name} no encontrado`)
  return [1, 3, 5].map((i) => parseInt(m[1].slice(i, i + 2), 16))
}
const lin = (c) => {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const T = Object.fromEntries(
  ['mist', 'white', 'concrete-100', 'concrete-300', 'concrete-500', 'concrete-900', 'moss-200', 'moss-700', 'bloom-ink'].map((n) => [n, token(n)])
)
// The concrete texture multiplies the slab; its mean is ~0.96 (make-concrete reports it).
const TEXTURE_MEAN = JSON.parse(await readFile(resolve(root, 'src/assets/textures/concrete.json'), 'utf8')).mean
const slab = T['concrete-100'].map((c) => c * TEXTURE_MEAN)

let bad = 0
const check = (label, fg, bg, min = 4.5) => {
  const r = ratio(fg, bg)
  const ok = r >= min
  if (!ok) bad++
  console.log(`${ok ? 'ok ' : 'MAL'} ${r.toFixed(2).padStart(5)}  ${label}`)
}
console.log('— tokens —')
check('concrete-900 sobre mist', T['concrete-900'], T.mist)
check('concrete-500 sobre mist', T['concrete-500'], T.mist)
check('moss-700 sobre mist', T['moss-700'], T.mist)
check('bloom-ink sobre mist', T['bloom-ink'], T.mist)
check('concrete-900 sobre losa', T['concrete-900'], T['concrete-100'])
check('concrete-500 sobre losa', T['concrete-500'], T['concrete-100'])
check('moss-700 sobre losa', T['moss-700'], T['concrete-100'])
check('concrete-900 sobre losa con textura (media)', T['concrete-900'], slab)
check('concrete-500 sobre losa con textura (media)', T['concrete-500'], slab)
check('concrete-900 sobre moss-200 (Mohair)', T['concrete-900'], T['moss-200'])
check('bloom-ink sobre losa (énfasis del relato)', T['bloom-ink'], T['concrete-100'])
check('bloom-ink sobre losa con textura (media)', T['bloom-ink'], slab)
check('white sobre moss-700 (íconos de pelo)', T.white, T['moss-700'])
check('mist sobre moss-700 (Velour, Plush)', T.mist, T['moss-700'])

if (bad) {
  console.error(`\ncheck:contrast: ${bad} par(es) bajo 4.5:1`)
  process.exit(1)
}
console.log('check:contrast: ok')
