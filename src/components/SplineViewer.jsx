import { useEffect, useState } from 'react'
import { useWebGL } from '../webgl/index.js'

/**
 * Lightweight Spline embed — loads `@splinetool/viewer` once globally and
 * renders the `<spline-viewer>` custom element. No npm dependency, no React
 * wrapper.
 *
 * Usage: <SplineViewer url="https://prod.spline.design/<id>/scene.splinecode" />
 *
 * Goes through the WebGL budget (REDESIGN §4.1): the runtime loads and the
 * element mounts only while the slot is granted; leaving the viewport
 * unmounts it, which destroys its context.
 */

const SCRIPT_SRC =
  'https://unpkg.com/@splinetool/viewer@1.12.90/build/spline-viewer.js'

let scriptPromise = null
const ensureScript = () => {
  if (typeof document === 'undefined') return Promise.resolve()
  if (scriptPromise) return scriptPromise
  const existing = document.querySelector('script[data-spline-viewer]')
  if (existing) {
    scriptPromise = Promise.resolve()
    return scriptPromise
  }
  scriptPromise = new Promise((resolve) => {
    const s = document.createElement('script')
    s.type = 'module'
    s.src = SCRIPT_SRC
    s.async = true
    s.dataset.splineViewer = '1'
    s.onload = () => resolve()
    s.onerror = () => resolve()
    document.head.appendChild(s)
  })
  return scriptPromise
}

export default function SplineViewer({
  url,
  className = '',
  style = {},
  loading = 'lazy',
  ariaLabel = '3D scene',
}) {
  const [ready, setReady] = useState(false)
  const { ref, active } = useWebGL({ id: `spline:${url}` })

  useEffect(() => {
    if (!active) return
    let cancelled = false
    ensureScript().then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [active])

  // One stable wrapper carries the observer ref for both states; swapping
  // the observed node would make the observer report it as gone.
  return (
    <div
      ref={ref}
      className={className}
      style={{ width: '100%', height: '100%', background: 'transparent', ...style }}
      aria-label={ariaLabel}
      data-webgl={active && ready ? 'active' : 'fallback'}
    >
      {active && ready ? (
        <spline-viewer
          url={url}
          loading-anim
          events-target="global"
          style={{ width: '100%', height: '100%', display: 'block', background: 'transparent' }}
        />
      ) : null}
    </div>
  )
}
