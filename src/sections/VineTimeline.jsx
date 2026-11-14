import { useEffect, useRef } from 'react'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import './VineTimeline.css'

/* REDESIGN §5 About — the timeline as a vine climbing a brutalist pier. Every
   milestone is a sprout; the whole thing exists in the DOM without JS. The
   vine's stroke follows the scroll (stroke-dashoffset from the section's
   position, no hijacking); with reduced motion or no JS it is drawn whole. */
const W = 120
const STEP = 100
const X = 60

function vinePath(n) {
  // One gentle S per milestone, climbing from the foot to the last sprout.
  let d = `M ${X} ${n * STEP + 40}`
  for (let i = n - 1; i >= 0; i--) {
    const y1 = i * STEP + 40
    const sway = i % 2 ? 16 : -16
    d += ` C ${X + sway} ${y1 + STEP * 0.75}, ${X - sway} ${y1 + STEP * 0.25}, ${X} ${y1}`
  }
  return d
}

export default function VineTimeline() {
  const { t } = useLocale()
  const items = t('about.timeline')
  const n = items.length
  const H = n * STEP + 60
  const root = useRef(null)
  const vine = useRef(null)

  useEffect(() => {
    const el = root.current
    const path = vine.current
    if (!el || !path) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const len = path.getTotalLength()
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
  }, [n])

  return (
    <section ref={root} className="vine" aria-labelledby="vine-title">
      <header className="vine__head">
        <p className="vine__kicker">{t('about.timelineKicker')}</p>
        <h2 id="vine-title" className="vine__title">
          {t('about.timelineTitle')}
        </h2>
      </header>
      <div className="vine__body" style={{ '--vine-h': `${H}px` }}>
        <svg className="vine__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <rect className="vine__pier" x={X - 14} y="0" width="28" height={H} />
          <path ref={vine} className="vine__stem" d={vinePath(n)} />
        </svg>
        <ol className="vine__list">
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
    </section>
  )
}
