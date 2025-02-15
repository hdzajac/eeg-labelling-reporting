import { Button, Flex, Heading, Popover } from '@radix-ui/themes'
import { PropsWithChildren, useState } from 'react'

import { OBSERVATION_COLORS, OBSERVATION_TYPES, OBSERVATION_TYPES_LABELS } from '@/constants'
import { Annotation } from '@/store/annotations'
import AnnotationDialog from './AnnotationDialog'

type Props = {
  annotation: Annotation
  onConfirm: (ann: Annotation, type: string) => void
  onDelete: (ann: Annotation) => void
} & PropsWithChildren

export default function ConfirmPopover({ annotation, children, onConfirm, onDelete }: Props) {
  const [tempType, setTempType] = useState(annotation.type)
  const [dialogOpen, setDialogOpen] = useState<'OBSERVATION' | 'STATE' | false>(false)
  const [changeOpen, setChangeOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleChangeType = (type: string) => {
    setTempType(type)
    setChangeOpen(false)
  }

  const handleConfirm = () => {
    setIsOpen(false)

    onConfirm(annotation, tempType)
  }

  return (
    <Popover.Root open={isOpen}>
      <Popover.Trigger onClick={() => setIsOpen(true)}>
        <button
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            border: 'none',
            fontSize: 10,
            cursor: 'pointer',
          }}>
          {children}
        </button>
      </Popover.Trigger>
      <Popover.Content style={{ padding: 8 }}>
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

          <Button color="red" size="1" variant="soft" onClick={() => onDelete(annotation)}>
            Delete
          </Button>
        </Flex>
      </Popover.Content>
    </Popover.Root>
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
  console.log(chagenOpen)

  return (
    <Popover.Root open={chagenOpen}>
      <Popover.Trigger>
        <Button
          mt="1"
          size="1"
          onClick={() => setChangeOpen(true)}
          style={{
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
