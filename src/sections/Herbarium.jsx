import Surface from '../components/Surface.jsx'
import { useEffect, useId, useRef } from 'react'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import LocaleLink from '../components/LocaleLink.jsx'
import VelourBolster from '../components/VelourBolster.jsx'
import { usePlush } from '../components/plush/PlushProvider.jsx'
import { homeFeatured } from '../data/projects.js'
import './Herbarium.css'

/* REDESIGN §6 — Herbario. Each featured work is a specimen pressed on a concrete
   slab with a taxonomic label: genus = discipline, species = the work, year and
   role. All visible at once; every slab is a real <a> to its case study. The
   whole thing is HTML/CSS. On hover or keyboard focus the shared Plush canvas
   moves to the slab and grass grows round it (src/components/plush). */
function Slab({ work, index }) {
  const { t } = useLocale()
  const host = usePlush()
  const id = useId()
  const el = useRef(null)
  const slot = useRef(null)
  useEffect(() => host.register(id, { el: el.current, slot: slot.current, mode: 'grass', seed: 20 + index }), [host, id, index])
  const label = t(`herbarium.items.${work.id}`)
  return (
    <li className="herb__cell">
      <LocaleLink
        ref={el}
        to={work.href}
        className="herb__slab"
        onPointerEnter={(e) => e.pointerType !== 'touch' && host.setHover(id)}
        onPointerDown={(e) => e.pointerType === 'touch' && host.setHover(id)}
        onPointerMove={(e) => host.move(id, e.clientX, e.clientY)}
        onPointerLeave={() => host.setHover(null)}
        onPointerUp={(e) => e.pointerType === 'touch' && host.setHover(null)}
        onPointerCancel={() => host.setHover(null)}
        onFocus={(e) => e.currentTarget.matches(':focus-visible') && host.setFocus(id)}
        onBlur={() => host.setFocus(null)}
      >
        <span className="herb__specimen" aria-hidden="true">
          <img src={work.media.specimen} alt="" loading="lazy" decoding="async" />
        </span>
        <span className="herb__label">
          <span className="herb__genus">
            {t('herbarium.gen')} {label.genus}
          </span>
          <span className="herb__species">{t(`works.${work.id}.title`)}</span>
          <span className="herb__meta">
            <span>{label.year}</span>
            <span>{label.role}</span>
          </span>
        </span>
        <span ref={slot} className="herb__slot" aria-hidden="true" />
      </LocaleLink>
    </li>
  )
}

export default function Herbarium() {
  const { t } = useLocale()
  return (
    <Surface as="section" className="herb" aria-labelledby="herb-title">
      <header className="herb__head">
        <p className="herb__kicker">{t('home.herbKicker')}</p>
        <h2 id="herb-title" className="herb__title">
          {t('home.herbTitle')}
        </h2>
      </header>
      <ul className="herb__grid">
        {homeFeatured.map((w, i) => (
          <Slab key={w.id} work={w} index={i} />
        ))}
      </ul>
      <div className="herb__cta">
        <VelourBolster label={t('home.herbCta')} to="/projects" id="herb-cta" />
      </div>
    </Surface>
  )
}
