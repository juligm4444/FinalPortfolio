import { useEffect, useId, useRef, useState } from 'react'
import LocaleLink from '../components/LocaleLink.jsx'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import { siteTokens } from '../components/fur/tokens.js'
import { canLive, claim, release, isOwner } from '../components/fur/live.js'

/* V4 §G.4 — a featured project. At rest: a concrete slab with the project image
   in full colour and its label printed on the concrete. On hover (or keyboard
   focus) the whole card turns plush: the Plush Tile engine (vendor PlushTile,
   ported) grows fur over the entire card, with the project image and name as
   the fur's artwork, parting under the pointer. One live fur piece at a time
   (fur/live.js). Touch: the static card; one tap opens the case. */
export const CARD_BLEED = 1.25 // canvas / card: room for the halo; the vendor's Scale caps at 115 %

let canvasModule = null
const loadCanvas = () => (canvasModule ??= import('../components/fur/PlushTileCanvas.jsx'))

/** The card drawn once as the fur's artwork: the image, then the name under it, on moss. */
async function artworkFor(src, name, tok) {
  const S = 512
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  g.fillStyle = tok.moss700
  g.fillRect(0, 0, S, S)
  const img = new Image()
  img.src = src
  await img.decode().catch(() => null)
  if (img.naturalWidth) {
    const box = S * 0.6
    const k = Math.min(box / img.naturalWidth, box / img.naturalHeight)
    g.drawImage(img, (S - img.naturalWidth * k) / 2, S * 0.1 + (box - img.naturalHeight * k) / 2, img.naturalWidth * k, img.naturalHeight * k)
  }
  const family = getComputedStyle(document.documentElement).getPropertyValue('--font-display')
  await document.fonts.load(`italic 700 40px ${family}`)
  g.fillStyle = tok.white
  g.textAlign = 'center'
  let fs = 66
  g.font = `italic 700 ${fs}px ${family}`
  while (g.measureText(name).width > S * 0.86 && fs > 24) g.font = `italic 700 ${--fs}px ${family}`
  g.fillText(name, S / 2, S * 0.86)
  return c.toDataURL('image/png')
}

export default function FeaturedCard({ work, seed = 0 }) {
  const { t } = useLocale()
  const id = useId()
  const hit = useRef(null)
  const flags = useRef({ hover: false, focus: false })
  const [live, setLive] = useState(null) // { Canvas, props }
  const [leaving, setLeaving] = useState(false)
  const leaveTimer = useRef(0)
  const label = t(`herbarium.items.${work.id}`)
  const title = t(`works.${work.id}.title`)

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
    if (!canLive() || live) return
    claim(
      id,
      async () => {
        const tok = siteTokens()
        const [m, art] = await Promise.all([loadCanvas(), artworkFor(work.media.specimen, title, tok)])
        if (!flags.current.hover && !flags.current.focus) return stop()
        setLive({
          Canvas: m.default,
          props: {
            image: art,
            artwork: { fit: 'cover', size: 100, offsetY: 0 },
            furColor: tok.moss700,
            tipColor: tok.moss400,
            tipMix: 0.35,
            fur: { flow: 'art', lift: 3, frizz: 2, length: 3, density: 9 },
            scale: 100 / (0.7 * CARD_BLEED),
            radius: 6,
            puff: 4,
            breeze: 0,
            // the fur grows in from the roots: the card turning plush
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
    // the fur fades back to the slab, then the seat is given back
    setLeaving(true)
    hit.current?.removeAttribute('data-live')
    leaveTimer.current = setTimeout(stop, 420)
  }
  const onFrame = () => {
    if (!hit.current || !isOwner(id) || leaving) return
    if (!hit.current.hasAttribute('data-live')) hit.current.setAttribute('data-live', '')
  }

  return (
    <LocaleLink
      ref={hit}
      to={work.href}
      className="feat"
      data-project-card=""
      data-card-link=""
      aria-label={`${t('projects.openCase')}: ${title}`}
      onPointerEnter={(e) => {
        if (e.pointerType === 'touch') return
        flags.current.hover = true
        start()
      }}
      onPointerLeave={() => {
        flags.current.hover = false
        end()
      }}
      onFocus={(e) => {
        if (!e.currentTarget.matches(':focus-visible')) return
        flags.current.focus = true
        start()
      }}
      onBlur={() => {
        flags.current.focus = false
        hit.current?.dispatchEvent(new PointerEvent('pointerleave'))
        end()
      }}
    >
      <span className="feat__slab concrete">
        <span className="feat__img">
          <img src={work.media.specimen} alt="" loading="lazy" decoding="async" />
        </span>
        <span className="feat__label">
          <span className="feat__name">{title}</span>
          <span className="feat__meta">
            {label.year} · {label.role}
          </span>
        </span>
      </span>
      {live && (
        <span className={`feat__fur ${leaving ? 'feat__fur--leaving' : ''}`} aria-hidden="true">
          <live.Canvas {...live.props} hitRef={hit} onFrame={onFrame} />
        </span>
      )}
    </LocaleLink>
  )
}
