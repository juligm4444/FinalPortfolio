/* Per-route <head> data for both the client <Seo> and the prerender script.
   Titles and descriptions live in translations.js under `meta.*` and `works.*`;
   nothing here is copy. */
import translations from './translations.js'
import { LOCALES, SITE_ORIGIN, localePath, routeKey, projectSlug } from './routes.js'

const SLUG_TO_WORK = {
  'candelaria-website': 'candelariaWebsite',
  candelaria: 'candelariaBrand',
  licorimetro: 'licorimetro',
  sensewave: 'sensewaveProduct',
  umbral: 'umbral',
  bloom: 'bloom',
}

const OG_IMAGE = '/og.png'

/**
 * @param {string} locale 'es' | 'en'
 * @param {string} path   locale-free path, e.g. '/projects/umbral'
 */
export function getRouteMeta(locale, path) {
  const t = translations[locale] ?? translations.es
  const key = routeKey(path)
  const site = t.meta.siteName
  let title
  let description
  let noindex = false

  if (key === 'project') {
    const work = t.works[SLUG_TO_WORK[projectSlug(path)]]
    title = work ? `${work.title} — ${site}` : site
    description = work?.desc ?? t.meta.home.description
  } else if (key === 'lab') {
    title = `${t.meta.lab.title} — ${site}`
    description = t.meta.lab.description
    noindex = true
  } else if (key === 'unknown') {
    title = site
    description = t.meta.home.description
    noindex = true
  } else {
    const m = t.meta[key]
    title = key === 'home' ? m.title : `${m.title} — ${site}`
    description = m.description
  }

  const alternates = LOCALES.map((l) => ({ hreflang: l, href: SITE_ORIGIN + localePath(l, path) }))
  alternates.push({ hreflang: 'x-default', href: SITE_ORIGIN + localePath('es', path) })

  return {
    lang: locale,
    title,
    description,
    canonical: SITE_ORIGIN + localePath(locale, path),
    alternates,
    ogImage: SITE_ORIGIN + OG_IMAGE,
    ogLocale: locale === 'es' ? 'es_CO' : 'en_US',
    siteName: site,
    noindex,
  }
}

/** The `<head>` fragment the prerender script injects. Mirrors what <Seo> sets at runtime. */
export function headHtml(meta) {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
  const lines = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" data-seo>`,
    `<link rel="canonical" href="${esc(meta.canonical)}" data-seo>`,
    ...meta.alternates.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}" data-seo>`),
    `<meta property="og:type" content="website" data-seo>`,
    `<meta property="og:site_name" content="${esc(meta.siteName)}" data-seo>`,
    `<meta property="og:locale" content="${meta.ogLocale}" data-seo>`,
    `<meta property="og:title" content="${esc(meta.title)}" data-seo>`,
    `<meta property="og:description" content="${esc(meta.description)}" data-seo>`,
    `<meta property="og:url" content="${esc(meta.canonical)}" data-seo>`,
    `<meta property="og:image" content="${esc(meta.ogImage)}" data-seo>`,
    `<meta name="twitter:card" content="summary_large_image" data-seo>`,
  ]
  if (meta.noindex) lines.push(`<meta name="robots" content="noindex" data-seo>`)
  return lines.join('\n    ')
}
