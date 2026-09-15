import { useTheme } from '../../theme/ThemeProvider.jsx'

/**
 * The ground the showcase sits on.
 *
 * The comp uses two different silhouettes, not one. During the opening, two
 * crescents swing in from opposite edges over a charcoal field. Once they
 * land, the charcoal is gone and the frame belongs to a single sweeping form
 * over flat brand pink — a fuller shape than either crescent, which is why
 * they cross-fade rather than simply stopping.
 *
 * All geometry is lifted verbatim from the Figma. The crescents are authored
 * in a 1920 × 1100 box; the sweeps in their own slightly larger boxes, so
 * each is nested under the offset the comp gives it rather than re-fitted by
 * hand.
 *
 * Colours come in two sets. In light the pale form is paper cream; in dark it
 * is slate, because cream against a dark page reads as a hole rather than a
 * shape. The pink barely moves between them — it is the brand, and it should
 * stay recognisably itself.
 */

// Frame 71 — the two crescents that open the sequence.
const CRESCENT_A =
  'M-0.500061 4C917.428 45.3865 2258.5 289 1194.5 894C2232.5 58 62.7034 132.038 -0.500061 1101.5V4Z'
const CRESCENT_B =
  'M1919.89 1091.5C1001.96 1050.11 -339.111 806.5 724.889 201.5C-313.111 1037.5 1856.69 963.462 1919.89 -6V1091.5Z'

// Frame 70 — the pale sweep behind the wordmark. The word is clipped to this,
// so it has to be the same path the comp masks with.
export const SWEEP_WORD = {
  d: 'M3.35232 6.53405L345.352 6.53384C345.352 6.53384 2610.78 -8.49517 1923.35 7.03384C1235.92 22.5629 648.101 1077.15 407.352 860.181C166.604 643.21 -28.1474 1175.04 3.35271 1110.54L3.35232 6.53405Z',
  dx: -3.35,
  dy: -7.53,
}

// Frame 72 — the settled sweep the panels sit over.
export const SWEEP_FINAL = {
  d: 'M4.27833 6.53405L346.279 6.53384C346.279 6.53384 2611.71 -8.49517 1924.28 7.03384C1236.85 22.5629 1714.78 1535.03 907.279 690.534C99.7789 -153.966 -27.2214 1175.04 4.27872 1110.54L4.27833 6.53405Z',
  dx: -4.28,
  dy: -7.53,
}

const THEMES = {
  light: {
    ground: ['#383838', '#171C19'],
    pale: ['#EDEDE8', '#D3D2CF'],
    pink: ['#FF70AD', '#FF0871'],
  },
  dark: {
    ground: ['#383838', '#171C19'],
    pale: ['#49555A', '#383838'],
    pink: ['#FF3D90', '#FF0871'],
  },
}

export default function ShowcaseBackground({ phase = 'settled' }) {
  const { theme } = useTheme()
  const c = THEMES[theme === 'dark' ? 'dark' : 'light']

  const parked = phase === 'intro'
  const opening = phase === 'intro' || phase === 'fill'
  // The word stage uses its own sweep so the wordmark's clip lines up exactly.
  const sweep = phase === 'word' ? SWEEP_WORD : SWEEP_FINAL

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1920 1100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="sc-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.ground[0]} />
            <stop offset="1" stopColor={c.ground[1]} />
          </linearGradient>
          <linearGradient id="sc-pink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.pink[0]} />
            <stop offset="1" stopColor={c.pink[1]} />
          </linearGradient>
          <linearGradient id="sc-pink-diag" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.pink[0]} />
            <stop offset="1" stopColor={c.pink[1]} />
          </linearGradient>
          <linearGradient id="sc-pale" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c.pale[0]} />
            <stop offset="1" stopColor={c.pale[1]} />
          </linearGradient>
        </defs>

        {/* Flat pink is the floor of the settled state. It comes up under the
            crescents during the fill so the charcoal has something to give
            way to. */}
        <rect
          width="1920"
          height="1100"
          fill="url(#sc-pink)"
          style={{
            opacity: parked ? 0 : 1,
            transition: 'opacity 900ms cubic-bezier(0.65,0,0.35,1)',
          }}
        />

        <rect
          width="1920"
          height="1100"
          fill="url(#sc-ground)"
          style={{
            opacity: opening ? 1 : 0,
            transition: 'opacity 900ms cubic-bezier(0.65,0,0.35,1)',
          }}
        />

        {/* Opening crescents. They exist only while the charcoal does. */}
        <g
          style={{
            opacity: opening ? 1 : 0,
            transition: 'opacity 700ms ease 120ms',
          }}
        >
          <g
            style={{
              transformOrigin: '960px 550px',
              transform: parked ? 'translateX(-46%) rotate(-12deg)' : 'none',
              transition: 'transform 1250ms cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <path d={CRESCENT_A} fill="url(#sc-pale)" />
          </g>
          <g
            style={{
              transformOrigin: '960px 550px',
              transform: parked ? 'translateX(46%) rotate(12deg)' : 'none',
              transition: 'transform 1250ms cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <path d={CRESCENT_B} fill="url(#sc-pink-diag)" />
          </g>
        </g>

        {/* The settled sweep. Drifts forever once the panels are up — slowly
            enough to notice only if you watch for it. */}
        <g
          className={phase === 'settled' ? 'sc-drift' : undefined}
          style={{
            transformOrigin: '960px 550px',
            opacity: opening ? 0 : 1,
            transition: 'opacity 900ms cubic-bezier(0.65,0,0.35,1)',
          }}
        >
          <g transform={`translate(${sweep.dx} ${sweep.dy})`}>
            <path d={sweep.d} fill="url(#sc-pale)" />
          </g>
        </g>
      </svg>

      <style>{`
        @keyframes sc-drift {
          0%   { transform: rotate(0deg)    scale(1);    }
          35%  { transform: rotate(1.4deg)  scale(1.05); }
          70%  { transform: rotate(-1.1deg) scale(1.02); }
          100% { transform: rotate(0deg)    scale(1);    }
        }
        .sc-drift { animation: sc-drift 31s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .sc-drift { animation: none; }
        }
      `}</style>
    </div>
  )
}

export { CRESCENT_A, CRESCENT_B, THEMES }
