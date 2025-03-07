import { Button, Flex, Grid, Text } from '@radix-ui/themes'
import html2canvas from 'html2canvas-pro'
import { Camera } from 'lucide-react'
import { SyntheticEvent, useRef, useState } from 'react'

import { ANNOTATION_TYPES } from '@/constants'
import useAnnotationsStore, { Annotation } from '@/store/annotations'
import { useTimelineStore } from '@/store/timeline'
import AnnotationDialog from './AnnotationDialog'
import ConfirmDialog from './ConfirmDialog'
import EEGChart from './EEGChart'
import TimeControl from './TimeControl'
import useEDF from './useEDF'

type Props = {
  onConfirmAI: (ann: Annotation, type: string) => void
  onAnnotationDelete: (ann: Annotation) => void
  onAnnotationAdd: (ann: Annotation) => void
}

export default function EEGViewer({ onAnnotationAdd, onAnnotationDelete, onConfirmAI }: Props) {
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dialogOpen, setDialogOpen] = useState<(typeof ANNOTATION_TYPES)[number] | false>(false)
  const { data, signalInfo, duration } = useEDF()
  const { addScreenshot, current } = useAnnotationsStore()
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

  const handleMouseUp = (state: any, ev: SyntheticEvent, chartIndex: number) => {
    setIsDragging(false)

    // Ignore clicks on label. Something cleaner would be nice here.
    if (['text', 'rect', 'path'].includes(ev.target.nodeName)) {
      return
    }

    if (selection.start === selection.end) {
      // Single click
      setDialogOpen('OBSERVATION')
    } else if (selection.start && selection.end) {
      // Drag selection
      setDialogOpen('STATE')
    }

    const offset = 25 * chartIndex
    setMenuPosition({ x: state.chartX, y: state.chartY + offset })
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
              chartIndex={index}
              data={d}
              numberOfChannels={data.length}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUp={(state, ev) => handleMouseUp(state, ev, index)}
              onAnnotationDelete={onAnnotationDelete}
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
          {current && (
            <ConfirmDialog
              annotation={current}
              onConfirm={onConfirmAI}
              onDelete={onAnnotationDelete}
            />
          )}
        </Flex>
      </Grid>
    </div>
  )
}
