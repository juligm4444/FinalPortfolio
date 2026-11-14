import { forwardRef } from 'react'

/* ACABADO §3 — the surface text stands on. Text never sits directly on the
   photographic background: it goes on a veil (translucent mist, the photo reads
   faintly through) or a slab (opaque concrete, for cards and callouts). Use this
   for every section whose text would otherwise touch the photo. */
const Surface = forwardRef(function Surface({ as: Tag = 'div', tone = 'veil', className = '', children, ...rest }, ref) {
  return (
    <Tag ref={ref} className={`surface surface--${tone} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
})

export default Surface
