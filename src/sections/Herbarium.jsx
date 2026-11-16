import { useLocale } from '../i18n/LocaleProvider.jsx'
import Wall from '../components/wall/Wall.jsx'
import VelourBolster from '../components/VelourBolster.jsx'
import FeaturedCard from './FeaturedCard.jsx'
import { homeFeatured } from '../data/projects.js'
import './Herbarium.css'

/* V4 §G.4 — Featured Projects: Bloom, Licorímetro, Candelaria (the brand case),
   filling the section's width. */
export default function Herbarium() {
  const { t, locale } = useLocale()
  return (
    <Wall seed="home-featured" className="featured" aria-labelledby="featured-title">
      <h2 id="featured-title" className="featured__title">
        {t('home.featuredTitle')}
      </h2>
      <ul className="featured__grid">
        {homeFeatured.map((w, i) => (
          <li key={w.id}>
            <FeaturedCard work={w} seed={i * 5} />
          </li>
        ))}
      </ul>
      <div className="featured__cta">
        <VelourBolster label={t('home.herbCta')} to="/projects" lang={locale} height={56} />
      </div>
    </Wall>
  )
}
