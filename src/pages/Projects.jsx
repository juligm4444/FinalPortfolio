import { useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import LocaleLink from '../components/LocaleLink.jsx'
import BotanicalText from '../components/BotanicalText.jsx'
import TumbleDeck from '../components/TumbleDeck.jsx'
import CitronKeyscape from '../components/CitronKeyscape.jsx'
import { worksByGroup } from '../data/projects.js'
import './Projects.css'

/* REDESIGN §5 Projects: four groups (Web, Digital, Object, Brand), then the
   Tools block. Everything is real HTML; the deck and the pedestals only add
   motion on top of content that is already in the DOM. */

function StatusBadge({ status }) {
  const { t } = useLocale()
  if (status !== 'in-progress' && status !== 'soon') return null
  return <span className="work__status">{t(`projects.status.${status}`)}</span>
}

/** The link a work offers: its case study, else its site, else nothing. */
function WorkLink({ work, children, className = '' }) {
  const { t } = useLocale()
  const title = t(`works.${work.id}.title`)
  if (work.href)
    return (
      <LocaleLink to={work.href} className={className} aria-label={`${t('projects.openCase')}: ${title}`}>
        {children}
      </LocaleLink>
    )
  if (work.site)
    return (
      <a href={work.site} target="_blank" rel="noopener noreferrer" className={className} aria-label={`${t('projects.visitSite')}: ${title}`}>
        {children}
      </a>
    )
  return <div className={className}>{children}</div>
}

function GroupHead({ group }) {
  const { t } = useLocale()
  return (
    <h2 id={`group-${group}`} className="proj__group-title">
      {t(`projects.groups.${group}`)}
    </h2>
  )
}

function WebGroup() {
  const { t } = useLocale()
  const items = worksByGroup('web')
  const [front, setFront] = useState(0)
  const badge = (w) => (w.status === 'in-progress' || w.status === 'soon' ? t(`projects.status.${w.status}`) : '')
  const cards = items.map((w) => ({
    src: w.media.screenshot,
    slab: { title: t(`works.${w.id}.title`), status: badge(w) },
    label: [t(`works.${w.id}.title`), badge(w)].filter(Boolean).join(' · '),
  }))
  const current = items[front] ?? items[0]
  return (
    <section className="proj__group" aria-labelledby="group-web">
      <GroupHead group="web" />
      <TumbleDeck cards={cards} label={t('projects.deckLabel')} hint={t('projects.deckHint')} onFront={setFront} />
      {current && (
        <div className="proj__deck-caption" aria-hidden="true">
          <p className="work__kicker">{t(`works.${current.id}.kicker`)}</p>
          <p className="work__title">
            {t(`works.${current.id}.title`)} <StatusBadge status={current.status} />
          </p>
        </div>
      )}
      <h3 className="proj__list-title">{t('projects.deckListTitle')}</h3>
      <ul className="proj__list">
        {items.map((w) => (
          <li key={w.id}>
            <WorkLink work={w} className="proj__list-link">
              <span className="work__title">{t(`works.${w.id}.title`)}</span>
              <span className="work__kicker">{t(`works.${w.id}.kicker`)}</span>
              <StatusBadge status={w.status} />
            </WorkLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SlabCard({ work }) {
  const { t } = useLocale()
  return (
    <li>
      <WorkLink work={work} className="work-slab">
        <span className="work-slab__media" aria-hidden="true">
          <img src={work.media.logo} alt="" loading="lazy" decoding="async" />
        </span>
        <span className="work-slab__body">
          <span className="work__kicker">{t(`works.${work.id}.kicker`)}</span>
          <span className="work__title">
            {t(`works.${work.id}.title`)} <StatusBadge status={work.status} />
          </span>
          <span className="work__desc">{t(`works.${work.id}.desc`)}</span>
        </span>
      </WorkLink>
    </li>
  )
}

function SlabGroup({ group }) {
  return (
    <section className="proj__group" aria-labelledby={`group-${group}`}>
      <GroupHead group={group} />
      <ul className="proj__slabs">
        {worksByGroup(group).map((w) => (
          <SlabCard key={w.id} work={w} />
        ))}
      </ul>
    </section>
  )
}

/* Object: each piece on a concrete pedestal; hover or focus takes it apart
   (the exploded render cross-fades in). No GLB exists for these pieces. */
function Pedestal({ work }) {
  const { t } = useLocale()
  const title = t(`works.${work.id}.title`)
  return (
    <li className="pedestal">
      <WorkLink work={work} className="pedestal__link">
        <span className="pedestal__stage" aria-hidden="true">
          <img className="pedestal__piece" src={work.media.render} alt="" loading="lazy" decoding="async" />
          <img className="pedestal__piece pedestal__piece--exploded" src={work.media.exploded} alt="" loading="lazy" decoding="async" />
        </span>
        <span className="pedestal__plinth" aria-hidden="true" />
        <span className="pedestal__label">
          <span className="work__kicker">{t(`works.${work.id}.kicker`)}</span>
          <span className="work__title">{title}</span>
          <span className="work__desc">{t(`works.${work.id}.desc`)}</span>
          <span className="pedestal__hint">{t('projects.explodedHint')}</span>
        </span>
      </WorkLink>
      {work.media.views && (
        <ul className="pedestal__views" aria-hidden="true">
          {work.media.views.map((v, i) => (
            <li key={i}>
              <img src={v} alt="" loading="lazy" decoding="async" />
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function ObjectGroup() {
  return (
    <section className="proj__group" aria-labelledby="group-objeto">
      <GroupHead group="objeto" />
      <ul className="proj__pedestals">
        {worksByGroup('objeto').map((w) => (
          <Pedestal key={w.id} work={w} />
        ))}
      </ul>
    </section>
  )
}

export default function Projects() {
  const { t } = useLocale()
  return (
    <div className="proj">
      <header className="proj__header">
        <p className="proj__kicker">{t('projects.label')}</p>
        <BotanicalText text={t('projects.title')} size={120} id="projects-h1" />
        <p className="proj__lead">{t('projects.lead')}</p>
      </header>
      <WebGroup />
      <SlabGroup group="digital" />
      <ObjectGroup />
      <SlabGroup group="marca" />
      <section className="proj__group" aria-labelledby="tools-title">
        <p className="proj__kicker">{t('projects.toolsKicker')}</p>
        <h2 id="tools-title" className="proj__group-title">
          {t('projects.toolsTitle')}
        </h2>
        <CitronKeyscape id="tools-keyscape" />
      </section>
    </div>
  )
}
