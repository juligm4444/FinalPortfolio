import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import './TiltCard.css'

/* V3 §F.3 — TiltCard, ported from vendor/21st/3d-card.tsx (InteractiveTravelCard):
   the same spring tilt toward the pointer (damping 15, stiffness 150, ±10.5°) and
   layers at different depths (translateZ) inside a preserve-3d card. Adapted to
   the site: the face is concrete (material A), no background photo, no dark
   overlay, no frosted glass, no lucide icons. On touch there is no tilt.
   The outer element (`as`, e.g. a link) carries the perspective and the events;
   pass its props through `outer`. */
export default function TiltCard({ as: Outer = 'div', outer = {}, className = '', children, max = 10.5 }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const spring = { damping: 15, stiffness: 150 }
  const sx = useSpring(mx, spring)
  const sy = useSpring(my, spring)
  const rotateX = useTransform(sy, [-0.5, 0.5], [`${max}deg`, `-${max}deg`])
  const rotateY = useTransform(sx, [-0.5, 0.5], [`-${max}deg`, `${max}deg`])

  const onMove = (e) => {
    if (e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }
  return (
    <Outer
      {...outer}
      className={`tilt ${outer.className ?? ''}`.trim()}
      onPointerMove={(e) => {
        onMove(e)
        outer.onPointerMove?.(e)
      }}
      onPointerLeave={(e) => {
        onLeave()
        outer.onPointerLeave?.(e)
      }}
    >
      <motion.div className={`tilt__card concrete ${className}`.trim()} style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        {children}
      </motion.div>
    </Outer>
  )
}

/** A layer of the card at depth `z` (px toward the viewer). */
export function Layer({ z = 0, as: Tag = 'div', className = '', children, style }) {
  return (
    <Tag className={`tilt__layer ${className}`.trim()} style={{ transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d', ...style }}>
      {children}
    </Tag>
  )
}
