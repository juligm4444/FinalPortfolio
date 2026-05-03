import { useEffect, useRef, useState } from 'react'

const PILLAR_WIDTH = 168
const STEP = 90 // each enter triggers a single quarter-turn
const T_ROT = 700 // ms

const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)

export default function PillarsBackground() {
  const [count, setCount] = useState(0)
  const wrappersRef = useRef([])
  const anglesRef = useRef([]) // accumulated angle per pillar
  const tokensRef = useRef([]) // monotonic token per pillar (for shade rAF)
  const prevIdxRef = useRef(-1)

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth
      setCount(Math.ceil(w / PILLAR_WIDTH) + 2)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  // reset state buffers when count changes
  useEffect(() => {
    if (!count) return
    anglesRef.current = Array(count).fill(0)
    tokensRef.current = Array(count).fill(0)
    prevIdxRef.current = -1
  }, [count])

  // Mouse tracking — figure out which pillar the mouse is over and which side
  // it came from. Trigger a single 90° rotation per crossing.
  useEffect(() => {
    if (!count) return

    const animateShade = (idx) => {
      const myToken = (tokensRef.current[idx] || 0) + 1
      tokensRef.current[idx] = myToken
      const start = performance.now()
      const el = wrappersRef.current[idx]
      if (!el) return
      const tick = (now) => {
        if (tokensRef.current[idx] !== myToken) return
        const t = (now - start) / T_ROT
        if (t >= 1) {
          el.style.setProperty('--shade', '0')
          return
        }
        // sin curve peaks mid-rotation, returns to 0
        const v = Math.sin(Math.min(t, 1) * Math.PI) * 0.85
        el.style.setProperty('--shade', v.toFixed(3))
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const rotatePillar = (idx, fromLeft) => {
      const el = wrappersRef.current[idx]
      if (!el) return
      // direction: mouse coming from the LEFT pushes the pillar clockwise
      // (positive Y rotation in CSS); from the RIGHT pushes it the other way.
      const delta = fromLeft ? STEP : -STEP
      anglesRef.current[idx] = (anglesRef.current[idx] || 0) + delta
      el.style.transition = `transform ${T_ROT}ms cubic-bezier(0.65, 0, 0.35, 1)`
      el.style.transform = `rotateY(${anglesRef.current[idx]}deg)`
      animateShade(idx)
    }

    const onMove = (e) => {
      const x = e.clientX
      const idx = Math.floor(x / PILLAR_WIDTH)
      if (idx < 0 || idx >= count) {
        prevIdxRef.current = -1
        return
      }
      if (idx === prevIdxRef.current) return
      const prev = prevIdxRef.current
      prevIdxRef.current = idx
      // First entry of the session — direction undecidable. Default to "from left".
      const fromLeft = prev === -1 ? true : idx > prev
      rotatePillar(idx, fromLeft)
    }

    const onLeave = () => {
      prevIdxRef.current = -1
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [count])

  return (
    <div
      aria-hidden="true"
      className="fixed z-0 pointer-events-none"
      style={{
        top: -20,
        bottom: -20,
        left: 0,
        right: 0,
        perspective: '2400px',
        perspectiveOrigin: '50% 40%',
      }}
    >
      <div className="absolute inset-0 flex">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="relative h-full"
            style={{
              width: `${PILLAR_WIDTH}px`,
              flex: '0 0 auto',
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              ref={(el) => (wrappersRef.current[i] = el)}
              style={{
                transformStyle: 'preserve-3d',
                position: 'absolute',
                inset: 0,
                willChange: 'transform',
                transform: 'rotateY(0deg)',
              }}
            >
              <Face transform={`translateZ(${PILLAR_WIDTH / 2}px)`} />
              <Face transform={`rotateY(90deg) translateZ(${PILLAR_WIDTH / 2}px)`} />
              <Face transform={`rotateY(180deg) translateZ(${PILLAR_WIDTH / 2}px)`} />
              <Face transform={`rotateY(-90deg) translateZ(${PILLAR_WIDTH / 2}px)`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Face({ transform }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        transform,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        backgroundColor: 'var(--pillar)',
        boxShadow:
          'inset -1px 0 0 color-mix(in srgb, var(--fg) 9%, transparent), inset 1px 0 0 color-mix(in srgb, var(--bg) 60%, transparent)',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, transparent 35%, var(--pillar-shade) 100%)',
          opacity: 'var(--shade, 0)',
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}
