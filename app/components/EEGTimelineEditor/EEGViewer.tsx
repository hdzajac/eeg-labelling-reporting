import { Flex, Grid, Select, Slider } from '@radix-ui/themes'
import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

import AnnotationDialog from './AnnotationDialog'
import { Annotation } from './AnnotationsTimeline'

type Props = {
  edf: any
  onAnnotationAdd: (ann: Annotation) => void
}

export default function EEGViewer({ edf, onAnnotationAdd }: Props) {
  const [data, setData] = useState([])
  const [index, setIndex] = useState(0)
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
    const signal = edf.getPhysicalSignal(signalIndex, index)

    const d = []

    for (let i = 0; i < signal.length; i++) {
      const value = signal[i]

      d.push({
        y: value,
        x: i,
      })
    }

    setData(d)
  }, [index, signalIndex])

  const handleSave = (annotation: Annotation) => {
    onAnnotationAdd(annotation)
    setPopupOpen(false)
  }

  return (
    <div className="panel">
      <Grid columns="250px 1fr">
        <Flex></Flex>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            width={500}
            height={200}
            data={data}
            syncId="anyId"
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ userSelect: 'none' }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
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
