import { useFlags, type Flags } from '@/components/FeatureFlag/useFlags'
import { Annotation } from '@/store/annotations'

type Payload = {
  action?: string
  payload: Record<string, unknown>
  flags: Flags
}

export type GeneratePayload = {
  annotations: Annotation[]
  timelineInfo: {
    numberOfSamples: number
    interval: number
  }
}

const request = async (payload: Payload) => {
  const token = localStorage.getItem('token') ?? ''

  return fetch('/api/llm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify(payload),
  })
}

export function useOpenAI() {
  const { flags } = useFlags()

  return {
    async generateReport(payload: GeneratePayload) {
      return request({
        action: 'GENERATE_REPORT',
        payload,
        flags,
      })
    },
  }
}
