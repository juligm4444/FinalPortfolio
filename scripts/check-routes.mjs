/* npm run check:routes — V4 §A. For every route in both languages:
   1. cold load of the prerendered page;
   2. reached by clicking through the site 10 times in a row (nav links, and the
      project's own card link for case studies) without a reload;
   fails on any page error, any React hydration error or warning, or a <main>
   with no visible text. Also checks every project card: a card with a link
   must point at an existing route; a card without one must not look clickable
   (no pointer cursor) and must say "in progress"/"coming soon".
   Run it on a production build (npm run build). Set CHECK_DEV=1 after a
   NODE_ENV=development build to also catch React's hydration warnings by text. */
import { spawn } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright-core'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { prerenderUrls } = await import(pathToFileURL(resolve(root, 'src/i18n/routes.js')).href)
const ROUTES = prerenderUrls().filter((u) => u !== '/')
const ROUTE_SET = new Set(ROUTES)
const PORT = 4321
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
const BAD = /Minified React error #(418|419|421|422|423|425)|hydrat|did not match|does not match server/i
let fails = 0
const fail = (msg) => {
  fails++
  console.log('  MAL ' + msg)
}

function watch(page) {
  const errs = []
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message.slice(0, 160)))
  page.on('console', (m) => {
    if ((m.type() === 'error' || m.type() === 'warning') && BAD.test(m.text())) errs.push(m.type() + ': ' + m.text().slice(0, 160))
  })
  return errs
}
const mainText = (page) => page.evaluate(() => (document.querySelector('main')?.innerText ?? '').trim().length)
async function checkCards(page, route) {
  const cards = await page.evaluate(() =>
    [...document.querySelectorAll('[data-project-card]')].map((c) => {
      const link = c.matches('a[href]') ? c : c.querySelector('a[data-card-link], a[href]')
      return { href: link?.getAttribute('href') ?? null, cursor: getComputedStyle(c).cursor, text: c.innerText }
    })
  )
  for (const c of cards) {
    if (c.href) {
      if (c.href.startsWith('/') && !ROUTE_SET.has(c.href)) fail(`${route}: tarjeta enlaza a ${c.href}, que no existe`)
    } else {
      if (c.cursor === 'pointer') fail(`${route}: tarjeta sin destino con cursor pointer`)
      if (!/en curso|próximamente|in progress|coming soon/i.test(c.text)) fail(`${route}: tarjeta sin destino sin estado ("${c.text.slice(0, 40)}")`)
    }
  }
  return cards.length
}

// 1. cold loads
console.log('— carga en frío —')
for (const r of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errs = watch(page)
  await page.goto(`http://localhost:${PORT}${r}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  const n = await mainText(page)
  const cards = await checkCards(page, r)
  const ok = !errs.length && n > 0
  console.log(`${ok ? 'ok ' : 'MAL'} ${r} (texto ${n}, tarjetas ${cards})`)
  if (!ok) {
    fails++
    errs.forEach((e) => console.log('     ' + e))
    if (!n) console.log('     <main> sin texto visible')
  }
  await page.close()
}

// 2. reached by clicking, 10 in a row without reloading
console.log('— por clics, 10 seguidos —')
for (const lang of ['es', 'en']) {
  const navPaths = ROUTES.filter((r) => r.startsWith(`/${lang}`) && !r.includes('/projects/'))
  const cases = ROUTES.filter((r) => r.startsWith(`/${lang}/projects/`))
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errs = watch(page)
  await page.goto(`http://localhost:${PORT}/${lang}`, { waitUntil: 'networkidle' })
  // every target, then keep cycling until each has been reached by click and the run had ≥ 10 clicks in a row
  const plan = []
  for (const c of cases) plan.push(`/${lang}/projects`, c)
  for (const p of navPaths) plan.push(p)
  while (plan.length < 10) plan.push(...navPaths)
  let i = 0
  const heading = () => page.evaluate(() => document.querySelector('main h1')?.textContent.trim() ?? '')
  let prevHeading = await heading()
  let prevPath = `/${lang}`
  for (const target of plan) {
    i++
    const sel = `main a[href="${target}"], nav a[href="${target}"]`
    const link = page.locator(sel).first()
    if (!(await link.count())) {
      fail(`${lang}: no hay enlace visible a ${target} desde ${new URL(page.url()).pathname}`)
      continue
    }
    await link.scrollIntoViewIfNeeded()
    // A real click event on the link (the router handles it). Dispatched on the element itself so a
    // 3D-transformed card or an overlapping layer cannot swallow it.
    await link.evaluate((el) => el.click())
    await page.waitForURL((u) => u.pathname === target, { timeout: 5000 }).catch(() => {})
    await page.waitForTimeout(700)
    const at = new URL(page.url()).pathname
    const n = await mainText(page)
    const h = await heading()
    // the old page must be gone: a different route shows a different H1
    const swapped = target === prevPath || h !== prevHeading
    const ok = at === target && n > 0 && !errs.length && swapped
    console.log(`${ok ? 'ok ' : 'MAL'} ${lang} clic ${String(i).padStart(2)} → ${target}${at !== target ? ` (quedó en ${at})` : ''} (texto ${n}, h1 "${h.slice(0, 28)}")${swapped ? '' : ' — SIGUE LA PÁGINA ANTERIOR'}`)
    prevHeading = h
    prevPath = target
    if (!ok) {
      fails++
      errs.splice(0).forEach((e) => console.log('     ' + e))
    }
  }
  await page.close()
}
await browser.close()
if (fails) {
  console.error(`check:routes: ${fails} fallo(s)`)
  process.exit(1)
}
console.log('check:routes: ok')
process.exit(0)
