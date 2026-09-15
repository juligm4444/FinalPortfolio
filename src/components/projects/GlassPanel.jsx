import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/**
 * One of the three columns: a sheet of frosted glass over the drifting
 * crescents, cycling through the works that belong to its category.
 *
 * Behaviour, in priority order:
 *   - It advances on its own. Neighbouring panels travel in opposite
 *     directions (extremes down, centre up) so the three never move as a block.
 *   - Pointing at it stops the cycle, fogs the glass further and grows the
 *     sheet slightly. Stopping on hover is the whole point: you cannot read a
 *     card that is about to leave.
 *   - Scrolling over it steps through the works by hand. The wheel is only
 *     captured while there is somewhere to go in that direction; at either end
 *     the page scrolls normally, so the section can never trap the reader.
 */

const AUTO_INTERVAL = 5200 // ms per work
const WHEEL_COOLDOWN = 420 // ms between manual steps

export default function GlassPanel({
  category,
  works,
  direction,
  index,
  active,
  paused,
  revealed,
  contentIn,
  onActivate,
  onRelease,
  t,
}) {
  const [cursor, setCursor] = useState(0)
  const [travel, setTravel] = useState(direction) // which way the card exits
  const panelRef = useRef(null)
  const lastStepRef = useRef(0)
  const count = works.length

  const step = useCallback(
    (delta) => {
      setTravel(delta > 0 ? direction : -direction)
      setCursor((i) => (((i + delta) % count) + count) % count)
    },
    [count, direction],
  )

  // Autoplay. Held while the pointer is on this panel, while the intro is
  // still running, or when the tab is hidden.
  useEffect(() => {
    if (paused || active || !contentIn || count < 2) return
    const id = setInterval(() => {
      setTravel(direction)
      setCursor((i) => (i + 1) % count)
    }, AUTO_INTERVAL)
    return () => clearInterval(id)
  }, [paused, active, contentIn, count, direction])

  // Native listener so preventDefault actually applies; React attaches wheel
  // handlers passively.
  useEffect(() => {
    const node = panelRef.current
    if (!node || !active) return

    const onWheel = (e) => {
      const dir = Math.sign(e.deltaY)
      if (dir === 0) return
      const next = cursor + dir
      if (next < 0 || next > count - 1) return // let the page have it

      e.preventDefault()
      const now = performance.now()
      if (now - lastStepRef.current < WHEEL_COOLDOWN) return
      lastStepRef.current = now
      step(dir)
    }

    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [active, cursor, count, step])

  const work = works[cursor]
  if (!work) return null

  return (
    <section
      ref={panelRef}
      onMouseEnter={onActivate}
      onMouseLeave={onRelease}
      aria-label={t(`projects.category.${category}`)}
      className="glass-panel group relative flex-1 overflow-hidden"
      style={{
        // Sheets rise in sequence rather than all at once.
        opacity: revealed ? 1 : 0,
        transform: `translateY(${revealed ? 0 : 40}px) scale(${active ? 1.02 : 1})`,
        transitionProperty: 'opacity, transform',
        transitionDuration: '760ms, 760ms',
        transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
        transitionDelay: revealed ? `${index * 130}ms` : '0ms',
        zIndex: active ? 3 : 2,
      }}
    >
      {/* The glass itself. Fogging on hover is a backdrop-filter change, not a
          colour change, so whatever drifts underneath stays visible — just
          less so. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: active ? 'var(--glass-panel-hover)' : 'var(--glass-panel)',
          backdropFilter: `blur(${active ? 30 : 16}px) saturate(${active ? 1.35 : 1.12})`,
          WebkitBackdropFilter: `blur(${active ? 30 : 16}px) saturate(${active ? 1.35 : 1.12})`,
          // The seam runs between panels, so it follows the stacking axis:
          // sides when they sit in a row, top and bottom when they stack.
          border: '0 solid var(--glass-panel-edge)',
          borderTopWidth: 1,
          borderBottomWidth: 1,
          transition: 'background 420ms ease, backdrop-filter 420ms ease',
        }}
      />

      <Link
        to={work.href}
        className="relative flex h-full flex-col overflow-hidden px-4 py-3 lg:px-8 lg:pb-10 lg:pt-8"
      >
        {/* The comp's banner heading only fits once the panel is a tall
            column. On a short wide band it would eat the row it shares with
            the work, so there the category moves into the caption instead. */}
        <h2
          className="hidden text-center font-nav uppercase lg:block"
          style={{
            color: 'var(--glass-ink)',
            fontWeight: 700,
            fontSize: 'clamp(28px, 2.6vw, 56px)',
            letterSpacing: '0.01em',
            lineHeight: 1.05,
          }}
        >
          {t(`projects.category.${category}`)}
        </h2>

        {/* Keyed on the work so every change replays the entry, and the exit
            direction follows the panel's travel. Row on narrow screens, where
            a band is wide and short; column once it becomes a tall column. */}
        <div
          key={work.id}
          className="flex min-h-0 flex-1 flex-row items-center gap-4 lg:flex-col lg:items-stretch lg:gap-0"
          style={{
            animation: contentIn
              ? `panel-in-${travel > 0 ? 'down' : 'up'} 620ms cubic-bezier(0.22,1,0.36,1) both`
              : 'none',
            opacity: contentIn ? undefined : 0,
          }}
        >
          <WorkMedia work={work} t={t} />
          <WorkCaption work={work} category={category} t={t} />
        </div>

        <div className="hidden lg:block">
          <Progress count={count} cursor={cursor} active={active} />
        </div>
      </Link>

      <style>{`
        @keyframes panel-in-down {
          from { opacity: 0; transform: translateY(-28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes panel-in-up {
          from { opacity: 0; transform: translateY(28px); }
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

function WorkMedia({ work, t }) {
  return (
    <div className="flex h-full w-[38%] shrink-0 items-center justify-center lg:h-auto lg:min-h-0 lg:w-auto lg:flex-1 lg:py-8">
      {work.image ? (
        <img
          src={work.image}
          alt={t(work.titleI18n)}
          draggable="false"
          // Not lazy: there are seven of these and they are the page. Deferring
          // them leaves an empty panel exactly when the intro hands over.
          decoding="async"
          className="max-h-full max-w-full"
          style={{
            objectFit: work.fit === 'cover' ? 'cover' : 'contain',
            // A screenshot needs an edge to sit on; a cut-out render does not.
            boxShadow: work.fit === 'cover' ? '0 18px 40px rgba(0,0,0,0.28)' : 'none',
          }}
        />
      ) : (
        // Stands in until the real artwork arrives. Deliberately typographic
        // rather than an empty box or a generic icon.
        <span
          aria-hidden
          className="select-none text-center font-display"
          style={{
            color: 'var(--glass-ink-faint)',
            fontWeight: 700,
            fontSize: 'clamp(56px, 7vw, 132px)',
            lineHeight: 0.9,
          }}
        >
          {t(work.titleI18n).slice(0, 2)}
        </span>
      )}
    </div>
  )
}

function WorkCaption({ work, category, t }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center lg:flex-none lg:justify-start">
      <p
        className="font-nav uppercase"
        style={{
          color: 'var(--glass-ink-soft)',
          fontSize: 'clamp(9px, 0.7vw, 12px)',
          letterSpacing: '0.24em',
          fontWeight: 700,
        }}
      >
        {/* The category rides along here only where the banner heading is
            hidden, so it is never stated twice. */}
        <span className="lg:hidden">{t(`projects.category.${category}`)} · </span>
        {t(work.kickerI18n)}
      </p>

      <h3
        className="mt-1 font-display lg:mt-2"
        style={{
          color: 'var(--glass-ink)',
          fontSize: 'clamp(19px, 2.1vw, 44px)',
          lineHeight: 1.08,
          fontWeight: 700,
        }}
      >
        {t(work.titleI18n)}
      </h3>

      {/* Clamped on narrow screens: a band is a third of a phone and the
          description must not push the tags into the next panel. */}
      <p
        className="mt-1.5 font-nav [-webkit-box-orient:vertical] [display:-webkit-box] [-webkit-line-clamp:2] overflow-hidden lg:mt-3 lg:block lg:overflow-visible"
        style={{
          color: 'var(--glass-ink)',
          fontSize: 'clamp(11px, 0.95vw, 18px)',
          lineHeight: 1.4,
          fontWeight: 700,
        }}
      >
        {t(work.descI18n)}
      </p>

      <ul className="mt-2 flex flex-wrap gap-1.5 lg:mt-4 lg:gap-2">
        {work.tagKeys.map((key, i) => (
          <li
            key={key}
            // Two tags is all a band has room for; the column shows them all.
            className={i > 1 ? 'hidden lg:block' : undefined}
          >
            <span
              className="block font-nav"
              style={{
                color: 'var(--glass-ink)',
                fontSize: 'clamp(10px, 0.8vw, 15px)',
                fontWeight: 700,
                border: '2px solid var(--glass-ink)',
                padding: '4px 9px',
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

/** Which work of how many, and whether the cycle is currently held. */
function Progress({ count, cursor, active }) {
  if (count < 2) return null
  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="block"
          style={{
            width: 28,
            height: 2,
            background: i === cursor ? 'var(--glass-ink)' : 'var(--glass-ink-faint)',
            opacity: active && i === cursor ? 1 : 0.85,
            transition: 'background 300ms ease',
          }}
        />
      ))}
    </div>
  )
}
