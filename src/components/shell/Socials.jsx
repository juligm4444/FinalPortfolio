import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../../i18n/LocaleProvider.jsx'
import PlushTile, { plushJob } from '../fur/PlushTile.jsx'
import { GLYPHS } from '../fur/glyphs.js'
import { snapshotOnce } from '../fur/snapshots.js'
import cvEn from '../../assets/files/CV-English.pdf'
import cvEs from '../../assets/files/CV-Español.pdf'

export const EMAIL = 'julian_gm4@hotmail.com'

const LINKS = [
  { key: 'instagram', href: 'https://www.instagram.com/juligm4/' },
  { key: 'linkedin', href: 'https://www.linkedin.com/in/juligm4' },
  { key: 'cv' },
  { key: 'github', href: 'https://github.com/juligm4444' },
  { key: 'behance', href: 'https://www.behance.net/juligm4' },
  { key: 'email' },
]

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Clipboard API refused (insecure context, permissions): select a node and copy by hand.
    const span = document.createElement('span')
    span.textContent = text
    document.body.appendChild(span)
    const range = document.createRange()
    range.selectNodeContents(span)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    sel.removeAllRanges()
    span.remove()
    return ok
  }
}

/* V3 §B.3–5 — the six networks as Plush Tiles. In the desktop nav they are a
   2 × 3 grid of live-on-hover tiles; at the foot of every page on phones they are
   the fixed image of the same tile (`staticOnly`: no WebGL at all). The mail tile
   copies the address instead of opening a mail client. */
export default function Socials({ size = 44, staticOnly = false, className = '' }) {
  const { t, locale } = useLocale()
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  // scripts/bake-fur.mjs renders the rest images through this hook.
  useEffect(() => {
    window.__furBake = { ...(window.__furBake ?? {}), social: (name, px) => snapshotOnce(plushJob(name, GLYPHS[name], px)) }
  }, [])

  const onEmail = async () => {
    const ok = await copy(EMAIL)
    setCopied(ok)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2200)
  }

  const cvHref = locale === 'es' ? cvEs : cvEn
  const cvFile = locale === 'es' ? 'Julian-Galindo-CV-Espanol.pdf' : 'Julian-Galindo-CV-English.pdf'

  return (
    <div className={`socials ${className}`.trim()} role="group" aria-label={t('social.label')}>
      <ul className="socials__grid">
        {LINKS.map(({ key, href }, i) => {
          const common = { name: key, glyph: GLYPHS[key], size, seed: i * 7, staticOnly }
          if (key === 'email')
            return (
              <li key={key}>
                <PlushTile {...common} label={copied ? t('social.emailCopied') : t('social.emailCopy')} onClick={onEmail} />
              </li>
            )
          if (key === 'cv')
            return (
              <li key={key}>
                <PlushTile {...common} label={t('social.cvAria')} href={cvHref} download={cvFile} />
              </li>
            )
          return (
            <li key={key}>
              <PlushTile {...common} label={t(`social.${key}`)} href={href} />
            </li>
          )
        })}
      </ul>
      <p className="socials__status" aria-live="polite">
        {copied ? `${t('social.emailCopied')}: ${EMAIL}` : ''}
      </p>
    </div>
  )
}
