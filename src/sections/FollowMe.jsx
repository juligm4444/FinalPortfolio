import { motion } from 'framer-motion'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import Social from '../components/Social.jsx'

/**
 * Closing block on the home page — centred, social-first.
 * Same Social tiles as the contact page, just framed as an invitation.
 */
export default function FollowMe() {
  const { t } = useLocale()
  return (
    <section className="mx-auto w-full max-w-[1100px] px-4 py-24 text-center md:px-8 md:py-32">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="font-nav uppercase"
        style={{
          color: 'var(--fg-muted)',
          fontSize: 13,
          letterSpacing: '0.22em',
        }}
      >
        {t('home.followKicker')}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="mt-3 font-display"
        style={{
          color: 'var(--fg)',
          fontSize: 'clamp(34px, 4.4vw, 56px)',
          lineHeight: 1.05,
          fontWeight: 700,
          letterSpacing: '-0.01em',
        }}
      >
        {t('home.followTitle')}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="mx-auto mt-6 font-body"
        style={{
          color: 'var(--fg-soft)',
          fontSize: 17,
          lineHeight: 1.7,
          maxWidth: '52ch',
        }}
      >
        {t('home.followLead')}
      </motion.p>

      <div className="mt-10 flex justify-center">
        <Social size={44} gap={20} />
      </div>
    </section>
  )
}
