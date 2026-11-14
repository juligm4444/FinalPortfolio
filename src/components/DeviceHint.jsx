/* An instruction that depends on the device (ACABADO §5.3): the pointer version where
   there is a mouse, the touch version everywhere else. Both are in the DOM; CSS shows one
   (.hint--pointer / .hint--touch in shell.css), so the prerender needs no guess. */
export default function DeviceHint({ pointer, touch, className = '' }) {
  return (
    <>
      <span className={`hint--pointer ${className}`.trim()}>{pointer}</span>
      <span className={`hint--touch ${className}`.trim()}>{touch}</span>
    </>
  )
}
