import { Button, Flex, Grid, Text } from '@radix-ui/themes'
import html2canvas from 'html2canvas-pro'
import { Camera } from 'lucide-react'
import { useRef, useState } from 'react'

import { ANNOTATION_TYPES } from '@/constants'
import useAnnotationsStore, { Annotation } from '@/store/annotations'
import { useTimelineStore } from '@/store/timeline'
import AnnotationDialog from './AnnotationDialog'
import EEGChart from './EEGChart'
import TimeControl from './TimeControl'
import TimelineOverview from './TimelineOverview'
import useEDF from './useEDF'

type Props = {
  onAnnotationAdd: (ann: Annotation) => void
}

export default function EEGViewer({ onAnnotationAdd }: Props) {
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dialogOpen, setDialogOpen] = useState<(typeof ANNOTATION_TYPES)[number] | false>(false)
  const { data, signalInfo, duration } = useEDF()
  const { addScreenshot } = useAnnotationsStore()
  const { position, interval } = useTimelineStore()
  const captureRef = useRef<HTMLDivElement>(null)

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

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

  const handleCaptureScreenshot = () => {
    const element = captureRef.current

    if (element) {
      html2canvas(element).then((canvas) => {
        const image = canvas.toDataURL('image/png')
        addScreenshot({
          image,
          time: position * interval,
        })
      })
    }
  }

  return (
    <div className="panel">
      <TimeControl duration={duration} />

      <Grid columns="250px 1fr" gap="2">
        <Flex
          position="relative"
          direction="column"
          height="100%"
          style={{
            borderRadius: 6,
            backgroundColor: '#EFF7FD',
          }}>
          <Flex position="absolute" left="2" top="2">
            <Button variant="soft" onClick={handleCaptureScreenshot}>
              <Camera size={18} />
            </Button>
          </Flex>
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

      <TimelineOverview />
    </div>
  )
}
