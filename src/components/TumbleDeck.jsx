import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import './TumbleDeck.css'

/* Tumble Deck — adapted from vendor/21st/tumble-deck-showcase.tsx (kept unmodified).
   A stack of website screenshots standing on edge; the front card tips forward
   onto the floor and the next one rises. Changes from the original:
   - JavaScript, no shadcn/Tailwind tokens: colours are the site's (--surface,
     --border, --text, --focus-ring); the shade is --concrete-900.
   - It does not hijack the page scroll: the wheel only flips cards while the
     pointer is over the deck AND the deck has focus or is being dragged; a plain
     wheel over it scrolls the page as usual. Keyboard, click and drag flip it.
   - The visible front card is announced (aria-live) with its title and status,
     and `onFront` reports it so the page can show its link. The accessible
     alternative (a plain list of every site) lives in the page, not here.
   - Pure CSS 3D, no WebGL: it does not take a slot in src/webgl. With reduced
     motion it steps card by card with no animation. */

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const wrap = (k, n) => (n ? ((k % n) + n) % n : 0)

export function fallAngle(t) {
  const u = clamp01(t)
  const land = 0.78
  if (u <= land) {
    const k = u / land
    return -90 * k * k * k
  }
  const k = (u - land) / (1 - land)
  return -90 + 6 * Math.sin(Math.PI * k) * (1 - k)
}

export function deckAdvance(pos) {
  const i = Math.floor(pos)
  const f = pos - i
  const k = clamp01((f - 0.28) / 0.6)
  return i + k * k * (3 - 2 * k)
}

export function cardPose(k, pos, depth) {
  const t = pos - k
  const lift = (k - Math.floor(pos) + 3) * 0.6
  if (t >= 1) return { angle: -90, z: 0, lift, opacity: t < 3 ? 1 : 0, flat: true }
  if (t > 0) return { angle: fallAngle(t), z: 0, lift, opacity: 1, flat: false }
  const rel = k - deckAdvance(pos)
  const opacity = clamp01(depth + 1 - rel)
  return { angle: 0, z: -Math.max(rel, 0), lift: 0, opacity, flat: false }
}

export default function TumbleDeck({
  cards,
  height = 'clamp(280px, 52vw, 560px)',
  aspect = 2.06,
  scrollPerCard = 240,
  depth = 4,
  label,
  hint,
  onFront,
  className = '',
}) {
  const rootRef = useRef(null)
  const sceneRef = useRef(null)
  const cardRefs = useRef([])
  const imgRefs = useRef([])
  const slabRefs = useRef([])
  const slotK = useRef([])
  const state = useRef({ pos: 0 })
  const geo = useRef({ h: 200, gap: 44 })
  const frontRef = useRef(-1)
  const liveRef = useRef(null)
  const onFrontRef = useRef(onFront)
  const n = cards.length
  const pool = n ? depth + 5 : 0

  useEffect(() => {
    onFrontRef.current = onFront
  })

  const paint = useCallback(() => {
    const { pos } = state.current
    const { gap } = geo.current
    const base = Math.floor(pos) - 2
    cardRefs.current.forEach((el, j) => {
      const img = imgRefs.current[j]
      if (!el || !img || j >= pool) return
      const k = base + wrap(j - base, pool)
      if (slotK.current[j] !== k) {
        slotK.current[j] = k
        const c = cards[wrap(k, n)]
        const slab = slabRefs.current[j]
        if (c.src) {
          img.src = c.src
          img.style.display = ''
          if (slab) slab.hidden = true
        } else {
          // no capture yet: a designed concrete slab with the name and its status
          img.removeAttribute('src')
          img.style.display = 'none'
          if (slab) {
            slab.hidden = false
            slab.children[0].textContent = c.slab?.title ?? ''
            slab.children[1].textContent = c.slab?.status ?? ''
          }
        }
        img.alt = ''
      }
      const p = cardPose(k, pos, depth)
      el.style.transform = `translate3d(0, ${-p.lift}px, ${p.z * gap}px) rotateX(${p.angle}deg)`
      el.style.opacity = String(p.opacity)
      el.style.visibility = p.opacity > 0 ? 'visible' : 'hidden'
      // A card tipping onto the floor would show its face upside down and mirrored: the face
      // fades out between 20° and 55° of tilt, so what lands is plain concrete, never inverted.
      const face = p.flat ? 0 : Math.max(0, Math.min(1, (55 + p.angle) / 35))
      el.style.setProperty('--td-face', face.toFixed(3))
      el.dataset.flat = p.flat ? '1' : '0'
      el.style.setProperty('--td-shade', String(p.flat ? 0.06 : (-p.angle / 90) * 0.06))
    })
    const front = wrap(Math.round(pos), n)
    if (front !== frontRef.current) {
      frontRef.current = front
      if (liveRef.current) liveRef.current.textContent = cards[front]?.label ?? ''
      onFrontRef.current?.(front)
    }
  }, [depth, pool, cards, n])

  useLayoutEffect(() => {
    slotK.current = []
    frontRef.current = -1
  }, [cards])

  useLayoutEffect(() => {
    const root = rootRef.current
    const scene = sceneRef.current
    if (!root || !scene) return
    const fit = () => {
      const W0 = root.clientWidth
      const H0 = root.clientHeight
      const wFrac = W0 < 420 ? 0.82 : 0.66
      const h = Math.max(60, Math.min((W0 * wFrac) / aspect, H0 * 0.42, 620))
      const w = h * aspect
      const top = H0 / 2 - 0.62 * h
      geo.current = { h, gap: 0.24 * h }
      scene.style.perspective = `${6 * h}px`
      scene.style.perspectiveOrigin = `50% ${top - 1.66 * h}px`
      root.style.setProperty('--td-w', `${w}px`)
      root.style.setProperty('--td-h', `${h}px`)
      root.style.setProperty('--td-top', `${top}px`)
      paint()
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(root)
    return () => ro.disconnect()
  }, [aspect, paint])

  const api = useRef({ step: () => {} })
  const dragged = useRef(false)
  useEffect(() => {
    const root = rootRef.current
    if (!root || n === 0) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const s = state.current
    let target = s.pos
    let running = false
    let idle
    let acc = 0

    const follow = () => {
      const dt = gsap.ticker.deltaRatio(60) / 60
      s.pos += (target - s.pos) * (1 - Math.exp(-dt * 9))
      if (Math.abs(target - s.pos) < 2e-3) {
        s.pos = target
        gsap.ticker.remove(follow)
        running = false
      }
      paint()
    }
    const push = (to) => {
      target = Math.max(Math.round(s.pos) - 3, Math.min(Math.round(s.pos) + 3, to))
      if (reduce) {
        s.pos = target
        paint()
      } else if (!running) {
        running = true
        gsap.ticker.add(follow)
      }
    }
    const settle = (bias = 0) =>
      push(bias > 0 ? Math.floor(target + 0.7) : bias < 0 ? Math.ceil(target - 0.7) : Math.round(target))
    api.current.step = (dir) => push(Math.round(target) + dir)

    // The page keeps its scroll: the wheel only drives the deck while it has focus.
    const onWheel = (e) => {
      if (document.activeElement !== root) return
      e.preventDefault()
      const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? root.clientHeight : 1
      const d = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * scale
      if (reduce) {
        acc += d
        while (Math.abs(acc) >= scrollPerCard) {
          const dir = Math.sign(acc)
          acc -= dir * scrollPerCard
          push(target + dir)
        }
        return
      }
      push(target + d / scrollPerCard)
      clearTimeout(idle)
      idle = setTimeout(() => settle(Math.sign(d)), 140)
    }

    let drag = null
    const onDown = (e) => {
      if (e.button !== 0) return
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, travel: 0, last: 0, axis: null }
      dragged.current = false
      clearTimeout(idle)
    }
    const onMove = (e) => {
      if (!drag || e.pointerId !== drag.id) return
      const dx = e.clientX - drag.x
      const dy = drag.y - e.clientY
      if (!drag.axis && Math.abs(dx) + Math.abs(dy) > 6) drag.axis = Math.abs(dy) >= Math.abs(dx) ? 'y' : 'x'
      // A vertical finger on a phone scrolls the page; only a horizontal drag flips cards on touch.
      const use = e.pointerType === 'touch' ? (drag.axis === 'x' ? -dx : 0) : dy
      drag.x = e.clientX
      drag.y = e.clientY
      drag.travel += Math.abs(use)
      if (use) drag.last = Math.sign(use)
      if (drag.travel > 6 && !dragged.current) {
        dragged.current = true
        root.setPointerCapture(e.pointerId)
      }
      if (dragged.current && !reduce) push(target + use / (geo.current.h * 1.1))
    }
    const onUp = (e) => {
      if (!drag || e.pointerId !== drag.id) return
      if (dragged.current) {
        if (reduce) push(Math.round(target) + (drag.last || 0))
        else settle(drag.last)
      }
      drag = null
    }

    root.addEventListener('wheel', onWheel, { passive: false })
    root.addEventListener('pointerdown', onDown)
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerup', onUp)
    root.addEventListener('pointercancel', onUp)
    paint()
    return () => {
      clearTimeout(idle)
      gsap.ticker.remove(follow)
      root.removeEventListener('wheel', onWheel)
      root.removeEventListener('pointerdown', onDown)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerup', onUp)
      root.removeEventListener('pointercancel', onUp)
    }
  }, [n, scrollPerCard, paint])

  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      api.current.step(1)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      api.current.step(-1)
    }
  }

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      aria-describedby={hint ? 'td-hint' : undefined}
      tabIndex={0}
      onKeyDown={onKey}
      onClick={() => {
        if (!dragged.current) api.current.step(1)
      }}
      className={`td-root ${className}`}
      style={{ height }}
    >
      <div ref={sceneRef} className="td-scene" aria-hidden="true">
        {Array.from({ length: pool }, (_, j) => (
          <div
            key={j}
            ref={(el) => {
              cardRefs.current[j] = el
            }}
            className="td-card"
          >
            <img
              ref={(el) => {
                imgRefs.current[j] = el
              }}
              alt=""
              width={720}
              height={Math.round(720 / aspect)}
              draggable={false}
              decoding="async"
            />
            <div
              ref={(el) => {
                slabRefs.current[j] = el
              }}
              className="td-slab"
              hidden
            >
              <span className="td-slab__title" />
              <span className="td-slab__status" />
            </div>
          </div>
        ))}
      </div>
      {hint && (
        <span id="td-hint" className="sr-only">
          {hint}
        </span>
      )}
      <span ref={liveRef} className="sr-only" aria-live="polite" />
    </div>
  )
}
