/* npm run shots [-- <rutas…>] [--out=<dir>]
   Levanta `vite preview` sobre dist/ y captura cada ruta a 1440×900 y 390×844:
   primera pantalla (fold) y página completa. Sale en shots/<out|actual>/.
   Rutas por defecto: las 9 de ACABADO §8, en /es. Ejemplo: npm run shots -- /es/about --out=antes */
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
  '/es', '/es/about', '/es/projects',
  '/es/projects/candelaria', '/es/projects/candelaria-website', '/es/projects/licorimetro',
  '/es/projects/sensewave', '/es/projects/umbral', '/es/projects/bloom',
]
const args = process.argv.slice(2)
const outName = (args.find((a) => a.startsWith('--out=')) ?? '--out=actual').slice(6)
const routes = args.filter((a) => a.startsWith('/'))
const list = routes.length ? routes : DEFAULT
const VIEWPORTS = [
  { tag: '1440', width: 1440, height: 900 },
  { tag: '390', width: 390, height: 844 },
]

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
    // dispara los Reveal de scroll y vuelve arriba antes de la página completa
    const h = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < h; y += vp.height * 0.8) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y)
      await page.waitForTimeout(120)
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
    await page.screenshot({ path: join(out, `${name}__${vp.tag}__full.png`), fullPage: true })
    n += 2
    await page.close()
  }
  await ctx.close()
}
await browser.close()
stop()
console.log(`shots: ${n} capturas en shots/${outName}/`)
process.exit(0)
