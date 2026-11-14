import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocale } from '../../i18n/LocaleProvider.jsx';
import { CaseHero, NextCase } from '../../components/CaseStudy.jsx';
import licorimetroProblemImg from '../../assets/images/licorimetro/problem.webp';
import licorimetroEvolutionImg from '../../assets/images/licorimetro/evolution.webp';
import licorimetroReflectionsImg from '../../assets/images/licorimetro/reflections.webp';
import licorimetroScanVideo from '../../assets/images/licorimetro/summary-scan.mp4';

const ACCENT = 'var(--case-accent)';
const EASE = [0.16, 1, 0.3, 1];


/* ======================== Feature icons (7) ======================== */
const FEATURE_ICONS = [
  /* 0  OCR Scanner */
  <svg key="icon-1" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <rect x="7" y="5" width="12" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <line x1="10" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="15" x2="16" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 8V5h3M23 8V5h-3M3 18v3h3M23 18v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  /* 1  Community Reviews */
  <svg key="icon-2" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M13 4 16 10 22 11 17 16 18.5 22 13 19 7.5 22 9 16 4 11 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>,
  /* 2  Your Cellar */
  <svg key="icon-3" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M9 4h8L15 12a3.6 3.6 0 01-2 1.5A3.6 3.6 0 0111 12L9 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <line x1="13" y1="14" x2="13" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="9.5" y1="21" x2="16.5" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  /* 3  Badge System */
  <svg key="icon-4" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M13 3 20.5 5.8v7A7.5 7.5 0 0113 22a7.5 7.5 0 01-7.5-9.2V5.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9.5 13l2.5 2.5L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  /* 4  Social Playlists */
  <svg key="icon-5" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <line x1="4" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="4" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="4" y1="17" x2="11" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M19 11l6 3-6 3V11z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.12" />
  </svg>,
  /* 5  Smart Recommendations */
  <svg key="icon-6" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M13 3v3M13 20v3M3 13h3M20 13h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6.5 6.5l2 2M17.5 17.5l2 2M6.5 19.5l2-2M17.5 8.5l2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="13" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  /* 6  Community Pricing */
  <svg key="icon-7" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M5 5h9l9 9-9 9-9-9V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="11" cy="11" r="1.8" fill="currentColor" />
    <line x1="16" y1="7" x2="21" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
  </svg>,
];

/* ======================== User-flow step icons ======================== */
const FLOW_ICONS = [
  /* Scan */
  <svg key="flow-1" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="5" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="10" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M7 5l1-2h4l1 2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>,
  /* Learn */
  <svg key="flow-2" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="3" y="4" width="14" height="13" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <line x1="3" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.4" />
    <line x1="6" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>,
  /* Share */
  <svg key="flow-3" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 2v10M6 6l4-4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 14v4h12v-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  /* Earn */
  <svg key="flow-4" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M6 3h8v5a4 4 0 01-8 0V3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M3 5H6M14 5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M2 7c0 2 1.5 3.5 4 4M18 7c0 2-1.5 3.5-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="10" y1="13" x2="10" y2="17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="7" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>,
];

/* ======================== Architecture node icons ======================== */
const archIcon = {
  camera: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <rect x="1" y="4" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="7.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 4l.8-2h3.4l.8 2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  search: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.3" />
      <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  database: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <ellipse cx="7.5" cy="3.5" rx="5" ry="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 3.5v8c0 1.1 2.2 2 5 2s5-.9 5-2v-8" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 7.5c0 1.1 2.2 2 5 2s5-.9 5-2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  users: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="5.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1 13c0-2.5 2-4.5 4.5-4.5S10 10.5 10 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="11.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M11.5 9.5c1.5.5 2.5 1.8 2.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  lock: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <rect x="2" y="6.5" width="11" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.5 6.5V5a3 3 0 016 0v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="7.5" cy="10.5" r="1.3" fill="currentColor" />
    </svg>
  ),
  cellar: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M5.5 2h4L8 7.5A2.5 2.5 0 017.5 9 2.5 2.5 0 017 7.5L5.5 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <line x1="7.5" y1="9" x2="7.5" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="5.5" y1="13" x2="9.5" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  badge: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M7.5 1.5 12 3v4.5A4.5 4.5 0 017.5 13.5 4.5 4.5 0 013 7.5V3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5 7.5l2 2L11 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sparkle: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M7.5 1.5v2.5M7.5 11V13.5M1.5 7.5h2.5M11 7.5h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M3.5 3.5l2 2M9.5 9.5l2 2M3.5 11.5l2-2M9.5 5.5l2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
};

const ARCH_LAYERS = [
  {
    label: 'INPUT',
    highlight: false,
    nodes: [
      { name: 'Camera + OCR', sub: 'Bitmap analysis', icon: 'camera' },
      { name: 'Manual Search', sub: 'Discovery feed', icon: 'search' },
    ],
  },
  {
    label: 'CORE',
    highlight: true,
    nodes: [
      { name: 'Product Database', sub: 'Labels · Catalog', icon: 'database' },
      { name: 'Community Engine', sub: 'Reviews · Social', icon: 'users' },
      { name: 'Auth & Profiles', sub: 'Firebase · JWT', icon: 'lock' },
    ],
  },
  {
    label: 'USER LAYER',
    highlight: false,
    nodes: [
      { name: 'Tu Bodega', sub: 'Personal cellar', icon: 'cellar' },
      { name: 'Badge System', sub: 'Gamification', icon: 'badge' },
      { name: 'Recommendations', sub: 'Smart feed', icon: 'sparkle' },
    ],
  },
];

export default function Licorimetro() {
  const { t } = useLocale();

  return (
    <article className="w-full">
      <CaseHero
        slug="licorimetro"
        links={[]}
        kicker={t('licorimetro.tag')}
        h1={t('licorimetro.title')}
        sub={t('licorimetro.subtitle')}
        meta={[
          { label: t('licorimetro.sectionRoleLabel'), value: t('licorimetro.role') },
          { label: t('licorimetro.sectionTimelineLabel'), value: `${t('licorimetro.period')} · ${t('licorimetro.status')}` },
        ]}
      />

      {/* SUMMARY */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <Reveal>
              <Kicker>{t('licorimetro.summaryKicker')}</Kicker>
              <Title>{t('licorimetro.summaryTitle')}</Title>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-6">
                <Paragraphs items={t('licorimetro.summaryParas')} highlight />
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <CaseVideo src={licorimetroScanVideo} ratio="1 / 1" />
            </div>
          </div>
        </div>
      </Section>

      {/* PROBLEM — image LEFT, text RIGHT */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <CaseImage src={licorimetroProblemImg} alt="Problem framing — fragmented ecosystem" ratio="4 / 5" />
            </div>
          </div>
          <div className="md:col-span-7">
            <Reveal>
              <Kicker>{t('licorimetro.problemKicker')}</Kicker>
              <Title>{t('licorimetro.problemTitle')}</Title>
            </Reveal>
            <Reveal delay={0.14}>
            <div className="mt-6">
              <p
                className="font-body"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: 17,
                  lineHeight: 1.7,
                  maxWidth: '60ch',
                }}
              >
                {t('licorimetro.problemLead')}
              </p>
              <ul className="mt-8 space-y-3">
                {t('licorimetro.problemBullets').map((b, i) => (
                  <Bullet key={i}>{b}</Bullet>
                ))}
              </ul>
            </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* FEATURES */}
      <Section>
        <Reveal>
          <Kicker>{t('licorimetro.featuresKicker')}</Kicker>
          <Title>{t('licorimetro.featuresTitle')}</Title>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {t('licorimetro.features').map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} icon={FEATURE_ICONS[i]} />
          ))}
        </div>
      </Section>

      {/* OCR — HERO TECHNICAL SECTION */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5 md:order-1">
            <div className="md:sticky md:top-[120px]">
              <OCRScanVisual />
            </div>
          </div>
          <div className="md:col-span-7 md:order-2">
            <InsetCard>
              <Reveal>
                <Kicker>{t('licorimetro.ocrKicker')}</Kicker>
                <Title>{t('licorimetro.ocrTitle')}</Title>
              </Reveal>
              <Reveal delay={0.14}>
              <Paragraphs items={t('licorimetro.ocrParas')} highlight />
              <ul className="mt-6 space-y-3">
                {t('licorimetro.ocrBullets').map((b, i) => (
                  <Bullet key={i}>{b}</Bullet>
                ))}
              </ul>
              </Reveal>
            </InsetCard>
          </div>
        </div>
      </Section>

      {/* PROCESS — USER FLOW DIAGRAM */}
      <Section>
        <Reveal>
          <Kicker>{t('licorimetro.processKicker')}</Kicker>
          <Title>{t('licorimetro.processTitle')}</Title>
        </Reveal>
        <UserFlowDiagram steps={t('licorimetro.processSteps')} />
      </Section>

      {/* ARCHITECTURE DIAGRAM */}
      <Section>
        <Reveal>
          <Kicker>{t('licorimetro.architectureKicker')}</Kicker>
          <Title>{t('licorimetro.architectureTitle')}</Title>
          <p
            className="mt-4 font-body"
            style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.7, maxWidth: '62ch' }}
          >
            {t('licorimetro.architectureParas')[0]}
          </p>
        </Reveal>
        <ArchitectureDiagram />
      </Section>

      {/* WHAT I'D BUILD DIFFERENTLY — EVOLUTION TABLE */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <CaseImage src={licorimetroEvolutionImg} alt="Evolution — what I'd build differently" ratio="4 / 5" />
            </div>
          </div>
          <div className="md:col-span-7">
            <Reveal>
              <Kicker>{t('licorimetro.whatChangedKicker')}</Kicker>
              <Title>{t('licorimetro.whatChangedTitle')}</Title>
            </Reveal>
            <Reveal delay={0.14}>
            <BrutalistTable
              header={t('licorimetro.whatChangedHeader')}
              rows={t('licorimetro.whatChangedRows')}
            />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* REFLECTIONS */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <InsetCard>
              <Reveal>
                <Kicker>{t('licorimetro.reflectionsKicker')}</Kicker>
                <Title>{t('licorimetro.reflectionsTitle')}</Title>
              </Reveal>
              <Reveal delay={0.14}>
                <Paragraphs items={t('licorimetro.reflectionsParas')} highlight />
              </Reveal>
            </InsetCard>
          </div>
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <CaseImage src={licorimetroReflectionsImg} alt="Reflections — Licorímetro legacy" ratio="4 / 5" />
            </div>
          </div>
        </div>
      </Section>
      <NextCase slug="licorimetro" />
    </article>
  );
}

/* ======================== User Flow Diagram ======================== */

function UserFlowDiagram({ steps }) {
  return (
    <div className="mt-10">
      {/* Desktop — horizontal grid with a faint connecting rail */}
      <div className="hidden md:block relative">
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 44,
            left: '6%',
            right: '6%',
            height: 1,
            background: `color-mix(in srgb, ${ACCENT} 20%, transparent)`,
            zIndex: 0,
          }}
        />
        <div className="grid grid-cols-4 gap-5 relative" style={{ zIndex: 1 }}>
          {steps.map((step, i) => (
            <FlowStepCard key={step.n} step={step} icon={FLOW_ICONS[i]} />
          ))}
        </div>
      </div>

      {/* Mobile — vertical stack with connectors */}
      <div className="md:hidden flex flex-col">
        {steps.map((step, i) => (
          <div key={step.n}>
            <FlowStepCard step={step} icon={FLOW_ICONS[i]} mobile />
            {i < steps.length - 1 && (
              <div className="flex justify-center py-1">
                <div
                  aria-hidden="true"
                  style={{
                    width: 1,
                    height: 28,
                    background: `color-mix(in srgb, ${ACCENT} 28%, transparent)`,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowStepCard({ step, icon, mobile = false }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.85, ease: EASE }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover
          ? `color-mix(in srgb, ${ACCENT} 6%, var(--concrete-100))`
          : 'var(--concrete-100)',
        border: `1px solid ${
          hover
            ? `color-mix(in srgb, ${ACCENT} 35%, transparent)`
            : 'color-mix(in srgb, var(--text) 10%, transparent)'
        }`,
        padding: mobile ? '20px' : '24px 20px',
        transition: 'background 280ms ease, border-color 280ms ease',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-label)',
          fontSize: 12,
          letterSpacing: '0.18em',
          color: ACCENT,
          display: 'block',
          marginBottom: 14,
          textTransform: 'uppercase',
        }}
      >
        {step.n}
      </span>

      <div
        style={{
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `color-mix(in srgb, ${ACCENT} 8%, transparent)`,
          border: `1px solid color-mix(in srgb, ${ACCENT} 28%, transparent)`,
          color: ACCENT,
          marginBottom: 16,
        }}
      >
        {icon}
      </div>

      <h3
        className="font-display"
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--text)',
          lineHeight: 1.2,
          marginBottom: 8,
        }}
      >
        {step.title}
      </h3>

      <p
        className="font-body"
        style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}
      >
        {step.intro}
      </p>
    </motion.div>
  );
}

/* ======================== Architecture Diagram ======================== */

function ArchitectureDiagram() {
  return (
    <div className="mt-10">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-stretch">
        {ARCH_LAYERS.map((layer, li) => (
          <div key={layer.label} style={{ flex: 1, display: 'flex', alignItems: 'stretch' }}>
            {/* Arrow connector before each layer (except first) */}
            {li > 0 && (
              <div
                className="hidden md:flex items-center justify-center flex-shrink-0"
                style={{ width: 32 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M2 7h10M8 3l4 4-4 4"
                    stroke={ACCENT}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}

            <div
              style={{
                flex: 1,
                background: layer.highlight
                  ? `color-mix(in srgb, ${ACCENT} 5%, var(--concrete-100))`
                  : 'var(--concrete-100)',
                border: layer.highlight
                  ? `1px solid color-mix(in srgb, ${ACCENT} 22%, transparent)`
                  : '1px solid color-mix(in srgb, var(--text) 10%, transparent)',
                padding: '20px 18px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: 12,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: layer.highlight ? ACCENT : 'var(--text-muted)',
                  marginBottom: 14,
                }}
              >
                {layer.label}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {layer.nodes.map((node) => (
                  <div
                    key={node.name}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid color-mix(in srgb, var(--text) 9%, transparent)',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span style={{ color: ACCENT, flexShrink: 0 }}>
                      {archIcon[node.icon]}
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--text)',
                          lineHeight: 1.2,
                        }}
                      >
                        {node.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {node.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================== OCR Scan Visual ======================== */

function OCRScanVisual() {
  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--surface)',
        border: '1px solid color-mix(in srgb, var(--text) 12%, transparent)',
        padding: 28,
        aspectRatio: '4 / 5',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 12,
      }}
    >
      <style>{`
        @keyframes licorimetro-scan {
          0%   { top: 8%;  opacity: 0.8; }
          48%  { top: 88%; opacity: 0.8; }
          50%  { top: 88%; opacity: 0; }
          52%  { top: 8%;  opacity: 0; }
          100% { top: 8%;  opacity: 0.8; }
        }
      `}</style>

      {/* Corner brackets */}
      <span style={{ position: 'absolute', top: 14, left: 14, width: 22, height: 22, borderTop: `2px solid ${ACCENT}`, borderLeft: `2px solid ${ACCENT}` }} />
      <span style={{ position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderTop: `2px solid ${ACCENT}`, borderRight: `2px solid ${ACCENT}` }} />
      <span style={{ position: 'absolute', bottom: 14, left: 14, width: 22, height: 22, borderBottom: `2px solid ${ACCENT}`, borderLeft: `2px solid ${ACCENT}` }} />
      <span style={{ position: 'absolute', bottom: 14, right: 14, width: 22, height: 22, borderBottom: `2px solid ${ACCENT}`, borderRight: `2px solid ${ACCENT}` }} />

      {/* Scan line */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${ACCENT} 30%, ${ACCENT} 70%, transparent 100%)`,
          animation: 'licorimetro-scan 3.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          fontFamily: 'var(--font-body)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          paddingTop: 28,
          paddingBottom: 28,
        }}
      >
        <div
          style={{
            position: 'relative',
            padding: '10px 14px',
            border: `1px dashed color-mix(in srgb, ${ACCENT} 45%, transparent)`,
            background: `color-mix(in srgb, ${ACCENT} 6%, transparent)`,
          }}
        >
          <span style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: '0.1em' }}>
            ANALYSING BITMAP...
          </span>
          <span
            style={{
              position: 'absolute',
              top: -8,
              left: 10,
              background: 'var(--surface)',
              padding: '0 6px',
              fontSize: 12,
              color: ACCENT,
              letterSpacing: '0.18em',
              fontWeight: 700,
            }}
          >
            OCR
          </span>
        </div>

        {[
          { label: 'TEXT_REGION_01', confidence: '0.94', active: true },
          { label: 'TEXT_REGION_02', confidence: '0.87', active: true },
          { label: 'TEXT_REGION_03', confidence: '0.41', active: false },
        ].map((row) => (
          <div key={row.label} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span
              style={{
                color: row.active ? ACCENT : 'var(--text-muted)',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.12em',
                opacity: 1,
              }}
            >
              {row.label}
            </span>
            <span
              style={{
                flex: 1,
                height: 1,
                background: `color-mix(in srgb, var(--text) ${row.active ? 18 : 10}%, transparent)`,
              }}
            />
            <span style={{ color: row.active ? 'var(--text)' : 'var(--text-muted)', fontSize: 12 }}>
              {row.confidence}
            </span>
          </div>
        ))}

        <div
          style={{
            marginTop: 6,
            padding: '10px 14px',
            background: 'var(--concrete-100)',
            border: '1px solid color-mix(in srgb, var(--text) 10%, transparent)',
          }}
        >
          <p style={{ color: 'var(--text)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>
            BEVERAGE IDENTIFIED
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>confidence: 87.4%</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 2 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            BITMAP ANALYSIS · MANUAL OCR
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            NO ML FRAMEWORK · HAND-BUILT
          </span>
        </div>
      </div>
    </div>
  );
}

/* ======================== Media helpers ======================== */

function CaseImage({ src, alt, ratio = '4 / 5' }) {
  return (
    <div style={{ width: '100%', aspectRatio: ratio, overflow: 'hidden', position: 'relative' }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
}

function CaseVideo({ src, ratio = '1 / 1' }) {
  return (
    <div style={{ width: '100%', aspectRatio: ratio, overflow: 'hidden', position: 'relative' }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

/* ======================== Building blocks ======================== */

function Reveal({ children, delay = 0, y = 24 }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduced ? 0 : 1.0, ease: EASE, delay: reduced ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

function Section({ children }) {
  return (
    <section className="w-full">
      <div
        className="mx-auto w-full max-w-[1200px] px-4 md:px-8"
        style={{ paddingTop: 'clamp(64px, 8vw, 96px)', paddingBottom: 'clamp(64px, 8vw, 96px)' }}
      >
        {children}
      </div>
    </section>
  );
}

function InsetCard({ children }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        padding: 'clamp(24px, 4vw, 48px)',
        position: 'relative',
        display: 'inline-block',
        width: '100%',
      }}
    >
      <span
        aria-hidden
        className="absolute"
        style={{ left: 0, top: 0, width: 6, height: '100%', background: ACCENT }}
      />
      <div style={{ paddingLeft: 18 }}>{children}</div>
    </div>
  );
}

function Kicker({ children }) {
  return (
    <p
      className="font-nav uppercase"
      style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: '0.22em' }}
    >
      {children}
    </p>
  );
}

function Title({ children, wide = false }) {
  return (
    <h2
      className="mt-4 font-display"
      style={{
        color: 'var(--text)',
        fontSize: 'clamp(30px, 4vw, 52px)',
        lineHeight: 1.05,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        textWrap: 'balance',
        ...(wide ? { maxWidth: 'none' } : { maxWidth: '22ch' }),
      }}
    >
      {children}
    </h2>
  );
}

function Paragraphs({ items, highlight = false, fullWidth = false }) {
  return (
    <div className="mt-6 space-y-5 w-full">
      {items.map((p, i) => (
        <p
          key={i}
          className="font-body max-w-none"
          style={{
            color: 'var(--text-muted)',
            fontSize: 17,
            lineHeight: 1.7,
            ...(fullWidth ? {} : { maxWidth: '60ch' }),
          }}
        >
          {p}
        </p>
      ))}
    </div>
  );
}

function Bullet({ children }) {
  const [hover, setHover] = useState(false);
  return (
    <li
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative pl-7 font-body transition-transform duration-200 ease-out"
      style={{
        color: hover ? 'var(--text)' : 'var(--text-muted)',
        fontSize: 16,
        lineHeight: 1.65,
        maxWidth: '60ch',
        transform: hover ? 'translateX(4px)' : 'translateX(0)',
      }}
    >
      <span
        aria-hidden
        className="absolute transition-all duration-200"
        style={{
          left: 0,
          top: '0.4em',
          width: hover ? 18 : 14,
          height: hover ? 18 : 14,
          background: ACCENT,
        }}
      />
      {children}
    </li>
  );
}


function FeatureCard({ feature, index, icon }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.85, ease: EASE, delay: index * 0.08 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative p-7"
      style={{
        background: 'var(--concrete-100)',
        border: '1px solid color-mix(in srgb, var(--text) 10%, transparent)',
        transition: 'transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover ? `0 14px 28px color-mix(in srgb, ${ACCENT} 16%, transparent)` : 'none',
        borderColor: hover ? ACCENT : 'color-mix(in srgb, var(--text) 10%, transparent)',
      }}
    >
      <span
        aria-hidden
        className="absolute right-0 top-0"
        style={{
          width: hover ? 18 : 12,
          height: hover ? 18 : 12,
          background: ACCENT,
          transition: 'all 240ms ease',
        }}
      />

      {/* Feature icon */}
      {icon && (
        <div
          style={{
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: hover
              ? `color-mix(in srgb, ${ACCENT} 14%, transparent)`
              : `color-mix(in srgb, ${ACCENT} 8%, transparent)`,
            border: `1px solid ${
              hover
                ? `color-mix(in srgb, ${ACCENT} 45%, transparent)`
                : `color-mix(in srgb, ${ACCENT} 22%, transparent)`
            }`,
            color: ACCENT,
            marginBottom: 18,
            transition: 'background 240ms ease, border-color 240ms ease',
          }}
        >
          {icon}
        </div>
      )}

      <h3
        className="font-display"
        style={{ color: 'var(--text)', fontSize: 20, lineHeight: 1.2, fontWeight: 700 }}
      >
        {feature.title}
      </h3>
      <p
        className="mt-3 font-body"
        style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.65 }}
      >
        {feature.body}
      </p>
    </motion.div>
  );
}

function BrutalistTable({ header, rows }) {
  return (
    <div className="mt-8 overflow-x-auto">
      <table
        className="w-full"
        style={{ borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}
      >
        <thead>
          <tr>
            {header.map((h, i) => (
              <th
                key={i}
                className="font-nav uppercase"
                style={{
                  textAlign: 'left',
                  padding: '14px 16px',
                  fontSize: 12,
                  letterSpacing: '0.22em',
                  color: 'var(--text-muted)',
                  borderBottom: `2px solid var(--text)`,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <TableRow key={i} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({ row }) {
  const [hover, setHover] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'color-mix(in srgb, var(--text) 5%, transparent)' : 'transparent',
        transition: 'background 200ms ease',
      }}
    >
      {row.map((cell, k) => (
        <td
          key={k}
          style={{
            padding: '14px 16px',
            fontSize: 15,
            color: k === 2 ? ACCENT : 'var(--text)',
            fontWeight: k === 0 ? 700 : 400,
            borderBottom: '1px solid color-mix(in srgb, var(--text) 12%, transparent)',
          }}
        >
          {cell}
        </td>
      ))}
    </tr>
  );
}
