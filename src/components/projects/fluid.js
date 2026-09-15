/**
 * Geometry for the showcase opening and the fluids it leaves behind.
 *
 * The comp tells the opening in frames: two crescents curl in from opposite
 * corners over charcoal (71), flood outward until the charcoal is gone and a
 * single wave splits the frame into two colours (73), and the wave then
 * settles into a steeper sweep behind the panels (72). Those three states are
 * the keyframes; everything here exists to travel between them without a cut.
 *
 * Every shape is handled as a ring of points rather than as an SVG path, so
 * that any shape can turn into any other: a crescent and a flood region are
 * both just N points, and the morph is a per-point lerp. The same rings feed
 * the fills and the clips the wordmark is coloured by, which is what keeps the
 * word's colour break glued to the edge it follows.
 */

export const FIELD = { w: 1920, h: 1100 }

/** Points per ring. Enough that the boundary never reads as faceted. */
const N = 600

/**
 * Timeline, in ms from mount. Shared with ProjectsShowcase so the React
 * phases and the drawn geometry can never disagree about where we are.
 */
export const TIMELINE = {
  swirl: [80, 1380], //   crescents curl in from the edges
  flood: [1150, 2650], // they flood out and the charcoal disappears
  word: 1950, //          PROJECTS surfaces while the flood is still moving
  sink: 3700, //          it submerges; the sheets rise
  settle: [3700, 5300], // the wave eases into the settled sweep
  live: 4500, //          content lands and the cycle starts
}

const TWO_PI = Math.PI * 2
const clamp01 = (x) => Math.min(Math.max(x, 0), 1)
export const progress = (now, [a, b]) => clamp01((now - a) / (b - a))
export const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)
export const easeInOutCubic = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2

// ── Sampling ─────────────────────────────────────────────────────────────

function cubic(p0, p1, p2, p3, t) {
  const u = 1 - t
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ]
}

/** A chain of segments ([a, b] lines or [a, c1, c2, b] cubics), densely walked. */
function walk(segments, perSegment = 120) {
  const pts = []
  for (const s of segments) {
    for (let i = 0; i < perSegment; i++) {
      const t = i / perSegment
      pts.push(
        s.length === 2
          ? [s[0][0] + (s[1][0] - s[0][0]) * t, s[0][1] + (s[1][1] - s[0][1]) * t]
          : cubic(s[0], s[1], s[2], s[3], t),
      )
    }
  }
  return pts
}

/**
 * Resample a polyline to `count` points evenly spaced by arc length. Rings
 * that are going to be lerped against each other need comparable spacing, or
 * one side of a shape bunches up while the other stretches.
 */
function resample(pts, count, closed) {
  const src = closed ? [...pts, pts[0]] : pts
  const acc = [0]
  for (let i = 1; i < src.length; i++) {
    acc.push(acc[i - 1] + Math.hypot(src[i][0] - src[i - 1][0], src[i][1] - src[i - 1][1]))
  }
  const total = acc[acc.length - 1]
  const out = new Array(count)
  const div = closed ? count : count - 1
  let j = 1
  for (let i = 0; i < count; i++) {
    const target = (i / div) * total
    while (j < acc.length - 1 && acc[j] < target) j++
    const span = acc[j] - acc[j - 1] || 1
    const k = (target - acc[j - 1]) / span
    out[i] = [
      src[j - 1][0] + (src[j][0] - src[j - 1][0]) * k,
      src[j - 1][1] + (src[j][1] - src[j - 1][1]) * k,
    ]
  }
  return out
}

function signedArea(ring) {
  let a = 0
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i]
    const q = ring[(i + 1) % ring.length]
    a += p[0] * q[1] - q[0] * p[1]
  }
  return a / 2
}

// ── Frame 71: the crescents ──────────────────────────────────────────────

// Lifted from the comp's vectors verbatim.
const CRESCENT_PALE = resample(
  walk([
    [[-0.5, 4], [917.43, 45.39], [2258.5, 289], [1194.5, 894]],
    [[1194.5, 894], [2232.5, 58], [62.7, 132.04], [-0.5, 1101.5]],
    [[-0.5, 1101.5], [-0.5, 4]],
  ]),
  N,
  true,
)
const CRESCENT_PINK = resample(
  walk([
    [[1919.89, 1091.5], [1001.96, 1050.11], [-339.11, 806.5], [724.89, 201.5]],
    [[724.89, 201.5], [-313.11, 1037.5], [1856.69, 963.46], [1919.89, -6]],
    [[1919.89, -6], [1919.89, 1091.5]],
  ]),
  N,
  true,
)

// ── Frames 73 and 72: the boundary between the two colours ───────────────

// Both run from the bottom-left corner to the top-right one, so they can be
// blended point for point.
const M = 220
const WAVE = resample(
  walk([
    [[0, 1103], [-31.5, 1167.5], [163.2, 635.7], [404, 852.7]],
    [[404, 852.7], [644.7, 1069.6], [1232.6, 15], [1920, 0]],
  ]),
  M,
  false,
)
const SWEEP = resample(
  walk([
    [[0, 1103], [-31.5, 1167.5], [95.5, -161.5], [903, 683]],
    [[903, 683], [1710.5, 1527.5], [1232.6, 15], [1920, 0]],
  ]),
  M,
  false,
)

// Ripples travelling along the boundary. Kept well below the size of the
// comp's own curves: the silhouette should stay recognisably the designed
// one, only never still.
const RIPPLES = [
  { freq: 0.8, amp: 70, speed: 0.23, phase: 0.0 },
  { freq: 1.7, amp: 42, speed: -0.31, phase: 1.9 },
  { freq: 2.9, amp: 22, speed: 0.47, phase: 4.1 },
  { freq: 4.3, amp: 9, speed: -0.62, phase: 2.7 },
]

/**
 * The live boundary at time `t` (seconds). `settle` blends the wave into the
 * sweep; once settled, a slow tide keeps drifting part of the way back so the
 * large-scale shape breathes as well as the edge.
 */
function boundary(t, settle) {
  const tide = 0.24 * (0.5 + 0.5 * Math.sin(t * 0.21 + 1.2)) * settle
  const mix = settle - tide
  const pts = new Array(M)

  for (let i = 0; i < M; i++) {
    const s = i / (M - 1)
    const x = WAVE[i][0] + (SWEEP[i][0] - WAVE[i][0]) * mix
    const y = WAVE[i][1] + (SWEEP[i][1] - WAVE[i][1]) * mix

    // Normal from the neighbours, so displacement always pushes across the
    // edge rather than sliding along it.
    const a = WAVE[Math.max(i - 1, 0)]
    const b = WAVE[Math.min(i + 1, M - 1)]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    const nx = -(b[1] - a[1]) / len
    const ny = (b[0] - a[0]) / len

    // Taper at the ends so the corners stay pinned while the middle flows.
    let d = 0
    for (const r of RIPPLES) d += r.amp * Math.sin(r.freq * TWO_PI * s + r.speed * t + r.phase)
    d *= Math.sin(Math.PI * s) ** 0.6

    pts[i] = [x + nx * d, y + ny * d]
  }

  // Run the line past the frame at both ends so nothing shows at the corners.
  const first = pts[0]
  const last = pts[M - 1]
  return [[first[0] - 260, first[1] + 420], ...pts, [last[0] + 420, last[1] - 260]]
}

const FAR = 700
/** The two flood regions, both closed off well outside the frame. */
function regions(t, settle) {
  const line = boundary(t, settle)
  const { w, h } = FIELD
  const pale = [...line, [w + FAR, -FAR], [-FAR, -FAR], [-FAR, h + FAR]]
  const pink = [...line, [w + FAR, -FAR], [w + FAR, h + FAR], [-FAR, h + FAR]]
  return { pale: resample(pale, N, true), pink: resample(pink, N, true) }
}

/**
 * Pair each crescent with its flood region: same winding, and rotated so every
 * point travels to the nearest counterpart instead of across the frame.
 */
function align(from, to) {
  const src = signedArea(from) * signedArea(to) < 0 ? [...from].reverse() : from
  let best = 0
  let bestCost = Infinity
  for (let off = 0; off < N; off += 2) {
    let cost = 0
    for (let i = 0; i < N; i += 6) {
      const p = src[i]
      const q = to[(i + off) % N]
      cost += (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2
      if (cost > bestCost) break
    }
    if (cost < bestCost) {
      bestCost = cost
      best = off
    }
  }
  // Re-index the source so index i lines up with target index i.
  return Array.from({ length: N }, (_, i) => src[(i - best + N) % N])
}

function pose(ring, angle, dx, dy, scale) {
  const cx = FIELD.w / 2
  const cy = FIELD.h / 2
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return ring.map(([x, y]) => {
    const px = (x - cx) * scale
    const py = (y - cy) * scale
    return [cx + px * cos - py * sin + dx, cy + px * sin + py * cos + dy]
  })
}

const floodStart = regions(TIMELINE.flood[0] / 1000, 0)
const PALE_FROM = align(CRESCENT_PALE, floodStart.pale)
const PINK_FROM = align(CRESCENT_PINK, floodStart.pink)

/**
 * Both rings for a given moment.
 * @param ms     time since mount
 * @param intro  false when the opening is skipped: straight to the fluids
 */
export function frame(ms, intro) {
  const t = ms / 1000
  if (!intro) return { ...regions(t, 1), ground: 0 }

  const settle = easeInOutCubic(progress(ms, TIMELINE.settle))
  const target = regions(t, settle)
  const flood = easeInOutCubic(progress(ms, TIMELINE.flood))
  // The charcoal only has to last until the floods close over it. Fading it
  // out at the very end also removes the hairline it would otherwise leave
  // along the seam, where two anti-aliased edges meet over a dark ground.
  const ground = flood < 0.75 ? 1 : 1 - (flood - 0.75) / 0.25
  if (flood >= 1) return { ...target, ground: 0 }

  // The swirl: each crescent starts rotated, enlarged and pushed past its own
  // edge, and curls into place — the pale from the left, the pink from the
  // right, both turning the same way about the centre, like one vortex.
  const s = easeOutCubic(progress(ms, TIMELINE.swirl))
  const off = 1 - s
  const pale = pose(PALE_FROM, -1.05 * off, -1900 * off, -260 * off, 1 + 0.5 * off)
  const pink = pose(PINK_FROM, -1.05 * off, 1900 * off, 260 * off, 1 + 0.5 * off)

  const lerp = (a, b) => a.map((p, i) => [p[0] + (b[i][0] - p[0]) * flood, p[1] + (b[i][1] - p[1]) * flood])
  return { pale: lerp(pale, target.pale), pink: lerp(pink, target.pink), ground }
}

/** Ring → path data. One decimal is invisible at any real screen size. */
export function toPath(ring) {
  let d = `M${ring[0][0].toFixed(1)},${ring[0][1].toFixed(1)}`
  for (let i = 1; i < ring.length; i++) d += `L${ring[i][0].toFixed(1)},${ring[i][1].toFixed(1)}`
  return d + 'Z'
}
