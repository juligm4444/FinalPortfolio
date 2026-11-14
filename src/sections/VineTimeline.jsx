import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import Surface from '../components/Surface.jsx'
import './VineTimeline.css'

/* REDESIGN §5 About — the timeline as a vine climbing a brutalist pier. Every
   milestone is a sprout; the whole thing exists in the DOM without JS. The
   vine's stroke follows the scroll (stroke-dashoffset from the section's
   position, no hijacking); with reduced motion or no JS it is drawn whole. */
const W = 64
const X = 32

/* One gentle S between consecutive sprouts, climbing from the foot (bottom of
   the list) up to the first milestone. `ys` are the sprouts' real y positions. */
function vinePath(ys, H) {
  const pts = [H, ...[...ys].reverse()]
  let d = `M ${X} ${pts[0]}`
  for (let i = 1; i < pts.length; i++) {
    const y0 = pts[i - 1]
    const y1 = pts[i]
    const dy = y0 - y1
    const sway = i % 2 ? 22 : -22
    d += ` C ${X + sway} ${y0 - dy * 0.25}, ${X - sway} ${y0 - dy * 0.75}, ${X} ${y1}`
  }
  return d
}

export default function VineTimeline() {
  const { t } = useLocale()
  const items = t('about.timeline')
  const n = items.length
  const root = useRef(null)
  const vine = useRef(null)
  const list = useRef(null)
  // Sprout positions measured from the real list, so the vine passes through every
  // milestone whatever the text length. Before measuring (prerender) it uses an even step.
  const [geom, setGeom] = useState(() => ({ H: n * 140 + 40, ys: items.map((_, i) => i * 140 + 24) }))

  useLayoutEffect(() => {
    const ol = list.current
    if (!ol) return
    const measure = () => {
      const lis = [...ol.children]
      const ys = lis.map((li) => li.offsetTop + 24)
      setGeom({ H: ol.offsetHeight + 24, ys })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(ol)
    return () => ro.disconnect()
  }, [n])

  useEffect(() => {
    const el = root.current
    const path = vine.current
    if (!el || !path) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const len = path.getTotalLength()
    if (!len) return
    path.style.strokeDasharray = `${len}`
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the foot enters the viewport bottom, 1 when the head passes 30% from the top.
      const p = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh * 0.7)))
      path.style.strokeDashoffset = `${len * (1 - p)}`
      el.style.setProperty('--vine-progress', p.toFixed(3))
      el.querySelectorAll('.vine__item').forEach((li, i) => {
        const at = (n - i) / (n + 0.5)
        li.classList.toggle('is-grown', p >= at - 0.02)
      })
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
  }, [n, geom])

  return (
    <Surface as="section" ref={root} className="vine" aria-labelledby="vine-title">
      <header className="vine__head">
        <p className="vine__kicker">{t('about.timelineKicker')}</p>
        <h2 id="vine-title" className="vine__title">
          {t('about.timelineTitle')}
        </h2>
      </header>
      <div className="vine__body">
        <svg className="vine__svg" viewBox={`0 0 ${W} ${geom.H}`} width={W} height={geom.H} aria-hidden="true">
          <rect className="vine__pier" x={X - 10} y="0" width="20" height={geom.H} />
          <path ref={vine} className="vine__stem" d={vinePath(geom.ys, geom.H)} />
        </svg>
        <ol ref={list} className="vine__list">
          {items.map((it, i) => (
            <li key={i} className={`vine__item ${it.bloom ? 'vine__item--bloom' : ''}`} style={{ '--i': i }}>
              <span className="vine__sprout" aria-hidden="true" />
              <time className="vine__date">{it.date}</time>
              <h3 className="vine__item-title">{it.title}</h3>
              <p className="vine__text">{it.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </Surface>
  )
}
