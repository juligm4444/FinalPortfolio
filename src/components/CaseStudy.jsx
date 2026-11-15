import { motion, useReducedMotion } from 'framer-motion'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import { MohairButton } from './fur/FurButton.jsx'
import Wall from './wall/Wall.jsx'
import { caseStudies } from '../data/projects.js'
import './CaseStudy.css'
import DeviceHint from './DeviceHint.jsx'

/* ACABADO §7 — the case template: Reveal, CaseHero, NextCase and the CaseStudy renderer. */

const EASE = [0.16, 1, 0.3, 1]

export function Reveal({ children, delay = 0, y = 24, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ACABADO §7 — the one header every case uses:
   1. title, one-line summary (no kicker, V4 §F); 2. ficha (role, dates, team, tools — text);
   3. links as the site's slab buttons. `media` is an optional project image,
   shown on a concrete slab (never bleeding with its own background). */
export function CaseHero({ slug, h1, h2, sub, tags, meta = [], tools: toolsProp, links: linksProp, media, mediaAlt = '' }) {
  const { t } = useLocale()
  const study = caseStudies[slug] ?? {}
  const tools = toolsProp ?? study.skills
  const links =
    linksProp ??
    [study.site && { label: t('case.visit'), href: study.site }, study.code && { label: t('case.code'), href: study.code }].filter(Boolean)
  // A field with no content is not shown (ACABADO §7): no empty rows, nothing invented.
  const ficha = [...meta, ...(tools?.length ? [{ label: t('case.tools'), value: tools.join(' · ') }] : [])].filter((f) => f.value && String(f.value).trim())
  return (
    <Wall as="header" seed={`case-${slug}-hero`} className="cs__hero">
      <div className="w-full">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className={media ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <Reveal delay={0.08}>
              <h1
                className="mt-5 font-display"
                style={{
                  color: 'var(--text)',
                  fontSize: 'clamp(38px, 6vw, 84px)',
                  lineHeight: 1.04,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  textWrap: 'balance',
                }}
              >
                {h1}
                {h2 ? (
                  <>
                    <br />
                    {h2}
                  </>
                ) : null}
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 font-body" style={{ color: 'var(--text-muted)', fontSize: 17, lineHeight: 1.7, maxWidth: '58ch' }}>
                {sub}
              </p>
            </Reveal>
            {tags?.length ? (
              <Reveal delay={0.24}>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="font-nav uppercase"
                      style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '5px 10px' }}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>
          {media ? (
            <Reveal delay={0.2} className="lg:col-span-5">
              <div className="concrete flex items-center justify-center p-6" style={{ aspectRatio: '1 / 1' }}>
                <img src={media} alt={mediaAlt} width="480" height="480" decoding="async" draggable="false" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            </Reveal>
          ) : null}
        </div>

        {ficha.length ? (
          <Reveal delay={0.3}>
            <dl className="mt-12 grid grid-cols-1 gap-6 border-t pt-8 sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: 'var(--border)' }}>
              {ficha.map(({ label, value }) => (
                <div key={label}>
                  <dt className="font-nav uppercase" style={{ fontSize: 12, letterSpacing: '0.16em', color: 'var(--text-muted)' }}>
                    {label}
                  </dt>
                  <dd className="mt-2 font-body" style={{ color: 'var(--text)', fontSize: 16, lineHeight: 1.5 }}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}

        {links.length ? (
          <Reveal delay={0.36}>
            <div className="mt-8 flex flex-wrap gap-3">
              {links.map((l) => (
                <MohairButton key={l.label} label={l.label} to={l.to} href={l.to ? undefined : l.href} />
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>
    </Wall>
  )
}

const CASE_ORDER = [
  ['candelaria', 'candelariaBrand'],
  ['candelaria-website', 'candelariaWebsite'],
  ['licorimetro', 'licorimetro'],
  ['sensewave', 'sensewaveProduct'],
  ['umbral', 'umbral'],
  ['bloom', 'bloom'],
]

/* §7.5 — the next case, as a Mohair button (V3 §C.2). */
export function NextCase({ slug }) {
  const { t } = useLocale()
  const i = CASE_ORDER.findIndex(([s]) => s === slug)
  const [nextSlug, key] = CASE_ORDER[(i + 1) % CASE_ORDER.length]
  return (
    <Wall seed={`case-${slug}-next`} className="cs__sec cs__next">
      <Reveal>
        <p className="font-nav uppercase" style={{ fontSize: 12, letterSpacing: '0.22em', color: 'var(--text-muted)' }}>
          {t('case.next')}
        </p>
        <div className="mt-4">
          <MohairButton label={t(`works.${key}.title`)} to={`/projects/${nextSlug}`} />
        </div>
      </Reveal>
    </Wall>
  )
}

/* ---------------------------------------------------------------------------
   The template (ACABADO §7). A case is data:
     hero      kicker, title [h1, h2?], summary, tags, media, meta (the ficha)
     sections  four numbered sections — problem, process, decisions, result — each a
               list of blocks:
       { type:'text',  kicker?, heading?, sub?, paras[] }   heading → two columns
       { type:'quote', text }
       { type:'stat',  value, label }
       { type:'figure', src, alt, caption? }                image on a slab
       { type:'node',  node }                               interactive piece on a slab
       { type:'tags',  items[] }
       { type:'split', left: block, right: block }
   then the link to the next case. Order, type, colour and spacing are fixed here. */
const SECTION_KEYS = ['problem', 'process', 'decisions', 'result']

function Bullets({ items, cols }) {
  return (
    <ul className={`cs__bullets ${cols === 2 ? 'cs__bullets--2' : ''}`}>
      {items.map((x, i) => (
        <li key={i}>{x}</li>
      ))}
    </ul>
  )
}

function Block({ b }) {
  if (!b) return null
  switch (b.type) {
    case 'text': {
      const body = (
        <div className="cs__stack">
          {b.sub ? <h3 className="cs__h3">{b.sub}</h3> : null}
          {b.paras?.filter(Boolean).map((p, i) => (
            <p key={i} className="cs__p">
              {p}
            </p>
          ))}
          {b.hint ? (
            <p className="cs__p">
              <DeviceHint pointer={b.hint.pointer} touch={b.hint.touch} />
            </p>
          ) : null}
        </div>
      )
      // V4 §F: no small label over a heading. Where a block's only title was that label,
      // it becomes the block's heading, so no content is lost.
      const heading = b.heading ?? b.kicker
      if (heading && (b.stacked || !b.heading))
        return (
          <Reveal className="cs__stack">
            <h2 className="cs__h">{heading}</h2>
            {body}
          </Reveal>
        )
      if (!heading) return <Reveal>{body}</Reveal>
      return (
        <Reveal className="cs__text cs__text--cols">
          <div>
            <h2 className="cs__h">{heading}</h2>
          </div>
          {body}
        </Reveal>
      )
    }
    case 'quote':
      return (
        <Reveal>
          <blockquote className="cs__quote">{b.text}</blockquote>
        </Reveal>
      )
    case 'stat':
      return (
        <Reveal className="cs__stat">
          <p className="cs__stat-v">{b.value}</p>
          <p className="cs__stat-l">{b.label}</p>
        </Reveal>
      )
    case 'figure':
      return (
        <Reveal>
          <figure className="cs__fig cs__slab">
            <img
              src={b.src}
              alt={b.alt ?? ''}
              loading="lazy"
              decoding="async"
              draggable="false"
              className={b.ratio ? (b.cover ? 'cs__img--cover' : 'cs__img--fit') : undefined}
              style={b.ratio ? { aspectRatio: b.ratio } : undefined}
            />
            {b.caption ? <figcaption>{b.caption}</figcaption> : null}
          </figure>
        </Reveal>
      )
    case 'node':
      return (
        <Reveal>
          <div className="cs__slab">{b.node}</div>
        </Reveal>
      )
    case 'tags':
      return (
        <Reveal>
          <ul className="cs__tags">
            {b.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Reveal>
      )
    case 'video':
      return (
        <Reveal>
          <div className="cs__slab">
            <video className="cs__video" autoPlay muted loop playsInline aria-hidden="true" style={b.ratio ? { aspectRatio: b.ratio } : undefined}>
              <source src={b.src} type="video/mp4" />
            </video>
          </div>
        </Reveal>
      )
    case 'cards':
      return (
        <Reveal>
          <ul className={`cs__cards cs__cards--${b.cols ?? 3}`}>
            {b.items.map((it, i) => (
              <li key={i}>
                {it.img ? <img className="cs__card-img" src={it.img} alt="" loading="lazy" decoding="async" /> : null}
                {it.symbol ? <span className="cs__step-n">{it.symbol}</span> : null}
                {it.kicker ? <p className="cs__kicker">{it.kicker}</p> : null}
                <h3 className="cs__h3">{it.title}</h3>
                {it.desc ?? it.body ? <p className="cs__p">{it.desc ?? it.body}</p> : null}
              </li>
            ))}
          </ul>
        </Reveal>
      )
    case 'rows':
      return (
        <Reveal>
          <ol className="cs__rows">
            {b.items.map((it) => (
              <li key={it.phase}>
                <span className={`cs__row-n ${it.highlight ? 'is-on' : ''}`}>{it.phase}</span>
                <div className="cs__stack">
                  <h3 className="cs__h3">{it.title}</h3>
                  <p className="cs__p">{it.desc ?? it.intro}</p>
                  {it.bullets ? <Bullets items={it.bullets} /> : null}
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      )
    case 'swatches':
      return (
        <Reveal>
          <div className="cs__slab">
            {b.title ? <p className="cs__kicker">{b.title}</p> : null}
            <ul className="cs__swatches">
              {b.items.map((c) => (
                <li key={c.name}>
                  <span className="cs__sw" style={{ background: c.hex }} />
                  <span>{c.name}</span>
                  {c.label ? <span>{c.label}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )
    case 'typespec':
      return (
        <Reveal>
          <div className="cs__slab">
            <p className="cs__kicker">{b.label}</p>
            <p className="cs__type-d">{b.display}</p>
            <p className="cs__type-s">{b.sub}</p>
            <dl className="cs__roles">
              {b.roles.map((r) => (
                <div key={r.role}>
                  <dt className="cs__kicker">{r.role}</dt>
                  <dd>{r.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      )
    case 'bullets':
      return (
        <Reveal>
          <div className={b.card ? 'cs__slab' : undefined}>
            <Bullets items={b.items} cols={b.cols} />
          </div>
        </Reveal>
      )
    case 'table':
      return (
        <Reveal>
          <div className="cs__table-wrap">
            <table className="cs__table">
              <thead>
                <tr>
                  {b.header.map((h, i) => (
                    <th key={i} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((row, i) => (
                  <tr key={i} className={b.accent && row[0] === b.accent ? 'is-on' : undefined}>
                    {row.map((cell, k) => (
                      <td key={k} data-label={b.header[k]}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      )
    case 'spec':
      return (
        <Reveal>
          <div className="cs__spec">
            {b.title ? <p className="cs__kicker">{b.title}</p> : null}
            <ul>
              {b.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            {b.note ? <p className="cs__spec-note">{b.note}</p> : null}
          </div>
        </Reveal>
      )
    case 'steps':
      return (
        <Reveal>
          {b.title ? <p className="cs__kicker">{b.title}</p> : null}
          <ol className="cs__steps">
            {b.items.map((it) => (
              <li key={it.n}>
                <span className="cs__step-n">{it.n}</span>
                <h3 className="cs__h3">{it.title}</h3>
                <p className="cs__p">{it.desc}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      )
    case 'grid':
      return (
        <div className={`cs__grid cs__grid--${b.cols ?? 2}`}>
          {b.items.map((it, i) => (
            <Block key={i} b={it} />
          ))}
        </div>
      )
    case 'stack':
      return (
        <div className="cs__blocks">
          {b.items.map((it, i) => (
            <Block key={i} b={it} />
          ))}
        </div>
      )
    case 'split':
      return (
        <div className={`cs__split ${b.even ? 'cs__split--even' : ''}`}>
          <Block b={b.left} />
          <Block b={b.right} />
        </div>
      )
    default:
      return null
  }
}

export default function CaseStudy({ slug, hero, sections }) {
  const { t } = useLocale()
  const [h1, h2] = hero.title
  return (
    <>
      <CaseHero slug={slug} h1={h1} h2={h2} sub={hero.summary} tags={hero.tags} meta={hero.meta} tools={hero.tools} links={hero.links} media={hero.media} mediaAlt={hero.mediaAlt} />
      {sections.map((sec, i) => {
        const { key, blocks } = Array.isArray(sec) ? { key: SECTION_KEYS[i], blocks: sec } : sec
        return (
          <Wall key={key} seed={`case-${slug}-${key}`} className="cs__sec" aria-labelledby={`cs-${key}`}>
            {/* V4 §F, §K: no small label over the section; its name stays for assistive tech */}
            <h2 id={`cs-${key}`} className="sr-only">
              {String(i + 1).padStart(2, '0')} {t(`case.sections.${key}`)}
            </h2>
            <div className="cs__blocks">
              {blocks.map((b, j) => (
                <Block key={j} b={b} />
              ))}
            </div>
          </Wall>
        )
      })}
      <NextCase slug={slug} />
    </>
  )
}
