import LocaleLink from '../components/LocaleLink.jsx'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import { usePlushHover } from '../components/fur/plushHover.js'

/* V4 §G.4 — a featured project. At rest: a concrete slab with the project image
   in full colour and its label printed on the concrete. On hover (or keyboard
   focus) the whole card turns plush (usePlushHover): fur over the entire card,
   image and name as its artwork, parting under the pointer. Touch: the static
   card; one tap opens the case. */
export default function FeaturedCard({ work, seed = 0 }) {
  const { t } = useLocale()
  const label = t(`herbarium.items.${work.id}`)
  const title = t(`works.${work.id}.title`)
  const { hit, live, leaving, handlers, onFrame } = usePlushHover({ src: work.media.specimen, name: title, seed })
  return (
    <LocaleLink
      ref={hit}
      to={work.href}
      className="feat"
      data-project-card=""
      data-card-link=""
      aria-label={`${t('projects.openCase')}: ${title}`}
      {...handlers}
    >
      <span className="feat__slab concrete">
        <span className="feat__img">
          <img src={work.media.specimen} alt="" loading="lazy" decoding="async" />
        </span>
        <span className="feat__label">
          <span className="feat__name">{title}</span>
          <span className="feat__meta">
            {label.year} · {label.role}
          </span>
        </span>
      </span>
      {live && (
        <span className={`feat__fur ${leaving ? 'feat__fur--leaving' : ''}`} aria-hidden="true">
          <live.Canvas {...live.props} hitRef={hit} onFrame={onFrame} />
        </span>
      )}
    </LocaleLink>
  )
}
