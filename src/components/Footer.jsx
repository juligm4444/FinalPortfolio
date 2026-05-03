import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/LocaleProvider.jsx'

const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)

/**
 * Smoothly animate the window scrollY to 0 over `duration`. Manual rAF gives
 * us a snappy, consistent ease across browsers (the native CSS smooth scroll
 * can be slow / capped on long pages).
 */
const animateScrollToTop = (duration = 700) => {
  if (typeof window === 'undefined') return
  const startY = window.scrollY || window.pageYOffset
  if (startY <= 0) return
  const start = performance.now()
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1)
    window.scrollTo(0, startY * (1 - ease(t)))
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export default function Footer() {
  const { t } = useLocale()

  const onBackToTop = () => {
    animateScrollToTop(700)
    // tell the hero (and anything else that wants to know) to restart its
    // intro animation. Pages that don't render a hero simply ignore this.
    window.dispatchEvent(new CustomEvent('juligm4:resetHero'))
  }

  return (
    <footer
      className="relative w-full"
      style={{
        background: 'transparent',
        borderTop: '1px solid color-mix(in srgb, var(--fg) 12%, transparent)',
      }}
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-8 px-6 py-10 md:flex-row md:px-10 lg:px-16">
        <p
          className="font-nav"
          style={{
            color: 'var(--fg-muted)',
            fontSize: 15,
            letterSpacing: '0.04em',
          }}
        >
          {t('footer.copyright')}
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[
            { to: '/', key: 'home' },
            { to: '/about', key: 'about' },
            { to: '/projects', key: 'projects' },
            { to: '/contact', key: 'contact' },
          ].map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="font-nav transition-colors"
              style={{
                color: 'var(--fg-muted)',
                fontSize: 15,
                letterSpacing: '0.04em',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fg)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-muted)')}
            >
              {t(`nav.${r.key}`)}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={onBackToTop}
          aria-label={t('footer.backToTop')}
          title={t('footer.backToTop')}
          className="inline-flex items-center justify-center transition-all duration-200"
          style={{
            width: 46,
            height: 46,
            color: 'var(--fg)',
            background: 'transparent',
            border: '1px solid color-mix(in srgb, var(--fg) 25%, transparent)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#EDEDE8'
            e.currentTarget.style.background = '#FF0066'
            e.currentTarget.style.borderColor = '#FF0066'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow =
              '0 0 0 1px #FF85B6, 0 10px 24px rgba(255, 133, 182, 0.45)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--fg)'
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor =
              'color-mix(in srgb, var(--fg) 25%, transparent)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  )
}
