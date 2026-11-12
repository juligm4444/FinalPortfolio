import { useEffect, useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import translations from '../i18n/translations.js'
import { useWebGLRegistry, getCapabilities } from '../webgl/index.js'
import BotanicalText from '../components/BotanicalText.jsx'
import MoonlitPetals from '../components/MoonlitPetals.jsx'
import VelourBolster from '../components/VelourBolster.jsx'

/* Frames per second over a half-second window, sampled in rAF. */
function useFps() {
  const [fps, setFps] = useState(0)
  useEffect(() => {
    let frames = 0
    let last = performance.now()
    let id = 0
    const loop = (now) => {
      frames++
      if (now - last >= 500) {
        setFps(Math.round((frames * 1000) / (now - last)))
        frames = 0
        last = now
      }
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [])
  return fps
}

/* /lab — bench for porting components one at a time (Fase 3).
   Not prerendered, noindex. Shows the WebGL budget and frame rate live. */
export default function Lab() {
  const { t } = useLocale()
  const reg = useWebGLRegistry()
  const fps = useFps()
  const caps = typeof window === 'undefined' ? { allowed: false, reason: 'ssr' } : getCapabilities()

  return (
    <section className="mx-auto w-full max-w-content px-4 pt-12 md:px-8">
      {/* Botanical Text is the page's H1: the real heading is inside it. */}
      <BotanicalText text={t('lab.title')} size={120} />
      <p className="mt-2 max-w-prose font-body text-body text-text-muted">{t('lab.lead')}</p>

      <h2 className="mt-12 font-display text-h3">{t('lab.botanicalVariants')}</h2>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        {['es', 'en'].map((lang) => (
          <figure key={lang} className="m-0">
            <figcaption className="font-label text-label-sm uppercase text-text-muted">
              {translations[lang].nav.langShort[lang]}
            </figcaption>
            <BotanicalText as="p" text={translations[lang].lab.title} lang={lang} size={88} />
          </figure>
        ))}
      </div>

      <h2 className="mt-12 font-display text-h3">{t('lab.moonlitVariants')}</h2>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        {['es', 'en'].map((lang) => (
          <figure key={lang} className="m-0">
            <figcaption className="mb-2 font-label text-label-sm uppercase text-text-muted">
              {translations[lang].lab.moonlitCaption}
            </figcaption>
            <MoonlitPetals label={translations[lang].lab.moonlitLabel} lang={lang} />
          </figure>
        ))}
      </div>

      <h2 className="mt-12 font-display text-h3">{t('lab.velourVariants')}</h2>
      <div className="mt-6 flex flex-wrap items-center gap-x-12 gap-y-10">
        <VelourBolster label={translations.es.lab.velourLabel} lang="es" to="/projects" />
        <VelourBolster label={translations.en.lab.velourLabel} lang="en" onClick={() => {}} />
      </div>

      <dl className="mt-12 grid max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-label text-label-sm uppercase">
        <dt className="text-text-muted">{t('lab.webglActive')}</dt>
        <dd data-lab="active">
          {reg.active.length} / {reg.max}
        </dd>
        <dt className="text-text-muted">{t('lab.webglWaiting')}</dt>
        <dd data-lab="waiting">{reg.waiting.length}</dd>
        <dt className="text-text-muted">{t('lab.webglCaps')}</dt>
        <dd data-lab="caps">{caps.reason}</dd>
        <dt className="text-text-muted">{t('lab.fps')}</dt>
        <dd data-lab="fps">{fps}</dd>
      </dl>
    </section>
  )
}
