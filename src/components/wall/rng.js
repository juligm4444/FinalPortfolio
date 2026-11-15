/* Seeded randomness for the growth on walls, the lattice and the tool patches:
   the same seed draws the same thing on the server and on every load. */
export function hashSeed(s) {
  let h = 2166136261
  for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return h >>> 0
}
export function rng(seed) {
  let s = typeof seed === 'number' ? seed >>> 0 : hashSeed(seed)
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
