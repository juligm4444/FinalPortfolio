import * as registry from '../../webgl/registry.js'
import { getCapabilities } from '../../webgl/capabilities.js'

/* V3 §D — Botanical Text on hover, for every H1 and H2 of the site.
   At rest a heading is plain Libre Baskerville text and no canvas exists. When the
   pointer enters one (or keyboard focus lands on a link inside it), ONE shared
   canvas is laid exactly over its text and the original Botanical Text scene
   (vendor/originkit/BotanicalText.tsx, ported by scripts/port-vendor.mjs) grows
   leaves and flowers in the shape of its letters; the DOM text fades out under it.
   On leaving, the flowers wilt and the text fades back. Nothing moves the layout:
   the canvas is position: fixed and the heading only changes colour.
   Foliage dominates: 85 % of particles are leaves, flowers (pink) are 15 %.
   Phones, touch and reduced motion: never runs. */

const SLOT = 'botanical'
const WILT_MS = 900
const IDLE_MS = 4000
const SELECTOR = 'main h1:not(.sr-only):not([data-no-bloom]), main h2:not(.sr-only):not([data-no-bloom])'

let sceneMod = null
let scene = null
let box = null
let active = null
let granted = false
let asked = false
let follow = 0
let hideTimer = 0
let idleTimer = 0
let current = '' // text currently grown

export function eligible() {
  if (typeof window === 'undefined') return false
  if (!window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches) return false
  return getCapabilities().allowed
}

/** The heading's visible lines (as they wrap on screen) and the box around them. */
function measure(h) {
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
      if (!r.width && !/\s/.test(t[i])) continue
      let line = lines.find((l) => Math.abs(l.top - r.top) < r.height * 0.5)
      if (!line) {
        line = { top: r.top, left: r.left, right: r.right, bottom: r.bottom, text: '' }
        lines.push(line)
      }
      line.text += t[i]
      if (r.width) {
        line.left = Math.min(line.left, r.left)
        line.right = Math.max(line.right, r.right)
        line.bottom = Math.max(line.bottom, r.bottom)
      }
    }
  }
  lines.sort((a, b) => a.top - b.top)
  const text = lines.map((l) => l.text.trim()).filter(Boolean).join('\n')
  const left = Math.min(...lines.map((l) => l.left))
  const right = Math.max(...lines.map((l) => l.right))
  const top = lines[0]?.top ?? 0
  const hr = h.getBoundingClientRect()
  return { text, left, right, top, hr, lines: lines.length }
}

function cfgFor(h, text) {
  const cs = getComputedStyle(h)
  const size = parseFloat(cs.fontSize)
  const lh = cs.lineHeight === 'normal' ? size * 1.2 : parseFloat(cs.lineHeight)
  const ls = cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing)
  const css = getComputedStyle(document.documentElement)
  const v = (n) => css.getPropertyValue(n).trim()
  // The sprites were tuned for 100 px type; smaller headings get smaller flowers.
  const k = Math.max(3, Math.min(11, (size / 100) * 10 * 1.15))
  return {
    text,
    font: { fontFamily: cs.fontFamily, fontSize: size, fontWeight: cs.fontWeight, fontStyle: cs.fontStyle, letterSpacing: ls, lineHeight: lh / size },
    bloom: v('--bloom'),
    leaf: v('--moss-700'),
    hueSpread: 6,
    opacity: 18,
    bloomSize: k,
    leafSize: k,
    leafMix: 17, // ×0.05 → 85 % leaves, 15 % flowers
    spread: Math.max(1, k * 0.35),
    transition: { type: 'tween', duration: 0.9, ease: 'circOut' },
    hoverOn: true,
    hover: { radius: 7, boost: 8 },
  }
}

function place() {
  if (!active || !box) return
  const m = measure(active.el)
  const size = parseFloat(getComputedStyle(active.el).fontSize)
  const pad = size * 0.9
  const bw = m.right - m.left
  const bh = m.lines * active.lh
  const W = Math.ceil(bw + pad * 2)
  const H = Math.ceil(bh + pad * 2)
  // The scene centres the string box horizontally and puts its top 0.4 × its height above centre.
  box.style.width = `${W}px`
  box.style.height = `${H}px`
  box.style.transform = `translate(${Math.round(m.left + bw / 2 - W / 2)}px, ${Math.round(m.top + 0.4 * bh - H / 2)}px)`
  if (scene && (box.__w !== W || box.__h !== H)) {
    box.__w = W
    box.__h = H
    scene.setSize(W, H)
  }
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
  return sceneMod
}

function grow(h) {
  if (!scene || !active || active.el !== h) return
  const m = measure(h)
  const cfg = cfgFor(h, m.text)
  active.lh = cfg.font.lineHeight * cfg.font.fontSize
  place()
  // The original only re-reads the string when the font is unchanged: set the face first, then the words.
  scene.updateConfig({ ...cfg, text: scene.cfg.text })
  scene.updateConfig(cfg)
  current = m.text
  h.setAttribute('data-bloom', 'on')
  box.style.opacity = '1'
}

export function enter(h) {
  if (!eligible()) return
  clearTimeout(hideTimer)
  clearTimeout(idleTimer)
  if (active && active.el !== h) leave(active.el, true)
  active = { el: h, lh: 0 }
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
        if (!granted) return
        const first = cfgFor(active?.el ?? h, '')
        scene = new FlowerTypeScene(box, first)
        scene.setSize(1, 1)
        scene.start()
        box.__w = 0
        if (active) grow(active.el)
      } catch {
        drop()
      }
    },
    revoke: () => drop(),
  })
}

export function leave(h, immediate = false) {
  if (!active || active.el !== h) return
  h.removeAttribute('data-bloom')
  active = null
  if (!scene) return
  // Wilt in place (the original diff: every flower whose pixel vanished closes).
  if (current) scene.updateConfig({ ...scene.cfg, text: '' })
  current = ''
  const el = box
  hideTimer = setTimeout(
    () => {
      if (active) return
      cancelAnimationFrame(follow)
      if (el) el.style.opacity = '0'
      idleTimer = setTimeout(() => !active && drop(), IDLE_MS)
    },
    immediate ? 0 : WILT_MS
  )
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
  active?.el.removeAttribute('data-bloom')
  active = null
  current = ''
  if (box) box.style.opacity = '0'
}

export function install() {
  if (typeof window === 'undefined') return () => {}
  const find = (t) => (t instanceof Element ? t.closest(SELECTOR) : null)
  const over = (e) => {
    if (e.pointerType === 'touch') return
    const h = find(e.target)
    if (h) {
      if (active?.el !== h) enter(h)
      move(e)
    } else if (active && !active.el.contains(e.target)) leave(active.el)
  }
  const out = (e) => {
    if (!active) return
    if (!e.relatedTarget || !active.el.contains(e.relatedTarget)) {
      const to = find(e.relatedTarget)
      if (to !== active.el) leave(active.el)
    }
  }
  const focusIn = (e) => {
    const h = find(e.target)
    if (h && e.target.matches(':focus-visible')) enter(h)
  }
  const focusOut = (e) => {
    const h = find(e.target)
    if (h && active?.el === h) leave(h)
  }
  document.addEventListener('pointermove', over, { passive: true })
  document.addEventListener('pointerout', out, { passive: true })
  document.addEventListener('focusin', focusIn)
  document.addEventListener('focusout', focusOut)
  return () => {
    document.removeEventListener('pointermove', over)
    document.removeEventListener('pointerout', out)
    document.removeEventListener('focusin', focusIn)
    document.removeEventListener('focusout', focusOut)
    drop()
    box?.remove()
    box = null
  }
}
