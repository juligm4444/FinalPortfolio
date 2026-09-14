import { useLocale } from '../i18n/LocaleProvider.jsx'
import FeaturedSlider from '../components/FeaturedSlider.jsx'
import ExploreLanes from '../components/ExploreLanes.jsx'

/**
 * /projects answers two different questions, so it is built in two parts:
 *   FEATURED — "what should I look at first?"  (auto slider)
 *   EXPLORE  — "what kind of work is there?"   (three manual lanes)
 *
 * On wide viewports the page title is set as an oversized ground layer rather
 * than a heading block: it fills the space the removed lead paragraph left
 * without adding another thing to read.
 */
export default function Projects() {
  const { t } = useLocale()

  return (
    <>
      {/* One title, set as large as the viewport allows and pulled slightly
          past the left margin so it reads as ground rather than as a label.
          The optical overhang is in `em`, so it tracks the type size instead
          of drifting as the clamp scales. */}
      <section className="mx-auto w-full max-w-[1600px] overflow-hidden px-4 pb-8 pt-16 md:px-8 md:pt-24">
        <h1
          className="font-display"
          style={{
            color: 'var(--fg)',
            fontSize: 'clamp(52px, 13vw, 200px)',
            lineHeight: 0.92,
            fontWeight: 700,
            letterSpacing: '-0.035em',
            marginLeft: '-0.055em',
          }}
        >
          {t('projects.title')}
        </h1>
      </section>

      <FeaturedSlider />
      <ExploreLanes />
    </>
  )
}
