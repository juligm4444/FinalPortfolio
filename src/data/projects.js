import candelariaLogo from '../assets/images/candelaria/condor-main.webp'
import candelariaSite from '../assets/images/candelaria/website-hero.webp'
import sensewaveLogo from '../assets/images/sensewave_logo.png'
import sensewaveGlasses from '../assets/images/sensewave/a3-glasses.webp'
import humbralRender from '../assets/images/humbral/config-pattern-up.webp'
// TODO: swap in the real Licorímetro and Bloom artwork once supplied.
// Until then `image: null` renders the typographic fallback in the panel.

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

// Left to right. Product sits in the middle on purpose: it is the category
// with the least obvious link to the other two, and centring it keeps the
// digital-to-visual reading order intact on either side.
export const PANELS = ['desarrollo', 'producto', 'branding']

/** Extremes travel down, centre travels up — the three never drift in sync. */
export const PANEL_DIRECTION = {
  desarrollo: 1,
  producto: -1,
  branding: 1,
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
    href: '/projects/candelaria',
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
    image: null,
  },
  {
    id: 'bloom',
    panel: 'desarrollo',
    titleI18n: 'works.bloom.title',
    kickerI18n: 'works.bloom.kicker',
    descI18n: 'works.bloom.desc',
    tagKeys: ['uxResearch', 'ia', 'wireframing'],
    href: '/projects/bloom',
    image: null,
  },

  // ── PRODUCTO ──────────────────────────────────────────────────────────
  {
    id: 'humbral',
    panel: 'producto',
    titleI18n: 'works.humbral.title',
    kickerI18n: 'works.humbral.kicker',
    descI18n: 'works.humbral.desc',
    tagKeys: ['threeD', 'furniture', 'productDesign'],
    href: '/projects/humbral',
    image: humbralRender,
  },
  {
    id: 'sensewave-product',
    panel: 'producto',
    titleI18n: 'works.sensewaveProduct.title',
    kickerI18n: 'works.sensewaveProduct.kicker',
    descI18n: 'works.sensewaveProduct.desc',
    tagKeys: ['productDesign', 'wearable', 'threeD', 'concept'],
    href: '/projects/sensewave',
    image: sensewaveGlasses,
    fit: 'cover',
  },

  // ── BRANDING ──────────────────────────────────────────────────────────
  {
    id: 'candelaria-brand',
    panel: 'branding',
    titleI18n: 'works.candelariaBrand.title',
    kickerI18n: 'works.candelariaBrand.kicker',
    descI18n: 'works.candelariaBrand.desc',
    tagKeys: ['brandDesign', 'visualIdentity', 'artDirection'],
    href: '/projects/candelaria',
    image: candelariaLogo,
  },
  {
    id: 'sensewave-brand',
    panel: 'branding',
    titleI18n: 'works.sensewaveBrand.title',
    kickerI18n: 'works.sensewaveBrand.kicker',
    descI18n: 'works.sensewaveBrand.desc',
    tagKeys: ['brandIdentity', 'speculative', 'motion'],
    href: '/projects/sensewave',
    image: sensewaveLogo,
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
  humbral: {
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
export const homeFeatured = ['candelaria-website', 'humbral', 'candelaria-brand']
  .map((id) => works.find((w) => w.id === id))
  .filter(Boolean)

export default works
