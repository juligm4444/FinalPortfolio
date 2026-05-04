import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import useTypewriterSound from '../hooks/useTypewriterSound.js'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import iconPng from '../assets/identity/Icon.png'

// ============== layout constants ==============
const HERO_WIDTH_PX = 600
const WORD_LH = 76
const NAMES_BLOCK_H = WORD_LH * 3
const CUBE_SIZE = 76
const BAR_GAP = 40
const BAR_TOP = NAMES_BLOCK_H + BAR_GAP
const HERO_HEIGHT = BAR_TOP + CUBE_SIZE + 40
const HERO_PADDING = 32 // px-4 on both sides

// Right slot for the giant "4" → and afterwards the icon.
const SLOT = { left: HERO_WIDTH_PX - 220, top: 4, width: 220, height: 240 }

// Vertical (decompose) positions for the names.
const COL = {
  juli: { left: 0, top: 0 },
  g: { left: 0, top: WORD_LH },
  m: { left: 0, top: WORD_LH * 2 },
  fourSlot: {
    left: SLOT.left + SLOT.width / 2 - 38,
    top: SLOT.top + SLOT.height / 2 - 78,
  },
}

const CUBE_OFF = { left: -800, top: BAR_TOP }
const CUBE_AT_BAR = { left: 0, top: BAR_TOP, width: CUBE_SIZE, height: CUBE_SIZE }
const CUBE_BAR_EXPANDED = {
  left: 0,
  top: BAR_TOP,
  width: HERO_WIDTH_PX,
  height: CUBE_SIZE,
}

// Measure widths once with canvas so the 4 row letters never overlap.
function computeRowPositions() {
  if (typeof document === 'undefined') return null
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  ctx.font = '700 56px "Libre Baskerville", serif'
  const w = {
    juli: ctx.measureText('juli').width,
    g: ctx.measureText('g').width,
    m: ctx.measureText('m').width,
    four: ctx.measureText('4').width,
  }
  // small breathing-room between letters so they read as a single word
  // without ever colliding while still feeling like 4 independent texts
  const k = 4
  const total = w.juli + k + w.g + k + w.m + k + w.four
  const start = (HERO_WIDTH_PX - total) / 2
  let x = start
  const positions = { juli: { left: x, top: 0 } }
  x += w.juli + k
  positions.g = { left: x, top: 0 }
  x += w.g + k
  positions.m = { left: x, top: 0 }
  x += w.m + k
  positions.four = { left: x, top: 0 }
  return positions
}

export default function Hero() {
  const { t } = useLocale()
  const click = useTypewriterSound()
  const containerRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const available = el.offsetWidth
      setScale(Math.min(1, available / HERO_WIDTH_PX))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const [rowPos, setRowPos] = useState(() => computeRowPositions())
  // Recompute on font-load so positions stay accurate even before the font is ready.
  useEffect(() => {
    const recompute = () => setRowPos(computeRowPositions())
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(recompute)
    }
    recompute()
  }, [])

  const [stage, setStage] = useState('emerge')
  const [typed, setTyped] = useState({ first: 'juli', middle: 'g', last: 'm' })
  const [tagline, setTagline] = useState('')
  const [cubeAtBar, setCubeAtBar] = useState(false)
  const cubeAtBarRef = useRef(false)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    cubeAtBarRef.current = cubeAtBar
  }, [cubeAtBar])

  // listen for the global "reset hero" event fired by the back-to-top button
  useEffect(() => {
    const handler = () => setResetKey((k) => k + 1)
    window.addEventListener('juligm4:resetHero', handler)
    return () => window.removeEventListener('juligm4:resetHero', handler)
  }, [])

  const heroFirst = t('hero.first')
  const heroMiddle = t('hero.middle')
  const heroLast = t('hero.last')
  const heroTagline = t('hero.tagline')

  useEffect(() => {
    let cancelled = false
    const main = async () => {
      setStage('emerge')
      setTyped({ first: 'juli', middle: 'g', last: 'm' })
      setTagline('')
      setCubeAtBar(false)

      await wait(1700)
      if (cancelled) return
      setStage('decompose')
      await wait(1100)
      if (cancelled) return

      setStage('type')
      // 20% faster than 6 s — and the cube’s easing now has accel + bouncy decel.
      const cubeRollMs = 4800
      setTimeout(() => {
        if (!cancelled) setCubeAtBar(true)
      }, cubeRollMs)

      await typeWord('first', heroFirst, 'juli', setTyped, click, 130, () => cancelled)
      if (cancelled) return
      await wait(160)
      await typeWord('middle', heroMiddle, 'g', setTyped, click, 130, () => cancelled)
      if (cancelled) return
      await wait(160)
      await typeWord('last', heroLast, 'm', setTyped, click, 130, () => cancelled)
      if (cancelled) return

      setStage('iconReveal')

      // wait until the cube is actually at the bar before expanding
      await waitUntil(() => cubeAtBarRef.current, 50, () => cancelled)
      if (cancelled) return

      setStage('cubeExpand')
      await wait(900)
      if (cancelled) return

      setStage('cursorWait')
      await wait(900)
      if (cancelled) return

      setStage('typeTagline')
      await typeText(heroTagline, setTagline, click, 120, () => cancelled)
      if (cancelled) return
      setStage('done')
    }
    cubeAtBarRef.current = false
    main()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [click, heroFirst, heroMiddle, heroLast, heroTagline, resetKey])

  /* ---- derived state ---- */
  const cubeVisible =
    stage === 'type' ||
    stage === 'iconReveal' ||
    stage === 'cubeExpand' ||
    stage === 'cursorWait' ||
    stage === 'typeTagline' ||
    stage === 'done'

  const cubeExpanded =
    stage === 'cubeExpand' ||
    stage === 'cursorWait' ||
    stage === 'typeTagline' ||
    stage === 'done'

  const fourBigVisible = stage === 'decompose' || stage === 'type'

  const iconVisible =
    stage === 'iconReveal' ||
    stage === 'cubeExpand' ||
    stage === 'cursorWait' ||
    stage === 'typeTagline' ||
    stage === 'done'

  // "_" inside the cube. Always present once the cube is on screen.
  // Blinks ONLY when settled (cursorWait, typeTagline, done) — not while moving.
  const cursorVisible = cubeVisible
  const cursorBlinks =
    stage === 'cursorWait' || stage === 'typeTagline' || stage === 'done'

  // safe defaults until measurement runs
  const positions =
    rowPos || {
      juli: { left: 195, top: 0 },
      g: { left: 290, top: 0 },
      m: { left: 326, top: 0 },
      four: { left: 380, top: 0 },
    }

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative mx-auto flex min-h-[calc(100vh-75px)] flex-col items-center justify-center px-4 py-12">
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ maxWidth: HERO_WIDTH_PX, height: HERO_HEIGHT * scale }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: HERO_WIDTH_PX,
              minHeight: HERO_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
          {/* ============== NAMES ============== */}
          <NameSpan
            text={typed.first}
            stage={stage}
            rowPos={positions.juli}
            colPos={COL.juli}
            delay={0}
          />
          <NameSpan
            text={typed.middle}
            stage={stage}
            rowPos={positions.g}
            colPos={COL.g}
            delay={0.08}
          />
          <NameSpan
            text={typed.last}
            stage={stage}
            rowPos={positions.m}
            colPos={COL.m}
            delay={0.16}
          />

          {/* ============== "4" ============== */}
          <motion.span
            className="font-display font-bold absolute"
            style={{ color: 'var(--fg)', whiteSpace: 'pre' }}
            initial={{
              left: positions.four.left,
              top: positions.four.top,
              fontSize: 56,
              opacity: 0,
              y: 30,
              filter: 'blur(10px)',
              lineHeight: `${WORD_LH}px`,
            }}
            animate={
              stage === 'emerge'
                ? {
                    left: positions.four.left,
                    top: positions.four.top,
                    fontSize: 56,
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    lineHeight: `${WORD_LH}px`,
                    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.24 },
                  }
                : !fourBigVisible
                ? {
                    // "4" stays exactly where it landed and just fades out;
                    // the icon will then appear "out of nowhere" in the same slot.
                    left: COL.fourSlot.left,
                    top: COL.fourSlot.top,
                    fontSize: 156,
                    opacity: 0,
                    y: 0,
                    filter: 'blur(0px)',
                    lineHeight: 1,
                    transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] },
                  }
                : {
                    left: COL.fourSlot.left,
                    top: COL.fourSlot.top,
                    fontSize: 156,
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    lineHeight: 1,
                    transition: { duration: 1.0, ease: [0.65, 0, 0.35, 1] },
                  }
            }
          >
            4
          </motion.span>

          {/* ============== ICON — emerges where "4" sank ============== */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: SLOT.left,
              top: SLOT.top,
              width: SLOT.width,
              height: SLOT.height,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            initial={{ opacity: 0, scale: 0.7, filter: 'blur(8px)' }}
            animate={
              iconVisible
                ? {
                    // appears "out of nowhere" — no Y movement, just a soft pop-in
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.25 },
                  }
                : { opacity: 0, scale: 0.7, filter: 'blur(8px)' }
            }
          >
            <img
              src={iconPng}
              alt="juligm4"
              draggable="false"
              style={{
                width: 'auto',
                height: '100%',
                maxHeight: 220,
                maxWidth: '100%',
                objectFit: 'contain',
                userSelect: 'none',
                filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.18))',
              }}
            />
          </motion.div>

          {/* ============== PINK CUBE / BAR ============== */}
          <motion.div
            className="absolute"
            style={{
              background: '#FF0871',
              display: 'flex',
              alignItems: 'center',
              // tagline is always centred — same as the cube's "_" was when small
              justifyContent: 'center',
              paddingLeft: cubeExpanded ? 24 : 0,
              paddingRight: cubeExpanded ? 24 : 0,
              overflow: 'hidden',
            }}
            initial={{ ...CUBE_OFF, width: CUBE_SIZE, height: CUBE_SIZE, rotate: 0, opacity: 0 }}
            animate={
              !cubeVisible
                ? { ...CUBE_OFF, width: CUBE_SIZE, height: CUBE_SIZE, rotate: 0, opacity: 0 }
                : !cubeExpanded
                ? {
                    // Single, uninterrupted rolling animation. Final keyframe
                    // lands at left = 0; Framer holds that value until the
                    // expand stage — so the cube never disappears or snaps
                    // between phases.
                    left: [-800, 28, -6, 0],
                    rotate: [0, 1102, 1074, 1080],
                    top: CUBE_AT_BAR.top,
                    width: CUBE_SIZE,
                    height: CUBE_SIZE,
                    opacity: 1,
                    transition: {
                      duration: 4.8,
                      times: [0, 0.78, 0.91, 1],
                      ease: ['easeIn', 'easeOut', 'easeOut'],
                    },
                  }
                : {
                    ...CUBE_BAR_EXPANDED,
                    rotate: 1080,
                    opacity: 1,
                    transition: { duration: 0.85, ease: [0.65, 0, 0.35, 1] },
                  }
            }
          >
            <span
              className="font-display"
              style={{
                color: '#EDEDE8',
                fontSize: cubeExpanded ? 26 : 56,
                fontWeight: cubeExpanded ? 500 : 700,
                lineHeight: cubeExpanded ? '41.6px' : 1,
                letterSpacing: '0.02em',
                whiteSpace: 'pre',
                display: 'inline-flex',
                alignItems: 'center',
                transition:
                  'font-size 600ms cubic-bezier(0.65,0,0.35,1), font-weight 600ms ease',
              }}
            >
              {cubeExpanded ? tagline : ''}
              {cursorVisible && (
                <Cursor blink={cursorBlinks} expanded={cubeExpanded} />
              )}
            </span>
          </motion.div>
            </div>
        </div>
      </div>

    </section>
  )
}

/* =========================== building blocks =========================== */

function NameSpan({ text, stage, rowPos, colPos, delay = 0 }) {
  const inRow = stage === 'emerge'
  return (
    <motion.span
      className="font-display font-bold absolute"
      initial={{
        left: rowPos.left,
        top: rowPos.top,
        opacity: 0,
        y: 30,
        filter: 'blur(10px)',
      }}
      animate={
        inRow
          ? {
              left: rowPos.left,
              top: rowPos.top,
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
            }
          : {
              left: colPos.left,
              top: colPos.top,
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.95, ease: [0.65, 0, 0.35, 1] },
            }
      }
      style={{
        color: 'var(--fg)',
        fontSize: 56,
        lineHeight: `${WORD_LH}px`,
        whiteSpace: 'pre',
      }}
    >
      {text}
    </motion.span>
  )
}

function Cursor({ blink, expanded }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        // NO left margin — the "_" must hug the text
        marginLeft: 0,
        animation: blink ? 'juligm4-cursor-blink 900ms steps(2, end) infinite' : 'none',
        opacity: 1,
        fontFamily: '"JetBrains Mono", monospace',
        fontWeight: 800,
        fontSize: expanded ? 26 : 56,
        lineHeight: 1,
        color: '#EDEDE8',
      }}
    >
      _
      <style>{`
        @keyframes juligm4-cursor-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  )
}

/* =========================== utils =========================== */

const wait = (ms) => new Promise((res) => setTimeout(res, ms))

async function waitUntil(predicate, intervalMs, isCancelled) {
  while (!predicate()) {
    if (isCancelled?.()) return
    await wait(intervalMs)
  }
}

async function typeWord(key, target, seed, setTyped, click, perChar, isCancelled) {
  let current = seed
  if (!target.startsWith(seed)) current = ''
  const remainder = target.slice(current.length)
  for (const ch of remainder) {
    if (isCancelled?.()) return
    current += ch
    setTyped((prev) => ({ ...prev, [key]: current }))
    click()
    await wait(perChar)
  }
}

async function typeText(target, setText, click, perChar, isCancelled) {
  let current = ''
  for (const ch of target) {
    if (isCancelled?.()) return
    current += ch
    setText(current)
    click()
    await wait(perChar)
  }
}

