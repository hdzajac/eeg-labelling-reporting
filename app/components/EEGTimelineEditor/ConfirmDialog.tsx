import { Button, Flex, Heading, Popover } from '@radix-ui/themes'
import { useState } from 'react'

import { OBSERVATION_COLORS, OBSERVATION_TYPES, OBSERVATION_TYPES_LABELS } from '@/constants'
import useAnnotationsStore, { Annotation } from '@/store/annotations'
import AnnotationDialog from './AnnotationDialog'
import useEDF from './useEDF'

type Props = {
  annotation: Annotation | null
  onConfirm: (ann: Annotation, type: string) => void
  onDelete: (ann: Annotation) => void
}

export default function ConfirmDialog({ annotation, onConfirm, onDelete }: Props) {
  const [tempType, setTempType] = useState(annotation?.type)
  const [dialogOpen, setDialogOpen] = useState<'OBSERVATION' | 'STATE' | false>(false)
  const [changeOpen, setChangeOpen] = useState(false)
  const { numberOfSamples } = useEDF()
  const { setCurrent } = useAnnotationsStore()

  if (!annotation || !tempType) return null

  const handleChangeType = (type: string) => {
    setTempType(type)
    setChangeOpen(false)
  }

  const handleConfirm = () => {
    setCurrent(null)
    onConfirm(annotation, tempType)
  }

  const handleDelete = () => {
    onDelete(annotation)
    setCurrent(null)
  }

  const leftPos = (annotation.startTime * 100) / numberOfSamples

  return (
    <Flex
      className="rt-PopoverContent"
      direction="column"
      position="absolute"
      left={`${leftPos}%`}
      bottom="40px"
      p="2"
      style={{ backgroundColor: 'white', borderRadius: 8 }}>
      <Heading as="h3" size="1">
        AI Prediciton
      </Heading>
      <AnnotationDialog
        mode={dialogOpen}
        setOpen={setDialogOpen}
        selection={{ start: 0, end: 0 }}
        menuPosition={{ x: 0, y: 0 }}
        onSave={() => {}}
      />
      <ObservationsList
        chagenOpen={changeOpen}
        tempType={tempType}
        setChangeOpen={setChangeOpen}
        onChangeType={handleChangeType}
      />
      <Flex gap="1" mt="2">
        <Button size="1" onClick={handleConfirm}>
          Confirm
        </Button>

        <Button color="red" size="1" variant="soft" onClick={handleDelete}>
          Delete
        </Button>
      </Flex>
    </Flex>
  )
}

type ObservationsListProps = {
  tempType: string
  chagenOpen: boolean
  setChangeOpen: (open: boolean) => void
  onChangeType: (type: string) => void
}

function ObservationsList({
  chagenOpen,
  tempType,
  setChangeOpen,
  onChangeType,
}: ObservationsListProps) {
  return (
    <Popover.Root open={chagenOpen} onOpenChange={setChangeOpen}>
      <Popover.Trigger>
        <Button
          mt="1"
          size="1"
          onClick={() => setChangeOpen(true)}
          style={{
            cursor: 'pointer',
            width: '100%',
            backgroundColor: OBSERVATION_COLORS[tempType],
            color: '#fff',
            justifyContent: 'left',
          }}>
          {OBSERVATION_TYPES_LABELS[tempType]}
        </Button>
      </Popover.Trigger>
      <Popover.Content style={{ padding: 8 }}>
        <Flex direction="column" gap="1">
          {OBSERVATION_TYPES.map((type) => (
            <Button
              key={type}
              size="1"
              style={{
                backgroundColor: OBSERVATION_COLORS[type],
                color: '#fff',
                justifyContent: 'left',
              }}
              onClick={() => onChangeType(type)}>
              {OBSERVATION_TYPES_LABELS[type]}
            </Button>
          ))}
        </Flex>
      </Popover.Content>
    </Popover.Root>
  )
}
