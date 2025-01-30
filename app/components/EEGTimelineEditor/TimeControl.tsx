import { Button, Flex, Grid } from '@radix-ui/themes'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { useTimelineStore } from '@/store/timeline'
import { formatTime } from '@/utils'
import TimeIndicator from './TimeIndicator'

type Props = {
  duration: number
}

export default function TimeControl({ duration }: Props) {
  const { position, interval, updatePosition } = useTimelineStore()
  const [currentStart, setCurrentStart] = useState(position)

  const handleCursor = (direction: number) => {
    // Update the display range based on the new position
    const newPosition = position + direction

    if (newPosition < 0) return

    const newStart = newPosition * interval

    setCurrentStart(newStart)
    updatePosition(newPosition)
  }

  const handleSelect = (e: any) => {
    const newPosition = e.target.value / interval

    setCurrentStart(newPosition)
    updatePosition(newPosition)
  }

  return (
    <Grid columns="250px 1fr" gap="2">
      <Flex align="center" mt="-2px">
        <Button variant="ghost" onClick={() => handleCursor(-1)}>
          <ChevronLeft size={18} />
        </Button>

        <select value={currentStart} onChange={handleSelect} style={{ border: 0 }}>
          {[...Array(Math.floor(duration / interval)).keys()].map((i) => (
            <option key={i} value={i * interval}>
              {formatTime(i * interval)} - {formatTime(i * interval + interval)}
            </option>
          ))}
        </select>

        <Button variant="ghost" onClick={() => handleCursor(1)}>
          <ChevronRight size={18} />
        </Button>
      </Flex>

      <TimeIndicator interval={interval} startTime={currentStart} />
    </Grid>
  )
}
