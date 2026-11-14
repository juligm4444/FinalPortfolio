import { useLocale } from '../i18n/LocaleProvider.jsx'
import Surface from '../components/Surface.jsx'
import BotanicalText from '../components/BotanicalText.jsx'
import MoonlitPetals from '../components/MoonlitPetals.jsx'
import VineTimeline from '../sections/VineTimeline.jsx'
import Credentials from '../sections/Credentials.jsx'

/* REDESIGN §5 About: story, vine timeline, the ocobo as the close, credentials. */
export default function About() {
  const { t, locale } = useLocale()
  return (
    <>
      <Surface as="header" className="about__header">
        <p className="about__kicker">{t('about.label')}</p>
        <BotanicalText text={t('about.title')} size={120} id="about-h1" />
        <p className="about__subtitle">{t('about.subtitle')}</p>
      </Surface>
      <Surface as="section" className="about__story">
        {t('about.story').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </Surface>
      <VineTimeline />
      <Surface className="about__ocobo">
        <MoonlitPetals label={t('about.ocoboLabel')} lang={locale} id="about-ocobo" />
      </Surface>
      <Credentials />
    </>
  )
}
