import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useLocale } from '../../i18n/LocaleProvider.jsx'
import { PANELS, PANEL_DIRECTION, worksByPanel } from '../../data/projects.js'
import ShowcaseStage from './ShowcaseStage.jsx'
import GlassPanel from './GlassPanel.jsx'

/**
 * /projects in full: three glass columns over two fluids, inside exactly one
 * screen — navbar, panels and a compact footer, with nothing to scroll.
 *
 * The cycle is driven from here rather than from each panel. Per-panel timers
 * meant that pointing at one column knocked it permanently out of step with
 * the other two, so a single tick advances all three together and hovering
 * only holds that tick. Whatever the reader does, the three always move as
 * one.
 *
 * The opening runs once per browser session. It is a good piece of theatre
 * the first time and a toll booth every time after, and the likeliest reason
 * to come back here is returning from a case study.
 *
 *   intro (0ms)    fluids off-canvas at opposite edges
 *   fill  (120ms)  they flow in and meet
 *   word  (1700ms) PROJECTS surfaces, coloured by whatever is under it
 *   sink  (3200ms) it submerges as the sheets rise
 *   live  (3950ms) content lands and the cycle starts
 */

const SEQUENCE = [
  { phase: 'fill', at: 120 },
  { phase: 'word', at: 1700 },
  { phase: 'sink', at: 3200 },
  { phase: 'live', at: 3950 },
]

const CYCLE_MS = 5600
const SESSION_KEY = 'juligm4.projectsIntroSeen'

function introAlreadySeen() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    // Private mode or a blocked store: treat it as seen rather than forcing
    // the animation on every navigation.
    return true
  }
}

export default function ProjectsShowcase() {
  const { t } = useLocale()
  const reduceMotion = useReducedMotion()

  const skipIntro = useMemo(() => reduceMotion || introAlreadySeen(), [reduceMotion])
  const [phase, setPhase] = useState(skipIntro ? 'live' : 'intro')
  const [activePanel, setActivePanel] = useState(null)
  const [hidden, setHidden] = useState(false)

  // One counter for all three columns. Panels derive their own index from it,
  // so they can hold different numbers of works and still turn together.
  const [tick, setTick] = useState(0)
  const [manual, setManual] = useState({})

  useEffect(() => {
    if (skipIntro) return
    const timers = SEQUENCE.map(({ phase: p, at }) => setTimeout(() => setPhase(p), at))
    timers.push(
      setTimeout(() => {
        try {
          sessionStorage.setItem(SESSION_KEY, '1')
        } catch {
          /* nothing to do — the intro simply replays next time */
        }
      }, SEQUENCE.at(-1).at),
    )
    return () => timers.forEach(clearTimeout)
  }, [skipIntro])

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const holding = activePanel !== null || hidden || phase !== 'live'

  useEffect(() => {
    if (holding) return
    const id = setInterval(() => setTick((n) => n + 1), CYCLE_MS)
    return () => clearInterval(id)
  }, [holding])

  /**
   * A manual step shifts that column's offset from the shared tick. The
   * column stays on the common clock — it just sits at a different place in
   * its own list, which is what lets someone browse one column by hand
   * without the set falling out of step afterwards.
   */
  const stepPanel = useCallback((panel, delta) => {
    setManual((m) => ({ ...m, [panel]: (m[panel] ?? 0) + delta }))
  }, [])

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'var(--showcase-h)' }}>
      <ShowcaseStage phase={phase} wordVisible={phase === 'word'} />

      <div className="relative flex h-full w-full flex-col lg:flex-row">
        {PANELS.map((category, i) => (
          <GlassPanel
            key={category}
            category={category}
            works={worksByPanel(category)}
            direction={PANEL_DIRECTION[category]}
            index={i}
            cursorSeed={tick + (manual[category] ?? 0)}
            active={activePanel === category}
            revealed={phase === 'sink' || phase === 'live'}
            contentIn={phase === 'live'}
            onActivate={() => setActivePanel(category)}
            onRelease={() => setActivePanel(null)}
            onStep={(delta) => stepPanel(category, delta)}
            t={t}
          />
        ))}
      </div>
    </div>
  )
}
