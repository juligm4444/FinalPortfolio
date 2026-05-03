import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import { useTheme } from '../theme/ThemeProvider.jsx'
import cvEn from '../assets/files/CV-English.pdf'
import cvEs from '../assets/files/CV-Español.pdf'

const ROUTES = [
  { to: '/', key: 'home' },
  { to: '/about', key: 'about' },
  { to: '/projects', key: 'projects' },
  { to: '/contact', key: 'contact' },
]

const NAV_HEIGHT = 75

export default function Navbar() {
  const { t, locale, toggle: toggleLocale } = useLocale()
  const { theme, toggle: toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const cvHref = locale === 'es' ? cvEs : cvEn
  const cvFile = locale === 'es' ? 'Julian-Galindo-CV-Espanol.pdf' : 'Julian-Galindo-CV-English.pdf'

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background:
          'linear-gradient(0deg, var(--nav-bg-from) 0%, var(--nav-bg-to) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <nav
        className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-6 md:px-10 lg:px-16"
        style={{ height: NAV_HEIGHT }}
      >
        <Link
          to="/"
          aria-label="juligm4 home"
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          <Logo size={48} />
        </Link>

        {/* Center links — desktop only */}
        <ul className="hidden items-center gap-5 lg:flex">
          {ROUTES.map((r) => (
            <li key={r.to}>
              <NavLink to={r.to} end={r.to === '/'}>
                {({ isActive }) => (
                  <span
                    className={`nav-link inline-flex items-center justify-center ${isActive ? 'active' : ''}`}
                    style={{ width: 132, height: 46 }}
                  >
                    {t(`nav.${r.key}`)}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right cluster — desktop. These are utilities, not navigation
            destinations, so they don't carry the navigation outline. */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={toggleLocale}
            aria-label={`Switch language (${locale.toUpperCase()})`}
            className="nav-link inline-flex items-center justify-center"
            style={{ width: 72, height: 46, border: 'none' }}
          >
            {locale.toUpperCase()}
          </button>
          <button
            onClick={toggleTheme}
            aria-label={t(theme === 'dark' ? 'nav.themeLight' : 'nav.themeDark')}
            title={t(theme === 'dark' ? 'nav.themeLight' : 'nav.themeDark')}
            className="nav-link inline-flex items-center justify-center"
            style={{ width: 46, height: 46, border: 'none' }}
          >
            <ThemeIcon dark={theme === 'dark'} />
          </button>
          <a
            href={cvHref}
            download={cvFile}
            className="nav-link inline-flex items-center justify-center"
            style={{ width: 72, height: 46, border: 'none' }}
          >
            {t('nav.cv')}
          </a>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={t(open ? 'nav.menuClose' : 'nav.menuOpen')}
          className="nav-link inline-flex items-center justify-center lg:hidden"
          style={{ width: 50, height: 50 }}
        >
          <BurgerIcon open={open} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-out lg:hidden"
        style={{
          maxHeight: open ? 480 : 0,
          background:
            'linear-gradient(0deg, var(--nav-bg-from) 0%, var(--nav-bg-to) 100%)',
        }}
      >
        <ul className="flex flex-col items-stretch gap-2 px-6 pb-6 pt-2">
          {ROUTES.map((r) => (
            <li key={r.to}>
              <NavLink to={r.to} end={r.to === '/'} onClick={() => setOpen(false)}>
                {({ isActive }) => (
                  <span
                    className={`nav-link flex h-12 w-full items-center justify-center ${isActive ? 'active' : ''}`}
                  >
                    {t(`nav.${r.key}`)}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
          <li className="mt-2 grid grid-cols-3 gap-2">
            <button onClick={toggleLocale} className="nav-link h-11 w-full">
              {locale.toUpperCase()}
            </button>
            <button
              onClick={toggleTheme}
              className="nav-link flex h-11 w-full items-center justify-center"
            >
              <ThemeIcon dark={theme === 'dark'} />
            </button>
            <a
              href={cvHref}
              download={cvFile}
              className="nav-link flex h-11 w-full items-center justify-center"
            >
              {t('nav.cv')}
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}

function ThemeIcon({ dark }) {
  return dark ? (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ) : (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function BurgerIcon({ open }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  )
}
