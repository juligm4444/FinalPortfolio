import { useLocale } from '../i18n/LocaleProvider.jsx'
import Wall from '../components/wall/Wall.jsx'
import TiltCard, { Layer } from '../components/TiltCard.jsx'
import { MohairButton } from '../components/fur/FurButton.jsx'
import ux from '../assets/badges/ux-fundamentals.webp'
import edt from '../assets/badges/edt-practitioner.webp'
import agile from '../assets/badges/agile-explorer.webp'
import pm from '../assets/badges/pm-fundamentals.webp'
import py1 from '../assets/badges/python-essentials-1.webp'
import py2 from '../assets/badges/python-essentials-2.webp'
import js1 from '../assets/badges/javascript-essentials-1.webp'
import js2 from '../assets/badges/javascript-essentials-2.webp'

/* V3 §F.3 — eight credentials as TiltCards (concrete face): the badge floats in
   front, then the name and the issuer, then a Mohair "Verificar". IBM first. */
const VERIFY = 'https://www.credly.com/users/juligm4'
const BADGES = [ux, edt, agile, pm, py1, py2, js1, js2]

export default function Credentials() {
  const { t, locale } = useLocale()
  const names = t('about.certItems')
  const issuers = t('about.certIssuers')
  return (
    <Wall seed="creds" className="creds" aria-labelledby="creds-title">
      <p className="creds__kicker">{t('about.certKicker')}</p>
      <h2 id="creds-title" className="creds__title">
        {t('about.certLead')}
      </h2>
      <ul className="creds__grid">
        {names.map((name, i) => (
          <li key={name}>
            <TiltCard className="creds__card" max={9}>
              <Layer z={60} className="creds__badge">
                <img src={BADGES[i]} alt="" width="112" height="112" loading="lazy" decoding="async" />
              </Layer>
              <Layer z={36} className="creds__text">
                <span className="creds__name">{name}</span>
                <span className="creds__issuer">{issuers[i < 4 ? 0 : 1]}</span>
              </Layer>
              <Layer z={48} className="creds__action">
                <MohairButton label={t('about.certVerify')} href={VERIFY} height={44} lang={locale} aria-label={`${t('about.certVerify')}: ${name}`} />
              </Layer>
            </TiltCard>
          </li>
        ))}
      </ul>
    </Wall>
  )
}
