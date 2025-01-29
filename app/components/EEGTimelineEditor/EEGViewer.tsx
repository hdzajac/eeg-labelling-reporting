import { Button, Flex, Grid, Text } from '@radix-ui/themes'
import { Camera } from 'lucide-react'
import { useRef, useState } from 'react'
import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer } from 'recharts'

import AnnotationDialog from './AnnotationDialog'
import { Annotation } from './AnnotationsTimeline'
import TimeControl from './TimeControl'
import useEDF from './useEDF'

type Props = {
  edf: any
  onAnnotationAdd: (ann: Annotation) => void
}

export default function EEGViewer({ edf, onAnnotationAdd }: Props) {
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data, signalInfo } = useEDF(edf)

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

  const captureRef = useRef<any>(null)
  const [screenshot, setScreenshot] = useState(null)

  const handleMouseDown = (e: any) => {
    setIsDragging(true)
    setSelection({ start: e.activeLabel, end: null })
  }

  const handleMouseMove = (e: any) => {
    if (isDragging && e && e.activeLabel) {
      setSelection((prev) => ({ ...prev, end: e.activeLabel }))
    }
  }

  const handleMouseUp = (e: any, chartIndex: number) => {
    if (selection.start && selection.end) {
      setDialogOpen(true)
    }

    const offset = 30 * chartIndex
    setMenuPosition({ x: e.chartX, y: e.chartY + offset })

    setIsDragging(false)
  }

  const handleSave = (annotation: Annotation) => {
    onAnnotationAdd(annotation)
    setDialogOpen(false)
  }

  return (
    <div className="panel">
      <TimeControl />

      <Grid columns="250px 1fr" gap="2">
        <Flex
          direction="column"
          height="100%"
          style={{
            borderRadius: 6,
            backgroundColor: '#EFF7FD',
          }}>
          {signalInfo.map((s, index) => (
            <Flex key={index} height="25px" justify="end" align="center" pr="2">
              <Text size="2" style={{ color: 'var(--gray-9)' }}>
                {s.label}
              </Text>
            </Flex>
          ))}
        </Flex>
        <Flex direction="column" ref={captureRef} position="relative" mt="5px">
          {data.map((d, index) => (
            <Chart
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
            open={dialogOpen}
            setOpen={setDialogOpen}
            onSave={handleSave}
            menuPosition={menuPosition}
          />
        </Flex>
      </Grid>
    </div>
  )
}

type ChartProps = {
  data: Array<{ x: number; y: number }>
  handleMouseDown: (e: any) => void
  handleMouseMove: (e: any) => void
  handleMouseUp: (e: any) => void
  selection: { start: number | null; end: number | null }
  isDragging: boolean
}

function Chart({
  data,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  selection,
  isDragging,
}: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={30} style={{ marginTop: -5 }}>
      <LineChart
        // width={500}
        height={30}
        data={data}
        syncId="anyId"
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ userSelect: 'none' }}>
        <CartesianGrid strokeDasharray="3 0" horizontal={false} />
        {/* <XAxis dataKey="x" /> */}
        {/* <YAxis /> */}

        <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
        {isDragging && selection.start && selection.start && (
          <ReferenceArea
            x1={selection.start}
            x2={selection.end}
            strokeOpacity={0.3}
            fill="#8884d8"
            fillOpacity={0.3}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
