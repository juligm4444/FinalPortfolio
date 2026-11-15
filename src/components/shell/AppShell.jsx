import { useEffect } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLocale } from '../../i18n/LocaleProvider.jsx'
import RouteBackground from './RouteBackground.jsx'
import SideNav from './SideNav.jsx'
import Socials from './Socials.jsx'
import FurSnapshotter from '../fur/FurSnapshotter.jsx'
import { install as installBloom } from '../botanical/host.js'

/* V3 §B.6 — page change, 350 ms in all: the page that leaves fades while rising
   8 px (175 ms), the route backgrounds cross-fade underneath, the new page comes
   in from 8 px below (175 ms). No interstitial, no spinner, no blur. Every route
   is in the main bundle, so there is never a Suspense fallback to show. With
   reduced motion: a straight cut. The scroll resets once the old page is gone. */
const HALF = 0.175

function PageSwap() {
  const { pathname } = useLocation()
  const outlet = useOutlet()
  const reduce = useReducedMotion()
  const t = reduce ? { duration: 0 } : { duration: HALF, ease: [0.2, 0.6, 0.2, 1] }
  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
      <motion.div
        key={pathname}
        className="page"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: t }}
        exit={reduce ? { opacity: 1, transition: t } : { opacity: 0, y: -8, transition: t }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  )
}

export default function AppShell() {
  const { t } = useLocale()
  useEffect(() => installBloom(), [])
  return (
    <div className="shell">
      <a href="#main" className="skip-link">
        {t('nav.skip')}
      </a>
      <RouteBackground />
      <SideNav />
      <main id="main" className="shell__main" tabIndex={-1}>
        <PageSwap />
      </main>
      <footer className="shell__foot">
        <Socials size={44} staticOnly />
      </footer>
      <FurSnapshotter />
    </div>
  )
}
