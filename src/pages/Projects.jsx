import { useLocale } from '../i18n/LocaleProvider.jsx'
import projects from '../data/projects.js'
import ProjectCard from '../components/ProjectCard.jsx'

export default function Projects() {
  const { t } = useLocale()
  return (
    <>
      <section className="mx-auto w-full max-w-[1200px] px-4 pb-12 pt-20 md:px-8 md:pt-32">
        <h1
          className="font-display"
          style={{
            color: 'var(--fg)',
            fontSize: 'clamp(48px, 7vw, 96px)',
            lineHeight: 1.02,
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
        >
          {t('projects.title')}
        </h1>
        <p
          className="mt-6 font-body"
          style={{ color: 'var(--fg-soft)', fontSize: 18, lineHeight: 1.7, maxWidth: '60ch' }}
        >
          {t('projects.lead')}
        </p>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-16 md:px-8 md:py-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} t={t} />
          ))}
        </div>
      </section>
    </>
  )
}
