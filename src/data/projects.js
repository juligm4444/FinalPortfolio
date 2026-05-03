import candelariaLogo from '../assets/images/candelaria_logo.png'

/**
 * Single source of truth for projects.
 * `slug` matches the route at /projects/:slug.
 * `i18n` keys point into translations.<locale>.<key>.
 */
const projects = [
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
