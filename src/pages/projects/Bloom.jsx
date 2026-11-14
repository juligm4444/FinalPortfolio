import { useLocale } from '../../i18n/LocaleProvider.jsx'
import {
  CaseFooter,
  CaseHero,
  NextCase,
  CaseSection,
  Heading,
  Prose,
  PullQuote,
  Reveal,
  SectionTag,
  SubHeading,
} from '../../components/CaseStudy.jsx'

import TaxonomyExplorer, { SystemInUse } from '../../components/bloom/TaxonomyExplorer.jsx'
import WireframeViewer, { WireframeFlow } from '../../components/bloom/WireframeViewer.jsx'

// Per-route palette — see [data-case='bloom'] in cases.css.
const ACCENT = 'var(--case-accent)'

export default function Bloom() {
  const { t } = useLocale()
  const b = (k) => t(`bloom.${k}`)

  return (
    <>
      <CaseHero
        slug="bloom"
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
            style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, maxWidth: '66ch' }}
          >
            {b('versionsIntro')}
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <TaxonomyExplorer b={b} />
        </Reveal>

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

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Heading>{b('bridgeTitle')}</Heading>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7">
            <Prose>{[b('bridgeP1'), b('bridgeP2'), b('bridgeP3')]}</Prose>
          </Reveal>
        </div>

        <div className="mt-16">
          <Reveal>
            <SubHeading>{b('caseTitle')}</SubHeading>
          </Reveal>
          <Reveal>
            <p
              className="mt-4 font-body"
              style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, maxWidth: '66ch' }}
            >
              {b('caseIntro')}
            </p>
          </Reveal>
          <Reveal className="mt-8">
            <SystemInUse b={b} />
          </Reveal>
        </div>
      </CaseSection>

      {/* 05 — WIREFRAMES */}
      <CaseSection>
        <SectionTag number={5} label={b('s5')} accent={ACCENT} />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <Heading>{b('wfTitle')}</Heading>
            </Reveal>
            <Reveal>
              <Prose className="mt-8">{[b('wfP1'), b('wfP2')]}</Prose>
            </Reveal>
          </div>
          {/* The analytics figure is the reason for everything below, so it
              is set as large as the headline rather than buried in prose. */}
          <Reveal className="lg:col-span-5">
            <div className="lg:pt-2" style={{ borderTop: `3px solid ${ACCENT}` }}>
              <p
                className="mt-6 font-display tabular-nums"
                style={{ color: ACCENT, fontSize: 'clamp(64px, 9vw, 120px)', lineHeight: 1, fontWeight: 700 }}
              >
                {b('wfStat')}
              </p>
              <p
                className="mt-4 font-body"
                style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.7, maxWidth: '36ch' }}
              >
                {b('wfStatLabel')}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-20">
          <WireframeViewer b={b} />
        </Reveal>

        <div className="mt-24">
          <Reveal>
            <SubHeading>{b('wfFlowTitle')}</SubHeading>
          </Reveal>
          <Reveal className="mt-8">
            <WireframeFlow b={b} />
          </Reveal>
        </div>
      </CaseSection>

      <CaseFooter
        accent={ACCENT}
        label={b('reflLabel')}
        quote={b('reflQuote')}
        paragraphs={[b('reflP1'), b('reflP2')]}
        tags={b('reflTags')}
      />
      <NextCase slug="bloom" />
    </>
  )
}
