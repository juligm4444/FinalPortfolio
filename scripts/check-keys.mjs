/* npm run check:keys — translation keys nothing reads (V4 §F, §L).
   A key counts as used when its full path is quoted in the code, or when a
   prefix of it is built dynamically (`works.${id}.`) or read through a page
   helper (c('name')) and its last segment appears quoted or at the end of a
   template. meta.* is read by src/i18n/meta.js as an object. Exit 1 if any. */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { default: translations } = await import(pathToFileURL(join(root, 'src/i18n/translations.js')).href)
const walk = (d) =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f)
    return statSync(p).isDirectory() ? walk(p) : /\.jsx?$/.test(f) && !p.endsWith('translations.js') ? [p] : []
  })
const code = walk(join(root, 'src')).map((f) => readFileSync(f, 'utf8')).join('\n')
const keys = []
const visit = (o, path) => {
  if (o && typeof o === 'object' && !Array.isArray(o)) for (const k of Object.keys(o)) visit(o[k], path ? `${path}.${k}` : k)
  else keys.push(path)
}
visit(translations.es, '')
const q = (s) => code.includes(`'${s}'`) || code.includes(`"${s}"`) || code.includes('`' + s + '`')
const prefixes = new Set([...code.matchAll(/[`'"]([a-zA-Z0-9_.]+)\.\$\{/g)].map((m) => m[1]))
const helperRoots = new Set([...code.matchAll(/t\(`([a-zA-Z0-9_.]+)\.\$\{(?:k|key|name|id)\}`/g)].map((m) => m[1]))
const unused = keys.filter((k) => {
  if (k.startsWith('meta.')) return false
  if (q(k)) return false
  const parts = k.split('.')
  const last = parts[parts.length - 1]
  const suffix = /^[a-z0-9]+([A-Z]\w*)$/.exec(last)?.[1]
  const lastUsed = (suffix && code.includes(`}${suffix}\``)) || q(last) || code.includes(`.${last}\``) || code.includes(`.${last}'`) || new RegExp(`[.\\b]${last}\\b`).test(code)
  for (let i = parts.length - 1; i > 0; i--) {
    const pre = parts.slice(0, i).join('.')
    if ((prefixes.has(pre) || helperRoots.has(pre)) && (i < parts.length - 1 || lastUsed)) return false
  }
  return true
})
if (unused.length) {
  console.log(unused.join('\n'))
  console.error(`check:keys: ${unused.length} clave(s) sin uso`)
  process.exit(1)
}
console.log('check:keys: ok')
