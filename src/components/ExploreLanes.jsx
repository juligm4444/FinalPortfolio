import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import { CATEGORIES, projectsByCategory } from '../data/projects.js'

/**
 * EXPLORE — three lanes, one per category, browsed by hand.
 *
 * Motion budget lives in the Featured slider above; nothing here moves on its
 * own. A lane is inert until the pointer enters it, at which point it becomes
 * the active lane, lifts above its neighbours, and takes over the wheel so a
 * scroll gesture steps through its projects.
 *
 * The wheel is only captured while the lane can still move in the direction
 * being scrolled. At either end the handler stands down and the page scrolls
 * normally, so the section can never trap the reader.
 *
 * Desktop / tablet-landscape → three vertical lanes, skewed into
 * parallelograms. Mobile / tablet-portrait → three stacked horizontal bands,
 * unskewed (a skewed band eats too much of a narrow viewport).
 */

// One accent per lane, walking down the brand's pink ramp so the three read as
// a family rather than three unrelated colours.
//
// The accent is deliberately never the colour of any text: pink-light on the
// light theme's background fails contrast outright, and any ramp of three
// pinks that all pass AA on both themes collapses into three near-identical
// darks. So identity lives in the rail and the marker dot — graphics, which
// only need 3:1 — while every label stays on var(--fg).
const LANE_ACCENT = {
  digital: 'var(--pink-dark)',
  product: 'var(--pink)',
  visual: 'var(--pink-light)',
}

const SKEW = 5 // deg — lane inclination on wide viewports
const WHEEL_COOLDOWN = 380 // ms between steps, so one gesture = one project

export default function ExploreLanes() {
  const { t } = useLocale()
  const [activeLane, setActiveLane] = useState(null)

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-24 md:px-8">
      <header className="mb-8 flex items-baseline justify-between gap-6">
        <h2
          className="font-nav uppercase"
          style={{ color: 'var(--fg-muted)', fontSize: 12, letterSpacing: '0.22em' }}
        >
          {t('projects.exploreKicker')}
        </h2>
        <p
          className="font-body"
          style={{ color: 'var(--fg-muted)', fontSize: 13 }}
        >
          {t('projects.exploreHint')}
        </p>
      </header>

      <div
        className="flex flex-col gap-4 lg:h-[clamp(520px,72vh,760px)] lg:flex-row lg:gap-5"
        onMouseLeave={() => setActiveLane(null)}
      >
        {CATEGORIES.map((category) => (
          <Lane
            key={category}
            category={category}
            projects={projectsByCategory(category)}
            active={activeLane === category}
            dimmed={activeLane !== null && activeLane !== category}
            onActivate={() => setActiveLane(category)}
            t={t}
          />
        ))}
      </div>
    </section>
  )
}

function Lane({ category, projects, active, dimmed, onActivate, t }) {
  const [index, setIndex] = useState(0)
  const laneRef = useRef(null)
  const lastStepRef = useRef(0)
  const accent = LANE_ACCENT[category]
  const count = projects.length

  const step = useCallback(
    (delta) => {
      setIndex((i) => Math.min(count - 1, Math.max(0, i + delta)))
    },
    [count],
  )

  // Wheel capture. Deliberately a native listener with `passive: false` —
  // React's synthetic wheel handler cannot call preventDefault reliably.
  useEffect(() => {
    const node = laneRef.current
    if (!node || !active) return

    const onWheel = (e) => {
      const dir = Math.sign(e.deltaY)
      if (dir === 0) return
      const next = index + dir
      // Out of range in this direction — hand the gesture back to the page.
      if (next < 0 || next > count - 1) return

      e.preventDefault()
      const now = performance.now()
      if (now - lastStepRef.current < WHEEL_COOLDOWN) return
      lastStepRef.current = now
      step(dir)
    }

    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [active, index, count, step])

  const project = projects[index]
  if (!project) return null

  return (
    <div
      ref={laneRef}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className="relative flex-1 overflow-hidden lg:min-w-0"
      style={{
        // The parallelogram only applies where there is width to spare.
        transform: `translateY(${active ? -6 : 0}px)`,
        opacity: dimmed ? 0.55 : 1,
        transition: 'transform 420ms cubic-bezier(0.22,1,0.36,1), opacity 320ms ease',
        zIndex: active ? 2 : 1,
      }}
    >
      {/* Auto height on narrow screens. A fixed height there let a long
          caption squeeze the flex-1 media down to nothing; on lg the lane
          fills the row and flex-1 is what makes the media grow. */}
      <div
        className="lane-skew relative w-full lg:h-full"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
          '--lane-skew': `${SKEW}deg`,
        }}
      >
        {/* Accent rail — the lane's identity, and the only always-on colour. */}
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full"
          style={{ width: 6, background: accent }}
        />

        <div className="lane-content relative flex h-full flex-col">
          <LaneHeader
            category={category}
            accent={accent}
            index={index}
            count={count}
            active={active}
            onStep={step}
            t={t}
          />

          <Link
            to={project.href}
            className="group relative flex min-h-0 flex-1 flex-col"
            aria-label={t(project.titleI18n)}
          >
            <LaneMedia project={project} active={active} t={t} />
            <LaneCaption project={project} accent={accent} t={t} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function LaneHeader({ category, accent, index, count, active, onStep, t }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 pt-5 md:px-6">
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block shrink-0"
          style={{ width: 7, height: 7, background: accent, borderRadius: '50%' }}
        />
        <span
          className="font-nav uppercase"
          style={{ color: 'var(--fg)', fontSize: 12, letterSpacing: '0.22em', fontWeight: 700 }}
        >
          {t(`projects.category.${category}`)}
        </span>
      </span>

      <div className="flex items-center gap-2">
        <span
          className="font-nav tabular-nums"
          style={{ color: 'var(--fg-muted)', fontSize: 11, letterSpacing: '0.12em' }}
        >
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        {/* Arrows are the touch and keyboard path to the same steps the wheel
            drives — a lane must never be reachable by pointer alone. */}
        <StepButton
          dir={-1}
          disabled={index === 0}
          onStep={onStep}
          label={t('projects.prev')}
        />
        <StepButton
          dir={1}
          disabled={index === count - 1}
          onStep={onStep}
          label={t('projects.next')}
        />
      </div>
    </div>
  )
}

function StepButton({ dir, disabled, onStep, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={() => onStep(dir)}
      className="inline-flex h-7 w-7 items-center justify-center"
      style={{
        border: '1px solid color-mix(in srgb, var(--fg) 18%, transparent)',
        color: 'var(--fg-soft)',
        opacity: disabled ? 0.3 : 1,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'opacity 200ms ease, border-color 200ms ease',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {dir === -1 ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  )
}

function LaneMedia({ project, active, t }) {
  return (
    <div className="relative h-[180px] px-5 py-4 md:px-6 lg:h-auto lg:min-h-0 lg:flex-1">
      <div className="relative h-full w-full overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={t(project.titleI18n)}
            draggable="false"
            loading="lazy"
            decoding="async"
            className="h-full w-full"
            style={{
              objectFit: 'contain',
              transform: active ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 520ms cubic-bezier(0.22,1,0.36,1)',
            }}
          />
        ) : (
          <div
            aria-hidden
            className="flex h-full w-full items-center justify-center"
            style={{ background: 'color-mix(in srgb, var(--fg) 5%, transparent)' }}
          >
            <span
              className="font-display"
              style={{ color: 'var(--fg-muted)', fontSize: 'clamp(32px,5vw,64px)', fontWeight: 700 }}
            >
              {t(project.titleI18n).slice(0, 2)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function LaneCaption({ project, accent, t }) {
  return (
    <div className="px-5 pb-5 md:px-6 md:pb-6">
      <h3
        className="font-display"
        style={{ color: 'var(--fg)', fontSize: 'clamp(20px,1.6vw,26px)', lineHeight: 1.15, fontWeight: 700 }}
      >
        {t(project.titleI18n)}
      </h3>
      <p
        className="mt-2 font-body"
        style={{ color: 'var(--fg-soft)', fontSize: 13, lineHeight: 1.6 }}
      >
        {t(project.laneSummaryI18n)}
      </p>
      <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
        {project.tags.slice(0, 3).map((tag) => (
          <li
            key={tag}
            className="font-nav uppercase"
            style={{
              fontSize: 10,
              letterSpacing: '0.16em',
              color: 'var(--fg-muted)',
              border: `1px solid color-mix(in srgb, ${accent} 40%, transparent)`,
              padding: '3px 7px',
            }}
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  )
}
