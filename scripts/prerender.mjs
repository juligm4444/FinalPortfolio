/* Prerender every page × language into dist/<lang>/<path>.html (served as
   clean URLs: Vercel via `cleanUrls`, vite preview via sirv's extension lookup).
   Runs after `vite build` (client) and `vite build --ssr` (server bundle).
   No dependency beyond React itself. */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const ssr = pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href

const { render, prerenderUrls, splitLocale, getRouteMeta, headHtml } = await import(ssr)
const template = await readFile(resolve(dist, 'index.html'), 'utf8')

if (!template.includes('<div id="root"></div>')) {
  throw new Error('dist/index.html: missing <div id="root"></div>')
}

const written = []
for (const url of prerenderUrls()) {
  const { locale, path } = splitLocale(url)
  const meta = getRouteMeta(locale ?? 'es', path)
  if (!locale) meta.noindex = false // '/' is the language switch; it still lists both alternates

  // '/' only decides the language on the client; it ships no markup.
  let app = ''
  try {
    if (url !== '/') app = render(url)
  } catch (err) {
    console.error(`prerender: ${url} failed to render`)
    throw err
  }

  const html = template
    .replace('<html lang="es">', `<html lang="${meta.lang}">`)
    .replace(/<title>[^<]*<\/title>/, headHtml(meta))
    .replace('<div id="root"></div>', `<div id="root">${app}</div>`)

  const file = url === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${url}.html`)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html)
  written.push(url)
}

const origin = 'https://juligm4.com'
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  written
    .filter((u) => u !== '/')
    .map((u) => {
      const { path } = splitLocale(u)
      const alts = ['es', 'en']
        .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${origin}/${l}${path === '/' ? '' : path}"/>`)
        .join('\n')
      return `  <url>\n    <loc>${origin}${u}</loc>\n${alts}\n  </url>`
    })
    .join('\n') +
  `\n</urlset>\n`
await writeFile(resolve(dist, 'sitemap.xml'), sitemap)

console.log(`prerendered ${written.length} pages + sitemap.xml`)
