import { useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import LocaleLink from '../components/LocaleLink.jsx'
import TumbleDeck from '../components/TumbleDeck.jsx'
import Specimen from '../components/Specimen.jsx'
import DeviceHint from '../components/DeviceHint.jsx'
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

/* Digital and Brand: the same specimen as the Home herbarium (one component), plus the blurb. */
function SlabCard({ work }) {
  const { t } = useLocale()
  return (
    <li>
      <WorkLink work={work} className="work-slab">
        <Specimen work={work}>
          <StatusBadge status={work.status} />
          <span className="work__desc">{t(`works.${work.id}.desc`)}</span>
        </Specimen>
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

/* Object: each piece is a cutout on a concrete slab over the same plinth. The piece itself
   is a button that takes it apart: hover/focus on a pointer, a tap on touch, Enter/Space on a
   keyboard. The case study is the title link. */
function Pedestal({ work }) {
  const { t } = useLocale()
  const [apart, setApart] = useState(false)
  const title = t(`works.${work.id}.title`)
  const { piece, apart: apartSrc } = work.media.pedestal
  return (
    <li className="pedestal" data-apart={apart ? '1' : '0'}>
      <button
        type="button"
        className="pedestal__stage"
        aria-pressed={apart}
        aria-label={`${title}: ${t(apart ? 'projects.explodedHide' : 'projects.explodedShow')}`}
        onClick={() => setApart((a) => !a)}
      >
        <img className="pedestal__piece" src={piece} alt="" loading="lazy" decoding="async" />
        <img className="pedestal__piece pedestal__piece--apart" src={apartSrc} alt="" loading="lazy" decoding="async" />
      </button>
      <span className="pedestal__plinth" aria-hidden="true" />
      <div className="pedestal__label">
        <span className="work__kicker">{t(`works.${work.id}.kicker`)}</span>
        <WorkLink work={work} className="pedestal__title">
          <span className="work__title">{title}</span>
        </WorkLink>
        <span className="work__desc">{t(`works.${work.id}.desc`)}</span>
        <span className="pedestal__hint">
          <DeviceHint pointer={t('projects.explodedHintPointer')} touch={t('projects.explodedHintTouch')} />
        </span>
      </div>
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

/* Tools: one slab per technology (ACABADO §5: the keyscape was retired, the list stays). */
function Tools() {
  const { t } = useLocale()
  const words = t('projects.tools')
  return (
    <section className="proj__group" aria-labelledby="tools-title">
      <p className="proj__kicker">{t('projects.toolsKicker')}</p>
      <h2 id="tools-title" className="proj__group-title">
        {t('projects.toolsTitle')}
      </h2>
      <ul className="tools">
        {words.map((w) => (
          <li key={w} className="tools__slab">
            {w}
          </li>
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
        <h1 className="proj__title">{t('projects.title')}</h1>
        <p className="proj__lead">{t('projects.lead')}</p>
      </header>
      <WebGroup />
      <SlabGroup group="digital" />
      <ObjectGroup />
      <SlabGroup group="marca" />
      <Tools />
    </div>
  )
}
