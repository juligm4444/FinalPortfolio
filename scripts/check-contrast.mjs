/* npm run check:contrast — V3 §A.1 y §B.2: contraste por cálculo, no a ojo.
   1. Pares de tokens (texto sobre niebla y sobre losa) contra AA 4.5:1.
   2. Peor caso de la niebla: texto --concrete-500 sobre el punto más oscuro de
      cada fondo de ruta ya atenuado (opacidad FOG_FLOOR sobre --mist).
   Lee los tokens de src/styles/index.css y FOG_FLOOR de RouteBackground.jsx. */
import { readFile } from 'node:fs/promises'
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve, dirname, join } from 'node:path'
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
const mix = (top, under, a) => top.map((c, i) => c * a + under[i] * (1 - a))

const T = Object.fromEntries(
  ['mist', 'concrete-100', 'concrete-300', 'concrete-500', 'concrete-900', 'moss-700', 'lichen-300', 'bloom-ink'].map((n) => [n, token(n)])
)
// The concrete texture multiplies the slab; its mean is ~0.96 (make-concrete reports it).
const TEXTURE_MEAN = 0.96
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
check('concrete-900 sobre lichen-300 (Mohair)', T['concrete-900'], T['lichen-300'])
check('mist sobre moss-700 (Velour, Plush)', T.mist, T['moss-700'])

// ---- fog: darkest point of each route background at its floor opacity ----
const rb = resolve(root, 'src/components/shell/RouteBackground.jsx')
const src = existsSync(rb) ? await readFile(rb, 'utf8') : ''
const floor = /export const FOG_FLOOR = ([0-9.]+)/.exec(src)
const pageTop = /export const FOG_PAGE_TOP = ([0-9.]+)/.exec(src)
if (floor) {
  const FOG_FLOOR = parseFloat(floor[1])
  const FOG_PAGE_TOP = pageTop ? parseFloat(pageTop[1]) : FOG_FLOOR
  const { chromium } = await import('playwright-core')
  const base = join(homedir(), '.cache/ms-playwright')
  const dir = existsSync(base) ? readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse()[0] : null
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? (dir ? join(base, dir, 'chrome-linux64/chrome') : undefined) })
  const page = await browser.newPage()
  console.log(`— niebla: fondo al ${Math.round(FOG_FLOOR * 100)} % sobre mist, texto concrete-500 —`)
  for (const name of ['home', 'about', 'projects']) {
    const file = resolve(root, `src/assets/backgrounds/bg-${name}.webp`)
    const url = 'data:image/webp;base64,' + (await readFile(file)).toString('base64')
    const darkest = await page.evaluate(async (u) => {
      const img = new Image()
      img.src = u
      await img.decode()
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      const ctx = c.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const d = ctx.getImageData(0, 0, c.width, c.height).data
      let best = null
      let bestL = Infinity
      for (let i = 0; i < d.length; i += 4) {
        const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]
        if (l < bestL) {
          bestL = l
          best = [d[i], d[i + 1], d[i + 2]]
        }
      }
      return best
    }, url)
    const worst = mix(darkest, T.mist, FOG_FLOOR)
    check(`${name} al ${FOG_FLOOR * 100} %: píxel más oscuro rgb(${darkest.join(',')}) → rgb(${worst.map(Math.round).join(',')})`, T['concrete-500'], worst)
    // Pages without a hero start at FOG_PAGE_TOP with text in their first screen.
    if (name !== 'home') {
      const top = mix(darkest, T.mist, FOG_PAGE_TOP)
      check(`${name} al ${FOG_PAGE_TOP * 100} % (primera pantalla): → rgb(${top.map(Math.round).join(',')})`, T['concrete-500'], top)
    }
  }
  await browser.close()
}
if (bad) {
  console.error(`\ncheck:contrast: ${bad} par(es) bajo 4.5:1`)
  process.exit(1)
}
console.log('check:contrast: ok')
