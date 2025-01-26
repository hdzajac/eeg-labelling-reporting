import { useTimelineStore } from '@/store/timeline'
import { Button, Flex, Grid, Text } from '@radix-ui/themes'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import TimeIndicator from './TimeIndicator'
import { formatTime } from '@/utils'

type Props = {}

export default function TimeControl({}: Props) {
  const { position, interval, updatePosition } = useTimelineStore()
  const [currentStart, setCurrentStart] = useState(position)
  const [currentEnd, setCurrentEnd] = useState(position + interval)

  const handleCursor = (direction: number) => {
    // Update the display range based on the new position
    const newPosition = position + direction

    if (newPosition < 0) return

    const newStart = newPosition * interval
    const newEnd = newStart + interval

    setCurrentStart(newStart)
    setCurrentEnd(newEnd)

    updatePosition(newPosition)
  }

  return (
    <Grid columns="250px 1fr" gap="2">
      <Flex align="center" mt="-2px">
        <Button variant="ghost" onClick={() => handleCursor(-1)}>
          <ChevronLeft size={18} />
        </Button>
        <Text size="2">
          {formatTime(currentStart)} - {formatTime(currentEnd)}
        </Text>
        <Button variant="ghost" onClick={() => handleCursor(1)}>
          <ChevronRight size={18} />
        </Button>
      </Flex>

      <TimeIndicator interval={interval} startTime={currentStart} />
    </Grid>
  )
}
