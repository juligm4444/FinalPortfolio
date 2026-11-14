import Specimen from '../components/Specimen.jsx'
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
   whole thing is HTML/CSS. On hover (mouse) or keyboard focus the shared Plush
   canvas moves to the slab and grass grows round it, outside the slab. On touch
   there is no grass: a tap navigates straight away. */
function Slab({ work, index }) {
  const host = usePlush()
  const id = useId()
  const el = useRef(null)
  const slot = useRef(null)
  useEffect(() => host.register(id, { el: el.current, slot: slot.current, mode: 'grass', seed: 20 + index }), [host, id, index])
  return (
    <li className="herb__cell">
      <LocaleLink
        ref={el}
        to={work.href}
        className="herb__slab"
        onPointerEnter={(e) => e.pointerType !== 'touch' && host.setHover(id)}
        onPointerMove={(e) => host.move(id, e.clientX, e.clientY)}
        onPointerLeave={() => host.setHover(null)}
        onPointerCancel={() => host.setHover(null)}
        onFocus={(e) => e.currentTarget.matches(':focus-visible') && host.setFocus(id)}
        onBlur={() => host.setFocus(null)}
      >
        <Specimen work={work} />
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
