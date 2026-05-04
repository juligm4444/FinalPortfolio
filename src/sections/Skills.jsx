import { useMemo, useState, useEffect } from 'react';
import { useLocale } from '../i18n/LocaleProvider.jsx';

function useWindowWidth() {
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const update = () => setW(window.innerWidth);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return w;
}

function getTileConfig(width) {
  if (width < 768) {
    return { w: 58, h: 67, gap: 5, rowOffset: -17, rowSizes: [4, 5], tabFontSize: 15, tabPadding: '6px 16px' };
  }
  if (width < 1024) {
    return { w: 88, h: 101, gap: 10, rowOffset: -26, rowSizes: [5, 6], tabFontSize: 18, tabPadding: '8px 20px' };
  }
  return { w: 132, h: 152, gap: 14, rowOffset: -38, rowSizes: [6, 7], tabFontSize: 24, tabPadding: '8px 0' };
}

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

// honeycomb pattern: alternating row sizes (e.g., [6, 7] or [4, 5])
const buildRows = (skills, sizes = [6, 7]) => {
  const rows = [];
  let i = 0;
  let sizeIdx = 0;
  while (i < skills.length) {
    const target = sizes[sizeIdx % sizes.length];
    const slice = skills.slice(i, i + target);
    rows.push(slice);
    i += slice.length;
    sizeIdx++;
  }
  return rows;
};

export default function Skills() {
  const { t } = useLocale();
  const [active, setActive] = useState('All');
  const windowWidth = useWindowWidth();
  const tileConfig = getTileConfig(windowWidth);

  const skills = useMemo(() => {
    if (active === 'All') return ALL;
    return CATEGORIES[active];
  }, [active]);

  const rows = useMemo(() => buildRows(skills, tileConfig.rowSizes), [skills, tileConfig.rowSizes]);

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
        className="mx-auto mb-16 flex w-full max-w-[1190px] flex-wrap items-center gap-2 overflow-hidden py-4"
        style={{
          background: 'transparent',
          borderTop: '1px solid color-mix(in srgb, var(--fg) 12%, transparent)',
          borderBottom: '1px solid color-mix(in srgb, var(--fg) 12%, transparent)',
          paddingLeft: windowWidth >= 1024 ? 144 : 16,
          paddingRight: windowWidth >= 1024 ? 144 : 16,
          justifyContent: windowWidth >= 1024 ? 'space-between' : 'center',
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          const tabWidth = windowWidth >= 1024 ? 176 : 'auto';
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className="filter-tab font-nav transition-all duration-200"
              data-active={isActive}
              style={{
                width: tabWidth,
                fontSize: tileConfig.tabFontSize,
                lineHeight: tileConfig.tabFontSize >= 20 ? '40px' : '32px',
                fontWeight: isActive ? 700 : 400,
                background: isActive
                  ? 'linear-gradient(90deg, var(--filter-active-from) 0%, var(--filter-active-to) 100%)'
                  : 'transparent',
                color: isActive ? 'var(--filter-active-fg)' : 'var(--filter-fg)',
                boxShadow: isActive ? '3px 3px 0 0 rgba(12, 13, 13, 0.55)' : 'none',
                textShadow: !isActive ? '1px 1px 1px rgba(0,0,0,0.18)' : 'none',
                padding: tileConfig.tabPadding,
                whiteSpace: 'nowrap',
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
          <HoneycombRow key={rIdx} skills={row} first={rIdx === 0} tileConfig={tileConfig} rowIndex={rIdx} category={active} />
        ))}
      </div>
    </section>
  );
}

function HoneycombRow({ skills, first, tileConfig, rowIndex, category }) {
  // hexagons interlock vertically (point-top hex) when rows overlap by ~1/4 of height
  // for Design only: odd rows shift left to align with gaps
  const isOddRow = rowIndex % 2 === 1;
  const shouldOffset = category === 'Design' && isOddRow;
  const horizontalOffset = shouldOffset ? (tileConfig.w / 2 + tileConfig.gap / 2) : 0;

  return (
    <div
      className="flex justify-center"
      style={{
        gap: tileConfig.gap,
        marginTop: first ? 0 : tileConfig.rowOffset,
        transform: horizontalOffset ? `translateX(${-horizontalOffset}px)` : 'none',
      }}
    >
      {skills.map((s, i) => (
        <HexSkill key={`${s.name}-${i}`} skill={s} tileConfig={tileConfig} />
      ))}
    </div>
  );
}

function HexSkill({ skill, tileConfig }) {
  const [hover, setHover] = useState(false);
  const src = hover && skill.hover ? skill.hover : skill.normal;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative shrink-0"
      style={{
        width: tileConfig.w,
        height: tileConfig.h,
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
