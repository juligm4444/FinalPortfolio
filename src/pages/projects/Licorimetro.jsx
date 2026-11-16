import { useLocale } from '../../i18n/LocaleProvider.jsx'
import CaseStudy from '../../components/CaseStudy.jsx'
import licorimetroProblemImg from '../../assets/images/licorimetro/problem.webp'
import licorimetroEvolutionImg from '../../assets/images/licorimetro/evolution.webp'
import licorimetroReflectionsImg from '../../assets/images/licorimetro/reflections.webp'
import licorimetroScanVideo from '../../assets/images/licorimetro/summary-scan.mp4'

/* The architecture, as the project documents it (layers of the app). */
const ARCH_LAYERS = [
  {
    label: 'INPUT',
  nodes: [
      { name: 'Camera + OCR', sub: 'Bitmap analysis' },
      { name: 'Manual Search', sub: 'Discovery feed' },
    ],
  },
  {
    label: 'CORE',
  nodes: [
      { name: 'Product Database', sub: 'Labels · Catalog' },
      { name: 'Community Engine', sub: 'Reviews · Social' },
      { name: 'Auth & Profiles', sub: 'Firebase · JWT' },
    ],
  },
  {
    label: 'USER LAYER',
  nodes: [
      { name: 'Tu Bodega', sub: 'Personal cellar' },
      { name: 'Badge System', sub: 'Gamification' },
      { name: 'Recommendations', sub: 'Smart feed' },
    ],
  },
];

/* Licorímetro: the case is data; CaseStudy is the template (ACABADO §7). */
export default function Licorimetro() {
  const { t } = useLocale()
  const l = (k) => t(`licorimetro.${k}`)
  return (
    <CaseStudy
      slug="licorimetro"
      hero={{
        title: [l('title')],
        summary: l('subtitle'),
        meta: [
          { label: l('sectionRoleLabel'), value: l('role') },
          { label: l('sectionTimelineLabel'), value: `${l('period')} · ${l('status')}` },
        ],
        links: [],
      }}
      sections={[
        // 01 Problem
        [
          {
            type: 'split',
            left: { type: 'text', stacked: true, heading: l('summaryTitle'), paras: l('summaryParas') },
            right: { type: 'video', src: licorimetroScanVideo, ratio: '1/1' },
          },
          {
            type: 'split',
            left: { type: 'figure', src: licorimetroProblemImg, alt: 'Problem framing — fragmented ecosystem', ratio: '4/5', cover: true },
            right: {
              type: 'stack',
              items: [
                { type: 'text', stacked: true, heading: l('problemTitle'), paras: [l('problemLead')] },
                { type: 'bullets', items: l('problemBullets') },
              ],
            },
          },
        ],
        // 02 Process
        [
          {
            type: 'stack',
            items: [
              { type: 'text', heading: l('ocrTitle'), paras: l('ocrParas') },
              { type: 'bullets', items: l('ocrBullets') },
            ],
          },
          { type: 'text', heading: l('processTitle') },
          { type: 'rows', items: l('processSteps').map((x) => ({ phase: x.n, title: x.title, intro: x.intro, bullets: x.bullets })) },
        ],
        // 03 Decisions
        [
          { type: 'text', heading: l('featuresTitle') },
          { type: 'cards', cols: 2, items: l('features') },
          { type: 'text', heading: l('architectureTitle'), paras: [l('architectureParas')[0]] },
          {
            type: 'grid',
            cols: 3,
            items: ARCH_LAYERS.map((layer) => ({
              type: 'spec',
              title: layer.label,
              lines: layer.nodes.map((n) => `${n.name} — ${n.sub}`),
            })),
          },
        ],
        // 04 Result
        [
          {
            type: 'split',
            left: { type: 'figure', src: licorimetroEvolutionImg, alt: "Evolution — what I'd build differently", ratio: '4/5', cover: true },
            right: {
              type: 'stack',
              items: [
                { type: 'text', stacked: true, heading: l('whatChangedTitle') },
                { type: 'table', header: l('whatChangedHeader'), rows: l('whatChangedRows') },
              ],
            },
          },
          {
            type: 'split',
            left: { type: 'text', stacked: true, heading: l('reflectionsTitle'), paras: l('reflectionsParas') },
            right: { type: 'figure', src: licorimetroReflectionsImg, alt: 'Reflections — Licorímetro legacy', ratio: '4/5', cover: true },
          },
        ],
      ]}
    />
  )
}
