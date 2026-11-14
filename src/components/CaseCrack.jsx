import { useEffect, useState } from 'react'

/* REDESIGN §5: entering a case, a crack opens and the project's colour floods.
   Mounted on the client only (never in the prerender), keyed by route so it
   replays between cases, and removed when the animation ends. */
export default function CaseCrack() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const show = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(show)
  }, [])
  if (!on) return null
  return (
    <div className="crack" aria-hidden="true" onAnimationEnd={(e) => e.animationName === 'crack-flood' && setOn(false)}>
      <div className="crack__flood" />
      <div className="crack__half crack__half--l" />
      <div className="crack__half crack__half--r" />
    </div>
  )
}
