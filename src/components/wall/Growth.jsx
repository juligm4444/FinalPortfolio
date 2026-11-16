import { rng } from './rng.js'

/* V4 §1 — plants taking the walls. Three reusable pieces, placed on a wall's
   edges with a seeded random so no two walls match: moss along the top joint,
   grass at the base, a vine across a corner. Decorative only (aria-hidden), drawn
   in the edges and the wall's padding, never over its text. SVG in the moss
   tokens; the vine's flowers in the flower colours. */

const fmt = (n) => Number(n.toFixed(1))

function MossTop({ r }) {
  // 2–4 patches of moss lying on the top joint, part on the lip, part spilling down
  const patches = Array.from({ length: 2 + Math.floor(r() * 3) }, () => ({ x: r() * 88, w: 6 + r() * 22 }))
  const blobs = []
  patches.forEach((p, k) => {
    const n = Math.round(p.w * 2.6)
    for (let i = 0; i < n; i++) {
      const x = p.x + (i / n) * p.w + (r() - 0.5) * 1.2
      const edge = Math.sin((i / n) * Math.PI) // thicker in the middle of the patch
      blobs.push({ k, x, y: 12 + (r() - 0.3) * 10 * edge, rad: 3 + r() * 6 * (0.4 + edge), tone: r() < 0.5 ? 'a' : r() < 0.6 ? 'b' : 'c' })
      if (r() < 0.25 * edge) blobs.push({ k, x: x + (r() - 0.5), y: 22 + r() * 16 * edge, rad: 2 + r() * 3, tone: 'a' }) // drips
    }
  })
  return (
    <svg className="growth growth--moss" width="100%" height="44" aria-hidden="true">
      {blobs.map((b, i) => (
        <circle key={i} cx={`${fmt(b.x)}%`} cy={fmt(b.y)} r={fmt(b.rad)} className={`moss moss--${b.tone}`} />
      ))}
    </svg>
  )
}

function GrassBase({ r }) {
  const patches = Array.from({ length: 2 + Math.floor(r() * 3) }, () => ({ x: r() * 85, w: 90 + r() * 220 }))
  return (
    <svg className="growth growth--grass" width="100%" height="90" aria-hidden="true">
      {patches.map((p, k) => {
        const n = Math.round(p.w / 7)
        return (
          <svg key={k} x={`${fmt(p.x)}%`} y="0" width={fmt(p.w)} height="90" overflow="visible">
            {Array.from({ length: n }, (_, i) => {
              const x = (i / n) * p.w + r() * 4
              const mid = Math.sin((i / n) * Math.PI)
              const h = 18 + r() * 52 * (0.35 + mid)
              const lean = (r() - 0.5) * 22
              const w = 1.4 + r() * 1.8
              return (
                <path
                  key={i}
                  className={`blade blade--${r() < 0.35 ? 'b' : 'a'}`}
                  d={`M${fmt(x - w)} 90 Q${fmt(x + lean * 0.4)} ${fmt(90 - h * 0.6)} ${fmt(x + lean)} ${fmt(90 - h)} Q${fmt(x + lean * 0.3 + w * 0.4)} ${fmt(90 - h * 0.5)} ${fmt(x + w)} 90Z`}
                />
              )
            })}
          </svg>
        )
      })}
    </svg>
  )
}

const FLOWER_TONES = ['pink', 'yellow', 'violet', 'white']

function VineCorner({ r, corner }) {
  // a stem from the corner, out across the edge, with leaves pointing every way
  const pts = []
  let x = 6
  let y = 6
  for (let i = 0; i < 6; i++) {
    x += 18 + r() * 26
    y += 10 + r() * 22
    pts.push([x, y])
  }
  let d = 'M2 2'
  pts.forEach(([px, py], i) => {
    const [qx, qy] = i ? pts[i - 1] : [2, 2]
    d += ` Q${fmt(qx + (r() - 0.2) * 30)} ${fmt(qy + (r() - 0.6) * 30)} ${fmt(px)} ${fmt(py)}`
  })
  const leaves = pts.flatMap(([px, py], i) =>
    Array.from({ length: 1 + Math.floor(r() * 2) }, () => ({ x: px + (r() - 0.5) * 10, y: py + (r() - 0.5) * 10, a: r() * 360, s: 0.7 + r() * 0.6, tone: r() < 0.5 ? 'a' : 'b', i }))
  )
  const flower = r() < 0.6 ? { at: pts[2 + Math.floor(r() * 3)], tone: FLOWER_TONES[Math.floor(r() * 4)] } : null
  return (
    <svg className={`growth growth--vine growth--${corner}`} viewBox="0 0 240 200" width="240" height="200" aria-hidden="true">
      <path d={d} className="vine-stem" />
      {leaves.map((l, i) => (
        <path key={i} className={`leaf leaf--${l.tone}`} d="M0 0 C6 -7 16 -7 22 0 C16 7 6 7 0 0Z" transform={`translate(${fmt(l.x)} ${fmt(l.y)}) rotate(${fmt(l.a)}) scale(${fmt(l.s)})`} />
      ))}
      {flower && (
        <g transform={`translate(${fmt(flower.at[0])} ${fmt(flower.at[1])})`} className={`flower flower--${flower.tone}`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-6" rx="3.6" ry="6" transform={`rotate(${a})`} />
          ))}
          <circle r="2.6" className="flower__eye" />
        </g>
      )}
    </svg>
  )
}

export default function Growth({ seed }) {
  const r = rng(`wall:${seed}`)
  let moss = r() < 0.75
  let grass = r() < 0.7
  const vine = r() < 0.55
  if (!moss && !grass && !vine) moss = true
  if (moss && grass && vine && r() < 0.5) grass = false
  const corner = ['tl', 'tr', 'bl', 'br'][Math.floor(r() * 4)]
  return (
    <div className="growth-layer" aria-hidden="true">
      {moss && <MossTop r={r} />}
      {grass && <GrassBase r={r} />}
      {vine && <VineCorner r={r} corner={corner} />}
    </div>
  )
}
