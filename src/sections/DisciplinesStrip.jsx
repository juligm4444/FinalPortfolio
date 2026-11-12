
/**
 * Full-width marquee strip between Hero and Bio.
 * Two rows scrolling in opposite directions — disciplines on top,
 * values on bottom.
 */

const DISCIPLINES = [
  'UX Design',
  'Frontend Development',
  'Mobile Apps',
  'Design Systems',
  'Product Thinking',
  'Motion Design',
  'Visual Identity',
  'OCR & Computer Vision',
  'Human-Centered Design',
  'Full-Stack',
]

const VALUES = [
  'Structure',
  'Clarity',
  'Precision',
  'Craft',
  'Systems Thinking',
  'Aesthetics',
  'Intentionality',
  'Accessibility',
  'Curiosity',
  'Resilience',
]

// Duplicate items so the marquee loops without gaps
const TRACK_A = [...DISCIPLINES, ...DISCIPLINES]
const TRACK_B = [...VALUES, ...VALUES]

export default function DisciplinesStrip() {
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        borderTop: '1px solid color-mix(in srgb, var(--fg) 8%, transparent)',
        borderBottom: '1px solid color-mix(in srgb, var(--fg) 8%, transparent)',
        paddingTop: 14,
        paddingBottom: 14,
      }}
    >
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-left  { animation: marquee-left  28s linear infinite; }
        .marquee-right { animation: marquee-right 32s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .marquee-left, .marquee-right { animation: none; }
        }
      `}</style>

      {/* Row A — left */}
      <div style={{ display: 'flex', overflow: 'hidden', marginBottom: 10 }}>
        <div
          className="marquee-left"
          style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', willChange: 'transform' }}
        >
          {TRACK_A.map((item, i) => (
            <MarqueeItem key={i} text={item} accent={i % 5 === 0} />
          ))}
        </div>
      </div>

      {/* Row B — right */}
      <div style={{ display: 'flex', overflow: 'hidden' }}>
        <div
          className="marquee-right"
          style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', willChange: 'transform' }}
        >
          {TRACK_B.map((item, i) => (
            <MarqueeItem key={i} text={item} accent={i % 7 === 0} dot />
          ))}
        </div>
      </div>
    </div>
  )
}

function MarqueeItem({ text, accent = false, dot = false }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 20px',
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: 12,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        fontWeight: accent ? 700 : 400,
        color: accent ? '#FF0871' : 'var(--fg-muted)',
      }}
    >
      {text}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: dot ? 3 : 4,
          height: dot ? 3 : 4,
          borderRadius: '50%',
          background: accent ? '#FF0871' : 'color-mix(in srgb, var(--fg) 30%, transparent)',
          flexShrink: 0,
        }}
      />
    </span>
  )
}
