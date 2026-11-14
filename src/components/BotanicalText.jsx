import { useEffect, useRef, useState } from 'react'
import { useWebGL } from '../webgl/index.js'
import './BotanicalText.css'

/* REDESIGN §3 — Botanical Text, the H1 of each page. Three layers:
   1. a real heading in the DOM, visually hidden (always);
   2. plain text as the static fallback (no WebGL2, reduced motion, low-end,
      over budget, or before the scene is ready) — and what the prerender ships;
   3. the WebGL scene, loaded on demand and mounted only while the registry
      grants this component a slot (REDESIGN §4.1).
   Changing `text` (e.g. language switch) wilts the word and blooms the new one. */
export default function BotanicalText({ text, as: Tag = 'h1', size = 140, lang, id, className = '' }) {
  // Under ~340 px the foliage stops reading at a glance: keep the plain H1 (ACABADO §3).
  const [narrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 340)
  const { ref, active } = useWebGL({ id, disabled: narrow })
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
