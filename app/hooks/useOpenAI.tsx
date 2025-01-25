import { ActionTypes } from '@/components/ContentEditor'
import { useFlags, type Flags } from '@/components/FeatureFlag/useFlags'
import { EvaluationReport, Patient } from '@/store/types'

type Payload = {
  action?: string
  payload: Record<string, unknown>
  flags: Flags
}

export type GeneratePayload = {
  evaluation: EvaluationReport
  patient: Patient | undefined
  sections: string[]
}

export type RegeneratePayload = {
  originalReport: string
  sectionName: string
  updatedSection: string
}

type ParagraphPayload = {
  paragraph: string
}

type RephrasePayload = {
  paragraph: string
  selection: string
  type: ActionTypes
}

type RewritePayload = {
  paragraph: string
  rewriteText: string
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
    async regenerateReport(payload: RegeneratePayload) {
      return request({
        action: 'REGENERATE_REPORT',
        payload,
        flags,
      })
    },
    async getAlternatives(payload: ParagraphPayload) {
      return request({
        action: 'GET_ALTERNATIVES',
        payload,
        flags,
      })
    },
    async summarizeParagraph(payload: ParagraphPayload) {
      return request({
        action: 'SUMMARIZE_PARAGRAPH',
        payload,
        flags,
      })
    },
    async convertToList(payload: ParagraphPayload) {
      return request({
        action: 'CONVERT_TO_LIST',
        payload,
        flags,
      })
    },
    async rephraseSelection(payload: RephrasePayload) {
      return request({
        action: 'REPHRASE_SELECTION',
        payload,
        flags,
      })
    },
    async rewriteToInclude(payload: RewritePayload) {
      return request({
        action: 'REWRITE_TO_INCLUDE',
        payload,
        flags,
      })
    },
  }
}
