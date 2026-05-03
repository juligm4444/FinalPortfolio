import { Fragment } from 'react'

/**
 * Render a string with `<<word>>` segments highlighted in pink-dark + bold weight.
 *
 * Why a custom marker (not Markdown / HTML)? Because translations live as plain
 * strings — markers stay readable and translator-friendly while we keep full
 * control over the visual treatment per occurrence.
 */
const RE = /<<([^>]+)>>/g

export default function Highlight({ text, color = '#FF0066', weight = 700 }) {
  if (typeof text !== 'string' || !text.includes('<<')) return text

  const out = []
  let last = 0
  let m
  let i = 0
  RE.lastIndex = 0
  while ((m = RE.exec(text))) {
    if (m.index > last) out.push(<Fragment key={`p${i++}`}>{text.slice(last, m.index)}</Fragment>)
    out.push(
      <strong
        key={`h${i++}`}
        style={{ color, fontWeight: weight }}
      >
        {m[1]}
      </strong>
    )
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(<Fragment key={`t${i++}`}>{text.slice(last)}</Fragment>)
  return <>{out}</>
}
