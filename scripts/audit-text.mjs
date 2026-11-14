/* npm run audit:text [-- <rutas…>] [--lang=en]
   ACABADO §3 por cálculo: tamaño mínimo, ancho de línea (45–75 caracteres) y
   contraste AA de cada texto visible, más "el contenido termina antes del dock".
   Levanta vite preview sobre dist/, recorre las rutas a 1440 y 390 y imprime las
   violaciones y una tabla de contraste por ruta. Sale con código 1 si hay alguna. */
import { spawn } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 4313
const args = process.argv.slice(2)
const lang = (args.find((a) => a.startsWith('--lang=')) ?? '--lang=es').slice(7)
const paths = ['', '/about', '/projects', '/projects/candelaria', '/projects/candelaria-website', '/projects/licorimetro', '/projects/sensewave', '/projects/umbral', '/projects/bloom']
const routes = args.filter((a) => a.startsWith('/')).length ? args.filter((a) => a.startsWith('/')) : paths.map((p) => `/${lang}${p}`)
const VIEWPORTS = [
  { tag: '1440', width: 1440, height: 900 },
  { tag: '390', width: 390, height: 844 },
]

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH
  const base = join(homedir(), '.cache/ms-playwright')
  if (!existsSync(base)) return undefined
  for (const d of readdirSync(base).filter((x) => /^chromium-\d+$/.test(x)).sort().reverse()) {
    const p = join(base, d, 'chrome-linux64/chrome')
    if (existsSync(p)) return p
  }
}

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'ignore' })
process.on('exit', () => server.kill())
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(`http://localhost:${PORT}/es`)).ok) break
  } catch {
    // aún no responde
  }
  await new Promise((r) => setTimeout(r, 500))
}

/* Corre dentro de la página. */
function measure() {
  const cv = document.createElement('canvas')
  cv.width = cv.height = 1
  const cx = cv.getContext('2d', { willReadFrequently: true })
  const rgba = (css) => {
    cx.clearRect(0, 0, 1, 1)
    cx.fillStyle = 'rgba(0,0,0,0)'
    cx.fillStyle = css
    cx.fillRect(0, 0, 1, 1)
    const d = cx.getImageData(0, 0, 1, 1).data
    return [d[0], d[1], d[2], d[3] / 255]
  }
  const over = (top, bot) => {
    const a = top[3] + bot[3] * (1 - top[3])
    if (!a) return [0, 0, 0, 0]
    return [0, 1, 2].map((i) => (top[i] * top[3] + bot[i] * bot[3] * (1 - top[3])) / a).concat(a)
  }
  const lum = ([r, g, b]) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const ratio = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
    return (l1 + 0.05) / (l2 + 0.05)
  }
  const out = { small: [], width: [], contrast: [], overlap: [] }
  const seen = new Set()
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let n
  while ((n = walker.nextNode())) {
    const text = n.textContent.replace(/\s+/g, ' ').trim()
    if (!text) continue
    const el = n.parentElement
    if (!el || seen.has(el)) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue
    if (el.closest('[aria-hidden="true"],.sr-only,script,style,noscript,svg,canvas,[hidden]')) continue
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) continue
    if (cs.position === 'absolute' && /^rect\(/.test(cs.clip)) continue
    seen.add(el)
    const size = parseFloat(cs.fontSize)
    const label = el.tagName + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '')
    const sample = text.slice(0, 40)
    const upper = cs.textTransform === 'uppercase'
    const prose = text.length > 140
    // §3: etiquetas 12, secundario 14, cuerpo 16
    const min = prose ? 16 : upper ? 12 : 14
    if (size < min - 0.01) out.small.push({ label, size, min, sample })
    // ancho de línea: solo prosa (≥2 líneas)
    if (text.length > 200) {
      const lh = parseFloat(cs.lineHeight) || size * 1.5
      const lines = Math.round(r.height / lh)
      if (lines >= 3) {
        const perLine = Math.round(text.length / (lines - 0.5))
        // en 390 px un renglón de 16 px de Roboto Mono no llega a 45: el mínimo de 45 solo exige en columnas de cuerpo
        // tarjetas y columnas estrechas (<520 px) son texto secundario: sin mínimo; el máximo de 75 vale siempre
        const limited = r.width < 520 || r.width >= window.innerWidth - 140
        if ((perLine < 45 && !limited) || perLine > 75) out.width.push({ label, perLine, lines, sample })
      }
    }
    // contraste: fondo compuesto por los ancestros; foto debajo = peor caso (negro / blanco)
    let bg = [0, 0, 0, 0]
    let imageBg = false
    for (let a = el; a; a = a.parentElement) {
      const acs = getComputedStyle(a)
      if (acs.backgroundImage && acs.backgroundImage !== 'none') imageBg = true
      const c = rgba(acs.backgroundColor)
      if (c[3] > 0) bg = over(bg, c)
      if (bg[3] >= 0.999) break
    }
    const fg = rgba(cs.color)
    const worst = [[0, 0, 0, 1], [255, 255, 255, 1]].map((base) => {
      const b = over(bg, base)
      const f = over([fg[0], fg[1], fg[2], fg[3] * (+cs.opacity || 1)], b)
      return ratio(f, b)
    })
    const cr = Math.min(...worst)
    const large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700)
    const need = large ? 3 : 4.5
    out.contrast.push({ label, cr: +cr.toFixed(2), need, size, sample, imageBg, direct: bg[3] >= 0.999 })
  }
  // el contenido termina antes del dock
  const dock = document.querySelector('.dock__list')
  const main = document.querySelector('.shell__main')
  if (dock && main) {
    for (let i = 0; i < 3; i++) window.scrollTo(0, document.documentElement.scrollHeight)
    const dTop = dock.getBoundingClientRect().top
    let lowest = 0
    let who = ''
    for (const c of main.querySelectorAll('*')) {
      const cr = c.getBoundingClientRect()
      if (!cr.width || !cr.height || cr.top >= window.innerHeight) continue
      const cs = getComputedStyle(c)
      if (cs.position === 'fixed' || cs.visibility === 'hidden') continue
      // lo que un contenedor con overflow recorta no cuenta
      let bottom = cr.bottom
      for (let a = c.parentElement; a && a !== main; a = a.parentElement) {
        if (getComputedStyle(a).overflowY !== 'visible') bottom = Math.min(bottom, a.getBoundingClientRect().bottom)
      }
      if ((c.children.length === 0 || c.tagName === 'IMG') && bottom > lowest) {
        lowest = bottom
        who = c.tagName + '.' + String(c.className).slice(0, 40)
      }
    }
    if (lowest > dTop) out.overlap.push({ lowest: Math.round(lowest), dockTop: Math.round(dTop), who })
    window.scrollTo(0, 0)
  }
  return out
}

const browser = await chromium.launch({ executablePath: findChrome(), args: ['--use-angle=gl-egl', '--use-gl=angle', '--ignore-gpu-blocklist'] })
let fails = 0
const rows = []
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' })
  for (const route of routes) {
    const page = await ctx.newPage()
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)
    const h = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < h; y += 700) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y)
      await page.waitForTimeout(80)
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(300)
    const r = await page.evaluate(measure)
    const bad = r.contrast.filter((c) => c.cr < c.need)
    const min = r.contrast.reduce((m, c) => (c.cr - c.need < m.cr - m.need ? c : m), r.contrast[0] ?? { cr: 0, need: 0 })
    rows.push({ vp: vp.tag, route, texts: r.contrast.length, min: min.cr, need: min.need, at: min.sample, bad: bad.length, small: r.small.length, width: r.width.length, overlap: r.overlap.length })
    const tag = `${vp.tag} ${route}`
    for (const s of r.small) console.log(`TAMAÑO   ${tag}  ${s.size}px < ${s.min}px  ${s.label}  "${s.sample}"`)
    for (const w of r.width) console.log(`ANCHO    ${tag}  ${w.perLine} car/línea (${w.lines} líneas)  ${w.label}  "${w.sample}"`)
    for (const c of bad) console.log(`CONTRASTE ${tag}  ${c.cr}:1 < ${c.need}  ${c.label}  "${c.sample}"${c.imageBg ? ' (sobre imagen)' : ''}`)
    for (const o of r.overlap) console.log(`DOCK     ${tag}  contenido llega a ${o.lowest}px, el dock empieza en ${o.dockTop}px (${o.who})`)
    fails += bad.length + r.small.length + r.width.length + r.overlap.length
    await page.close()
  }
  await ctx.close()
}
await browser.close()
server.kill()
console.log('\nvp    ruta                                textos  contraste mín  (req)  fallos(c/t/a/d)   peor')
for (const r of rows) {
  console.log(
    `${r.vp.padEnd(5)} ${r.route.padEnd(36)}${String(r.texts).padStart(5)}  ${String(r.min).padStart(10)}:1  ${String(r.need).padStart(5)}  ${r.bad}/${r.small}/${r.width}/${r.overlap}`.padEnd(100) + `  "${r.at}"`,
  )
}
console.log(fails ? `\naudit:text: ${fails} violaciones` : '\naudit:text: ok')
process.exit(fails ? 1 : 0)
