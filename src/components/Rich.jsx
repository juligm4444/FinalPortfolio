/* V4 §H.2 — emphasis marker for copy in translations.js: **phrase** renders as a
   bold phrase in --bloom-ink. Nothing else is parsed. */
export default function Rich({ text }) {
  const parts = String(text).split(/\*\*(.+?)\*\*/g)
  return parts.map((p, i) => (i % 2 ? <strong key={i} className="em">{p}</strong> : p))
}
