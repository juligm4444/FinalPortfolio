import { useLocale } from '../i18n/LocaleProvider.jsx'
import './Specimen.css'

/* ACABADO §5 — the one specimen treatment: the project's image pressed in a 4:3
   concrete window (same margin, same framing, contained), and under it the
   taxonomic label: `Gen.` discipline, species = project, year and role.
   Used by the Home herbarium and by the Digital and Brand groups of /projects.
   Reads `work.media.specimen` and `herbarium.items.<id>` (translations). */
export default function Specimen({ work, children }) {
  const { t } = useLocale()
  const label = t(`herbarium.items.${work.id}`)
  return (
    <>
      <span className="spec__window" aria-hidden="true">
        <img src={work.media.specimen} alt="" loading="lazy" decoding="async" />
      </span>
      <span className="spec__label">
        <span className="spec__genus">
          {t('herbarium.gen')} {label.genus}
        </span>
        <span className="spec__species">{t(`works.${work.id}.title`)}</span>
        <span className="spec__meta">
          <span>{label.year}</span>
          <span>{label.role}</span>
        </span>
        {children}
      </span>
    </>
  )
}
