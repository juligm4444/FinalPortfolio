/* npm run states — V3 §J: captures of the interactive states and the numbers of
   the report. Needs `npm run build`. Writes to shots/v3-j/:
   - titulo-hover, mohair-hover, loseta-hover, herbario-hover, enredadera-50
   - contextos.json: live WebGL contexts per route (at rest after load, and the
     most seen while hovering a heading and a fur piece)
   - peso-home.json: bytes transferred loading /es */
import { spawn } from 'node:child_process'
import { existsSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright-core'

const PORT = 4318
const OUT = 'shots/v3-j'
mkdirSync(OUT, { recursive: true })
const base = join(homedir(), '.cache/ms-playwright')
const dir = existsSync(base) ? readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse()[0] : null
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
process.on('exit', () => server.kill())
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(`http://localhost:${PORT}/es`)).ok) break
  } catch {
    // not yet
  }
  await new Promise((r) => setTimeout(r, 400))
}
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? (dir ? join(base, dir, 'chrome-linux64/chrome') : undefined),
  args: ['--use-angle=gl-egl', '--use-gl=angle', '--ignore-gpu-blocklist'],
})
const url = (r) => `http://localhost:${PORT}${r}`

// Counts contexts that exist and are not lost, wherever they live (on-screen or off).
const COUNTER = () => {
  window.__gl = new Set()
  const orig = HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext = function (t, o) {
    const c = orig.call(this, t, o)
    if (c && /webgl/.test(t)) window.__gl.add(c)
    return c
  }
  window.__live = () => [...window.__gl].filter((g) => !g.isContextLost()).length
}

async function open(route, vp = { width: 1440, height: 900 }) {
  const page = await browser.newPage({ viewport: vp })
  await page.addInitScript(COUNTER)
  await page.goto(url(route), { waitUntil: 'networkidle' })
  await page.waitForTimeout(5000)
  return page
}
async function hover(page, sel, shot) {
  const el = page.locator(sel).first()
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  const b = await el.boundingBox()
  await page.mouse.move(b.x + 4, b.y + b.height / 2)
  await page.mouse.move(b.x + b.width * 0.4, b.y + b.height * 0.5, { steps: 10 })
  await page.waitForTimeout(1500)
  const live = await page.evaluate(() => window.__live())
  if (shot) await page.screenshot({ path: `${OUT}/${shot}.png` })
  await page.mouse.move(5, 890, { steps: 4 })
  return live
}

const routes = ['/es', '/es/about', '/es/projects', '/es/projects/candelaria', '/es/projects/candelaria-website', '/es/projects/licorimetro', '/es/projects/sensewave', '/es/projects/umbral', '/es/projects/bloom']
const ctx = {}
for (const r of routes) {
  const page = await open(r)
  const rest = await page.evaluate(() => window.__live())
  let max = rest
  max = Math.max(max, await hover(page, 'main h1'))
  const fur = (await page.locator('main .fur-btn').count()) ? 'main .fur-btn' : '.side-nav .plush'
  max = Math.max(max, await hover(page, fur))
  ctx[r] = { reposo: rest, maximo_con_cursor: max }
  console.log(`${r}: ${rest} en reposo, ${max} máximo con cursor`)
  await page.close()
}
writeFileSync(`${OUT}/contextos.json`, JSON.stringify(ctx, null, 2))

// state captures
{
  const p = await open('/es/about')
  await hover(p, 'main h1', 'titulo-hover')
  await p.close()
}
{
  const p = await open('/es')
  await hover(p, 'main .fur-btn--mohair', 'mohair-hover')
  await hover(p, '.side-nav .plush', 'loseta-hover')
  await hover(p, '.spec-slab', 'herbario-hover')
  await p.close()
}
{
  const p = await open('/es/about')
  const y = await p.evaluate(() => {
    const b = document.querySelector('.vine__body').getBoundingClientRect()
    return window.scrollY + b.top + b.height / 2 - window.innerHeight * 0.7
  })
  await p.evaluate((yy) => window.scrollTo(0, yy), y)
  await p.waitForTimeout(1800)
  await p.screenshot({ path: `${OUT}/enredadera-50.png` })
  await p.close()
}
{
  const p = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await p.goto(url('/es/about'), { waitUntil: 'networkidle' })
  const y = await p.evaluate(() => {
    const b = document.querySelector('.vine__body').getBoundingClientRect()
    return window.scrollY + b.top + b.height / 2 - window.innerHeight * 0.7
  })
  await p.evaluate((yy) => window.scrollTo(0, yy), y)
  await p.waitForTimeout(1200)
  await p.screenshot({ path: `${OUT}/enredadera-50__390.png` })
  await p.close()
}
// home weight
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const cdp = await p.context().newCDPSession(p)
  await cdp.send('Network.enable')
  let bytes = 0
  const byType = {}
  const types = new Map()
  cdp.on('Network.responseReceived', (e) => types.set(e.requestId, e.type))
  cdp.on('Network.loadingFinished', (e) => {
    bytes += e.encodedDataLength
    const t = types.get(e.requestId) ?? 'Other'
    byType[t] = (byType[t] ?? 0) + e.encodedDataLength
  })
  await p.goto(url('/es'), { waitUntil: 'networkidle' })
  await p.waitForTimeout(6000)
  const kb = (n) => Math.round(n / 1024)
  const res = { total_kb: kb(bytes), por_tipo_kb: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, kb(v)])) }
  writeFileSync(`${OUT}/peso-home.json`, JSON.stringify(res, null, 2))
  console.log('peso /es:', res)
  await p.close()
}
await browser.close()
process.exit(0)
