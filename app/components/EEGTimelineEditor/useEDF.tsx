import { useEffect, useState } from 'react'

import { useEDFStore } from '@/store/edf'
import { useTimelineStore } from '@/store/timeline'
import { useFlags } from '../FeatureFlag/useFlags'

export default function useEDF() {
  const { edf } = useEDFStore()
  const { flags } = useFlags()
  const { position, interval } = useTimelineStore()
  const [data, setData] = useState<{ x: number; y: number }[][]>([])

  useEffect(() => {
    // The last channel is for annotations
    const signals: number[][][] = edf?._physicalSignals.slice(0, edf?._physicalSignals.length - 1)

    const signalsGroups = []
    for (let i = 0; i < signals.length; i++) {
      const group = groupDataBySeconds(signals[i], interval, flags.desampleRate)

      signalsGroups.push(group)
    }
    const dataAtPosition = signalsGroups.map((signal) => signal[position])

    setData(dataAtPosition)
  }, [interval, position, flags.desampleRate])

  return {
    data,
    signalInfo: edf._header.signalInfo.slice(0, edf?._physicalSignals.length - 1),
    numberOfSamples: data[0]?.length,
    duration: edf?.getNumberOfRecords(), // assuming each record is 1 second,
  }
}

function groupDataBySeconds(data: number[][], groupSize = 1, desampleRate = 10) {
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
        if (j % desampleRate !== 0) {
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
