import { useEffect, useState } from 'react'

import { useTimelineStore } from '@/store/timeline'

const DESAMPLE_RATE = 1

export default function useEDF(edf: any) {
  const { position, interval } = useTimelineStore()
  const [data, setData] = useState<{ x: number; y: number }[][]>([])

  useEffect(() => {
    // The last channel is for annotations
    const signals: number[][][] = edf?._physicalSignals.slice(0, edf?._physicalSignals.length - 1)

    const signalsGroups = []
    for (let i = 0; i < signals.length; i++) {
      const group = groupDataBySeconds(signals[i], interval)

      signalsGroups.push(group)
    }
    const dataAtPosition = signalsGroups.map((signal) => signal[position])

    setData(dataAtPosition)
  }, [interval, position])

  return {
    data,
    signalInfo: edf._header.signalInfo.slice(0, edf?._physicalSignals.length - 1),
    numberOfSamples: data[0]?.length,
  }
}

function groupDataBySeconds(data: number[][], groupSize = 1) {
  if (!Array.isArray(data) || groupSize < 1) {
    throw new Error('Invalid input: data must be an array and groupSize must be at least 1')
  }

  const groupedData = []

  // Iterate through the data in groups of specified size
  for (let i = 0; i < data.length; i += groupSize) {
    const group = data.slice(i, i + groupSize)
    if (group.length < groupSize) break

    const flat = []

    for (let i = 0; i < group.length; i++) {
      for (let j = 0; j < group[i].length; j++) {
        if (j % DESAMPLE_RATE !== 0) {
          continue
        }

        flat.push({
          y: group[i][j],
          x: j,
        })
      }
    }

    groupedData.push(flat)
  }

  return groupedData
}
