import Wall from '../components/wall/Wall.jsx'
import { MohairButton } from '../components/fur/FurButton.jsx'
import { useLocale } from '../i18n/LocaleProvider.jsx'

/* V4 §G.3 — the statement after the hero: on a concrete wall, centred, filling
   the section. Display line, body line, secondary line, a centred Mohair button. */
export default function Bio() {
  const { t, locale } = useLocale()
  return (
    <Wall seed="home-statement" className="statement" aria-labelledby="statement-title">
      <h2 id="statement-title" className="statement__lead">
        {t('home.statement1')}
      </h2>
      <p className="statement__body">{t('home.statement2')}</p>
      <p className="statement__note">{t('home.statement3')}</p>
      <div className="statement__cta">
        <MohairButton label={t('home.bioLink')} to="/about" lang={locale} />
      </div>
    </Wall>
  )
}
