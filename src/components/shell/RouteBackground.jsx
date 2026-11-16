import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import home from '../../assets/backgrounds/bg-home-sharp.webp'
import about from '../../assets/backgrounds/bg-about-sharp.webp'
import projects from '../../assets/backgrounds/bg-projects-sharp.webp'

/* V4 §1 — the scene is the page. One fixed landscape per route (the sharp
   files the owner chose), visible for the whole scroll on every route; case
   studies use the Projects scene. Only a light blur (~4 px at 1440) and a mist
   veil under 15 %. It drifts up to 40 px with the scroll (parallax). Above it:
   a slow fog layer and a few falling petals; both stop when the tab is hidden
   and are absent with prefers-reduced-motion. Changing route cross-fades the
   landscapes. */
const BACKGROUNDS = { home, about, projects }
export const PARALLAX_PX = 40
export const VEIL = 0.12

/** `/`, `/es`, `/en/about`, `/es/projects/umbral`, `/en/toolkit` → home | about | projects */
export function routeKeyFor(pathname) {
  const seg = pathname.split('/').filter(Boolean).filter((s) => s !== 'es' && s !== 'en')
  if (seg.length === 0) return 'home'
  if (seg[0] === 'about') return 'about'
  if (seg[0] === 'projects' || seg[0] === 'toolkit') return 'projects'
  return 'home'
}

// Petals: few, slow, each with its own path. Deterministic so server and client agree.
const PETALS = Array.from({ length: 9 }, (_, i) => {
  const r = (k) => {
    const x = Math.sin((i + 1) * 12.9898 + k * 78.233) * 43758.5453
    return x - Math.floor(x)
  }
  return { left: 4 + r(1) * 92, delay: -r(2) * 26, dur: 18 + r(3) * 14, drift: (r(4) - 0.5) * 30, size: 8 + r(5) * 8, hue: i % 4 }
})

export default function RouteBackground() {
  const { pathname } = useLocation()
  const route = routeKeyFor(pathname)
  const el = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-route', route)
  }, [route])

  // Parallax: up to PARALLAX_PX of travel over the page's scroll.
  useEffect(() => {
    const node = el.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      node.style.setProperty('--scene-shift', `${(-(window.scrollY / max) * PARALLAX_PX).toFixed(1)}px`)
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
  }, [pathname])

  // Hidden tab: the fog and petals stop.
  useEffect(() => {
    const node = el.current
    const on = () => node?.toggleAttribute('data-paused', document.hidden)
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])

  return (
    <div ref={el} className="scene" aria-hidden="true" style={{ '--veil': VEIL }}>
      <div className="scene__land">
        {Object.entries(BACKGROUNDS).map(([key, src]) => (
          <img key={key} className="scene__img" src={src} alt="" decoding="async" loading={key === route ? 'eager' : 'lazy'} data-active={key === route || undefined} />
        ))}
      </div>
      <div className="scene__veil" />
      <div className="scene__fog scene__fog--a" />
      <div className="scene__fog scene__fog--b" />
      <div className="scene__petals">
        {PETALS.map((p, i) => (
          <span
            key={i}
            className={`petal petal--${p.hue}`}
            style={{ left: `${p.left.toFixed(2)}%`, animationDelay: `${p.delay.toFixed(2)}s`, animationDuration: `${p.dur.toFixed(2)}s`, '--drift': `${p.drift.toFixed(1)}vw`, '--size': `${p.size.toFixed(1)}px` }}
          />
        ))}
      </div>
    </div>
  )
}
