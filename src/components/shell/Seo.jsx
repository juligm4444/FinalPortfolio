import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocale } from '../../i18n/LocaleProvider.jsx'
import { splitLocale } from '../../i18n/routes.js'
import { getRouteMeta } from '../../i18n/meta.js'

/* Keeps <head> in step with the route on the client. The prerendered HTML
   already carries the same tags (marked data-seo); this replaces them on
   navigation instead of stacking duplicates. */
export default function Seo() {
  const { locale } = useLocale()
  const { pathname } = useLocation()

  useEffect(() => {
    const { path } = splitLocale(pathname)
    const meta = getRouteMeta(locale, path)
    const head = document.head

    document.title = meta.title
    document.documentElement.lang = locale
    head.querySelectorAll('[data-seo]').forEach((n) => n.remove())

    const add = (tag, attrs) => {
      const el = document.createElement(tag)
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
      el.setAttribute('data-seo', '')
      head.appendChild(el)
    }
    add('meta', { name: 'description', content: meta.description })
    add('link', { rel: 'canonical', href: meta.canonical })
    meta.alternates.forEach((a) => add('link', { rel: 'alternate', hreflang: a.hreflang, href: a.href }))
    add('meta', { property: 'og:type', content: 'website' })
    add('meta', { property: 'og:site_name', content: meta.siteName })
    add('meta', { property: 'og:locale', content: meta.ogLocale })
    add('meta', { property: 'og:title', content: meta.title })
    add('meta', { property: 'og:description', content: meta.description })
    add('meta', { property: 'og:url', content: meta.canonical })
    add('meta', { property: 'og:image', content: meta.ogImage })
    add('meta', { name: 'twitter:card', content: 'summary_large_image' })
    if (meta.noindex) add('meta', { name: 'robots', content: 'noindex' })
  }, [locale, pathname])

  return null
}
