import { useEffect, useId, useRef } from 'react'
import LocaleLink from '../LocaleLink.jsx'
import { usePlush } from './PlushProvider.jsx'
import './PlushTile.css'

/* REDESIGN §5/§6/§10 — a stone tile with its logo engraved in SVG. At rest it is
   pure HTML/CSS. On hover or keyboard focus the shared canvas moves into it and
   moss grows over the stone (`mode="moss"`, the dock) or grass grows round the
   slab (`mode="grass"`, the Herbario). Without WebGL the CSS moss below is the
   whole effect. The control is a real <a> or <button> in every state.
   `children` is the engraved glyph: an inline SVG (or a short text for a slab). */
export default function PlushTile({ label, children, mode = 'moss', size = 48, seed = 0, to, href, onClick, lang, className = '' }) {
  const host = usePlush()
  const id = useId()
  const elRef = useRef(null)
  const slotRef = useRef(null)

  useEffect(() => host.register(id, { el: elRef.current, slot: slotRef.current, mode, seed }), [host, id, mode, seed])

  const handlers = {
    onPointerEnter: (e) => {
      // A finger "hovers" for as long as it is down; a mouse for as long as it is over.
      if (e.pointerType !== 'touch') host.setHover(id)
    },
    onPointerDown: (e) => {
      if (e.pointerType === 'touch') host.setHover(id)
    },
    onPointerMove: (e) => host.move(id, e.clientX, e.clientY),
    onPointerLeave: () => host.setHover(null),
    onPointerUp: (e) => {
      if (e.pointerType === 'touch') host.setHover(null)
    },
    onPointerCancel: () => host.setHover(null),
    onFocus: (e) => {
      if (e.currentTarget.matches(':focus-visible')) host.setFocus(id)
    },
    onBlur: () => host.setFocus(null),
    onClick,
  }
  const common = {
    ref: elRef,
    className: `plush-tile ${className}`,
    'data-mode': mode,
    'aria-label': label,
    title: label,
    lang,
    style: { '--pt-size': `${size}px` },
    ...handlers,
  }
  const body = (
    <>
      <span className="plush-tile__stone" aria-hidden="true">
        {children}
      </span>
      <span ref={slotRef} className="plush-tile__slot" aria-hidden="true" />
    </>
  )

  if (to) return <LocaleLink to={to} {...common}>{body}</LocaleLink>
  if (href)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...common}>
        {body}
      </a>
    )
  return (
    <button type="button" {...common}>
      {body}
    </button>
  )
}
