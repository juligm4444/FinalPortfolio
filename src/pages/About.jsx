import { useLocale } from '../i18n/LocaleProvider.jsx'
import MoonlitPetals from '../components/MoonlitPetals.jsx'
import VineTimeline from '../sections/VineTimeline.jsx'
import Wall from '../components/wall/Wall.jsx'
import Rich from '../components/Rich.jsx'

/* V4 §H About: the story on a concrete wall on the left, its key phrases in bold
   bloom-ink; the ocobo on the right, full viewport height, branches reaching
   left, drawn straight onto the scene and sticky while the story scrolls; then
   the organic timeline. Credentials moved to Toolkit. */
export default function About() {
  const { t, locale } = useLocale()
  return (
    <>
      <div className="about__intro">
        <Wall seed="about-story" className="about__story">
          <header className="about__header">
            <h1 className="about__title">{t('about.title')}</h1>
            <p className="about__subtitle">{t('about.subtitle')}</p>
          </header>
          {t('about.story').map((p, i) => (
            <p key={i}>
              <Rich text={p} />
            </p>
          ))}
        </Wall>
        <div className="about__ocobo">
          <div className="about__ocobo-hold">
            <MoonlitPetals label={t('about.ocoboLabel')} lang={locale} id="about-ocobo" transparent />
          </div>
        </div>
      </div>
      <VineTimeline />
    </>
  )
}
