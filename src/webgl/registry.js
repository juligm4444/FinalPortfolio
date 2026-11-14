/* REDESIGN §4.1 — WebGL budget. At most MAX_CONTEXTS live contexts per
   viewport. Components ask for a slot when they enter the viewport and give
   it back when they leave; whoever is still waiting gets the next free slot
   in the order they asked. This is the only place that decides. */

export const MAX_CONTEXTS = 3

/** @typedef {{ id: string, grant: () => void, revoke: () => void, since: number }} Entry */

/** @type {Map<string, Entry>} */
const active = new Map()
/** @type {Entry[]} */
const waiting = []
/** @type {Set<() => void>} */
const listeners = new Set()

let snapshot = { active: [], waiting: [], max: MAX_CONTEXTS }

function publish() {
  snapshot = {
    active: Array.from(active.keys()),
    waiting: waiting.map((e) => e.id),
    max: MAX_CONTEXTS,
  }
  listeners.forEach((fn) => fn())
}

function promote() {
  while (active.size < MAX_CONTEXTS && waiting.length > 0) {
    const next = waiting.shift()
    active.set(next.id, next)
    next.grant()
  }
}

/**
 * Ask for a slot. `grant` runs when the slot is yours (maybe immediately,
 * maybe later); `revoke` runs if the registry takes it back.
 * Re-requesting an id you already hold is a no-op.
 */
export function request(id, { grant, revoke }) {
  if (active.has(id) || waiting.some((e) => e.id === id)) return
  const entry = { id, grant, revoke, since: Date.now() }
  waiting.push(entry)
  promote()
  publish()
}

/** Give a slot back (or leave the queue). Safe to call when not holding one. */
export function release(id) {
  const held = active.get(id)
  if (held) {
    active.delete(id)
  } else {
    const i = waiting.findIndex((e) => e.id === id)
    if (i === -1) return
    waiting.splice(i, 1)
  }
  promote()
  publish()
}

export function has(id) {
  return active.has(id)
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getSnapshot() {
  return snapshot
}

/** /lab and tests only: drop everything. */
export function reset() {
  active.forEach((e) => e.revoke())
  active.clear()
  waiting.length = 0
  publish()
}

if (import.meta.env?.DEV && typeof window !== 'undefined') {
  window.__webgl = { request, release, has, getSnapshot, reset, MAX_CONTEXTS }
}
