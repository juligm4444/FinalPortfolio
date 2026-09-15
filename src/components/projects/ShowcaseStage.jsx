import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../../i18n/LocaleProvider.jsx'
import { useTheme } from '../../theme/ThemeProvider.jsx'
import { FIELD, frame, toPath } from './fluid.js'

/**
 * Background and wordmark in a single SVG, on a single animation loop.
 *
 * The opening is the comp's, frame by frame: crescents curl in over charcoal,
 * flood out into a two-colour wave, PROJECTS surfaces and sinks again, and the
 * wave settles behind the panels. It never stops there — whatever is left of
 * the opening simply keeps flowing, so there is no hand-off from animation to
 * idle state for the eye to catch.
 *
 * They share one element tree because the word is coloured by what is under
 * it: three copies are stacked, one per surface the word can sit on, each
 * clipped to the region it belongs to. Those regions are the very outlines
 * being morphed every frame, so the word changes colour as the floods move
 * through it, not just once they have landed.
 *
 * Paths are written straight to the DOM from the rAF loop rather than through
 * React state — sixty reconciliations a second to change a few `d` strings is
 * work for nothing.
 */

const THEMES = {
  light: {
    ground: ['#383838', '#171C19'], // the charcoal the crescents arrive over
    pale: ['#EDEDE8', '#D3D2CF'],
    pink: ['#FF70AD', '#FF0871'],
    // Each surface takes the ink of the other: pink over pale, pale over pink.
    inkGround: '#EDEDE8',
    inkPale: '#FF3D90',
    inkPink: '#EDEDE8',
  },
  dark: {
    // Frame 74: slate ground, and the pale crescent becomes charcoal.
    ground: ['#49555A', '#383838'],
    pale: ['#2A2F2D', '#141816'],
    pink: ['#FF3D90', '#FF0871'],
    // Same rule, only the colours change.
    inkGround: '#EDEDE8',
    inkPale: '#FF3D90',
    inkPink: '#1A1E1C',
  },
}

export default function ShowcaseStage({ intro, wordVisible }) {
  const { t } = useLocale()
  const { theme } = useTheme()
  const c = THEMES[theme === 'dark' ? 'dark' : 'light']

  // Each outline is computed once per frame and written to every node that
  // needs it. A <use> inside <clipPath> does not reliably resolve a <defs>
  // path in Chrome, so each clip carries its own path element rather than a
  // reference — one computation, several destinations.
  const paleRefs = [useRef(null), useRef(null)]
  const pinkRefs = [useRef(null), useRef(null)]
  const groundRef = useRef(null)
  const introRef = useRef(intro)
  introRef.current = intro

  // The field is cropped to cover the stage, which on a portrait screen cuts
  // away most of its width — and the word with it. The shapes can afford to
  // lose their edges; the word cannot, so it alone is scaled to whatever
  // width actually survives the crop.
  const stageRef = useRef(null)
  const [wordScale, setWordScale] = useState(1)
  useEffect(() => {
    const node = stageRef.current
    if (!node) return
    const measure = () => {
      const { width, height } = node.getBoundingClientRect()
      if (!width || !height) return
      const visible = Math.min(FIELD.w, FIELD.h * (width / height))
      setWordScale(Math.min(1, (visible * 0.9) / 1820))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(node)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    let raf = 0
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()

    const draw = (now) => {
      const f = frame(now - start, introRef.current && !reduce)
      const pale = toPath(f.pale)
      const pink = toPath(f.pink)
      for (const r of paleRefs) r.current?.setAttribute('d', pale)
      for (const r of pinkRefs) r.current?.setAttribute('d', pink)
      groundRef.current?.setAttribute('opacity', f.ground.toFixed(3))
      if (!reduce) raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
    // Deliberately runs once: the timeline is measured from mount, and
    // restarting the loop would restart the opening.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const word = t('projects.title').toUpperCase()
  const textProps = {
    x: FIELD.w / 2,
    y: FIELD.h / 2,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    textLength: 1820,
    lengthAdjust: 'spacingAndGlyphs',
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 700,
    fontSize: 372,
  }

  // Gradients in field coordinates. Bounding-box gradients would re-stretch
  // every frame as the shapes change size, and the colour would crawl.
  const grad = (id, [a, b], x1, y1, x2, y2) => (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
      <stop offset="0" stopColor={a} />
      <stop offset="1" stopColor={b} />
    </linearGradient>
  )

  return (
    <div ref={stageRef} className="absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${FIELD.w} ${FIELD.h}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {grad('fl-ground', c.ground, 0, 0, 0, FIELD.h)}
          {grad('fl-pale', c.pale, 0, 0, FIELD.w, FIELD.h)}
          {grad('fl-pink', c.pink, FIELD.w, 0, FIELD.w * 0.8, FIELD.h)}

          {/* Clipping rather than masking because Chrome would not apply a
              mask to <text> here. */}
          <clipPath id="fl-clip-pink" clipPathUnits="userSpaceOnUse">
            <path ref={pinkRefs[1]} />
          </clipPath>
          <clipPath id="fl-clip-pale" clipPathUnits="userSpaceOnUse">
            <path ref={paleRefs[1]} />
          </clipPath>

          {/* Raised over the darker grounds, as in the comp. */}
          <filter id="fl-lift" x="-8%" y="-20%" width="116%" height="150%">
            <feDropShadow dx="0" dy="14" stdDeviation="9" floodColor="#000" floodOpacity="0.24" />
          </filter>
          {/* Pressed into the pale ground: the shadow falls inside the
              letters, so the word reads as an inlay rather than a sticker. */}
          <filter id="fl-inset" x="-8%" y="-20%" width="116%" height="150%">
            <feComponentTransfer in="SourceAlpha" result="inverse">
              <feFuncA type="table" tableValues="1 0" />
            </feComponentTransfer>
            <feOffset in="inverse" dy="10" result="shifted" />
            <feGaussianBlur in="shifted" stdDeviation="7" result="blurred" />
            <feFlood floodColor="#000" floodOpacity="0.3" />
            <feComposite in2="blurred" operator="in" />
            <feComposite in2="SourceAlpha" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="shadow" />
            </feMerge>
          </filter>
        </defs>

        <rect width={FIELD.w} height={FIELD.h} fill="url(#fl-pink)" />
        <rect ref={groundRef} width={FIELD.w} height={FIELD.h} fill="url(#fl-ground)" />
        <path ref={pinkRefs[0]} fill="url(#fl-pink)" />
        <path ref={paleRefs[0]} fill="url(#fl-pale)" />

        <g
          style={{
            opacity: wordVisible ? 1 : 0,
            transform: `translateY(${wordVisible ? '0%' : '14%'})`,
            transformOrigin: '50% 50%',
            transition:
              'opacity 720ms cubic-bezier(0.22,1,0.36,1), transform 860ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <g
            transform={`translate(${FIELD.w / 2} ${FIELD.h / 2}) scale(${wordScale}) translate(${-FIELD.w / 2} ${-FIELD.h / 2})`}
          >
          {/* Base copy: whatever charcoal is still showing. */}
          <text {...textProps} fill={c.inkGround} filter="url(#fl-lift)">
            {word}
          </text>
          <g clipPath="url(#fl-clip-pink)">
            <text {...textProps} fill={c.inkPink} filter="url(#fl-lift)">
              {word}
            </text>
          </g>
          <g clipPath="url(#fl-clip-pale)">
            <text {...textProps} fill={c.inkPale} filter="url(#fl-inset)">
              {word}
            </text>
          </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
