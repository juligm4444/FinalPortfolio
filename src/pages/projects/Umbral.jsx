import { useLocale } from '../../i18n/LocaleProvider.jsx'
import {
  CaseHero,
  NextCase,
  CaseSection,
  Figure,
  Heading,
  Prose,
  PullQuote,
  Reveal,
  SectionTag,
  SpecList,
  SubHeading,
} from '../../components/CaseStudy.jsx'

import configPatternUp from '../../assets/images/umbral/config-pattern-up.webp'
import configGlassUp from '../../assets/images/umbral/config-glass-up.webp'
import patternOrtho from '../../assets/images/umbral/pattern-ortho.webp'
import patternRadial from '../../assets/images/umbral/pattern-radial.webp'
import patternFinal from '../../assets/images/umbral/pattern-final.webp'
import exploded from '../../assets/images/umbral/exploded.webp'
import cornerStops from '../../assets/images/umbral/corner-stops.webp'
import cornerDetail from '../../assets/images/umbral/corner-detail.webp'
import underside from '../../assets/images/umbral/underside.webp'
import viewTop from '../../assets/images/umbral/view-top.webp'
import viewBottom from '../../assets/images/umbral/view-bottom.webp'
import viewSide from '../../assets/images/umbral/view-side.webp'
import viewIso from '../../assets/images/umbral/view-iso.webp'
import usePatternUp from '../../assets/images/umbral/use-pattern-up.webp'
import useGlassUp from '../../assets/images/umbral/use-glass-up.webp'
import protoStacked from '../../assets/images/umbral/proto-stacked.webp'
import protoBothModules from '../../assets/images/umbral/proto-both-modules.webp'
import protoWindowFrame from '../../assets/images/umbral/proto-window-frame.webp'
import protoThroughGlass from '../../assets/images/umbral/proto-through-glass.webp'

// Theme-aware: the wood tone that carries label text needs a different
// lightness on each ground to stay legible. Values live in index.css.
const ACCENT = 'var(--case-accent)'

export default function Umbral() {
  const { t } = useLocale()
  const h = (k) => t(`umbral.${k}`)

  return (
    <>
      <CaseHero
        slug="umbral"
        kicker={h('heroKicker')}
        h1={h('heroH1')}
        h2={h('heroH2')}
        sub={h('heroSub')}
        tags={h('heroTags')}
        meta={[
          { label: h('metaRole'), value: h('role') },
          { label: h('metaDimensions'), value: h('dimsShort') },
          { label: h('metaStatus'), value: h('status') },
          { label: h('metaContext'), value: h('course') },
        ]}
      />

      {/* 01 — CONCEPT */}
      <CaseSection>
        <SectionTag number={1} label={h('s1')} accent={ACCENT} />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <PullQuote accent={ACCENT}>{h('conceptQuote')}</PullQuote>
            <Reveal>
              <Prose className="mt-10">
                {[h('conceptP1'), h('conceptP2'), h('conceptP3')]}
              </Prose>
            </Reveal>
          </div>
          <Figure
            className="lg:col-span-6"
            src={configPatternUp}
            alt={h('configATitle')}
            caption={h('useFig1')}
            ratio="1/1"
          />
        </div>

        <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Heading>{h('thresholdTitle')}</Heading>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7">
            <Prose>{[h('thresholdP1'), h('thresholdP2'), h('thresholdP3')]}</Prose>
          </Reveal>
        </div>

        <div className="mt-20">
          <Reveal>
            <p
              className="mb-8 font-nav uppercase"
              style={{ fontSize: 12, letterSpacing: '0.22em', color: 'var(--text-muted)' }}
            >
              {h('stepsTitle')}
            </p>
          </Reveal>
          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {h('steps').map((s, i) => (
              <li
                key={s.n}
                className="h-full p-5"
                style={{ borderTop: `2px solid color-mix(in srgb, ${ACCENT} 45%, transparent)` }}
              >
                <Reveal delay={i * 0.06}>
                  <span
                    className="font-display"
                    style={{ color: ACCENT, fontSize: 26, fontWeight: 700 }}
                  >
                    {s.n}
                  </span>
                  <h3
                    className="mt-3 font-display"
                    style={{ color: 'var(--text)', fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="mt-2 font-body"
                    style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.6 }}
                  >
                    {s.desc}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </CaseSection>

      {/* 02 — PATTERN */}
      <CaseSection surface>
        <SectionTag number={2} label={h('s2')} accent={ACCENT} />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Heading>{h('patternTitle')}</Heading>
            </Reveal>
            <Reveal>
              <Prose className="mt-8">
                {[h('patternP1'), h('patternP2'), h('patternP3'), h('patternP4')]}
              </Prose>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-5">
              <Figure src={patternOrtho} alt={h('patternFig1')} caption={h('patternFig1')} ratio="1/1" />
              <Figure src={patternRadial} alt={h('patternFig2')} caption={h('patternFig2')} ratio="1/1" />
            </div>
            <Figure
              className="mt-5"
              src={patternFinal}
              alt={h('patternFig3')}
              caption={h('patternFig3')}
              ratio="1/1"
            />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <Reveal>
              <SubHeading>{h('gridTitle')}</SubHeading>
            </Reveal>
            <Reveal>
              <Prose className="mt-5">{[h('gridP1'), h('gridP2')]}</Prose>
            </Reveal>
            <div className="mt-6">
              <SpecList body={h('gridSpecs').split(' · ').join('\n')} />
            </div>
          </div>
          <div>
            <Reveal>
              <SubHeading>{h('adaptTitle')}</SubHeading>
            </Reveal>
            <Reveal>
              <Prose className="mt-5">{[h('adaptP1'), h('adaptP2')]}</Prose>
            </Reveal>
          </div>
        </div>
      </CaseSection>

      {/* 03 — CONSTRUCTION */}
      <CaseSection>
        <SectionTag number={3} label={h('s3')} accent={ACCENT} />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Heading>{h('constructTitle')}</Heading>
            </Reveal>
            <Reveal>
              <Prose className="mt-8">
                {[
                  h('constructP1'),
                  h('constructP2'),
                  h('constructP3'),
                  h('constructP4'),
                  h('constructP5'),
                ]}
              </Prose>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Figure src={exploded} alt={h('partsTitle')} ratio="4/5" />
            <div className="mt-5">
              <SpecList title={h('partsTitle')} body={h('parts')} note={h('partsNote')} />
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SpecList title={h('logicTitle')} body={h('logic').join('\n')} note={h('logicNote')} />
          </div>
          <div className="lg:col-span-7">
            <Figure src={cornerStops} alt={h('logicTitle')} ratio="4/3" />
            <div className="mt-5 grid grid-cols-2 gap-5">
              <Figure src={cornerDetail} alt={h('constructP4')} ratio="4/3" />
              <Figure src={underside} alt={h('note2')} ratio="4/3" />
            </div>
            <Reveal>
              <p
                className="mt-5 font-body"
                style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: '62ch' }}
              >
                {h('stackNote')}
              </p>
            </Reveal>
          </div>
        </div>
      </CaseSection>

      {/* 04 — VIEWS & DIMENSIONS */}
      <CaseSection surface>
        <SectionTag number={4} label={h('s4')} accent={ACCENT} />

        <Reveal>
          <p
            className="font-body"
            style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, maxWidth: '66ch' }}
          >
            {h('viewsIntro')}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Figure src={viewTop} alt={h('viewTop')} caption={h('viewTop')} ratio="1/1" />
          <Figure src={viewBottom} alt={h('viewBottom')} caption={h('viewBottom')} ratio="1/1" />
          <Figure src={viewSide} alt={h('viewSide')} caption={h('viewSide')} ratio="1/1" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Figure src={viewIso} alt={h('viewIso')} caption={h('viewIso')} ratio="4/3" />
          <SpecList title={h('dimsTitle')} body={h('dims')} note={h('dimsHeight')} />
          <SpecList title={h('notesTitle')} body={`${h('note1')}\n${h('note2')}`} />
        </div>
      </CaseSection>

      {/* 05 — CONFIGURATIONS */}
      <CaseSection>
        <SectionTag number={5} label={h('s5')} accent={ACCENT} />

        <Reveal>
          <p
            className="font-body"
            style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, maxWidth: '66ch' }}
          >
            {h('configIntro')}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <Figure src={configPatternUp} alt={h('configATitle')} ratio="1/1" />
            <Reveal>
              <SubHeading>
                <span className="mt-6 block">{h('configATitle')}</span>
              </SubHeading>
            </Reveal>
            <Reveal>
              <Prose className="mt-4">{[h('configAP1'), h('configAP2')]}</Prose>
            </Reveal>
          </div>
          <div>
            <Figure src={configGlassUp} alt={h('configBTitle')} ratio="1/1" />
            <Reveal>
              <SubHeading>
                <span className="mt-6 block">{h('configBTitle')}</span>
              </SubHeading>
            </Reveal>
            <Reveal>
              <Prose className="mt-4">{[h('configBP1'), h('configBP2')]}</Prose>
            </Reveal>
          </div>
        </div>
      </CaseSection>

      {/* 06 — IN USE */}
      <CaseSection surface>
        <SectionTag number={6} label={h('s6')} accent={ACCENT} />

        <Reveal>
          <p
            className="font-body"
            style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, maxWidth: '66ch' }}
          >
            {h('useIntro')}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Figure src={usePatternUp} alt={h('useFig1')} caption={h('useFig1')} ratio="4/3" />
          <Figure src={useGlassUp} alt={h('useFig2')} caption={h('useFig2')} ratio="4/3" />
        </div>
      </CaseSection>

      {/* 07 — PHYSICAL PROTOTYPE */}
      <CaseSection>
        <SectionTag number={7} label={h('s7')} accent={ACCENT} />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Heading>{h('protoTitle')}</Heading>
            </Reveal>
            <Reveal>
              <Prose className="mt-8">{[h('protoP1'), h('protoP2'), h('protoP3')]}</Prose>
            </Reveal>
            <div className="mt-8">
              <SpecList title={h('verifyTitle')} body={h('verify')} note={h('verifySpecs')} />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Figure src={protoStacked} alt={h('protoFig1')} caption={h('protoFig1')} ratio="4/3" contain={false} />
              <Figure src={protoBothModules} alt={h('protoFig2')} caption={h('protoFig2')} ratio="4/3" contain={false} />
              <Figure src={protoWindowFrame} alt={h('protoFig3')} caption={h('protoFig3')} ratio="4/3" contain={false} />
              <Figure src={protoThroughGlass} alt={h('protoFig4')} caption={h('protoFig4')} ratio="4/3" contain={false} />
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Reveal>
            <div>
              <SubHeading>{h('photoNoteTitle')}</SubHeading>
              <p
                className="mt-4 font-body"
                style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.7, maxWidth: '62ch' }}
              >
                {h('photoNote')}
              </p>
            </div>
          </Reveal>
          <SpecList title={h('specsTitle')} body={h('specs')} />
        </div>
      </CaseSection>
      <NextCase slug="umbral" />
    </>
  )
}
