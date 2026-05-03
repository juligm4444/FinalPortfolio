import SplineSlot from './SplineSlot.jsx'

/**
 * MediaSlot — drop in either an image (src) or a Spline scene (spline) URL.
 * If neither is provided, it shows a brutalist placeholder.
 */
export default function MediaSlot({
  src,
  spline,
  alt = '',
  caption,
  ratio = '4 / 5',
  className = '',
  style = {},
}) {
  const wrapStyle = {
    width: '100%',
    aspectRatio: ratio,
    background: 'var(--surface-2)',
    border: '1px solid color-mix(in srgb, var(--fg) 12%, transparent)',
    overflow: 'hidden',
    position: 'relative',
    ...style,
  }

  return (
    <figure className={className} style={{ display: 'block' }}>
      <div style={wrapStyle}>
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full"
            style={{ objectFit: 'cover', display: 'block' }}
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        ) : (
          <SplineSlot src={spline} label={alt} />
        )}
        {/* corner accent */}
        <span
          aria-hidden
          className="absolute"
          style={{
            right: 0,
            bottom: 0,
            width: 28,
            height: 28,
            background: '#FF0871',
          }}
        />
      </div>
      {caption && (
        <figcaption
          className="mt-3 font-nav uppercase"
          style={{
            color: 'var(--fg-muted)',
            fontSize: 11,
            letterSpacing: '0.22em',
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
