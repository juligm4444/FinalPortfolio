import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useLocale } from '../../i18n/LocaleProvider.jsx'
import { PANELS, PANEL_DIRECTION, worksByPanel } from '../../data/projects.js'
import ShowcaseBackground from './ShowcaseBackground.jsx'
import ShowcaseWordmark from './ShowcaseWordmark.jsx'
import GlassPanel from './GlassPanel.jsx'

/**
 * /projects in full: three glass columns over two drifting crescents.
 *
 * The opening sequence runs once per browser session. It is a good piece of
 * theatre the first time and a toll booth every time after that, and the
 * likeliest reason to come back to this page is returning from a case study —
 * exactly the moment nobody wants to watch it again.
 *
 *   intro  (0ms)    crescents parked off their edges over charcoal
 *   fill   (260ms)  they swing in; the charcoal is covered
 *   word   (1500ms) PROJECTS surfaces
 *   sink   (3100ms) it submerges as the sheets rise
 *   live   (3900ms) content lands and the panels start cycling
 */

const SEQUENCE = [
  { phase: 'intro', at: 0 },
  { phase: 'fill', at: 260 },
  { phase: 'word', at: 1500 },
  { phase: 'sink', at: 3100 },
  { phase: 'live', at: 3900 },
]

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

  // Resolved once, before first paint, so there is no flash of the intro for
  // someone who has already watched it.
  const skipIntro = useMemo(() => reduceMotion || introAlreadySeen(), [reduceMotion])
  const [phase, setPhase] = useState(skipIntro ? 'live' : 'intro')
  const [activePanel, setActivePanel] = useState(null)
  const [hidden, setHidden] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    if (skipIntro) return
    timers.current = SEQUENCE.filter((s) => s.at > 0).map(({ phase: p, at }) =>
      setTimeout(() => setPhase(p), at),
    )
    const mark = setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        /* nothing to do — the intro simply replays next time */
      }
    }, SEQUENCE.at(-1).at)
    timers.current.push(mark)
    return () => timers.current.forEach(clearTimeout)
  }, [skipIntro])

  // Nothing should cycle in a tab nobody is looking at.
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const bgPhase = phase === 'intro' ? 'intro' : phase === 'fill' ? 'fill' : 'settled'
  const wordVisible = phase === 'word'
  const panelsIn = phase === 'sink' || phase === 'live'
  const contentIn = phase === 'live'

  return (
    <div className="relative w-full" style={{ height: 'var(--showcase-h)' }}>
      <ShowcaseBackground phase={bgPhase} />
      <ShowcaseWordmark visible={wordVisible} />

      <div className="relative flex h-full w-full flex-col lg:flex-row">
        {PANELS.map((category, i) => (
          <GlassPanel
            key={category}
            category={category}
            works={worksByPanel(category)}
            direction={PANEL_DIRECTION[category]}
            index={i}
            active={activePanel === category}
            paused={hidden}
            revealed={panelsIn}
            contentIn={contentIn}
            onActivate={() => setActivePanel(category)}
            onRelease={() => setActivePanel(null)}
            t={t}
          />
        ))}
      </div>
    </div>
  )
}
