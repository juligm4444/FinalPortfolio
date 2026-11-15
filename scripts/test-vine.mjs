/* npm run test:vine — V3 §F.2: the vine touches the vertical position of every
   milestone. Opens /es/about (built, vite preview) at 1440 and 390, samples the
   stem the page actually draws (the SVG path, same course the 3D tube follows,
   published on .vine__body[data-vine]) and checks, for each milestone card, that
   the stem passes through the card's vertical span and that the course has a
   control point inside it. Also checks the stem runs unbroken from the first
   card to the last. Needs `npm run build`. */
import { spawn } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright-core'

const PORT = 4316
const base = join(homedir(), '.cache/ms-playwright')
const dir = existsSync(base) ? readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse()[0] : null
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
process.on('exit', () => server.kill())
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(`http://localhost:${PORT}/es/about`)).ok) break
  } catch {
    // not yet
  }
  await new Promise((r) => setTimeout(r, 400))
}
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? (dir ? join(base, dir, 'chrome-linux64/chrome') : undefined) })
let fail = 0
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport: vp })
  await page.goto(`http://localhost:${PORT}/es/about`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const body = document.querySelector('.vine__body')
    const data = JSON.parse(body.dataset.vine)
    const path = body.querySelector('.vine__stem')
    const len = path.getTotalLength()
    const ys = []
    for (let s = 0; s <= len; s += 2) ys.push(path.getPointAtLength(s).y)
    const b = body.getBoundingClientRect()
    const cards = [...body.querySelectorAll('.vine__item')].map((li) => {
      const c = li.getBoundingClientRect()
      return { top: c.top - b.top, bottom: c.bottom - b.top, title: li.querySelector('h3').textContent }
    })
    return { ys, points: data.points, cards }
  })
  const minY = Math.min(...r.ys)
  const maxY = Math.max(...r.ys)
  const gaps = r.ys.slice(1).some((y, i) => Math.abs(y - r.ys[i]) > 6)
  console.log(`— ${vp.width}px: ${r.cards.length} hitos, tallo de ${minY.toFixed(0)} a ${maxY.toFixed(0)} px${gaps ? ' (CON CORTES)' : ''}`)
  if (gaps) fail++
  if (r.cards.length !== 9) {
    console.log(`  MAL: se esperaban 9 hitos`)
    fail++
  }
  r.cards.forEach((c, i) => {
    const passes = r.ys.some((y) => y >= c.top && y <= c.bottom)
    const anchored = r.points.some(([, y]) => y >= c.top && y <= c.bottom)
    const ok = passes && anchored
    if (!ok) fail++
    console.log(`  ${ok ? 'ok ' : 'MAL'} ${String(i + 1).padStart(2)} ${c.title} [${c.top.toFixed(0)}–${c.bottom.toFixed(0)}]`)
  })
  await page.close()
}
await browser.close()
if (fail) {
  console.error(`test:vine: ${fail} fallo(s)`)
  process.exit(1)
}
console.log('test:vine: ok')
process.exit(0)
