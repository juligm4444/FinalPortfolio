import candelariaLogo from '../assets/images/candelaria/condor-main.webp'
import candelariaSite from '../assets/images/candelaria/website-hero.webp'
import sensewaveMark from '../assets/images/sensewave/sensewave_mark.webp'
import umbralRender from '../assets/images/umbral/config-pattern-up.webp'
import bloomLogo from '../assets/images/bloom/bloom_logo.webp'
// Authored here rather than supplied — see the note in the file itself.
import licorimetroLogo from '../assets/images/licorimetro/licorimetro_logo.svg'

/**
 * The showcase lists WORKS, not projects.
 *
 * One project can be several pieces of work with nothing in common but a
 * client: the Candelaria brand and the Candelaria website were different
 * jobs, done with different skills, and collapsing them into one card hid
 * half the effort. So each entry here is a single body of work that belongs
 * to exactly one panel, carries its own copy, tags and artwork, and links to
 * whichever case study documents it.
 *
 * `panel`   — which of the three columns it lives in.
 * `href`    — the case study. Several works may point at the same page.
 * `tagKeys` — indices into translations.<locale>.tags, so a tag reads
 *             "Furniture" or "Mobiliario" without duplicating the list here.
 */

// Left to right. No work appears twice: a reader who meets the same card in
// two columns learns that the columns do not mean anything. Where one project
// produced genuinely different jobs — the Candelaria brand and the Candelaria
// site — those are separate entries with separate names, which is not the
// same thing as listing one work twice.
export const PANELS = ['desarrollo', 'marcaux', 'producto']

/** Extremes travel down, centre travels up — the three never move as a block. */
export const PANEL_DIRECTION = {
  desarrollo: 1,
  marcaux: -1,
  producto: 1,
}

const works = [
  // ── DESARROLLO ────────────────────────────────────────────────────────
  {
    id: 'candelaria-website',
    panel: 'desarrollo',
    titleI18n: 'works.candelariaWebsite.title',
    kickerI18n: 'works.candelariaWebsite.kicker',
    descI18n: 'works.candelariaWebsite.desc',
    tagKeys: ['js', 'react', 'django', 'fullstack'],
    href: '/projects/candelaria-website',
    image: candelariaSite,
    fit: 'cover',
  },
  {
    id: 'licorimetro',
    panel: 'desarrollo',
    titleI18n: 'works.licorimetro.title',
    kickerI18n: 'works.licorimetro.kicker',
    descI18n: 'works.licorimetro.desc',
    tagKeys: ['android', 'java', 'ocr', 'mobile'],
    href: '/projects/licorimetro',
    image: licorimetroLogo,
  },
  {
    id: 'bloom',
    panel: 'marcaux',
    titleI18n: 'works.bloom.title',
    kickerI18n: 'works.bloom.kicker',
    descI18n: 'works.bloom.desc',
    tagKeys: ['uxResearch', 'ia', 'wireframing'],
    href: '/projects/bloom',
    image: bloomLogo,
  },

  // ── PRODUCTO ──────────────────────────────────────────────────────────
  {
    id: 'umbral',
    panel: 'producto',
    titleI18n: 'works.umbral.title',
    kickerI18n: 'works.umbral.kicker',
    descI18n: 'works.umbral.desc',
    tagKeys: ['threeD', 'furniture', 'productDesign'],
    href: '/projects/umbral',
    image: umbralRender,
  },
  {
    id: 'sensewave',
    panel: 'producto',
    titleI18n: 'works.sensewaveProduct.title',
    kickerI18n: 'works.sensewaveProduct.kicker',
    descI18n: 'works.sensewaveProduct.desc',
    tagKeys: ['productDesign', 'wearable', 'threeD', 'concept'],
    href: '/projects/sensewave',
    image: sensewaveMark,
  },

  // ── MARCA Y UX ────────────────────────────────────────────────────────
  {
    id: 'candelaria-brand',
    panel: 'marcaux',
    titleI18n: 'works.candelariaBrand.title',
    kickerI18n: 'works.candelariaBrand.kicker',
    descI18n: 'works.candelariaBrand.desc',
    tagKeys: ['brandDesign', 'visualIdentity', 'artDirection'],
    href: '/projects/candelaria',
    image: candelariaLogo,
  },
]

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

export function worksByPanel(panel) {
  return works.filter((w) => w.panel === panel)
}

/**
 * The three the homepage teases — one per panel, so the range is obvious
 * before anyone clicks through to /projects.
 */
export const homeFeatured = ['candelaria-website', 'umbral', 'candelaria-brand']
  .map((id) => works.find((w) => w.id === id))
  .filter(Boolean)

export default works
