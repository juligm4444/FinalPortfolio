import * as registry from '../../webgl/registry.js'
import { getCapabilities } from '../../webgl/capabilities.js'

/* V4 §E — local Botanical Text for every H1/H2 and the hero role line.
   The real text never disappears, fades or is replaced. One shared canvas is
   laid exactly over the hovered heading: the original OriginKit scene
   (vendor/originkit/BotanicalText.tsx, ported with patches) draws its glyph mask
   from the heading's own lines — the same text, font, x and baseline the browser
   laid out — so every particle lands on its letter. Only particles within about
   one capital height of the pointer grow; each stays ~1.2 s after the pointer
   leaves its spot, then wilts, so a sweep leaves a trail. A fixed share of the
   mask ever grows (`density`), keeping at most ~55 % of a glyph covered.
   Foliage in the moss greens; flowers (≤ 20 %) in the four flower colours.
   Phones, touch and reduced motion: plain text. */

const SLOT = 'botanical'
const LINGER_S = 1.2
const HIDE_MS = 2800 // linger + wilt, then the canvas goes
const IDLE_MS = 4000
const SELECTOR = [
  'main h1:not(.sr-only):not([data-no-bloom])',
  'main h2:not(.sr-only):not([data-no-bloom])',
  'main .hero__role',
].join(', ')
export const DENSITY = 0.26

let sceneMod = null
let scene = null
let box = null
let active = null
let granted = false
let asked = false
let follow = 0
let hideTimer = 0
let idleTimer = 0

export function eligible() {
  if (typeof window === 'undefined') return false
  if (!window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches) return false
  return getCapabilities().allowed
}

const measureCtx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null

/** The heading as the browser laid it out: per line, its text, left edge and baseline (viewport px). */
export function layoutOf(h) {
  const cs = getComputedStyle(h)
  const size = parseFloat(cs.fontSize)
  const font = `${cs.fontStyle} ${cs.fontWeight} ${size}px ${cs.fontFamily}`
  measureCtx.font = font
  const fm = measureCtx.measureText('Hg')
  const ascent = fm.fontBoundingBoxAscent ?? size * 0.9
  const cap = measureCtx.measureText('H').actualBoundingBoxAscent || size * 0.7
  const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  const lines = []
  let node
  while ((node = walker.nextNode())) {
    const t = node.textContent
    for (let i = 0; i < t.length; i++) {
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      const r = range.getBoundingClientRect()
      if (!r.width && !r.height) continue
      let line = lines.find((l) => Math.abs(l.top - r.top) < r.height * 0.5)
      if (!line) {
        line = { top: r.top, left: r.left, right: r.right, bottom: r.bottom, text: '' }
        lines.push(line)
      }
      // the line's text starts at its first visible character
      if (!line.text && /\s/.test(t[i])) continue
      line.text += t[i]
      if (r.width) {
        line.left = Math.min(line.left, r.left)
        line.right = Math.max(line.right, r.right)
      }
    }
  }
  lines.sort((a, b) => a.top - b.top)
  const out = lines
    .map((l) => ({ text: l.text.replace(/\s+$/, ''), left: l.left, right: l.right, top: l.top, bottom: l.bottom, baseline: l.top + ascent }))
    .filter((l) => l.text)
  return { lines: out, size, cap, font, letterSpacing: cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing), cs }
}

function frameFor(lay) {
  const pad = Math.ceil(lay.size * 0.7)
  const left = Math.floor(Math.min(...lay.lines.map((l) => l.left)) - pad)
  const top = Math.floor(Math.min(...lay.lines.map((l) => l.top)) - pad)
  const right = Math.ceil(Math.max(...lay.lines.map((l) => l.right)) + pad)
  const bottom = Math.ceil(Math.max(...lay.lines.map((l) => l.bottom)) + pad)
  return { left, top, w: right - left, h: bottom - top }
}

function cfgFor(lay, fr) {
  const css = getComputedStyle(document.documentElement)
  const v = (n) => css.getPropertyValue(n).trim()
  const { cs, size } = lay
  // the sprites were tuned for 100 px type; smaller headings get smaller growth
  const k = Math.max(3.2, Math.min(9, (size / 100) * 10 * 1.4))
  return {
    text: lay.lines.map((l) => l.text).join('\n'),
    maskLines: lay.lines.map((l) => ({ text: l.text, x: l.left - fr.left, y: l.baseline - fr.top })),
    font: { fontFamily: cs.fontFamily, fontSize: size, fontWeight: cs.fontWeight, fontStyle: cs.fontStyle, letterSpacing: lay.letterSpacing, lineHeight: 1 },
    bloom: v('--flower-pink'),
    leaf: v('--moss-700'),
    palettes: [
      [v('--flower-pink'), v('--flower-yellow'), v('--flower-violet'), v('--flower-white')],
      // light greens read against the dark letters; the darkest green would vanish into them
      [v('--moss-400'), v('--moss-200'), v('--moss-400'), v('--moss-700')],
    ],
    hueSpread: 0,
    opacity: 18,
    bloomSize: k,
    leafSize: k,
    leafMix: 16, // ×0.05 → 80 % foliage, 20 % flowers
    spread: Math.max(0.6, k * 0.25),
    transition: { type: 'tween', duration: 0.55, ease: 'circOut' },
    hoverOn: true,
    hover: { radius: 3, boost: 1 },
    local: true,
    localRadiusPx: lay.cap * 1.05,
    linger: LINGER_S,
    density: DENSITY,
  }
}

function place() {
  if (!active || !box) return
  const r = active.el.getBoundingClientRect()
  // the heading moves with the page; the frame keeps its offset from it
  box.style.transform = `translate(${Math.round(r.left + active.dx)}px, ${Math.round(r.top + active.dy)}px)`
}

function ensureBox() {
  if (box) return box
  box = document.createElement('div')
  box.className = 'bloom-canvas'
  box.setAttribute('aria-hidden', 'true')
  document.body.appendChild(box)
  return box
}

function tick() {
  place()
  follow = requestAnimationFrame(tick)
}

async function boot() {
  sceneMod ??= await import('./FlowerTypeScene.jsx')
  const family = getComputedStyle(document.documentElement).getPropertyValue('--font-display')
  await document.fonts.load(`700 100px ${family}`)
  await document.fonts.load(`400 100px ${family}`)
  return sceneMod
}

/** Lay the canvas over `h` and reseed the scene with its mask. */
function grow(h) {
  if (!scene || !active || active.el !== h) return
  const lay = layoutOf(h)
  if (!lay.lines.length) return
  const fr = frameFor(lay)
  const r = h.getBoundingClientRect()
  active.dx = fr.left - r.left
  active.dy = fr.top - r.top
  box.style.width = `${fr.w}px`
  box.style.height = `${fr.h}px`
  place()
  scene.setSize(fr.w, fr.h)
  const cfg = cfgFor(lay, fr)
  scene.updateConfig(cfg)
  // a new heading: start from an empty bed, then sample its mask
  scene.coords = []
  scene.particles = []
  scene.refreshText()
  box.style.opacity = '1'
}

export function enter(h) {
  if (!eligible()) return
  clearTimeout(hideTimer)
  clearTimeout(idleTimer)
  if (active?.el === h) return
  active = { el: h, dx: 0, dy: 0 }
  ensureBox()
  cancelAnimationFrame(follow)
  follow = requestAnimationFrame(tick)
  if (scene) {
    grow(h)
    return
  }
  if (asked) return
  asked = true
  registry.request(SLOT, {
    grant: async () => {
      granted = true
      try {
        const { FlowerTypeScene } = await boot()
        if (!granted || !active) return
        const lay = layoutOf(active.el)
        const fr = frameFor(lay)
        box.style.width = `${fr.w}px`
        box.style.height = `${fr.h}px`
        scene = new FlowerTypeScene(box, { ...cfgFor(lay, fr), maskLines: [] })
        scene.setSize(fr.w, fr.h)
        scene.start()
        grow(active.el)
      } catch {
        drop()
      }
    },
    revoke: () => drop(),
  })
}

export function leave(h) {
  if (!active || active.el !== h) return
  // no wilt-all: the trail fades on its own (linger, then wilt); the canvas goes after that
  scene?.onPointerLeave()
  const el = active.el
  hideTimer = setTimeout(() => {
    if (active?.el !== el) return
    cancelAnimationFrame(follow)
    if (box) box.style.opacity = '0'
    active = null
    idleTimer = setTimeout(() => !active && drop(), IDLE_MS)
  }, HIDE_MS)
}

/** Pointer moves are forwarded: the canvas itself never catches events. */
export function move(e) {
  if (!scene || !active) return
  scene.onPointerMove(e)
}

function drop() {
  cancelAnimationFrame(follow)
  scene?.dispose()
  scene = null
  if (granted || asked) registry.release(SLOT)
  granted = false
  asked = false
  active = null
  if (box) box.style.opacity = '0'
}

export function install() {
  if (typeof window === 'undefined') return () => {}
  const find = (t) => (t instanceof Element ? t.closest(SELECTOR) : null)
  let over = null
  const onMove = (e) => {
    if (e.pointerType === 'touch') return
    const h = find(e.target)
    if (h) {
      if (over !== h) {
        if (over) leave(over)
        over = h
        enter(h)
      }
      move(e)
    } else if (over) {
      leave(over)
      over = null
    }
  }
  const focusIn = (e) => {
    const h = find(e.target)
    if (h && e.target.matches(':focus-visible')) enter(h)
  }
  const focusOut = (e) => {
    const h = find(e.target)
    if (h) leave(h)
  }
  document.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('focusin', focusIn)
  document.addEventListener('focusout', focusOut)
  // tests read the live scene and its frame through this
  window.__bloom = { scene: () => scene, box: () => box, active: () => active?.el ?? null, layoutOf }
  return () => {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('focusin', focusIn)
    document.removeEventListener('focusout', focusOut)
    drop()
    box?.remove()
    box = null
  }
}
