import { Box, Button, Flex, Select, Text, TextField } from '@radix-ui/themes'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Control, Controller } from 'react-hook-form'

import { OBSERVATION_TYPES, OBSERVATION_TYPES_LABELS } from '@/constants'
import { Annotation } from '@/store/annotations'
import { Flags, useFlags } from './useFlags'
import { useTimelineStore } from '@/store/timeline'

type Props = {
  control: Control<Flags>
}

export default function AIAnnotationsPanel({ control }: Props) {
  return (
    <Controller
      name="aiAnnotations"
      control={control}
      render={({ field: { onChange, value } }) => (
        <AnnotationEditor onChange={onChange} annotations={value} />
      )}
    />
  )
}
type AnnotationEditorProps = {
  onChange: (annotations: Annotation[]) => void
  annotations: Annotation[]
}

function AnnotationEditor({ onChange, annotations }: AnnotationEditorProps) {
  const [type, setType] = useState('')
  const [seconds, setSeconds] = useState('')
  const { interval } = useTimelineStore()
  const { flags } = useFlags()

  const numberOfSamples = (256 * interval) / flags.desampleRate

  const handleAddEntry = () => {
    const totalSeconds = secondsToTime(parseFloat(seconds), interval, numberOfSamples)

    let signalIndex = Math.floor(totalSeconds / numberOfSamples)

    if (Number.isInteger(totalSeconds / numberOfSamples) && totalSeconds !== 0) {
      signalIndex -= 1
    }

    let time = totalSeconds - numberOfSamples * signalIndex

    // Hack to deal with multiples of the interval
    if (Number.isInteger(totalSeconds / numberOfSamples)) {
      time -= 2
    }

    if (type && seconds) {
      onChange([...annotations, createAnnotation(type, time, signalIndex)])

      setType('')
      setSeconds('')
    }
  }

  const handleRemoveEntry = (index: number) => {
    onChange(annotations.filter((_, i) => i !== index))
  }

  return (
    <div>
      <Flex direction="row" gap="2" style={{ borderBottom: '1px solid var(--gray-8)' }}>
        <Box width="200px">
          <Text size="1">Type</Text>
        </Box>
        <Box width="100px">
          <Text size="1">Start time (s)</Text>
        </Box>
      </Flex>
      <Flex minHeight="50px" direction="column">
        {annotations.map((entry, index) => (
          <Flex key={index} justify="between">
            <Flex gap="2">
              <Box width="200px">
                <Text size="1">{OBSERVATION_TYPES_LABELS[entry.type]}</Text>
              </Box>
              <Box width="100px">
                <Text size="1">
                  {annotationToSeconds(entry, numberOfSamples, flags.desampleRate)}
                </Text>
              </Box>
            </Flex>
            <Button ml="auto" variant="ghost" onClick={() => handleRemoveEntry(index)}>
              <Trash2 color="red" size={15} />
            </Button>
          </Flex>
        ))}
      </Flex>
      <Flex direction="row" gap="2" mt="2" pt="1" style={{ borderTop: '1px solid var(--gray-3)' }}>
        <Select.Root value={type} onValueChange={setType}>
          <Select.Trigger style={{ width: '200px' }} placeholder="Type" />
          <Select.Content>
            {OBSERVATION_TYPES.map((type) => (
              <Select.Item key={type} value={type}>
                {OBSERVATION_TYPES_LABELS[type]}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <TextField.Root
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
          placeholder="Start time (s)"
        />

        <Button variant="soft" onClick={handleAddEntry}>
          Add
        </Button>
      </Flex>
    </div>
  )
}

function createAnnotation(type: string, time: number, signalIndex: number): Annotation {
  return { type, startTime: time, endTime: time, mode: 'AI', signalIndex }
}

function annotationToSeconds(
  annotation: Annotation,
  numberOfSamples: number,
  desampleRate: number
): number {
  const totalSamples = annotation.startTime + annotation.signalIndex * numberOfSamples

  const result = (totalSamples / 256) * desampleRate

  // Hack to deal with multiples of the interval
  if ((annotation.startTime + 2) % numberOfSamples === 0) {
    return Math.round(result)
  }

  return result
}

function secondsToTime(seconds: number, interval: number, numberOfSamples: number): number {
  return (numberOfSamples / interval) * seconds
}
