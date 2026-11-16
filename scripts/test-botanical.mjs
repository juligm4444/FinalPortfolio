/* npm run test:botanical — V4 §E by measurement. For a set of headings: sweep
   the pointer along every line, then
   1. every grown particle falls inside the heading's glyph boxes (canvas laid
      exactly over the text);
   2. the real text never changes colour or opacity;
   3. legibility: in each glyph swept, at least 45 % of its ink pixels are still
      the text's own colour (growth covers at most ~55 %).
   Writes shots/v4-e/<name>.png (the grown heading). Needs `npm run build`. */
import { spawn } from 'node:child_process'
import { existsSync, readdirSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright-core'

const PORT = 4326
const SF = 0.085 // FlowerTypeScene SCALE_FACTOR: world units per CSS px
const CASES = [
  ['/es', 'main .hero__name', 'home-nombre'],
  ['/es', 'main .hero__role', 'home-rol'],
  ['/es', 'main h2:not(.sr-only)', 'home-h2'],
  ['/es/about', 'main h1', 'about-h1'],
  ['/en/projects', 'main h1', 'projects-h1'],
]
mkdirSync('shots/v4-e', { recursive: true })
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
let fails = 0
for (const [route, sel, name] of CASES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3500)
  const h = page.locator(sel).first()
  await h.scrollIntoViewIfNeeded()
  await page.mouse.move(2, 2)
  await page.waitForTimeout(600)
  const geo = await h.evaluate((el) => {
    const lay = window.__bloom.layoutOf(el)
    const range = document.createRange()
    const chars = []
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    let n
    while ((n = walker.nextNode()))
      for (let i = 0; i < n.textContent.length; i++) {
        if (/\s/.test(n.textContent[i])) continue
        range.setStart(n, i)
        range.setEnd(n, i + 1)
        const r = range.getBoundingClientRect()
        chars.push({ c: n.textContent[i], l: r.left, t: r.top, r: r.right, b: r.bottom })
      }
    const cs = getComputedStyle(el)
    return { lines: lay.lines, chars, color: cs.color, opacity: cs.opacity }
  })
  const pad = 30
  const clip = {
    x: Math.max(0, Math.min(...geo.chars.map((c) => c.l)) - pad),
    y: Math.max(0, Math.min(...geo.chars.map((c) => c.t)) - pad),
  }
  clip.width = Math.max(...geo.chars.map((c) => c.r)) + pad - clip.x
  clip.height = Math.max(...geo.chars.map((c) => c.b)) + pad - clip.y
  // full-viewport captures (a clipped capture can miss a WebGL canvas), cropped afterwards
  const rest = await page.screenshot()
  // sweep every line, left to right, at the baseline's middle height
  for (const l of geo.lines) {
    const y = (l.top + l.bottom) / 2
    await page.mouse.move(l.left + 2, y)
    await page.mouse.move(l.right - 2, y, { steps: 18 })
  }
  await page.waitForTimeout(650)
  const live = await page.evaluate(() => {
    const s = window.__bloom.scene()
    const b = window.__bloom.box()
    if (!s || !b) return null
    const r = b.getBoundingClientRect()
    return {
      left: r.left,
      top: r.top,
      grown: s.particles.filter((p) => p.t > 0.25).map((p) => [p.x, p.y]),
      total: s.particles.length,
      keep: s.particles.filter((p) => p.keep).length,
      flowers: s.particles.filter((p) => p.keep && p.type === 0).length,
    }
  })
  const during = await h.evaluate((el) => ({ color: getComputedStyle(el).color, opacity: getComputedStyle(el).opacity }))
  const grownShot = await page.screenshot({ path: `shots/v4-e/${name}__full.png` })

  if (!live || !live.grown.length) {
    fails++
    console.log(`MAL ${name}: no creció nada`)
    await page.close()
    continue
  }
  // 1. inside the glyph boxes (3 px tolerance for the sprite's own jitter)
  const inside = live.grown.filter(([x, y]) => {
    const px = live.left + x / SF
    const py = live.top + y / SF
    return geo.chars.some((c) => px >= c.l - 3 && px <= c.r + 3 && py >= c.t - 3 && py <= c.b + 3)
  }).length
  const share = inside / live.grown.length
  // 2. text unchanged
  const same = during.color === geo.color && during.opacity === geo.opacity
  // 3. legibility per glyph, on the screenshots
  const vis = await page.evaluate(
    async ({ a, b, chars, clip, color }) => {
      const load = async (buf) => {
        const img = new Image()
        img.src = 'data:image/png;base64,' + buf
        await img.decode()
        const c = document.createElement('canvas')
        c.width = img.naturalWidth
        c.height = img.naturalHeight
        const g = c.getContext('2d')
        g.drawImage(img, 0, 0)
        return g.getImageData(0, 0, c.width, c.height)
      }
      const A = await load(a)
      const B = await load(b)
      const [tr, tg, tb] = color.match(/\d+/g).map(Number)
      const isInk = (d, i) => Math.abs(d[i] - tr) + Math.abs(d[i + 1] - tg) + Math.abs(d[i + 2] - tb) < 60
      return chars.map((c) => {
        let ink = 0
        let kept = 0
        for (let y = Math.floor(c.t); y < c.b; y++)
          for (let x = Math.floor(c.l); x < c.r; x++) {
            const i = (y * A.width + x) * 4
            if (isInk(A.data, i)) {
              ink++
              if (isInk(B.data, i)) kept++
            }
          }
        // punctuation is a few pixels: one leaf covers it whatever the density; letters are what must read
        return { c: c.c, ratio: ink && /[\p{L}\p{N}]/u.test(c.c) ? kept / ink : 1 }
      })
    },
    { a: rest.toString('base64'), b: grownShot.toString('base64'), chars: geo.chars, clip, color: geo.color }
  )
  await page.evaluate(() => 0)
  const worst = vis.reduce((m, v) => (v.ratio < m.ratio ? v : m), { ratio: 1 })
  const ok = share >= 0.97 && same && worst.ratio >= 0.45
  if (!ok) fails++
  console.log(
    `${ok ? 'ok ' : 'MAL'} ${name}: ${live.grown.length} crecidas, ${(share * 100).toFixed(1)} % dentro de las letras; texto ${same ? 'intacto' : 'CAMBIÓ'}; peor letra "${worst.c}" conserva ${(worst.ratio * 100).toFixed(0)} % de su tinta; flores ${((live.flowers / Math.max(1, live.keep)) * 100).toFixed(0)} %`
  )
  await page.close()
}
await browser.close()
if (fails) {
  console.error(`test:botanical: ${fails} fallo(s)`)
  process.exit(1)
}
console.log('test:botanical: ok')
process.exit(0)
