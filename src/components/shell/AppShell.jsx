import { useLocale } from '../../i18n/LocaleProvider.jsx'
import RouteBackground from './RouteBackground.jsx'
import SideNav from './SideNav.jsx'
import Dock from './Dock.jsx'

/* REDESIGN §5 — the shell every route shares: background, side nav, dock.
   Pages render inside <main>; the shell owns the offsets so pages never
   compute them. */
export default function AppShell({ children, locked = false }) {
  const { t } = useLocale()
  return (
    <div className={`shell ${locked ? 'shell--locked' : ''}`}>
      <a href="#main" className="skip-link">
        {t('nav.skip')}
      </a>
      <RouteBackground />
      <SideNav />
      <main id="main" className="shell__main" tabIndex={-1}>
        {children}
      </main>
      <Dock />
    </div>
  )
}
