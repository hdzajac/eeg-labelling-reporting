import { Box, Flex, Grid, Text } from '@radix-ui/themes'
import { useRef, useState } from 'react'

import useAnnotationsStore from '@/store/annotations'
import { useTimelineStore } from '@/store/timeline'
import useEDF from './useEDF'

type Props = {}

export default function TimelineOverview({}: Props) {
  const { annotations, screenshots } = useAnnotationsStore()
  const { interval, updatePosition } = useTimelineStore()
  const { duration } = useEDF()

  const [currentTime, setCurrentTime] = useState(0)
  const timelineRef = useRef(null)

  const tickInterval = 300 // 5 minutes = 300 seconds

  const handleSeek = (e) => {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = Math.floor((clickX / rect.width) * duration)
    setCurrentTime(newTime)
  }

  const minutes = Math.floor(duration / 60)

  return (
    <Grid columns="250px 1fr" gap="2" mt="2">
      <Flex direction="column" height="100%" style={{}} justify="end" align="end">
        <Text size="1" style={{ color: 'var(--gray-9)' }}>
          Minutes
        </Text>
      </Flex>
      <Flex direction="column">
        <Box style={{ width: '100%', maxWidth: '1000px', margin: 'auto' }}>
          <div
            ref={timelineRef}
            onClick={handleSeek}
            style={{
              position: 'relative',
              width: '100%',
              height: '30px',
              background: 'var(--gray-2)',
              borderRadius: '5px',
              overflow: 'hidden',
              cursor: 'pointer',
            }}>
            {/* Vertical Lines for Ticks */}
            {Array.from({ length: Math.floor(duration / tickInterval) + 1 }, (_, i) => {
              const time = i * tickInterval
              const leftPos = `${(time / duration) * 100}%`
              return (
                <Box
                  key={i}
                  position="absolute"
                  left={leftPos}
                  height="100%"
                  width="1px"
                  style={{
                    background: 'var(--gray-5)',
                  }}
                />
              )
            })}

            {/* Playhead */}
            {/* <div
                style={{
                  position: 'absolute',
                  left: `${(currentTime / duration) * 100}%`,
                  height: '100%',
                  width: '2px',
                  background: 'red',
                }}
              /> */}

            {annotations.map((ann, idx) => {
              const time = ann.startTime / 256 + ann.signalIndex * interval
              const leftPos = `${(time / duration) * 100}%`

              return (
                <Box
                  position="absolute"
                  left={leftPos}
                  height="100%"
                  width="1px"
                  key={idx}
                  style={{
                    background: '#FF8302',
                  }}
                />
              )
            })}
          </div>

          {/* Time Labels */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '5px',
              fontSize: '12px',
              color: '#555',
            }}>
            {Array.from({ length: Math.floor(duration / tickInterval) + 1 }, (_, i) => {
              const time = i * tickInterval
              const minutes = Math.floor(time / 60)
              const seconds = String(time % 60).padStart(2, '0')
              return (
                <Text
                  size="1"
                  style={{ color: 'var(--gray-9)' }}
                  key={i}>{`${minutes}:${seconds}`}</Text>
              )
            })}
          </div>
          {/* <p>Current Time: {currentTime}s</p> */}
        </Box>
      </Flex>
    </Grid>
  )
}
