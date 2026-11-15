import { useEffect, useRef, useState } from 'react'
import * as registry from '../../webgl/registry.js'
import { getCapabilities } from '../../webgl/capabilities.js'
import { nextJob, settleJob, watchQueue, snapshotOnce } from './snapshots.js'

/* The off-screen studio. One hidden instance of the real fur component draws each
   queued piece in turn at its rest pose; the frame is copied to a bitmap and the
   job is settled. It holds one WebGL slot only while the queue has work, and none
   afterwards. Mounted once, in the shell. */
const SLOT = 'fur-snap'
const JOB_TIMEOUT_MS = 5000

const KINDS = {
  plush: () => import('./PlushTileCanvas.jsx'),
}

export default function FurSnapshotter() {
  const [job, setJob] = useState(null)
  const [Canvas, setCanvas] = useState(null)
  const state = useRef({ granted: false, asked: false, kind: null, busy: null })

  useEffect(() => {
    const st = state.current
    let cancelled = false
    // WebGL2 missing or a low-end device: every piece keeps its CSS fallback. Reduced
    // motion is fine here: a still image moves nothing.
    const caps = getCapabilities()
    if (!caps.allowed && caps.reason !== 'reduced-motion') return

    const pump = () => {
      if (cancelled) return
      const next = nextJob()
      if (!next) {
        if (st.asked) {
          registry.release(SLOT)
          st.asked = false
          st.granted = false
        }
        st.kind = null
        setJob(null)
        setCanvas(null)
        return
      }
      if (!st.asked) {
        st.asked = true
        registry.request(SLOT, {
          grant: () => {
            st.granted = true
            pump()
          },
          revoke: () => {
            st.granted = false
            st.asked = false
            setJob(null)
            setCanvas(null)
          },
        })
        return
      }
      if (!st.granted) return
      if (st.kind !== next.kind) {
        st.kind = next.kind
        setCanvas(null)
        KINDS[next.kind]().then((m) => {
          if (cancelled || st.kind !== next.kind) return
          setCanvas(() => m.default)
          setJob(nextJob())
        })
        return
      }
      setJob(next)
    }
    // Start once the page has painted and the main thread is free.
    let started = false
    const start = () => {
      if (started) return
      started = true
      pump()
    }
    const unwatch = watchQueue(() => (started ? pump() : null))
    const idle = window.requestIdleCallback ? window.requestIdleCallback(start, { timeout: 1500 }) : setTimeout(start, 400)
    window.__fur = { snapshot: snapshotOnce }
    return () => {
      cancelled = true
      unwatch()
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else clearTimeout(idle)
      if (st.asked) registry.release(SLOT)
      st.asked = false
      st.granted = false
    }
  }, [])

  // A job that never produces a frame (lost context, missing image) is dropped, not retried.
  useEffect(() => {
    if (!job) return
    const id = setTimeout(() => settleJob(job.key, null), JOB_TIMEOUT_MS)
    return () => clearTimeout(id)
  }, [job])

  if (!job || !Canvas) return null

  const onFrame = (glCanvas, meta) => {
    const st = state.current
    if (st.busy === job.key) return
    if (!meta.settled || meta.image === 'wait') return
    if (Math.abs(meta.cssW - job.w) > 0.5 || Math.abs(meta.cssH - job.h) > 0.5) return
    st.busy = job.key
    // Same task as the draw: the WebGL back buffer is still there to copy.
    const copy = document.createElement('canvas')
    copy.width = glCanvas.width
    copy.height = glCanvas.height
    copy.getContext('2d').drawImage(glCanvas, 0, 0)
    const key = job.key
    copy.toBlob((blob) => {
      st.busy = null
      settleJob(key, blob ? URL.createObjectURL(blob) : null)
    }, 'image/png')
  }

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', left: 0, top: 0, width: job.w, height: job.h, opacity: 0, pointerEvents: 'none', zIndex: -1, contain: 'strict' }}
    >
      <Canvas key={job.kind} {...job.props} frameTag={job.key} onFrame={onFrame} />
    </div>
  )
}
