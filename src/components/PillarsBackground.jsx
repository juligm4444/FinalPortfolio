import { useEffect, useRef, useState } from 'react'

/**
 * Honeycomb background — independent flat-top hexagons. Replaces the previous
 * vertical pillars while keeping the same interaction language:
 *   - hover-driven (no auto-rotate)
 *   - one hex flips per mouse crossing
 *   - direction-of-flip depends on which side the cursor came from
 *   - subtle borders so adjacent hexes stay distinguishable
 *
 * Geometry — flat-top hex with side length s:
 *   width  = 2s     (corner-to-corner, horizontal)
 *   height = s · √3 (flat-to-flat, vertical)
 *   col stride = 1.5s   (horizontal spacing between column centres)
 *   row stride = s · √3 (vertical spacing within the same column)
 *   odd columns are offset vertically by row stride / 2
 */

const SIDE = 70 // hex side length s — controls density (smaller = more hexes)
const HEX_W = SIDE * 2
const HEX_H = SIDE * Math.sqrt(3)
const COL_DX = SIDE * 1.5
const ROW_DY = HEX_H

const T_FLIP = 700 // ms per flip (180° rotateY)
const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)

// flat-top hex polygon as percentages of its bounding box
const HEX_CLIP =
  'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'

export default function HexBackground() {
  const [layout, setLayout] = useState({ cols: 0, rows: 0, hexes: [] })
  const wrappersRef = useRef([])
  // accumulated rotation per hex — 2 axes (X + Y) so the hex can flip in any
  // of the four cardinal directions depending on the mouse's incoming side.
  const anglesRef = useRef([])
  const tokensRef = useRef([]) // shade animation token per hex
  const prevIdxRef = useRef(-1)

  // Compute hex grid that covers the viewport with bleed on every side.
  // Odd columns are vertically offset by half a row, so we start one row
  // ABOVE the top edge for every column — otherwise odd columns leave a
  // half-row gap that reveals the page background.
  useEffect(() => {
    const compute = () => {
      const W = window.innerWidth
      const H = window.innerHeight
      const cols = Math.ceil(W / COL_DX) + 2
      const rows = Math.ceil(H / ROW_DY) + 3
      const rowsPerCol = rows + 1 // because we start at r = -1
      const hexes = []
      let idx = 0
      for (let c = 0; c < cols; c++) {
        for (let r = -1; r < rows; r++) {
          const cx = c * COL_DX + HEX_W / 2 - SIDE / 2
          const cy = r * ROW_DY + (c % 2) * (ROW_DY / 2) + HEX_H / 2
          hexes.push({ idx, c, r, cx, cy, x: cx - HEX_W / 2, y: cy - HEX_H / 2 })
          idx++
        }
      }
      setLayout({ cols, rows, rowsPerCol, hexes })
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  // reset state buffers when the grid changes
  useEffect(() => {
    const n = layout.hexes.length
    if (!n) return
    anglesRef.current = Array.from({ length: n }, () => ({ x: 0, y: 0 }))
    tokensRef.current = Array(n).fill(0)
    prevIdxRef.current = -1
  }, [layout.hexes.length])

  // Mouse tracking — find the hex whose centre is closest to the cursor.
  // Triggers a single 180° flip when the cursor crosses into a different hex.
  useEffect(() => {
    const hexes = layout.hexes
    if (!hexes.length) return

    const findClosest = (mx, my) => {
      // Coarse-to-fine: clamp by column first, then probe a 3×3 neighbourhood.
      const c0 = Math.max(0, Math.min(layout.cols - 1, Math.floor(mx / COL_DX)))
      let best = -1
      let bestD = Infinity
      for (let dc = -1; dc <= 1; dc++) {
        const c = c0 + dc
        if (c < 0 || c >= layout.cols) continue
        // r is now allowed to start at -1 (odd-column gap fix)
        const r0 = Math.floor(
          (my - (c % 2) * (ROW_DY / 2) - HEX_H / 2) / ROW_DY
        )
        for (let dr = 0; dr <= 1; dr++) {
          const r = r0 + dr
          if (r < -1 || r >= layout.rows) continue
          // hex index: column c stores rowsPerCol entries (r = -1, 0, 1, ...)
          const i = c * layout.rowsPerCol + (r + 1)
          const h = hexes[i]
          if (!h) continue
          const dx = mx - h.cx
          const dy = my - h.cy
          const d2 = dx * dx + dy * dy
          if (d2 < bestD) {
            bestD = d2
            best = i
          }
        }
      }
      return best
    }

    const animateShade = (idx) => {
      const myToken = (tokensRef.current[idx] || 0) + 1
      tokensRef.current[idx] = myToken
      const start = performance.now()
      const el = wrappersRef.current[idx]
      if (!el) return
      const tick = (now) => {
        if (tokensRef.current[idx] !== myToken) return
        const t = (now - start) / T_FLIP
        if (t >= 1) {
          el.style.setProperty('--shade', '0')
          return
        }
        const v = Math.sin(Math.min(t, 1) * Math.PI) * 0.85
        el.style.setProperty('--shade', v.toFixed(3))
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    // Flip a hex 180° around the axis dictated by the cursor's direction:
    // - mostly horizontal motion → rotate around Y (left/right)
    // - mostly vertical motion   → rotate around X (up/down)
    // Both axes accumulate independently, so a hex can end up flipped on any
    // combination of the four cardinal directions.
    const flipHex = (idx, dx, dy) => {
      const el = wrappersRef.current[idx]
      if (!el) return
      const a = anglesRef.current[idx] || (anglesRef.current[idx] = { x: 0, y: 0 })
      if (Math.abs(dx) >= Math.abs(dy)) {
        a.y += dx >= 0 ? 180 : -180
      } else {
        a.x += dy >= 0 ? -180 : 180
      }
      el.style.transition = `transform ${T_FLIP}ms cubic-bezier(0.65, 0, 0.35, 1)`
      el.style.transform = `rotateX(${a.x}deg) rotateY(${a.y}deg)`
      animateShade(idx)
    }

    const onMove = (e) => {
      const idx = findClosest(e.clientX, e.clientY)
      if (idx < 0) return
      if (idx === prevIdxRef.current) return
      const prev = prevIdxRef.current
      prevIdxRef.current = idx
      // direction vector between the previous and current hex centres
      let dx, dy
      if (prev === -1) {
        // first entry — undecidable; default to "from the left"
        dx = 1
        dy = 0
      } else {
        dx = hexes[idx].cx - hexes[prev].cx
        dy = hexes[idx].cy - hexes[prev].cy
      }
      flipHex(idx, dx, dy)
    }

    const onLeave = () => {
      prevIdxRef.current = -1
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [layout])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        perspective: '2200px',
        perspectiveOrigin: '50% 50%',
        // bleed beyond the viewport so edge hexes never reveal the canvas
        margin: -HEX_H / 2,
      }}
    >
      {layout.hexes.map((h) => (
        // 1 px inflate on each side hides hairline sub-pixel gaps between
        // neighbouring hexes (ROW_DY uses √3, so vertical spacing is fractional).
        <div
          key={h.idx}
          style={{
            position: 'absolute',
            left: h.x - 1,
            top: h.y - 1,
            width: HEX_W + 2,
            height: HEX_H + 2,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            ref={(el) => (wrappersRef.current[h.idx] = el)}
            style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
              transform: 'rotateY(0deg)',
            }}
          >
            <Face />
            <Face flipped />
          </div>
        </div>
      ))}
    </div>
  )
}

function Face({ flipped = false }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: flipped ? 'rotateY(180deg)' : 'none',
      }}
    >
      {/* outer (border colour) clipped to hex — uses --hex-border so dark
          mode can crank the alpha up for clearer separators. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--hex-border)',
          clipPath: HEX_CLIP,
          WebkitClipPath: HEX_CLIP,
        }}
      />
      {/* inner (fill) — slightly inset to leave a hairline border ring */}
      <div
        style={{
          position: 'absolute',
          inset: 1.5,
          background: 'var(--pillar)',
          clipPath: HEX_CLIP,
          WebkitClipPath: HEX_CLIP,
        }}
      />
      {/* directional shading — only visible while flipping */}
      <div
        style={{
          position: 'absolute',
          inset: 1.5,
          background:
            'linear-gradient(90deg, transparent 0%, transparent 35%, var(--pillar-shade) 100%)',
          opacity: 'var(--shade, 0)',
          mixBlendMode: 'multiply',
          clipPath: HEX_CLIP,
          WebkitClipPath: HEX_CLIP,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
