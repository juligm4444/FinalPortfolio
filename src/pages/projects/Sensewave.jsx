import { createContext, useContext, useRef, useMemo } from 'react';
import { SENSEWAVE_PALETTE } from '../../data/swatches.js';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLocale } from '../../i18n/LocaleProvider.jsx';
import a1HeroVideo from '../../assets/images/sensewave/a1-hero.mp4';
import a2Problem from '../../assets/images/sensewave/a2-problem.webp';
import a3Glasses from '../../assets/images/sensewave/a3-glasses.webp';
import a4ChillChip from '../../assets/images/sensewave/a4-chill-chip.webp';
import a5ComplexChip from '../../assets/images/sensewave/a5-complex-chip.webp';
import a13ChipSystem from '../../assets/images/sensewave/a13-chip-system.webp';
import a14Lifestyle from '../../assets/images/sensewave/a14-lifestyle.webp';
import a16Prototype from '../../assets/images/sensewave/a16-prototype.webp';
import a7Packaging from '../../assets/images/sensewave/a7-packaging.webp';
import a8ChipLabel from '../../assets/images/sensewave/a8-chip-label.webp';
import a9AccessCard from '../../assets/images/sensewave/a9-access-card.webp';

/* ─────────────────────────────────────────
   DESIGN TOKENS — read from the route's palette (cases.css)
   ───────────────────────────────────────── */

const SW_LIGHT = {
  bg:           'var(--case-bg)',
  surface:      'var(--case-surface)',
  card:         'var(--case-card)',
  accent:       'var(--case-accent)',
  violet:       'var(--case-accent-2)',
  text:         'var(--case-ink)',
  textSoft:     'var(--case-ink-soft)',
  textMuted:    'var(--case-ink-muted)',
  border:       'var(--case-border)',
  borderAccent: 'var(--case-border-accent)',
  glow:         'var(--case-glow)',
};

const EASE = [0.16, 1, 0.3, 1];

/* ─── Per-page context so sub-components don't drill props ─── */
const SWCtx = createContext(null);
const useSW = () => useContext(SWCtx);

/* ─── Animation helper ─── */
function Reveal({ children, delay = 0, duration = 1.0, y = 28, className = '' }) {
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

/* ─── Section wrapper ─── */
function CinematicSection({ children, py = 140, useSurface = false }) {
  const { sw } = useSW();
  return (
    <section style={{ background: useSurface ? sw.surface : sw.bg, paddingTop: py, paddingBottom: py }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', paddingInline: 'clamp(20px, 5vw, 80px)' }}>
        {children}
      </div>
    </section>
  );
}

/* ─── Numbered section divider ─── */
function SectionTag({ number, label }) {
  const { sw } = useSW();
  return (
    <Reveal>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 72 }}>
        <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.28em', color: sw.accent, textTransform: 'uppercase' }}>
          {String(number).padStart(2, '0')}
        </span>
        <div style={{ flex: 1, height: 1, background: sw.borderAccent }} />
        <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.22em', color: sw.textMuted, textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
    </Reveal>
  );
}

/* ─────────────────────────────────────────
   ASSET PLACEHOLDER
   Replace with real images once generated.
   ───────────────────────────────────────── */
function SWAsset({ id, label, description, ratio = '16/9', className = '' }) {
  const { sw } = useSW();
  return (
    <div
      className={className}
      style={{
        aspectRatio: ratio,
        background: sw.card,
        border: `1px solid ${sw.borderAccent}`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${sw.borderAccent} 1px, transparent 1px), linear-gradient(90deg, ${sw.borderAccent} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          opacity: 0.35,
        }}
      />
      {['tl', 'tr', 'bl', 'br'].map((c) => (
        <span key={c} aria-hidden style={{
          position: 'absolute',
          width: 18, height: 18,
          top: c.startsWith('t') ? 14 : undefined,
          bottom: c.startsWith('b') ? 14 : undefined,
          left: c.endsWith('l') ? 14 : undefined,
          right: c.endsWith('r') ? 14 : undefined,
          borderTop: c.startsWith('t') ? `1.5px solid ${sw.accent}` : undefined,
          borderBottom: c.startsWith('b') ? `1.5px solid ${sw.accent}` : undefined,
          borderLeft: c.endsWith('l') ? `1.5px solid ${sw.accent}` : undefined,
          borderRight: c.endsWith('r') ? `1.5px solid ${sw.accent}` : undefined,
        }} />
      ))}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '20px 28px' }}>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.26em', color: sw.accent, textTransform: 'uppercase', marginBottom: 10 }}>
          ASSET {id} · PENDING
        </p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: sw.text, lineHeight: 1.4, marginBottom: 8, fontWeight: 600 }}>
          {label}
        </p>
        {description && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: sw.textMuted, lineHeight: 1.65, maxWidth: '36ch' }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Deterministic ambient dots ─── */
function AmbientDots() {
  const { sw } = useSW();
  const dots = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: ((i * 37.3 + 11.7) % 100).toFixed(1),
      y: ((i * 23.7 + 5.3) % 100).toFixed(1),
      size: 0.7 + (i % 3) * 0.45,
      duration: 5 + (i % 5) * 1.6,
      delay: -(i * 0.75),
      opacity: 0.12 + (i % 4) * 0.08,
    })),
    []
  );
  return (
    <>
      <style>{`@keyframes sw-dot-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
      {dots.map((d) => (
        <span key={d.id} aria-hidden style={{
          position: 'absolute', left: `${d.x}%`, top: `${d.y}%`,
          width: d.size, height: d.size,
          background: sw.accent, borderRadius: '50%', opacity: d.opacity,
          animation: `sw-dot-float ${d.duration}s ease-in-out ${d.delay}s infinite`,
          pointerEvents: 'none',
        }} />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────
   SECTION 1 — HERO
   ───────────────────────────────────────── */
function HeroSection() {
  const { sw, t } = useSW();
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const glassY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      background: sw.bg, paddingTop: 100, paddingBottom: 80,
      paddingInline: 'clamp(20px, 5vw, 80px)',
    }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 70% 55% at 50% 38%, ${sw.glow} 0%, transparent 65%)`,
      }} />
      <AmbientDots />

      <motion.div style={{ y: glassY, width: '100%', maxWidth: 680, position: 'relative', zIndex: 2, marginBottom: 52 }}>
        <video
          autoPlay muted loop playsInline
          style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
        >
          <source src={a1HeroVideo} type="video/mp4" />
        </video>
      </motion.div>

      <motion.div style={{ opacity: textOpacity, position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 800 }}>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, delay: 0.3 }} style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.28em', color: sw.accent, textTransform: 'uppercase', marginBottom: 28 }}>
          {t('sensewave.heroPeriod')}
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.55, ease: EASE }} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6.5vw, 96px)', fontWeight: 700, lineHeight: 1.07, color: sw.text, letterSpacing: '-0.025em', marginBottom: 24 }}>
          {t('sensewave.heroH1')}
          <br />
          {t('sensewave.heroH2')}{' '}
          <em style={{ fontStyle: 'italic', color: sw.accent }}>{t('sensewave.heroHAccent')}</em>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.9 }} style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(13px, 1.4vw, 16px)', color: sw.textSoft, lineHeight: 1.85, maxWidth: '58ch', margin: '0 auto' }}>
          {t('sensewave.heroSub')}
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.0, delay: 1.2 }} style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px 20px', marginTop: 44 }}>
          {t('sensewave.heroTags').map((tag) => (
            <span key={tag} style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.18em', color: sw.textMuted, textTransform: 'uppercase', padding: '6px 14px', border: `1px solid ${sw.border}` }}>
              {tag}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 0.45, scaleY: 1 }} transition={{ duration: 1.2, delay: 1.6, ease: EASE }} aria-hidden style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', width: 1, height: 44, background: `linear-gradient(to bottom, ${sw.accent}, transparent)`, transformOrigin: 'top' }} />
    </section>
  );
}

/* ─────────────────────────────────────────
   SECTION 2 — THE HUMAN PROBLEM
   ───────────────────────────────────────── */
function HumanProblemSection() {
  const { sw, t } = useSW();
  return (
    <CinematicSection py={140} useSurface>
      <SectionTag number={2} label={t('sensewave.s2')} />
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-20 items-start">
        <div>
          <Reveal duration={1.1}>
            <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.8vw, 48px)', fontWeight: 700, lineHeight: 1.15, color: sw.text, letterSpacing: '-0.02em', margin: 0, borderLeft: `1.5px solid ${sw.accent}`, paddingLeft: 28 }}>
              "{t('sensewave.problemQuote')}"
            </blockquote>
          </Reveal>
          <Reveal delay={0.15} duration={1.0}>
            <div style={{ paddingLeft: 31, marginTop: 40 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.85, color: sw.textSoft, maxWidth: '52ch' }}>
                {t('sensewave.problemP1')}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.85, color: sw.textSoft, maxWidth: '52ch', marginTop: 20 }}>
                {t('sensewave.problemP2')}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.25} duration={1.0}>
            <div className="flex gap-10 flex-wrap" style={{ marginTop: 52, paddingLeft: 31 }}>
              {[t('sensewave.statA'), t('sensewave.statB')].map((s) => (
                <div key={s.value}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: sw.accent, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: sw.textMuted, lineHeight: 1.6, maxWidth: '18ch', marginTop: 8 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1} duration={1.2}>
          <img src={a2Problem} alt="The human problem — emotional visual" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }} />
        </Reveal>
      </div>
    </CinematicSection>
  );
}

/* ─────────────────────────────────────────
   SECTION 3 — THE TECHNOLOGY
   ───────────────────────────────────────── */
function TechnologySection() {
  const { sw, t } = useSW();
  const chips = t('sensewave.chips');
  const chipImages = [a4ChillChip, a5ComplexChip];
  return (
    <CinematicSection py={140}>
      <SectionTag number={3} label={t('sensewave.s3')} />
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-20 items-start">
        <div>
          <Reveal duration={1.1}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4.5vw, 56px)', fontWeight: 700, lineHeight: 1.1, color: sw.text, letterSpacing: '-0.02em' }}>
              {t('sensewave.techH1')}
              <br />
              <span style={{ color: sw.accent }}>{t('sensewave.techHAccent')}</span>
              <br />
              {t('sensewave.techH2')}
            </h2>
          </Reveal>
          <Reveal delay={0.15} duration={1.0}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.85, color: sw.textSoft, maxWidth: '48ch', marginTop: 24 }}>
              {t('sensewave.techP')}
            </p>
          </Reveal>
          <Reveal delay={0.2} duration={1.0}>
            <img src={a3Glasses} alt="Sense Eco glasses product render" className="mt-8" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
          </Reveal>
        </div>
        <div className="flex flex-col gap-6">
          {chips.map((chip, i) => (
            <Reveal key={chip.name} delay={0.1 + i * 0.15} duration={1.0}>
              <div style={{ background: sw.card, border: `1px solid ${sw.borderAccent}`, padding: 28 }}>
                <img src={chipImages[i]} alt={`${chip.name} chip render`} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
                <div style={{ marginTop: 22 }}>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.22em', color: sw.accent, textTransform: 'uppercase', marginBottom: 8 }}>{chip.tagline}</p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: sw.text, marginBottom: 10 }}>{chip.name}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.75, color: sw.textSoft }}>{chip.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </CinematicSection>
  );
}

/* ─────────────────────────────────────────
   SECTION 4 — THE DONOR SYSTEM
   ───────────────────────────────────────── */
function DonorCircles() {
  const { sw, t } = useSW();
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-0" style={{ paddingBlock: 48 }}>
      <motion.div
        animate={reduce ? {} : { boxShadow: [`0 0 0px color-mix(in srgb, var(--case-chip-a) 15%, transparent)`, `0 0 48px color-mix(in srgb, var(--case-chip-a) 35%, transparent)`, `0 0 0px color-mix(in srgb, var(--case-chip-a) 15%, transparent)`] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: 120, height: 120, borderRadius: '50%', border: `2px solid ${sw.accent}`, background: `radial-gradient(circle, color-mix(in srgb, var(--case-chip-a) 12%, transparent) 0%, transparent 70%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
      >
        <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.2em', color: sw.accent, textTransform: 'uppercase' }}>{t('sensewave.donorLabel')}</span>
      </motion.div>

      <div className="hidden md:block" style={{ flex: 1, maxWidth: 320, position: 'relative', height: 2, marginInline: 8 }}>
        <div style={{ height: 1, background: sw.borderAccent }} />
        <motion.div animate={reduce ? {} : { x: ['-10%', '110%'] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} aria-hidden style={{ position: 'absolute', top: -4, width: 56, height: 9, background: `linear-gradient(90deg, transparent, ${sw.accent}, transparent)`, borderRadius: 4 }} />
        <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.2em', color: sw.textMuted, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          {t('sensewave.donorTransfer')}
        </div>
      </div>

      <div className="block md:hidden" style={{ width: 1, height: 48, background: sw.borderAccent, margin: '8px 0' }} />

      <motion.div
        animate={reduce ? {} : { boxShadow: [`0 0 0px color-mix(in srgb, var(--case-chip-b) 15%, transparent)`, `0 0 48px color-mix(in srgb, var(--case-chip-b) 35%, transparent)`, `0 0 0px color-mix(in srgb, var(--case-chip-b) 15%, transparent)`] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.75 }}
        style={{ width: 120, height: 120, borderRadius: '50%', border: `2px solid ${sw.violet}`, background: `radial-gradient(circle, color-mix(in srgb, var(--case-chip-b) 12%, transparent) 0%, transparent 70%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
      >
        <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.2em', color: sw.violet, textTransform: 'uppercase' }}>{t('sensewave.recipientLabel')}</span>
      </motion.div>
    </div>
  );
}

function DonorSection() {
  const { sw, t } = useSW();
  const cards = t('sensewave.donorCards');
  return (
    <CinematicSection py={140} useSurface>
      <SectionTag number={4} label={t('sensewave.s4')} />
      <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto', marginBottom: 72 }}>
        <Reveal duration={1.1}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 700, lineHeight: 1.1, color: sw.text, letterSpacing: '-0.02em' }}>
            {t('sensewave.donorH1')}
            <br />
            <span style={{ color: sw.accent }}>{t('sensewave.donorHAccent')}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15} duration={1.0}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.85, color: sw.textSoft, marginTop: 24 }}>
            {t('sensewave.donorP')}
          </p>
        </Reveal>
      </div>
      <Reveal duration={1.2}><DonorCircles /></Reveal>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-16">
        {cards.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.1} duration={0.9}>
            <div style={{ padding: 28, border: `1px solid ${sw.border}`, height: '100%' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: sw.accent, marginBottom: 18 }}>{item.symbol}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: sw.text, marginBottom: 10 }}>{item.title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.75, color: sw.textSoft }}>{item.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </CinematicSection>
  );
}

/* ─────────────────────────────────────────
   SECTION 5 — BRAND SYSTEM
   ───────────────────────────────────────── */
function BrandSection() {
  const { sw, t } = useSW();
  const palette = SENSEWAVE_PALETTE;
  const roles = t('sensewave.typoRoles');
  return (
    <CinematicSection py={140}>
      <SectionTag number={5} label={t('sensewave.s5')} />
      <div style={{ maxWidth: 640, marginBottom: 72 }}>
        <Reveal duration={1.1}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 700, lineHeight: 1.1, color: sw.text, letterSpacing: '-0.02em' }}>
            {t('sensewave.brandH1')}
            <br />
            {t('sensewave.brandHPre')}{' '}
            <em style={{ fontStyle: 'italic', color: sw.accent }}>{t('sensewave.brandHAccent')}</em>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.85, color: sw.textSoft, marginTop: 24, maxWidth: '48ch' }}>
            {t('sensewave.brandP')}
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.22em', color: sw.textMuted, textTransform: 'uppercase', marginBottom: 20 }}>
            {t('sensewave.colorLabel')}
          </p>
          <div style={{ display: 'flex', height: 72, overflow: 'hidden', gap: 3 }}>
            {palette.map((p) => (
              <div key={p.name} title={p.name} style={{ flex: 1, background: p.hex, border: p.name === 'Cool White' ? `1px solid ${sw.border}` : undefined, position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: 8, left: 8, fontFamily: 'var(--font-body)', fontSize: 8, letterSpacing: '0.1em', color: 'rgba(238,238,245,0.35)' }}>{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div style={{ background: sw.card, border: `1px solid ${sw.border}`, padding: 'clamp(28px, 4vw, 48px)', marginBottom: 40 }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.22em', color: sw.textMuted, textTransform: 'uppercase', marginBottom: 24 }}>
            {t('sensewave.typoLabel')}
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 64px)', fontWeight: 700, lineHeight: 1.05, color: sw.text, letterSpacing: '-0.03em' }}>
            {t('sensewave.typoDisplay')}
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2.8vw, 32px)', fontWeight: 400, lineHeight: 1.2, color: sw.textSoft, fontStyle: 'italic', letterSpacing: '-0.01em', marginTop: 10 }}>
            {t('sensewave.typoSub')}
          </p>
          <div className="flex gap-8 flex-wrap mt-6">
            {roles.map((f) => (
              <div key={f.role}>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.18em', color: sw.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>{f.role}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: sw.text }}>{f.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Reveal delay={0.1} duration={1.1}>
          <img src={a7Packaging} alt="SenseWave product instructive SW__01" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
        </Reveal>
        <Reveal delay={0.2} duration={1.1}>
          <img src={a8ChipLabel} alt="SenseWave chip label CX_01" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
        </Reveal>
      </div>
    </CinematicSection>
  );
}

/* ─────────────────────────────────────────
   SECTION 6 — DIGITAL EXPERIENCE
   ───────────────────────────────────────── */
function DigitalSection() {
  const { sw, t } = useSW();
  return (
    <CinematicSection py={140} useSurface>
      <SectionTag number={6} label={t('sensewave.s6')} />
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-20 items-start">
        <Reveal duration={1.1}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 700, lineHeight: 1.1, color: sw.text, letterSpacing: '-0.02em' }}>
              {t('sensewave.digitalH1')}
              <br />
              <span style={{ color: sw.accent }}>{t('sensewave.digitalHAccent')}</span>
              <br />
              {t('sensewave.digitalH2')}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.85, color: sw.textSoft, marginTop: 24, maxWidth: '48ch' }}>
              {t('sensewave.digitalP')}
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15} duration={1.1}>
          <img src={a9AccessCard} alt="SenseWave access card" style={{ width: '100%', aspectRatio: '9/16', objectFit: 'cover', display: 'block' }} />
        </Reveal>
      </div>
    </CinematicSection>
  );
}

/* ─────────────────────────────────────────
   SECTION 7 — PHYSICAL PRODUCT
   ───────────────────────────────────────── */
function PhysicalSection() {
  const { sw, t } = useSW();
  const items = [
    { id: 'A13', label: 'Chip System — Product Photography', desc: 'Chill + Complex chips on dark surface. Macro detail.', ratio: '1/1', src: a13ChipSystem, alt: 'Chip system product photography' },
    { id: 'A14', label: 'Sense Eco Glasses — Lifestyle', desc: 'AR glasses in a real setting. Emotional, documentary-style.', ratio: '3/4', src: a14Lifestyle, alt: 'Sense Eco glasses lifestyle' },
    { id: 'A16', label: 'Prototype — Close-Up Shots', desc: 'Physical prototype detail. Honest, real. Imperfections visible.', ratio: '1/1', src: a16Prototype, alt: 'Prototype close-up' },
  ];
  return (
    <CinematicSection py={140}>
      <SectionTag number={7} label={t('sensewave.s7')} />
      <Reveal duration={1.1}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 700, lineHeight: 1.1, color: sw.text, letterSpacing: '-0.02em', marginBottom: 56 }}>
          {t('sensewave.physicalH1')}
          <br />
          <em style={{ fontStyle: 'italic', color: sw.accent }}>{t('sensewave.physicalHAccent')}</em>
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.1} duration={1.0}>
            {item.src
              ? <img src={item.src} alt={item.alt} style={{ width: '100%', aspectRatio: item.ratio, objectFit: 'cover', display: 'block' }} />
              : <SWAsset {...item} />
            }
          </Reveal>
        ))}
      </div>
    </CinematicSection>
  );
}

/* ─────────────────────────────────────────
   SECTION 8 — DESIGN PROCESS
   ───────────────────────────────────────── */
function ProcessSection() {
  const { sw, t } = useSW();
  const steps = t('sensewave.processSteps');
  return (
    <CinematicSection py={140} useSurface>
      <SectionTag number={8} label={t('sensewave.s8')} />
      <Reveal duration={1.1}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.12, color: sw.text, letterSpacing: '-0.02em', marginBottom: 56 }}>
          {t('sensewave.processH1')}
          <br />
          {t('sensewave.processHPre')}{' '}
          <em style={{ color: sw.accent }}>{t('sensewave.processHAccent')}</em>
        </h2>
      </Reveal>
      <div className="flex flex-col" style={{ maxWidth: 720 }}>
        {steps.map((step, i) => (
          <Reveal key={step.phase} delay={i * 0.08} duration={0.9}>
            <div style={{ padding: '26px 0', borderBottom: `1px solid ${sw.border}`, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24 }}>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.22em', color: step.highlight ? sw.accent : sw.textMuted, textTransform: 'uppercase', paddingTop: 3 }}>
                {step.phase}
              </span>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: sw.text, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.75, color: sw.textSoft }}>{step.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </CinematicSection>
  );
}

/* ─────────────────────────────────────────
   SECTION 10 — FINAL REFLECTION
   ───────────────────────────────────────── */
function ReflectionSection() {
  const { sw, t } = useSW();
  const tags = t('sensewave.reflTags');
  return (
    <section style={{ background: sw.bg, paddingTop: 160, paddingBottom: 120, paddingInline: 'clamp(20px, 5vw, 80px)', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${sw.glow} 0%, transparent 60%)` }} />
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <Reveal duration={1.3}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.28em', color: sw.accent, textTransform: 'uppercase', marginBottom: 32 }}>
            {t('sensewave.reflLabel')}
          </p>
          <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3.8vw, 40px)', fontWeight: 700, lineHeight: 1.18, color: sw.text, letterSpacing: '-0.02em', fontStyle: 'italic', margin: 0 }}>
            "{t('sensewave.reflQuote')}"
          </blockquote>
        </Reveal>
        <Reveal delay={0.2} duration={1.2}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.9, color: sw.textSoft, maxWidth: '52ch', margin: '40px auto 0' }}>
            {t('sensewave.reflP1')}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.9, color: sw.textSoft, maxWidth: '52ch', margin: '20px auto 0' }}>
            {t('sensewave.reflP2')}
          </p>
        </Reveal>
        <Reveal delay={0.35} duration={1.1}>
          <div className="flex justify-center flex-wrap gap-3" style={{ marginTop: 52 }}>
            {tags.map((tag, i) => (
              <span key={tag} style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', color: i === 0 ? sw.accent : sw.textMuted, textTransform: 'uppercase', padding: '6px 14px', border: `1px solid ${i === 0 ? sw.borderAccent : sw.border}` }}>
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   MAIN EXPORT
   ───────────────────────────────────────── */
export default function Sensewave() {
  const { t } = useLocale();
  const sw = SW_LIGHT;

  return (
    <SWCtx.Provider value={{ sw, t }}>
      <article style={{ background: sw.bg, color: sw.text }}>
        <HeroSection />
        <HumanProblemSection />
        <TechnologySection />
        <DonorSection />
        <BrandSection />
        <DigitalSection />
        <PhysicalSection />
        <ProcessSection />
        <ReflectionSection />
      </article>
    </SWCtx.Provider>
  );
}
