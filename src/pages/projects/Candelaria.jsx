import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '../../i18n/LocaleProvider.jsx';
import projects from '../../data/projects.js';
import MiniSkills from '../../components/MiniSkills.jsx';
import Timeline from '../../components/Timeline.jsx';
import candelariaSummaryImg from '../../assets/images/candelaria/summary.webp';
import candelariaRoleImg from '../../assets/images/candelaria/role.webp';
import candelariaProblemImg from '../../assets/images/candelaria/problem.webp';
import candelariaProcessImg from '../../assets/images/candelaria/process.webp';
import candelariaTiersImg from '../../assets/images/candelaria/tiers.webp';
import candelariaPerformanceImg from '../../assets/images/candelaria/performance.webp';
import candelariaReflectionsImg from '../../assets/images/candelaria/reflections.webp';
import IconButton from '../../components/IconButton.jsx';
import Highlight from '../../components/Highlight.jsx';
import GlassBlock from '../../components/GlassBlock.jsx';
import { ExternalLinkIcon, GitHubIcon } from '../../components/icons/IconSet.jsx';

/* ======================== Feature icons (5) ======================== */
const FEATURE_ICONS = [
  /* 0  Auth & user management */
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <circle cx="13" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 22c0-5 4-8 9-8s9 3 9 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="15" y="14" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <path d="M17 14v-1.5a2 2 0 014 0V14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>,
  /* 1  E-commerce & payments */
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M4 5h2l3 12h12l2-8H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="11" cy="20" r="1.5" fill="currentColor" />
    <circle cx="18" cy="20" r="1.5" fill="currentColor" />
  </svg>,
  /* 2  Gamification — follower tiers */
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M7 4h12v7a6 6 0 01-12 0V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 6H7M19 6h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 8c0 2.5 1.8 4.5 4 5M23 8c0 2.5-1.8 4.5-4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13" y1="17" x2="13" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="9" y1="21" x2="17" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  /* 3  Internal panel */
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="14" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="4" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="14" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  /* 4  Multilingual support */
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <circle cx="13" cy="13" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13 4c-3 3-4.5 5.5-4.5 9s1.5 6 4.5 9M13 4c3 3 4.5 5.5 4.5 9s-1.5 6-4.5 9" stroke="currentColor" strokeWidth="1.5" />
    <line x1="4" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 9h16M5 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
];

const slabStyle = {
  background: '#FF0871',
  color: '#EDEDE8',
  display: 'inline-block',
  padding: '8px 14px',
  fontSize: 12,
  letterSpacing: '0.22em',
  fontWeight: 700,
  textTransform: 'uppercase',
  fontFamily: '"Space Grotesk", sans-serif',
};

export default function Candelaria() {
  const { t } = useLocale();
  const project = projects.find((p) => p.slug === 'candelaria');

  return (
    <article className="w-full">
      {/* HERO */}
      <header className="mx-auto w-full max-w-[1200px] px-4 pt-16 md:px-8 md:pt-28">
        <span style={slabStyle}>{t('candelaria.tag')}</span>

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
          {t('candelaria.title')}
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
          {t('candelaria.subtitle')}
        </p>

        {/* Meta block — Role / Timeline / Tools all aligned LEFT.
            CTAs stacked vertically on the right. */}
        <div
          className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16"
          style={{
            borderTop: '1px solid color-mix(in srgb, var(--fg) 15%, transparent)',
            paddingTop: 36,
          }}
        >
          <div className="md:col-span-7 flex flex-col gap-10">
            <MetaBlock label={t('candelaria.sectionRoleLabel')} value={t('candelaria.role')} />
            <MetaBlock
              label={t('candelaria.sectionTimelineLabel')}
              value={`${t('candelaria.period')} · ${t('candelaria.status')}`}
            />
            <div>
              <p
                className="font-nav uppercase"
                style={{ color: 'var(--fg-muted)', fontSize: 11, letterSpacing: '0.22em' }}
              >
                {t('candelaria.stackKicker')}
              </p>
              <div className="mt-5">
                <MiniSkills skills={project.skills} size={56} gap={10} />
              </div>
            </div>
          </div>

          {/* CTAs — vertical stack on the right */}
          <div className="md:col-span-5 flex flex-col items-stretch gap-4 md:items-end">
            <IconButton
              href={project.site}
              external
              variant="primary"
              icon={ExternalLinkIcon}
              size="lg"
            >
              {t('candelaria.ctaVisit')}
            </IconButton>
            <IconButton href={project.code} external variant="outline" icon={GitHubIcon} size="lg">
              {t('candelaria.ctaCode')}
            </IconButton>
          </div>
        </div>
      </header>

      {/* SUMMARY */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <Kicker>{t('candelaria.summaryKicker')}</Kicker>
            <Title>{t('candelaria.summaryTitle')}</Title>
            <GlassBlock className="mt-6" padding="28px 32px">
              <Paragraphs items={t('candelaria.summaryParas')} highlight />
            </GlassBlock>
          </div>
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <CaseImage src={candelariaSummaryImg} alt="Candelaria — overview" ratio="4 / 5" />
            </div>
          </div>
        </div>
      </Section>

      {/* MY ROLE */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5 md:order-1">
            <div className="md:sticky md:top-[120px]">
              <CaseImage src={candelariaRoleImg} alt="Design team — Candelaria" ratio="1 / 1" />
            </div>
          </div>
          <div className="md:col-span-7 md:order-2">
            <InsetCard>
              <Kicker>{t('candelaria.myRoleKicker')}</Kicker>
              <Paragraphs items={t('candelaria.myRoleParas')} highlight />
            </InsetCard>
          </div>
        </div>
      </Section>

      {/* PROBLEM — text LEFT, image RIGHT (per latest spec) */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <Kicker>{t('candelaria.problemKicker')}</Kicker>
            <Title>{t('candelaria.problemTitle')}</Title>
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
                <Highlight text={t('candelaria.problemLead')} />
              </p>
              <ul className="mt-8 space-y-3">
                {t('candelaria.problemBullets').map((b, i) => (
                  <Bullet key={i}>{b}</Bullet>
                ))}
              </ul>
            </GlassBlock>
          </div>
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <CaseImage src={candelariaProblemImg} alt="Problem framing" ratio="4 / 5" />
            </div>
          </div>
        </div>
      </Section>

      {/* PROCESS */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-[120px]">
              <Kicker>{t('candelaria.processKicker')}</Kicker>
              <Title>{t('candelaria.processTitle')}</Title>
              <div className="mt-8 hidden md:block">
                <CaseImage src={candelariaProcessImg} alt="Process artifact" ratio="4 / 3" />
              </div>
            </div>
          </div>
          <div className="md:col-span-8">
            <Timeline
              items={t('candelaria.processSteps').map((step) => ({
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

      {/* FEATURES */}
      <Section>
        <Kicker>{t('candelaria.featuresKicker')}</Kicker>
        <Title>{t('candelaria.featuresTitle')}</Title>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {t('candelaria.features').map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} icon={FEATURE_ICONS[i]} />
          ))}
        </div>
      </Section>

      {/* TIERS TABLE */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <Kicker>{t('candelaria.tiersKicker')}</Kicker>
            <Title>{t('candelaria.tiersTitle')}</Title>
            <BrutalistTable
              header={t('candelaria.tiersHeader')}
              rows={t('candelaria.tiers')}
              accentRow={(row) => row[0] === 'Core'}
            />
          </div>
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <CaseImage src={candelariaTiersImg} alt="Gamification tiers" ratio="1 / 1" />
            </div>
          </div>
        </div>
      </Section>

      {/* PERFORMANCE TABLE */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <CaseImage src={candelariaPerformanceImg} alt="Performance dashboard" ratio="4 / 5" />
            </div>
          </div>
          <div className="md:col-span-7">
            <Kicker>{t('candelaria.perfKicker')}</Kicker>
            <Title>{t('candelaria.perfTitle')}</Title>
            <BrutalistTable header={t('candelaria.perfHeader')} rows={t('candelaria.perfRows')} />
          </div>
        </div>
      </Section>

      {/* SECURITY */}
      <Section>
        <Kicker>{t('candelaria.securityKicker')}</Kicker>
        <Title>{t('candelaria.securityTitle')}</Title>
        <GlassBlock className="mt-8" padding="28px 32px">
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {t('candelaria.securityBullets').map((b, i) => (
              <Bullet key={i}>{b}</Bullet>
            ))}
          </ul>
        </GlassBlock>
      </Section>

      {/* REFLECTIONS */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <InsetCard>
              <Kicker>{t('candelaria.reflectionsKicker')}</Kicker>
              <Title>{t('candelaria.reflectionsTitle')}</Title>
              <Paragraphs items={t('candelaria.reflectionsParas')} highlight />
            </InsetCard>
          </div>
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <CaseImage src={candelariaReflectionsImg} alt="Reflections — moodboard" ratio="4 / 5" />
            </div>
          </div>
        </div>
      </Section>

      {/* FINAL CTAs — centered */}
      <section className="mx-auto w-full max-w-[1200px] px-4 pb-32 pt-8 md:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          <IconButton
            href={project.site}
            external
            variant="primary"
            icon={ExternalLinkIcon}
            size="lg"
          >
            {t('candelaria.ctaVisit')}
          </IconButton>
          <IconButton href={project.code} external variant="outline" icon={GitHubIcon} size="lg">
            {t('candelaria.ctaCode')}
          </IconButton>
        </div>
      </section>
    </article>
  );
}

/* =========================== media helpers =========================== */

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
        style={{ left: 0, top: 0, width: 6, height: '100%', background: '#FF0871' }}
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

function Title({ children }) {
  return (
    <h2
      className="mt-3 font-display"
      style={{
        color: 'var(--fg)',
        fontSize: 'clamp(30px, 4vw, 52px)',
        lineHeight: 1.05,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        maxWidth: '20ch',
      }}
    >
      {children}
    </h2>
  );
}

function Paragraphs({ items, highlight = false }) {
  return (
    <div className="mt-6 space-y-5">
      {items.map((p, i) => (
        <p
          key={i}
          className="font-body"
          style={{
            color: 'var(--fg-soft)',
            fontSize: 17,
            lineHeight: 1.7,
            maxWidth: '60ch',
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
          background: '#FF0871',
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

function FeatureCard({ feature, index, icon }) {
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
        boxShadow: hover ? '0 14px 28px color-mix(in srgb, #FF0871 14%, transparent)' : 'none',
        borderColor: hover ? '#FF0871' : 'color-mix(in srgb, var(--fg) 10%, transparent)',
      }}
    >
      <span
        aria-hidden
        className="absolute right-0 top-0"
        style={{
          width: hover ? 18 : 12,
          height: hover ? 18 : 12,
          background: '#FF0871',
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
              ? 'color-mix(in srgb, #FF0871 14%, transparent)'
              : 'color-mix(in srgb, #FF0871 8%, transparent)',
            border: `1px solid ${
              hover
                ? 'color-mix(in srgb, #FF0871 45%, transparent)'
                : 'color-mix(in srgb, #FF0871 22%, transparent)'
            }`,
            color: '#FF0871',
            marginBottom: 18,
            transition: 'background 240ms ease, border-color 240ms ease',
          }}
        >
          {icon}
        </div>
      )}

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

function BrutalistTable({ header, rows, accentRow }) {
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
                  borderBottom: '2px solid var(--fg)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <TableRow key={i} row={row} accent={accentRow ? accentRow(row) : false} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({ row, accent }) {
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
            color: accent ? '#FF0066' : 'var(--fg)',
            fontWeight: accent || k === 0 ? 700 : 400,
            borderBottom: '1px solid color-mix(in srgb, var(--fg) 12%, transparent)',
          }}
        >
          {cell}
        </td>
      ))}
    </tr>
  );
}
