import { Box, Flex, Grid, Heading, Text } from '@radix-ui/themes'

import { ANNOTATION_TYPES, ANNOTATION_TYPES_LABELS } from '@/constants'
import { useTimelineStore } from '@/store/timeline'
import TimeIndicator from './TimeIndicator'

export type Annotation = {
  type: string
  startTime: number
  endTime: number
}

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
  console.log('ANNOTATIONS', annotations)

  return (
    <div className="panel">
      <Grid gap="2" columns="250px 1fr">
        <Flex></Flex>
        <TimeIndicator interval={interval} startTime={position * interval} />
      </Grid>

      <Heading as="h3" size="3">
        Patient state
      </Heading>

      <Heading as="h3" size="3">
        Annotations
      </Heading>

      {ANNOTATION_TYPES.map((type, index) => (
        <Grid key={index} gap="2" columns="250px 1fr">
          <Flex style={{ backgroundColor: '#BEE1D0' }}>
            <Text align="right">{ANNOTATION_TYPES_LABELS[type]}</Text>
          </Flex>
          <Flex width="100%" height="10px" position="relative">
            {annotations
              .filter((annotation) => annotation.type === type)
              .map((annotation, idx) => (
                <Box
                  key={idx}
                  position="absolute"
                  height="10px"
                  style={{
                    backgroundColor: '#BEE1D0',
                    border: '1px solid #008045',
                    borderRadius: '1px',
                    left: `${annotation.startTime}%`,
                    width: `${(annotation.endTime - annotation.startTime) / 31.25}%`,
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

      {/* <EEGViewer /> */}
    </div>
  )
}

function TimeMarkers({ annotations }) {}
