import { useLocale } from '../i18n/LocaleProvider.jsx'
import MoonlitPetals from '../components/MoonlitPetals.jsx'
import VineTimeline from '../sections/VineTimeline.jsx'
import Credentials from '../sections/Credentials.jsx'

/* V3 §F About: the story with the ocobo beside it (sticky while reading, fading
   into the mist, no frame), the vine timeline, the credentials as 3D cards. */
export default function About() {
  const { t, locale } = useLocale()
  return (
    <>
      <header className="about__header">
        <p className="about__kicker">{t('about.label')}</p>
        <h1 className="about__title">{t('about.title')}</h1>
        <p className="about__subtitle">{t('about.subtitle')}</p>
      </header>
      <div className="about__intro">
        <div className="about__ocobo">
          <div className="about__ocobo-hold">
            <MoonlitPetals label={t('about.ocoboLabel')} lang={locale} id="about-ocobo" />
          </div>
        </div>
        <section className="about__story">
          {t('about.story').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      </div>
      <VineTimeline />
      <Credentials />
    </>
  )
}
