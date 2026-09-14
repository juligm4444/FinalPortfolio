import { useLocale } from '../../i18n/LocaleProvider.jsx'
import {
  CaseFooter,
  CaseHero,
  CaseSection,
  Figure,
  Heading,
  Prose,
  PullQuote,
  Reveal,
  SectionTag,
  SubHeading,
} from '../../components/CaseStudy.jsx'

import v1 from '../../assets/images/bloom/v1.webp'
import v2 from '../../assets/images/bloom/v2.webp'
import v3 from '../../assets/images/bloom/v3.webp'
import systemInUse from '../../assets/images/bloom/system-in-use.webp'

// Theme-aware — see --accent-bloom in index.css.
const ACCENT = 'var(--accent-bloom)'

/** The three proposals, paired with the artefact that argues each one. */
const VERSIONS = [
  { key: 'v1', image: v1 },
  { key: 'v2', image: v2 },
  { key: 'v3', image: v3, recommended: true },
]

export default function Bloom() {
  const { t } = useLocale()
  const b = (k) => t(`bloom.${k}`)

  return (
    <>
      <CaseHero
        accent={ACCENT}
        kicker={b('heroKicker')}
        h1={b('heroH1')}
        h2={b('heroH2')}
        sub={b('heroSub')}
        tags={b('heroTags')}
        meta={[
          { label: b('metaRole'), value: b('role') },
          { label: b('metaClient'), value: b('client') },
          { label: b('metaTeam'), value: b('collaboration') },
        ]}
      />

      {/* 01 — THE BRIEF */}
      <CaseSection>
        <SectionTag number={1} label={b('s1')} accent={ACCENT} />
        <Reveal>
          <Prose>{[b('briefP1'), b('briefP2'), b('briefP3')]}</Prose>
        </Reveal>
      </CaseSection>

      {/* 02 — THE PROBLEM */}
      <CaseSection surface>
        <SectionTag number={2} label={b('s2')} accent={ACCENT} />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <PullQuote accent={ACCENT}>{b('problemQuote')}</PullQuote>
          </div>
          <Reveal className="lg:col-span-7">
            <Prose>{[b('problemP1'), b('problemP2')]}</Prose>
          </Reveal>
        </div>
      </CaseSection>

      {/* 03 — THREE VERSIONS */}
      <CaseSection>
        <SectionTag number={3} label={b('s3')} accent={ACCENT} />

        <Reveal>
          <p
            className="font-body"
            style={{ color: 'var(--fg-soft)', fontSize: 15, lineHeight: 1.75, maxWidth: '72ch' }}
          >
            {b('versionsIntro')}
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-14">
          {VERSIONS.map(({ key, image, recommended }, i) => (
            <div
              key={key}
              className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14"
            >
              <div className="lg:col-span-4">
                <Reveal delay={i * 0.05}>
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-display"
                      style={{
                        color: recommended ? ACCENT : 'var(--fg)',
                        fontSize: 'clamp(30px,3.4vw,44px)',
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      {b(`${key}Count`).split(' ')[0]}
                    </span>
                    <span
                      className="font-nav uppercase"
                      style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--fg-muted)' }}
                    >
                      tags
                    </span>
                    {recommended ? (
                      <span
                        className="ml-1 font-nav uppercase"
                        style={{
                          fontSize: 9,
                          letterSpacing: '0.2em',
                          color: ACCENT,
                          border: `1px solid ${ACCENT}`,
                          padding: '3px 7px',
                        }}
                      >
                        {b('v3Badge')}
                      </span>
                    ) : null}
                  </div>

                  <h3
                    className="mt-4 font-display"
                    style={{ color: 'var(--fg)', fontSize: 19, fontWeight: 700, lineHeight: 1.3 }}
                  >
                    {b(`${key}Title`)}
                  </h3>
                  <p
                    className="mt-3 font-body"
                    style={{ color: 'var(--fg-soft)', fontSize: 14, lineHeight: 1.7 }}
                  >
                    {b(`${key}Desc`)}
                  </p>
                </Reveal>
              </div>

              {/* No forced ratio: these are tall specification sheets and
                  the whole point is that the tag list stays readable. */}
              <Figure className="lg:col-span-8" src={image} alt={b(`${key}Title`)} />
            </div>
          ))}
        </div>

        {/* The trade-off is the part worth reading, so it gets its own block
            rather than a footnote under the recommendation. */}
        <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Heading>{b('tradeoffTitle')}</Heading>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7">
            <Prose>{[b('tradeoffP1'), b('tradeoffP2')]}</Prose>
          </Reveal>
        </div>
      </CaseSection>

      {/* 04 — THE SYSTEM IN USE */}
      <CaseSection surface>
        <SectionTag number={4} label={b('s4')} accent={ACCENT} />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Heading>{b('bridgeTitle')}</Heading>
            </Reveal>
            <Reveal>
              <Prose className="mt-8">{[b('bridgeP1'), b('bridgeP2'), b('bridgeP3')]}</Prose>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <p
                className="mb-6 font-nav uppercase"
                style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--fg-muted)' }}
              >
                {b('structureTitle')}
              </p>
            </Reveal>
            <ul className="flex flex-col gap-4">
              {b('categories').map((c, i) => (
                <Reveal key={c.name} delay={i * 0.05}>
                  <li
                    className="p-5"
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
                    }}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span
                        className="font-nav uppercase"
                        style={{
                          fontSize: 12,
                          letterSpacing: '0.2em',
                          color: ACCENT,
                          fontWeight: 700,
                        }}
                      >
                        {c.name}
                      </span>
                      <span
                        className="font-nav tabular-nums"
                        style={{ fontSize: 12, color: 'var(--fg-muted)' }}
                      >
                        {c.count}
                      </span>
                    </div>
                    <p
                      className="mt-3 font-body"
                      style={{ color: 'var(--fg-soft)', fontSize: 12.5, lineHeight: 1.7 }}
                    >
                      {c.tags}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20">
          <Reveal>
            <SubHeading>{b('caseTitle')}</SubHeading>
          </Reveal>
          <Reveal>
            <p
              className="mt-4 font-body"
              style={{ color: 'var(--fg-soft)', fontSize: 14, lineHeight: 1.75, maxWidth: '72ch' }}
            >
              {b('caseIntro')}
            </p>
          </Reveal>
          {/* Wide spec artwork — scrolls inside its own box rather than
              shrinking to illegibility on a narrow screen. */}
          <div className="mt-8 overflow-x-auto">
            <div style={{ minWidth: 900 }}>
              <Figure src={systemInUse} alt={b('caseTitle')} ratio="1600/357" />
            </div>
          </div>
        </div>
      </CaseSection>

      <CaseFooter
        accent={ACCENT}
        label={b('reflLabel')}
        quote={b('reflQuote')}
        paragraphs={[b('reflP1'), b('reflP2')]}
        tags={b('reflTags')}
      />
    </>
  )
}
