import { Component, useEffect, useRef, useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import { useWebGL } from '../webgl/index.js'
import VelourBolster from '../components/VelourBolster.jsx'
import { MohairButton } from '../components/fur/FurButton.jsx'
import cvEn from '../assets/files/CV-English.pdf'
import cvEs from '../assets/files/CV-Español.pdf'
import poster from '../assets/backgrounds/hero-poster.webp'
import './Hero.css'

/* If the scene throws (blocked or corrupt GLB, context loss) the poster and the
   plain-HTML texts stay: a missing 3D model must never blank the page. */
class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err) {
    console.warn('hero scene failed, keeping the static poster', err)
    this.props.onFail?.()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/* Home hero. Three layers:
   1. the poster (static fallback — low-end devices, reduced motion, no WebGL2,
      over budget — and what the prerender ships), with the name and role as
      plain HTML on top;
   2. the R3F scene, loaded on demand and mounted only while src/webgl grants a
      slot; once its first frame is drawn the poster fades and the texts move
      into the scene (still DOM, still a real <h1>). */
/** "Diseñador y Desarrollador" → ["Diseñador y", "Desarrollador"]: two lines, broken at the last space. */
function twoLines(text) {
  const t = text.trim()
  const k = t.lastIndexOf(' ')
  return k > 0 ? [t.slice(0, k), t.slice(k + 1)] : [t]
}

/* V3 §E.1 (reference: docs/ref/hero-prototipo.png). The bust is centred.
   "Julián Galindo" sits up and to the right of it, in two lines, partly over the
   leaves on the right; "Diseñador y Desarrollador" down and to the left, against
   the bust at the height of the beard, two lines of Libre Baskerville. Both lean
   with the camera (the scene tilts its group by the pointer's height; the words
   take the same angle through --hero-tilt-x/-y). The two buttons are centred
   under the bust. On phones the same order runs vertically: name, bust, role,
   buttons, with no text over the bust. */
export default function Hero() {
  const { t, locale } = useLocale()
  const { ref, active } = useWebGL({ id: 'hero' })
  const [Scene, setScene] = useState(null)
  const [status, setStatus] = useState('pending')
  const [draws] = useState(() => ({ n: 0 }))
  const sectionRef = useRef(null)
  const [phone, setPhone] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 719px), (max-aspect-ratio: 7/5)')
    const on = () => setPhone(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const setRefs = (el) => {
    ref.current = el
    sectionRef.current = el
  }
  useEffect(() => {
    if (sectionRef.current) sectionRef.current.__draws = draws
  }, [draws])

  // The words lean with the camera: same input as HeroScene (pointer height over the hero), damped.
  useEffect(() => {
    const el = sectionRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let tx = 0
    let ty = 0
    let want = { x: 0, y: 0 }
    let raf = 0
    const step = () => {
      tx += (want.x - tx) * 0.08
      ty += (want.y - ty) * 0.08
      el.style.setProperty('--hero-tilt-x', `${(ty * 2.5).toFixed(3)}deg`)
      el.style.setProperty('--hero-tilt-y', `${(tx * 2).toFixed(3)}deg`)
      raf = Math.abs(want.x - tx) + Math.abs(want.y - ty) > 0.001 ? requestAnimationFrame(step) : 0
    }
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const inside = e.clientY >= r.top && e.clientY <= r.bottom && e.clientX >= r.left && e.clientX <= r.right
      want = inside ? { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -(((e.clientY - r.top) / r.height) * 2 - 1) } : { x: 0, y: 0 }
      if (!raf) raf = requestAnimationFrame(step)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!active) return
    let cancelled = false
    import('./HeroScene.jsx').then((m) => {
      if (!cancelled) setScene(() => m.default)
    })
    return () => {
      cancelled = true
      setScene(null)
      setStatus('pending')
    }
  }, [active])

  const live = Boolean(active && Scene && status === 'ready')
  const [first, last] = twoLines(t('hero.name'))
  const role = twoLines(t('hero.tagline'))

  return (
    <section ref={setRefs} className={`hero ${live ? 'hero--live' : ''}`} data-webgl={live ? 'active' : 'fallback'}>
      <h1 className="hero__name">
        <span>{first}</span> <span>{last}</span>
      </h1>
      <div className="hero__stage">
        <img className="hero__poster" src={poster} alt="" width="549" height="752" decoding="async" />
        {active && Scene && (
          <SceneBoundary onFail={() => setStatus('pending')}>
            <Scene onStatus={setStatus} draws={draws} />
          </SceneBoundary>
        )}
      </div>
      <p className="hero__role">
        {role.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </p>
      <div className="hero__actions">
        <VelourBolster label={t('hero.ctaProjects')} to="/projects" width={phone ? 176 : 232} height={phone ? 52 : 60} lang={locale} />
        <MohairButton
          label={t('hero.ctaCv')}
          href={locale === 'es' ? cvEs : cvEn}
          download={locale === 'es' ? 'Julian-Galindo-CV-Espanol.pdf' : 'Julian-Galindo-CV-English.pdf'}
          height={phone ? 52 : 56}
          lang={locale}
        />
      </div>
    </section>
  )
}
