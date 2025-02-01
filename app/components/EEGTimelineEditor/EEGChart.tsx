import useAnnotationsStore, { Annotation } from '@/store/annotations'
import { useTimelineStore } from '@/store/timeline'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  YAxis,
} from 'recharts'

type ChartProps = {
  data: Array<{ x: number; y: number }>
  handleMouseDown: (e: any) => void
  handleMouseMove: (e: any) => void
  handleMouseUp: (e: any) => void
  selection: { start: number | null; end: number | null }
  isDragging: boolean
}

export default function EEGChart({
  data,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  selection,
  isDragging,
}: ChartProps) {
  const { position } = useTimelineStore()
  const { annotations } = useAnnotationsStore()

  const { observations, states } = annotations.reduce(
    (acc, a) => {
      if (a.signalIndex === position) {
        if (a.mode === 'OBSERVATION') {
          acc.observations.push(a)
        } else if (a.mode === 'STATE') {
          acc.states.push(a)
        }
      }
      return acc
    },
    { observations: [] as Annotation[], states: [] as Annotation[] }
  )

  // We need to use a custom reference area because of the negative margin
  const max = Math.max(...data.map((d) => d.y))
  const min = Math.min(...data.map((d) => d.y))

  const range = Math.abs(min) + Math.abs(max)
  const y2 = max - (5 * range) / 30

  return (
    <ResponsiveContainer width="100%" height={30} style={{ marginTop: -5 }}>
      <LineChart
        height={30}
        data={data}
        syncId="anyId"
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ userSelect: 'none' }}>
        <CartesianGrid strokeDasharray="3 0" horizontal={false} />
        <YAxis domain={[min, max]} hide={true} />

        <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
        {isDragging && selection.start && selection.start && (
          <ReferenceArea
            x1={selection.start}
            x2={selection.end}
            y1={min}
            y2={y2}
            strokeOpacity={0.3}
            fill="#8884d8"
            fillOpacity={0.3}
          />
        )}

        {/** Add reference area for annoations */}
        {observations.map((annotation, index) => (
          <ReferenceLine
            key={'OBS' + index}
            x={annotation.startTime}
            stroke="#FF8302"
            strokeWidth={1.5}
            opacity={0.7}
          />
        ))}

        {states.map((annotation, index) => (
          <ReferenceArea
            key={'STT' + index}
            x1={annotation.startTime}
            x2={annotation.endTime}
            y1={min}
            y2={y2}
            fill="#FF8302"
            fillOpacity={0.2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
