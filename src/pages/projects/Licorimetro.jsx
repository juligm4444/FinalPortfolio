import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '../../i18n/LocaleProvider.jsx';
import projects from '../../data/projects.js';
import MiniSkills from '../../components/MiniSkills.jsx';
import MediaSlot from '../../components/MediaSlot.jsx';
import Timeline from '../../components/Timeline.jsx';
import Highlight from '../../components/Highlight.jsx';
import GlassBlock from '../../components/GlassBlock.jsx';

const ACCENT = 'var(--pink-brand)';

const slabStyle = {
  background: ACCENT,
  color: '#EDEDE8',
  display: 'inline-block',
  padding: '8px 14px',
  fontSize: 12,
  letterSpacing: '0.22em',
  fontWeight: 700,
  textTransform: 'uppercase',
  fontFamily: '"Space Grotesk", sans-serif',
};

export default function Licorimetro() {
  const { t } = useLocale();
  const project = projects.find((p) => p.slug === 'licorimetro');

  return (
    <article className="w-full">
      {/* HERO */}
      <header className="mx-auto w-full max-w-[1200px] px-4 pt-16 md:px-8 md:pt-28">
        <span style={slabStyle}>{t('licorimetro.tag')}</span>

        <h1
          className="mt-6 font-display"
          style={{
            color: 'var(--fg)',
            fontSize: 'clamp(48px, 8vw, 112px)',
            lineHeight: 1.0,
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          {t('licorimetro.title')}
        </h1>

        <p
          className="mt-8 font-body"
          style={{
            color: 'var(--fg-soft)',
            fontSize: 'clamp(18px, 2vw, 24px)',
            lineHeight: 1.5,
            maxWidth: '60ch',
          }}
        >
          {t('licorimetro.subtitle')}
        </p>

        <div
          className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16"
          style={{
            borderTop: '1px solid color-mix(in srgb, var(--fg) 15%, transparent)',
            paddingTop: 36,
          }}
        >
          <div className="md:col-span-12 flex flex-col gap-10">
            <MetaBlock label={t('licorimetro.sectionRoleLabel')} value={t('licorimetro.role')} />
            <MetaBlock
              label={t('licorimetro.sectionTimelineLabel')}
              value={`${t('licorimetro.period')} · ${t('licorimetro.status')}`}
            />
            <div>
              <p
                className="font-nav uppercase"
                style={{ color: 'var(--fg-muted)', fontSize: 11, letterSpacing: '0.22em' }}
              >
                {t('licorimetro.stackKicker')}
              </p>
              <div className="mt-5">
                <MiniSkills skills={project ? project.skills : []} size={56} gap={10} />
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* SUMMARY */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <Kicker>{t('licorimetro.summaryKicker')}</Kicker>
            <Title>{t('licorimetro.summaryTitle')}</Title>
            <GlassBlock className="mt-6" padding="28px 32px">
              <Paragraphs items={t('licorimetro.summaryParas')} highlight />
            </GlassBlock>
          </div>
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <MediaSlot ratio="4 / 5" alt="Licorímetro — app overview" />
            </div>
          </div>
        </div>
      </Section>

      {/* PROBLEM */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <Kicker>{t('licorimetro.problemKicker')}</Kicker>
            <Title>{t('licorimetro.problemTitle')}</Title>
            <GlassBlock className="mt-6" padding="28px 32px">
              <p
                className="font-body"
                style={{
                  color: 'var(--fg-soft)',
                  fontSize: 17,
                  lineHeight: 1.7,
                  maxWidth: '60ch',
                }}
              >
                <Highlight text={t('licorimetro.problemLead')} />
              </p>
              <ul className="mt-8 space-y-3">
                {t('licorimetro.problemBullets').map((b, i) => (
                  <Bullet key={i}>{b}</Bullet>
                ))}
              </ul>
            </GlassBlock>
          </div>
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <MediaSlot ratio="4 / 5" alt="Problem framing — fragmented ecosystem" />
            </div>
          </div>
        </div>
      </Section>

      {/* FEATURES */}
      <Section>
        <Kicker>{t('licorimetro.featuresKicker')}</Kicker>
        <Title>{t('licorimetro.featuresTitle')}</Title>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {t('licorimetro.features').map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} />
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
              <Kicker>{t('licorimetro.ocrKicker')}</Kicker>
              <Title>{t('licorimetro.ocrTitle')}</Title>
              <Paragraphs items={t('licorimetro.ocrParas')} highlight />
              <ul className="mt-6 space-y-3">
                {t('licorimetro.ocrBullets').map((b, i) => (
                  <Bullet key={i}>{b}</Bullet>
                ))}
              </ul>
            </InsetCard>
          </div>
        </div>
      </Section>

      {/* PROCESS — USER FLOW */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-[120px]">
              <Kicker>{t('licorimetro.processKicker')}</Kicker>
              <Title>{t('licorimetro.processTitle')}</Title>
              <div className="mt-8 hidden md:block">
                <MediaSlot ratio="4 / 3" alt="User flow diagram" />
              </div>
            </div>
          </div>
          <div className="md:col-span-8">
            <Timeline
              items={t('licorimetro.processSteps').map((step) => ({
                period: step.n,
                title: step.title,
                detail: step.intro,
                bullets: step.bullets,
              }))}
              glass={true}
            />
          </div>
        </div>
      </Section>

      {/* ARCHITECTURE */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <Kicker>{t('licorimetro.architectureKicker')}</Kicker>
            <Title>{t('licorimetro.architectureTitle')}</Title>
            <GlassBlock className="mt-6" padding="28px 32px">
              <Paragraphs items={t('licorimetro.architectureParas')} highlight />
              <ul className="mt-6 space-y-3">
                {t('licorimetro.architectureBullets').map((b, i) => (
                  <Bullet key={i}>{b}</Bullet>
                ))}
              </ul>
            </GlassBlock>
          </div>
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <MediaSlot ratio="1 / 1" alt="Architecture diagram — Licorímetro ecosystem" />
            </div>
          </div>
        </div>
      </Section>

      {/* CHALLENGES */}
      <Section>
        <Kicker>{t('licorimetro.challengesKicker')}</Kicker>
        <Title wide>{t('licorimetro.challengesTitle')}</Title>
        <GlassBlock className="mt-8" padding="28px 32px">
          <Paragraphs items={t('licorimetro.challengesParas')} highlight fullWidth />
        </GlassBlock>
      </Section>

      {/* WHAT I'D BUILD DIFFERENTLY — EVOLUTION TABLE */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <MediaSlot ratio="4 / 5" alt="Evolution — what I'd build differently" />
            </div>
          </div>
          <div className="md:col-span-7">
            <Kicker>{t('licorimetro.whatChangedKicker')}</Kicker>
            <Title>{t('licorimetro.whatChangedTitle')}</Title>
            <BrutalistTable
              header={t('licorimetro.whatChangedHeader')}
              rows={t('licorimetro.whatChangedRows')}
            />
          </div>
        </div>
      </Section>

      {/* REFLECTIONS */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <InsetCard>
              <Kicker>{t('licorimetro.reflectionsKicker')}</Kicker>
              <Title>{t('licorimetro.reflectionsTitle')}</Title>
              <Paragraphs items={t('licorimetro.reflectionsParas')} highlight />
            </InsetCard>
          </div>
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <MediaSlot ratio="4 / 5" alt="Reflections — Licorímetro legacy" />
            </div>
          </div>
        </div>
      </Section>

    </article>
  );
}

/* =========================== OCR Visual =========================== */

function OCRScanVisual() {
  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--surface)',
        border: '1px solid color-mix(in srgb, var(--fg) 12%, transparent)',
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
          fontFamily: '"JetBrains Mono", monospace',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          paddingTop: 28,
          paddingBottom: 28,
        }}
      >
        {/* Scanning label header */}
        <div
          style={{
            position: 'relative',
            padding: '10px 14px',
            border: `1px dashed color-mix(in srgb, ${ACCENT} 45%, transparent)`,
            background: `color-mix(in srgb, ${ACCENT} 6%, transparent)`,
          }}
        >
          <span
            style={{
              color: 'var(--fg-muted)',
              fontSize: 11,
              letterSpacing: '0.1em',
              opacity: 0.7,
            }}
          >
            ANALYSING BITMAP...
          </span>
          <span
            style={{
              position: 'absolute',
              top: -8,
              left: 10,
              background: 'var(--surface)',
              padding: '0 6px',
              fontSize: 9,
              color: ACCENT,
              letterSpacing: '0.18em',
              fontWeight: 700,
            }}
          >
            OCR
          </span>
        </div>

        {/* Detection rows */}
        {[
          { label: 'TEXT_REGION_01', confidence: '0.94', active: true },
          { label: 'TEXT_REGION_02', confidence: '0.87', active: true },
          { label: 'TEXT_REGION_03', confidence: '0.41', active: false },
        ].map((row) => (
          <div key={row.label} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span
              style={{
                color: row.active ? ACCENT : 'var(--fg-muted)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                opacity: row.active ? 1 : 0.45,
              }}
            >
              {row.label}
            </span>
            <span
              style={{
                flex: 1,
                height: 1,
                background: `color-mix(in srgb, var(--fg) ${row.active ? 18 : 10}%, transparent)`,
              }}
            />
            <span
              style={{
                color: row.active ? 'var(--fg)' : 'var(--fg-muted)',
                fontSize: 10,
                opacity: row.active ? 1 : 0.45,
              }}
            >
              {row.confidence}
            </span>
          </div>
        ))}

        {/* Result block */}
        <div
          style={{
            marginTop: 6,
            padding: '10px 14px',
            background: 'var(--surface-2)',
            border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
          }}
        >
          <p
            style={{
              color: 'var(--fg)',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.06em',
            }}
          >
            BEVERAGE IDENTIFIED
          </p>
          <p style={{ color: 'var(--fg-muted)', fontSize: 10, marginTop: 4 }}>
            confidence: 87.4%
          </p>
        </div>

        {/* Footer label */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 2 }}>
          <span
            style={{
              color: 'var(--fg-muted)',
              fontSize: 9,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            BITMAP ANALYSIS · MANUAL OCR
          </span>
          <span
            style={{
              color: 'var(--fg-muted)',
              fontSize: 9,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              opacity: 0.5,
            }}
          >
            NO ML FRAMEWORK · HAND-BUILT
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================== building blocks =========================== */

function Section({ children }) {
  return (
    <section className="w-full">
      <div
        className="mx-auto w-full max-w-[1200px] px-4 md:px-8"
        style={{ paddingTop: 64, paddingBottom: 64 }}
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
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(14px) saturate(140%)',
        WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        border: '1px solid var(--glass-border)',
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
      style={{ color: 'var(--fg-muted)', fontSize: 12, letterSpacing: '0.22em' }}
    >
      {children}
    </p>
  );
}

function Title({ children, wide = false }) {
  return (
    <h2
      className="mt-3 font-display"
      style={{
        color: 'var(--fg)',
        fontSize: 'clamp(30px, 4vw, 52px)',
        lineHeight: 1.05,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        ...(wide ? { maxWidth: 'none' } : { maxWidth: '20ch' }),
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
            color: 'var(--fg-soft)',
            fontSize: 17,
            lineHeight: 1.7,
            ...(fullWidth ? {} : { maxWidth: '60ch' }),
          }}
        >
          {highlight ? <Highlight text={p} /> : p}
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
        color: hover ? 'var(--fg)' : 'var(--fg-soft)',
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
      <Highlight text={typeof children === 'string' ? children : ''} />
      {typeof children === 'string' ? null : children}
    </li>
  );
}

function MetaBlock({ label, value, className = '' }) {
  return (
    <div className={className}>
      <p
        className="font-nav uppercase"
        style={{ color: 'var(--fg-muted)', fontSize: 11, letterSpacing: '0.22em' }}
      >
        {label}
      </p>
      <p
        className="mt-2 font-display"
        style={{ color: 'var(--fg)', fontSize: 18, lineHeight: 1.45, fontWeight: 700 }}
      >
        {value}
      </p>
    </div>
  );
}

function FeatureCard({ feature, index }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative p-7"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
        transition: 'transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover ? `0 14px 28px color-mix(in srgb, ${ACCENT} 16%, transparent)` : 'none',
        borderColor: hover ? ACCENT : 'color-mix(in srgb, var(--fg) 10%, transparent)',
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
      <h3
        className="font-display"
        style={{ color: 'var(--fg)', fontSize: 20, lineHeight: 1.2, fontWeight: 700 }}
      >
        <Highlight text={feature.title} />
      </h3>
      <p
        className="mt-3 font-body"
        style={{ color: 'var(--fg-soft)', fontSize: 15, lineHeight: 1.65 }}
      >
        <Highlight text={feature.body} />
      </p>
    </motion.div>
  );
}

function BrutalistTable({ header, rows }) {
  return (
    <div className="mt-8 overflow-x-auto">
      <table
        className="w-full"
        style={{ borderCollapse: 'collapse', fontFamily: '"Roboto Mono", monospace' }}
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
                  color: 'var(--fg-muted)',
                  borderBottom: `2px solid var(--fg)`,
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
        background: hover ? 'color-mix(in srgb, var(--fg) 5%, transparent)' : 'transparent',
        transition: 'background 200ms ease',
      }}
    >
      {row.map((cell, k) => (
        <td
          key={k}
          style={{
            padding: '14px 16px',
            fontSize: 15,
            color: k === 2 ? ACCENT : 'var(--fg)',
            fontWeight: k === 0 ? 700 : 400,
            borderBottom: '1px solid color-mix(in srgb, var(--fg) 12%, transparent)',
          }}
        >
          {cell}
        </td>
      ))}
    </tr>
  );
}
