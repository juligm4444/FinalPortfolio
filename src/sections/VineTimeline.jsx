import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import { useWebGL } from '../webgl/index.js'
import { stemPoints, svgPath } from './vinePath.js'
import './VineTimeline.css'

/* V3 §F.2 — timeline. A vine runs through ALL the milestones, top to bottom,
   and is drawn as the page scrolls; at each milestone a short branch reaches its
   card and a leaf opens (the "Diseño" milestone opens a flower).
   - Desktop with a WebGL slot: VineScene.jsx (R3F, the bust's own plant).
   - Phones and no WebGL: an SVG with the same course (vinePath.js), drawn with
     the scroll, sprouts at every milestone.
   - Reduced motion: the whole vine, no animation.
   Milestones are concrete slabs. The course is published on the element
   (data-vine) for scripts/test-vine.mjs, which checks it touches all nine. */
const COL = { desk: 120, phone: 44 }

export default function VineTimeline() {
  const { t } = useLocale()
  const items = t('about.timeline')
  const n = items.length
  const root = useRef(null)
  const body = useRef(null)
  const list = useRef(null)
  const stemRef = useRef(null)
  const progress = useRef({ line: 0, full: false, reduced: false })
  const [geom, setGeom] = useState(() => ({ H: n * 160 + 40, ys: items.map((_, i) => i * 160 + 30), col: COL.desk }))
  const [desk, setDesk] = useState(false)
  const { ref: glRef, active } = useWebGL({ id: 'vine', disabled: !desk })
  const [Scene, setScene] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const on = () => setDesk(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Milestone anchors from the real cards: the vine meets each one at its title line.
  useLayoutEffect(() => {
    const ol = list.current
    if (!ol) return
    const measure = () => {
      const lis = [...ol.children]
      const ys = lis.map((li) => li.offsetTop + 34)
      setGeom({ H: ol.offsetHeight, ys, col: window.innerWidth >= 768 ? COL.desk : COL.phone })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(ol)
    return () => ro.disconnect()
  }, [n])

  useEffect(() => {
    if (!active) return
    let cancelled = false
    import('./VineScene.jsx').then((m) => !cancelled && setScene(() => m.default))
    return () => {
      cancelled = true
      setScene(null)
      setReady(false)
    }
  }, [active])

  // Scroll → how far down the body the vine has grown (px). The tip follows a line 70% down the viewport.
  useEffect(() => {
    const el = body.current
    const path = stemRef.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    progress.current.reduced = reduced
    progress.current.full = reduced
    const len = path?.getTotalLength?.() || 0
    if (path && len) path.style.strokeDasharray = `${len}`
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const line = Math.max(0, Math.min(geom.H, window.innerHeight * 0.7 - r.top))
      progress.current.line = line
      el.style.setProperty('--vine-line', `${line}px`)
      if (path && len) {
        // dash offset by length at that height: walk the path to the matching y
        let lo = 0
        let hi = len
        for (let k = 0; k < 18; k++) {
          const mid = (lo + hi) / 2
          if (path.getPointAtLength(mid).y < line) lo = mid
          else hi = mid
        }
        path.style.strokeDashoffset = reduced ? '0' : `${len - lo}`
      }
      el.querySelectorAll('.vine__item').forEach((li, i) => li.classList.toggle('is-grown', reduced || geom.ys[i] <= line + 1))
      el.querySelectorAll('.vine__node').forEach((g, i) => g.classList.toggle('is-grown', reduced || geom.ys[i] <= line + 1))
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
  }, [geom])

  const cx = geom.col / 2
  const pts = stemPoints(geom.ys, cx, geom.H)
  const blooms = items.map((it) => Boolean(it.bloom))
  const live = Boolean(active && Scene && ready)

  return (
    <section ref={root} className="vine" aria-labelledby="vine-title">
      <header className="vine__head">
        <p className="vine__kicker">{t('about.timelineKicker')}</p>
        <h2 id="vine-title" className="vine__title">
          {t('about.timelineTitle')}
        </h2>
      </header>
      <div
        ref={body}
        className={`vine__body ${live ? 'vine__body--gl' : ''}`}
        style={{ '--vine-col': `${geom.col}px` }}
        data-vine={JSON.stringify({ col: geom.col, points: pts })}
      >
        <div ref={glRef} className="vine__col" style={{ height: geom.H }} aria-hidden="true">
          <svg className="vine__svg" viewBox={`0 0 ${geom.col} ${geom.H}`} width={geom.col} height={geom.H}>
            <path ref={stemRef} className="vine__stem" d={svgPath(pts)} />
            {geom.ys.map((y, i) => (
              <g key={i} className={`vine__node ${blooms[i] ? 'vine__node--bloom' : ''}`} style={{ '--y': `${y}px` }}>
                <path className="vine__twig" d={`M ${pts[i + 1][0]} ${y} Q ${(pts[i + 1][0] + geom.col) / 2} ${y - 8} ${geom.col} ${y - 2}`} />
                <circle className="vine__bud" cx={geom.col - 2} cy={y - 2} r={blooms[i] ? 7 : 5} />
              </g>
            ))}
          </svg>
          {desk && active && Scene && (
            <Scene width={geom.col} height={geom.H} anchors={geom.ys} blooms={blooms} cx={cx} progress={progress} onReady={() => setReady(true)} />
          )}
        </div>
        <ol ref={list} className="vine__list">
          {items.map((it, i) => (
            <li key={i} className={`vine__item concrete ${it.bloom ? 'vine__item--bloom' : ''}`}>
              <time className="vine__date">{it.date}</time>
              <h3 className="vine__item-title">{it.title}</h3>
              <p className="vine__text">{it.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
