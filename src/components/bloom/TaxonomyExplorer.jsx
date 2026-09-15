import { forwardRef, useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import {
  CASES,
  CATEGORY_COLORS,
  CATEGORY_KEYS,
  VERSIONS,
  membership,
} from '../../data/bloomTaxonomy.js'

/**
 * The three taxonomy proposals as one live system instead of three posters.
 *
 * Switching version re-flows the same five categories, so the reader watches
 * tags merge and disappear rather than comparing two screenshots from memory.
 * Pointing at a tag lights it up everywhere it lives, which is the one thing
 * the static sheets could only describe: shared tags are what connect the
 * categories.
 */

const EASE = [0.16, 1, 0.3, 1]
const ACCENT = 'var(--accent-bloom)'

export default function TaxonomyExplorer({ b }) {
  const reduce = useReducedMotion()
  const [versionKey, setVersionKey] = useState('v3')
  const [focus, setFocus] = useState(null)

  const version = VERSIONS.find((v) => v.key === versionKey)
  const members = useMemo(() => membership(version), [version])
  const names = b('categories').map((c) => c.name)

  const layoutTransition = reduce ? { duration: 0 } : { duration: 0.45, ease: EASE }

  return (
    <div>
      {/* Version switch — the count is the headline, the name is secondary. */}
      <div
        role="tablist"
        aria-label={b('explorerLabel')}
        className="grid grid-cols-3"
        style={{ borderBottom: '1px solid color-mix(in srgb, var(--fg) 14%, transparent)' }}
      >
        {VERSIONS.map((v) => {
          const on = v.key === versionKey
          return (
            <button
              key={v.key}
              role="tab"
              aria-selected={on}
              type="button"
              onClick={() => {
                setVersionKey(v.key)
                setFocus(null)
              }}
              className="relative flex flex-col items-start gap-1 px-1 pb-4 pt-2 text-left md:px-2"
              style={{ color: on ? 'var(--fg)' : 'var(--fg-muted)', transition: 'color 200ms ease' }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="font-display tabular-nums"
                  style={{ fontSize: 'clamp(28px, 4.2vw, 56px)', fontWeight: 700, lineHeight: 1 }}
                >
                  {v.count}
                </span>
                {v.recommended ? (
                  <span
                    className="hidden font-nav uppercase sm:inline"
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.2em',
                      color: ACCENT,
                      border: `1px solid ${ACCENT}`,
                      padding: '3px 6px',
                    }}
                  >
                    {b('v3Badge')}
                  </span>
                ) : null}
              </span>
              <span
                className="font-nav uppercase"
                style={{ fontSize: 'clamp(9px, 0.9vw, 11px)', letterSpacing: '0.18em', fontWeight: 600 }}
              >
                {b(`${v.key}Title`)}
              </span>
              {on ? (
                <motion.span
                  layoutId="bloom-version-underline"
                  className="absolute -bottom-px left-0 right-0 h-[3px]"
                  style={{ background: ACCENT }}
                  transition={layoutTransition}
                />
              ) : null}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={versionKey}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="mt-6 font-body"
          style={{ color: 'var(--fg-soft)', fontSize: 15, lineHeight: 1.75, maxWidth: '72ch', minHeight: '3.5em' }}
        >
          {b(`${versionKey}Desc`)}
        </motion.p>
      </AnimatePresence>

      <p
        className="mt-6 font-nav"
        style={{ color: 'var(--fg-muted)', fontSize: 12, lineHeight: 1.6, maxWidth: '72ch' }}
      >
        {b('explorerHint')}
      </p>

      <LayoutGroup>
        <div className="mt-8 flex flex-col">
          {CATEGORY_KEYS.map((cat, ci) => {
            const tags = version.tags[cat]
            return (
              <motion.div
                layout="position"
                transition={layoutTransition}
                key={cat}
                className="grid grid-cols-1 gap-3 py-5 md:grid-cols-[180px_1fr] md:gap-8"
                style={{ borderTop: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)' }}
              >
                <div className="flex items-baseline gap-3 md:flex-col md:gap-1">
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="inline-block h-2.5 w-2.5"
                      style={{ background: CATEGORY_COLORS[cat] }}
                    />
                    <span
                      className="font-nav uppercase"
                      style={{ fontSize: 13, letterSpacing: '0.18em', fontWeight: 700, color: 'var(--fg)' }}
                    >
                      {names[ci]}
                    </span>
                  </span>
                  <span className="font-nav tabular-nums" style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
                    {tags.length} {b('explorerTags')}
                  </span>
                </div>

                <motion.ul layout transition={layoutTransition} className="flex flex-wrap gap-2">
                  <AnimatePresence initial={false} mode="popLayout">
                    {tags.map((tag) => (
                      <Chip
                        key={`${cat}:${tag}`}
                        tag={tag}
                        cats={members.get(tag)}
                        focus={focus}
                        setFocus={setFocus}
                        reduce={reduce}
                        layoutTransition={layoutTransition}
                        sharedLabel={b('explorerShared')}
                      />
                    ))}
                  </AnimatePresence>
                </motion.ul>
              </motion.div>
            )
          })}
        </div>
      </LayoutGroup>

      <p className="mt-4 font-nav" style={{ color: 'var(--fg-muted)', fontSize: 11 }}>
        <SharedMark cats={['cuerpo', 'mente']} /> {b('explorerShared')} · {b('explorerLang')}
      </p>
    </div>
  )
}

function SharedMark({ cats }) {
  return (
    <span aria-hidden className="mr-1 inline-flex -space-x-0.5 align-middle">
      {cats.map((c) => (
        <span
          key={c}
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: CATEGORY_COLORS[c], boxShadow: '0 0 0 1px var(--bg)' }}
        />
      ))}
    </span>
  )
}

// forwardRef because popLayout measures exiting chips through their ref.
const Chip = forwardRef(function Chip({ tag, cats = [], focus, setFocus, reduce, layoutTransition, sharedLabel }, ref) {
  const shared = cats.length > 1
  const lit = focus === tag
  const dim = focus !== null && !lit

  return (
    <motion.li
      ref={ref}
      layout
      initial={reduce ? false : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: dim ? 0.3 : 1, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
      transition={{ ...layoutTransition, opacity: { duration: 0.2 } }}
    >
      <button
        type="button"
        onMouseEnter={() => setFocus(tag)}
        onMouseLeave={() => setFocus(null)}
        onFocus={() => setFocus(tag)}
        onBlur={() => setFocus(null)}
        onClick={() => setFocus(lit ? null : tag)}
        title={shared ? sharedLabel : undefined}
        className="flex items-center gap-1.5 font-body"
        style={{
          fontSize: 12.5,
          lineHeight: 1.2,
          padding: '6px 10px',
          color: lit ? 'var(--bg)' : 'var(--fg)',
          background: lit ? ACCENT : shared ? 'color-mix(in srgb, var(--accent-bloom) 9%, transparent)' : 'transparent',
          border: `1px solid ${lit || shared ? ACCENT : 'color-mix(in srgb, var(--fg) 20%, transparent)'}`,
          transition: 'background 180ms ease, color 180ms ease, border-color 180ms ease',
        }}
      >
        {shared ? <SharedMark cats={cats} /> : null}
        {tag}
      </button>
    </motion.li>
  )
})

/**
 * The worked example: three pieces of content, and the tags that let Bloom AI
 * recommend across them. Pointing at a bridge tag lights the pieces it joins.
 */
export function SystemInUse({ b }) {
  const [focus, setFocus] = useState(null)
  const names = b('categories').map((c) => c.name)
  const formats = b('caseFormats')
  const v3 = useMemo(() => membership(VERSIONS[2]), [])

  // A bridge is a tag that more than one of these pieces carries.
  const bridges = useMemo(() => {
    const count = new Map()
    CASES.forEach((c) => c.tags.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)))
    return [...count].filter(([, n]) => n > 1).map(([t]) => t)
  }, [])

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {CASES.map((piece, i) => {
          const joined = focus && piece.tags.includes(focus)
          const cat = piece.category
          return (
            <article
              key={piece.title}
              className="flex flex-col p-5"
              style={{
                background: 'var(--surface-2)',
                border: `1px solid ${joined ? ACCENT : 'color-mix(in srgb, var(--fg) 10%, transparent)'}`,
                opacity: focus && !joined ? 0.45 : 1,
                transition: 'opacity 220ms ease, border-color 220ms ease',
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="inline-block h-2.5 w-2.5" style={{ background: CATEGORY_COLORS[cat] }} />
                  <span className="font-nav uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700 }}>
                    {names[CATEGORY_KEYS.indexOf(cat)]}
                  </span>
                </span>
                <span className="font-nav uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--fg-muted)' }}>
                  {formats[i]}
                </span>
              </div>
              <h4
                className="mt-5 font-display"
                style={{ fontSize: 17, lineHeight: 1.35, fontWeight: 700, color: 'var(--fg)' }}
              >
                “{piece.title}”
              </h4>
              <ul className="mt-5 flex flex-wrap gap-2">
                {piece.tags.map((tag) => {
                  const bridge = bridges.includes(tag)
                  const shared = (v3.get(tag)?.length ?? 0) > 1
                  const lit = focus === tag
                  return (
                    <li key={tag}>
                      <button
                        type="button"
                        disabled={!bridge}
                        onMouseEnter={() => bridge && setFocus(tag)}
                        onMouseLeave={() => setFocus(null)}
                        onFocus={() => bridge && setFocus(tag)}
                        onBlur={() => setFocus(null)}
                        onClick={() => bridge && setFocus(lit ? null : tag)}
                        className="flex items-center gap-1.5 font-body disabled:cursor-default"
                        style={{
                          fontSize: 12,
                          padding: '5px 9px',
                          color: lit ? 'var(--bg)' : 'var(--fg)',
                          background: lit ? ACCENT : shared ? 'color-mix(in srgb, var(--accent-bloom) 9%, transparent)' : 'transparent',
                          border: `1px solid ${lit || shared ? ACCENT : 'color-mix(in srgb, var(--fg) 20%, transparent)'}`,
                          transition: 'background 180ms ease, color 180ms ease',
                        }}
                      >
                        {shared ? <SharedMark cats={v3.get(tag)} /> : null}
                        {tag}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </article>
          )
        })}
      </div>

      {/* The bridges spelled out, so the connection is legible without hover. */}
      <ul className="mt-6 flex flex-col gap-2">
        {bridges.map((tag) => {
          const ends = CASES.filter((c) => c.tags.includes(tag)).map((c) => c.category)
          const lit = focus === tag
          return (
            <li
              key={tag}
              onMouseEnter={() => setFocus(tag)}
              onMouseLeave={() => setFocus(null)}
              className="flex flex-wrap items-center gap-3 px-4 py-3 font-nav"
              style={{
                fontSize: 12,
                border: `1px dashed ${lit ? ACCENT : 'color-mix(in srgb, var(--fg) 18%, transparent)'}`,
                transition: 'border-color 200ms ease',
              }}
            >
              <span className="uppercase" style={{ letterSpacing: '0.18em', color: ACCENT, fontWeight: 700, fontSize: 10 }}>
                {b('caseBridge')}
              </span>
              {ends.map((cat, i) => (
                <span key={cat} className="flex items-center gap-2">
                  {i > 0 ? <span aria-hidden style={{ color: 'var(--fg-muted)' }}>↔</span> : null}
                  <span aria-hidden className="inline-block h-2 w-2" style={{ background: CATEGORY_COLORS[cat] }} />
                  <span className="uppercase" style={{ letterSpacing: '0.14em', fontWeight: 600 }}>
                    {names[CATEGORY_KEYS.indexOf(cat)]}
                  </span>
                </span>
              ))}
              <span className="font-body" style={{ color: 'var(--fg-soft)' }}>
                · {tag}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
