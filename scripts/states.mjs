/* npm run states — V4 §M.2: the interactive states and the report's numbers.
   Needs `npm run build`. Writes to shots/v4-m-states/:
   titulo-cursor, velour-hover, mohair-hover, red-hover, destacada-hover,
   parcela-hover, filtro-web, enredadera-50, enredadera-50__390, menu-movil;
   contextos.json (live WebGL contexts per route: at rest, and the most seen
   while hovering a heading and a fur piece) and peso-home.json. */
import { spawn } from 'node:child_process'
import { existsSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright-core'

const PORT = 4328
const OUT = 'shots/v4-m-states'
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
async function open(route, vp = { width: 1440, height: 900 }, extra = {}) {
  const page = await browser.newPage({ viewport: vp, ...extra })
  await page.addInitScript(COUNTER)
  await page.goto(url(route), { waitUntil: 'networkidle' })
  await page.waitForTimeout(5000)
  return page
}
/** Move onto `sel`, sweep to `at` (0..1 across it), wait, optionally capture the viewport. */
async function hover(page, sel, shot, at = 0.45) {
  const el = page.locator(sel).first()
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  const b = await el.boundingBox()
  await page.mouse.move(b.x + 3, b.y + b.height / 2)
  await page.mouse.move(b.x + b.width * at, b.y + b.height * 0.5, { steps: 14 })
  await page.waitForTimeout(1200)
  // keep the pointer moving on it: fur parts, growth follows
  await page.mouse.move(b.x + b.width * Math.min(0.95, at + 0.12), b.y + b.height * 0.55, { steps: 6 })
  await page.waitForTimeout(250)
  const live = await page.evaluate(() => window.__live())
  if (shot) await page.screenshot({ path: `${OUT}/${shot}.png` })
  await page.mouse.move(2, 2, { steps: 3 })
  await page.waitForTimeout(600)
  return live
}

// live WebGL contexts per route
const routes = ['/es', '/es/about', '/es/projects', '/es/toolkit', '/es/projects/candelaria', '/es/projects/candelaria-website', '/es/projects/licorimetro', '/es/projects/sensewave', '/es/projects/umbral', '/es/projects/bloom']
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

// states
{
  // title with the cursor mid-word: sweep the word from its start to its middle, capture there
  const p = await open('/es/about')
  const h = p.locator('main h1').first()
  await h.scrollIntoViewIfNeeded()
  const b = await h.boundingBox()
  await p.mouse.move(b.x + 4, b.y + b.height * 0.55)
  await p.waitForTimeout(1500)
  await p.mouse.move(b.x + b.width * 0.55, b.y + b.height * 0.55, { steps: 30 })
  await p.waitForTimeout(500)
  await p.screenshot({ path: `${OUT}/titulo-cursor.png` })
  await p.close()
}
{
  const p = await open('/es')
  await hover(p, '.hero__actions .fur-btn--velour', 'velour-hover')
  await hover(p, '.hero__actions .fur-btn--mohair', 'mohair-hover')
  await hover(p, '.side-nav .plush', 'red-hover')
  await hover(p, '.feat', 'destacada-hover')
  await p.close()
}
{
  const p = await open('/es/projects')
  await hover(p, '.plot__inner--case .plot__ground', 'parcela-hover')
  await p.locator('.proj__filters button').nth(1).click()
  await p.waitForTimeout(1200)
  await p.mouse.move(2, 2)
  await p.evaluate(() => window.scrollTo(0, document.querySelector('.lattice').getBoundingClientRect().top + scrollY - 120))
  await p.waitForTimeout(900)
  await p.screenshot({ path: `${OUT}/filtro-web.png` })
  await p.close()
}
for (const [vp, name] of [
  [{ width: 1440, height: 900 }, 'enredadera-50'],
  [{ width: 390, height: 844 }, 'enredadera-50__390'],
]) {
  const p = await open('/es/about', vp)
  const y = await p.evaluate(() => {
    const b = document.querySelector('.vine__body').getBoundingClientRect()
    return window.scrollY + b.top + b.height / 2 - window.innerHeight * 0.7
  })
  await p.evaluate((yy) => window.scrollTo(0, yy), y)
  await p.waitForTimeout(1500)
  await p.screenshot({ path: `${OUT}/${name}.png` })
  await p.close()
}
{
  const p = await open('/es', { width: 390, height: 844 }, { hasTouch: true, isMobile: true, deviceScaleFactor: 2 })
  await p.locator('.topbar button').first().tap()
  await p.waitForTimeout(2500)
  await p.screenshot({ path: `${OUT}/menu-movil.png` })
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
