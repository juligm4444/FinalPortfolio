import { useEffect, useState } from 'react'

/**
 * Lightweight Spline embed — loads `@splinetool/viewer` once globally and
 * renders the `<spline-viewer>` custom element. No npm dependency, no React
 * wrapper.
 *
 * Usage: <SplineViewer url="https://prod.spline.design/<id>/scene.splinecode" />
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

  useEffect(() => {
    let cancelled = false
    ensureScript().then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) {
    // tiny placeholder while the runtime loads
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          ...style,
        }}
        aria-label={ariaLabel}
      />
    )
  }

  return (
    <spline-viewer
      url={url}
      loading-anim
      events-target="global"
      class={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'transparent',
        ...style,
      }}
    />
  )
}
