import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import Timeline from '../components/Timeline.jsx'
import uniImg from '../assets/images/uni.jpg'

// Back to the previous visual size — the only fix was the frame cropping
// the image horizontally. Width follows the natural aspect ratio.
const PHOTO_HEIGHT = 320

export default function Education() {
  const { t } = useLocale()
  const items = t('about.educationItems')

  // Measure the image's natural aspect so we can lock the LEFT column to the
  // image's rendered width. The kicker, title, caption — and therefore the
  // remaining space the timeline gets — all derive from this single number.
  const imgRef = useRef(null)
  const [photoWidth, setPhotoWidth] = useState(null)

  useEffect(() => {
    const el = imgRef.current
    if (!el) return
    const compute = () => {
      const r = el.naturalWidth / el.naturalHeight
      if (Number.isFinite(r) && r > 0) {
        setPhotoWidth(Math.round(PHOTO_HEIGHT * r))
      }
    }
    if (el.complete) compute()
    else el.addEventListener('load', compute, { once: true })
  }, [])

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-20 md:px-8 md:py-28">
      <div className="flex flex-col gap-12 md:flex-row md:gap-16">
        {/* LEFT — width === image width once measured. */}
        <div className="w-full md:w-auto" style={{ flex: '0 0 auto' }}>
          <div
            className="md:sticky md:top-[120px]"
            style={{ width: photoWidth ? `${photoWidth}px` : '100%', maxWidth: '100%' }}
          >
            <p
              className="font-nav uppercase"
              style={{
                color: 'var(--fg-muted)',
                fontSize: 12,
                letterSpacing: '0.22em',
              }}
            >
              {t('about.educationKicker')}
            </p>
            <h2
              className="mt-3 font-display"
              style={{
                color: 'var(--fg)',
                fontSize: 'clamp(28px, 3.2vw, 40px)',
                lineHeight: 1.1,
                fontWeight: 700,
                width: '100%',
              }}
            >
              {t('about.educationTitle')}
            </h2>

            <figure className="mt-8" style={{ width: '100%' }}>
              <img
                ref={imgRef}
                src={uniImg}
                alt="Universidad de los Andes"
                draggable="false"
                loading="lazy"
                decoding="async"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  maxHeight: PHOTO_HEIGHT,
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
              <figcaption
                className="mt-3 font-nav uppercase"
                style={{
                  color: 'var(--fg-muted)',
                  fontSize: 11,
                  letterSpacing: '0.22em',
                }}
              >
                {t('about.educationMediaCaption')}
              </figcaption>
            </figure>
          </div>
        </div>

        {/* RIGHT — each step in its own glass panel. The hex bg still
            reads through them, but the body copy stays comfortable. */}
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <Timeline items={items} glass />
        </div>
      </div>
    </section>
  )
}
