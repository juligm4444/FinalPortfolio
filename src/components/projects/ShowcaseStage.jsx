import { useEffect, useRef } from 'react'
import { useLocale } from '../../i18n/LocaleProvider.jsx'
import { useTheme } from '../../theme/ThemeProvider.jsx'
import { FLUIDS, blobPath, easeOutQuint } from './fluid.js'

/**
 * Background and wordmark in a single SVG, on a single animation loop.
 *
 * They share one element tree because the word is coloured by what is under
 * it: three copies are stacked, one per surface the word can sit on, each
 * clipped to the region it belongs to. Those regions are the very outlines
 * deforming sixty times a second, so the geometry has to be computed in one
 * place and handed to both the fills and the clips — otherwise the colour
 * break drifts away from the edge it is supposed to follow.
 *
 * Paths are written straight to the DOM from the rAF loop rather than through
 * React state — sixty reconciliations a second to change two `d` strings is
 * work for nothing.
 */

const FIELD = { w: 1920, h: 1100 }
const ARRIVAL_MS = 2200

const THEMES = {
  light: {
    field: ['#FF70AD', '#FF0871'], // the pink the two masses meet over
    pale: ['#EDEDE8', '#D3D2CF'],
    dark: ['#383838', '#171C19'],
    // One ink per surface. The pale mass is the bright one here, so that is
    // the only place the word goes dark.
    inkField: '#EDEDE8',
    inkPale: '#0C0D0D',
    inkDarkMass: '#EDEDE8',
  },
  dark: {
    field: ['#FF3D90', '#FF0871'],
    pale: ['#49555A', '#383838'],
    dark: ['#171C19', '#0B0E0D'],
    // Same rule, inverted inputs: in dark the pink is the brightest surface
    // and both masses are darker than it, so the pink is where the word goes
    // dark. Only the colours change; the behaviour is identical.
    inkField: '#0C0D0D',
    inkPale: '#EDEDE8',
    inkDarkMass: '#EDEDE8',
  },
}

export default function ShowcaseStage({ phase, wordVisible }) {
  const { t } = useLocale()
  const { theme } = useTheme()
  const c = THEMES[theme === 'dark' ? 'dark' : 'light']

  // Each outline is computed once per frame and written to every node that
  // needs it. A <use> inside <clipPath> does not reliably resolve a <defs>
  // path in Chrome, so each clip carries its own path element rather than a
  // reference — one computation, several destinations.
  const paleRef = useRef(null)
  const darkRef = useRef(null)
  const clipPaleRef = useRef(null)
  const clipDarkRef = useRef(null)
  const startRef = useRef(null)
  // Read by the loop without restarting it — the arrival should not jump if
  // the phase changes mid-flight.
  const arrivingRef = useRef(phase === 'intro' || phase === 'fill')

  useEffect(() => {
    arrivingRef.current = phase === 'intro' || phase === 'fill'
  }, [phase])

  useEffect(() => {
    let raf = 0
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const draw = (now) => {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      const t = elapsed / 1000

      // 0 while parked off-canvas, 1 once fully arrived.
      const k = arrivingRef.current
        ? easeOutQuint(Math.min(elapsed / ARRIVAL_MS, 1))
        : 1

      for (const [key, refs] of [
        ['pale', [paleRef, clipPaleRef]],
        ['dark', [darkRef, clipDarkRef]],
      ]) {
        const f = FLUIDS[key]
        const cx = f.from.cx + (f.rest.cx - f.from.cx) * k
        const cy = f.from.cy + (f.rest.cy - f.from.cy) * k
        const d = blobPath(cx, cy, f.rx, f.ry, t, f.harms)
        for (const ref of refs) ref.current?.setAttribute('d', d)
      }

      if (!reduce) raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
    // Deliberately runs once: the loop reads phase through a ref so it is
    // never torn down and restarted mid-arrival.
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

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${FIELD.w} ${FIELD.h}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="fl-field" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.field[0]} />
            <stop offset="1" stopColor={c.field[1]} />
          </linearGradient>
          <linearGradient id="fl-pale" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor={c.pale[0]} />
            <stop offset="1" stopColor={c.pale[1]} />
          </linearGradient>
          <linearGradient id="fl-dark" x1="0.9" y1="0" x2="0.1" y2="1">
            <stop offset="0" stopColor={c.dark[0]} />
            <stop offset="1" stopColor={c.dark[1]} />
          </linearGradient>

          {/* The outlines live here with no fill of their own, so each use
              site can supply its own paint. */}
          <path id="fl-pale-path" ref={paleRef} />
          <path id="fl-dark-path" ref={darkRef} />

          {/* One clip per mass. Clipping rather than masking because Chrome
              would not apply a mask to <text> here. */}
          <clipPath id="fl-clip-pale" clipPathUnits="userSpaceOnUse">
            <path ref={clipPaleRef} />
          </clipPath>
          <clipPath id="fl-clip-dark" clipPathUnits="userSpaceOnUse">
            <path ref={clipDarkRef} />
          </clipPath>

          <filter id="fl-wordshadow" x="-8%" y="-20%" width="116%" height="150%">
            <feDropShadow dx="0" dy="14" stdDeviation="9" floodColor="#000" floodOpacity="0.22" />
          </filter>
        </defs>

        <rect width={FIELD.w} height={FIELD.h} fill="url(#fl-field)" />

        {/* The two masses, painted. Same outlines the clips use, so the
            word's colour break can never drift from the edge it follows. */}
        <use href="#fl-dark-path" fill="url(#fl-dark)" />
        <use href="#fl-pale-path" fill="url(#fl-pale)" />

        <g
          style={{
            opacity: wordVisible ? 1 : 0,
            transform: `translateY(${wordVisible ? '0%' : '14%'})`,
            transformOrigin: '50% 50%',
            transition:
              'opacity 720ms cubic-bezier(0.22,1,0.36,1), transform 860ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Base copy: the colour the word takes over the pink field. */}
          <text {...textProps} fill={c.inkField} filter="url(#fl-wordshadow)">
            {word}
          </text>
          <g clipPath="url(#fl-clip-dark)">
            <text {...textProps} fill={c.inkDarkMass}>
              {word}
            </text>
          </g>
          <g clipPath="url(#fl-clip-pale)">
            <text {...textProps} fill={c.inkPale}>
              {word}
            </text>
          </g>
        </g>
      </svg>
    </div>
  )
}
