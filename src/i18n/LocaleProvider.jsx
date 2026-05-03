import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import translations, { LOCALES } from './translations.js'

const LocaleContext = createContext(null)

const STORAGE_KEY = 'juligm4.locale'

const detectInitial = () => {
  if (typeof window === 'undefined') return 'es'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored && LOCALES.includes(stored)) return stored
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

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(detectInitial)

  useEffect(() => {
    document.documentElement.lang = locale === 'es' ? 'es' : 'en'
    window.localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  const toggle = useCallback(() => {
    setLocale((l) => (l === 'es' ? 'en' : 'es'))
  }, [])

  const t = useCallback(
    (path, fallback) => {
      const v = get(translations[locale], path)
      if (v !== undefined) return v
      const fb = get(translations.en, path)
      return fb !== undefined ? fb : fallback ?? path
    },
    [locale]
  )

  const value = useMemo(() => ({ locale, setLocale, toggle, t }), [locale, toggle, t])

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
