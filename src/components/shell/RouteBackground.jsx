import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import home from '../../assets/backgrounds/bg-home.webp'
import about from '../../assets/backgrounds/bg-about.webp'
import projects from '../../assets/backgrounds/bg-projects.webp'

/* V3 §B.2 — the fixed route landscape is the page's air, not a box behind the
   text. Its opacity follows the scroll: full in the first screen of Home, then
   down to FOG_FLOOR over --mist once the hero is passed, so section text stands
   on an almost flat mist. Routes without a hero start at FOG_PAGE_TOP (the text
   begins in their first screen) and reach the floor within half a screen.
   Both numbers are checked by `npm run check:contrast` against the darkest
   pixel of each landscape (text --concrete-500 ≥ 4.5:1). Changing route
   cross-fades the landscapes (350 ms); there is no sharp-to-blur flash. */
export const FOG_FLOOR = 0.18
export const FOG_PAGE_TOP = 0.32

const BACKGROUNDS = { home, about, projects }

/** `/`, `/es`, `/en/about`, `/es/projects/umbral` → home | about | projects */
export function routeKeyFor(pathname) {
  const seg = pathname.split('/').filter(Boolean).filter((s) => s !== 'es' && s !== 'en')
  if (seg.length === 0) return 'home'
  if (seg[0] === 'about') return 'about'
  if (seg[0] === 'projects') return 'projects'
  return 'home'
}

const isHome = (pathname) => pathname.split('/').filter(Boolean).filter((s) => s !== 'es' && s !== 'en').length === 0

export default function RouteBackground() {
  const { pathname } = useLocation()
  const route = routeKeyFor(pathname)
  const home = isHome(pathname)
  const el = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-route', route)
  }, [route])

  useEffect(() => {
    const node = el.current
    if (!node) return
    let raf = 0
    const top = home ? 1 : FOG_PAGE_TOP
    const update = () => {
      raf = 0
      const vh = window.innerHeight || 1
      // Home: hold full while the hero is in view, fog down as it scrolls out.
      const span = home ? vh * 0.75 : vh * 0.5
      const start = home ? vh * 0.1 : 0
      const p = Math.min(1, Math.max(0, (window.scrollY - start) / span))
      const k = p * p * (3 - 2 * p)
      node.style.setProperty('--fog', (top + (FOG_FLOOR - top) * k).toFixed(3))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [home])

  return (
    <div ref={el} className="route-bg" aria-hidden="true" style={{ '--fog': home ? 1 : FOG_PAGE_TOP }}>
      {Object.entries(BACKGROUNDS).map(([key, src]) => (
        <img
          key={key}
          className="route-bg__layer"
          src={src}
          alt=""
          decoding="async"
          loading={key === route ? 'eager' : 'lazy'}
          data-active={key === route || undefined}
        />
      ))}
    </div>
  )
}
