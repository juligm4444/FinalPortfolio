import { useEffect } from 'react'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import Wall from '../components/wall/Wall.jsx'
import PlushTile, { plushJob } from '../components/fur/PlushTile.jsx'
import { snapshotOnce } from '../components/fur/snapshots.js'
import { rng } from '../components/wall/rng.js'
import { TOOL_GLYPHS, toolSlug } from '../data/tools.js'
import Credentials from '../sections/Credentials.jsx'
import './Toolkit.css'

/* V4 §J — Toolkit. The tool tiles exactly as they were (88 px, same fur and
   logos), arranged like moss patches on a concrete wall: four loose clusters —
   design, front end, back end and data, 3D — with uneven spacing and small
   turns (seeded). Every tile is the same size: size never suggests skill.
   Then the eight credential cards on their own wall. */
const CLUSTERS = [
  ['Figma'],
  ['React', 'Next.js', 'Tailwind'],
  ['Python', 'Django', 'Supabase', 'SQL', 'Git'],
  ['Three.js', 'Blender', 'Unity'],
]

export default function Toolkit() {
  const { t } = useLocale()
  const listed = new Set(t('projects.tools'))
  const r = rng('toolkit-moss')

  // scripts/bake-fur.mjs renders the 88 px tool tiles through this hook.
  useEffect(() => {
    window.__furBake = { ...(window.__furBake ?? {}), tool: (name, px) => snapshotOnce(plushJob(toolSlug(name), TOOL_GLYPHS[name], px, 0, 'mist')) }
  }, [])

  return (
    <div className="kit">
      <Wall seed="toolkit-tools" className="kit__tools" aria-labelledby="kit-title">
        <h1 id="kit-title" className="kit__title">
          {t('toolkit.title')}
        </h1>
        <p className="kit__lead">{t('toolkit.lead')}</p>
        <div className="kit__moss">
          {CLUSTERS.map((names, c) => (
            <ul key={c} className="kit__patch" style={{ '--pad-top': `${Math.round(r() * 60)}px`, '--gap': `${(14 + r() * 26).toFixed(0)}px` }}>
              {names
                .filter((n) => listed.has(n))
                .map((name, i) => (
                  <li
                    key={name}
                    className="kit__tool"
                    style={{
                      transform: `translate(${((r() - 0.5) * 22).toFixed(1)}px, ${((r() - 0.5) * 26).toFixed(1)}px) rotate(${((r() - 0.5) * 12).toFixed(1)}deg)`,
                    }}
                  >
                    <PlushTile name={toolSlug(name)} glyph={TOOL_GLYPHS[name]} label={name} size={88} seed={c * 7 + i * 3} ink="mist" />
                    <span className="kit__name">{name}</span>
                  </li>
                ))}
            </ul>
          ))}
        </div>
      </Wall>
      <Credentials />
    </div>
  )
}
