import { useLocale } from '../../i18n/LocaleProvider.jsx'
import CaseStudy from '../../components/CaseStudy.jsx'

import configPatternUp from '../../assets/images/umbral/config-pattern-up.webp'
import configGlassUp from '../../assets/images/umbral/config-glass-up.webp'
import patternOrtho from '../../assets/images/umbral/pattern-ortho.webp'
import patternRadial from '../../assets/images/umbral/pattern-radial.webp'
import patternFinal from '../../assets/images/umbral/pattern-final.webp'
import exploded from '../../assets/images/umbral/exploded.webp'
import cornerStops from '../../assets/images/umbral/corner-stops.webp'
import cornerDetail from '../../assets/images/umbral/corner-detail.webp'
import underside from '../../assets/images/umbral/underside.webp'
import viewTop from '../../assets/images/umbral/view-top.webp'
import viewBottom from '../../assets/images/umbral/view-bottom.webp'
import viewSide from '../../assets/images/umbral/view-side.webp'
import viewIso from '../../assets/images/umbral/view-iso.webp'
import usePatternUp from '../../assets/images/umbral/use-pattern-up.webp'
import useGlassUp from '../../assets/images/umbral/use-glass-up.webp'
import protoStacked from '../../assets/images/umbral/proto-stacked.webp'
import protoBothModules from '../../assets/images/umbral/proto-both-modules.webp'
import protoWindowFrame from '../../assets/images/umbral/proto-window-frame.webp'
import protoThroughGlass from '../../assets/images/umbral/proto-through-glass.webp'

/* El Umbral: the case is data; CaseStudy is the template (ACABADO §7). */
const lines = (v, sep = '\n') => (Array.isArray(v) ? v : String(v).split(sep))

export default function Umbral() {
  const { t } = useLocale()
  const h = (k) => t(`umbral.${k}`)
  const fig = (src, key, extra = {}) => ({ type: 'figure', src, alt: h(key), ...extra })
  const figc = (src, key, extra = {}) => fig(src, key, { caption: h(key), ...extra })
  const spec = (title, body, note) => ({ type: 'spec', title, lines: lines(body), note })
  return (
    <CaseStudy
      slug="umbral"
      hero={{
        title: [h('heroH1'), h('heroH2')],
        summary: h('heroSub'),
        tags: h('heroTags'),
        meta: [
          { label: h('metaRole'), value: h('role') },
          { label: h('metaDimensions'), value: h('dimsShort') },
          { label: t('case.period'), value: h('period') },
          { label: h('metaStatus'), value: h('status') },
          { label: h('metaContext'), value: h('course') },
        ],
      }}
      sections={[
        // 01 Problem: the concept
        [
          { type: 'text', kicker: h('s1') },
          { type: 'quote', text: h('conceptQuote') },
          { type: 'text', paras: [h('conceptP1'), h('conceptP2'), h('conceptP3')] },
          { type: 'text', heading: h('thresholdTitle'), paras: [h('thresholdP1'), h('thresholdP2'), h('thresholdP3')] },
          { type: 'steps', title: h('stepsTitle'), items: h('steps') },
        ],
        // 02 Process: the pattern and the construction
        [
          {
            type: 'split',
            left: { type: 'text', stacked: true, heading: h('patternTitle'), paras: [h('patternP1'), h('patternP2'), h('patternP3'), h('patternP4')] },
            right: {
              type: 'stack',
              items: [
                { type: 'grid', cols: 2, items: [figc(patternOrtho, 'patternFig1', { ratio: '1/1' }), figc(patternRadial, 'patternFig2', { ratio: '1/1' })] },
                figc(patternFinal, 'patternFig3', { ratio: '1/1' }),
              ],
            },
          },
          {
            type: 'grid',
            cols: 2,
            items: [
              { type: 'stack', items: [{ type: 'text', sub: h('gridTitle'), paras: [h('gridP1'), h('gridP2')] }, spec(null, lines(h('gridSpecs'), ' · '))] },
              { type: 'text', sub: h('adaptTitle'), paras: [h('adaptP1'), h('adaptP2')] },
            ],
          },
          {
            type: 'split',
            left: {
              type: 'text',
              stacked: true,
              heading: h('constructTitle'),
              paras: [h('constructP1'), h('constructP2'), h('constructP3'), h('constructP4'), h('constructP5')],
            },
            right: { type: 'stack', items: [fig(exploded, 'partsTitle', { ratio: '4/5' }), spec(h('partsTitle'), h('parts'), h('partsNote'))] },
          },
          {
            type: 'split',
            left: spec(h('logicTitle'), h('logic'), h('logicNote')),
            right: {
              type: 'stack',
              items: [
                fig(cornerStops, 'logicTitle', { ratio: '4/3' }),
                { type: 'grid', cols: 2, items: [fig(cornerDetail, 'constructP4', { ratio: '4/3' }), fig(underside, 'note2', { ratio: '4/3' })] },
                { type: 'text', paras: [h('stackNote')] },
              ],
            },
          },
        ],
        // 03 Decisions: views, dimensions, configurations
        [
          { type: 'text', kicker: h('s4'), paras: [h('viewsIntro')] },
          {
            type: 'grid',
            cols: 3,
            items: [figc(viewTop, 'viewTop', { ratio: '1/1' }), figc(viewBottom, 'viewBottom', { ratio: '1/1' }), figc(viewSide, 'viewSide', { ratio: '1/1' })],
          },
          {
            type: 'grid',
            cols: 3,
            items: [figc(viewIso, 'viewIso', { ratio: '4/3' }), spec(h('dimsTitle'), h('dims'), h('dimsHeight')), spec(h('notesTitle'), [h('note1'), h('note2')])],
          },
          { type: 'text', kicker: h('s5'), paras: [h('configIntro')] },
          {
            type: 'grid',
            cols: 2,
            items: [
              { type: 'stack', items: [fig(configPatternUp, 'configATitle', { ratio: '1/1' }), { type: 'text', sub: h('configATitle'), paras: [h('configAP1'), h('configAP2')] }] },
              { type: 'stack', items: [fig(configGlassUp, 'configBTitle', { ratio: '1/1' }), { type: 'text', sub: h('configBTitle'), paras: [h('configBP1'), h('configBP2')] }] },
            ],
          },
        ],
        // 04 Result: in use and the physical prototype
        [
          { type: 'text', kicker: h('s6'), paras: [h('useIntro')] },
          { type: 'grid', cols: 2, items: [figc(usePatternUp, 'useFig1', { ratio: '4/3' }), figc(useGlassUp, 'useFig2', { ratio: '4/3' })] },
          {
            type: 'split',
            left: {
              type: 'stack',
              items: [{ type: 'text', stacked: true, heading: h('protoTitle'), paras: [h('protoP1'), h('protoP2'), h('protoP3')] }, spec(h('verifyTitle'), h('verify'), h('verifySpecs'))],
            },
            right: {
              type: 'grid',
              cols: 2,
              items: [
                figc(protoStacked, 'protoFig1', { ratio: '4/3', cover: true }),
                figc(protoBothModules, 'protoFig2', { ratio: '4/3', cover: true }),
                figc(protoWindowFrame, 'protoFig3', { ratio: '4/3', cover: true }),
                figc(protoThroughGlass, 'protoFig4', { ratio: '4/3', cover: true }),
              ],
            },
          },
          { type: 'grid', cols: 2, items: [{ type: 'text', sub: h('photoNoteTitle'), paras: [h('photoNote')] }, spec(h('specsTitle'), h('specs'))] },
        ],
      ]}
    />
  )
}
