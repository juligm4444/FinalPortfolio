import { useLocale } from '../i18n/LocaleProvider.jsx'
import { useWebGLRegistry, getCapabilities } from '../webgl/index.js'

/* /lab — empty bench for porting components one at a time (Fase 3).
   Not prerendered, noindex. Shows the WebGL budget live. */
export default function Lab() {
  const { t } = useLocale()
  const reg = useWebGLRegistry()
  const caps = typeof window === 'undefined' ? { allowed: false, reason: 'ssr' } : getCapabilities()

  return (
    <section className="mx-auto w-full max-w-content px-4 pt-16 md:px-8">
      <h1 className="font-display text-h2">{t('lab.title')}</h1>
      <p className="mt-4 max-w-prose font-body text-body text-text-muted">{t('lab.lead')}</p>

      <dl className="mt-12 grid max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-label text-label-sm uppercase">
        <dt className="text-text-muted">{t('lab.webglActive')}</dt>
        <dd data-lab="active">
          {reg.active.length} / {reg.max}
        </dd>
        <dt className="text-text-muted">{t('lab.webglWaiting')}</dt>
        <dd data-lab="waiting">{reg.waiting.length}</dd>
        <dt className="text-text-muted">{t('lab.webglCaps')}</dt>
        <dd data-lab="caps">{caps.reason}</dd>
      </dl>

      <ul className="mt-6 font-body text-small text-text-muted" aria-label={t('lab.webglActive')}>
        {reg.active.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    </section>
  )
}
