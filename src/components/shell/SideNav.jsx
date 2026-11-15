import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocale } from '../../i18n/LocaleProvider.jsx'
import { splitLocale } from '../../i18n/routes.js'
import VelourBolster from '../VelourBolster.jsx'
import { MohairButton } from '../fur/FurButton.jsx'
import Socials from './Socials.jsx'

/* V4 §C — the shell's navigation.
   Desktop: a column of Velour Bolster buttons (Home, About, Projects, Toolkit),
   the current page pressed with brighter fur; under them the six socials in one
   column; the language switch at the bottom. No logo.
   Phone: a compact top bar with a menu button; the menu is a full-height sheet
   with the nav buttons and the socials in a 3 × 2 grid. */
export const NAV = [
  { to: '/', key: 'home' },
  { to: '/about', key: 'about' },
  { to: '/projects', key: 'projects' },
]

function useCurrent() {
  const { pathname } = useLocation()
  const path = splitLocale(pathname).path
  return (to) => (to === '/' ? path === '/' : path === to || path.startsWith(`${to}/`))
}

function LangSwitch({ height = 40 }) {
  const { t, locale, toggle } = useLocale()
  const other = locale === 'es' ? 'en' : 'es'
  return (
    <MohairButton
      label={t(`nav.langShort.${other}`)}
      onClick={toggle}
      height={height}
      lang={other}
      aria-label={`${t(`nav.langShort.${other}`)} — ${t(`nav.langSwitch.${other}`)}`}
      className="nav-lang"
    />
  )
}

export default function SideNav() {
  const { t, locale } = useLocale()
  const current = useCurrent()
  const { pathname } = useLocation()
  // open only on the page it was opened from: navigating closes it, no effect needed
  const [openAt, setOpenAt] = useState(null)
  const open = openAt === pathname
  const setOpen = (v) => setOpenAt(v ? pathname : null)
  const sheet = useRef(null)
  const opener = useRef(null)

  // the sheet closes with Escape; the page behind does not scroll
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpenAt(null)
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    sheet.current?.querySelector('a, button')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      opener.current?.querySelector('button, a')?.focus()
    }
  }, [open])

  const items = (h, w) =>
    NAV.map((r) => (
      <li key={r.key}>
        <VelourBolster label={t(`nav.${r.key}`)} to={r.to} pressed={current(r.to)} height={h} width={w} lang={locale} />
      </li>
    ))

  return (
    <>
      <nav className="side-nav" aria-label={t('nav.label')}>
        <ul className="side-nav__list">{items(44, 184)}</ul>
        <Socials cssSize="clamp(52px, 8.5vh, 88px)" className="side-nav__socials" />
        <div className="side-nav__lang">
          <LangSwitch />
        </div>
      </nav>

      <header className="topbar">
        <div ref={opener}>
          <MohairButton label={t('nav.menu')} onClick={() => setOpen(true)} height={40} lang={locale} aria-expanded={open} aria-controls="menu-sheet" />
        </div>
        <LangSwitch />
      </header>
      <div
        ref={sheet}
        id="menu-sheet"
        className={`sheet concrete ${open ? 'sheet--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.label')}
        hidden={!open}
      >
        <div className="sheet__top">
          <MohairButton label={t('nav.close')} onClick={() => setOpen(false)} height={40} lang={locale} />
        </div>
        <nav aria-label={t('nav.label')}>
          <ul className="sheet__list">{items(52, 248)}</ul>
        </nav>
        <Socials cssSize="clamp(64px, 22vw, 88px)" staticOnly className="sheet__socials" />
      </div>
    </>
  )
}
