import { Routes, Route, Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import AppShell from './components/shell/AppShell.jsx'
import Seo from './components/shell/Seo.jsx'
import { LocaleProvider, preferredLocale } from './i18n/LocaleProvider.jsx'
import { isLocale, localePath, splitLocale, LOCALES } from './i18n/routes.js'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Projects from './pages/Projects.jsx'
import Lab from './pages/Lab.jsx'
import CaseCrack from './components/CaseCrack.jsx'
import Candelaria, { CandelariaWebsite } from './pages/projects/Candelaria.jsx'
import Licorimetro from './pages/projects/Licorimetro.jsx'
import Sensewave from './pages/projects/Sensewave.jsx'
import Umbral from './pages/projects/Umbral.jsx'
import Bloom from './pages/projects/Bloom.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

/* `/` and any path without a language prefix: send the visitor to the same
   page under the language they prefer. Unknown pages go home. */
function LocaleRedirect() {
  const { pathname, search, hash } = useLocation()
  const { locale, path } = splitLocale(pathname)
  const target = locale ?? preferredLocale()
  return <Navigate to={localePath(target, path) + search + hash} replace />
}

function NotFound() {
  const { lang } = useParams()
  return <Navigate to={localePath(isLocale(lang) ? lang : 'es', '/')} replace />
}

/* Case studies: the route sets the project's palette (cases.css, [data-case])
   and plays the crack entrance. Keyed by slug so moving between two cases replays it. */
function CaseLayout() {
  const { pathname } = useLocation()
  const slug = splitLocale(pathname).path.split('/')[2] ?? ''
  return (
    <div className="case" data-case={slug} key={slug}>
      <CaseCrack />
      <Outlet />
    </div>
  )
}

/* Everything under /:lang. Validates the prefix, owns the locale and the shell. */
function LangLayout() {
  const { lang } = useParams()
  if (!isLocale(lang)) return <LocaleRedirect />

  return (
    <LocaleProvider locale={lang}>
      <Seo />
      <AppShell>
        <ScrollToTop />
        <Outlet />
      </AppShell>
    </LocaleProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/:lang" element={<LangLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route element={<CaseLayout />}>
          <Route path="projects/candelaria" element={<Candelaria />} />
          <Route path="projects/candelaria-website" element={<CandelariaWebsite />} />
          <Route path="projects/licorimetro" element={<Licorimetro />} />
          <Route path="projects/sensewave" element={<Sensewave />} />
          <Route path="projects/umbral" element={<Umbral />} />
          <Route path="projects/bloom" element={<Bloom />} />
        </Route>
        <Route path="lab" element={<Lab />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<LocaleRedirect />} />
    </Routes>
  )
}

export { LOCALES }
