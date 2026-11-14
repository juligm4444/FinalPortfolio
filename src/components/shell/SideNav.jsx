import LocaleLink, { LocaleNavLink } from '../LocaleLink.jsx'
import Logo from '../Logo.jsx'
import { useLocale } from '../../i18n/LocaleProvider.jsx'

/* REDESIGN §5 — vertical nav on the left. Every control is a real <a> or
   <button>; the active state is a raised concrete pill sized to its label.
   Below `md` the same list lays out as a top row. */
const ROUTES = [
  { to: '/', key: 'home', end: true },
  { to: '/about', key: 'about' },
  { to: '/projects', key: 'projects' },
]

export default function SideNav() {
  const { t, locale, toggle } = useLocale()
  const other = locale === 'es' ? 'en' : 'es'

  return (
    <nav className="side-nav" aria-label={t('nav.label')}>
      <LocaleLink to="/" className="side-nav__brand" aria-label={t('nav.homeAria')}>
        <Logo size={36} />
      </LocaleLink>

      <ul className="side-nav__list">
        {ROUTES.map((r) => (
          <li key={r.key}>
            <LocaleNavLink to={r.to} end={r.end} className="nav-pill">
              {t(`nav.${r.key}`)}
            </LocaleNavLink>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="nav-pill nav-pill--lang"
        onClick={toggle}
        aria-label={`${t(`nav.langShort.${other}`)} — ${t(`nav.langSwitch.${other}`)}`}
        lang={other}
      >
        {t(`nav.langShort.${other}`)}
      </button>
    </nav>
  )
}
