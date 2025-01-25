import { Flex } from '@radix-ui/themes'

import ClinicalInfo from '@/components/ClinicalInfo'
import Header from '@/components/Header'
import Report from '@/components/Report'
import { EEGTimelineEditor } from '@/components/EEGTimelineEditor'
import TimelineAnnotations from '@/components/TimelineAnnotations'
import AnnotationEditor from '@/components/AnnotationEditor'

export default function Index() {
  return (
    <Flex style={{ backgroundColor: 'var(--surface)' }} height="100vh" direction="column">
      <Flex gap="2" direction="column" width="1200px" style={{ margin: '0 auto' }}>
        <Header />

        <ClinicalInfo />

        <EEGTimelineEditor />

        <Report />
      </Flex>
    </Flex>
  )
}
