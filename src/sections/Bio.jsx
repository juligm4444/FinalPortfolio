import { motion } from 'framer-motion'
import { useLocale } from '../i18n/LocaleProvider.jsx'

export default function Bio() {
  const { t } = useLocale()
  const pills = [t('home.bioPill1'), t('home.bioPill2'), t('home.bioPill3')]

  return (
    <section className="bio mx-auto w-full max-w-[1200px] px-4 py-24 md:px-8 md:py-32">
      <div>
        {/* RIGHT — paragraphs + (kicker / pills / slab moved to the bottom) */}
        <div className="flex max-w-[780px] flex-col">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'var(--font-label)',
              color: 'var(--text-muted)',
              fontSize: 18,
              lineHeight: 1.7,
              fontWeight: 400,
              maxWidth: '60ch',
            }}
          >
            {t('home.bioPara1')}
          </motion.p>

          {/* Kicker + pills + slab — now at the bottom of the right column */}
          <div className="mt-12 pt-10" style={{ borderTop: '1px solid color-mix(in srgb, var(--text) 12%, transparent)' }}>
            <p
              className="font-nav uppercase tracking-[0.22em]"
              style={{ color: 'var(--text-muted)', fontSize: 12 }}
            >
              {t('home.bioTitle')}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {pills.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center font-nav"
                    style={{
                      border: '1px solid var(--text)',
                      color: 'var(--text)',
                      fontSize: 13,
                      padding: '6px 12px',
                      borderRadius: 999,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
