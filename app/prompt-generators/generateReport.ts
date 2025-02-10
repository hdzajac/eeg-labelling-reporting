import { createOpenAI } from '@ai-sdk/openai'
import { generateText, streamText } from 'ai'

import type { Flags } from '@/components/FeatureFlag/useFlags'
import { OBSERVATION_TYPES_LABELS, STATE_TYPES_LABELS } from '@/constants'
import { GeneratePayload } from '@/hooks/useOpenAI'
import { Annotation } from '@/store/annotations'
import { round } from '@/utils'
import systemPrompt from './helpers/system-prompt'

const openai = createOpenAI({
  fetch: fetch,
})

export default async function ({ annotations, timelineInfo }: GeneratePayload, flags: Flags) {
  console.log('PAYLOAD', annotations, flags, timelineInfo)

  const prompt = `
      ${generateAnnotationsSummary(annotations, timelineInfo)}

      ## Formatting requirements
      - Use <h2> tags for section headings and <p> tags for paragraphs.
      - Convert seconds to the format: HH:MM:SS.
      
      ## Example
      
      **Background feature**: The awake record consists of bilaterally symmetrical moderate amplitude
      background activity with unreactive 9Hz posterior dominant rhythm with normal anterior-posterior gradient.
      18-20Hz beta activities were noted with predominance over the bilateral frontal area. Few movement and
      muscle activities were recorded.

      **Sleep Features**: No sleep features were recorded.
      **Photic Stimulation**: Not done.
      **Hyperventilation**: Done for 3 minutes of poor effort yielding unremarkable findings.
      **Clinical events**: No clinical events were recorded.
      **Abnormal Features**: No abnormal activities were recorded.

      **Conclusion**: The current Awake EEG is within normal limits. Clinical correlation is advised.
      `

  console.log('PROMPT>>>', prompt)

  if (process.env.TESTING_MODE === 'true') {
    return testingMode(flags.streamData)
  }

  if (flags.streamData) {
    const result = streamText({
      model: openai(flags.model),
      messages: [
        { role: 'system', content: flags.systemPrompt ?? systemPrompt },
        { role: 'user', content: prompt },
      ],
    })

    return result.toTextStreamResponse()
  } else {
    const result = generateText({
      model: openai(flags.model),
      messages: [
        { role: 'system', content: flags.systemPrompt ?? systemPrompt },
        { role: 'user', content: prompt },
      ],
    })

    return (await result).text
  }
}

function testingMode(useStream: boolean = false) {
  // Create a readable stream to generate data
  const content = `
      <h2>Background feature</h2>
      <p>The awake record consists of bilaterally symmetrical moderate amplitude background activity with unreactive 9Hz posterior dominant rhythm with normal anterior-posterior gradient.
      18-20Hz beta activities were noted with predominance over the bilateral frontal area. Few movement and muscle activities were recorded.</p>
      <h2>Sleep Features</h2>
      <p>No sleep features were recorded.</p>
      <h2>Photic Stimulation</h2>
      <p>Not done.</p>
      <h2>Hyperventilation</h2>
      <p>Done for 3 minutes of poor effort yielding unremarkable findings.</p>
      <h2>Clinical events</h2>
      <p>No clinical events were recorded.</p>
      <h2>Abnormal Features</h2>
      <p>No abnormal activities were recorded.</p>`

  if (useStream) {
    const words = content.split(' ')

    const stream = new ReadableStream({
      start(controller) {
        let index = 0
        function push() {
          if (index < words.length) {
            controller.enqueue(words[index] + ' ')
            index++
            setTimeout(push, 100) // Delay for smooth streaming effect
          } else {
            controller.close()
          }
        }
        push()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } else {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(content)
      }, 200)
    })
  }
}

function generateAnnotationsSummary(
  annotations: Annotation[],
  timelineInfo: GeneratePayload['timelineInfo']
) {
  if (annotations.length === 0) return ''

  let summary = ''

  const observations = annotations.filter((a) => a.mode === 'OBSERVATION')
  const states = annotations.filter((a) => a.mode === 'STATE')

  if (observations.length > 0) {
    summary += `
      ## Observation
      ${observations
        .map(
          (a) =>
            `- ${OBSERVATION_TYPES_LABELS[a.type]} at ${getTime(
              a.startTime,
              a.signalIndex,
              timelineInfo
            )}s`
        )
        .join('\n')}
    `
  }

  if (states.length > 0) {
    summary += `
      ## State
      ${states
        .map(
          (a) =>
            `- ${STATE_TYPES_LABELS[a.type]} from ${getTime(
              a.startTime,
              a.signalIndex,
              timelineInfo
            )}s to ${getTime(a.endTime, a.signalIndex, timelineInfo)}s`
        )
        .join('\n')}
    `
  }

  return summary
}

function getTime(time: number, signalIndex: number, timelineInfo: GeneratePayload['timelineInfo']) {
  return round(time / timelineInfo.numberOfSamples + signalIndex * timelineInfo.interval)
}
