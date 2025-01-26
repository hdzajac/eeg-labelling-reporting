import { Flex, Grid } from '@radix-ui/themes'
import { useEffect, useState } from 'react'
import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer } from 'recharts'

import { useTimelineStore } from '@/store/timeline'
import AnnotationDialog from './AnnotationDialog'
import { Annotation } from './AnnotationsTimeline'
import TimeControl from './TimeControl'

type Props = {
  edf: any
  onAnnotationAdd: (ann: Annotation) => void
}

export default function EEGViewer({ edf, onAnnotationAdd }: Props) {
  const { position, interval } = useTimelineStore()

  const [data, setData] = useState<{ x: number; y: number }[][]>([])
  const [signalIndex, setSignalIndex] = useState(0)

  const [selection, setSelection] = useState({ start: null, end: null })
  const [isDragging, setIsDragging] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setSelection({ start: e.activeLabel, end: null })
  }

  const handleMouseMove = (e) => {
    if (isDragging && e && e.activeLabel) {
      setSelection((prev) => ({ ...prev, end: e.activeLabel }))
    }
  }

  const handleMouseUp = () => {
    if (selection.start && selection.end) {
      setPopupOpen(true)
    }

    setIsDragging(false)
  }

  useEffect(() => {
    const groupedBySeconds = groupDataBySeconds(edf._physicalSignals[signalIndex], interval)

    const result = []
    for (let i = 0; i < groupedBySeconds[position].length; i++) {
      const value = groupedBySeconds[position][i]
      result.push({
        y: value,
        x: i,
      })
    }

    setData([result])
  }, [signalIndex, interval, position])

  const handleSave = (annotation: Annotation) => {
    onAnnotationAdd(annotation)
    setPopupOpen(false)
  }

  return (
    <div className="panel">
      <TimeControl />

      <Grid columns="250px 1fr" gap="2">
        <Flex style={{}}></Flex>
        <Flex direction="column">
          {data.map((d, index) => (
            <Chart
              key={index}
              data={d}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUp={handleMouseUp}
              selection={selection}
              isDragging={isDragging}
            />
          ))}
        </Flex>
      </Grid>

      <AnnotationDialog selection={selection} open={popupOpen} onSave={handleSave} />

      {/* <h2>Index: {index}</h2>
      <Slider value={[index]} onValueChange={(val) => setIndex(val[0])} />
      <h2>Signal</h2>
      <Select.Root
        value={signalIndex.toString()}
        onValueChange={(value) => setSignalIndex(parseInt(value))}>
        <Select.Trigger />
        <Select.Content>
          {edf?._header.signalInfo.map((signal, index) => (
            <Select.Item key={index} value={index.toString()}>
              {signal.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root> */}
    </div>
  )
}

type ChartProps = {
  data: [number, number][]
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
    <ResponsiveContainer width="100%" height={100}>
      <LineChart
        // width={500}
        height={100}
        data={data}
        syncId="anyId"
        // margin={0}
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

function groupDataBySeconds(data: number[][], groupSize = 1) {
  // Validate input
  if (!Array.isArray(data) || groupSize < 1) {
    throw new Error('Invalid input: data must be an array and groupSize must be at least 1')
  }

  // Initialize result array to store grouped data
  const groupedData = []

  // Iterate through the data in groups of specified size
  for (let i = 0; i < data.length; i += groupSize) {
    const group = data.slice(i, i + groupSize)
    if (group.length < groupSize) break

    // Initialize a flat array to store the grouped data
    const flat = []

    for (let i = 0; i < group.length; i++) {
      flat.push(...group[i])
    }

    groupedData.push(flat)
  }

  return groupedData
}
