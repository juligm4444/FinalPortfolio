import { createContext, useContext, useRef, Fragment } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLocale } from '../../i18n/LocaleProvider.jsx';
import { useTheme } from '../../theme/ThemeProvider.jsx';
import projects from '../../data/projects.js';
import MiniSkills from '../../components/MiniSkills.jsx';
import { ExternalLinkIcon, GitHubIcon } from '../../components/icons/IconSet.jsx';

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
import condorRRHH from '../../assets/images/candelaria/condor-RRHH.webp';

/* ─────────────────────────────────────────
   DESIGN TOKENS — dark aubergine / light off-white
   Sourced from the live site + brand manual.
   ───────────────────────────────────────── */
const C_DARK = {
  bg:           '#18101D',
  surface:      '#20172A',
  card:         '#291D36',
  gold:         '#FFB938',
  goldDeep:     '#F2A413',
  violet:       '#C471EA',
  violetSoft:   '#BC56EB',
  lavender:     '#B793F0',
  text:         '#ECDEF0',
  textSoft:     'rgba(236,222,240,0.64)',
  textMuted:    'rgba(236,222,240,0.40)',
  border:       'rgba(236,222,240,0.09)',
  borderAccent: 'rgba(196,113,234,0.22)',
  glow:         'rgba(196,113,234,0.55)',
  glowSoft:     'rgba(196,113,234,0.10)',
  btnText:      '#18101D',
};

const C_LIGHT = {
  bg:           '#EFEEEA',
  surface:      '#E6E4DC',
  card:         '#DDDBD1',
  gold:         '#BC8215',
  goldDeep:     '#A66E12',
  violet:       '#6D28A8',
  violetSoft:   '#8B3FD0',
  lavender:     '#7C4DB8',
  text:         '#1E0A29',
  textSoft:     'rgba(30,10,41,0.66)',
  textMuted:    'rgba(30,10,41,0.42)',
  border:       'rgba(30,10,41,0.10)',
  borderAccent: 'rgba(109,40,168,0.22)',
  glow:         'rgba(109,40,168,0.22)',
  glowSoft:     'rgba(139,63,208,0.08)',
  btnText:      '#EFEEEA',
};

const DISPLAY = '"Sansation", sans-serif';
const BODY = '"Helvetica Now", Helvetica, Arial, sans-serif';
const EASE = [0.16, 1, 0.3, 1];

const BRAND_PALETTE = [
  '#FFB938', '#3E1057', '#C471EA', '#D4BCFA', '#EFEEEA',
  '#F2A413', '#2D0E3F', '#BC56EB', '#B793F0', '#D5D5D2',
];

/* team meta — abbr → logo + signal color. Order matches translations `teams`. */
const TEAMS = [
  { abbr: 'BAT',  logo: condorBAT,  color: '#3FA34D' },
  { abbr: 'CEL',  logo: condorCEL,  color: '#4C6BE8' },
  { abbr: 'CHA',  logo: condorCHA,  color: '#C7CBD1' },
  { abbr: 'COM',  logo: condorCOM,  color: '#E8623A' },
  { abbr: 'DIS',  logo: condorDIS,  color: '#E86FA8' },
  { abbr: 'LOG',  logo: condorLOG,  color: '#35C0D8' },
  { abbr: 'RRHH', logo: condorRRHH, color: '#A24DD8' },
];

const CCtx = createContext(null);
const useC = () => useContext(CCtx);

/* ─── highlight `<<word>>` with a violet glow ─── */
function Glow({ text }) {
  const { c } = useC();
  if (typeof text !== 'string') return text;
  if (!text.includes('<<')) return text;
  const RE = /<<([^>]+)>>/g;
  const out = [];
  let last = 0, m, i = 0;
  RE.lastIndex = 0;
  while ((m = RE.exec(text))) {
    if (m.index > last) out.push(<Fragment key={`p${i++}`}>{text.slice(last, m.index)}</Fragment>);
    out.push(
      <strong key={`h${i++}`} style={{ color: c.violet, fontWeight: 700, textShadow: `0 0 22px ${c.glow}` }}>
        {m[1]}
      </strong>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={`t${i++}`}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}

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
        <span style={{ fontFamily: BODY, fontSize: 11, letterSpacing: '0.26em', color: c.gold, textTransform: 'uppercase', fontWeight: 500 }}>
          {String(number).padStart(2, '0')}
        </span>
        <div style={{ flex: 1, height: 1, background: c.borderAccent }} />
        <span style={{ fontFamily: BODY, fontSize: 11, letterSpacing: '0.22em', color: c.textMuted, textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
    </Reveal>
  );
}

function Kicker({ children }) {
  const { c } = useC();
  return (
    <p style={{ fontFamily: BODY, fontSize: 12, letterSpacing: '0.24em', color: c.gold, textTransform: 'uppercase', fontWeight: 500, marginBottom: 16 }}>
      {children}
    </p>
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
          <Glow text={p} />
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

function CButton({ href, children, variant = 'primary', Icon }) {
  const { c } = useC();
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 10, padding: '13px 24px',
    fontFamily: BODY, fontWeight: 500, fontSize: 14, letterSpacing: '0.02em',
    textDecoration: 'none', transition: 'transform 200ms ease, background 200ms ease, border-color 200ms ease',
    cursor: 'pointer',
  };
  const styles = variant === 'primary'
    ? { ...base, background: c.lavender, color: c.btnText, border: `1px solid ${c.lavender}` }
    : { ...base, background: 'transparent', color: c.text, border: `1px solid ${c.borderAccent}` };
  return (
    <a
      href={href} target="_blank" rel="noreferrer noopener"
      style={styles}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; if (variant !== 'primary') e.currentTarget.style.borderColor = c.violet; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; if (variant !== 'primary') e.currentTarget.style.borderColor = c.borderAccent; }}
    >
      {Icon && <Icon />}
      {children}
    </a>
  );
}

/* ─────────────────────────────────────────
   HERO
   ───────────────────────────────────────── */
function Hero() {
  const { c, t } = useC();
  const project = projects.find((p) => p.slug === 'candelaria');
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const condorY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const condorRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);

  return (
    <section ref={ref} style={{ position: 'relative', overflow: 'hidden', background: c.bg, paddingTop: 120, paddingBottom: 96, paddingInline: 'clamp(20px, 5vw, 80px)' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 70% 60% at 70% 20%, ${c.glowSoft} 0%, transparent 60%)` }} />
      {/* metallic condor mark */}
      <motion.img
        src={condorMain} alt="" aria-hidden
        style={{ position: 'absolute', top: '6%', right: 'clamp(-80px, -2vw, 40px)', width: 'clamp(220px, 34vw, 520px)', opacity: 0.9, y: condorY, rotate: condorRotate, pointerEvents: 'none', filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.4))' }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.2 }}
          style={{ fontFamily: BODY, fontSize: 12, letterSpacing: '0.26em', color: c.gold, textTransform: 'uppercase', fontWeight: 500 }}
        >
          {t('candelaria.tag')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
          style={{ fontFamily: DISPLAY, fontSize: 'clamp(52px, 10vw, 132px)', fontWeight: 700, lineHeight: 0.98, color: c.text, letterSpacing: '0.01em', textTransform: 'uppercase', marginTop: 26 }}
        >
          Candelaria
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1, delay: 0.6 }}
          style={{ fontFamily: DISPLAY, fontSize: 'clamp(18px, 2.4vw, 30px)', color: c.gold, letterSpacing: '0.04em', marginTop: 18, textTransform: 'uppercase', fontWeight: 400 }}
        >
          {t('candelaria.heroTagline')}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1, delay: 0.75 }}
          style={{ fontFamily: BODY, fontWeight: 300, fontSize: 'clamp(15px, 1.6vw, 18px)', color: c.textSoft, lineHeight: 1.75, maxWidth: '54ch', marginTop: 28 }}
        >
          {t('candelaria.subtitle')}
        </motion.p>

        {/* meta + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
          style={{ marginTop: 52, borderTop: `1px solid ${c.border}`, paddingTop: 36, display: 'grid', gap: 40, gridTemplateColumns: '1fr', alignItems: 'start' }}
          className="md:grid-cols-[1.4fr_1fr]"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            <Meta label={t('candelaria.sectionRoleLabel')} value={t('candelaria.role')} />
            <Meta label={t('candelaria.sectionTimelineLabel')} value={`${t('candelaria.period')} · ${t('candelaria.status')}`} />
            <div>
              <p style={{ fontFamily: BODY, fontSize: 11, letterSpacing: '0.22em', color: c.textMuted, textTransform: 'uppercase', marginBottom: 16 }}>
                {t('candelaria.stackKicker')}
              </p>
              <MiniSkills skills={project.skills} size={52} gap={10} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'stretch' }} className="md:items-end">
            <CButton href={project.site} variant="primary" Icon={ExternalLinkIcon}>{t('candelaria.ctaVisit')}</CButton>
            <CButton href={project.code} variant="outline" Icon={GitHubIcon}>{t('candelaria.ctaCode')}</CButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Meta({ label, value }) {
  const { c } = useC();
  return (
    <div>
      <p style={{ fontFamily: BODY, fontSize: 11, letterSpacing: '0.22em', color: c.textMuted, textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontFamily: DISPLAY, fontSize: 18, lineHeight: 1.4, fontWeight: 700, color: c.text, marginTop: 8 }}>{value}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUMMARY
   ───────────────────────────────────────── */
function SummarySection() {
  const { t } = useC();
  return (
    <CSection surface>
      <SectionTag number={1} label={t('candelaria.summaryKicker')} />
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
function RoleSection() {
  const { t } = useC();
  return (
    <CSection>
      <SectionTag number={2} label={t('candelaria.myRoleKicker')} />
      <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-16 items-start">
        <div className="md:col-span-5 md:order-1">
          <Reveal delay={0.1} duration={1.2}><CImage src={roleImg} alt="Design team — Candelaria" ratio="1 / 1" /></Reveal>
        </div>
        <div className="md:col-span-7 md:order-2">
          <Reveal><Title>{t('candelaria.myRoleTitle')}</Title></Reveal>
          <Reveal delay={0.12}><div style={{ marginTop: 28 }}><Body items={t('candelaria.myRoleParas')} /></div></Reveal>
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
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = meta.color; e.currentTarget.style.transform = 'translateY(-4px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 0%, ${meta.color}22 0%, transparent 60%)`, opacity: 0, transition: 'opacity 260ms ease' }} className="group-hover:opacity-100" />
      <div style={{ position: 'relative', width: 96, height: 96, margin: '0 auto 18px' }}>
        <img src={meta.logo} alt={`${name} condor`} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 0 18px ${meta.color}55)` }} />
      </div>
      <p style={{ position: 'relative', fontFamily: BODY, fontSize: 10, letterSpacing: '0.22em', color: meta.color, textTransform: 'uppercase', fontWeight: 500, marginBottom: 6 }}>
        {meta.abbr}
      </p>
      <h3 style={{ position: 'relative', fontFamily: DISPLAY, fontSize: 17, fontWeight: 700, color: c.text, marginBottom: 8 }}>{name}</h3>
      <p style={{ position: 'relative', fontFamily: BODY, fontWeight: 300, fontSize: 12.5, lineHeight: 1.6, color: c.textMuted }}>{role}</p>
    </motion.div>
  );
}

function TeamSection() {
  const { c, t } = useC();
  const teams = t('candelaria.teams');
  return (
    <CSection surface>
      <SectionTag number={3} label={t('candelaria.teamsKicker')} />
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
            <p style={{ fontFamily: BODY, fontSize: 10, letterSpacing: '0.2em', color: c.gold, textTransform: 'uppercase', fontWeight: 500, marginTop: 14, lineHeight: 1.6 }}>
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
function BrandSection() {
  const { c, t } = useC();
  return (
    <CSection>
      <SectionTag number={4} label={t('candelaria.brandKicker')} />
      <div style={{ maxWidth: 640, marginBottom: 48 }}>
        <Reveal><Title>{t('candelaria.brandTitle')}</Title></Reveal>
        <Reveal delay={0.12}><p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 16, lineHeight: 1.75, color: c.textSoft, marginTop: 22 }}>{t('candelaria.brandIntro')}</p></Reveal>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {t('candelaria.brandArtifacts').map((a, i) => (
          <Reveal key={i} delay={0.06 * i}>
            <div style={{ background: c.card, borderTop: `2px solid ${c.gold}`, border: `1px solid ${c.border}`, borderTopWidth: 2, padding: 26, height: '100%' }}>
              <h3 style={{ fontFamily: DISPLAY, fontSize: 19, fontWeight: 700, color: c.text, marginBottom: 12 }}>{a.title}</h3>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 14, lineHeight: 1.7, color: c.textSoft }}>{a.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.16}>
        <div style={{ marginTop: 44 }}>
          <p style={{ fontFamily: BODY, fontSize: 11, letterSpacing: '0.22em', color: c.textMuted, textTransform: 'uppercase', marginBottom: 18 }}>
            {t('candelaria.brandPaletteLabel')}
          </p>
          <div style={{ display: 'flex', height: 64, overflow: 'hidden', gap: 3 }}>
            {BRAND_PALETTE.map((hex) => (
              <div key={hex} title={hex} style={{ flex: 1, background: hex, border: hex === '#EFEEEA' ? `1px solid ${c.border}` : undefined }} />
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
function ProblemSection() {
  const { c, t } = useC();
  return (
    <CSection surface>
      <SectionTag number={5} label={t('candelaria.problemKicker')} />
      <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-16 items-start">
        <div className="md:col-span-7">
          <Reveal><Title>{t('candelaria.problemTitle')}</Title></Reveal>
          <Reveal delay={0.12}>
            <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 16, lineHeight: 1.75, color: c.textSoft, marginTop: 24, maxWidth: '58ch' }}>
              <Glow text={t('candelaria.problemLead')} />
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
    <li style={{ position: 'relative', paddingLeft: 26, fontFamily: BODY, fontWeight: 300, fontSize: 15, lineHeight: 1.65, color: c.textSoft, maxWidth: '60ch' }}>
      <span aria-hidden style={{ position: 'absolute', left: 0, top: '0.55em', width: 10, height: 10, background: c.violet }} />
      {children}
    </li>
  );
}

/* ─────────────────────────────────────────
   PROCESS — timeline list
   ───────────────────────────────────────── */
function ProcessSection() {
  const { c, t } = useC();
  return (
    <CSection>
      <SectionTag number={6} label={t('candelaria.processKicker')} />
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
                  <span style={{ fontFamily: BODY, fontSize: 12, letterSpacing: '0.2em', color: c.gold, fontWeight: 500 }}>{step.n}</span>
                  <h3 style={{ fontFamily: DISPLAY, fontSize: 21, fontWeight: 700, color: c.text }}>{step.title}</h3>
                </div>
                <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15, lineHeight: 1.7, color: c.textSoft, marginTop: 12, marginLeft: 32 }}>{step.intro}</p>
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
function FeaturesSection() {
  const { c, t } = useC();
  return (
    <CSection surface>
      <SectionTag number={7} label={t('candelaria.featuresKicker')} />
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
                <h3 style={{ fontFamily: DISPLAY, fontSize: 19, fontWeight: 700, color: c.text }}><Glow text={f.title} /></h3>
              </div>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 14, lineHeight: 1.7, color: c.textSoft }}><Glow text={f.body} /></p>
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
              <th key={i} style={{ textAlign: 'left', padding: '14px 16px', fontSize: 11, letterSpacing: '0.2em', color: c.textMuted, textTransform: 'uppercase', borderBottom: `2px solid ${c.borderAccent}`, fontWeight: 500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const accent = accentRow ? accentRow(row) : false;
            return (
              <tr key={i}>
                {row.map((cell, k) => (
                  <td key={k} style={{ padding: '14px 16px', fontSize: 15, fontWeight: accent || k === 0 ? 500 : 300, color: accent ? c.violet : c.text, borderBottom: `1px solid ${c.border}` }}>{cell}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TiersSection() {
  const { t } = useC();
  return (
    <CSection>
      <SectionTag number={8} label={t('candelaria.tiersKicker')} />
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

function PerformanceSection() {
  const { t } = useC();
  return (
    <CSection surface>
      <SectionTag number={9} label={t('candelaria.perfKicker')} />
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
function SecuritySection() {
  const { c, t } = useC();
  return (
    <CSection>
      <SectionTag number={10} label={t('candelaria.securityKicker')} />
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
function ReflectionsSection() {
  const { t } = useC();
  return (
    <CSection surface>
      <SectionTag number={11} label={t('candelaria.reflectionsKicker')} />
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
   FINAL CTA
   ───────────────────────────────────────── */
function FinalCTA() {
  const { c, t } = useC();
  const project = projects.find((p) => p.slug === 'candelaria');
  return (
    <section style={{ background: c.bg, paddingTop: 96, paddingBottom: 128, paddingInline: 'clamp(20px, 5vw, 80px)', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${c.glowSoft} 0%, transparent 60%)` }} />
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <img src={condorMain} alt="" aria-hidden style={{ width: 88, height: 88, objectFit: 'contain', margin: '0 auto 28px', filter: `drop-shadow(0 0 24px ${c.gold}55)` }} />
        <Title size="clamp(28px, 4vw, 44px)" style={{ marginBottom: 32 }}>{t('candelaria.title')}</Title>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14 }}>
          <CButton href={project.site} variant="primary" Icon={ExternalLinkIcon}>{t('candelaria.ctaVisit')}</CButton>
          <CButton href={project.code} variant="outline" Icon={GitHubIcon}>{t('candelaria.ctaCode')}</CButton>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   MAIN EXPORT
   ───────────────────────────────────────── */
export default function Candelaria() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const c = theme === 'dark' ? C_DARK : C_LIGHT;

  return (
    <CCtx.Provider value={{ c, t }}>
      <article style={{ background: c.bg, color: c.text }}>
        <Hero />
        <SummarySection />
        <RoleSection />
        <TeamSection />
        <BrandSection />
        <ProblemSection />
        <ProcessSection />
        <FeaturesSection />
        <TiersSection />
        <PerformanceSection />
        <SecuritySection />
        <ReflectionsSection />
        <FinalCTA />
      </article>
    </CCtx.Provider>
  );
}
