import { Flex } from '@radix-ui/themes'

import useAnnotationsStore, { Annotation } from '@/store/annotations'
import AnnotationsTimeline from './AnnotationsTimeline'
import EEGViewer from './EEGViewer'

export function EEGTimelineEditor() {
  const { annotations, setCurrent, setAnnotations } = useAnnotationsStore()

  const handleAddAnnotation = (ann: Annotation) => {
    setAnnotations([...annotations, ann])
  }

  const handleDeleteAnnotation = (ann: Annotation) => {
    setAnnotations(annotations.filter((a) => a !== ann))
  }

  const handleUpdateAnnotation = (ann: Annotation) => {
    setAnnotations(annotations.map((a) => (a === ann ? ann : a)))
  }

  const handleConfirmAI = (ann: Annotation, type: string) => {
    // Remove AI
    const obs = annotations.filter((a) => a !== ann)

    setAnnotations([
      ...obs,
      {
        ...ann,
        type,
        mode: 'OBSERVATION',
      },
    ])
  }

  return (
    <Flex direction="column" gap="2">
      <EEGViewer
        onAnnotationAdd={handleAddAnnotation}
        onAnnotationDelete={handleDeleteAnnotation}
        onConfirmAI={handleConfirmAI}
      />
      <AnnotationsTimeline
        annotations={annotations}
        onAnnotationAdd={handleAddAnnotation}
        onConfirmAI={handleConfirmAI}
        onAnnotationDelete={handleDeleteAnnotation}
        onAnnotationUpdate={handleUpdateAnnotation}
      />
    </Flex>
  )
}
