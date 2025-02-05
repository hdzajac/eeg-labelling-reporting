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
import TimeIndicator from './TimeIndicator'
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
  const { position, interval } = useTimelineStore()
  const { numberOfSamples } = useEDF()

  const currAnnotations = annotations.filter((ann) => ann.signalIndex === position)

  console.log('ANNOTATIONS', annotations)

  return (
    <div className="panel">
      <Grid gap="2" columns="250px 1fr">
        <Flex></Flex>
        {/* <TimeIndicator interval={interval} startTime={position * interval} /> */}
      </Grid>

      <Heading as="h3" size="3">
        Patient state / modulators
      </Heading>

      {STATE_TYPES.map((type, index) => (
        <Grid key={index} gap="2" columns="250px 1fr">
          <Flex>
            <Text align="right">{STATE_TYPES_LABELS[type]}</Text>
          </Flex>
          <Flex width="100%" height="10px" position="relative">
            {currAnnotations
              .filter((annotation) => annotation.type === type && annotation.mode === 'STATE')
              .map((annotation, idx) => (
                <Box
                  key={idx}
                  position="absolute"
                  height="10px"
                  style={{
                    backgroundColor: '#BEE1D0',
                    border: '1px solid #008045',
                    borderRadius: '1px',
                    left: `${(annotation.startTime * 100) / numberOfSamples}%`,
                    width: `${
                      ((annotation.endTime - annotation.startTime) * 100) / numberOfSamples
                    }%`,
                  }}
                />
              ))}
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
            {currAnnotations
              .filter((annotation) => annotation.type === type && annotation.mode === 'OBSERVATION')
              .map((annotation, idx) => (
                <Box
                  key={idx}
                  position="absolute"
                  style={{
                    height: '10px',
                    width: '10px',
                    borderRadius: 10,
                    backgroundColor: OBSERVATION_COLORS[annotation.type],
                    border: '1px solid rgba(0, 0, 0, 0.5)',
                    marginLeft: '-4px',
                    left: `${(annotation.startTime * 100) / numberOfSamples}%`,
                  }}
                />
              ))}
            <Box
              style={{
                width: '100%',
                height: '2px',
                backgroundColor: 'var(--gray-6)',
                marginTop: '4px',
              }}></Box>
          </Flex>
        </Grid>
      ))}
    </div>
  )
}
