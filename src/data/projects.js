import candelariaLogo from '../assets/images/candelaria_logo.png'
// TODO: replace null with the actual Licorímetro logo import once the asset is ready
// import licorimetroLogo from '../assets/images/licorimetro_logo.png'

/**
 * Single source of truth for projects.
 * `slug` matches the route at /projects/:slug.
 * `i18n` keys point into translations.<locale>.<key>.
 */
const projects = [
  {
    slug: 'licorimetro',
    titleI18n: 'licorimetro.title',
    summaryI18n: 'licorimetro.subtitle',
    tag: 'Mobile · OCR',
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
    slug: 'candelaria',
    titleI18n: 'candelaria.title',
    summaryI18n: 'candelaria.subtitle',
    tag: 'Full-stack · Product',
    accent: '#FF0871',
    period: '2025 — 2026',
    featured: true,
    href: '/projects/candelaria',
    site: 'https://www.candelaria.website/',
    code: 'https://github.com/juligm4444/CandelariaWebsite',
    skills: ['React', 'Django', 'Tailwind', 'Figma', 'Python', 'Claude', 'Git', 'Vscode'],
    logo: candelariaLogo,
  },
]

export default projects
