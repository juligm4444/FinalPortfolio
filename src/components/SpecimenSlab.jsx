import { useEffect, useRef } from 'react'
import TiltCard, { Layer } from './TiltCard.jsx'
import LocaleLink from './LocaleLink.jsx'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import './SpecimenSlab.css'

/* V3 §E.3 — a specimen is a concrete slab (material A), 3:4, that tilts toward the
   pointer (TiltCard). No boxes inside: the image floats in front of the slab over
   its top two thirds; the label is printed straight on the concrete — `Gen.` in
   small caps, the species in Baskerville italic, year and role under it.
   One image treatment for every project: at rest a duotone, concrete-900 into
   concrete-100, like an engraving in stone; on hover or focus the colour comes
   back and grass grows at the foot of the slab. On touch the colour comes back
   while the slab is centred on screen, and a tap navigates.
   Used by the Home herbarium and the Projects wall (`size` changes the format). */

function Grass({ seed = 1 }) {
  // Deterministic blades: the same tuft every render, server and client.
  let s = seed * 9301 + 49297
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const blades = Array.from({ length: 34 }, (_, i) => {
    const x = (i + r() * 0.8) * (100 / 34)
    const h = 34 + r() * 66
    const lean = (r() - 0.5) * 14
    const w = 1.6 + r() * 1.6
    return { d: `M${(x - w).toFixed(1)} 100 Q${(x + lean * 0.4).toFixed(1)} ${(100 - h * 0.6).toFixed(1)} ${(x + lean).toFixed(1)} ${(100 - h).toFixed(1)} Q${(x + lean * 0.3 + w * 0.4).toFixed(1)} ${(100 - h * 0.5).toFixed(1)} ${(x + w).toFixed(1)} 100Z`, tone: i % 3 === 0 ? 'b' : 'a', delay: Math.round(r() * 160) }
  })
  return (
    <svg className="spec-slab__grass" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {blades.map((b, i) => (
        <path key={i} d={b.d} className={`grass grass--${b.tone}`} style={{ transitionDelay: `${b.delay}ms` }} />
      ))}
    </svg>
  )
}

export default function SpecimenSlab({ work, size = 'm', seed = 0, extra = null }) {
  const { t } = useLocale()
  const el = useRef(null)
  const label = t(`herbarium.items.${work.id}`)
  const title = t(`works.${work.id}.title`)

  // Touch: colour while the slab is centred on screen.
  useEffect(() => {
    const node = el.current
    if (!node || window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const io = new IntersectionObserver(([e]) => node.toggleAttribute('data-centred', e.isIntersecting), { rootMargin: '-38% 0px -38% 0px' })
    io.observe(node)
    return () => io.disconnect()
  }, [])

  const target = work.href
    ? { as: LocaleLink, outer: { to: work.href, 'aria-label': `${t('projects.openCase')}: ${title}` } }
    : work.site
      ? { as: 'a', outer: { href: work.site, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${t('projects.visitSite')}: ${title}` } }
      : { as: 'div', outer: {} }

  return (
    <div ref={el} className={`spec-slab spec-slab--${size}`}>
      <TiltCard as={target.as} outer={{ ...target.outer, className: 'spec-slab__link' }} className="spec-slab__card">
        <Layer z={44} className="spec-slab__img">
          <img src={work.media.specimen} alt="" loading="lazy" decoding="async" />
        </Layer>
        <Layer z={16} className="spec-slab__label">
          <span className="spec-slab__genus">
            {t('herbarium.gen')} {label.genus}
          </span>
          <span className="spec-slab__species">{title}</span>
          <span className="spec-slab__meta">
            {label.year} · {label.role}
          </span>
          {extra}
        </Layer>
        <Grass seed={seed + 3} />
      </TiltCard>
    </div>
  )
}
