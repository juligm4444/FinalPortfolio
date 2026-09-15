import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

/**
 * One of the three columns: a sheet of frosted glass over the fluids, showing
 * the works in its category.
 *
 * It owns no timer. The index comes from a counter shared by all three
 * columns, so they always turn together; a manual step only shifts this
 * column's offset within that shared clock. Hovering holds the clock for
 * everyone, which is the point — releasing must not leave one column out of
 * phase with the other two.
 *
 * Pointing at the sheet fogs the glass further and grows it slightly.
 * Scrolling over it steps through by hand, and the wheel is only captured
 * while the gesture has somewhere to go, so the page is never trapped.
 */

const WHEEL_COOLDOWN = 420

export default function GlassPanel({
  category,
  works,
  direction,
  index,
  cursorSeed,
  active,
  revealed,
  contentIn,
  onActivate,
  onRelease,
  onStep,
  t,
}) {
  const panelRef = useRef(null)
  const lastStepRef = useRef(0)
  const count = works.length
  const cursor = ((cursorSeed % count) + count) % count

  // Native listener: React attaches wheel handlers passively, so
  // preventDefault would be ignored.
  useEffect(() => {
    const node = panelRef.current
    if (!node || !active) return

    const onWheel = (e) => {
      const dir = Math.sign(e.deltaY)
      if (dir === 0) return
      e.preventDefault()
      const now = performance.now()
      if (now - lastStepRef.current < WHEEL_COOLDOWN) return
      lastStepRef.current = now
      onStep(dir)
    }

    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [active, onStep])

  const work = works[cursor]
  if (!work) return null

  return (
    <section
      ref={panelRef}
      onMouseEnter={onActivate}
      onMouseLeave={onRelease}
      aria-label={t(`projects.category.${category}`)}
      className="glass-panel relative flex-1 overflow-hidden"
      style={{
        opacity: revealed ? 1 : 0,
        transform: `translateY(${revealed ? 0 : 36}px) scale(${active ? 1.02 : 1})`,
        transitionProperty: 'opacity, transform',
        transitionDuration: '720ms, 720ms',
        transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
        transitionDelay: revealed ? `${index * 120}ms` : '0ms',
        zIndex: active ? 3 : 2,
      }}
    >
      {/* Fogging on hover is a backdrop-filter change, not a colour change, so
          the fluids underneath stay visible — just less so. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: active ? 'var(--glass-panel-hover)' : 'var(--glass-panel)',
          backdropFilter: `blur(${active ? 34 : 18}px) saturate(${active ? 1.4 : 1.15})`,
          WebkitBackdropFilter: `blur(${active ? 34 : 18}px) saturate(${active ? 1.4 : 1.15})`,
          border: '0 solid var(--glass-panel-edge)',
          borderTopWidth: 1,
          borderBottomWidth: 1,
          transition: 'background 420ms ease, backdrop-filter 420ms ease',
        }}
      />

      <Link
        to={work.href}
        className="relative flex h-full flex-col overflow-hidden px-4 py-3.5 lg:px-8 lg:py-7"
      >
        {/* The banner heading only fits once the panel is a tall column; on a
            short wide band the category rides in the caption instead. */}
        <h2
          className="hidden shrink-0 text-center font-nav uppercase lg:block"
          style={{
            color: 'var(--glass-ink)',
            fontWeight: 700,
            fontSize: 'clamp(30px, 2.6vw, 54px)',
            letterSpacing: '0.01em',
            lineHeight: 1.05,
          }}
        >
          {t(`projects.category.${category}`)}
        </h2>

        <div
          key={work.id}
          className="flex min-h-0 flex-1 flex-row items-center gap-4 lg:flex-col lg:items-stretch lg:gap-0"
          style={{
            animation: contentIn
              ? `panel-in-${direction > 0 ? 'down' : 'up'} 620ms cubic-bezier(0.22,1,0.36,1) both`
              : 'none',
            opacity: contentIn ? undefined : 0,
          }}
        >
          <WorkMedia work={work} t={t} />
          <WorkCaption work={work} category={category} t={t} />
        </div>

        <div className="hidden shrink-0 lg:block">
          <Progress count={count} cursor={cursor} />
        </div>
      </Link>

      <style>{`
        @keyframes panel-in-down {
          from { opacity: 0; transform: translateY(-26px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes panel-in-up {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes panel-in-down { from { opacity: 0 } to { opacity: 1 } }
          @keyframes panel-in-up   { from { opacity: 0 } to { opacity: 1 } }
        }
      `}</style>
    </section>
  )
}

/**
 * A fixed frame, identical in every panel and every work.
 *
 * Letting each image size itself meant a wide screenshot and a tall render
 * pushed their captions to different heights, so the three columns never
 * lined up. The frame is deliberately modest: the images are here to identify
 * the work, and the words are what actually sell it.
 */
function WorkMedia({ work, t }) {
  return (
    // One square frame, identical for every work. A frame that only fixed its
    // height let a portrait photo render as a narrow strip beside a wide logo,
    // which is exactly the inconsistency it was meant to prevent.
    // On a column the artwork owns all the height the caption leaves over and
    // centres in it. The caption below has a fixed floor, so that space is the
    // same in all three columns and the frames line up side by side.
    <div className="flex shrink-0 items-center justify-center lg:min-h-0 lg:w-full lg:flex-1">
      <div
        className="flex aspect-square items-center justify-center overflow-hidden"
        style={{
          width: 'var(--media-size)',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        {work.image ? (
          <img
            src={work.image}
            alt={t(work.titleI18n)}
            draggable="false"
            decoding="async"
            className="h-full w-full"
            // Photographs and screenshots fill the square; marks are left
            // whole inside it. Cropping a logo to a square would be vandalism.
            style={{ objectFit: work.fit === 'cover' ? 'cover' : 'contain' }}
          />
        ) : (
          // Guard for a work added before its artwork — typographic rather
          // than an empty box or a borrowed icon.
          <span
            aria-hidden
            className="select-none text-center font-display"
            style={{
              color: 'var(--glass-ink-faint)',
              fontWeight: 700,
              fontSize: 'clamp(40px, 4.4vw, 76px)',
              lineHeight: 0.9,
            }}
          >
            {t(work.titleI18n).slice(0, 2)}
          </span>
        )}
      </div>
    </div>
  )
}

function WorkCaption({ work, category, t }) {
  return (
    // The floor keeps every column's caption the same height, so titles,
    // descriptions and tags sit on shared lines across the three panels.
    <div className="showcase-caption flex min-w-0 flex-1 flex-col justify-center lg:flex-none lg:justify-start">
      <p
        className="font-nav uppercase"
        style={{
          color: 'var(--glass-ink-soft)',
          fontSize: 'clamp(10px, 0.74vw, 14px)',
          letterSpacing: '0.2em',
          fontWeight: 700,
        }}
      >
        {/* A band has no banner heading, so the category takes the kicker's
            place there; the kicker's detail is already in the tags, and both
            together wrapped to three lines on a phone. */}
        <span className="lg:hidden">{t(`projects.category.${category}`)}</span>
        <span className="hidden lg:inline">{t(work.kickerI18n)}</span>
      </p>

      <h3
        className="mt-1 font-display lg:mt-2.5"
        style={{
          color: 'var(--glass-ink)',
          fontSize: 'clamp(22px, 2.1vw, 42px)',
          lineHeight: 1.08,
          fontWeight: 700,
        }}
      >
        {t(work.titleI18n)}
      </h3>

      {/* Clamped: the panel cannot grow, so a long description has to give way
          rather than push the tags out of the frame. */}
      <p
        className="[-webkit-box-orient:vertical] [display:-webkit-box] [-webkit-line-clamp:2] mt-1.5 max-w-[36ch] overflow-hidden font-nav lg:mt-3 lg:[-webkit-line-clamp:3]"
        style={{
          color: 'var(--glass-ink)',
          fontSize: 'clamp(13px, 1vw, 19px)',
          lineHeight: 1.45,
          fontWeight: 700,
        }}
      >
        {t(work.descI18n)}
      </p>

      {/* One row on a band: a tag that would wrap is dropped whole, never cut. */}
      <ul className="mt-2 flex max-h-[30px] flex-wrap gap-1.5 overflow-hidden lg:mt-auto lg:max-h-none lg:gap-2 lg:pt-4">
        {work.tagKeys.map((key, i) => (
          <li key={key} className={i > 1 ? 'hidden lg:block' : undefined}>
            <span
              className="block whitespace-nowrap font-nav"
              style={{
                color: 'var(--glass-ink)',
                fontSize: 'clamp(11px, 0.84vw, 16px)',
                fontWeight: 700,
                border: '2px solid var(--glass-ink)',
                padding: '0.3em 0.75em',
              }}
            >
              {t(`tags.${key}`)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Progress({ count, cursor }) {
  if (count < 2) return null
  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="block"
          style={{
            width: 26,
            height: 2,
            background: i === cursor ? 'var(--glass-ink)' : 'var(--glass-ink-faint)',
            transition: 'background 300ms ease',
          }}
        />
      ))}
    </div>
  )
}
