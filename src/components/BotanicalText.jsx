import { useEffect, useRef, useState } from 'react'
import { useWebGL } from '../webgl/index.js'
import './BotanicalText.css'

const PLAIN_QUERY = '(max-width: 767px), (pointer: coarse)'

/* REDESIGN §3 / ACABADO §3 — Botanical Text, the H1 of Home, About and Projects.
   Desktop only: under 768 px or with a coarse (touch) pointer the H1 is plain text.
   On desktop the scene starts after the first paint, when the main thread is idle,
   and builds its particles in slices; until it is live the plain H1 is what shows,
   in a frame of fixed height, so the swap never moves the layout. Three layers:
   1. a real heading in the DOM, visually hidden (always);
   2. plain text as the static fallback (no WebGL2, reduced motion, low-end,
      over budget, or before the scene is ready) — and what the prerender ships;
   3. the WebGL scene, loaded on demand and mounted only while the registry
      grants this component a slot (REDESIGN §4.1).
   Changing `text` (e.g. language switch) wilts the word and blooms the new one. */
export default function BotanicalText({ text, as: Tag = 'h1', size = 140, lang, id, className = '' }) {
  // Plain until proven desktop (also what the prerender ships).
  const [plain, setPlain] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia(PLAIN_QUERY)
    const on = () => setPlain(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  // Ask for a WebGL slot only after the page has loaded and the main thread is idle:
  // creating a context while the GPU process is still busy with the first paint
  // blocks the main thread for hundreds of milliseconds.
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    if (plain) return
    let cancel = () => {}
    const afterIdle = () => {
      if (typeof window.requestIdleCallback === 'function') {
        const h = window.requestIdleCallback(() => setIdle(true), { timeout: 3000 })
        cancel = () => window.cancelIdleCallback(h)
      } else {
        const h = setTimeout(() => setIdle(true), 500)
        cancel = () => clearTimeout(h)
      }
    }
    // After load, wait for a quiet second (no long task from anything else: the hero
    // scene, images decoding), then for an idle callback. Gives up waiting after 6 s.
    const onLoad = () => {
      let last = performance.now()
      let obs = null
      try {
        obs = new PerformanceObserver(() => {
          last = performance.now()
        })
        obs.observe({ type: 'longtask' })
      } catch {
        obs = null
      }
      const t0 = performance.now()
      const poll = setInterval(() => {
        const now = performance.now()
        if (now - last > 1000 || now - t0 > 6000) {
          clearInterval(poll)
          obs?.disconnect()
          afterIdle()
        }
      }, 200)
      cancel = () => {
        clearInterval(poll)
        obs?.disconnect()
      }
    }
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })
    return () => {
      window.removeEventListener('load', onLoad)
      cancel()
    }
  }, [plain])
  const { ref, active } = useWebGL({ id, disabled: plain || !idle })
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const textRef = useRef(text)
  const [live, setLive] = useState(false)

  // Scene lifetime = slot lifetime.
  useEffect(() => {
    if (!active) return
    let cancelled = false
    let scene = null
    let ro = null
    ;(async () => {
      try {
        const family = getComputedStyle(document.documentElement).getPropertyValue('--font-display')
        // The mask is drawn with the real face; measure before it has loaded and it is a fallback's shape.
        await document.fonts.load(`700 100px ${family}`)
        const { default: BotanicalScene } = await import('./BotanicalScene.js')
        if (cancelled || !canvasRef.current) return
        scene = new BotanicalScene(canvasRef.current, { text: textRef.current, maxFontSize: size })
        scene.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight)
        scene.setText(textRef.current)
        scene.start()
        ro = new ResizeObserver(() => scene.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight))
        ro.observe(canvasRef.current)
        sceneRef.current = scene
        setLive(true)
      } catch {
        // WebGL failed after all: stay on the static text.
        scene?.dispose()
        scene = null
      }
    })()
    return () => {
      cancelled = true
      ro?.disconnect()
      scene?.dispose()
      sceneRef.current = null
      setLive(false)
    }
  }, [active, size])

  // Language (or any text) change: wilt, then re-bloom.
  useEffect(() => {
    textRef.current = text
    sceneRef.current?.setText(text)
  }, [text])

  const rows = text.split('\n')
  const lines = rows.length
  const chars = Math.max(...rows.map((r) => r.length))

  return (
    <div
      ref={ref}
      className={`botanical ${className}`}
      lang={lang}
      data-webgl={live ? 'active' : 'fallback'}
      style={{ '--bt-size': `min(${size}px, 14vw)`, '--bt-lines': lines, '--bt-chars': chars }}
    >
      <Tag className="sr-only">{text}</Tag>
      {!live && (
        <p className="botanical__fallback" aria-hidden="true">
          {text}
        </p>
      )}
      <div ref={canvasRef} className="botanical__canvas" aria-hidden="true" />
    </div>
  )
}
