import { Box, Flex, Grid, Heading, Text } from '@radix-ui/themes'

import {
  OBSERVATION_COLORS,
  OBSERVATION_TYPES,
  OBSERVATION_TYPES_LABELS,
  STATE_TYPES,
  STATE_TYPES_LABELS,
} from '@/constants'
import { Annotation } from '@/store/annotations'
import { useTimelineStore } from '@/store/timeline'
import TimelineOverview from './TimelineOverview'
import useEDF from './useEDF'

type Props = {
  annotations: Annotation[]
  onAnnotationAdd: (ann: Annotation) => void
  onAnnotationUpdate: (ann: Annotation) => void
  onAnnotationDelete: (ann: Annotation) => void
}

export default function AnnotationsTimeline({
  annotations,
  onAnnotationAdd,
  onAnnotationUpdate,
  onAnnotationDelete,
}: Props) {
  const { interval, updatePosition } = useTimelineStore()
  const { duration } = useEDF()

  // console.log('annotations', annotations)

  const tickInterval = 300 // 5 minutes = 300 seconds

  return (
    <div className="panel">
      <TimelineOverview />

      <Heading as="h3" size="3">
        Patient state / modulators
      </Heading>

      {STATE_TYPES.map((type, index) => (
        <Grid key={index} gap="2" columns="250px 1fr">
          <Flex>
            <Text align="right">{STATE_TYPES_LABELS[type]}</Text>
          </Flex>
          <Flex width="100%" height="10px" position="relative">
            <VerticalLines tickInterval={tickInterval} duration={duration} />

            {annotations
              .filter((annotation) => annotation.type === type && annotation.mode === 'STATE')
              .map((annotation, idx) => {
                const startTime = annotation.startTime / 256 + annotation.signalIndex * interval
                const endTime = annotation.startTime / 256 + annotation.signalIndex * interval
                const leftPos = `${(startTime / duration) * 100}%`
                const width = `${(endTime - startTime) * 100}%`

                return (
                  <Box
                    onClick={() => updatePosition(annotation.signalIndex)}
                    key={idx}
                    position="absolute"
                    height="10px"
                    left={leftPos}
                    width={width}
                    style={{
                      backgroundColor: '#BEE1D0',
                      border: '1px solid #008045',
                      borderRadius: '1px',
                      cursor: 'pointer',
                    }}
                  />
                )
              })}
            <Box
              style={{
                width: '100%',
                height: '2px',
                backgroundColor: 'var(--gray-6)',
                marginTop: '4px',
              }}
            />
          </Flex>
        </Grid>
      ))}

      <Heading as="h3" size="3" mt="5">
        Annotations
      </Heading>

      {OBSERVATION_TYPES.map((type, index) => (
        <Grid key={index} gap="2" columns="250px 1fr">
          <Flex>
            <Text align="right">{OBSERVATION_TYPES_LABELS[type]}</Text>
          </Flex>

          <Flex width="100%" height="10px" position="relative">
            <VerticalLines tickInterval={tickInterval} duration={duration} />

            {annotations
              .filter(
                (annotation) =>
                  (annotation.type === type && annotation.mode === 'OBSERVATION') ||
                  (annotation.type === type && annotation.mode) === 'AI'
              )
              .map((annotation, idx) => {
                const time = annotation.startTime / 256 + annotation.signalIndex * interval
                const leftPos = `${(time / duration) * 100}%`

                const defaultStyles = {
                  backgroundColor: OBSERVATION_COLORS[annotation.type],
                  border: '1px solid rgba(0, 0, 0, 0.5)',
                }

                const aiStyles = {
                  height: '14px',
                  width: '14px',
                  backgroundColor: '#FFEB78',
                  border: '1px dashed #E5A00D',
                  marginTop: '-3px',
                }

                const styles = annotation.mode === 'AI' ? aiStyles : defaultStyles

                return (
                  <Box
                    onClick={() => updatePosition(annotation.signalIndex)}
                    key={idx}
                    position="absolute"
                    left={leftPos}
                    style={{
                      textAlign: 'center',
                      cursor: 'pointer',
                      height: '10px',
                      width: '10px',
                      borderRadius: 12,
                      fontSize: '8px',
                      marginLeft: '-4px',

                      ...styles,
                    }}>
                    {annotation.mode === 'AI' && 'AI'}
                  </Box>
                )
              })}
            <Box
              style={{
                width: '100%',
                height: '2px',
                backgroundColor: 'var(--gray-6)',
                marginTop: '4px',
              }}
            />
          </Flex>
        </Grid>
      ))}
    </div>
  )
}

type VerticalLinesProps = {
  tickInterval: number
  duration: number
}

function VerticalLines({ tickInterval, duration }: VerticalLinesProps) {
  return (
    <>
      {Array.from({ length: Math.floor(duration / tickInterval) + 1 }, (_, i) => {
        const time = i * tickInterval
        const leftPos = `${(time / duration) * 100}%`
        return (
          <Box
            key={i}
            position="absolute"
            left={leftPos}
            height="250%"
            width="1px"
            mt="-8px"
            style={{
              background: 'var(--gray-3)',
            }}
          />
        )
      })}
    </>
  )
}
