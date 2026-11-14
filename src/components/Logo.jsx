import logo from '../assets/identity/Logo.png'

/** Brand mark. One ink (--concrete-900), no hexagon (ACABADO §4). */
export default function Logo({ size = 44, className = '' }) {
  return (
    <img
      src={logo}
      alt="juligm4"
      width={size}
      height={size}
      draggable="false"
      className={`block select-none ${className}`}
      style={{ height: size, width: 'auto' }}
    />
  )
}
