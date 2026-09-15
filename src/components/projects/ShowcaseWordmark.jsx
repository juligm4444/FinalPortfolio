import { useLocale } from '../../i18n/LocaleProvider.jsx'
import { useTheme } from '../../theme/ThemeProvider.jsx'
import { SWEEP_WORD } from './ShowcaseBackground.jsx'

/**
 * PROJECTS / PROYECTOS, drawn twice.
 *
 * The comp sets the word in whichever colour the shape underneath is not: a
 * light grey over the pink field, brand pink over the pale crescent. The two
 * copies are identical except for fill and clip — the second is clipped to
 * the crescent path, so the colour break follows the shape's edge exactly
 * instead of being faked with a gradient.
 *
 * Only the copy sitting on pink carries the drop shadow. The pink-on-pale
 * copy does not: it reads as an inlay, and a shadow would lift it off a
 * surface it is supposed to be part of.
 *
 * SVG rather than DOM text because clipping live text to an arbitrary path is
 * exactly what SVG does, and it keeps the word selectable-free decoration
 * without a second font download.
 */

const FIELD = { w: 1920, h: 1100 }

const INK = {
  light: { onField: '#D9D9D9', onShape: '#FF3D90' },
  // Over the dark theme's slate crescent the pink still reads; over pink the
  // grey is lifted to the paper cream so it does not go muddy.
  dark: { onField: '#EDEDE8', onShape: '#FF3D90' },
}

export default function ShowcaseWordmark({ visible }) {
  const { t } = useLocale()
  const { theme } = useTheme()
  const ink = INK[theme === 'dark' ? 'dark' : 'light']
  const word = t('projects.title').toUpperCase()

  const textProps = {
    x: FIELD.w / 2,
    y: FIELD.h / 2,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    textLength: 1870,
    lengthAdjust: 'spacingAndGlyphs',
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 700,
    fontSize: 382.543,
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
      style={{
        opacity: visible ? 1 : 0,
        // Rises on the way in, sinks back out — the same easing both ways so
        // the surfacing and the submerging feel like one gesture reversed.
        transform: `translateY(${visible ? 0 : 18}%)`,
        transition:
          'opacity 780ms cubic-bezier(0.22,1,0.36,1), transform 900ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${FIELD.w} ${FIELD.h}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Same path and offset the background paints, so the colour break
              lands exactly on the sweep's edge. */}
          <clipPath id="sc-word-clip">
            <path d={SWEEP_WORD.d} transform={`translate(${SWEEP_WORD.dx} ${SWEEP_WORD.dy})`} />
          </clipPath>
          <filter id="sc-word-shadow" x="-10%" y="-10%" width="120%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="8" floodColor="#000" floodOpacity="0.25" />
          </filter>
        </defs>

        <text {...textProps} fill={ink.onField} filter="url(#sc-word-shadow)">
          {word}
        </text>

        <g clipPath="url(#sc-word-clip)">
          <text {...textProps} fill={ink.onShape}>
            {word}
          </text>
        </g>
      </svg>
    </div>
  )
}
