import { useLocale } from '../../i18n/LocaleProvider.jsx'
import CaseStudy from '../../components/CaseStudy.jsx'
import { caseStudies } from '../../data/projects.js'
/* case-study imagery */
import summaryImg from '../../assets/images/candelaria/summary.webp';
import roleImg from '../../assets/images/candelaria/role.webp';
import problemImg from '../../assets/images/candelaria/problem.webp';
import processImg from '../../assets/images/candelaria/process.webp';
import tiersImg from '../../assets/images/candelaria/tiers.webp';
import performanceImg from '../../assets/images/candelaria/performance.webp';
import reflectionsImg from '../../assets/images/candelaria/reflections.webp';

/* condor logo system */
import condorMain from '../../assets/images/candelaria/condor-main.webp';
import condorBAT from '../../assets/images/candelaria/condor-BAT.webp';
import condorCEL from '../../assets/images/candelaria/condor-CEL.webp';
import condorCHA from '../../assets/images/candelaria/condor-CHA.webp';
import condorCOM from '../../assets/images/candelaria/condor-COM.webp';
import condorDIS from '../../assets/images/candelaria/condor-DIS.webp';
import condorLOG from '../../assets/images/candelaria/condor-LOG.webp';
import { CANDELARIA_BRAND_PALETTE } from '../../data/swatches.js';
import condorRRHH from '../../assets/images/candelaria/condor-RRHH.webp';


/* Candelaria: two works out of one project (the identity and the site). Both are data;
   CaseStudy is the template (ACABADO §7). */
const BRAND_SKILLS = ['Figma', 'Illustrator', 'Photoshop']
const TEAMS = [
  ['BAT', condorBAT],
  ['CEL', condorCEL],
  ['CHA', condorCHA],
  ['COM', condorCOM],
  ['DIS', condorDIS],
  ['LOG', condorLOG],
  ['RRHH', condorRRHH],
]

const fig = (src, alt, ratio) => ({ type: 'figure', src, alt, ratio, cover: true })

function useCandelaria(brand) {
  const { t } = useLocale()
  const c = (k) => t(`candelaria.${k}`)
  const project = caseStudies.candelaria
  const paras = c('myRoleParas')
  // The first paragraph frames the group; the second is the design team, the third the site.
  const roleParas = brand ? paras.slice(0, 2) : [paras[0], paras[2]]
  const hero = {
    kicker: t(brand ? 'candelaria.brandPage.tag' : 'candelaria.tag'),
    title: [t(brand ? 'candelaria.brandPage.title' : 'candelaria.title')],
    summary: t(brand ? 'candelaria.brandPage.subtitle' : 'candelaria.subtitle'),
    meta: [
      { label: c('sectionRoleLabel'), value: t(brand ? 'candelaria.brandPage.role' : 'candelaria.role') },
      { label: c('sectionTimelineLabel'), value: `${c('period')} · ${c('status')}` },
    ],
    tools: brand ? BRAND_SKILLS : project.skills,
    links: brand
      ? [
          { label: t('case.instagram'), href: project.instagram },
          { label: t('case.siteCase'), to: '/projects/candelaria-website' },
        ]
      : [
          { label: t('case.visit'), href: project.site },
          { label: t('case.code'), href: project.code },
        ],
    media: condorMain,
    mediaAlt: 'Candelaria condor',
  }
  const role = {
    type: 'split',
    even: true,
    left: fig(roleImg, 'Design team — Candelaria', '1/1'),
    right: { type: 'text', stacked: true, kicker: c('myRoleKicker'), heading: t(brand ? 'candelaria.brandPage.roleTitle' : 'candelaria.myRoleTitle'), paras: roleParas },
  }
  return { t, c, hero, role }
}

/** /projects/candelaria — the brand. */
export default function Candelaria() {
  const { c, hero, role } = useCandelaria(true)
  const teams = c('teams')
  return (
    <CaseStudy
      slug="candelaria"
      hero={hero}
      sections={[
        {
          key: 'process',
          blocks: [
            role,
            { type: 'text', stacked: true, kicker: c('teamsKicker'), heading: c('teamsTitle'), paras: [c('teamsIntro'), c('teamsNote')] },
            {
              type: 'cards',
              cols: 4,
              items: [
                ...TEAMS.map(([abbr, img], i) => ({ img, kicker: abbr, title: teams[i]?.name, desc: teams[i]?.role })),
                { img: condorMain, title: c('teamsCredit') },
              ],
            },
          ],
        },
        {
          key: 'decisions',
          blocks: [
            { type: 'text', kicker: c('brandKicker'), heading: c('brandTitle'), paras: [c('brandIntro')] },
            { type: 'cards', cols: 2, items: c('brandArtifacts') },
            { type: 'swatches', title: c('brandPaletteLabel'), items: CANDELARIA_BRAND_PALETTE.map((hex) => ({ name: hex, label: '', hex, light: hex === CANDELARIA_BRAND_PALETTE[4] })) },
          ],
        },
      ]}
    />
  )
}

/** /projects/candelaria-website — the site. */
export function CandelariaWebsite() {
  const { c, hero, role } = useCandelaria(false)
  return (
    <CaseStudy
      slug="candelaria-website"
      hero={hero}
      sections={[
        // 01 Problem
        [
          {
            type: 'split',
            left: { type: 'text', stacked: true, kicker: c('summaryKicker'), heading: c('summaryTitle'), paras: c('summaryParas') },
            right: fig(summaryImg, 'Candelaria — overview', '4/5'),
          },
          role,
          {
            type: 'split',
            left: {
              type: 'stack',
              items: [
                { type: 'text', stacked: true, kicker: c('problemKicker'), heading: c('problemTitle'), paras: [c('problemLead')] },
                { type: 'bullets', items: c('problemBullets') },
              ],
            },
            right: fig(problemImg, 'Problem framing', '4/5'),
          },
        ],
        // 02 Process
        [
          {
            type: 'split',
            left: {
              type: 'stack',
              items: [{ type: 'text', stacked: true, kicker: c('processKicker'), heading: c('processTitle') }, fig(processImg, 'Process artifact', '4/3')],
            },
            right: { type: 'rows', items: c('processSteps').map((x) => ({ phase: x.n, title: x.title, intro: x.intro, bullets: x.bullets })) },
          },
        ],
        // 03 Decisions
        [
          { type: 'text', kicker: c('featuresKicker'), heading: c('featuresTitle') },
          { type: 'cards', cols: 2, items: c('features') },
          {
            type: 'split',
            left: {
              type: 'stack',
              items: [
                { type: 'text', stacked: true, kicker: c('tiersKicker'), heading: c('tiersTitle') },
                { type: 'table', header: c('tiersHeader'), rows: c('tiers'), accent: 'Core' },
              ],
            },
            right: fig(tiersImg, 'Gamification tiers', '1/1'),
          },
          {
            type: 'split',
            left: fig(performanceImg, 'Performance dashboard', '4/5'),
            right: {
              type: 'stack',
              items: [
                { type: 'text', stacked: true, kicker: c('perfKicker'), heading: c('perfTitle') },
                { type: 'table', header: c('perfHeader'), rows: c('perfRows') },
              ],
            },
          },
          { type: 'text', kicker: c('securityKicker'), heading: c('securityTitle') },
          { type: 'bullets', card: true, cols: 2, items: c('securityBullets') },
        ],
        // 04 Result
        [
          {
            type: 'split',
            left: { type: 'text', stacked: true, kicker: c('reflectionsKicker'), heading: c('reflectionsTitle'), paras: c('reflectionsParas') },
            right: fig(reflectionsImg, 'Reflections — moodboard', '4/5'),
          },
        ],
      ]}
    />
  )
}
