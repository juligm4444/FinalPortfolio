import FurButton from './fur/FurButton.jsx'

/* V4 §D.1 — type 1, Velour Bolster: "See projects", "All projects" and the nav. */
export default function VelourBolster({ label, to, href, onClick, lang, width, height = 64, pressed = false, className = '' }) {
  return <FurButton kind="velour" label={label} to={to} href={href} onClick={onClick} lang={lang} width={width} height={height} pressed={pressed} className={className} />
}
