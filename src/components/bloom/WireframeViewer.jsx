import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import home from '../../assets/images/bloom/wireframes/home.webp'
import articleFull from '../../assets/images/bloom/wireframes/article-full.webp'
import programFull from '../../assets/images/bloom/wireframes/program-full.webp'
import iaLanding from '../../assets/images/bloom/wireframes/ia-landing.webp'
import communityFull from '../../assets/images/bloom/wireframes/community-full.webp'
import article from '../../assets/images/bloom/wireframes/article.webp'
import articleMenu from '../../assets/images/bloom/wireframes/article-menu.webp'
import articleHighlight from '../../assets/images/bloom/wireframes/article-highlight.webp'
import articleIa from '../../assets/images/bloom/wireframes/article-ia.webp'
import articleExplore from '../../assets/images/bloom/wireframes/article-explore.webp'

/**
 * The wireframes shown the way they were meant to be read: inside a phone.
 *
 * Full-page frames run to several thousand pixels, and printed flat on a
 * desktop page they become a thin grey strip nobody can read. In a device
 * frame at real proportions the page scrolls itself, and the reader can grab
 * it and scroll by hand at any point.
 */

const ACCENT = 'var(--case-accent)'
const FRAME_W = 390

// Heights in design pixels, so the scroll length can be stated honestly.
const SCREENS = {
  home: { src: home, h: 7328 },
  article: { src: articleFull, h: 2547 },
  program: { src: programFull, h: 3487 },
  ia: { src: iaLanding, h: 2980 },
  community: { src: communityFull, h: 2753 },
}

const FLOW = [article, articleMenu, articleHighlight, articleIa, articleExplore]

// Design pixels per second of auto-scroll: slow enough to read headings.
const SPEED = 70
const RESUME_MS = 2600

export default function WireframeViewer({ b }) {
  const screens = b('wfScreens')
  const [active, setActive] = useState(screens[0].key)
  const current = screens.find((s) => s.key === active)

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="order-2 lg:order-1 lg:col-span-5">
        <div role="tablist" aria-label={b('s5')} className="flex flex-wrap gap-2">
          {screens.map((s) => {
            const on = s.key === active
            return (
              <button
                key={s.key}
                role="tab"
                type="button"
                aria-selected={on}
                onClick={() => setActive(s.key)}
                className="font-nav uppercase"
                style={{
                  fontSize: 12,
                  letterSpacing: '0.16em',
                  fontWeight: 600,
                  padding: '8px 12px',
                  color: on ? 'var(--bg)' : 'var(--text)',
                  background: on ? ACCENT : 'transparent',
                  border: `1px solid ${on ? ACCENT : 'color-mix(in srgb, var(--text) 20%, transparent)'}`,
                  transition: 'background 180ms ease, color 180ms ease, border-color 180ms ease',
                }}
              >
                {s.name}
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-8"
          >
            <h3
              className="font-display"
              style={{ fontSize: 'clamp(24px, 2.6vw, 34px)', fontWeight: 700, lineHeight: 1.15, color: 'var(--text)' }}
            >
              {current.name}
            </h3>
            <p
              className="mt-4 font-body"
              style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.75, maxWidth: '44ch' }}
            >
              {current.desc}
            </p>
            <p
              className="mt-5 font-nav tabular-nums"
              style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: '0.08em' }}
            >
              {FRAME_W} × {SCREENS[active].h.toLocaleString('es-CO')} px
            </p>
          </motion.div>
        </AnimatePresence>

        <p className="mt-8 font-nav" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
          {b('wfViewerHint')}
        </p>
      </div>

      <div className="order-1 flex justify-center lg:order-2 lg:col-span-7">
        <Phone key={active} src={SCREENS[active].src} alt={current.name} />
      </div>
    </div>
  )
}

function Phone({ src, alt }) {
  const reduce = useReducedMotion()
  const scrollerRef = useRef(null)
  const pausedUntil = useRef(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = scrollerRef.current
    if (!node) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(node)
    return () => io.disconnect()
  }, [])

  // Auto-scroll, yielding to the reader: any touch, wheel or drag pauses it,
  // and it picks up again a moment after they let go. At the bottom it rests,
  // then returns to the top.
  useEffect(() => {
    const node = scrollerRef.current
    if (!node || reduce || !visible) return
    let raf = 0
    let last = performance.now()
    let pos = node.scrollTop

    const tick = (now) => {
      const dt = Math.min(now - last, 64)
      last = now
      const max = node.scrollHeight - node.clientHeight
      if (now >= pausedUntil.current && max > 0) {
        if (Math.abs(node.scrollTop - pos) > 2) pos = node.scrollTop // reader moved it
        const scale = node.clientWidth / FRAME_W
        pos += (SPEED * scale * dt) / 1000
        if (pos >= max) {
          pos = 0
          pausedUntil.current = now + 1800
          node.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          node.scrollTop = pos
        }
      } else {
        pos = node.scrollTop
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce, visible])

  const hold = () => {
    pausedUntil.current = performance.now() + RESUME_MS
  }

  return (
    <div
      className="relative w-full"
      style={{
        maxWidth: 'clamp(250px, 26vw, 340px)',
        padding: 10,
        borderRadius: 44,
        background: 'color-mix(in srgb, var(--text) 92%, transparent)',
        boxShadow: '0 30px 80px -30px rgba(0,0,0,0.45)',
      }}
    >
      <div
        ref={scrollerRef}
        onWheel={hold}
        onTouchStart={hold}
        onPointerDown={hold}
        onMouseEnter={hold}
        onMouseMove={hold}
        tabIndex={0}
        aria-label={alt}
        className="bloom-phone-scroll overflow-y-auto"
        style={{ aspectRatio: '390 / 844', borderRadius: 34, background: 'var(--case-screen)', overscrollBehavior: 'contain' }}
      >
        <img src={src} alt={alt} loading="lazy" decoding="async" draggable="false" className="block w-full" />
      </div>
      <style>{`
        .bloom-phone-scroll { scrollbar-width: none; }
        .bloom-phone-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}

/** One flow, screen by screen: small phones in a row, numbered. */
export function WireframeFlow({ b }) {
  const steps = b('wfFlow')
  return (
    <ol className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
      {FLOW.map((src, i) => (
        <li key={src} className="w-[62vw] max-w-[260px] shrink-0 snap-start lg:w-auto lg:max-w-none">
          <div
            className="overflow-hidden"
            style={{
              aspectRatio: '390 / 844',
              borderRadius: 18,
              border: '1px solid color-mix(in srgb, var(--text) 14%, transparent)',
              background: 'var(--case-screen)',
            }}
          >
            <img src={src} alt={steps[i]} loading="lazy" decoding="async" draggable="false" className="block h-full w-full object-cover object-top" />
          </div>
          <p className="mt-3 flex gap-2 font-body" style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--text-muted)' }}>
            <span className="font-nav tabular-nums" style={{ color: ACCENT, fontWeight: 700 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {steps[i]}
          </p>
        </li>
      ))}
    </ol>
  )
}
