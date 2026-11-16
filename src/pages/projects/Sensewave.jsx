import { useLocale } from '../../i18n/LocaleProvider.jsx'
import CaseStudy from '../../components/CaseStudy.jsx'
import DonorFlow from '../../components/case/DonorFlow.jsx'
import { SENSEWAVE_PALETTE } from '../../data/swatches.js'
import a1HeroVideo from '../../assets/images/sensewave/a1-hero.mp4';
import a2Problem from '../../assets/images/sensewave/a2-problem.webp';
import a3Glasses from '../../assets/images/sensewave/a3-glasses.webp';
import a4ChillChip from '../../assets/images/sensewave/a4-chill-chip.webp';
import a5ComplexChip from '../../assets/images/sensewave/a5-complex-chip.webp';
import a13ChipSystem from '../../assets/images/sensewave/a13-chip-system.webp';
import a14Lifestyle from '../../assets/images/sensewave/a14-lifestyle.webp';
import a16Prototype from '../../assets/images/sensewave/a16-prototype.webp';
import a7Packaging from '../../assets/images/sensewave/a7-packaging.webp';
import a8ChipLabel from '../../assets/images/sensewave/a8-chip-label.webp';
import a9AccessCard from '../../assets/images/sensewave/a9-access-card.webp';


/* SenseWave: the case is data; CaseStudy is the template (ACABADO §7). */
export default function Sensewave() {
  const { t } = useLocale()
  const s = (k) => t(`sensewave.${k}`)
  const chips = s('chips')
  const chipImages = [a4ChillChip, a5ComplexChip]
  const heading = (...keys) => keys.map(s).join(' ')
  return (
    <CaseStudy
      slug="sensewave"
      hero={{
        title: [s('heroH1'), `${s('heroH2')} ${s('heroHAccent')}`],
        summary: s('heroSub'),
        tags: s('heroTags'),
        meta: [],
      }}
      sections={[
        // 01 Problem: the human problem
        [
          { type: 'video', src: a1HeroVideo },
          {
            type: 'split',
            even: true,
            left: {
              type: 'stack',
              items: [
                { type: 'text', kicker: s('s2') },
                { type: 'quote', text: s('problemQuote') },
                { type: 'text', paras: [s('problemP1'), s('problemP2')] },
                { type: 'grid', cols: 2, items: [s('statA'), s('statB')].map((x) => ({ type: 'stat', value: x.value, label: x.label })) },
              ],
            },
            right: { type: 'figure', src: a2Problem, alt: s('s2'), ratio: '4/5', cover: true },
          },
        ],
        // 02 Process: how it was designed, and the technology
        [
          { type: 'text', heading: heading('processH1', 'processHPre', 'processHAccent') },
          { type: 'rows', items: s('processSteps') },
          {
            type: 'split',
            even: true,
            left: {
              type: 'stack',
              items: [
                { type: 'text', stacked: true, heading: heading('techH1', 'techHAccent', 'techH2'), paras: [s('techP')] },
                { type: 'figure', src: a3Glasses, alt: s('s3'), ratio: '4/3', cover: true },
              ],
            },
            right: {
              type: 'stack',
              items: chips.flatMap((c, i) => [
                { type: 'figure', src: chipImages[i], alt: c.name, ratio: '16/9', cover: true },
                { type: 'text', kicker: c.tagline, sub: c.name, paras: [c.desc] },
              ]),
            },
          },
        ],
        // 03 Decisions: donor system, brand, digital
        [
          { type: 'text', heading: heading('donorH1', 'donorHAccent'), paras: [s('donorP')] },
          { type: 'node', node: <DonorFlow /> },
          { type: 'cards', items: s('donorCards') },
          { type: 'text', heading: heading('brandH1', 'brandHPre', 'brandHAccent'), paras: [s('brandP')] },
          { type: 'swatches', title: s('colorLabel'), items: SENSEWAVE_PALETTE },
          { type: 'typespec', label: s('typoLabel'), display: s('typoDisplay'), sub: s('typoSub'), roles: s('typoRoles') },
          {
            type: 'grid',
            cols: 2,
            items: [
              { type: 'figure', src: a7Packaging, alt: 'SenseWave product instructive SW__01', ratio: '4/3', cover: true },
              { type: 'figure', src: a8ChipLabel, alt: 'SenseWave chip label CX_01', ratio: '4/3', cover: true },
            ],
          },
          {
            type: 'split',
            even: true,
            left: { type: 'text', stacked: true, heading: heading('digitalH1', 'digitalHAccent', 'digitalH2'), paras: [s('digitalP')] },
            right: { type: 'figure', src: a9AccessCard, alt: 'SenseWave access card', ratio: '9/16', cover: true },
          },
        ],
        // 04 Result: the physical product and the reflection
        [
          { type: 'text', heading: heading('physicalH1', 'physicalHAccent') },
          {
            type: 'grid',
            cols: 3,
            items: [
              { type: 'figure', src: a13ChipSystem, alt: 'Chip system product photography', ratio: '1/1', cover: true },
              { type: 'figure', src: a14Lifestyle, alt: 'Sense Eco glasses lifestyle', ratio: '3/4', cover: true },
              { type: 'figure', src: a16Prototype, alt: 'Prototype close-up', ratio: '1/1', cover: true },
            ],
          },
          { type: 'text', kicker: s('reflLabel') },
          { type: 'quote', text: s('reflQuote') },
          { type: 'text', paras: [s('reflP1'), s('reflP2')] },
          { type: 'tags', items: s('reflTags') },
        ],
      ]}
    />
  )
}
