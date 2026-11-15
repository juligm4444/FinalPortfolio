import { Component, useEffect, useRef, useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import { useWebGL } from '../webgl/index.js'
import VelourBolster from '../components/VelourBolster.jsx'
import { MohairButton } from '../components/fur/FurButton.jsx'
import BotanicalText from '../components/BotanicalText.jsx'
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
export default function Hero() {
  const { t, locale } = useLocale()
  const { ref, active } = useWebGL({ id: 'hero' })
  const [Scene, setScene] = useState(null)
  const [status, setStatus] = useState('pending')
  const [draws] = useState(() => ({ n: 0 }))
  const sectionRef = useRef(null)
  // Phone: a smaller primary button so both calls to action sit on one row.
  const [phone, setPhone] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 719px)')
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
      <div className="hero__stage">
        <img className="hero__poster" src={poster} alt="" width="549" height="752" decoding="async" />
        {/* The H1 is the same Botanical Text as About and Projects (plain on phones and touch). */}
        <div className="hero__static">
          <BotanicalText text={name.replace(' ', '\n')} size={96} id="home-h1" className="hero__h1" />
          <p>{role}</p>
        </div>
        {active && Scene && (
          <SceneBoundary onFail={() => setStatus('pending')}>
            <Scene onStatus={setStatus} draws={draws} />
          </SceneBoundary>
        )}
      </div>
      <div className="hero__actions">
        <VelourBolster label={t('hero.ctaProjects')} to="/projects" width={phone ? 176 : 232} height={phone ? 52 : 64} lang={locale} />
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
