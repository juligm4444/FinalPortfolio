import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import * as registry from './registry.js'
import { getCapabilities } from './capabilities.js'

/**
 * The one hook every WebGL component uses.
 *
 *   const { ref, active, reason } = useWebGL({ id: 'hero-bust' })
 *   return <div ref={ref}>{active ? <Canvas … /> : <StaticFallback />}</div>
 *
 * - `active` is false on the server and on the first client render, so
 *   prerendered HTML always carries the fallback (hydration stays clean).
 * - `ref` must sit on one stable wrapper element that exists in both states
 *   (fallback and live). Swapping the observed node reads as "left the
 *   viewport" and the slot is released.
 * - The element is observed; entering the viewport requests a slot, leaving
 *   releases it. The component must destroy its context when `active` flips
 *   back to false (unmounting the canvas does it).
 * - `reason` explains a permanent refusal: 'reduced-motion', 'no-webgl2',
 *   'low-end', or 'budget' while waiting for a slot.
 *
 * @param {{ id?: string, rootMargin?: string, disabled?: boolean }} options
 */
export function useWebGL({ id, rootMargin = '160px', disabled = false } = {}) {
  const autoId = useId()
  const key = id ?? `webgl${autoId}`
  const ref = useRef(null)
  const [active, setActive] = useState(false)
  const [reason, setReason] = useState(disabled ? 'disabled' : 'pending')

  useEffect(() => {
    const el = ref.current
    if (!el || disabled) return

    // Everything that changes state happens inside observer or registry
    // callbacks, never synchronously in the effect: the first render (and
    // the prerendered HTML) is always the fallback.
    let inView = false
    let refused = false
    const grant = () => {
      setActive(true)
      setReason('ok')
    }
    const revoke = () => {
      setActive(false)
      setReason('budget')
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (refused) return
        const caps = getCapabilities()
        if (!caps.allowed) {
          refused = true
          setReason(caps.reason)
          io.disconnect()
          return
        }
        const visible = entry.isIntersecting
        if (visible === inView) return
        inView = visible
        if (visible) {
          setReason('budget')
          registry.request(key, { grant, revoke })
        } else {
          registry.release(key)
          setActive(false)
          setReason('offscreen')
        }
      },
      { rootMargin }
    )
    io.observe(el)

    return () => {
      io.disconnect()
      registry.release(key)
    }
  }, [key, rootMargin, disabled])

  return { ref, active, reason, id: key }
}

/** Live view of the registry — used by /lab. */
export function useWebGLRegistry() {
  return useSyncExternalStore(registry.subscribe, registry.getSnapshot, registry.getSnapshot)
}
