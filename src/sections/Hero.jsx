import { Component, useEffect, useRef, useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import { useWebGL } from '../webgl/index.js'
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
export default function Hero() {
  const { t } = useLocale()
  const { ref, active } = useWebGL({ id: 'hero' })
  const [Scene, setScene] = useState(null)
  const [status, setStatus] = useState('pending')
  const [draws] = useState(() => ({ n: 0 }))
  const sectionRef = useRef(null)
  const setRefs = (el) => {
    ref.current = el
    sectionRef.current = el
  }
  useEffect(() => {
    // /lab-style bench: frames drawn, readable from the DOM.
    if (sectionRef.current) sectionRef.current.__draws = draws
  }, [draws])

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
  const name = t('hero.name')
  const role = t('hero.tagline').trim()

  return (
    <section ref={setRefs} className={`hero ${live ? 'hero--live' : ''}`} data-webgl={live ? 'active' : 'fallback'}>
      <img className="hero__poster" src={poster} alt="" width="549" height="752" decoding="async" />
      {!live && (
        <div className="hero__static">
          <h1>{name}</h1>
          <p>{role}</p>
        </div>
      )}
      {active && Scene && (
        <SceneBoundary onFail={() => setStatus('pending')}>
          <Scene name={name} role={role} onStatus={setStatus} draws={draws} />
        </SceneBoundary>
      )}
    </section>
  )
}
