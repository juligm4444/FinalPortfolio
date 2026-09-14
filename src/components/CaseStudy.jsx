import { motion, useReducedMotion } from 'framer-motion'

/**
 * Shared scaffolding for case-study pages.
 *
 * Unlike the Sensewave page, which ships its own palette because the brand it
 * documents *is* a palette, these primitives run entirely on the global theme
 * tokens and take a single `accent` per project. That is what keeps a new case
 * study correct in both themes without re-deriving a colour system each time.
 */

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

export function CaseSection({ children, surface = false, className = '' }) {
  return (
    <section
      className={`px-4 py-20 md:px-8 md:py-28 ${className}`}
      style={{ background: surface ? 'var(--surface)' : 'transparent' }}
    >
      <div className="mx-auto w-full max-w-[1200px]">{children}</div>
    </section>
  )
}

export function SectionTag({ number, label, accent }) {
  return (
    <Reveal>
      <div className="mb-12 flex items-center gap-5 md:mb-16">
        <span
          className="font-body uppercase"
          style={{ fontSize: 10, letterSpacing: '0.28em', color: accent }}
        >
          {String(number).padStart(2, '0')}
        </span>
        <span
          aria-hidden
          className="h-px flex-1"
          style={{ background: `color-mix(in srgb, ${accent} 30%, transparent)` }}
        />
        <span
          className="font-body uppercase"
          style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--fg-muted)' }}
        >
          {label}
        </span>
      </div>
    </Reveal>
  )
}

export function CaseHero({ kicker, h1, h2, sub, tags, accent, meta }) {
  return (
    <header className="px-4 pb-16 pt-24 md:px-8 md:pb-24 md:pt-32">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <p
            className="font-body uppercase"
            style={{ fontSize: 11, letterSpacing: '0.26em', color: accent }}
          >
            {kicker}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1
            className="mt-6 font-display"
            style={{
              color: 'var(--fg)',
              fontSize: 'clamp(38px, 6.4vw, 92px)',
              lineHeight: 1.02,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            {h1}
            <br />
            <span style={{ color: accent }}>{h2}</span>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p
            className="mt-8 font-body"
            style={{ color: 'var(--fg-soft)', fontSize: 17, lineHeight: 1.7, maxWidth: '58ch' }}
          >
            {sub}
          </p>
        </Reveal>

        {tags?.length ? (
          <Reveal delay={0.24}>
            <ul className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="font-nav uppercase"
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    color: 'var(--fg-muted)',
                    border: '1px solid color-mix(in srgb, var(--fg) 18%, transparent)',
                    padding: '5px 10px',
                  }}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {meta?.length ? (
          <Reveal delay={0.32}>
            <dl className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              {meta.map(({ label, value }) => (
                <div key={label}>
                  <dt
                    className="font-nav uppercase"
                    style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--fg-muted)' }}
                  >
                    {label}
                  </dt>
                  <dd
                    className="mt-2 font-body"
                    style={{ color: 'var(--fg)', fontSize: 14, lineHeight: 1.5 }}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}
      </div>
    </header>
  )
}

/**
 * `ratio` crops the image into a fixed box — right when figures sit in a grid
 * and need to line up. Omit it and the image keeps its own proportions, which
 * is what tall spec artwork needs: forcing a ratio onto it just letterboxes
 * the thing you wanted people to read.
 */
export function Figure({ src, alt, caption, ratio, contain = true, className = '' }) {
  return (
    <Reveal className={className}>
      <figure>
        <div
          className="overflow-hidden"
          style={{
            aspectRatio: ratio,
            background: 'color-mix(in srgb, var(--fg) 4%, transparent)',
            border: '1px solid color-mix(in srgb, var(--fg) 8%, transparent)',
          }}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            draggable="false"
            className={ratio ? 'h-full w-full' : 'block w-full'}
            style={ratio ? { objectFit: contain ? 'contain' : 'cover' } : undefined}
          />
        </div>
        {caption ? (
          <figcaption
            className="mt-3 font-body"
            style={{ color: 'var(--fg-muted)', fontSize: 12, lineHeight: 1.5 }}
          >
            {caption}
          </figcaption>
        ) : null}
      </figure>
    </Reveal>
  )
}

export function Prose({ children, className = '' }) {
  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {children.filter(Boolean).map((p, i) => (
        <p
          key={i}
          className="font-body"
          style={{ color: 'var(--fg-soft)', fontSize: 15, lineHeight: 1.75, maxWidth: '62ch' }}
        >
          {p}
        </p>
      ))}
    </div>
  )
}

export function Heading({ children, accent }) {
  return (
    <h2
      className="font-display"
      style={{
        color: accent ?? 'var(--fg)',
        fontSize: 'clamp(26px, 3.2vw, 42px)',
        lineHeight: 1.12,
        fontWeight: 700,
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </h2>
  )
}

export function SubHeading({ children }) {
  return (
    <h3
      className="font-display"
      style={{ color: 'var(--fg)', fontSize: 19, lineHeight: 1.3, fontWeight: 700 }}
    >
      {children}
    </h3>
  )
}

export function PullQuote({ children, accent }) {
  return (
    <Reveal>
      <blockquote
        className="font-display"
        style={{
          color: 'var(--fg)',
          fontSize: 'clamp(22px, 2.8vw, 34px)',
          lineHeight: 1.3,
          fontWeight: 700,
          borderLeft: `3px solid ${accent}`,
          paddingLeft: 'clamp(20px, 3vw, 36px)',
          maxWidth: '24ch',
        }}
      >
        {children}
      </blockquote>
    </Reveal>
  )
}

/** Renders a `\n`-separated spec block as a definition-style list. */
export function SpecList({ title, body, note }) {
  return (
    <Reveal>
      <div
        className="p-6"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
        }}
      >
        {title ? (
          <p
            className="mb-4 font-nav uppercase"
            style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--fg-muted)' }}
          >
            {title}
          </p>
        ) : null}
        <ul className="flex flex-col gap-2">
          {body.split('\n').map((line) => (
            <li
              key={line}
              className="font-body"
              style={{ color: 'var(--fg-soft)', fontSize: 13, lineHeight: 1.6 }}
            >
              {line}
            </li>
          ))}
        </ul>
        {note ? (
          <p
            className="mt-4 font-body"
            style={{ color: 'var(--fg-muted)', fontSize: 12, lineHeight: 1.6 }}
          >
            {note}
          </p>
        ) : null}
      </div>
    </Reveal>
  )
}

export function CaseFooter({ label, quote, paragraphs, tags, accent }) {
  return (
    <CaseSection surface>
      <Reveal>
        <p
          className="font-nav uppercase"
          style={{ fontSize: 10, letterSpacing: '0.24em', color: accent }}
        >
          {label}
        </p>
      </Reveal>
      <div className="mt-8">
        <PullQuote accent={accent}>{quote}</PullQuote>
      </div>
      <Reveal>
        <Prose className="mt-10">{paragraphs}</Prose>
      </Reveal>
      <Reveal>
        <ul className="mt-10 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="font-nav uppercase"
              style={{
                fontSize: 10,
                letterSpacing: '0.18em',
                color: 'var(--fg-muted)',
                border: `1px solid color-mix(in srgb, ${accent} 35%, transparent)`,
                padding: '5px 10px',
              }}
            >
              {tag}
            </li>
          ))}
        </ul>
      </Reveal>
    </CaseSection>
  )
}
