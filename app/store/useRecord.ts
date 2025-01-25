import { create } from 'zustand'

import { MedicalRecord, EvaluationReport } from './types'

type MedicalRecordState = {
  record: MedicalRecord
  updateRecord(record: MedicalRecord): void
  updateEvaluation(evaluation: EvaluationReport): void
}

export const useRecord = create<MedicalRecordState>((set) => ({
  record: undefined as unknown as MedicalRecord,
  updateRecord: (record: MedicalRecord) => set({ record }),
  updateEvaluation: (evaluation: EvaluationReport) =>
    set((state) => {
      return {
        ...state,
        record: {
          ...state.record,
          evaluation,
        },
      }
    }),
}))
