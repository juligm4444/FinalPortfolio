import { useMemo, useState } from 'react';
import { useLocale } from '../i18n/LocaleProvider.jsx';

const normalImgs = import.meta.glob('../assets/skills/Normal/*.png', {
  eager: true,
  import: 'default',
});
const hoverImgs = import.meta.glob('../assets/skills/Hovered/*.png', {
  eager: true,
  import: 'default',
});

const lookup = (folder, name) => {
  const path = Object.keys(folder).find((k) => k.endsWith(`/${name}.png`));
  return path ? folder[path] : null;
};

const skill = (name, label) => ({
  name,
  label,
  normal: lookup(normalImgs, name),
  hover: lookup(hoverImgs, `${name}_hovered`),
});

const CATEGORIES = {
  Design: [
    skill('Figma', 'Figma'),
    skill('Framer', 'Framer'),
    skill('Illustrator', 'Illustrator'),
    skill('Photoshop', 'Photoshop'),
    skill('Unreal', 'Unreal'),
    skill('Unity', 'Unity'),
  ],
  Development: [
    skill('React', 'React'),
    skill('Html', 'HTML'),
    skill('Javascript', 'JavaScript'),
    skill('Css', 'CSS'),
    skill('Angular', 'Angular'),
    skill('Tailwind', 'Tailwind'),
    skill('Python', 'Python'),
    skill('Java', 'Java'),
    skill('Sql', 'SQL'),
    skill('Mongo', 'Mongo'),
    skill('Flutter', 'Flutter'),
    skill('AndroidStudio', 'Android Studio'),
    skill('Django', 'Django'),
  ],
  Tools: [skill('Git', 'Git'), skill('Vscode', 'VS Code'), skill('Claude', 'Claude')],
};

// "All" — order chosen so the honeycomb (6/7/6/3) tiles cleanly
const ALL_ORDER = [
  // row 1 (6)
  'Figma',
  'Python',
  'Javascript',
  'React',
  'Css',
  'Html',
  // row 2 (7)
  'Mongo',
  'Tailwind',
  'Java',
  'Framer',
  'Git',
  'Sql',
  'AndroidStudio',
  // row 3 (6)
  'Illustrator',
  'Photoshop',
  'Angular',
  'Django',
  'Claude',
  'Flutter',
  // row 4 (3 — centered)
  'Unity',
  'Unreal',
  'Vscode',
];

const ALL = ALL_ORDER.map((n) => {
  for (const cat of Object.values(CATEGORIES)) {
    const found = cat.find((s) => s.name === n);
    if (found) return found;
  }
  return null;
}).filter(Boolean);

const TABS = [
  { key: 'All', i18n: 'about.filters.all' },
  { key: 'Design', i18n: 'about.filters.design' },
  { key: 'Development', i18n: 'about.filters.development' },
  { key: 'Tools', i18n: 'about.filters.tools' },
];

// honeycomb pattern: alternating 6 / 7 / 6 / 7 — last row simply gets fewer items, centered
const buildRows = (skills) => {
  const rows = [];
  let i = 0;
  let big = true; // start with 6
  while (i < skills.length) {
    const target = big ? 6 : 7;
    const slice = skills.slice(i, i + target);
    rows.push(slice);
    i += slice.length;
    big = !big;
  }
  return rows;
};

export default function Skills() {
  const { t } = useLocale();
  const [active, setActive] = useState('All');

  const skills = useMemo(() => {
    if (active === 'All') return ALL;
    return CATEGORIES[active];
  }, [active]);

  const rows = useMemo(() => buildRows(skills), [skills]);

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-24 md:py-32 md:px-8">
      <header className="mb-12 max-w-[60ch]">
        <p
          className="font-nav uppercase"
          style={{ color: 'var(--fg-muted)', fontSize: 12, letterSpacing: '0.22em' }}
        >
          {t('about.stackKicker')}
        </p>
        <h2
          className="mt-3 font-display"
          style={{
            color: 'var(--fg)',
            fontSize: 'clamp(30px, 3.8vw, 48px)',
            lineHeight: 1.1,
            fontWeight: 700,
          }}
        >
          {t('about.stackTitle')}
        </h2>
      </header>

      {/* Filter bar — flat, no glassmorphism */}
      <div
        className="mx-auto mb-16 flex w-full max-w-[1190px] flex-wrap items-center justify-center gap-2 overflow-hidden px-4 py-4 md:flex-nowrap md:justify-between md:px-36"
        style={{
          background: 'transparent',
          borderTop: '1px solid color-mix(in srgb, var(--fg) 12%, transparent)',
          borderBottom: '1px solid color-mix(in srgb, var(--fg) 12%, transparent)',
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className="filter-tab font-nav transition-all duration-200"
              data-active={isActive}
              style={{
                width: 176,
                fontSize: 24,
                lineHeight: '40px',
                fontWeight: isActive ? 700 : 400,
                background: isActive
                  ? 'linear-gradient(90deg, var(--filter-active-from) 0%, var(--filter-active-to) 100%)'
                  : 'transparent',
                color: isActive ? 'var(--filter-active-fg)' : 'var(--filter-fg)',
                // shorter, sharper drop — looks attached to the bar instead of floating
                boxShadow: isActive ? '3px 3px 0 0 rgba(12, 13, 13, 0.55)' : 'none',
                textShadow: !isActive ? '1px 1px 1px rgba(0,0,0,0.18)' : 'none',
                padding: '8px 0',
              }}
            >
              {t(tab.i18n)}
            </button>
          );
        })}
      </div>

      {/* Honeycomb */}
      <div className="flex flex-col items-center">
        {rows.map((row, rIdx) => (
          <HoneycombRow key={rIdx} skills={row} first={rIdx === 0} />
        ))}
      </div>
    </section>
  );
}

function HoneycombRow({ skills, first }) {
  // hexagons interlock vertically (point-top hex) when rows overlap by ~1/4 of height
  return (
    <div
      className="flex justify-center"
      style={{
        gap: 14,
        marginTop: first ? 0 : -38,
      }}
    >
      {skills.map((s, i) => (
        <HexSkill key={`${s.name}-${i}`} skill={s} />
      ))}
    </div>
  );
}

function HexSkill({ skill }) {
  const [hover, setHover] = useState(false);
  const src = hover && skill.hover ? skill.hover : skill.normal;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative shrink-0"
      style={{
        width: 132,
        height: 152,
        transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        transform: hover ? 'scale(1.12)' : 'scale(1)',
        zIndex: hover ? 10 : 1,
      }}
      title={skill.label}
    >
      {src && (
        <img
          src={src}
          alt={skill.label}
          className="h-full w-full select-none"
          style={{
            objectFit: 'contain',
            filter: hover ? 'drop-shadow(0 8px 18px rgba(0,0,0,0.25))' : 'none',
            transition: 'filter 220ms ease',
          }}
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      )}
    </div>
  );
}
