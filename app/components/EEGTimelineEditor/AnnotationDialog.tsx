import { Button, Dialog, Flex, Select } from '@radix-ui/themes'
import { Annotation } from './AnnotationsTimeline'
import { ANNOTATION_TYPES, ANNOTATION_TYPES_LABELS } from '@/constants'
import { useState } from 'react'

type Props = {
  open: boolean
  selection: { start: number; end: number } | null
  onSave: (annotation: Annotation) => void
  onOpenChange: (open: boolean) => void
}

export default function AnnotationDialog({ open, selection, onSave }: Props) {
  const [type, setType] = useState(ANNOTATION_TYPES[0])

  return (
    <Dialog.Root open={open}>
      <Dialog.Content maxWidth="450px" aria-describedby={undefined}>
        <Dialog.Title>Observation</Dialog.Title>
        <div>start: {selection?.start}</div>
        <div>end: {selection?.end}</div>

        <Select.Root value={type} onValueChange={setType}>
          <Select.Trigger />
          <Select.Content>
            {ANNOTATION_TYPES.map((t) => (
              <Select.Item value={t}>{ANNOTATION_TYPES_LABELS[t]}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button
              onClick={() =>
                onSave({
                  type,
                  startTime: selection?.start ?? 0,
                  endTime: selection?.end ?? 0,
                })
              }>
              Save
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
