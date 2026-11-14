/* Botanical Text — scene. Adapted from vendor/originkit/BotanicalText.tsx
   (itself after the MIT Codrops "Typing Effects with Three.js" demo 3).

   Differences from the original, all deliberate:
   - No editing: no contenteditable, no click-to-type, no text cursor. The
     string is set from outside and measured with canvas metrics.
   - Changing the text wilts the current word and then blooms the new one,
     instead of diffing keystrokes.
   - Colour and face come from the design tokens (--bloom, --moss-400,
     --font-display), read at creation. No hex lives here.
   - Plain JavaScript, constants instead of the Framer control panel, and a
     forced context loss on dispose so the WebGL budget is returned at once.
   This module is the only one that imports three; the wrapper loads it on
   demand, so pages that never activate it never download it. */
import * as THREE from 'three'

const MAX_PARTICLES = 20000
/** World units per CSS pixel of type (original constant). */
const SCALE = 0.085
const CAM_DISTANCE = 35
const LINE_RATIO = 1.15

const TUNING = {
  hueSpread: 0.03, // the brand has one accent: wander a little, not round the wheel
  bloomAlpha: 0.95,
  leafAlpha: 0.98,
  bloomSize: 1,
  leafSize: 1,
  leafMix: 0.2,
  spread: 0.2,
  duration: 0.9, // seconds for one bloom to open
  delay: 0.35, // stagger window, so the word opens as a wave
  hoverRadius: 8.1,
  hoverBoost: 3,
}

const circOut = (t) => Math.sqrt(1 - (t - 1) * (t - 1))

function spriteCanvas(size) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  return { canvas, ctx: canvas.getContext('2d') }
}

/** Five petals and a punched core, white on transparent — an alpha map. */
function flowerTexture() {
  const size = 128
  const { canvas, ctx } = spriteCanvas(size)
  ctx.translate(size / 2, size / 2)
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  for (let i = 0; i < 5; i++) {
    ctx.save()
    ctx.rotate((i / 5) * Math.PI * 2)
    ctx.beginPath()
    ctx.ellipse(0, -size * 0.24, size * 0.15, size * 0.24, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.arc(0, 0, size * 0.07, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.55)'
  ctx.fill()
  return new THREE.CanvasTexture(canvas)
}

/** One pointed leaf, tip up. */
function leafTexture() {
  const size = 128
  const { canvas, ctx } = spriteCanvas(size)
  ctx.translate(size / 2, size / 2)
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.beginPath()
  ctx.moveTo(0, -size * 0.42)
  ctx.quadraticCurveTo(size * 0.3, -size * 0.05, 0, size * 0.42)
  ctx.quadraticCurveTo(-size * 0.3, -size * 0.05, 0, -size * 0.42)
  ctx.fill()
  return new THREE.CanvasTexture(canvas)
}

function makeBloom(x, y) {
  return {
    type: 0,
    x: x + TUNING.spread * (Math.random() - 0.5),
    y: y + TUNING.spread * (Math.random() - 0.5),
    hue: Math.random() - 0.5,
    toDelete: false,
    t: 0,
    wait: TUNING.delay * Math.random(),
    jitter: 0.6 + 0.8 * Math.random(),
    // Powered hard on purpose: nearly every bloom stays tiny and a rare one
    // opens fully. An even spread of sizes reads as a pattern, not a bush.
    maxScale: 0.9 * Math.pow(Math.random(), 20) * TUNING.bloomSize,
    baseRotation: 0.5 * Math.random() * Math.PI,
    hover: 0,
  }
}

function makeLeaf(x, y) {
  return {
    type: 1,
    x,
    y,
    hue: Math.random() - 0.5,
    toDelete: false,
    t: 0,
    wait: TUNING.delay * Math.random(),
    jitter: 0.6 + 0.8 * Math.random(),
    maxScale: (0.1 + 0.7 * Math.pow(Math.random(), 7)) * TUNING.leafSize,
    baseRotation: 0.6 * (Math.random() - 0.5) * Math.PI,
    hover: 0,
  }
}

/** The tokens the scene paints with, resolved once from the document. */
function readTokens() {
  const css = getComputedStyle(document.documentElement)
  const v = (name) => css.getPropertyValue(name).trim()
  return { bloom: v('--bloom'), leaf: v('--moss-400'), family: v('--font-display') }
}

export default class BotanicalScene {
  /**
   * @param {HTMLElement} container element the canvas is appended to; its size is the frame
   * @param {{ text: string, maxFontSize?: number, weight?: number }} options
   */
  constructor(container, { text, maxFontSize = 140, weight = 700 }) {
    this.container = container
    this.tokens = readTokens()
    this.maxFontSize = maxFontSize
    this.weight = weight
    this.text = ''
    this.pendingText = text
    this.phase = 'grow' // 'grow' | 'wilt'
    this.particles = []
    this.meshes = []
    this.box = { w: 0, h: 0, wScene: 0, hScene: 0 }
    this.fontSize = maxFontSize
    this.pointer = new THREE.Vector2()
    this.pointerOver = false
    this.width = 1
    this.height = 1
    this.frameId = 0
    this.lastT = 0
    this.disposed = false

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    const canvas = this.renderer.domElement
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' })
    container.appendChild(canvas)

    this.scene = new THREE.Scene()
    this.group = new THREE.Group()
    this.scene.add(this.group)
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
    this.geometry = new THREE.PlaneGeometry(1.2, 1.2)
    this.dummy = new THREE.Object3D()

    this.maskCanvas = document.createElement('canvas')
    this.maskCtx = this.maskCanvas.getContext('2d', { willReadFrequently: true })

    this.textures = [flowerTexture(), leafTexture()]
    this.materials = [
      new THREE.MeshBasicMaterial({ alphaMap: this.textures[0], opacity: TUNING.bloomAlpha, depthTest: false, transparent: true }),
      new THREE.MeshBasicMaterial({ alphaMap: this.textures[1], opacity: TUNING.leafAlpha, depthTest: false, transparent: true }),
    ]

    this.onPointerMove = (e) => {
      const r = this.container.getBoundingClientRect()
      this.pointer.set((e.clientX - r.left - r.width / 2) * SCALE, -(e.clientY - r.top - r.height / 2) * SCALE)
      this.pointerOver = true
    }
    this.onPointerLeave = () => {
      this.pointerOver = false
    }
    container.addEventListener('pointermove', this.onPointerMove)
    container.addEventListener('pointerleave', this.onPointerLeave)
    container.addEventListener('pointercancel', this.onPointerLeave)
  }

  // ---- layout and sampling ------------------------------------------------

  /** Fit the font to the frame, then size the text box from canvas metrics. */
  layout(text) {
    const ctx = this.maskCtx
    const lines = text.split('\n')
    const { family, } = this.tokens
    ctx.font = `${this.weight} 100px ${family}`
    const w100 = Math.max(1, ...lines.map((l) => ctx.measureText(l).width))
    const fit = (this.width * 0.92 * 100) / w100
    this.fontSize = Math.max(12, Math.min(this.maxFontSize, fit, this.height / (lines.length * LINE_RATIO)))
    ctx.font = `${this.weight} ${this.fontSize}px ${family}`
    const wText = Math.max(...lines.map((l) => ctx.measureText(l).width))
    this.box.w = Math.ceil(wText + this.fontSize * 0.1)
    this.box.h = Math.ceil(lines.length * this.fontSize * LINE_RATIO)
    this.box.wScene = this.box.w * SCALE
    this.box.hScene = this.box.h * SCALE
    return lines
  }

  /** Draw the string and turn every lit pixel (on a thinned grid) into a coordinate. */
  sample(text) {
    const lines = this.layout(text)
    const { w, h } = this.box
    this.maskCanvas.width = w
    this.maskCanvas.height = h
    const ctx = this.maskCtx
    ctx.font = `${this.weight} ${this.fontSize}px ${this.tokens.family}`
    ctx.fillStyle = '#ffffff'
    ctx.clearRect(0, 0, w, h)
    lines.forEach((l, i) => ctx.fillText(l, 0, ((i + 0.8) * h) / lines.length))
    const data = ctx.getImageData(0, 0, w, h).data
    let lit = 0
    for (let i = 3; i < data.length; i += 4) if (data[i] > 0) lit++
    // One flower per `step` pixels keeps the whole word blooming at any size.
    const step = Math.max(1, Math.ceil(Math.sqrt(lit / MAX_PARTICLES)))
    const coords = []
    for (let y = 0; y < h; y += step)
      for (let x = 0; x < w; x += step)
        if (data[(x + y * w) * 4 + 3] > 0 && coords.length < MAX_PARTICLES) coords.push([x, y])
    return coords
  }

  /** Replace the word outright: used on first bloom and after a wilt. */
  grow(text) {
    this.text = text
    const coords = this.sample(text)
    this.particles = coords.map(([x, y]) => {
      const px = x * SCALE
      const py = y * SCALE
      return Math.random() > TUNING.leafMix ? makeBloom(px, py) : makeLeaf(px, py)
    })
    this.rebuildMeshes()
    this.setPhase('grow')
  }

  /** Exposed on the container (data-phase) so the lab and tests can see the cycle. */
  setPhase(phase) {
    this.phase = phase
    this.container.dataset.phase = phase
  }

  rebuildMeshes() {
    this.meshes.forEach((m) => {
      this.group.remove(m)
      m.dispose()
    })
    this.meshes = []
    const counts = [0, 1].map((type) => this.particles.filter((p) => p.type === type).length)
    const identity = new THREE.Matrix4()
    this.materials.forEach((material, type) => {
      const mesh = new THREE.InstancedMesh(this.geometry, material, counts[type])
      // A zero-filled instance buffer collapses every instance: seed identity.
      for (let i = 0; i < counts[type]; i++) mesh.setMatrixAt(i, identity)
      mesh.instanceMatrix.needsUpdate = true
      mesh.frustumCulled = false
      mesh.position.x = -0.5 * this.box.wScene
      mesh.position.y = -0.6 * this.box.hScene
      this.meshes.push(mesh)
      this.group.add(mesh)
    })
    this.applyColors()
  }

  applyColors() {
    const hsl = [this.tokens.bloom, this.tokens.leaf].map((c) => {
      const o = { h: 0, s: 0, l: 0 }
      new THREE.Color(c).getHSL(o)
      return o
    })
    const idx = [0, 0]
    const color = new THREE.Color()
    this.particles.forEach((p) => {
      const mesh = this.meshes[p.type]
      if (!mesh) return
      const b = hsl[p.type]
      color.setHSL((b.h + p.hue * TUNING.hueSpread + 1) % 1, b.s, b.l)
      mesh.setColorAt(idx[p.type]++, color)
    })
    this.meshes.forEach((m) => {
      if (m.instanceColor) m.instanceColor.needsUpdate = true
    })
  }

  // ---- public API ---------------------------------------------------------

  /** New text: the current word wilts, then the new one blooms. */
  setText(text) {
    if (this.disposed) return
    this.pendingText = text
    if (text === this.text && this.phase === 'grow') return
    if (this.particles.length === 0) {
      this.grow(text)
      return
    }
    this.particles.forEach((p) => {
      p.toDelete = true
    })
    this.setPhase('wilt')
  }

  setSize(width, height) {
    if (this.disposed) return
    const resized = Math.round(width) !== Math.round(this.width) || Math.round(height) !== Math.round(this.height)
    this.width = Math.max(1, width)
    this.height = Math.max(1, height)
    this.renderer.setSize(this.width, this.height, false)
    const aspect = this.width / this.height
    this.camera.aspect = aspect
    this.camera.position.set(0, 0, CAM_DISTANCE)
    this.camera.lookAt(0, 0, 0)
    this.camera.fov = 2 * Math.atan((this.height * SCALE) / 2 / CAM_DISTANCE) * (180 / Math.PI)
    this.camera.near = 0.1
    this.camera.far = CAM_DISTANCE + 100
    this.camera.updateProjectionMatrix()
    // The font is fitted to the frame, so a new frame means a new word.
    if (resized && this.pendingText) this.grow(this.pendingText)
  }

  start() {
    this.lastT = performance.now()
    const loop = () => {
      this.frameId = requestAnimationFrame(loop)
      this.step()
    }
    this.frameId = requestAnimationFrame(loop)
  }

  // ---- frame --------------------------------------------------------------

  step() {
    if (this.disposed) return
    const now = performance.now()
    let dt = (now - this.lastT) / 1000
    this.lastT = now
    if (!isFinite(dt) || dt < 0) dt = 0
    if (dt > 0.05) dt = 0.05
    this.update(dt)
    this.renderer.render(this.scene, this.camera)
  }

  update(dt) {
    if (this.meshes.length === 0) return
    const localX = this.pointer.x + 0.5 * this.box.wScene
    const localY = this.pointer.y + 0.6 * this.box.hScene
    const radius = Math.max(0.001, TUNING.hoverRadius)
    let alive = 0
    const idx = [0, 0]
    for (const p of this.particles) {
      const mesh = this.meshes[p.type]
      if (!mesh) continue
      if (p.toDelete) {
        // Twice the rate on the way out: a bloom opens over its full
        // duration, and a cut one drops.
        p.t -= (dt * 2) / (TUNING.duration * p.jitter)
        if (p.t < 0) p.t = 0
      } else if (p.wait > 0) {
        p.wait -= dt
      } else if (p.t < 1) {
        p.t = Math.min(1, p.t + dt / (TUNING.duration * p.jitter))
      }
      if (p.t > 0) alive++

      const y = this.box.hScene - p.y
      let target = 0
      if (this.pointerOver) {
        const dx = p.x - localX
        const dy = y - localY
        const near = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / radius)
        target = near * near
      }
      p.hover += (target - p.hover) * (1 - Math.exp(-dt * 7))

      const scale = p.maxScale * circOut(p.t) * (1 + TUNING.hoverBoost * p.hover)
      this.dummy.rotation.set(0, 0, p.baseRotation)
      this.dummy.position.set(p.x, y, 0)
      if (p.type === 1) this.dummy.position.y += 0.5 * scale // leaf sprite is tip-up
      this.dummy.scale.setScalar(Math.max(0, scale))
      this.dummy.updateMatrix()
      mesh.setMatrixAt(idx[p.type]++, this.dummy.matrix)
    }
    this.meshes.forEach((m) => {
      m.instanceMatrix.needsUpdate = true
    })
    // Everything has closed: the old word is gone, the new one can bloom.
    if (this.phase === 'wilt' && alive === 0) this.grow(this.pendingText)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.frameId)
    this.container.removeEventListener('pointermove', this.onPointerMove)
    this.container.removeEventListener('pointerleave', this.onPointerLeave)
    this.container.removeEventListener('pointercancel', this.onPointerLeave)
    delete this.container.dataset.phase
    this.meshes.forEach((m) => {
      this.group.remove(m)
      m.dispose()
    })
    this.meshes = []
    this.geometry.dispose()
    this.materials.forEach((m) => m.dispose())
    this.textures.forEach((t) => t.dispose())
    this.scene.clear()
    // Give the GPU context back now, not when the garbage collector gets to it:
    // the registry's budget of 3 depends on it.
    this.renderer.forceContextLoss()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}
