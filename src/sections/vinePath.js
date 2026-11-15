/* One stem through every milestone, top to bottom (V3 §F.2). Shared by the 3D
   scene and the SVG fallback, so both run the same course and the test
   (scripts/test-vine.mjs) can check it against the cards on the page.
   `anchors` are the milestones' y in px (inside the timeline body); `cx` the
   stem's centre column. Returns the control points, in px. */
export const SWAY = 16

export function stemPoints(anchors, cx, H) {
  if (!anchors.length) return []
  const first = anchors[0]
  const last = anchors[anchors.length - 1]
  const pts = [[cx, Math.max(0, first - 40)]]
  anchors.forEach((y, i) => pts.push([cx + (i % 2 ? SWAY : -SWAY), y]))
  pts.push([cx, Math.min(H, last + 40)])
  return pts
}

/** Smooth SVG path through the points (Catmull-Rom → cubic Bézier). */
export function svgPath(pts) {
  if (pts.length < 2) return ''
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0]} ${p2[1]}`
  }
  return d
}
