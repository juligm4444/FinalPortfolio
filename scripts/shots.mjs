/* npm run shots [-- <rutas…>] [--out=<dir>]
   Levanta `vite preview` sobre dist/ y captura cada ruta a 1440×900 y 390×844:
   primera pantalla (fold), mitad de página (mid) y página completa. Sale en shots/<out|actual>/.
   Rutas por defecto: las 10 páginas, en /es (--both: también /en). Ejemplo: npm run shots -- /es/about --out=antes */
import { spawn } from 'node:child_process'
import { mkdir, rm } from 'node:fs/promises'
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 4311
const DEFAULT = [
  '/es', '/es/about', '/es/projects', '/es/toolkit',
  '/es/projects/candelaria', '/es/projects/candelaria-website', '/es/projects/licorimetro',
  '/es/projects/sensewave', '/es/projects/umbral', '/es/projects/bloom',
]
const args = process.argv.slice(2)
const outName = (args.find((a) => a.startsWith('--out=')) ?? '--out=actual').slice(6)
const routes = args.filter((a) => a.startsWith('/'))
const both = args.includes('--both')
const list = routes.length ? routes : both ? [...DEFAULT, ...DEFAULT.map((r) => r.replace(/^\/es/, '/en'))] : DEFAULT
// V4 §B.5: --sizes=all → the eight sizes; default the two everyday ones. --sizes=390x844,1920x1080 picks.
const SIZES_ALL = ['390x844', '768x1024', '1024x768', '1366x768', '1440x900', '1920x1080', '2560x1440', '3440x1440']
const sizesArg = (args.find((a) => a.startsWith('--sizes=')) ?? '--sizes=390x844,1440x900').slice(8)
const VIEWPORTS = (sizesArg === 'all' ? SIZES_ALL : sizesArg.split(',')).map((s) => {
  const [width, height] = s.split('x').map(Number)
  return { tag: String(width === 390 || width === 1440 ? width : `${width}x${height}`), width, height }
})

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

const out = resolve(root, 'shots', outName)
await rm(out, { recursive: true, force: true })
await mkdir(out, { recursive: true })

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: root,
  stdio: 'ignore',
})
const stop = () => server.kill()
process.on('exit', stop)

for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(`http://localhost:${PORT}/es`)).ok) break
  } catch {
    // aún no responde
  }
  await new Promise((r) => setTimeout(r, 500))
  if (i === 59) throw new Error('preview no arrancó; ¿corriste npm run build?')
}

const browser = await chromium.launch({
  executablePath: findChrome(),
  args: ['--use-angle=gl-egl', '--use-gl=angle', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'],
})
let n = 0
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  for (const route of list) {
    const page = await ctx.newPage()
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    const name = (route.replace(/^\/(es|en)\/?/, (m, l) => l + '-').replace(/\/$/, '').replace(/\//g, '-') || 'root').replace(/-$/, '')
    await page.screenshot({ path: join(out, `${name}__${vp.tag}__fold.png`) })
    // mitad de página: donde el dock, la nav y el texto se encaraman con el contenido
    const total = await page.evaluate(() => document.documentElement.scrollHeight)
    await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, total / 2 - vp.height / 2))
    await page.waitForTimeout(900)
    await page.screenshot({ path: join(out, `${name}__${vp.tag}__mid.png`) })
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(200)
    // recorre la página para disparar los Reveal y la enredadera antes de la captura completa
    const h = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < h; y += vp.height * 0.8) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y)
      await page.waitForTimeout(120)
    }
    // se queda abajo: la enredadera y los Reveal ya están dibujados al capturar
    await page.waitForTimeout(500)
    await page.screenshot({ path: join(out, `${name}__${vp.tag}__full.png`), fullPage: true })
    n += 3
    await page.close()
  }
  await ctx.close()
}
await browser.close()
stop()
console.log(`shots: ${n} capturas en shots/${outName}/`)
process.exit(0)
