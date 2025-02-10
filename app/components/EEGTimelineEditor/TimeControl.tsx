import { Button, Flex, Grid } from '@radix-ui/themes'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'

import { useTimelineStore } from '@/store/timeline'
import { formatTime } from '@/utils'
import TimeIndicator from './TimeIndicator'

type Props = {
  duration: number
}

export default function TimeControl({ duration }: Props) {
  const { position, interval, updatePosition } = useTimelineStore()

  const maxSteps = Math.floor(duration / interval)

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [position, maxSteps])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handleCursor(-1)
    } else if (e.key === 'ArrowRight') {
      handleCursor(1)
    }
  }

  const handleCursor = (direction: number) => {
    // Update the display range based on the new position
    const newPosition = position + direction

    if (newPosition < 0 || newPosition >= maxSteps) return

    updatePosition(newPosition)
  }

  const handleSelect = (e: any) => {
    const newPosition = e.target.value / interval

    updatePosition(newPosition)
  }

  return (
    <Grid columns="250px 1fr" gap="2">
      <Flex align="center" mt="-2px">
        <Button variant="ghost" onClick={() => handleCursor(-1)} disabled={position <= 0}>
          <ChevronLeft size={18} />
        </Button>

        <select value={position * interval} onChange={handleSelect} style={{ border: 0 }}>
          {[...Array(Math.floor(duration / interval)).keys()].map((i) => (
            <option key={i} value={i * interval}>
              {formatTime(i * interval)} - {formatTime(i * interval + interval)}
            </option>
          ))}
        </select>

        <Button variant="ghost" onClick={() => handleCursor(1)} disabled={position >= maxSteps - 1}>
          <ChevronRight size={18} />
        </Button>
      </Flex>

      <TimeIndicator interval={interval} startTime={position * interval} />
    </Grid>
  )
}
