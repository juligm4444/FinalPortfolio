import { Link } from 'react-router-dom'

/**
 * Hover-aware text link — slight scale-up + colour shift to pink-light.
 * Works with internal `to` (React Router) or external `href`.
 */
export default function TextLink({
  to,
  href,
  external,
  children,
  className = '',
  underline = true,
  fontSize,
  ...rest
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    color: 'var(--fg)',
    fontFamily: '"Space Grotesk", sans-serif',
    fontSize: fontSize ?? 16,
    transformOrigin: 'left center',
    transition:
      'color 220ms cubic-bezier(0.22,1,0.36,1), transform 220ms cubic-bezier(0.22,1,0.36,1)',
    paddingBottom: 4,
    borderBottom: underline ? '1px solid var(--fg)' : 'none',
    cursor: 'pointer',
    textDecoration: 'none',
  }

  const onEnter = (e) => {
    e.currentTarget.style.color = 'var(--pink-light)'
    e.currentTarget.style.transform = 'scale(1.06)'
    if (underline) e.currentTarget.style.borderBottomColor = 'var(--pink-light)'
  }
  const onLeave = (e) => {
    e.currentTarget.style.color = 'var(--fg)'
    e.currentTarget.style.transform = 'scale(1)'
    if (underline) e.currentTarget.style.borderBottomColor = 'var(--fg)'
  }

  if (href) {
    return (
      <a
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
        {children}
      </a>
    )
  }
  return (
    <Link
      to={to}
      className={className}
      style={baseStyle}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      {...rest}
    >
      {children}
    </Link>
  )
}
