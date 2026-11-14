import Surface from '../components/Surface.jsx'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import ux from '../assets/badges/ux-fundamentals.webp'
import edt from '../assets/badges/edt-practitioner.webp'
import agile from '../assets/badges/agile-explorer.webp'
import pm from '../assets/badges/pm-fundamentals.webp'
import py1 from '../assets/badges/python-essentials-1.webp'
import py2 from '../assets/badges/python-essentials-2.webp'
import js1 from '../assets/badges/javascript-essentials-1.webp'
import js2 from '../assets/badges/javascript-essentials-2.webp'

/* REDESIGN §5 About — a discreet row of eight badges, each with its verification link. */
const VERIFY = 'https://www.credly.com/users/juligm4'
const BADGES = [ux, edt, agile, pm, py1, py2, js1, js2]

export default function Credentials() {
  const { t } = useLocale()
  const names = t('about.certItems')
  return (
    <Surface as="section" className="creds" aria-labelledby="creds-title">
      <h2 id="creds-title" className="creds__kicker">
        {t('about.certKicker')}
      </h2>
      <p className="creds__lead">{t('about.certLead')}</p>
      {/* IBM first (the four SkillsBuild badges), then Cisco (the four NetAcad badges). */}
      {[names.slice(0, 4), names.slice(4)].map((group, g) => (
        <ul key={g} className="creds__list">
          {group.map((name, j) => {
            const i = g * 4 + j
            return (
              <li key={name} className="creds__item">
                <img src={BADGES[i]} alt="" width="96" height="96" loading="lazy" decoding="async" />
                <span className="creds__name">{name}</span>
                <a className="creds__verify" href={VERIFY} target="_blank" rel="noopener noreferrer" aria-label={`${t('about.certVerify')}: ${name}`}>
                  {t('about.certVerify')}
                </a>
              </li>
            )
          })}
        </ul>
      ))}
    </Surface>
  )
}
