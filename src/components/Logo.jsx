import { useTheme } from '../theme/ThemeProvider.jsx'
import lightLogo from '../assets/identity/LightIcon.png'
import darkLogo from '../assets/identity/DarkIcon.png'

/**
 * Brand mark — swaps automatically with the active theme.
 *  - light theme → LightIcon (drawn in dark color, contrasts on light bg)
 *  - dark theme  → DarkIcon  (drawn in light color, contrasts on dark bg)
 */
export default function Logo({ size = 44, className = '' }) {
  const { theme } = useTheme()
  const src = theme === 'dark' ? darkLogo : lightLogo
  return (
    <img
      src={src}
      alt="juligm4"
      width={size}
      height={size}
      draggable="false"
      className={`block select-none ${className}`}
      style={{ height: size, width: 'auto' }}
    />
  )
}
