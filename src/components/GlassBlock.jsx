/**
 * GlassBlock — translucent panel for important Roboto-Mono blocks of text.
 * The hexagonal background still reads through, but the surface gives the
 * paragraph enough opacity for comfortable reading.
 *
 * Style is theme-aware via CSS vars (`--glass-bg`, `--glass-border`).
 */
export default function GlassBlock({
  children,
  className = '',
  padding = '28px 32px',
  style = {},
}) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(14px) saturate(140%)',
        WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        border: '1px solid var(--glass-border)',
        padding,
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
