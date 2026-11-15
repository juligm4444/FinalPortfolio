import { forwardRef } from 'react'
import Growth from './Growth.jsx'
import './wall.css'

/* V4 §1 — content sits on concrete walls. One structural surface per section
   (a wall, a terrace, a slab) spanning the content width, with generous padding;
   the scene shows through the gaps between walls. Plants grow on its edges
   (Growth, seeded by `seed`). Not a box behind a paragraph: a section. */
const Wall = forwardRef(function Wall({ as: Tag = 'section', seed, className = '', children, ...rest }, ref) {
  return (
    <Tag ref={ref} className={`wall concrete ${className}`.trim()} {...rest}>
      <Growth seed={seed ?? className} />
      <div className="wall__body">{children}</div>
    </Tag>
  )
})

export default Wall
