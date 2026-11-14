import { createContext, useContext, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocale } from '../../i18n/LocaleProvider.jsx';
import { CaseHero, NextCase } from '../../components/CaseStudy.jsx';
import { caseStudies } from '../../data/projects.js';

/* case-study imagery */
import summaryImg from '../../assets/images/candelaria/summary.webp';
import roleImg from '../../assets/images/candelaria/role.webp';
import problemImg from '../../assets/images/candelaria/problem.webp';
import processImg from '../../assets/images/candelaria/process.webp';
import tiersImg from '../../assets/images/candelaria/tiers.webp';
import performanceImg from '../../assets/images/candelaria/performance.webp';
import reflectionsImg from '../../assets/images/candelaria/reflections.webp';

/* condor logo system */
import condorMain from '../../assets/images/candelaria/condor-main.webp';
import condorBAT from '../../assets/images/candelaria/condor-BAT.webp';
import condorCEL from '../../assets/images/candelaria/condor-CEL.webp';
import condorCHA from '../../assets/images/candelaria/condor-CHA.webp';
import condorCOM from '../../assets/images/candelaria/condor-COM.webp';
import condorDIS from '../../assets/images/candelaria/condor-DIS.webp';
import condorLOG from '../../assets/images/candelaria/condor-LOG.webp';
import { CANDELARIA_BRAND_PALETTE } from '../../data/swatches.js';
import condorRRHH from '../../assets/images/candelaria/condor-RRHH.webp';

/* ─────────────────────────────────────────
   DESIGN TOKENS — read from the route's palette (cases.css)
   Sourced from the live site + brand manual.
   ───────────────────────────────────────── */

const C_LIGHT = {
  bg:           'var(--case-bg)',
  surface:      'var(--case-surface)',
  card:         'var(--case-card)',
  gold:         'var(--case-warm)',
  goldDeep:     'var(--case-warm-deep)',
  violet:       'var(--case-accent)',
  violetSoft:   'var(--case-accent-soft)',
  lavender:     'var(--case-accent-2)',
  text:         'var(--case-ink)',
  textSoft:     'var(--case-ink-soft)',
  textMuted:    'var(--case-ink-muted)',
  border:       'var(--case-border)',
  borderAccent: 'var(--case-border-accent)',
  glow:         'var(--case-glow)',
  glowSoft:     'var(--case-glow-soft)',
  btnText:      'var(--case-on-accent)',
};

/* Body, labels and display are the site's (ACABADO §0). */
const DISPLAY = 'var(--case-display)';
const BODY = 'var(--font-body)';
const LABEL = 'var(--font-label)';
const EASE = [0.16, 1, 0.3, 1];


/* team meta — abbr → logo. Order matches translations `teams`. */
const TEAM_COLOR = 'var(--moss-700)';
const TEAMS = [
  { abbr: 'BAT',  logo: condorBAT },
  { abbr: 'CEL',  logo: condorCEL },
  { abbr: 'CHA',  logo: condorCHA },
  { abbr: 'COM',  logo: condorCOM },
  { abbr: 'DIS',  logo: condorDIS },
  { abbr: 'LOG',  logo: condorLOG },
  { abbr: 'RRHH', logo: condorRRHH },
];

const CCtx = createContext(null);
const useC = () => useContext(CCtx);

/* ─── animation helper ─── */
function Reveal({ children, delay = 0, duration = 1.0, y = 26, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ─── section wrapper ─── */
function CSection({ children, py = 128, surface = false }) {
  const { c } = useC();
  return (
    <section style={{ background: surface ? c.surface : c.bg, paddingTop: py, paddingBottom: py }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', paddingInline: 'clamp(20px, 5vw, 80px)' }}>
        {children}
      </div>
    </section>
  );
}

function SectionTag({ number, label }) {
  const { c } = useC();
  return (
    <Reveal>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 60 }}>
        <span style={{ fontFamily: LABEL, fontSize: 12, letterSpacing: '0.26em', color: c.gold, textTransform: 'uppercase', fontWeight: 500 }}>
          {String(number).padStart(2, '0')}
        </span>
        <div style={{ flex: 1, height: 1, background: c.borderAccent }} />
        <span style={{ fontFamily: LABEL, fontSize: 12, letterSpacing: '0.22em', color: c.textMuted, textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
    </Reveal>
  );
}


function Title({ children, size = 'clamp(30px, 4.4vw, 52px)', style = {} }) {
  const { c } = useC();
  return (
    <h2 style={{ fontFamily: DISPLAY, fontSize: size, fontWeight: 700, lineHeight: 1.08, color: c.text, letterSpacing: '-0.01em', textWrap: 'balance', ...style }}>
      {children}
    </h2>
  );
}

function Body({ items }) {
  const { c } = useC();
  const arr = Array.isArray(items) ? items : [items];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {arr.map((p, i) => (
        <p key={i} style={{ fontFamily: BODY, fontWeight: 300, fontSize: 16, lineHeight: 1.75, color: c.textSoft, maxWidth: '60ch' }}>
          {p}
        </p>
      ))}
    </div>
  );
}

function CImage({ src, alt, ratio = '4 / 5' }) {
  const { c } = useC();
  return (
    <div style={{ width: '100%', aspectRatio: ratio, overflow: 'hidden', border: `1px solid ${c.border}` }}>
      <img src={src} alt={alt} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  );
}


/* ─────────────────────────────────────────
   HERO
   ───────────────────────────────────────── */


const BRAND_SKILLS = ['Figma', 'Illustrator', 'Photoshop'];

function Hero() {
  const { t, variant } = useC();
  const brand = variant === 'brand';
  const project = caseStudies.candelaria;
  const links = brand
    ? [
        { label: t('case.instagram'), href: project.instagram },
        { label: t('case.siteCase'), to: '/projects/candelaria-website' },
      ]
    : [
        { label: t('case.visit'), href: project.site },
        { label: t('case.code'), href: project.code },
      ];
  return (
    <CaseHero
      kicker={t(brand ? 'candelaria.brandPage.tag' : 'candelaria.tag')}
      h1={t(brand ? 'candelaria.brandPage.title' : 'candelaria.title')}
      sub={t(brand ? 'candelaria.brandPage.subtitle' : 'candelaria.subtitle')}
      meta={[
        { label: t('candelaria.sectionRoleLabel'), value: t(brand ? 'candelaria.brandPage.role' : 'candelaria.role') },
        { label: t('candelaria.sectionTimelineLabel'), value: `${t('candelaria.period')} · ${t('candelaria.status')}` },
      ]}
      tools={brand ? BRAND_SKILLS : project.skills}
      links={links}
      media={condorMain}
    />
  );
}


/* ─────────────────────────────────────────
   SUMMARY
   ───────────────────────────────────────── */
function SummarySection({ number }) {
  const { t } = useC();
  return (
    <CSection surface>
      <SectionTag number={number} label={t('candelaria.summaryKicker')} />
      <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-16 items-start">
        <div className="md:col-span-7">
          <Reveal><Title>{t('candelaria.summaryTitle')}</Title></Reveal>
          <Reveal delay={0.12}><div style={{ marginTop: 28 }}><Body items={t('candelaria.summaryParas')} /></div></Reveal>
        </div>
        <div className="md:col-span-5">
          <Reveal delay={0.1} duration={1.2}><CImage src={summaryImg} alt="Candelaria — overview" ratio="4 / 5" /></Reveal>
        </div>
      </div>
    </CSection>
  );
}

/* ─────────────────────────────────────────
   MY ROLE
   ───────────────────────────────────────── */
function RoleSection({ number }) {
  const { t, variant } = useC();
  const brand = variant === 'brand';
  // The first paragraph frames the group; the second is the design team, the
  // third the site. Each page keeps the half that is its own.
  const paras = t('candelaria.myRoleParas');
  const items = brand ? paras.slice(0, 2) : [paras[0], paras[2]];
  return (
    <CSection>
      <SectionTag number={number} label={t('candelaria.myRoleKicker')} />
      <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-16 items-start">
        <div className="md:col-span-5 md:order-1">
          <Reveal delay={0.1} duration={1.2}><CImage src={roleImg} alt="Design team — Candelaria" ratio="1 / 1" /></Reveal>
        </div>
        <div className="md:col-span-7 md:order-2">
          <Reveal><Title>{t(brand ? 'candelaria.brandPage.roleTitle' : 'candelaria.myRoleTitle')}</Title></Reveal>
          <Reveal delay={0.12}><div style={{ marginTop: 28 }}><Body items={items} /></div></Reveal>
        </div>
      </div>
    </CSection>
  );
}

/* ─────────────────────────────────────────
   THE TEAM — 7 condors
   ───────────────────────────────────────── */
function TeamCard({ meta, name, role, index }) {
  const { c } = useC();
  const ref = useRef(null);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.07, ease: EASE }}
      className="group"
      style={{ background: c.card, border: `1px solid ${c.border}`, padding: '28px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden', transition: 'border-color 260ms ease, transform 260ms ease' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = TEAM_COLOR; e.currentTarget.style.transform = 'translateY(-4px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 0%, color-mix(in srgb, ${TEAM_COLOR} 13%, transparent) 0%, transparent 60%)`, opacity: 0, transition: 'opacity 260ms ease' }} className="group-hover:opacity-100" />
      <div style={{ position: 'relative', width: 96, height: 96, margin: '0 auto 18px' }}>
        <img src={meta.logo} alt={`${name} condor`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <p style={{ position: 'relative', fontFamily: LABEL, fontSize: 12, letterSpacing: '0.22em', color: TEAM_COLOR, textTransform: 'uppercase', fontWeight: 500, marginBottom: 6 }}>
        {meta.abbr}
      </p>
      <h3 style={{ position: 'relative', fontFamily: DISPLAY, fontSize: 17, fontWeight: 700, color: c.text, marginBottom: 8 }}>{name}</h3>
      <p style={{ position: 'relative', fontFamily: BODY, fontWeight: 300, fontSize: 16.5, lineHeight: 1.6, color: c.textMuted }}>{role}</p>
    </motion.div>
  );
}

function TeamSection({ number }) {
  const { c, t } = useC();
  const teams = t('candelaria.teams');
  return (
    <CSection surface>
      <SectionTag number={number} label={t('candelaria.teamsKicker')} />
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16 items-start" style={{ marginBottom: 56 }}>
        <div className="md:col-span-6">
          <Reveal><Title>{t('candelaria.teamsTitle')}</Title></Reveal>
        </div>
        <div className="md:col-span-6">
          <Reveal delay={0.12}><div style={{ marginTop: 4 }}><Body items={[t('candelaria.teamsIntro'), t('candelaria.teamsNote')]} /></div></Reveal>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {TEAMS.map((meta, i) => (
          <TeamCard key={meta.abbr} meta={meta} name={teams[i]?.name} role={teams[i]?.role} index={i} />
        ))}
        {/* unifying gold condor tile */}
        <Reveal delay={0.24} className="col-span-2 md:col-span-1">
          <div style={{ background: c.card, border: `1px solid ${c.borderAccent}`, padding: '28px 24px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <img src={condorMain} alt="Candelaria condor" style={{ width: 96, height: 96, objectFit: 'contain', filter: `drop-shadow(0 0 20px ${c.gold}66)` }} />
            <p style={{ fontFamily: LABEL, fontSize: 12, letterSpacing: '0.2em', color: c.gold, textTransform: 'uppercase', fontWeight: 500, marginTop: 14, lineHeight: 1.6 }}>
              {t('candelaria.teamsCredit')}
            </p>
          </div>
        </Reveal>
      </div>
    </CSection>
  );
}

/* ─────────────────────────────────────────
   DESIGN DIRECTION — brand artifacts + palette
   ───────────────────────────────────────── */
function BrandSection({ number }) {
  const { c, t } = useC();
  return (
    <CSection>
      <SectionTag number={number} label={t('candelaria.brandKicker')} />
      <div style={{ maxWidth: 640, marginBottom: 48 }}>
        <Reveal><Title>{t('candelaria.brandTitle')}</Title></Reveal>
        <Reveal delay={0.12}><p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 16, lineHeight: 1.75, color: c.textSoft, marginTop: 22 }}>{t('candelaria.brandIntro')}</p></Reveal>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {t('candelaria.brandArtifacts').map((a, i) => (
          <Reveal key={i} delay={0.06 * i}>
            <div style={{ background: c.card, borderTop: `2px solid ${c.gold}`, border: `1px solid ${c.border}`, borderTopWidth: 2, padding: 26, height: '100%' }}>
              <h3 style={{ fontFamily: DISPLAY, fontSize: 19, fontWeight: 700, color: c.text, marginBottom: 12 }}>{a.title}</h3>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 16, lineHeight: 1.7, color: c.textSoft }}>{a.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.16}>
        <div style={{ marginTop: 44 }}>
          <p style={{ fontFamily: LABEL, fontSize: 12, letterSpacing: '0.22em', color: c.textMuted, textTransform: 'uppercase', marginBottom: 18 }}>
            {t('candelaria.brandPaletteLabel')}
          </p>
          <div style={{ display: 'flex', height: 64, overflow: 'hidden', gap: 3 }}>
            {CANDELARIA_BRAND_PALETTE.map((hex) => (
              <div key={hex} title={hex} style={{ flex: 1, background: hex, border: hex === CANDELARIA_BRAND_PALETTE[4] ? `1px solid ${c.border}` : undefined }} />
            ))}
          </div>
        </div>
      </Reveal>
    </CSection>
  );
}

/* ─────────────────────────────────────────
   PROBLEM
   ───────────────────────────────────────── */
function ProblemSection({ number }) {
  const { c, t } = useC();
  return (
    <CSection surface>
      <SectionTag number={number} label={t('candelaria.problemKicker')} />
      <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-16 items-start">
        <div className="md:col-span-7">
          <Reveal><Title>{t('candelaria.problemTitle')}</Title></Reveal>
          <Reveal delay={0.12}>
            <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 16, lineHeight: 1.75, color: c.textSoft, marginTop: 24, maxWidth: '58ch' }}>
              {t('candelaria.problemLead')}
            </p>
            <ul style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {t('candelaria.problemBullets').map((b, i) => <Bullet key={i}>{b}</Bullet>)}
            </ul>
          </Reveal>
        </div>
        <div className="md:col-span-5">
          <Reveal delay={0.1} duration={1.2}><CImage src={problemImg} alt="Problem framing" ratio="4 / 5" /></Reveal>
        </div>
      </div>
    </CSection>
  );
}

function Bullet({ children }) {
  const { c } = useC();
  return (
    <li style={{ position: 'relative', paddingLeft: 26, fontFamily: BODY, fontWeight: 300, fontSize: 16, lineHeight: 1.65, color: c.textSoft, maxWidth: '60ch' }}>
      <span aria-hidden style={{ position: 'absolute', left: 0, top: '0.55em', width: 10, height: 10, background: c.violet }} />
      {children}
    </li>
  );
}

/* ─────────────────────────────────────────
   PROCESS — timeline list
   ───────────────────────────────────────── */
function ProcessSection({ number }) {
  const { c, t } = useC();
  return (
    <CSection>
      <SectionTag number={number} label={t('candelaria.processKicker')} />
      <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-16 items-start">
        <div className="md:col-span-4">
          <div style={{ position: 'sticky', top: 120 }}>
            <Reveal><Title size="clamp(28px, 3.6vw, 42px)">{t('candelaria.processTitle')}</Title></Reveal>
            <Reveal delay={0.12}><div style={{ marginTop: 26 }} className="hidden md:block"><CImage src={processImg} alt="Process artifact" ratio="4 / 3" /></div></Reveal>
          </div>
        </div>
        <div className="md:col-span-8">
          {t('candelaria.processSteps').map((step, i) => (
            <Reveal key={step.n} delay={i * 0.06}>
              <div style={{ padding: '28px 0', borderBottom: `1px solid ${c.border}` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                  <span style={{ fontFamily: LABEL, fontSize: 14, letterSpacing: '0.2em', color: c.gold, fontWeight: 500 }}>{step.n}</span>
                  <h3 style={{ fontFamily: DISPLAY, fontSize: 21, fontWeight: 700, color: c.text }}>{step.title}</h3>
                </div>
                <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 16, lineHeight: 1.7, color: c.textSoft, marginTop: 12, marginLeft: 32 }}>{step.intro}</p>
                <ul style={{ marginTop: 16, marginLeft: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {step.bullets.map((b, k) => <Bullet key={k}>{b}</Bullet>)}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </CSection>
  );
}

/* ─────────────────────────────────────────
   FEATURES
   ───────────────────────────────────────── */
function FeaturesSection({ number }) {
  const { c, t } = useC();
  return (
    <CSection surface>
      <SectionTag number={number} label={t('candelaria.featuresKicker')} />
      <div style={{ marginBottom: 44 }}>
        <Reveal><Title>{t('candelaria.featuresTitle')}</Title></Reveal>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {t('candelaria.features').map((f, i) => (
          <Reveal key={i} delay={0.05 * i}>
            <div
              className="group"
              style={{ background: c.card, border: `1px solid ${c.border}`, padding: 28, height: '100%', transition: 'border-color 240ms ease, transform 240ms ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.borderAccent; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ width: 8, height: 8, background: c.violet }} />
                <h3 style={{ fontFamily: DISPLAY, fontSize: 19, fontWeight: 700, color: c.text }}>{f.title}</h3>
              </div>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 16, lineHeight: 1.7, color: c.textSoft }}>{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </CSection>
  );
}

/* ─────────────────────────────────────────
   TABLE (tiers + performance)
   ───────────────────────────────────────── */
function CTable({ header, rows, accentRow }) {
  const { c } = useC();
  return (
    <div style={{ overflowX: 'auto', marginTop: 24 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: BODY }}>
        <thead>
          <tr>
            {header.map((h, i) => (
              <th key={i} style={{ fontFamily: LABEL, textAlign: 'left', padding: '14px 16px', fontSize: 12, letterSpacing: '0.2em', color: c.textMuted, textTransform: 'uppercase', borderBottom: `2px solid ${c.borderAccent}`, fontWeight: 500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const accent = accentRow ? accentRow(row) : false;
            return (
              <tr key={i}>
                {row.map((cell, k) => (
                  <td key={k} style={{ padding: '14px 16px', fontSize: 14, fontWeight: accent || k === 0 ? 500 : 300, color: accent ? c.violet : c.text, borderBottom: `1px solid ${c.border}` }}>{cell}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TiersSection({ number }) {
  const { t } = useC();
  return (
    <CSection>
      <SectionTag number={number} label={t('candelaria.tiersKicker')} />
      <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-16 items-start">
        <div className="md:col-span-7">
          <Reveal><Title>{t('candelaria.tiersTitle')}</Title></Reveal>
          <Reveal delay={0.12}>
            <CTable header={t('candelaria.tiersHeader')} rows={t('candelaria.tiers')} accentRow={(r) => r[0] === 'Core'} />
          </Reveal>
        </div>
        <div className="md:col-span-5">
          <Reveal delay={0.1} duration={1.2}><CImage src={tiersImg} alt="Gamification tiers" ratio="1 / 1" /></Reveal>
        </div>
      </div>
    </CSection>
  );
}

function PerformanceSection({ number }) {
  const { t } = useC();
  return (
    <CSection surface>
      <SectionTag number={number} label={t('candelaria.perfKicker')} />
      <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-16 items-start">
        <div className="md:col-span-5 md:order-1">
          <Reveal delay={0.1} duration={1.2}><CImage src={performanceImg} alt="Performance dashboard" ratio="4 / 5" /></Reveal>
        </div>
        <div className="md:col-span-7 md:order-2">
          <Reveal><Title>{t('candelaria.perfTitle')}</Title></Reveal>
          <Reveal delay={0.12}><CTable header={t('candelaria.perfHeader')} rows={t('candelaria.perfRows')} /></Reveal>
        </div>
      </div>
    </CSection>
  );
}

/* ─────────────────────────────────────────
   SECURITY
   ───────────────────────────────────────── */
function SecuritySection({ number }) {
  const { c, t } = useC();
  return (
    <CSection>
      <SectionTag number={number} label={t('candelaria.securityKicker')} />
      <div style={{ maxWidth: 620, marginBottom: 36 }}>
        <Reveal><Title>{t('candelaria.securityTitle')}</Title></Reveal>
      </div>
      <Reveal delay={0.1}>
        <div style={{ background: c.card, border: `1px solid ${c.border}`, padding: 'clamp(24px, 3vw, 36px)' }}>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {t('candelaria.securityBullets').map((b, i) => <Bullet key={i}>{b}</Bullet>)}
          </ul>
        </div>
      </Reveal>
    </CSection>
  );
}

/* ─────────────────────────────────────────
   REFLECTIONS
   ───────────────────────────────────────── */
function ReflectionsSection({ number }) {
  const { t } = useC();
  return (
    <CSection surface>
      <SectionTag number={number} label={t('candelaria.reflectionsKicker')} />
      <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-16 items-start">
        <div className="md:col-span-7">
          <Reveal><Title>{t('candelaria.reflectionsTitle')}</Title></Reveal>
          <Reveal delay={0.12}><div style={{ marginTop: 28 }}><Body items={t('candelaria.reflectionsParas')} /></div></Reveal>
        </div>
        <div className="md:col-span-5">
          <Reveal delay={0.1} duration={1.2}><CImage src={reflectionsImg} alt="Reflections — moodboard" ratio="4 / 5" /></Reveal>
        </div>
      </div>
    </CSection>
  );
}



/* ─────────────────────────────────────────
   PAGES
   Two works out of one project: the identity and the site. They share the
   palette and the primitives above, and nothing else.
   ───────────────────────────────────────── */
function CandelariaPage({ variant, children }) {
  const { t } = useLocale();
  const c = C_LIGHT;

  return (
    <CCtx.Provider value={{ c, t, variant }}>
      <article style={{ background: c.bg, color: c.text }}>
        <Hero />
        {children}
        <NextCase slug={variant === 'brand' ? 'candelaria' : 'candelaria-website'} />
      </article>
    </CCtx.Provider>
  );
}

/** /projects/candelaria — the brand. */
export default function Candelaria() {
  return (
    <CandelariaPage variant="brand">
      <RoleSection number={1} />
      <TeamSection number={2} />
      <BrandSection number={3} />
    </CandelariaPage>
  );
}

/** /projects/candelaria-website — the site. */
export function CandelariaWebsite() {
  return (
    <CandelariaPage variant="website">
      <SummarySection number={1} />
      <RoleSection number={2} />
      <ProblemSection number={3} />
      <ProcessSection number={4} />
      <FeaturesSection number={5} />
      <TiersSection number={6} />
      <PerformanceSection number={7} />
      <SecuritySection number={8} />
      <ReflectionsSection number={9} />
    </CandelariaPage>
  );
}
