import { useLocale } from '../../i18n/LocaleProvider.jsx'
import CaseStudy from '../../components/CaseStudy.jsx'
import TaxonomyExplorer, { SystemInUse } from '../../components/bloom/TaxonomyExplorer.jsx'
import WireframeViewer, { WireframeFlow } from '../../components/bloom/WireframeViewer.jsx'

/* Bloom: the case is data; CaseStudy is the template (ACABADO §7). */
export default function Bloom() {
  const { t } = useLocale()
  const b = (k) => t(`bloom.${k}`)
  return (
    <CaseStudy
      slug="bloom"
      hero={{
        kicker: b('heroKicker'),
        title: [b('heroH1'), b('heroH2')],
        summary: b('heroSub'),
        tags: b('heroTags'),
        meta: [
          { label: b('metaRole'), value: b('role') },
          { label: b('metaClient'), value: b('client') },
          { label: t('case.period'), value: b('period') },
          { label: b('metaTeam'), value: b('collaboration') },
        ],
      }}
      sections={[
        // 01 Problem
        [
          { type: 'text', kicker: b('s1'), paras: [b('briefP1'), b('briefP2'), b('briefP3')] },
          {
            type: 'split',
            left: { type: 'quote', text: b('problemQuote') },
            right: { type: 'text', kicker: b('s2'), paras: [b('problemP1'), b('problemP2')] },
          },
        ],
        // 02 Process
        [
          { type: 'text', kicker: b('s3'), paras: [b('versionsIntro')] },
          { type: 'node', node: <TaxonomyExplorer b={b} /> },
          { type: 'text', heading: b('tradeoffTitle'), paras: [b('tradeoffP1'), b('tradeoffP2')] },
        ],
        // 03 Decisions
        [
          { type: 'text', kicker: b('s4'), heading: b('bridgeTitle'), paras: [b('bridgeP1'), b('bridgeP2'), b('bridgeP3')] },
          { type: 'text', sub: b('caseTitle'), paras: [b('caseIntro')] },
          { type: 'node', node: <SystemInUse b={b} /> },
          { type: 'text', kicker: b('s5'), heading: b('wfTitle'), paras: [b('wfP1'), b('wfP2')] },
          { type: 'stat', value: b('wfStat'), label: b('wfStatLabel') },
          { type: 'node', node: <WireframeViewer b={b} /> },
          { type: 'text', sub: b('wfFlowTitle') },
          { type: 'node', node: <WireframeFlow b={b} /> },
        ],
        // 04 Result
        [
          { type: 'text', kicker: b('reflLabel'), paras: [] },
          { type: 'quote', text: b('reflQuote') },
          { type: 'text', paras: [b('reflP1'), b('reflP2')] },
          { type: 'tags', items: b('reflTags') },
        ],
      ]}
    />
  )
}
