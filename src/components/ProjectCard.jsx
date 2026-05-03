import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const SWEEP_DURATION = '700ms'
const RAIL_WIDTH = 8 // px — initial accent rail thickness on the left

/**
 * Project card with two superpowers:
 *  1. Hover-driven "sweep": the left accent rail expands to fill the card with
 *     pink, and the inner text colours stay in contrast at every step thanks
 *     to a synchronised gradient on the text fill.
 *  2. A dedicated logo slot in the top-right corner (~1/7 of the area). Pass
 *     a `logo` (image URL) for the project; otherwise a brutalist placeholder
 *     stands in.
 */
export default function ProjectCard({
  project,
  t,
  variantClass = '',
  aspectRatio = '4 / 3',
}) {
  const [hover, setHover] = useState(false)
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`group relative overflow-hidden ${variantClass}`}
      style={{
        background: 'var(--surface-2)',
        border: '1px solid color-mix(in srgb, var(--fg) 8%, transparent)',
        aspectRatio,
        transition: `transform 360ms cubic-bezier(0.22,1,0.36,1)`,
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <Link to={project.href} className="block h-full w-full">
        {/* Background sweep layer — base rail then expands to full width */}
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full"
          style={{
            background: '#FF0871',
            transformOrigin: 'left center',
            // when not hovering, only show the rail width
            width: hover ? '100%' : `${RAIL_WIDTH}px`,
            transition: `width ${SWEEP_DURATION} cubic-bezier(0.65, 0, 0.35, 1)`,
          }}
        />

        {/* Card content. The text uses a `background-clip: text` gradient that
            transitions from default fg → pink-light contrast on the same axis
            as the sweep, so colours stay legible through the whole motion. */}
        <div className="relative flex h-full flex-col p-6 md:p-10">
          {/* Top row: tag + period (left) | logo (right) */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <SweepText hover={hover} accent={project.accent}>
                <span
                  className="inline-flex font-nav uppercase"
                  style={{
                    fontSize: 12,
                    letterSpacing: '0.22em',
                    fontWeight: 700,
                  }}
                  data-accent="true"
                >
                  {project.tag}
                </span>
              </SweepText>

              <SweepText hover={hover} muted>
                <span
                  className="mt-2 inline-flex font-nav uppercase"
                  style={{ fontSize: 12, letterSpacing: '0.22em' }}
                >
                  {project.period}
                </span>
              </SweepText>
            </div>

            <ProjectLogo project={project} hover={hover} />
          </div>

          {/* Bottom row: title + summary + CTA */}
          <div className="mt-auto pt-6">
            <SweepText hover={hover}>
              <h3
                className="font-display"
                style={{
                  fontSize: 'clamp(24px, 2.6vw, 36px)',
                  lineHeight: 1.1,
                  fontWeight: 700,
                }}
              >
                {t(project.titleI18n)}
              </h3>
            </SweepText>

            <SweepText hover={hover} muted>
              <p
                className="mt-3 font-body"
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  maxWidth: '46ch',
                }}
              >
                {t(project.summaryI18n)}
              </p>
            </SweepText>

            <SweepText hover={hover}>
              <span
                className="mt-5 inline-flex font-nav transition-transform duration-200"
                style={{
                  fontSize: 13,
                  borderBottom: '1px solid currentColor',
                  paddingBottom: 2,
                  transformOrigin: 'left center',
                  transform: hover ? 'scale(1.06)' : 'scale(1)',
                }}
              >
                {t('projects.caseStudy')}
              </span>
            </SweepText>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

/**
 * Wraps text with a colour that flips on hover. Three flavours:
 *  - default: var(--fg) → #EDEDE8
 *  - muted:   var(--fg-soft) → rgba(white, 0.85)
 *  - accent:  project.accent → #EDEDE8
 */
function SweepText({ children, hover, muted = false, accent }) {
  const baseColor = accent
    ? accent
    : muted
    ? 'var(--fg-soft)'
    : 'var(--fg)'
  const hoverColor = muted ? 'rgba(237, 237, 232, 0.92)' : '#EDEDE8'
  return (
    <span
      style={{
        color: hover ? hoverColor : baseColor,
        transition: `color ${SWEEP_DURATION} cubic-bezier(0.65, 0, 0.35, 1)`,
        display: 'block',
      }}
    >
      {children}
    </span>
  )
}

function ProjectLogo({ project, hover }) {
  // Logo slot — top-right. Doubled in size from the previous spec
  // (~1/4 of a 600x450 card now), still anchored in the same corner.
  const size = 192
  const containerStyle = {
    width: size,
    height: size,
    flex: '0 0 auto',
    background: hover
      ? 'rgba(237, 237, 232, 0.16)'
      : 'color-mix(in srgb, var(--fg) 8%, transparent)',
    border: hover
      ? '1px solid rgba(237, 237, 232, 0.55)'
      : '1px solid color-mix(in srgb, var(--fg) 18%, transparent)',
    transition: `background ${SWEEP_DURATION} ease, border-color ${SWEEP_DURATION} ease`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  }
  if (project.logo) {
    return (
      <div style={containerStyle}>
        <img
          src={project.logo}
          alt={`${project.slug} logo`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: 8,
            filter: hover ? 'brightness(0) invert(1)' : 'none',
            transition: `filter ${SWEEP_DURATION} ease`,
          }}
          draggable="false"
        />
      </div>
    )
  }
  // Placeholder — small rotated slab + dotted hatch
  return (
    <div style={containerStyle} aria-hidden>
      <div
        style={{
          width: 22,
          height: 22,
          background: hover ? '#EDEDE8' : '#FF0871',
          transform: 'rotate(45deg)',
          transition: `background ${SWEEP_DURATION} ease`,
        }}
      />
    </div>
  )
}
