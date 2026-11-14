import logo from '../assets/identity/LightIcon.webp'

/** Brand mark. Single palette: the dark-ink icon on the mist ground. */
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
