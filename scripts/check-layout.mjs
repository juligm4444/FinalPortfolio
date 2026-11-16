/* npm run check:layout — V4 §B.5 by measurement, at the eight sizes:
   no horizontal scroll; on screens 1440 px and wider no wall (section) narrower
   than 70 % of the content area (viewport minus the nav). Needs `npm run build`. */
import { spawn } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright-core'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { prerenderUrls } = await import(pathToFileURL(resolve(root, 'src/i18n/routes.js')).href)
const ROUTES = prerenderUrls().filter((u) => u.startsWith('/es'))
const SIZES = ['390x844', '768x1024', '1024x768', '1366x768', '1440x900', '1920x1080', '2560x1440', '3440x1440']
const PORT = 4323
const base = join(homedir(), '.cache/ms-playwright')
const dir = existsSync(base) ? readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse()[0] : null
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'ignore' })
process.on('exit', () => server.kill())
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(`http://localhost:${PORT}/es`)).ok) break
  } catch {
    // not yet
  }
  await new Promise((r) => setTimeout(r, 400))
}
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? (dir ? join(base, dir, 'chrome-linux64/chrome') : undefined) })
let bad = 0
for (const size of SIZES) {
  const [width, height] = size.split('x').map(Number)
  const ctx = await browser.newContext({ viewport: { width, height } })
  for (const r of ROUTES) {
    const page = await ctx.newPage()
    await page.goto(`http://localhost:${PORT}${r}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    const m = await page.evaluate(() => {
      const de = document.documentElement
      const main = document.querySelector('main')
      const cs = getComputedStyle(main)
      const content = main.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const walls = [...document.querySelectorAll('main .wall')].filter((w) => !w.closest('.about__intro')).map((w) => ({ w: w.getBoundingClientRect().width, c: w.className.split(' ').slice(0, 3).join('.') }))
      return { overflow: de.scrollWidth - de.clientWidth, content, walls }
    })
    const narrow = width >= 1440 ? m.walls.filter((w) => w.w < 0.7 * m.content) : []
    const ok = m.overflow <= 0 && !narrow.length
    if (!ok) {
      bad++
      console.log(`MAL ${size} ${r}: ${m.overflow > 0 ? `scroll horizontal ${m.overflow}px ` : ''}${narrow.map((w) => `${w.c} ${Math.round(w.w)}px < 70% de ${Math.round(m.content)}`).join('; ')}`)
    }
    await page.close()
  }
  await ctx.close()
  console.log(`${size}: revisado`)
}
await browser.close()
if (bad) {
  console.error(`check:layout: ${bad} fallo(s)`)
  process.exit(1)
}
console.log('check:layout: ok')
process.exit(0)
