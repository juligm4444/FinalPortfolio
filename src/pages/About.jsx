import { useLocale } from '../i18n/LocaleProvider.jsx'
import MoonlitPetals from '../components/MoonlitPetals.jsx'
import VineTimeline from '../sections/VineTimeline.jsx'
import Credentials from '../sections/Credentials.jsx'

/* REDESIGN §5 About: story, vine timeline, the ocobo as the close, credentials. */
export default function About() {
  const { t, locale } = useLocale()
  return (
    <>
      <header className="about__header">
        <p className="about__kicker">{t('about.label')}</p>
        <h1 className="about__title">{t('about.title')}</h1>
        <p className="about__subtitle">{t('about.subtitle')}</p>
      </header>
      <section className="about__story">
        {t('about.story').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>
      <VineTimeline />
      <div className="about__ocobo">
        <MoonlitPetals label={t('about.ocoboLabel')} lang={locale} id="about-ocobo" />
      </div>
      <Credentials />
    </>
  )
}
