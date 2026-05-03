import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocale } from '../i18n/LocaleProvider.jsx'

const badgeImgs = import.meta.glob('../assets/badges/*.png', {
  eager: true,
  import: 'default',
})

const lookup = (slug) => {
  const path = Object.keys(badgeImgs).find((k) => k.endsWith(`/${slug}.png`))
  return path ? badgeImgs[path] : null
}

const BADGES = [
  { slug: 'ux-fundamentals', titleEn: 'User Experience Design Fundamentals', titleEs: 'Fundamentos de UX Design', issuer: 'IBM', year: 2025 },
  { slug: 'edt-practitioner', titleEn: 'Enterprise Design Thinking Practitioner', titleEs: 'Enterprise Design Thinking Practitioner', issuer: 'IBM', year: 2025 },
  { slug: 'agile-explorer', titleEn: 'Agile Explorer', titleEs: 'Agile Explorer', issuer: 'IBM', year: 2025 },
  { slug: 'pm-fundamentals', titleEn: 'Project Management Fundamentals', titleEs: 'Fundamentos de Project Management', issuer: 'IBM', year: 2025 },
  { slug: 'python-essentials-1', titleEn: 'Python Essentials 1', titleEs: 'Python Essentials 1', issuer: 'CISCO', year: 2025 },
  { slug: 'python-essentials-2', titleEn: 'Python Essentials 2', titleEs: 'Python Essentials 2', issuer: 'CISCO', year: 2025 },
  { slug: 'javascript-essentials-1', titleEn: 'JavaScript Essentials 1', titleEs: 'JavaScript Essentials 1', issuer: 'CISCO', year: 2025 },
  { slug: 'javascript-essentials-2', titleEn: 'JavaScript Essentials 2', titleEs: 'JavaScript Essentials 2', issuer: 'CISCO', year: 2025 },
]

const VERIFY_BASE = 'https://www.credly.com/users/juligm4'

export default function Certifications() {
  const { t, locale } = useLocale()
  const upcoming = t('about.certUpcomingItems')

  return (
    // SAME max-width as the rest of the page (1200) — no more 1400 escape hatch
    <section className="mx-auto w-full max-w-[1200px] px-4 py-20 md:px-8 md:py-28">
      <header className="mb-12 grid grid-cols-1 gap-6 md:mb-16 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4">
          <p
            className="font-nav uppercase"
            style={{ color: 'var(--fg-muted)', fontSize: 12, letterSpacing: '0.22em' }}
          >
            {t('about.certKicker')}
          </p>
          <h2
            className="mt-3 font-display"
            style={{
              color: 'var(--fg)',
              fontSize: 'clamp(30px, 3.8vw, 48px)',
              lineHeight: 1.1,
              fontWeight: 700,
            }}
          >
            {t('about.certTitle')}
          </h2>
        </div>
        <p
          className="font-body md:col-span-7 md:col-start-6"
          style={{
            color: 'var(--fg-soft)',
            fontSize: 17,
            lineHeight: 1.7,
            maxWidth: '52ch',
          }}
        >
          {t('about.certLead')}
        </p>
      </header>

      {/* Earned badges grid — narrower cards, more per row, contained */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {BADGES.map((b, i) => (
          <BadgeCard
            key={b.slug}
            badge={b}
            title={locale === 'es' ? b.titleEs : b.titleEn}
            verifyLabel={t('about.certVerify')}
            index={i}
          />
        ))}
      </div>

      {/* Upcoming */}
      <div className="mt-20">
        <p
          className="mb-6 font-nav uppercase"
          style={{ color: 'var(--fg-muted)', fontSize: 12, letterSpacing: '0.22em' }}
        >
          {t('about.certUpcoming')}
        </p>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {upcoming.map((u, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
              className="flex flex-col gap-2 p-5"
              style={{
                background: 'transparent',
                border: '1px dashed color-mix(in srgb, var(--fg) 35%, transparent)',
              }}
            >
              <span
                className="inline-flex w-max font-nav uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  color: '#FF0066',
                  border: '1px solid #FF0066',
                  padding: '4px 8px',
                }}
              >
                {t('about.certUpcomingLabel')}
              </span>
              <h3
                className="font-display"
                style={{ color: 'var(--fg)', fontSize: 18, lineHeight: 1.25, fontWeight: 700 }}
              >
                {u.title}
              </h3>
              <p
                className="font-body"
                style={{ color: 'var(--fg-muted)', fontSize: 13 }}
              >
                {u.issuer}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function BadgeCard({ badge, title, verifyLabel, index }) {
  const [hover, setHover] = useState(false)
  const src = lookup(badge.slug)

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative flex flex-col items-center text-center"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
        padding: '28px 18px 20px',
        // grow on hover (no extra glow/shadow)
        transform: hover ? 'scale(1.04)' : 'scale(1)',
        transition: 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1), border-color 240ms ease',
        borderColor: hover
          ? 'color-mix(in srgb, var(--fg) 22%, transparent)'
          : 'color-mix(in srgb, var(--fg) 10%, transparent)',
      }}
    >
      {/* 3D badge stage — both faces are the same image so the badge stays
          visible mid-spin like a video-game collectible. */}
      <div
        style={{
          position: 'relative',
          width: 130,
          height: 130,
          marginBottom: 18,
          perspective: '900px',
        }}
      >
        <div
          className="badge-spin"
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            animation: hover ? 'badge-spin-y 2.6s linear infinite' : 'none',
            transition: 'transform 240ms ease',
            transform: hover ? undefined : 'rotateY(0deg)',
          }}
        >
          {src && (
            <>
              <img
                src={src}
                alt={title}
                draggable="false"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                loading="lazy"
                decoding="async"
              />
              <img
                src={src}
                alt=""
                aria-hidden
                draggable="false"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              />
              {/* directional "light bar" — masked to the badge silhouette so
                  it works for circular badges (Enterprise Design Thinking) as
                  well as square ones. Only visible while spinning. */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, transparent 0%, transparent 55%, rgba(0,0,0,0.32) 100%)',
                  opacity: hover ? 1 : 0,
                  transition: 'opacity 320ms ease',
                  pointerEvents: 'none',
                  transform: 'translateZ(0.1px)',
                  WebkitMaskImage: `url(${src})`,
                  maskImage: `url(${src})`,
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                }}
              />
            </>
          )}
        </div>
      </div>

      <h3
        className="font-display"
        style={{
          color: 'var(--fg)',
          fontSize: 16,
          lineHeight: 1.25,
          fontWeight: 700,
          minHeight: '2.4em',
        }}
      >
        {title}
      </h3>
      <p
        className="mt-1 font-nav uppercase"
        style={{ color: 'var(--fg-muted)', fontSize: 11, letterSpacing: '0.22em' }}
      >
        {badge.issuer} · {badge.year}
      </p>

      <a
        href={VERIFY_BASE}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 font-nav"
        style={{
          fontSize: 12,
          color: hover ? '#FF85B6' : 'var(--fg)',
          borderBottom: hover ? '1px solid #FF85B6' : '1px solid var(--fg)',
          paddingBottom: 2,
          letterSpacing: '0.04em',
          transition: 'color 220ms ease, border-bottom-color 220ms ease',
        }}
      >
        {verifyLabel} →
      </a>

      <style>{`
        @keyframes badge-spin-y {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }
      `}</style>
    </motion.article>
  )
}
