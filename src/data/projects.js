import candelariaLogo from '../assets/images/candelaria/condor-main.webp'
import sensewaveLogo from '../assets/images/sensewave_logo.png'
import humbralConfigPattern from '../assets/images/humbral/config-pattern-up.webp'
import humbralConfigGlass from '../assets/images/humbral/config-glass-up.webp'
import humbralPatternFinal from '../assets/images/humbral/pattern-final.webp'
import sensewaveGlasses from '../assets/images/sensewave/a3-glasses.webp'
import sensewaveChips from '../assets/images/sensewave/a13-chip-system.webp'
// TODO: replace null with the actual Licorímetro logo import once the asset is ready
// import licorimetroLogo from '../assets/images/licorimetro_logo.png'

/**
 * Single source of truth for projects.
 *
 * Two orthogonal axes, deliberately kept separate:
 *   - `categories` ORGANISE the work. A project may sit in several of them —
 *     Sensewave is a digital experience, a physical object and a brand system
 *     at once, and forcing it into one box undersells it.
 *   - `tags` EXPLAIN which disciplines the project actually used. They are
 *     free-form and never drive layout.
 *   - `featured` DEMONSTRATES: the shortlist someone should see if they only
 *     have thirty seconds.
 *
 * `slug` matches the route at /projects/:slug.
 * `i18n` keys point into translations.<locale>.<key>.
 */

export const CATEGORIES = ['digital', 'product', 'visual']

/**
 * Per-category presentation. A project that lives in several categories shows
 * a different face in each lane — the Sense Eco glasses under `product`, the
 * interface under `digital` — via the optional `faces` map. Falling back to
 * the project's own `logo` and `summaryI18n` keeps single-category entries
 * free of boilerplate.
 */
const projects = [
  {
    slug: 'licorimetro',
    titleI18n: 'licorimetro.title',
    summaryI18n: 'licorimetro.subtitle',
    tag: 'Mobile · OCR',
    tags: ['UX/UI', 'Product Design', 'Research', 'Development'],
    categories: ['digital'],
    accent: '#9B2335',
    period: '2023',
    featured: true,
    href: '/projects/licorimetro',
    site: null,
    code: 'https://github.com/juligm4444',
    skills: ['AndroidStudio', 'Firebase', 'Figma', 'Git'],
    logo: null, // TODO: replace with licorimetroLogo once asset is ready
  },
  {
    slug: 'sensewave',
    titleI18n: 'sensewave.title',
    summaryI18n: 'sensewave.subtitle',
    tag: 'Neurotechnology · Brand',
    tags: ['Product Design', 'UX/UI', 'AR', '3D', 'Concept Development'],
    categories: ['product', 'digital', 'visual'],
    accent: '#8B9DE8',
    period: '2025',
    featured: true,
    href: '/projects/sensewave',
    site: 'https://relate-work-91947002.figma.site/',
    code: null,
    skills: ['Figma', 'React', 'Branding', 'Motion'],
    logo: sensewaveLogo,
    faces: {
      product: { image: sensewaveGlasses, summaryI18n: 'sensewave.faceProduct' },
      digital: { image: sensewaveChips, summaryI18n: 'sensewave.faceDigital' },
      visual: { image: sensewaveLogo, summaryI18n: 'sensewave.faceVisual' },
    },
  },
  {
    slug: 'candelaria',
    titleI18n: 'candelaria.title',
    summaryI18n: 'candelaria.subtitle',
    tag: 'Full-stack · Product',
    tags: ['Branding', 'UX/UI', 'Web Design', 'Development', 'Visual Identity'],
    categories: ['digital', 'visual'],
    accent: '#FF0871',
    period: '2025 — 2026',
    featured: true,
    href: '/projects/candelaria',
    site: 'https://www.candelaria.website/',
    code: 'https://github.com/juligm4444/CandelariaWebsite',
    skills: ['React', 'Django', 'Tailwind', 'Figma', 'Python', 'Claude', 'Git', 'Vscode'],
    logo: candelariaLogo,
    faces: {
      digital: { image: candelariaLogo, summaryI18n: 'candelaria.faceDigital' },
      visual: { image: candelariaLogo, summaryI18n: 'candelaria.faceVisual' },
    },
  },
  {
    slug: 'humbral',
    titleI18n: 'humbral.title',
    summaryI18n: 'humbral.subtitle',
    tag: 'Furniture · Modular',
    tags: ['Furniture', 'Product Design', '3D', 'Materials', 'Digital Fabrication'],
    categories: ['product', 'visual'],
    accent: '#8C6244',
    period: '2026',
    featured: true,
    href: '/projects/humbral',
    site: null,
    code: null,
    skills: ['Figma', 'Illustrator'],
    logo: humbralConfigPattern,
    faces: {
      product: { image: humbralConfigGlass, summaryI18n: 'humbral.faceProduct' },
      visual: { image: humbralPatternFinal, summaryI18n: 'humbral.faceVisual' },
    },
  },
  {
    slug: 'bloom',
    titleI18n: 'bloom.title',
    summaryI18n: 'bloom.subtitle',
    tag: 'Information Architecture',
    tags: ['UX Research', 'Information Architecture', 'Wireframing', 'Taxonomy'],
    categories: ['digital'],
    accent: '#E0668C',
    period: '2025',
    featured: true,
    href: '/projects/bloom',
    site: 'https://bebloomers.com/',
    code: null,
    skills: ['Figma'],
    logo: null,
  },
]

/** Projects shown in the Featured slider on /projects, in slider order. */
export const featuredProjects = projects.filter((p) => p.featured)

/**
 * The three the homepage teases. Deliberately a short curated list rather than
 * `featured.slice(0, 3)`: the home block is a hook that should earn the click
 * to /projects, and one project per category is what makes the range obvious
 * at a glance. Ordered digital → product → visual.
 */
export const homeFeatured = ['candelaria', 'humbral', 'sensewave']
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter(Boolean)

/**
 * Projects belonging to a category, each flattened with the face that
 * category should present. Lanes consume this directly.
 */
export function projectsByCategory(category) {
  return projects
    .filter((p) => p.categories.includes(category))
    .map((p) => {
      const face = p.faces?.[category]
      return {
        ...p,
        image: face?.image ?? p.logo,
        laneSummaryI18n: face?.summaryI18n ?? p.summaryI18n,
      }
    })
}

export default projects
