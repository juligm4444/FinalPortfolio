import { useLocale } from '../../i18n/LocaleProvider.jsx'
import './DonorFlow.css'

/* SenseWave: the experience moving from donor to recipient. Two circles and a line on site tokens;
   the pulse is CSS and stops with reduced motion. */
export default function DonorFlow() {
  const { t } = useLocale()
  return (
    <div className="donor" role="img" aria-label={`${t('sensewave.donorLabel')} → ${t('sensewave.recipientLabel')}`}>
      <span className="donor__node donor__node--a">{t('sensewave.donorLabel')}</span>
      <span className="donor__link">
        <span className="donor__label">{t('sensewave.donorTransfer')}</span>
      </span>
      <span className="donor__node donor__node--b">{t('sensewave.recipientLabel')}</span>
    </div>
  )
}
