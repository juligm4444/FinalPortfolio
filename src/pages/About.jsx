import { useLocale } from '../i18n/LocaleProvider.jsx'
import AboutInformation from '../sections/AboutInformation.jsx'
import Education from '../sections/Education.jsx'
import Experience from '../sections/Experience.jsx'
import Focus from '../sections/Focus.jsx'
import Skills from '../sections/Skills.jsx'
import Certifications from '../sections/Certifications.jsx'

export default function About() {
  const { t } = useLocale()
  return (
    <>
      <section className="mx-auto w-full max-w-[1200px] px-4 pt-20 md:px-8 md:pt-32">
        <h1
          className="font-display"
          style={{
            color: 'var(--fg)',
            fontSize: 'clamp(48px, 7vw, 96px)',
            lineHeight: 1.02,
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
        >
          {t('about.title')}
        </h1>
        <p
          className="mt-8 font-body"
          style={{
            color: 'var(--fg-soft)',
            fontSize: 18,
            lineHeight: 1.7,
            // expand to the full container width — was previously capped at 60ch
            maxWidth: 'none',
          }}
        >
          {t('about.lead')}
        </p>
      </section>

      <AboutInformation />
      <Education />
      <Experience />
      <Focus />
      <Skills />
      <Certifications />
    </>
  )
}
