import FurButton from './fur/FurButton.jsx'

/* V3 §C.1 — primary button: Velour Bolster. One per visible screen at most. */
export default function VelourBolster({ label, to, href, onClick, lang, width, height = 64, className = '' }) {
  return <FurButton kind="velour" label={label} to={to} href={href} onClick={onClick} lang={lang} width={width} height={height} className={className} />
}
