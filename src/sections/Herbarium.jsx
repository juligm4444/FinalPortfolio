import { useLocale } from '../i18n/LocaleProvider.jsx'
import Wall from '../components/wall/Wall.jsx'
import VelourBolster from '../components/VelourBolster.jsx'
import SpecimenSlab from '../components/SpecimenSlab.jsx'
import { homeFeatured } from '../data/projects.js'
import './Herbarium.css'

/* V3 §E.3 — Herbario: six specimens as concrete slabs, 3 × 2 on desktop, 2 × 3 on phones. */
export default function Herbarium() {
  const { t, locale } = useLocale()
  return (
    <Wall seed="home-featured" className="herb" aria-labelledby="herb-title">
      <header className="herb__head">
        <p className="herb__kicker">{t('home.herbKicker')}</p>
        <h2 id="herb-title" className="herb__title">
          {t('home.herbTitle')}
        </h2>
      </header>
      <ul className="herb__grid">
        {homeFeatured.map((w, i) => (
          <li key={w.id}>
            <SpecimenSlab work={w} seed={i * 5} />
          </li>
        ))}
      </ul>
      <div className="herb__cta">
        <VelourBolster label={t('home.herbCta')} to="/projects" lang={locale} height={52} />
      </div>
    </Wall>
  )
}
