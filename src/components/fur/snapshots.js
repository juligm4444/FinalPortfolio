/* Rest images of the fur pieces (V3 §B "regla de rendimiento").
   A piece at rest is a bitmap: drawn once by the REAL component in an off-screen
   canvas (FurSnapshotter.jsx), stored as a blob URL and cached by variant and
   size. Pieces whose variants are fixed (the six network tiles, the tool tiles)
   also ship a baked file made the same way at build time (scripts/bake-fur.mjs),
   so they are images from the first paint and on phones never touch WebGL. */

const baked = import.meta.glob('../../assets/fur/*.webp', { eager: true, query: '?url', import: 'default' })
const BAKED = Object.fromEntries(Object.entries(baked).map(([p, url]) => [p.split('/').pop().replace(/\.webp$/, ''), url]))

/** A baked file, if scripts/bake-fur.mjs made one for this key. */
export function bakedSnapshot(key) {
  return BAKED[key] ?? null
}

const cache = new Map() // key → url | null (null: failed, keep the CSS fallback)
const listeners = new Map() // key → Set<fn>
const queue = [] // jobs waiting: { key, kind, w, h, props }
let onQueue = () => {}

export function peekSnapshot(key) {
  return cache.get(key)
}

/** Ask for the rest image of a piece. `fn(url)` runs when it exists. Returns an unsubscribe. */
export function requestSnapshot(job, fn) {
  const hit = cache.get(job.key)
  if (hit !== undefined) {
    if (hit) fn(hit)
    return () => {}
  }
  let set = listeners.get(job.key)
  if (!set) {
    set = new Set()
    listeners.set(job.key, set)
    queue.push(job)
    onQueue()
  }
  set.add(fn)
  return () => set.delete(fn)
}

/** One-off snapshot outside React (scripts/bake-fur.mjs through window.__fur). */
export function snapshotOnce(job) {
  return new Promise((done) => requestSnapshot(job, done))
}

// ---- runner side (FurSnapshotter) ----
export function nextJob() {
  return queue[0] ?? null
}
export function settleJob(key, url) {
  const i = queue.findIndex((j) => j.key === key)
  if (i !== -1) queue.splice(i, 1)
  cache.set(key, url)
  if (url) listeners.get(key)?.forEach((fn) => fn(url))
  listeners.delete(key)
  onQueue()
}
export function watchQueue(fn) {
  onQueue = fn
  return () => {
    onQueue = () => {}
  }
}
