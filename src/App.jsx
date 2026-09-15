import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import PillarsBackground from './components/PillarsBackground.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Projects from './pages/Projects.jsx'
import Contact from './pages/Contact.jsx'
import Candelaria from './pages/projects/Candelaria.jsx'
import Licorimetro from './pages/projects/Licorimetro.jsx'
import Sensewave from './pages/projects/Sensewave.jsx'
import Humbral from './pages/projects/Humbral.jsx'
import Bloom from './pages/projects/Bloom.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  // The honeycomb is the homepage's signature. Everywhere else it competes
  // with the work itself, so it only renders at "/".
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  // The showcase is sized to the viewport and must not scroll. Flagging it on
  // <html> lets the stylesheet lock the page and size the panels in one place,
  // rather than the page fighting its own layout from JS.
  const isShowcase = pathname === '/projects'

  useEffect(() => {
    const root = document.documentElement
    if (isShowcase) root.setAttribute('data-locked', 'true')
    else root.removeAttribute('data-locked')
    return () => root.removeAttribute('data-locked')
  }, [isShowcase])

  return (
    <div
      className={`relative flex w-full flex-col ${isShowcase ? 'h-[100dvh]' : 'min-h-screen'}`}
    >
      {isHome && <PillarsBackground />}
      <Navbar />
      <ScrollToTop />
      <main className="relative z-10 min-h-0 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/candelaria" element={<Candelaria />} />
          <Route path="/projects/licorimetro" element={<Licorimetro />} />
          <Route path="/projects/sensewave" element={<Sensewave />} />
          <Route path="/projects/humbral" element={<Humbral />} />
          <Route path="/projects/bloom" element={<Bloom />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <div className="relative z-10 shrink-0">
        <Footer compact={isShowcase} />
      </div>
    </div>
  )
}
