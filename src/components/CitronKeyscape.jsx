import { useEffect, useState } from 'react'
import { useWebGL } from '../webgl/index.js'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import still from '../assets/backgrounds/keyscape-still.webp'
import logo from '../assets/identity/Logo.png'
import './CitronKeyscape.css'

/* REDESIGN §5 — the "Herramientas" block: concrete keys, one technology per key,
   the site's logo on the central one. The words come from translations.js
   (`keyscape.items`), so the language switch re-prints them. Two layers:
   1. a still frame (static fallback: no WebGL2, reduced motion, low-end, over budget,
      and what the prerender ships) with the technologies as a real, visually hidden
      list in the DOM;
   2. the live scene, loaded on demand and mounted only while src/webgl grants a slot.
   It is the heaviest component on the site. If the device cannot hold ~25 fps even
   at the resolution floor, the scene reports "slow" and this wrapper goes back to
   the still for the rest of the visit. */
export default function CitronKeyscape({ id, className = '', lang: forcedLang }) {
  const { t, locale } = useLocale()
  const [slow, setSlow] = useState(false)
  // Once the device has proved too slow the slot goes back to the budget for good.
  const { ref, active } = useWebGL({ id, disabled: slow })
  const [Scene, setScene] = useState(null)
  const [status, setStatus] = useState('pending')

  const words = t('keyscape.items')
  const caption = t('keyscape.caption')

  useEffect(() => {
    if (!active || slow) return
    let cancelled = false
    import('./CitronKeyscapeCanvas.jsx').then((m) => {
      if (!cancelled) setScene(() => m.default)
    })
    return () => {
      cancelled = true
      setScene(null)
      setStatus('pending')
    }
  }, [active, slow])

  const onStatus = (s) => {
    if (s === 'slow') setSlow(true)
    else setStatus(s)
  }
  const live = Boolean(active && Scene && !slow && status === 'ready')

  return (
    <div
      ref={ref}
      className={`keyscape ${className}`}
      role="img"
      aria-label={t('keyscape.label')}
      lang={forcedLang ?? locale}
      data-webgl={live ? 'active' : 'fallback'}
    >
      <img className="keyscape__still" src={still} alt="" width="1200" height="900" decoding="async" />
      {active && Scene && !slow && (
        <div className="keyscape__live" aria-hidden="true">
          <Scene words={words} captionLines={[caption]} logo={logo} onStatus={onStatus} />
        </div>
      )}
      <ul className="sr-only">
        {words.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
    </div>
  )
}
