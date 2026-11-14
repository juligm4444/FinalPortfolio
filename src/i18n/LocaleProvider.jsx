import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import translations, { LOCALES } from './translations.js'
import { localePath, splitLocale } from './routes.js'

const LocaleContext = createContext(null)

export const STORAGE_KEY = 'juligm4.locale'

/** The language a visitor would like, used only to pick where `/` sends them. */
export function preferredLocale() {
  if (typeof window === 'undefined') return 'es'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored && LOCALES.includes(stored)) return stored
  } catch {
    /* storage unavailable */
  }
  const nav = (navigator.language || 'es').toLowerCase()
  return nav.startsWith('en') ? 'en' : 'es'
}

const get = (obj, path) => {
  const parts = path.split('.')
  let cur = obj
  for (const p of parts) {
    if (cur == null) return undefined
    cur = cur[p]
  }
  return cur
}

/**
 * `locale` comes from the route (`/:lang`). The provider never guesses it;
 * switching language is a navigation to the same page under the other prefix.
 */
export function LocaleProvider({ locale, children }) {
  const navigate = useNavigate()
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    document.documentElement.lang = locale
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* storage unavailable */
    }
  }, [locale])

  const setLocale = useCallback(
    (next) => {
      if (!LOCALES.includes(next) || next === locale) return
      const { path } = splitLocale(pathname)
      navigate(localePath(next, path) + search + hash)
    },
    [locale, pathname, search, hash, navigate]
  )

  const toggle = useCallback(() => setLocale(locale === 'es' ? 'en' : 'es'), [locale, setLocale])

  const t = useCallback(
    (path, fallback) => {
      const v = get(translations[locale], path)
      if (v !== undefined) return v
      const fb = get(translations.en, path)
      return fb !== undefined ? fb : fallback ?? path
    },
    [locale]
  )

  const value = useMemo(() => ({ locale, setLocale, toggle, t }), [locale, setLocale, toggle, t])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

export function useT() {
  return useLocale().t
}
