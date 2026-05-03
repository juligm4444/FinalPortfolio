import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocale } from '../../i18n/LocaleProvider.jsx'
import projects from '../../data/projects.js'
import MiniSkills from '../../components/MiniSkills.jsx'
import MediaSlot from '../../components/MediaSlot.jsx'
import Timeline from '../../components/Timeline.jsx'
import IconButton from '../../components/IconButton.jsx'
import Highlight from '../../components/Highlight.jsx'
import { ExternalLinkIcon, GitHubIcon } from '../../components/icons/IconSet.jsx'

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
}

export default function Candelaria() {
  const { t } = useLocale()
  const project = projects.find((p) => p.slug === 'candelaria')

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
            <MetaBlock
              label={t('candelaria.sectionRoleLabel')}
              value={t('candelaria.role')}
            />
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
            <IconButton
              href={project.code}
              external
              variant="outline"
              icon={GitHubIcon}
              size="lg"
            >
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
            <Paragraphs items={t('candelaria.summaryParas')} highlight />
          </div>
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <MediaSlot ratio="4 / 5" alt="Candelaria — overview" />
            </div>
          </div>
        </div>
      </Section>

      {/* MY ROLE */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5 md:order-1">
            <div className="md:sticky md:top-[120px]">
              <MediaSlot ratio="1 / 1" alt="Design team — Candelaria" />
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
            <p
              className="mt-6 font-body"
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
          </div>
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <MediaSlot ratio="4 / 5" alt="Problem framing" />
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
                <MediaSlot ratio="4 / 3" alt="Process artifact" />
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
            <FeatureCard key={i} feature={f} index={i} />
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
              <MediaSlot ratio="1 / 1" alt="Gamification visual" />
            </div>
          </div>
        </div>
      </Section>

      {/* PERFORMANCE TABLE */}
      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[120px]">
              <MediaSlot ratio="4 / 5" alt="Performance dashboard" />
            </div>
          </div>
          <div className="md:col-span-7">
            <Kicker>{t('candelaria.perfKicker')}</Kicker>
            <Title>{t('candelaria.perfTitle')}</Title>
            <BrutalistTable
              header={t('candelaria.perfHeader')}
              rows={t('candelaria.perfRows')}
            />
          </div>
        </div>
      </Section>

      {/* SECURITY */}
      <Section>
        <Kicker>{t('candelaria.securityKicker')}</Kicker>
        <Title>{t('candelaria.securityTitle')}</Title>
        <ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          {t('candelaria.securityBullets').map((b, i) => (
            <Bullet key={i}>{b}</Bullet>
          ))}
        </ul>
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
              <MediaSlot ratio="4 / 5" alt="Reflections — moodboard" />
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
          <IconButton
            href={project.code}
            external
            variant="outline"
            icon={GitHubIcon}
            size="lg"
          >
            {t('candelaria.ctaCode')}
          </IconButton>
        </div>
      </section>
    </article>
  )
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
  )
}

function InsetCard({ children }) {
  return (
    <div
      style={{
        background: 'var(--surface-2)',
        border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
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
  )
}

function Kicker({ children }) {
  return (
    <p
      className="font-nav uppercase"
      style={{ color: 'var(--fg-muted)', fontSize: 12, letterSpacing: '0.22em' }}
    >
      {children}
    </p>
  )
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
  )
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
  )
}

function Bullet({ children }) {
  const [hover, setHover] = useState(false)
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
  )
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
  )
}

function FeatureCard({ feature, index }) {
  const [hover, setHover] = useState(false)
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
        boxShadow: hover
          ? '0 14px 28px color-mix(in srgb, var(--fg) 14%, transparent)'
          : 'none',
        borderColor: hover
          ? '#FF0871'
          : 'color-mix(in srgb, var(--fg) 10%, transparent)',
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
  )
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
  )
}

function TableRow({ row, accent }) {
  const [hover, setHover] = useState(false)
  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover
          ? 'color-mix(in srgb, var(--fg) 5%, transparent)'
          : 'transparent',
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
  )
}
