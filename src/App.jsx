import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AppShell from './components/shell/AppShell.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Projects from './pages/Projects.jsx'
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

export default function App() {
  const { pathname } = useLocation()
  // The showcase is sized to the viewport and must not scroll. Flagging it on
  // <html> lets the stylesheet lock the page in one place.
  const isShowcase = pathname === '/projects'

  useEffect(() => {
    const root = document.documentElement
    if (isShowcase) root.setAttribute('data-locked', 'true')
    else root.removeAttribute('data-locked')
    return () => root.removeAttribute('data-locked')
  }, [isShowcase])

  return (
    <AppShell locked={isShowcase}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/candelaria" element={<Candelaria />} />
        <Route path="/projects/candelaria-website" element={<CandelariaWebsite />} />
        <Route path="/projects/licorimetro" element={<Licorimetro />} />
        <Route path="/projects/sensewave" element={<Sensewave />} />
        <Route path="/projects/umbral" element={<Umbral />} />
        <Route path="/projects/bloom" element={<Bloom />} />
      </Routes>
    </AppShell>
  )
}
