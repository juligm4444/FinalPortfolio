import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../../i18n/LocaleProvider.jsx'
import cvEn from '../../assets/files/CV-English.pdf'
import cvEs from '../../assets/files/CV-Español.pdf'
import {
  InstagramIcon,
  LinkedInIcon,
  GitHubIcon,
  BehanceIcon,
  MailIcon,
  CvIcon,
  CheckIcon,
} from './icons.jsx'

export const EMAIL = 'julian_gm4@hotmail.com'

const LINKS = [
  { key: 'instagram', href: 'https://www.instagram.com/juligm4/', Icon: InstagramIcon },
  { key: 'linkedin', href: 'https://www.linkedin.com/in/juligm4', Icon: LinkedInIcon },
  { key: 'cv', Icon: CvIcon },
  { key: 'github', href: 'https://github.com/juligm4444', Icon: GitHubIcon },
  { key: 'behance', href: 'https://www.behance.net/juligm4', Icon: BehanceIcon },
  { key: 'email', Icon: MailIcon },
]

/* REDESIGN §5 — bottom dock. Stone tiles with the glyph engraved; the moss
   on hover is CSS for now and becomes PlushTile in Fase 3. The mail tile
   copies the address instead of opening a client. */
export default function Dock() {
  const { t, locale } = useLocale()
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copyEmail = async () => {
    let ok = false
    try {
      await navigator.clipboard.writeText(EMAIL)
      ok = true
    } catch {
      // Clipboard API refused (insecure context, permissions). Fall back to
      // a selectable node so the person can copy by hand.
      const span = document.createElement('span')
      span.textContent = EMAIL
      document.body.appendChild(span)
      const range = document.createRange()
      range.selectNodeContents(span)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      try {
        ok = document.execCommand('copy')
      } catch {
        ok = false
      }
      sel.removeAllRanges()
      span.remove()
    }
    setCopied(ok)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2200)
  }

  const cvHref = locale === 'es' ? cvEs : cvEn
  const cvFile = locale === 'es' ? 'Julian-Galindo-CV-Espanol.pdf' : 'Julian-Galindo-CV-English.pdf'

  return (
    <div className="dock" role="region" aria-label={t('dock.label')}>
      <ul className="dock__list">
        {LINKS.map(({ key, href, Icon }) => {
          const label = t(`dock.${key}`)
          if (key === 'email') {
            return (
              <li key={key}>
                <button
                  type="button"
                  className="dock__tile"
                  onClick={copyEmail}
                  aria-label={t('dock.emailCopy')}
                  title={EMAIL}
                  data-copied={copied || undefined}
                >
                  {copied ? <CheckIcon /> : <Icon />}
                  <span className="dock__label">{copied ? t('dock.emailCopied') : label}</span>
                </button>
              </li>
            )
          }
          if (key === 'cv') {
            return (
              <li key={key}>
                <a className="dock__tile" href={cvHref} download={cvFile} aria-label={t('dock.cvAria')} title={label}>
                  <Icon />
                  <span className="dock__label">{label}</span>
                </a>
              </li>
            )
          }
          return (
            <li key={key}>
              <a className="dock__tile" href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
                <Icon />
                <span className="dock__label">{label}</span>
              </a>
            </li>
          )
        })}
      </ul>
      <p className="sr-only" aria-live="polite">
        {copied ? `${t('dock.emailCopied')}: ${EMAIL}` : ''}
      </p>
    </div>
  )
}
