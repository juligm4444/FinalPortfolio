import LocaleLink, { LocaleNavLink } from '../LocaleLink.jsx'
import Logo from '../Logo.jsx'
import Socials from './Socials.jsx'
import { useLocale } from '../../i18n/LocaleProvider.jsx'

/* V3 §B.3 — left nav on desktop, top to bottom: logo, Inicio, Sobre mí,
   Proyectos, the six networks as a 2 × 3 grid of Plush Tiles right under
   Proyectos, then the language switch. Below 768 px it is a solid mist top bar
   (logo, three links, language) and the networks move to the page foot. */
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

      <Socials size={44} className="side-nav__socials" />

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
