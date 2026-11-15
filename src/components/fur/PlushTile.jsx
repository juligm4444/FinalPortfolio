import { useEffect, useId, useRef, useState } from 'react'
import LocaleLink from '../LocaleLink.jsx'
import { siteTokens } from './tokens.js'
import { glyphUrl } from './glyphs.js'
import { bakedSnapshot, requestSnapshot } from './snapshots.js'
import { canLive, claim, release } from './live.js'
import './fur.css'

/* V3 §B.4 — a real Plush Tile (vendor/originkit/PlushTile.tsx, ported by
   scripts/port-vendor.mjs): a fur cushion whose pile parts under the pointer and
   that leans toward it. Fur in --moss-700 with --moss-400 tips; the logo is drawn
   in the fur itself, in --mist.

   Three states, one element:
   - the control: a real <a> or <button>, always (keyboard, focus ring, a11y);
   - at rest: an image of the tile — a baked file or the off-screen snapshot of
     the real component; before either exists, a flat moss tile with the glyph;
   - live: the real WebGL tile, mounted over its image only while this tile has
     the pointer or keyboard focus (one live fur piece per page, see live.js). */

/** The canvas is this much larger than the tile: room for the fur halo and the lean. */
export const PLUSH_BLEED = 1.5

/** Everything the vendor component needs to draw one tile. Used live and for snapshots. */
export function plushProps(glyph, seed = 0) {
  const tok = siteTokens()
  return {
    image: glyphUrl(glyph, tok.mist, 3),
    artwork: { fit: 'contain', size: 72, offsetY: 0 },
    background: tok.mist,
    furColor: tok.moss700,
    tipColor: tok.moss400,
    tipMix: 0.6,
    fur: { flow: 'art', lift: 4, frizz: 3, length: 6, density: 9 },
    // The tile's footprint is exactly the control: TILE_HALF 0.7 × scale × bleed = 1.
    scale: 100 / (0.7 * PLUSH_BLEED),
    radius: 46,
    puff: 5,
    breeze: 0, // at rest it is an image; live, it settles and hands the seat back
    entrance: { animate: false },
    response: { reach: 5, parallax: 5, strength: 7 },
    advanced: { seed, lightColor: tok.mist, bounce: 30, colorJitter: 26, rootShade: 62, sheen: 22, emboss: 55 },
  }
}

export function plushJob(name, glyph, size, seed = 0) {
  const box = size * PLUSH_BLEED
  return { key: `plush-${name}-${size}`, kind: 'plush', w: box, h: box, props: plushProps(glyph, seed) }
}

let canvasModule = null
const loadCanvas = () => (canvasModule ??= import('./PlushTileCanvas.jsx'))

export default function PlushTile({ name, glyph, label, size = 44, seed = 0, to, href, download, onClick, lang, staticOnly = false, className = '', children }) {
  const id = useId()
  const hit = useRef(null)
  const seedRef = useRef(null)
  const flags = useRef({ hover: false, focus: false })
  const key = `plush-${name}-${size}`
  const [rest, setRest] = useState(() => bakedSnapshot(key))
  const [live, setLive] = useState(null) // { Canvas, props }

  // Rest image: baked if there is one, else ask the off-screen studio for it.
  useEffect(() => {
    if (rest) return
    return requestSnapshot(plushJob(name, glyph, size, seed), setRest)
  }, [rest, name, glyph, size, seed])

  useEffect(() => () => release(id), [id])

  const stop = () => {
    release(id)
    setLive(null)
    hit.current?.removeAttribute('data-live')
  }
  const start = (point) => {
    if (staticOnly || !canLive()) return
    seedRef.current = point
    claim(
      id,
      () =>
        loadCanvas().then((m) => {
          if (!flags.current.hover && !flags.current.focus) return stop()
          setLive({ Canvas: m.default, props: plushProps(glyph, seed) })
        }),
      () => {
        setLive(null)
        hit.current?.removeAttribute('data-live')
      }
    )
  }
  const onFrame = (_, meta) => {
    const el = hit.current
    if (!el) return
    // First live frame: the canvas takes over from the image underneath it.
    if (!el.hasAttribute('data-live')) el.setAttribute('data-live', '')
    // Back at rest and nobody is here: become an image again.
    if (meta.settled && !meta.over && !flags.current.hover && !flags.current.focus) stop()
  }

  const handlers = staticOnly
    ? {}
    : {
        onPointerEnter: (e) => {
          if (e.pointerType === 'touch') return
          flags.current.hover = true
          start({ x: e.clientX, y: e.clientY })
        },
        onPointerLeave: () => {
          flags.current.hover = false
        },
        onFocus: (e) => {
          if (!e.currentTarget.matches(':focus-visible')) return
          flags.current.focus = true
          const r = e.currentTarget.getBoundingClientRect()
          start({ x: r.left + r.width * 0.5, y: r.top + r.height * 0.5 })
        },
        onBlur: () => {
          flags.current.focus = false
          // The live tile only knows pointers: tell it the "finger" left.
          if (!flags.current.hover) hit.current?.dispatchEvent(new PointerEvent('pointerleave'))
        },
      }

  const common = {
    ref: hit,
    className: `plush ${className}`.trim(),
    'aria-label': label,
    title: label,
    lang,
    style: { '--pt': `${size}px`, '--pt-bleed': PLUSH_BLEED },
    onClick,
    ...handlers,
  }
  const body = (
    <>
      <span className="plush__rest" aria-hidden="true">
        {rest ? (
          <img src={rest} alt="" width={size * PLUSH_BLEED} height={size * PLUSH_BLEED} decoding="async" draggable="false" />
        ) : (
          <FlatGlyph glyph={glyph} />
        )}
      </span>
      {live && (
        <span className="plush__live" aria-hidden="true">
          <live.Canvas {...live.props} hitRef={hit} pointerSeed={seedRef.current} onFrame={onFrame} />
        </span>
      )}
      {children}
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

/* Before the rest image exists (or with no WebGL2 at all): a flat moss tile, glyph in mist. */
function FlatGlyph({ glyph }) {
  // The mask needs no colour of its own: any opaque ink works.
  const mask = `url("${glyphUrl(glyph, 'black', 2.6)}")`
  return (
    <span className="plush__flat">
      <span className="plush__glyph" style={{ WebkitMaskImage: mask, maskImage: mask }} />
    </span>
  )
}
