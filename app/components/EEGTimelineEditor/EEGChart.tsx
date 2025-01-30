import useAnnotationsStore, { Annotation } from '@/store/annotations'
import { useTimelineStore } from '@/store/timeline'
import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer } from 'recharts'

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
        acc.observations.push(a)
        if (a.mode === 'OBSERVATION') {
        } else if (a.mode === 'STATE') {
          acc.states.push(a)
        }
      }
      return acc
    },
    { observations: [] as Annotation[], states: [] as Annotation[] }
  )

  return (
    <ResponsiveContainer width="100%" height={30} style={{ marginTop: 0 }}>
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

        {/** Add reference area for annoations */}
        {observations.map((annotation, index) => (
          <ReferenceArea
            key={index}
            x1={annotation.startTime}
            x2={annotation.startTime + 1}
            fill="#FF8302"
          />
        ))}

        {/* {states.map((annotation, index) => (
          <ReferenceArea
            key={index}
            x1={annotation.startTime}
            x2={annotation.endTime}
            fill="#FF8302"
            fillOpacity={0.1}
          />
        ))} */}
      </LineChart>
    </ResponsiveContainer>
  )
}
