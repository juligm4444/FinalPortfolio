import candelariaLogo from '../assets/images/candelaria/condor-main.webp'
import candelariaSite from '../assets/images/candelaria/website-hero.webp'
import sensewaveMark from '../assets/images/sensewave/sensewave_mark.webp'
import umbralRender from '../assets/images/umbral/config-pattern-up.webp'
import bloomLogo from '../assets/images/bloom/bloom_logo.webp'
// Authored here rather than supplied — see the note in the file itself.
import licorimetroLogo from '../assets/images/licorimetro/licorimetro_logo.svg'

import sensewaveGlasses from '../assets/images/sensewave/a3-glasses.webp'
import sensewaveChips from '../assets/images/sensewave/a13-chip-system.webp'
import umbralExploded from '../assets/images/umbral/exploded.webp'
import umbralTop from '../assets/images/umbral/view-top.webp'
import umbralSide from '../assets/images/umbral/view-side.webp'
import umbralIso from '../assets/images/umbral/view-iso.webp'
import portfolioShot from '../assets/images/portfolio/home.webp'

/**
 * Every work, in the four groups of REDESIGN §5. A work belongs to exactly one
 * group (`group` is a single value, not a list). Where one project produced
 * genuinely different jobs — the Candelaria brand and the Candelaria site —
 * those are separate works with separate names.
 *
 * `id`     — key into translations `works.<id>` (title, kicker, desc)
 * `status` — 'live' | 'delivered' | 'academic' | 'in-progress'; in-progress
 *            shows the "in progress" label
 * `href`   — the case study, or null when there is none yet
 * `site`   — an external URL to fall back on when there is no case study
 * `media`  — what each group's layout needs: a screenshot (web), a logo
 *            (digital, brand), a render + exploded view (object)
 *
 * Pending (to be added when the screenshots arrive): the current freelance
 * site and adidas × Milo J, both in the web group.
 */
export const GROUPS = ['web', 'digital', 'objeto', 'marca']

const works = [
  // ── WEB ──────────────────────────────────────────────────────────────
  {
    id: 'candelariaWebsite',
    group: 'web',
    status: 'live',
    href: '/projects/candelaria-website',
    site: 'https://www.candelaria.website/',
    media: { screenshot: candelariaSite },
  },
  {
    id: 'portfolio',
    group: 'web',
    status: 'in-progress',
    href: null,
    site: 'https://www.juligm4.com/',
    media: { screenshot: portfolioShot },
  },
  // No capture yet: the deck shows a designed concrete slab with name and status.
  {
    id: 'freelanceSite',
    group: 'web',
    status: 'in-progress',
    href: null,
    site: null,
    media: {},
  },
  {
    id: 'adidasMilo',
    group: 'web',
    status: 'soon',
    href: null,
    site: null,
    media: {},
  },

  // ── DIGITAL ──────────────────────────────────────────────────────────
  {
    id: 'licorimetro',
    group: 'digital',
    status: 'academic',
    href: '/projects/licorimetro',
    site: null,
    media: { logo: licorimetroLogo },
  },
  {
    id: 'bloom',
    group: 'digital',
    status: 'delivered',
    href: '/projects/bloom',
    site: 'https://bebloomers.com/',
    media: { logo: bloomLogo },
  },

  // ── OBJETO ───────────────────────────────────────────────────────────
  {
    id: 'umbral',
    group: 'objeto',
    status: 'academic',
    href: '/projects/umbral',
    site: null,
    media: { render: umbralRender, exploded: umbralExploded, views: [umbralTop, umbralSide, umbralIso] },
  },
  {
    id: 'sensewaveProduct',
    group: 'objeto',
    status: 'academic',
    href: '/projects/sensewave',
    site: null,
    media: { render: sensewaveGlasses, exploded: sensewaveChips, logo: sensewaveMark },
  },

  // ── MARCA ────────────────────────────────────────────────────────────
  {
    id: 'candelariaBrand',
    group: 'marca',
    status: 'live',
    href: '/projects/candelaria',
    site: null,
    media: { logo: candelariaLogo },
  },
]

export function worksByGroup(group) {
  return works.filter((w) => w.group === group)
}

/**
 * Case-study metadata, keyed by route slug.
 *
 * Kept apart from `works` on purpose: a repository URL or a tech stack belongs
 * to the project as a whole, not to one of the several works that may have
 * come out of it. The Candelaria brand and the Candelaria site are two works
 * but one codebase, and duplicating the links onto both would guarantee they
 * drift apart.
 */
export const caseStudies = {
  candelaria: {
    skills: ['React', 'Django', 'Tailwind', 'Figma', 'Python', 'Claude', 'Git', 'Vscode'],
    site: 'https://www.candelaria.website/',
    instagram: 'https://www.instagram.com/candelaria_solarcar/',
    code: 'https://github.com/juligm4444/CandelariaWebsite',
  },
  licorimetro: {
    skills: ['AndroidStudio', 'Firebase', 'Figma', 'Git'],
    site: null,
    code: 'https://github.com/juligm4444',
  },
  sensewave: {
    skills: ['Figma', 'React', 'Branding', 'Motion'],
    site: 'https://relate-work-91947002.figma.site/',
    code: null,
  },
  umbral: {
    skills: ['Figma', 'Illustrator'],
    site: null,
    code: null,
  },
  bloom: {
    skills: ['Figma'],
    site: 'https://bebloomers.com/',
    code: null,
  },
}

/**
 * The three the Herbario on the homepage presses: web, digital, object —
 * one per group, so the range is obvious before anyone clicks through.
 */
export const homeFeatured = ['candelariaWebsite', 'bloom', 'sensewaveProduct']
  .map((id) => works.find((w) => w.id === id))
  .filter(Boolean)

export default works
