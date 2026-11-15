import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import LocaleLink from '../LocaleLink.jsx'
import { siteTokens, siteFont, mixColors } from './tokens.js'
import { requestSnapshot } from './snapshots.js'
import { canLive, claim, release, isOwner } from './live.js'
import './fur.css'

/* V3 §C — the only two kinds of button on the site, both fur:
   - `velour`: primary, Velour Bolster (vendor/originkit/VelourBolster.tsx), moss
     velour, label in mist. At most one per visible screen.
   - `mohair`: secondary, Mohair Capsule (vendor/originkit/MohairCapsule.md):
     light moss fur (--moss-200), moss-700 roots, label in concrete-900.
   Both ported unmodified-plus-patches by scripts/port-vendor.mjs.

   Same three states as a Plush Tile: the control is always a real <a>/<button>
   of the button's own size; at rest the box shows the snapshot of the real
   component (before it exists, a flat pill in the same colours with the label);
   live, the real canvas is mounted over it only while it has the pointer or
   keyboard focus. Touch and reduced motion: the image only. */

const MARGIN = { mohair: 1.0, velour: 0.8 } // the vendor's canvas room, in button heights

function propsFor(kind, label, w, h, pressed = false) {
  const tok = siteTokens()
  const font = { fontFamily: siteFont('--font-label').split(',')[0].replace(/['"]/g, '').trim(), fontWeight: 700, letterSpacing: '0.08em', fontSize: `${Math.round(h * 0.3)}px` }
  const common = { fit: true, buttonWidth: w, buttonHeight: h, radius: h / 2, font, placement: { x: 0, y: 0, angle: 0, tilt: 0 } }
  if (kind === 'velour')
    // pressed (the current page in the nav): brighter fur, a lower shadow
    return { ...common, text: label, fabric: pressed ? mixColors(tok.moss700, tok.moss400, 0.58) : tok.moss700, textColor: tok.mist, drift: 2, advanced: { shadow: pressed ? 12 : 30, glow: 0 } }
  return {
    ...common,
    // V4 §D.2: the label is drawn into the fur as its artwork, so the letters part under the
    // pointer; the DOM label stays for assistive tech, visually hidden.
    label,
    font: { ...font, fontSize: `${Math.round(h * (label.length <= 3 ? 0.52 : 0.4))}px`, fontWeight: 700 },
    furColor: tok.moss200,
    textColor: tok.concrete900,
    tipColor: tok.mist,
    rootColor: tok.moss700,
    furLength: 1,
    sway: 0,
    advanced: { shadow: 26, glow: 0, flyaways: 2, swirl: 30, lockSize: 3, strands: 80 },
  }
}

const loaders = {
  mohair: () => import('./MohairCapsuleCanvas.jsx'),
  velour: () => import('./VelourBolsterCanvas.jsx'),
}

/* Buttons are sized for a 900 px tall window and scale with its height (V4 §B: a
   2560/3440 screen gets larger pieces). Server and first paint use 1. */
const scaleOf = () => Math.max(0.88, Math.min(1.7, Math.round((window.innerHeight / 900) * 20) / 20))
const subscribeResize = (fn) => {
  window.addEventListener('resize', fn)
  return () => window.removeEventListener('resize', fn)
}
export function useFurScale() {
  return useSyncExternalStore(subscribeResize, scaleOf, () => 1)
}

/** Width a label needs at height `h` (label is ~0.3 h in Space Grotesk caps). */
export function fitWidth(label, h, min = 0) {
  return Math.max(min, Math.round(h * 1.2 + label.length * h * 0.25))
}

export default function FurButton({ kind = 'mohair', label, to, href, download, onClick, lang, height = 52, width, pressed = false, className = '', ...attrs }) {
  const id = useId()
  const hit = useRef(null)
  const flags = useRef({ hover: false, focus: false })
  const text = label.toLocaleUpperCase(lang)
  const k = useFurScale()
  const h = Math.round(height * k)
  const w = width ? Math.round(width * k) : fitWidth(text, h)
  const m = MARGIN[kind] * h
  const key = `${kind}-${text}-${w}x${h}${pressed ? '-on' : ''}`
  const [snap, setSnap] = useState({ key: null, url: null })
  const rest = snap.key === key ? snap.url : null
  const [live, setLive] = useState(null)

  useEffect(() => {
    return requestSnapshot({ key, kind, w: w + 2 * m, h: h + 2 * m, props: propsFor(kind, text, w, h, pressed) }, (url) => setSnap({ key, url }))
  }, [key, kind, text, w, h, m])

  useEffect(() => () => release(id), [id])

  const stop = () => {
    release(id)
    setLive(null)
    hit.current?.removeAttribute('data-live')
  }
  const start = () => {
    if (!canLive()) return
    claim(
      id,
      () =>
        loaders[kind]().then((mod) => {
          if (!flags.current.hover && !flags.current.focus) return stop()
          setLive({ Canvas: mod.default, props: { ...propsFor(kind, text, w, h, pressed), sway: kind === 'mohair' ? 3 : undefined } })
        }),
      () => {
        setLive(null)
        hit.current?.removeAttribute('data-live')
      }
    )
  }
  const onFrame = (_, meta) => {
    const el = hit.current
    // A frame can land after this piece gave its seat back: never flip to live then.
    if (!el || !isOwner(id)) return
    if (!el.hasAttribute('data-live')) el.setAttribute('data-live', '')
    if (meta.settled && !meta.over && !flags.current.hover && !flags.current.focus) stop()
  }

  const common = {
    ref: hit,
    className: `fur-btn fur-btn--${kind} ${rest ? 'fur-btn--img' : ''} ${pressed ? 'fur-btn--pressed' : ''} ${className}`.trim(),
    'aria-current': pressed ? 'page' : undefined,
    style: { '--fb-w': `${w}px`, '--fb-h': `${h}px`, '--fb-m': `${m}px` },
    lang,
    onClick,
    onPointerEnter: (e) => {
      if (e.pointerType === 'touch') return
      flags.current.hover = true
      start()
    },
    onPointerLeave: () => {
      flags.current.hover = false
    },
    onFocus: (e) => {
      if (!e.currentTarget.matches(':focus-visible')) return
      flags.current.focus = true
      start()
    },
    onBlur: () => {
      flags.current.focus = false
      if (!flags.current.hover) hit.current?.dispatchEvent(new PointerEvent('pointerleave'))
    },
    ...attrs,
  }
  const body = (
    <>
      {rest && (
        <span className="fur-btn__rest" aria-hidden="true">
          <img src={rest} alt="" decoding="async" draggable="false" />
        </span>
      )}
      {live && (
        <span className="fur-btn__live" aria-hidden="true">
          <live.Canvas {...live.props} hitRef={hit} onFrame={onFrame} style={{ width: w + 2 * m, height: h + 2 * m, aspectRatio: 'auto' }} />
        </span>
      )}
      <span className="fur-btn__label">{label}</span>
    </>
  )
  if (to) return <LocaleLink to={to} {...common}>{body}</LocaleLink>
  if (href)
    return (
      <a href={href} {...(download ? { download } : { target: '_blank', rel: 'noopener noreferrer' })} {...common}>
        {body}
      </a>
    )
  return (
    <button type="button" {...common}>
      {body}
    </button>
  )
}

export function MohairButton(props) {
  return <FurButton kind="mohair" {...props} />
}
