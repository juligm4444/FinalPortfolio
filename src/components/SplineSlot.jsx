/**
 * SplineSlot — placeholder for a Spline 3D scene.
 *
 * Usage when you have your scene URL:
 *   <SplineSlot src="https://prod.spline.design/<your-scene>/scene.splinecode" />
 *
 * If you want the official React component, install:
 *   npm i @splinetool/react-spline @splinetool/runtime
 * and replace the iframe with <Spline scene={src} />.
 */
export default function SplineSlot({
  src,
  width = '100%',
  height = '100%',
  ratio,
  label = '3D scene',
  className = '',
  style = {},
}) {
  const containerStyle = {
    width,
    height,
    aspectRatio: ratio ?? 'auto',
    background:
      'linear-gradient(135deg, var(--surface-2) 0%, var(--surface-strong) 100%)',
    border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
    overflow: 'hidden',
    position: 'relative',
    ...style,
  }

  if (src) {
    return (
      <div className={className} style={containerStyle}>
        <iframe
          src={src}
          title={label}
          loading="lazy"
          allow="autoplay; fullscreen"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        />
      </div>
    )
  }

  // placeholder — visible neo-brutalist slot until the user wires the scene
  return (
    <div className={className} style={containerStyle} role="img" aria-label={label}>
      <Crosshatch />
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ color: 'var(--fg-muted)', padding: 16 }}
      >
        <div
          aria-hidden
          style={{
            width: 36,
            height: 36,
            background: '#FF0871',
            transform: 'rotate(45deg)',
            marginBottom: 14,
          }}
        />
        <span
          className="font-nav uppercase"
          style={{ fontSize: 11, letterSpacing: '0.22em' }}
        >
          {label}
        </span>
      </div>
    </div>
  )
}

function Crosshatch() {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.18, color: 'var(--fg)' }}
    >
      <defs>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="14" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hatch)" />
    </svg>
  )
}
