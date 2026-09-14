import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import { featuredProjects } from '../data/projects.js'

/**
 * FEATURED — the only thing on this page that moves by itself.
 *
 * Concentrating the motion budget here is what lets the Explore lanes below
 * stay still: one moving element reads as hierarchy, three read as noise.
 *
 * Autoplay stops permanently once the reader takes manual control, and never
 * starts at all when the OS asks for reduced motion or the tab is hidden.
 */

const INTERVAL = 6000 // ms per slide

export default function FeaturedSlider() {
  const { t } = useLocale()
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [engaged, setEngaged] = useState(false) // reader took over
  const [paused, setPaused] = useState(false) // transient (hover / tab hidden)
  const slides = featuredProjects
  const count = slides.length

  const goTo = useCallback((i) => {
    setEngaged(true)
    setIndex(((i % count) + count) % count)
  }, [count])

  useEffect(() => {
    if (reduceMotion || engaged || paused || count < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL)
    return () => clearInterval(id)
  }, [reduceMotion, engaged, paused, count])

  // A slider advancing in a tab nobody is looking at is wasted work.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  if (!count) return null
  const project = slides[index]

  return (
    <section
      className="mx-auto w-full max-w-[1600px] px-4 pb-16 md:px-8"
      aria-roledescription="carousel"
      aria-label={t('projects.featuredKicker')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <header className="mb-6 flex items-baseline justify-between gap-6">
        <h2
          className="font-nav uppercase"
          style={{ color: 'var(--fg-muted)', fontSize: 12, letterSpacing: '0.22em' }}
        >
          {t('projects.featuredKicker')}
        </h2>
        <span
          className="font-nav tabular-nums"
          style={{ color: 'var(--fg-muted)', fontSize: 12, letterSpacing: '0.14em' }}
        >
          {String(index + 1).padStart(2, '0')} — {String(count).padStart(2, '0')}
        </span>
      </header>

      <Slide key={project.slug} project={project} t={t} />

      <Dots index={index} count={count} goTo={goTo} slides={slides} t={t} />

      <style>{`
        @keyframes featured-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes featured-in { from { opacity: 1; } to { opacity: 1; } }
        }
      `}</style>
    </section>
  )
}

function Slide({ project, t }) {
  const media = project.faces?.product?.image ?? project.logo
  return (
    <Link
      to={project.href}
      className="group relative block overflow-hidden"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
        // Keyed by slug in the parent, so this replays on every slide change.
        animation: 'featured-in 520ms cubic-bezier(0.22,1,0.36,1) both',
      }}
    >
      <div className="grid grid-cols-1 items-center gap-6 p-6 md:grid-cols-2 md:gap-10 md:p-10">
        <div className="order-2 md:order-1">
          <span
            className="font-nav uppercase"
            style={{ color: project.accent, fontSize: 12, letterSpacing: '0.22em', fontWeight: 700 }}
          >
            {project.tag}
          </span>
          <h3
            className="mt-3 font-display"
            style={{
              color: 'var(--fg)',
              fontSize: 'clamp(30px,4.4vw,60px)',
              lineHeight: 1.05,
              fontWeight: 700,
            }}
          >
            {t(project.titleI18n)}
          </h3>
          <p
            className="mt-4 font-body"
            style={{ color: 'var(--fg-soft)', fontSize: 15, lineHeight: 1.7, maxWidth: '48ch' }}
          >
            {t(project.summaryI18n)}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="font-nav uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  color: 'var(--fg-muted)',
                  border: '1px solid color-mix(in srgb, var(--fg) 18%, transparent)',
                  padding: '4px 8px',
                }}
              >
                {tag}
              </li>
            ))}
          </ul>
          <span
            className="mt-6 inline-flex font-nav"
            style={{
              color: 'var(--fg)',
              fontSize: 13,
              borderBottom: '1px solid currentColor',
              paddingBottom: 2,
            }}
          >
            {t('projects.caseStudyShort')}
          </span>
        </div>

        <div
          className="order-1 flex aspect-[4/3] items-center justify-center overflow-hidden md:order-2"
          style={{ background: 'color-mix(in srgb, var(--fg) 5%, transparent)' }}
        >
          {media ? (
            <img
              src={media}
              alt={t(project.titleI18n)}
              draggable="false"
              decoding="async"
              className="h-full w-full"
              style={{ objectFit: 'contain', padding: 16 }}
            />
          ) : (
            <span
              className="font-display"
              style={{ color: 'var(--fg-muted)', fontSize: 'clamp(40px,7vw,88px)', fontWeight: 700 }}
            >
              {t(project.titleI18n).slice(0, 2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function Dots({ index, count, goTo, slides, t }) {
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={slides[i].slug}
          type="button"
          onClick={() => goTo(i)}
          aria-label={`${t('projects.goToSlide')} ${i + 1}: ${t(slides[i].titleI18n)}`}
          aria-current={i === index}
          className="group inline-flex h-8 items-center"
        >
          {/* Fixed box, scaled rule inside — the active dot grows via transform
              so the row never reflows while the slider advances. */}
          <span className="block" style={{ width: 40, height: 2 }}>
            <span
              className="block h-full w-full"
              style={{
                background: i === index ? 'var(--fg)' : 'color-mix(in srgb, var(--fg) 28%, transparent)',
                transformOrigin: 'left center',
                transform: `scaleX(${i === index ? 1 : 0.4})`,
                transition: 'transform 380ms cubic-bezier(0.22,1,0.36,1), background 240ms ease',
              }}
            />
          </span>
        </button>
      ))}
    </div>
  )
}
