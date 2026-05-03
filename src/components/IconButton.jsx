/**
 * Button (or anchor) with a leading SVG icon. Hover lifts + grows + shifts colour.
 * variant: 'primary' (pink fill) | 'outline' (border with fg colour) | 'ghost'
 */
export default function IconButton({
  as,
  href,
  external,
  type = 'button',
  variant = 'primary',
  icon: Icon,
  children,
  size = 'md',
  className = '',
  ...rest
}) {
  const isAnchor = !!href || as === 'a'
  const Tag = isAnchor ? 'a' : 'button'

  const dims =
    size === 'lg'
      ? { padX: 32, padY: 18, font: 18, gap: 12, iconSize: 20 }
      : size === 'sm'
      ? { padX: 18, padY: 10, font: 13, gap: 8, iconSize: 14 }
      : { padX: 22, padY: 14, font: 15, gap: 10, iconSize: 18 }

  const variants = {
    primary: {
      // Pink-dark base → pink-light on hover, with a pink-light outer glow.
      base: { background: '#FF0066', color: '#EDEDE8', border: '2px solid #FF0066' },
      hover: { background: '#FF85B6', color: '#EDEDE8', borderColor: '#FF85B6' },
      hoverShadow: '0 0 0 1px #FF85B6, 0 10px 28px rgba(255, 133, 182, 0.55)',
    },
    outline: {
      base: {
        background: 'transparent',
        color: 'var(--fg)',
        border: '2px solid var(--fg)',
      },
      hover: {
        background: 'var(--fg)',
        color: 'var(--bg)',
        borderColor: 'var(--fg)',
      },
    },
    ghost: {
      base: {
        background: 'transparent',
        color: 'var(--fg)',
        border: '2px solid transparent',
      },
      hover: {
        background: 'transparent',
        color: 'var(--pink-light)',
        borderColor: 'transparent',
      },
    },
  }
  const v = variants[variant] || variants.primary

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: dims.gap,
    padding: `${dims.padY}px ${dims.padX}px`,
    fontFamily: '"Libre Baskerville", serif',
    fontWeight: 700,
    fontSize: dims.font,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    textDecoration: 'none',
    transition:
      'transform 220ms cubic-bezier(0.22,1,0.36,1), background 220ms ease, color 220ms ease, border-color 220ms ease, box-shadow 240ms ease',
    boxShadow: 'none',
    transformOrigin: 'center',
    ...v.base,
  }

  const onEnter = (e) => {
    Object.assign(e.currentTarget.style, v.hover)
    e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)'
    e.currentTarget.style.boxShadow =
      v.hoverShadow ||
      '0 10px 26px color-mix(in srgb, var(--fg) 18%, transparent)'
  }
  const onLeave = (e) => {
    Object.assign(e.currentTarget.style, v.base)
    e.currentTarget.style.transform = 'translateY(0) scale(1)'
    e.currentTarget.style.boxShadow = 'none'
  }

  const iconWrap = Icon ? (
    <span
      className="icon-anim"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        transition: 'transform 220ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <Icon size={dims.iconSize} />
    </span>
  ) : null

  if (isAnchor) {
    return (
      <Tag
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className={className}
        style={baseStyle}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        {...rest}
      >
        {iconWrap}
        <span>{children}</span>
      </Tag>
    )
  }
  return (
    <Tag
      type={type}
      className={className}
      style={baseStyle}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      {...rest}
    >
      {iconWrap}
      <span>{children}</span>
    </Tag>
  )
}
