import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import LocaleLink from '../components/LocaleLink.jsx'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import { usePlushHover } from '../components/fur/plushHover.js'
import { rng } from '../components/wall/rng.js'
import works, { GROUPS } from '../data/projects.js'

/* V4 §I — the Projects page as one scene: the concrete lattice on the grassy
   slope of the background, continued. A full-width irregular grid of concrete
   ribs (seeded column widths, spans and a slight skew per cell); each cell is a
   plot. A plot with a case study: short grass, the project image in colour, its
   name and one line printed on the rib; on hover or focus the plot turns plush
   and a flower opens at a corner; click opens the case. A project without a
   case: bare soil and a single sprout, "in progress"/"coming soon", not a link.
   Some cells stay empty (grass only). Filters wilt the plots that do not match
   back to bare concrete in place: nothing moves. Columns follow the width (2 on a
   phone, up to 6 at 2560), the irregularity stays. */
const FLOWER_TONES = ['pink', 'yellow', 'violet', 'white']

function Blades({ seed, n = 70, h = 30 }) {
  const r = rng(`blades:${seed}`)
  return (
    <svg className="plot__blades" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const x = (i / n) * 100 + r() * 2
        const hh = h * (0.4 + r() * 0.6)
        const lean = (r() - 0.5) * 5
        return <path key={i} className={`blade blade--${r() < 0.5 ? 'b' : 'c'}`} d={`M${(x - 0.45).toFixed(1)} 40 Q${(x + lean * 0.4).toFixed(1)} ${(40 - hh * 0.6).toFixed(1)} ${(x + lean).toFixed(1)} ${(40 - hh).toFixed(1)} Q${(x + lean * 0.3).toFixed(1)} ${(40 - hh * 0.5).toFixed(1)} ${(x + 0.45).toFixed(1)} 40Z`} />
      })}
    </svg>
  )
}

function Flower({ tone, corner }) {
  return (
    <svg className={`plot__flower plot__flower--${corner} flower flower--${tone}`} viewBox="-12 -12 24 24" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-5.5" rx="3.4" ry="5.6" transform={`rotate(${a})`} />
      ))}
      <circle r="2.4" className="flower__eye" />
    </svg>
  )
}

function Plot({ work, seed, dim }) {
  const { t } = useLocale()
  const title = t(`works.${work.id}.title`)
  const img = work.media.specimen ?? work.media.screenshot ?? work.media.logo ?? null
  const status = work.status === 'in-progress' || work.status === 'soon' ? t(`projects.status.${work.status}`) : ''
  const line = [t(`works.${work.id}.kicker`), status].filter(Boolean).join(' · ')
  const r = rng(`plot:${work.id}`)
  const flower = { tone: FLOWER_TONES[Math.floor(r() * 4)], corner: ['tl', 'tr', 'bl', 'br'][Math.floor(r() * 4)] }
  const { hit, live, leaving, handlers, onFrame } = usePlushHover({ src: img, name: title, seed, disabled: !work.href || dim })

  if (!work.href)
    // no case study: bare soil, one sprout, its status; not a link
    return (
      <div className="plot__inner plot__inner--soon" data-project-card="">
        <span className="plot__ground plot__ground--soil" aria-hidden="true">
          <svg className="plot__sprout" viewBox="0 0 40 60">
            <path d="M20 58 C20 44 19 34 21 22" className="sprout-stem" />
            <path d="M21 30 C12 28 8 20 9 14 C17 16 21 22 21 30Z" className="leaf leaf--b" />
            <path d="M21 24 C28 20 33 13 32 7 C25 9 21 16 21 24Z" className="leaf leaf--a" />
          </svg>
        </span>
        <span className="plot__sill">
          <span className="plot__name">{title}</span>
          <span className="plot__line">{line}</span>
        </span>
      </div>
    )

  return (
    <LocaleLink
      to={work.href}
      className="plot__inner plot__inner--case"
      data-project-card=""
      data-card-link=""
      aria-label={`${t('projects.openCase')}: ${title}`}
      tabIndex={dim ? -1 : undefined}
      aria-hidden={dim || undefined}
      onFocus={handlers.onFocus}
      onBlur={handlers.onBlur}
    >
      <span ref={hit} className="plot__ground" onPointerEnter={handlers.onPointerEnter} onPointerLeave={handlers.onPointerLeave}>
        <Blades seed={work.id} />
        {img ? <img className="plot__img" src={img} alt="" loading="lazy" decoding="async" /> : null}
        <Flower {...flower} />
        {live && (
          <span className={`plot__fur ${leaving ? 'plot__fur--leaving' : ''}`} aria-hidden="true">
            <live.Canvas {...live.props} hitRef={hit} onFrame={onFrame} />
          </span>
        )}
      </span>
      <span className="plot__sill">
        <span className="plot__name">{title}</span>
        <span className="plot__line">{line}</span>
      </span>
    </LocaleLink>
  )
}

/** The cells, in a fixed seeded order: every work plus empty plots of grass. */
function useCells() {
  return useMemo(() => {
    const r = rng('lattice-cells')
    const bigIds = new Set(GROUPS.map((g) => works.find((w) => w.group === g && w.href)?.id))
    const projects = works.map((w) => ({ kind: 'work', work: w, cs: bigIds.has(w.id) ? 2 : 1, rs: bigIds.has(w.id) && r() < 0.6 ? 2 : 1 }))
    const empties = Array.from({ length: 4 }, (_, i) => ({ kind: 'empty', id: `e${i}`, cs: r() < 0.35 ? 2 : 1, rs: 1 }))
    const cells = [...projects]
    empties.forEach((e) => cells.splice(1 + Math.floor(r() * cells.length), 0, e))
    return cells.map((c) => ({ ...c, sk: (r() - 0.5) * 2.2, rot: (r() - 0.5) * 1.2 }))
  }, [])
}

export default function Lattice({ filter }) {
  const cells = useCells()
  const box = useRef(null)
  const [cols, setCols] = useState(null)

  // columns from the width: 2 on a phone … 6 at 2560; uneven spans from a seed
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const fit = () => setCols(Math.max(2, Math.min(6, Math.round(el.clientWidth / 290))))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const template = useMemo(() => {
    if (!cols) return undefined
    const r = rng(`lattice-cols-${cols}`)
    return Array.from({ length: cols }, () => `${(0.75 + r() * 0.6).toFixed(2)}fr`).join(' ')
  }, [cols])

  return (
    <ul ref={box} className="lattice concrete" style={template ? { gridTemplateColumns: template } : undefined}>
      {cells.map((c, i) => {
        const span = { gridColumn: `span ${Math.min(c.cs, cols ?? 2)}`, gridRow: `span ${c.rs}`, '--sk': `${c.sk.toFixed(2)}deg`, '--rot': `${c.rot.toFixed(2)}deg` }
        if (c.kind === 'empty')
          return (
            <li key={c.id} className="plot plot--empty" style={span} aria-hidden="true">
              <span className="plot__ground">
                <Blades seed={c.id} n={80} h={34} />
              </span>
            </li>
          )
        const dim = filter !== 'all' && c.work.group !== filter
        return (
          <li key={c.work.id} className="plot" style={span} data-dim={dim || undefined}>
            <Plot work={c.work} seed={i * 3} dim={dim} />
          </li>
        )
      })}
    </ul>
  )
}
