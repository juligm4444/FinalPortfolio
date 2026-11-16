import { useEffect, useState } from 'react'
import { useWebGL } from '../webgl/index.js'
import still from '../assets/backgrounds/moonlit-still.webp'
import './MoonlitPetals.css'

/* REDESIGN §10 — Moonlit Petals, the ocobo scene that closes About, here as
   an overcast-day tree in the site palette. Two layers:
   1. a still frame of the scene (static fallback: no WebGL2, reduced motion,
      low-end, over budget, and what the prerender ships);
   2. the live canvas, loaded on demand and mounted only while src/webgl grants
      this component a slot (REDESIGN §4.1).
   `label` describes the scene for assistive tech, in the page's language. */
export default function MoonlitPetals({ label, lang, id, className = '', transparent = false }) {
  const { ref, active } = useWebGL({ id })
  const [Scene, setScene] = useState(null)

  useEffect(() => {
    if (!active) return
    let cancelled = false
    import('./MoonlitPetalsCanvas.jsx').then((m) => {
      if (!cancelled) setScene(() => m.default)
    })
    return () => {
      cancelled = true
      setScene(null)
    }
  }, [active])

  return (
    <div
      ref={ref}
      className={`moonlit ${className}`}
      role="img"
      aria-label={label}
      lang={lang}
      data-webgl={active && Scene ? 'active' : 'fallback'}
    >
      <img className="moonlit__still" src={still} alt="" width="1200" height="800" decoding="async" />
      {active && Scene && (
        <div className="moonlit__live" aria-hidden="true">
          <Scene transparent={transparent} />
        </div>
      )}
    </div>
  )
}
