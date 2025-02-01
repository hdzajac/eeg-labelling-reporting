import { Flex, Grid, Text } from '@radix-ui/themes'
import { useRef, useState } from 'react'

import { ANNOTATION_TYPES } from '@/constants'
import { Annotation } from '@/store/annotations'
import AnnotationDialog from './AnnotationDialog'
import EEGChart from './EEGChart'
import TimeControl from './TimeControl'
import TimelineOverview from './TimelineOverview'
import useEDF from './useEDF'

type Props = {
  edf: any
  onAnnotationAdd: (ann: Annotation) => void
}

export default function EEGViewer({ edf, onAnnotationAdd }: Props) {
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dialogOpen, setDialogOpen] = useState<(typeof ANNOTATION_TYPES)[number] | false>(false)
  const { data, signalInfo, duration } = useEDF(edf)

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

  const captureRef = useRef<any>(null)
  const [screenshot, setScreenshot] = useState(null)

  const handleMouseDown = (e: any) => {
    setIsDragging(true)
    setSelection({ start: e.activeLabel, end: e.activeLabel })
  }

  const handleMouseMove = (e: any) => {
    if (isDragging && e && e.activeLabel) {
      setSelection((prev) => ({ ...prev, end: e.activeLabel }))
    }
  }

  const handleMouseUp = (e: any, chartIndex: number) => {
    if (selection.start === selection.end) {
      // Single click
      setDialogOpen('OBSERVATION')
    } else if (selection.start && selection.end) {
      // Drag selection
      setDialogOpen('STATE')
    }

    const offset = 25 * chartIndex
    setMenuPosition({ x: e.chartX, y: e.chartY + offset })

    setIsDragging(false)
  }

  const handleSave = (annotation: Annotation) => {
    onAnnotationAdd(annotation)
    setDialogOpen(false)
  }

  return (
    <div className="panel">
      <TimeControl duration={duration} />

      <Grid columns="250px 1fr" gap="2">
        <Flex
          direction="column"
          height="100%"
          style={{
            borderRadius: 6,
            backgroundColor: '#EFF7FD',
          }}>
          {signalInfo.map((s, index) => (
            <Flex key={index} height="30px" justify="end" align="center" pr="2" mt="-5px">
              <Text size="1" style={{ color: 'var(--gray-9)' }}>
                {s.label}
              </Text>
            </Flex>
          ))}
        </Flex>
        <Flex direction="column" ref={captureRef} position="relative" mt="5px">
          {data.map((d, index) => (
            <EEGChart
              key={index}
              data={d}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUp={(e) => handleMouseUp(e, index)}
              selection={selection}
              isDragging={isDragging}
            />
          ))}
          <AnnotationDialog
            selection={selection}
            mode={dialogOpen}
            setOpen={setDialogOpen}
            onSave={handleSave}
            menuPosition={menuPosition}
          />
        </Flex>
      </Grid>

      <TimelineOverview edf={edf} />
    </div>
  )
}
