import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import Wall from '../components/wall/Wall.jsx'
import { rng } from '../components/wall/rng.js'
import { svgPath } from './vinePath.js'
import './VineTimeline.css'

/* V4 §H.3 — the timeline, organic. Nine stones of different widths and heights,
   at different horizontal offsets, some turned up to 2°, some overlapping the
   next by a few pixels (seeded: stable between loads). A free vine wanders down
   through all nine milestones in order: it crosses OVER some stones, disappears
   BEHIND others, and cracks a few where it passes. Leaves and flowers point any
   way; flowers in the four flower colours, the "Design" milestone keeps the pink
   one. It grows with the scroll; with reduced motion it is drawn whole.
   One SVG path in two layers: behind the stones, and in front of them clipped to
   the stones it crosses over. The course is published on the body (data-vine) for
   scripts/test-vine.mjs, which checks it touches all nine. */
const FLOWERS = ['pink', 'yellow', 'violet', 'white']

function stonesFor(n) {
  const r = rng('timeline-stones')
  return Array.from({ length: n }, (_, i) => {
    const w = 0.6 + r() * 0.3
    return {
      w,
      x: r() * (1 - w),
      rot: (r() - 0.5) * 4, // ≤ 2°
      gap: i === 0 ? 0 : r() < 0.35 ? -(6 + r() * 10) : 14 + r() * 34, // negative: overlaps the previous one
      extra: Math.round(r() * 44), // stones differ in height
      over: r() < 0.55,
      crack: false,
      side: r() < 0.5 ? -1 : 1,
    }
  }).map((s) => ({ ...s, crack: s.over && rng(`crack-${s.x}`)() < 0.6 }))
}

export default function VineTimeline() {
  const { t } = useLocale()
  const items = t('about.timeline')
  const n = items.length
  const stones = useMemo(() => stonesFor(n), [n])
  const body = useRef(null)
  const list = useRef(null)
  const back = useRef(null)
  const front = useRef(null)
  const [geo, setGeo] = useState(null) // measured stone boxes, body size

  // Measure the stones as laid out (prerender: no vine until the client measures).
  useLayoutEffect(() => {
    const ol = list.current
    if (!ol) return
    const measure = () => {
      const W = ol.offsetWidth
      const boxes = [...ol.children].map((li) => ({ x: li.offsetLeft, y: li.offsetTop, w: li.offsetWidth, h: li.offsetHeight }))
      setGeo({ W, H: ol.offsetHeight, boxes })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(ol)
    return () => ro.disconnect()
  }, [n])

  // The course: through each stone at its title line, crossing near its right edge
  // (clear of the text), wandering out into the gaps between stones.
  const course = useMemo(() => {
    if (!geo) return null
    const r = rng('timeline-vine')
    const pts = []
    const anchors = []
    const first = geo.boxes[0]
    pts.push([first.x + first.w * 0.9, Math.max(0, first.y - 24)])
    geo.boxes.forEach((b, i) => {
      const s = stones[i]
      const y = b.y + 34
      // crosses each stone in its right gutter (the stone keeps that strip free of text)
      const x = b.x + b.w * (0.9 + r() * 0.06)
      pts.push([x, y])
      anchors.push({ x, y, i })
      const next = geo.boxes[i + 1]
      if (next) {
        // wanders out into the scene beside the stones before reaching the next one;
        // it never cuts back across a stone's text
        const gy = (b.y + b.h + next.y) / 2 + (r() - 0.5) * 20
        const right = Math.max(b.x + b.w, next.x + next.w)
        const out = Math.min(geo.W - 4, right + 10 + r() * 46) - (s.side < 0 ? (right - Math.max(b.x + b.w * 0.86, next.x + next.w * 0.86)) : 0)
        pts.push([out, gy])
      }
    })
    const last = geo.boxes[geo.boxes.length - 1]
    pts.push([last.x + last.w * 0.7, last.y + last.h + 20])
    return { pts, anchors, d: svgPath(pts) }
  }, [geo, stones])

  // Leaves along the path, flowers at milestones; placed once the path exists.
  const [deco, setDeco] = useState(null)
  useLayoutEffect(() => {
    const path = back.current
    if (!path || !course || !geo) return
    const len = path.getTotalLength()
    const r = rng('timeline-leaves')
    const inBox = (x, y, pred) =>
      geo.boxes.some((b, i) => pred(i) && x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h)
    const leaves = []
    for (let L = 30; L < len; L += 46 + r() * 40) {
      const p = path.getPointAtLength(L)
      // hidden behind a stone: no leaf there
      if (inBox(p.x, p.y, (i) => !stones[i].over)) continue
      leaves.push({ L, x: p.x, y: p.y, a: r() * 360, s: 0.8 + r() * 0.7, tone: r() < 0.5 ? 'a' : 'b', front: inBox(p.x, p.y, (i) => stones[i].over) })
    }
    // arc length at each milestone anchor
    const at = (x, y) => {
      let best = 0
      let bd = 1e9
      for (let L = 0; L <= len; L += 4) {
        const p = path.getPointAtLength(L)
        const d = (p.x - x) ** 2 + (p.y - y) ** 2
        if (d < bd) {
          bd = d
          best = L
        }
      }
      return best
    }
    const blooms = course.anchors.map(({ x, y, i }, k) => {
      const isDesign = Boolean(items[i]?.bloom)
      const flower = isDesign || k % 3 === 1
      return {
        L: at(x, y),
        x,
        y,
        a: r() * 360,
        flower,
        tone: isDesign ? 'pink' : FLOWERS[(k + 1) % 4],
        // milestone flowers always show, in front of their stone
        front: true,
      }
    })
    const cracks = course.anchors
      .filter(({ i }) => stones[i].crack)
      .map(({ x, y, i }) => {
        const rr = rng(`crack-line-${i}`)
        let px = x
        let py = y + 10
        let d = `M${px.toFixed(1)} ${py.toFixed(1)}`
        const dir = rr() < 0.5 ? -1 : 1
        for (let k = 0; k < 6; k++) {
          px += dir * (6 + rr() * 14)
          py += 4 + rr() * 12
          d += ` L${px.toFixed(1)} ${py.toFixed(1)}`
        }
        return { L: at(x, y), d, i }
      })
    setDeco({ len, leaves, blooms, cracks })
  }, [course, geo, stones, items])

  // Grow with the scroll: the tip follows a line 70 % down the viewport.
  useEffect(() => {
    const el = body.current
    if (!el || !deco) return
    const paths = [back.current, front.current].filter(Boolean)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    paths.forEach((p) => (p.style.strokeDasharray = `${deco.len}`))
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const line = reduced ? Infinity : window.innerHeight * 0.7 - r.top
      // grown length: the furthest point of the path above the line
      let grown = 0
      if (line === Infinity) grown = deco.len
      else
        for (let L = 0; L <= deco.len; L += 6) {
          if (back.current.getPointAtLength(L).y <= line) grown = L
        }
      paths.forEach((p) => (p.style.strokeDashoffset = `${deco.len - grown}`))
      el.querySelectorAll('[data-at]').forEach((g) => g.classList.toggle('is-grown', Number(g.dataset.at) <= grown + 1))
      el.querySelectorAll('.stone').forEach((li, i) => li.classList.toggle('is-reached', Boolean(geo && geo.boxes[i].y + 34 <= line)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [deco, geo])

  const leaf = (l, k) => (
    <g key={k} data-at={l.L.toFixed(0)} className="vine__grow" transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.a.toFixed(0)}) scale(${l.s.toFixed(2)})`}>
      <path className={`leaf leaf--${l.tone}`} d="M0 0 C7 -8 18 -8 25 0 C18 8 7 8 0 0Z" />
    </g>
  )
  const bloom = (b, k) => (
    <g key={k} data-at={b.L.toFixed(0)} className="vine__grow" transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.a.toFixed(0)})`}>
      {b.flower ? (
        <g className={`flower flower--${b.tone}`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-8" rx="5" ry="8.5" transform={`rotate(${a})`} />
          ))}
          <circle r="3.6" className="flower__eye" />
        </g>
      ) : (
        <g>
          <path className="leaf leaf--a" d="M0 0 C9 -10 22 -10 30 0 C22 10 9 10 0 0Z" />
          <path className="leaf leaf--b" d="M0 0 C9 -10 22 -10 30 0 C22 10 9 10 0 0Z" transform="rotate(140)" />
        </g>
      )}
    </g>
  )

  return (
    <Wall seed="about-timeline" className="vine" aria-labelledby="vine-title">
      <h2 id="vine-title" className="vine__title">
        {t('about.timelineTitle')}
      </h2>
      <div ref={body} className="vine__body" data-vine={course ? JSON.stringify({ points: course.pts }) : undefined}>
        {course && (
          <svg className="vine__layer vine__layer--back" width={geo.W} height={geo.H + 40} aria-hidden="true">
            <path ref={back} className="vine__stem" d={course.d} />
            {deco?.leaves.filter((l) => !l.front).map(leaf)}
            {deco?.blooms.filter((b) => !b.front).map(bloom)}
          </svg>
        )}
        <ol ref={list} className="vine__list">
          {items.map((it, i) => {
            const s = stones[i]
            return (
              <li
                key={i}
                className={`stone concrete ${it.bloom ? 'stone--bloom' : ''}`}
                style={{
                  width: `${(s.w * 100).toFixed(1)}%`,
                  marginLeft: `${(s.x * 100).toFixed(1)}%`,
                  marginTop: i ? `${s.gap.toFixed(0)}px` : 0,
                  paddingBottom: `calc(var(--space-6) + ${s.extra}px)`,
                  transform: `rotate(${s.rot.toFixed(2)}deg)`,
                  zIndex: 1 + (i % 2),
                }}
              >
                <time className="vine__date">{it.date}</time>
                <h3 className="vine__item-title">{it.title}</h3>
                <p className="vine__text">{it.text}</p>
              </li>
            )
          })}
        </ol>
        {course && (
          <svg className="vine__layer vine__layer--front" width={geo.W} height={geo.H + 40} aria-hidden="true">
            <defs>
              <clipPath id="vine-over">
                {geo.boxes.map((b, i) =>
                  stones[i].over ? <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} transform={`rotate(${stones[i].rot.toFixed(2)} ${b.x + b.w / 2} ${b.y + b.h / 2})`} /> : null
                )}
              </clipPath>
            </defs>
            {deco?.cracks.map((c, k) => (
              <g key={k} data-at={c.L.toFixed(0)} className="vine__grow vine__crack">
                <path d={c.d} className="crack-shadow" />
                <path d={c.d} className="crack-line" />
              </g>
            ))}
            <path ref={front} className="vine__stem" d={course.d} clipPath="url(#vine-over)" />
            {deco?.leaves.filter((l) => l.front).map(leaf)}
            {deco?.blooms.filter((b) => b.front).map(bloom)}
          </svg>
        )}
      </div>
    </Wall>
  )
}
