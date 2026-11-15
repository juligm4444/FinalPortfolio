import { useEffect, useId, useRef, useState } from 'react'
import { siteTokens } from './tokens.js'
import { canLive, claim, release, isOwner } from './live.js'

/* V4 §G.4, §I.3 — a surface that turns plush under the pointer: the Plush Tile
   engine grows fur over the whole surface (rectangular, `rect`), with the
   project's image and name as the fur's artwork, parting under the cursor.
   At rest nothing runs. One live fur piece on the page at a time (live.js).
   Returns the state and the handlers to spread on the surface's element. */

let canvasModule = null
const loadCanvas = () => (canvasModule ??= import('./PlushTileCanvas.jsx'))
export const PLUSH_OVER_BLEED = 1.25 // canvas / surface; the vendor's Scale caps at 115 %

/** The surface drawn once as the fur's artwork (image above, name below, on moss),
    pre-squeezed into a square texture so the stretched cushion shows it at `aspect`. */
export async function artworkFor(src, name, aspect = 1) {
  const tok = siteTokens()
  const S = 512
  const VW = S * Math.max(aspect, 1)
  const VH = S * Math.max(1 / aspect, 1)
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  g.scale(S / VW, S / VH)
  g.fillStyle = tok.moss700
  g.fillRect(0, 0, VW, VH)
  const img = new Image()
  img.src = src
  await img.decode().catch(() => null)
  if (img.naturalWidth) {
    const bw = VW * 0.62
    const bh = VH * 0.58
    const k = Math.min(bw / img.naturalWidth, bh / img.naturalHeight)
    g.drawImage(img, (VW - img.naturalWidth * k) / 2, VH * 0.1 + (bh - img.naturalHeight * k) / 2, img.naturalWidth * k, img.naturalHeight * k)
  }
  if (name) {
    const family = getComputedStyle(document.documentElement).getPropertyValue('--font-display')
    await document.fonts.load(`italic 700 40px ${family}`)
    g.fillStyle = tok.white
    g.textAlign = 'center'
    let fs = Math.round(Math.min(VW, VH) * 0.13)
    g.font = `italic 700 ${fs}px ${family}`
    while (g.measureText(name).width > VW * 0.86 && fs > 20) g.font = `italic 700 ${--fs}px ${family}`
    g.fillText(name, VW / 2, VH * 0.86)
  }
  return c.toDataURL('image/png')
}

export function usePlushHover({ src, name, seed = 0, disabled = false }) {
  const id = useId()
  const hit = useRef(null)
  const flags = useRef({ hover: false, focus: false })
  const [live, setLive] = useState(null)
  const [leaving, setLeaving] = useState(false)
  const leaveTimer = useRef(0)

  useEffect(
    () => () => {
      clearTimeout(leaveTimer.current)
      release(id)
    },
    [id]
  )

  const stop = () => {
    release(id)
    setLive(null)
    setLeaving(false)
    hit.current?.removeAttribute('data-live')
  }
  const start = () => {
    clearTimeout(leaveTimer.current)
    setLeaving(false)
    if (disabled || !canLive() || live) return
    claim(
      id,
      async () => {
        const tok = siteTokens()
        const el = hit.current
        const r = el?.getBoundingClientRect()
        const aspect = r && r.height ? r.width / r.height : 1
        const [m, art] = await Promise.all([loadCanvas(), artworkFor(src, name, aspect)])
        if (!flags.current.hover && !flags.current.focus) return stop()
        setLive({
          Canvas: m.default,
          props: {
            rect: true,
            image: art,
            artwork: { fit: 'cover', size: 100, offsetY: 0 },
            furColor: tok.moss700,
            tipColor: tok.moss400,
            tipMix: 0.35,
            fur: { flow: 'art', lift: 3, frizz: 2, length: 3, density: 9 },
            scale: 100 / (0.7 * PLUSH_OVER_BLEED),
            radius: 6,
            puff: 4,
            breeze: 0,
            entrance: { animate: true, delay: 0, duration: 0.7 },
            response: { reach: 6, parallax: 3, strength: 7 },
            advanced: { seed: seed + 11, lightColor: tok.mist, bounce: 30, rootShade: 55, sheen: 22, emboss: 40, colorJitter: 18 },
          },
        })
      },
      () => {
        setLive(null)
        hit.current?.removeAttribute('data-live')
      }
    )
  }
  const end = () => {
    if (flags.current.hover || flags.current.focus) return
    setLeaving(true)
    hit.current?.removeAttribute('data-live')
    leaveTimer.current = setTimeout(stop, 420)
  }
  const onFrame = () => {
    if (!hit.current || !isOwner(id) || leaving) return
    if (!hit.current.hasAttribute('data-live')) hit.current.setAttribute('data-live', '')
  }
  const handlers = {
    onPointerEnter: (e) => {
      if (e.pointerType === 'touch') return
      flags.current.hover = true
      start()
    },
    onPointerLeave: () => {
      flags.current.hover = false
      end()
    },
    onFocus: (e) => {
      if (!e.currentTarget.matches(':focus-visible')) return
      flags.current.focus = true
      start()
    },
    onBlur: () => {
      flags.current.focus = false
      hit.current?.dispatchEvent(new PointerEvent('pointerleave'))
      end()
    },
  }
  return { hit, live, leaving, handlers, onFrame }
}
