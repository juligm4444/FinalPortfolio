import { motion } from 'framer-motion'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import MediaSlot from '../components/MediaSlot.jsx'
import GlassBlock from '../components/GlassBlock.jsx'
import infoImg from '../assets/images/info.jpeg'

export default function AboutInformation() {
  const { t } = useLocale()
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-20 md:px-8 md:py-28">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-7">
          <p
            className="font-nav uppercase"
            style={{ color: 'var(--fg-muted)', fontSize: 12, letterSpacing: '0.22em' }}
          >
            {t('about.infoKicker')}
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 font-display"
            style={{
              color: 'var(--fg)',
              fontSize: 'clamp(30px, 3.8vw, 48px)',
              lineHeight: 1.1,
              fontWeight: 700,
              maxWidth: '18ch',
            }}
          >
            {t('about.infoTitle')}
          </motion.h2>

          <GlassBlock className="mt-8" padding="28px 32px">
            <div className="space-y-5">
              {[t('about.infoPara1'), t('about.infoPara2'), t('about.infoPara3')].map(
                (p, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                    className="font-body"
                    style={{
                      color: 'var(--fg-soft)',
                      fontSize: 17,
                      lineHeight: 1.7,
                      maxWidth: '60ch',
                    }}
                  >
                    {p}
                  </motion.p>
                )
              )}
            </div>
          </GlassBlock>
        </div>

        <div className="md:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="md:sticky md:top-[120px]"
          >
            {/* swap the src for a Spline URL by passing `spline=...` instead */}
            <MediaSlot
              src={infoImg}
              alt="Julián Galindo"
              caption={t('about.infoMediaCaption')}
              ratio="4 / 5"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
