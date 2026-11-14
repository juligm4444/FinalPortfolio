import { useEffect, useRef, useState } from 'react'
import { useWebGL } from '../webgl/index.js'
import LocaleLink from './LocaleLink.jsx'
import './VelourBolster.css'

/* REDESIGN §7 — primary button (one or two per screen). The control is a real
   <a> or <button> in every state, so keyboard, focus ring and assistive tech
   never depend on WebGL. Two layers around it:
   1. static fallback: the control itself, styled as a flat moss pill;
   2. the live cushion, loaded on demand and mounted only while src/webgl grants
      a slot (REDESIGN §4.1); the control then turns transparent over it.
   The box is the button: size it with `width`/`height` (CSS px); the canvas,
   pill radius and label all follow. `to` = internal route, `href` = external. */
export default function VelourBolster({ label, to, href, onClick, lang, width = 240, height = 68, id, className = '' }) {
  const { ref, active } = useWebGL({ id })
  const hitRef = useRef(null)
  const pulseRef = useRef(null)
  const [Scene, setScene] = useState(null)
  const [status, setStatus] = useState('pending')

  useEffect(() => {
    if (!active) return
    let cancelled = false
    import('./VelourBolsterCanvas.jsx').then((m) => {
      if (!cancelled) setScene(() => m.default)
    })
    return () => {
      cancelled = true
      setScene(null)
      setStatus('pending')
    }
  }, [active])

  const live = Boolean(active && Scene && status === 'ready')
  const common = {
    ref: hitRef,
    className: 'velour__hit',
    'data-vb-hit': '',
    onClick: (e) => {
      pulseRef.current?.()
      onClick?.(e)
    },
  }
  let control
  if (to) control = <LocaleLink to={to} {...common}>{label}</LocaleLink>
  else if (href)
    control = (
      <a href={href} target="_blank" rel="noopener noreferrer" {...common}>
        {label}
      </a>
    )
  else
    control = (
      <button type="button" {...common}>
        {label}
      </button>
    )

  return (
    <div
      ref={ref}
      className={`velour ${live ? 'velour--live' : ''} ${className}`}
      lang={lang}
      data-webgl={live ? 'active' : 'fallback'}
      style={{ '--vb-w': `${width}px`, '--vb-h': `${height}px` }}
    >
      {active && Scene && status !== 'failed' && (
        <Scene text={label.toLocaleUpperCase(lang)} hitRef={hitRef} pulseRef={pulseRef} onStatus={setStatus} />
      )}
      {control}
    </div>
  )
}
