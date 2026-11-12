/* REDESIGN §4.2 — every WebGL component has a static fallback for low-end
   devices, `prefers-reduced-motion` and missing WebGL2. This module answers
   one question: may this device run WebGL at all, and if not, why. */

let webgl2Probe = null

function probeWebGL2() {
  if (webgl2Probe !== null) return webgl2Probe
  if (typeof document === 'undefined') return (webgl2Probe = false)
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true })
    webgl2Probe = Boolean(gl)
    // Free the probe context straight away; it must not count against the budget.
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    webgl2Probe = false
  }
  return webgl2Probe
}

function reducedMotion() {
  return typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
}

/* Heuristic, deliberately conservative: a device that reports little memory,
   few cores or a data-saver preference gets the static version. */
function lowEnd() {
  if (typeof navigator === 'undefined') return false
  const mem = navigator.deviceMemory
  const cores = navigator.hardwareConcurrency
  const saveData = navigator.connection?.saveData
  if (saveData) return true
  if (typeof mem === 'number' && mem <= 2) return true
  if (typeof mem === 'number' && mem <= 4 && typeof cores === 'number' && cores <= 4) return true
  return false
}

/**
 * @returns {{ allowed: boolean, reason: 'ok'|'ssr'|'no-webgl2'|'reduced-motion'|'low-end' }}
 */
export function getCapabilities() {
  if (typeof window === 'undefined') return { allowed: false, reason: 'ssr' }
  if (reducedMotion()) return { allowed: false, reason: 'reduced-motion' }
  if (!probeWebGL2()) return { allowed: false, reason: 'no-webgl2' }
  if (lowEnd()) return { allowed: false, reason: 'low-end' }
  return { allowed: true, reason: 'ok' }
}

/** Test hook: forget the cached probe (used by /lab to re-run detection). */
export function resetCapabilities() {
  webgl2Probe = null
}
