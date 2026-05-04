import { useLocale } from '../i18n/LocaleProvider.jsx'
import Timeline from '../components/Timeline.jsx'

export default function Experience() {
  const { t } = useLocale()
  const items = t('about.experienceItems')

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-20 md:px-8 md:py-28">
      <div className="mb-12 max-w-[60ch]">
        <p
          className="font-nav uppercase"
          style={{ color: 'var(--fg-muted)', fontSize: 12, letterSpacing: '0.22em' }}
        >
          {t('about.experienceKicker')}
        </p>
        <h2
          className="mt-3 font-display"
          style={{
            color: 'var(--fg)',
            fontSize: 'clamp(30px, 3.8vw, 48px)',
            lineHeight: 1.1,
            fontWeight: 700,
          }}
        >
          {t('about.experienceTitle')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-1" aria-hidden />
        <div className="md:col-span-11">
          <Timeline items={items} glass />
        </div>
      </div>
    </section>
  )
}
