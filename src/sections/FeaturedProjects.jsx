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
      <header className="mb-12 flex flex-col items-start justify-between gap-4 md:mb-16 md:flex-row md:items-end">
        <div>
          <p
            className="font-nav uppercase"
            style={{ color: 'var(--fg-muted)', fontSize: 13, letterSpacing: '0.22em' }}
          >
            {t('home.featuredKicker')}
          </p>
          <h2
            className="mt-3 font-display"
            style={{
              color: 'var(--fg)',
              fontSize: 'clamp(34px, 4.4vw, 56px)',
              lineHeight: 1.05,
              fontWeight: 700,
            }}
          >
            {t('home.featuredTitle')}
          </h2>
        </div>
        <TextLink to="/projects">{t('home.featuredCta')} →</TextLink>
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
