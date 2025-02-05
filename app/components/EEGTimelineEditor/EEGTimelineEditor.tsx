import { Flex } from '@radix-ui/themes'

import useAnnotationsStore, { Annotation } from '@/store/annotations'
import AnnotationsTimeline from './AnnotationsTimeline'
import EEGViewer from './EEGViewer'

export function EEGTimelineEditor() {
  const { annotations, setAnnotations } = useAnnotationsStore()

  const handleAddAnnotation = (ann: Annotation) => {
    setAnnotations([...annotations, ann])
  }

  const handleDeleteAnnotation = (ann: Annotation) => {
    setAnnotations(annotations.filter((a) => a !== ann))
  }

  const handleUpdateAnnotation = (ann: Annotation) => {
    setAnnotations(annotations.map((a) => (a === ann ? ann : a)))
  }

  return (
    <Flex direction="column" gap="2">
      <EEGViewer onAnnotationAdd={handleAddAnnotation} />
      <AnnotationsTimeline
        annotations={annotations}
        onAnnotationAdd={handleAddAnnotation}
        onAnnotationDelete={handleDeleteAnnotation}
        onAnnotationUpdate={handleUpdateAnnotation}
      />
    </Flex>
  )
}
