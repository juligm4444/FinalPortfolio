/* npm run test:deck — V3 §G.1: six clicks in a row on the sites deck; after each
   one the front sheet changes and no card is left part-way through its fall
   (every visible card stands at 0° or lies at -90°). Also writes the state after
   three clicks to shots/v3-j/deck-3-clics.png. Needs `npm run build`. */
import { spawn } from 'node:child_process'
import { existsSync, readdirSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright-core'

const PORT = 4317
const base = join(homedir(), '.cache/ms-playwright')
const dir = existsSync(base) ? readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse()[0] : null
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
process.on('exit', () => server.kill())
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(`http://localhost:${PORT}/es/projects`)).ok) break
  } catch {
    // not yet
  }
  await new Promise((r) => setTimeout(r, 400))
}
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? (dir ? join(base, dir, 'chrome-linux64/chrome') : undefined) })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(`http://localhost:${PORT}/es/projects`, { waitUntil: 'networkidle' })
const deck = page.locator('.td-root')
await deck.scrollIntoViewIfNeeded()
await page.waitForTimeout(800)
const state = () =>
  page.evaluate(() => ({
    front: document.querySelector('.proj__deck-front')?.textContent.trim(),
    angles: [...document.querySelectorAll('.td-card')]
      .filter((c) => c.style.visibility !== 'hidden' && parseFloat(c.style.opacity || '1') > 0)
      .map((c) => parseFloat(/rotateX\((-?[\d.e-]+)deg\)/.exec(c.style.transform)?.[1] ?? 'NaN')),
  }))
let prev = (await state()).front
let fail = 0
const box = await deck.boundingBox()
mkdirSync('shots/v3-j', { recursive: true })
for (let i = 1; i <= 6; i++) {
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.45)
  await page.waitForTimeout(1600)
  const s = await state()
  const mid = s.angles.filter((a) => !(Math.abs(a) < 0.5 || Math.abs(a + 90) < 0.5))
  const changed = s.front !== prev
  const ok = changed && mid.length === 0
  if (!ok) fail++
  console.log(`${ok ? 'ok ' : 'MAL'} clic ${i}: frente "${s.front}"${changed ? '' : ' (NO CAMBIÓ)'}; ángulos ${s.angles.map((a) => a.toFixed(1)).join(', ')}${mid.length ? ` — intermedios: ${mid.join(', ')}` : ''}`)
  prev = s.front
  if (i === 3) await page.screenshot({ path: 'shots/v3-j/deck-3-clics.png' })
}
await browser.close()
if (fail) {
  console.error(`test:deck: ${fail} fallo(s)`)
  process.exit(1)
}
console.log('test:deck: ok')
process.exit(0)
