/* npm run bake:fur — V3 §B: the rest image of every fixed fur piece, made by the
   REAL component (the same off-screen studio the site uses), saved as WebP in
   src/assets/fur/. Pieces with a baked file are images from the first paint and
   on phones never create a WebGL context. Needs a build (npm run build) first;
   rebuild afterwards so the files ship. */
import { spawn } from 'node:child_process'
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = resolve(root, 'src/assets/fur')
const PORT = 4312
const JOBS = [
  ...['instagram', 'linkedin', 'cv', 'github', 'behance', 'email'].map((n) => ({ hook: 'social', name: n, size: 88, route: '/es' })),
  ...['Figma', 'React', 'Next.js', 'Python', 'Django', 'Supabase', 'Tailwind', 'Three.js', 'Blender', 'Unity', 'Git', 'SQL'].map((n) => ({ hook: 'tool', name: n, size: 88, route: '/es/projects' })),
]
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '')

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH
  const base = join(homedir(), '.cache/ms-playwright')
  const dirs = existsSync(base) ? readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse() : []
  for (const d of dirs) {
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
    // not up yet
  }
  await new Promise((r) => setTimeout(r, 500))
}

const browser = await chromium.launch({
  executablePath: findChrome(),
  args: ['--use-angle=gl-egl', '--use-gl=angle', '--ignore-gpu-blocklist'],
})
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await mkdir(out, { recursive: true })
const pages = new Map()
for (const job of JOBS) {
  let page = pages.get(job.route)
  if (!page) {
    page = await ctx.newPage()
    await page.goto(`http://localhost:${PORT}${job.route}`, { waitUntil: 'networkidle' })
    pages.set(job.route, page)
  }
  await page.waitForFunction((h) => window.__furBake?.[h] && window.__fur, job.hook, { timeout: 15000 })
  const data = await page.evaluate(async ({ hook, name, size }) => {
    const url = await window.__furBake[hook](name, size)
    const img = new Image()
    img.src = url
    await img.decode()
    const c = document.createElement('canvas')
    c.width = img.naturalWidth
    c.height = img.naturalHeight
    c.getContext('2d').drawImage(img, 0, 0)
    return c.toDataURL('image/webp', 0.92)
  }, job)
  const file = join(out, `plush-${slug(job.name)}-${job.size}.webp`)
  await writeFile(file, Buffer.from(data.split(',')[1], 'base64'))
  console.log(`bake:fur: ${file.replace(root + '/', '')}`)
}
await browser.close()
process.exit(0)
