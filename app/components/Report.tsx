import { Box, Button, Flex, Heading, Spinner, Text } from '@radix-ui/themes'
import { useState } from 'react'

import { useOpenAI } from '@/hooks/useOpenAI'
import useAnnotationsStore from '@/store/annotations'
import { useFlags } from './FeatureFlag/useFlags'

import './Report.css'
import { useTimelineStore } from '@/store/timeline'
import { formatTime } from '@/utils'

export default function Report() {
  const { flags } = useFlags()
  const { annotations, screenshots } = useAnnotationsStore()
  const { generateReport } = useOpenAI()
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState('')
  const { interval } = useTimelineStore()

  const handleGenerate = async () => {
    setIsLoading(true)
    const response = await generateReport({
      annotations,
      timelineInfo: {
        numberOfSamples: 520,
        interval,
      },
    })

    if (flags.streamData) {
      if (!response || !response.body) return null

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)

        setReport((prev) => prev + chunk)
      }
    } else {
      const content = await response.json()

      setReport(content)
    }

    setIsLoading(false)
  }

  return (
    <div className="panel Report">
      <Flex justify="between">
        <Heading as="h2" size="5" style={{ textTransform: 'uppercase' }}>
          EEG Report
        </Heading>
        <Button variant="solid" onClick={handleGenerate}>
          Generate report
        </Button>
      </Flex>
      <Flex direction="column" mb="2">
        <Text style={{ color: 'var(--gray-9)' }}>
          BrainCapture: A Medical Technology Company bringing affordable EEG to everyone
        </Text>
        <Text>
          Please be aware that this report is not a diagnosis but is input to support a diagnosis.
          The receiver of this report must be a trained medical professional.
        </Text>
      </Flex>

      {isLoading ? <Spinner /> : null}

      {report !== '' && (
        <div>
          <Heading mt="4" as="h3" size="4">
            EEG finding
          </Heading>
          <div className="Report-content" dangerouslySetInnerHTML={{ __html: report }} />

          {screenshots.length > 0 && (
            <>
              <Heading mt="4" as="h3" size="4">
                Relevant EEG Pages
              </Heading>
              {screenshots.map((s) => (
                <Box>
                  <Text>Timestamp: {formatTime(s.time)}</Text>
                  <img src={s.image} style={{ width: '100%' }} />
                </Box>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
