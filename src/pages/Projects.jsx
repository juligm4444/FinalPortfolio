import { useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import Wall from '../components/wall/Wall.jsx'
import { MohairButton } from '../components/fur/FurButton.jsx'
import Lattice from '../sections/Lattice.jsx'
import { GROUPS } from '../data/projects.js'
import './Projects.css'

/* V4 §I — Projects: the heading and the filters on a wall, then the lattice
   hillside where every project is a plot. */
export default function Projects() {
  const { t, locale } = useLocale()
  const [filter, setFilter] = useState('all')
  return (
    <div className="proj">
      <Wall as="header" seed="projects-head" className="proj__header">
        <h1 className="proj__title">{t('projects.title')}</h1>
        <p className="proj__lead">{t('projects.lead')}</p>
        <div className="proj__filters" role="group" aria-label={t('projects.filterLabel')}>
          {['all', ...GROUPS].map((g) => (
            <MohairButton
              key={g}
              label={g === 'all' ? t('projects.filterAll') : t(`projects.groups.${g}`)}
              onClick={() => setFilter(g)}
              aria-pressed={filter === g}
              pressed={filter === g}
              height={44}
              lang={locale}
            />
          ))}
        </div>
      </Wall>
      <section className="proj__hill" aria-label={t('projects.title')}>
        <Lattice filter={filter} />
      </section>
    </div>
  )
}
