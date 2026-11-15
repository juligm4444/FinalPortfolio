import { useEffect, useMemo, useState } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import LocaleLink from '../components/LocaleLink.jsx'
import TumbleDeck from '../components/TumbleDeck.jsx'
import TiltCard, { Layer } from '../components/TiltCard.jsx'
import { MohairButton } from '../components/fur/FurButton.jsx'
import PlushTile from '../components/fur/PlushTile.jsx'
import { snapshotOnce } from '../components/fur/snapshots.js'
import { plushJob } from '../components/fur/PlushTile.jsx'
import { TOOL_GLYPHS, toolSlug } from '../data/tools.js'
import works, { GROUPS, worksByGroup } from '../data/projects.js'
import concreteTexture from '../assets/textures/concrete.webp'
import '../components/SpecimenSlab.css'
import Wall from '../components/wall/Wall.jsx'
import './Projects.css'

/* V3 §G Projects: the sites deck, the wall of slabs with filters, the tools. */

const statusLabel = (t, w) => (w.status === 'in-progress' || w.status === 'soon' ? t(`projects.status.${w.status}`) : '')

/* A site with no capture yet: a concrete sheet with its name and "en curso",
   drawn once to an image so the original deck can show it like any capture. */
function useSlabImages(items, t) {
  const [map, setMap] = useState({})
  useEffect(() => {
    let cancelled = false
    const css = getComputedStyle(document.documentElement)
    const v = (n) => css.getPropertyValue(n).trim()
    const tex = new Image()
    tex.src = concreteTexture
    Promise.all([document.fonts.ready, tex.decode().catch(() => null)]).then(() => {
      if (cancelled) return
      const out = {}
      items
        .filter((w) => !w.media.screenshot)
        .forEach((w) => {
          const c = document.createElement('canvas')
          c.width = 1440
          c.height = Math.round(1440 / 2.06)
          const g = c.getContext('2d')
          g.fillStyle = v('--concrete-100')
          g.fillRect(0, 0, c.width, c.height)
          if (tex.naturalWidth) {
            g.globalCompositeOperation = 'multiply'
            g.fillStyle = g.createPattern(tex, 'repeat')
            g.fillRect(0, 0, c.width, c.height)
            g.globalCompositeOperation = 'source-over'
          }
          g.fillStyle = v('--concrete-900')
          g.font = `700 96px ${v('--font-display')}`
          g.fillText(t(`works.${w.id}.title`), 96, c.height - 170)
          g.fillStyle = v('--concrete-500')
          g.font = `500 40px ${v('--font-label')}`
          if ('letterSpacing' in g) g.letterSpacing = '4px'
          g.fillText(statusLabel(t, w).toUpperCase(), 100, c.height - 96)
          out[w.id] = c.toDataURL('image/webp', 0.85)
        })
      setMap(out)
    })
    return () => {
      cancelled = true
    }
  }, [items, t])
  return map
}

function WorkTarget({ work, className, children }) {
  const { t } = useLocale()
  const title = t(`works.${work.id}.title`)
  if (work.href)
    return (
      <LocaleLink to={work.href} className={className}>
        {children}
      </LocaleLink>
    )
  if (work.site)
    return (
      <a href={work.site} target="_blank" rel="noopener noreferrer" className={className} aria-label={`${t('projects.visitSite')}: ${title}`}>
        {children}
      </a>
    )
  return <span className={className}>{children}</span>
}

function Deck() {
  const { t } = useLocale()
  const items = useMemo(() => worksByGroup('web'), [])
  const slabs = useSlabImages(items, t)
  const [front, setFront] = useState(0)
  const cards = useMemo(
    () => items.map((w) => ({ src: w.media.screenshot ?? slabs[w.id] ?? concreteTexture, alt: '' })),
    [items, slabs]
  )
  const current = items[front] ?? items[0]
  return (
    <Wall seed="projects-deck" className="proj__deck" aria-labelledby="deck-title">
      <h2 id="deck-title" className="proj__group-title">
        {t('projects.groups.web')}
      </h2>
      <TumbleDeck cards={cards} height="clamp(300px, 46vw, 600px)" ariaLabel={t('projects.deckLabel')} hint={t('projects.deckHint')} onFront={setFront} />
      {/* Under the deck: only the front sheet's name, with its link. */}
      <p className="proj__deck-front" aria-live="polite">
        <WorkTarget work={current} className="proj__deck-link">
          {t(`works.${current.id}.title`)}
          {statusLabel(t, current) ? <span className="proj__deck-status"> · {statusLabel(t, current)}</span> : null}
        </WorkTarget>
      </p>
      {/* The full list stays for screen readers. */}
      <div className="sr-only">
        <h3>{t('projects.deckListTitle')}</h3>
        <ul>
          {items.map((w) => (
            <li key={w.id}>
              <WorkTarget work={w}>{[t(`works.${w.id}.title`), statusLabel(t, w)].filter(Boolean).join(' · ')}</WorkTarget>
            </li>
          ))}
        </ul>
      </div>
    </Wall>
  )
}

/* One slab of the wall: the Herbarium treatment (duotone at rest, colour on
   hover), concrete TiltCard. Objects keep their exploded view on press. */
function WallSlab({ work, big }) {
  const { t } = useLocale()
  const [apart, setApart] = useState(false)
  const title = t(`works.${work.id}.title`)
  const img = work.media.specimen ?? work.media.screenshot ?? work.media.logo ?? null
  const pedestal = work.media.pedestal
  const meta = [t(`works.${work.id}.kicker`), statusLabel(t, work)].filter(Boolean).join(' · ')
  const label = (
    <Layer z={18} className="spec-slab__label">
      <span className="spec-slab__genus">
        {t('herbarium.gen')} {t(`projects.groups.${work.group}`)}
      </span>
      {pedestal ? (
        <WorkTarget work={work} className="slabwall__title-link" data-card-link="">
          <span className="spec-slab__species">{title}</span>
        </WorkTarget>
      ) : (
        <span className="spec-slab__species">{title}</span>
      )}
      <span className="spec-slab__meta">{meta}</span>
    </Layer>
  )
  const picture = pedestal ? (
    <Layer z={44} className="spec-slab__img">
      <button
        type="button"
        className="slabwall__piece"
        aria-pressed={apart}
        aria-label={`${title}: ${t(apart ? 'projects.explodedHide' : 'projects.explodedShow')}`}
        onClick={() => setApart((a) => !a)}
      >
        <img src={apart ? pedestal.apart : pedestal.piece} alt="" loading="lazy" decoding="async" />
      </button>
    </Layer>
  ) : (
    <Layer z={44} className="spec-slab__img">
      {img ? <img src={img} alt="" loading="lazy" decoding="async" /> : null}
    </Layer>
  )
  // V4 §A.2: only a work with a case study is a link. Without one the card is static:
  // no tilt, no pointer, no hover change, and its status ("in progress"/"coming soon") is printed.
  if (!work.href)
    return (
      <div className={`spec-slab spec-slab--static ${big ? 'spec-slab--l' : ''} ${img ? '' : 'spec-slab--bare'}`.trim()} data-project-card="">
        <div className="tilt">
          <div className="tilt__card concrete spec-slab__card">
            <div className="spec-slab__img">{img ? <img src={img} alt="" loading="lazy" decoding="async" /> : null}</div>
            <div className="spec-slab__label">
              <span className="spec-slab__genus">
                {t('herbarium.gen')} {t(`projects.groups.${work.group}`)}
              </span>
              <span className="spec-slab__species">{title}</span>
              <span className="spec-slab__meta">{meta}</span>
            </div>
          </div>
        </div>
      </div>
    )
  const outer = pedestal
    ? { as: 'div', outer: { className: 'spec-slab__link' } }
    : { as: LocaleLink, outer: { to: work.href, className: 'spec-slab__link', 'data-card-link': '', 'aria-label': `${t('projects.openCase')}: ${title}` } }
  return (
    <div className={`spec-slab ${big ? 'spec-slab--l' : ''} ${img || pedestal ? '' : 'spec-slab--bare'}`.trim()} data-project-card="">
      <TiltCard as={outer.as} outer={outer.outer} className="spec-slab__card" max={big ? 6 : 9}>
        {picture}
        {label}
      </TiltCard>
    </div>
  )
}

function SlabWall() {
  const { t, locale } = useLocale()
  const reduce = useReducedMotion()
  const [filter, setFilter] = useState('all')
  const list = filter === 'all' ? works : works.filter((w) => w.group === filter)
  // One big slab per category: the first work of each group.
  const bigIds = new Set(GROUPS.map((g) => works.find((w) => w.group === g)?.id))
  return (
    <Wall seed="projects-slabwall" className="slabwall" aria-labelledby="wall-title">
      <h2 id="wall-title" className="proj__group-title">
        {t('projects.wallTitle')}
      </h2>
      <div className="slabwall__filters" role="group" aria-label={t('projects.filterLabel')}>
        {['all', ...GROUPS].map((g) => (
          <MohairButton
            key={g}
            label={g === 'all' ? t('projects.filterAll') : t(`projects.groups.${g}`)}
            onClick={() => setFilter(g)}
            aria-pressed={filter === g}
            className={filter === g ? 'slabwall__filter--on' : ''}
            height={44}
            lang={locale}
          />
        ))}
      </div>
      <LayoutGroup>
        <motion.ul className="slabwall__grid" layout={!reduce}>
          {list.map((w) => (
            <motion.li
              key={w.id}
              layout={!reduce}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className={bigIds.has(w.id) ? 'slabwall__cell slabwall__cell--l' : 'slabwall__cell'}
            >
              <WallSlab work={w} big={bigIds.has(w.id)} />
            </motion.li>
          ))}
        </motion.ul>
      </LayoutGroup>
    </Wall>
  )
}

function Tools() {
  const { t } = useLocale()
  const words = t('projects.tools')
  // scripts/bake-fur.mjs renders the 88 px tool tiles through this hook.
  useEffect(() => {
    window.__furBake = { ...(window.__furBake ?? {}), tool: (name, px) => snapshotOnce(plushJob(toolSlug(name), TOOL_GLYPHS[name], px)) }
  }, [])
  return (
    <Wall seed="projects-tools" className="tools-sec" aria-labelledby="tools-title">
      <p className="proj__kicker">{t('projects.toolsKicker')}</p>
      <h2 id="tools-title" className="proj__group-title">
        {t('projects.toolsTitle')}
      </h2>
      <ul className="tools">
        {words.map((w, i) => (
          <li key={w} className="tools__item">
            <PlushTile name={toolSlug(w)} glyph={TOOL_GLYPHS[w]} label={w} size={88} seed={i * 3} />
            <span className="tools__name">{w}</span>
          </li>
        ))}
      </ul>
    </Wall>
  )
}

export default function Projects() {
  const { t } = useLocale()
  return (
    <div className="proj">
      <Wall as="header" seed="projects-head" className="proj__header">
        <p className="proj__kicker">{t('projects.label')}</p>
        <h1 className="proj__title">{t('projects.title')}</h1>
        <p className="proj__lead">{t('projects.lead')}</p>
      </Wall>
      <Deck />
      <SlabWall />
      <Tools />
    </div>
  )
}
