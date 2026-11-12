import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import homeBlur from '../../assets/backgrounds/bg-home.webp'
import homeSharp from '../../assets/backgrounds/bg-home-sharp.webp'
import aboutBlur from '../../assets/backgrounds/bg-about.webp'
import aboutSharp from '../../assets/backgrounds/bg-about-sharp.webp'
import projectsBlur from '../../assets/backgrounds/bg-projects.webp'
import projectsSharp from '../../assets/backgrounds/bg-projects-sharp.webp'

/* REDESIGN §5 — one fixed landscape per route. The blur is baked into the
   file (no `filter: blur`). On a route change the sharp frame shows for an
   instant and the blurred one fades back over it. */
const BACKGROUNDS = {
  home: { blur: homeBlur, sharp: homeSharp },
  about: { blur: aboutBlur, sharp: aboutSharp },
  projects: { blur: projectsBlur, sharp: projectsSharp },
}

const FOCUS_HOLD_MS = 220
const BLUR_IN_MS = 900

/** `/`, `/es`, `/en/about`, `/es/projects/umbral` → home | about | projects */
export function routeKeyFor(pathname) {
  const seg = pathname.split('/').filter(Boolean).filter((s) => s !== 'es' && s !== 'en')
  if (seg.length === 0) return 'home'
  if (seg[0] === 'about') return 'about'
  if (seg[0] === 'projects') return 'projects'
  return 'home'
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export default function RouteBackground() {
  const { pathname } = useLocation()
  const route = routeKeyFor(pathname)
  const el = useRef(null)
  const first = useRef(true)

  useEffect(() => {
    document.documentElement.setAttribute('data-route', route)
  }, [route])

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (prefersReducedMotion() || !el.current) return
    // The flash is a DOM attribute, not React state: it is purely visual,
    // lasts a fraction of a second and must not re-render the tree.
    const node = el.current
    node.setAttribute('data-focused', '')
    const id = setTimeout(() => node.removeAttribute('data-focused'), FOCUS_HOLD_MS)
    return () => {
      clearTimeout(id)
      node.removeAttribute('data-focused')
    }
  }, [route])

  const bg = BACKGROUNDS[route]

  return (
    <div ref={el} className="route-bg" aria-hidden="true">
      {Object.entries(BACKGROUNDS).map(([key, { sharp }]) => (
        <img
          key={`${key}-sharp`}
          className="route-bg__layer route-bg__layer--sharp"
          src={sharp}
          alt=""
          decoding="async"
          loading={key === route ? 'eager' : 'lazy'}
          data-active={key === route || undefined}
        />
      ))}
      <img
        key={`${route}-blur`}
        className="route-bg__layer route-bg__layer--blur"
        src={bg.blur}
        alt=""
        decoding="async"
        style={{ transitionDuration: `${BLUR_IN_MS}ms` }}
      />
    </div>
  )
}
