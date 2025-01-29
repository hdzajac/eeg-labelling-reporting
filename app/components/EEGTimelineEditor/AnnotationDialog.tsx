import { Button, Flex, Heading } from '@radix-ui/themes'
import { X } from 'lucide-react'

import {
  ANNOTATION_TYPES,
  OBSERVATION_TYPES,
  OBSERVATION_TYPES_LABELS,
  STATE_TYPES,
  STATE_TYPES_LABELS,
} from '@/constants'
import { useTimelineStore } from '@/store/timeline'
import { Annotation } from '@/store/annotations'

type TMode = (typeof ANNOTATION_TYPES)[number] | false

type Props = {
  mode: TMode
  selection: { start: number; end: number } | null
  menuPosition: { x: number; y: number } | null
  onSave: (annotation: Annotation) => void
  setOpen: (mode: TMode) => void
}

export default function AnnotationDialog({
  mode,
  selection,
  menuPosition,
  setOpen,
  onSave,
}: Props) {
  const { position } = useTimelineStore()

  const handleConfirm = (type: string) => {
    if (!mode) return

    onSave({
      mode,
      type,
      startTime: selection?.start ?? 0,
      endTime: selection?.end ?? 0,
      signalIndex: position,
    })

    setOpen(false)
  }

  if (!mode) return

  const typesList = mode === 'OBSERVATION' ? OBSERVATION_TYPES : STATE_TYPES
  const typesLabelsList = mode === 'OBSERVATION' ? OBSERVATION_TYPES_LABELS : STATE_TYPES_LABELS

  return (
    <Flex
      direction="column"
      position="absolute"
      gap="2"
      style={{
        border: '1px solid #FF8302',
        borderRadius: 6,
        padding: 10,
        backgroundColor: '#fff',
        left: menuPosition?.x ?? 0,
        top: menuPosition?.y ?? 0,
        zIndex: 100,
      }}>
      <Flex justify="between" align="center">
        <Heading as="h3" size="1" style={{ textTransform: 'uppercase' }}>
          {mode === 'OBSERVATION' ? 'Observation' : 'State'}
        </Heading>
        <Button variant="ghost" onClick={() => setOpen(false)}>
          <X size={16} />
        </Button>
      </Flex>
      <Flex direction="column" gap="1">
        {typesList.map((type) => (
          <Button
            key={type}
            size="1"
            style={{
              backgroundColor: '#FFF9F2',
              border: '1px solid #FFCD9833',
              color: '#FF8302',
              justifyContent: 'left',
            }}
            onClick={() => handleConfirm(type)}>
            {typesLabelsList[type]}
          </Button>
        ))}
      </Flex>
    </Flex>
  )
}
