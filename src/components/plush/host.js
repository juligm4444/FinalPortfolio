import * as registry from '../../webgl/registry.js'
import { getCapabilities } from '../../webgl/capabilities.js'

/* REDESIGN §6, §5 — one shared canvas for the dock's moss and the Herbario's
   grass. A tile at rest is stone and SVG, no WebGL. The first time one is hovered
   or focused the host asks src/webgl for a slot (the single context is `plush`),
   loads the scene, and moves its canvas into that tile; moving to another tile
   moves the same canvas. A few seconds after the last tile is left the scene is
   disposed and the slot returned, so an unused site holds no context at all. */
const ID = 'plush'
const IDLE_MS = 4000

export default class PlushHost {
  constructor() {
    this.tiles = new Map()
    this.hover = null
    this.focus = null
    this.scene = null
    this.starting = false
    this.failed = false
    this.liveId = null
    this.idleTimer = 0
  }

  register(id, info) {
    this.tiles.set(id, { id, ...info })
    return () => {
      this.tiles.delete(id)
      if (this.hover === id) this.hover = null
      if (this.focus === id) this.focus = null
      if (this.liveId === id) this.liveId = null
      this.update()
    }
  }

  setHover(id) {
    this.hover = id
    this.update()
  }

  setFocus(id) {
    this.focus = id
    this.update()
  }

  /** Pointer over the tile with `id`, in client coordinates. */
  move(id, x, y) {
    const t = this.tiles.get(id)
    if (!t || !this.scene || this.liveId !== id) return
    const r = t.el.getBoundingClientRect()
    this.scene.setPointer((x - r.left) / Math.max(1, r.width), (y - r.top) / Math.max(1, r.height))
  }

  update() {
    clearTimeout(this.idleTimer)
    const id = this.hover ?? this.focus
    if (id == null) {
      this.scene?.detach()
      if (this.scene) this.idleTimer = setTimeout(() => this.drop(), IDLE_MS)
      return
    }
    const t = this.tiles.get(id)
    if (!t) return
    if (this.scene) {
      if (this.liveId !== id) {
        this.tiles.get(this.liveId)?.el.removeAttribute('data-live')
        this.liveId = id
      }
      t.el.setAttribute('data-live', '')
      this.scene.attach(t.slot, t.mode, t.seed)
    } else {
      this.ensure()
    }
  }

  /** Ask for the slot and load the scene; `update()` runs again once it is ready. */
  ensure() {
    if (this.starting || this.failed || this.scene) return
    // Reduced motion, no WebGL2 or a low-end device: the CSS moss stays the whole story.
    if (!getCapabilities().allowed) return
    this.starting = true
    registry.request(ID, { grant: () => this.boot(), revoke: () => this.drop() })
  }

  async boot() {
    try {
      const { default: PlushScene } = await import('./PlushScene.js')
      if (!this.starting) return // released while the chunk was loading
      const canvas = document.createElement('canvas')
      this.scene = new PlushScene(canvas, {
        onIdle: () => this.onIdle(),
        onLost: () => this.drop(),
      })
      this.update()
    } catch {
      this.failed = true
      this.drop()
    }
  }

  onIdle() {
    this.tiles.get(this.liveId)?.el.removeAttribute('data-live')
    this.liveId = null
  }

  drop() {
    clearTimeout(this.idleTimer)
    this.scene?.dispose()
    this.scene = null
    this.tiles.get(this.liveId)?.el.removeAttribute('data-live')
    this.liveId = null
    this.starting = false
    registry.release(ID)
  }

  dispose() {
    this.drop()
    this.tiles.clear()
  }
}
