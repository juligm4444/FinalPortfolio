import { motion } from 'framer-motion'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import projects from '../data/projects.js'
import TextLink from '../components/TextLink.jsx'
import ProjectCard from '../components/ProjectCard.jsx'

const SPANS = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7']

export default function FeaturedProjects() {
  const { t } = useLocale()
  const featured = projects.filter((p) => p.featured)

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-24 md:px-8 md:py-32">
      {/* Section header — asymmetric layout, number accent */}
      <header className="mb-12 md:mb-16">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="flex items-start gap-6">
            {/* Large index number — editorial touch */}
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 13,
                color: '#FF0871',
                letterSpacing: '0.08em',
                marginTop: 6,
                flexShrink: 0,
              }}
            >
              02
            </motion.span>

            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="font-nav uppercase"
                style={{ color: 'var(--fg-muted)', fontSize: 12, letterSpacing: '0.22em' }}
              >
                {t('home.featuredKicker')}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
                className="mt-2 font-display"
                style={{
                  color: 'var(--fg)',
                  fontSize: 'clamp(34px, 4.4vw, 56px)',
                  lineHeight: 1.05,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                }}
              >
                {t('home.featuredTitle')}
              </motion.h2>
            </div>
          </div>

          {/* CTA — right side on desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center gap-3"
          >
            <span
              aria-hidden="true"
              style={{
                width: 28,
                height: 1,
                background: 'color-mix(in srgb, var(--fg) 30%, transparent)',
                flexShrink: 0,
              }}
            />
            <TextLink to="/projects">{t('home.featuredCta')} →</TextLink>
          </motion.div>
        </div>

        {/* Horizontal rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
          style={{
            transformOrigin: 'left center',
            height: 1,
            background: 'color-mix(in srgb, var(--fg) 12%, transparent)',
            marginTop: 28,
          }}
        />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
        {featured.map((p, i) => (
          <ProjectCard
            key={p.slug}
            project={p}
            t={t}
            variantClass={SPANS[i % SPANS.length]}
          />
        ))}
      </div>
    </section>
  )
}
