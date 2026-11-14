/* REDESIGN §4.4 — every page lives under /es/… and /en/…. The URL is the
   source of truth for the language. This module is shared by the router,
   the links, the <Seo> head and the prerender script, so no one else
   builds paths by hand. */
import { LOCALES } from './translations.js'

export { LOCALES }
export const DEFAULT_LOCALE = 'es'
export const SITE_ORIGIN = 'https://juligm4.com'

export const PROJECT_SLUGS = [
  'candelaria',
  'candelaria-website',
  'licorimetro',
  'sensewave',
  'umbral',
  'bloom',
]

/** Pages that get a prerendered HTML file. */
export const STATIC_PATHS = ['/', '/about', '/projects', ...PROJECT_SLUGS.map((s) => `/projects/${s}`)]

export function isLocale(x) {
  return LOCALES.includes(x)
}

/** '/en/projects/umbral' → { locale: 'en', path: '/projects/umbral' } ; '/about' → { locale: null, path: '/about' } */
export function splitLocale(pathname) {
  const [first, ...rest] = pathname.split('/').filter(Boolean)
  if (isLocale(first)) {
    return { locale: first, path: '/' + rest.join('/') }
  }
  return { locale: null, path: pathname === '' ? '/' : pathname.replace(/\/+$/, '') || '/' }
}

/** ('en', '/about') → '/en/about' ; ('es', '/') → '/es' . External and hash links pass through. */
export function localePath(locale, path = '/') {
  if (!path.startsWith('/')) return path
  if (splitLocale(path).locale) return path
  const clean = path === '/' ? '' : path.replace(/\/+$/, '')
  return `/${locale}${clean}`
}

/** Route key used by backgrounds and meta: home | about | projects | project | unknown */
export function routeKey(path) {
  if (path === '/' || path === '') return 'home'
  if (path === '/about') return 'about'
  if (path === '/projects') return 'projects'
  if (path.startsWith('/projects/')) return 'project'
  return 'unknown'
}

export function projectSlug(path) {
  const m = path.match(/^\/projects\/([^/]+)$/)
  return m ? m[1] : null
}

/** All prerendered URLs: '/' (the language switch), then every page × locale. */
export function prerenderUrls() {
  const urls = ['/']
  for (const locale of LOCALES) for (const path of STATIC_PATHS) urls.push(localePath(locale, path))
  return urls
}
