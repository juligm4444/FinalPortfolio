import { useState } from 'react'

const normalImgs = import.meta.glob('../assets/skills/Normal/*.png', {
  eager: true,
  import: 'default',
})
const hoverImgs = import.meta.glob('../assets/skills/Hovered/*.png', {
  eager: true,
  import: 'default',
})

const lookup = (folder, name) => {
  const path = Object.keys(folder).find((k) => k.endsWith(`/${name}.png`))
  return path ? folder[path] : null
}

/**
 * MiniSkills — same hover behaviour as the big Skills (image swap + scale).
 * Pass an array of skill base names matching files in
 *   /src/assets/skills/Normal/<name>.png
 *   /src/assets/skills/Hovered/<name>_hovered.png
 */
export default function MiniSkills({ skills, size = 64, gap = 10, className = '' }) {
  return (
    <ul
      className={`flex flex-wrap items-center ${className}`}
      style={{ gap }}
    >
      {skills.map((name) => (
        <li key={name}>
          <MiniSkillBadge name={name} size={size} />
        </li>
      ))}
    </ul>
  )
}

function MiniSkillBadge({ name, size }) {
  const [hover, setHover] = useState(false)
  const front = lookup(normalImgs, name)
  const back = lookup(hoverImgs, `${name}_hovered`)
  const src = hover && back ? back : front
  if (!src) return null
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
      title={name}
      className="relative shrink-0"
      style={{
        width: size,
        height: size * 1.155,
        transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        transform: hover ? 'scale(1.14)' : 'scale(1)',
        zIndex: hover ? 10 : 1,
        outline: 'none',
      }}
    >
      <img
        src={src}
        alt={name}
        className="h-full w-full select-none"
        style={{
          objectFit: 'contain',
          filter: hover ? 'drop-shadow(0 6px 14px rgba(0,0,0,0.22))' : 'none',
          transition: 'filter 220ms ease',
        }}
        draggable="false"
      />
    </div>
  )
}
