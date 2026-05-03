import { useCallback, useEffect, useRef } from 'react'

/**
 * Synthesises a short typewriter "click" via Web Audio.
 * Browsers suspend AudioContext until a user gesture — so we install a
 * one-time global gesture listener that resumes the context as soon as the
 * user clicks/taps/keys anywhere on the page.
 */
export default function useTypewriterSound() {
  const ctxRef = useRef(null)
  const armedRef = useRef(false)

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return null
      ctxRef.current = new Ctx()
    }
    return ctxRef.current
  }, [])

  // Install a one-time interaction handler that resumes the context.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const arm = () => {
      armedRef.current = true
      const ctx = ensureCtx()
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {})
      window.removeEventListener('pointerdown', arm)
      window.removeEventListener('keydown', arm)
      window.removeEventListener('touchstart', arm)
    }
    window.addEventListener('pointerdown', arm, { once: false })
    window.addEventListener('keydown', arm, { once: false })
    window.addEventListener('touchstart', arm, { once: false })
    return () => {
      window.removeEventListener('pointerdown', arm)
      window.removeEventListener('keydown', arm)
      window.removeEventListener('touchstart', arm)
    }
  }, [ensureCtx])

  return useCallback(() => {
    const ctx = ensureCtx()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
      // still suspended — bail silently rather than queue a long backlog
      if (ctx.state === 'suspended') return
    }
    const now = ctx.currentTime
    const dur = 0.04

    // short white noise burst
    const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2200 + Math.random() * 800
    filter.Q.value = 1.4

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    noise.start(now)
    noise.stop(now + dur)
  }, [ensureCtx])
}
