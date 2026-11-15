import LocaleLink from '../components/LocaleLink.jsx'
import { useLocale } from '../i18n/LocaleProvider.jsx'

/* ACABADO §6 — the mini bio: one paragraph on a slab and a link to the About.
   Nothing else: no character, no pills, no colour bars. */
export default function Bio() {
  const { t } = useLocale()
  return (
    <section className="bio" aria-labelledby="bio-title">
      <div className="bio__slab">
        <h2 id="bio-title" className="sr-only">
          {t('home.bioTitle')}
        </h2>
        <p className="bio__text">{t('home.bioPara1')}</p>
        <LocaleLink to="/about" className="slab bio__link">
          {t('home.bioLink')}
        </LocaleLink>
      </div>
    </section>
  )
}
