/**
 * Procedural fluid blobs.
 *
 * The comp's shapes were static vectors; sliding them around with CSS
 * transforms reads as two cut-outs being dragged, not as liquid. So the paths
 * are generated instead: a ring of points whose radius is the sum of a few
 * sine waves at different frequencies, with every wave's phase advancing at
 * its own rate. Nothing repeats on any human timescale, and the outline is
 * always genuinely deforming rather than merely moving.
 *
 * Points are joined with a closed Catmull-Rom spline converted to cubic
 * béziers, which keeps the silhouette smooth no matter how the harmonics land.
 */

const TWO_PI = Math.PI * 2

/**
 * Catmull-Rom through all points, emitted as a closed cubic bézier path.
 * Tension 1/6 is the standard conversion factor that makes the spline pass
 * through its control points instead of merely near them.
 */
function closedSpline(points) {
  const n = points.length
  if (n < 3) return ''
  let d = `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n]
    const p1 = points[i]
    const p2 = points[(i + 1) % n]
    const p3 = points[(i + 2) % n]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += `C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`
  }
  return d + 'Z'
}

/**
 * @param cx,cy   centre, in viewBox units
 * @param rx,ry   base radii — unequal values give an elongated mass rather
 *                than a circle wearing ripples
 * @param t       seconds; drives every harmonic's phase
 * @param harms   [{ freq, amp, speed, phase }]
 * @param steps   sample count around the ring
 */
export function blobPath(cx, cy, rx, ry, t, harms, steps = 64) {
  const pts = new Array(steps)
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * TWO_PI
    let k = 1
    for (const h of harms) k += h.amp * Math.sin(h.freq * a + h.speed * t + h.phase)
    pts[i] = [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]
  }
  return closedSpline(pts)
}

/**
 * The two masses. Both are far wider than the 1920 × 1100 field and sit
 * mostly outside it: only their edges cross the frame, which is what makes
 * the boundary between them read as a meeting of two liquids rather than as
 * a shape floating on a background.
 */
export const FLUIDS = {
  pale: {
    // Anchored off the top-left corner. The masses are sized so that neither
    // swallows the frame: the pink they meet over has to stay a visible third
    // surface, otherwise the word has only two grounds to react to and the
    // whole colour rule stops reading.
    rest: { cx: 170, cy: 150 },
    from: { cx: -1350, cy: -120 }, // enters from the left
    rx: 900,
    ry: 640,
    // Amplitudes are large on purpose. Small ones leave a circle wearing
    // ripples; it takes roughly a third of the radius before the outline
    // stops reading as an ellipse and starts reading as something poured.
    harms: [
      { freq: 1, amp: 0.34, speed: 0.11, phase: 0.0 },
      { freq: 2, amp: 0.22, speed: -0.17, phase: 1.7 },
      { freq: 3, amp: 0.13, speed: 0.25, phase: 3.1 },
      { freq: 5, amp: 0.06, speed: -0.33, phase: 5.2 },
    ],
  },
  dark: {
    // The mirror of the pale mass, off the bottom-right. The two arrive along
    // the same diagonal from opposite ends and stop short of each other.
    rest: { cx: 1760, cy: 960 },
    from: { cx: 3350, cy: 1240 }, // enters from the right
    rx: 880,
    ry: 620,
    harms: [
      { freq: 1, amp: 0.31, speed: -0.09, phase: 2.4 },
      { freq: 2, amp: 0.25, speed: 0.15, phase: 0.6 },
      { freq: 3, amp: 0.11, speed: -0.21, phase: 4.4 },
      { freq: 4, amp: 0.07, speed: 0.29, phase: 1.1 },
    ],
  },
}

/** Ease for the arrival — fast in, long settle, no bounce. */
export const easeOutQuint = (x) => 1 - Math.pow(1 - x, 5)
