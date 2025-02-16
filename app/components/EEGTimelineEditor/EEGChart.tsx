import { OBSERVATION_COLORS, OBSERVATION_TYPES_LABELS, STATE_TYPES_LABELS } from '@/constants'
import useAnnotationsStore, { Annotation } from '@/store/annotations'
import { useTimelineStore } from '@/store/timeline'
import { X } from 'lucide-react'
import { SyntheticEvent } from 'react'
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  YAxis,
} from 'recharts'

type ChartProps = {
  chartIndex: number
  data: Array<{ x: number; y: number }>
  handleMouseDown: (state: any) => void
  handleMouseMove: (state: any) => void
  handleMouseUp: (state: any, ev: SyntheticEvent) => void
  onAnnotationDelete: (ann: Annotation) => void
  selection: { start: number | null; end: number | null }
  isDragging: boolean
}

export default function EEGChart({
  chartIndex,
  data,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  onAnnotationDelete,
  selection,
  isDragging,
}: ChartProps) {
  const { position } = useTimelineStore()
  const { annotations } = useAnnotationsStore()

  const { observations, states, aiAnnotations } = annotations.reduce(
    (acc, a) => {
      if (a.signalIndex === position) {
        if (a.mode === 'OBSERVATION') {
          acc.observations.push(a)
        } else if (a.mode === 'STATE') {
          acc.states.push(a)
        } else if (a.mode === 'AI') {
          acc.aiAnnotations.push(a)
        }
      }
      return acc
    },
    {
      observations: [] as Annotation[],
      states: [] as Annotation[],
      aiAnnotations: [] as Annotation[],
    }
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

        <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} isAnimationActive={false} />
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

        {/** Add reference area for AI annotations */}
        {aiAnnotations.map((annotation, index) => (
          <ReferenceLine
            key={'AI' + index}
            x={annotation.startTime}
            stroke="#5DFE33"
            strokeWidth={1.5}
            opacity={0.7}
            label={
              chartIndex === 0 && (
                <CustomLabel
                  fill="#5DFE33"
                  value={
                    OBSERVATION_TYPES_LABELS[annotation.type] +
                    (annotation.mode === 'AI' ? ' (AI)' : '')
                  }
                  onDelete={() => {
                    onAnnotationDelete(annotation)
                  }}
                />
              )
            }></ReferenceLine>
        ))}

        {/** Add reference area for annoations */}
        {observations.map((annotation, index) => (
          <ReferenceLine
            key={'OBS' + index}
            x={annotation.startTime}
            stroke={OBSERVATION_COLORS[annotation.type]}
            strokeWidth={1.5}
            opacity={0.7}
            label={
              chartIndex === 0 && (
                <CustomLabel
                  value={OBSERVATION_TYPES_LABELS[annotation.type]}
                  fill={OBSERVATION_COLORS[annotation.type]}
                  onDelete={() => {
                    onAnnotationDelete(annotation)
                  }}
                />
              )
            }></ReferenceLine>
        ))}

        {states.map((annotation, index) => (
          <ReferenceArea
            key={'STT' + index}
            x1={annotation.startTime}
            x2={annotation.endTime}
            y1={min}
            y2={y2}
            fill="#FF8302"
            fillOpacity={0.1}
            label={
              chartIndex === 0 && (
                <CustomLabel
                  value={STATE_TYPES_LABELS[annotation.type]}
                  onDelete={() => onAnnotationDelete(annotation)}
                  onClick={() => onAnnotationDelete(annotation)}
                />
              )
            }></ReferenceArea>
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

function CustomLabel({ fill = '#FF8302', viewBox, value, onDelete }: any) {
  return (
    <g transform={`translate(${viewBox.x},${viewBox.y})`} cursor="pointer" onClick={onDelete}>
      <rect width="145" height="20" opacity={0.8} fill={fill} />
      <text fill="#111" dy={13} dx={8} fontSize={10}>
        {value}
      </text>
      <g transform={`translate(130,3)`}>
        <X size={14} />
      </g>
    </g>
  )
}
