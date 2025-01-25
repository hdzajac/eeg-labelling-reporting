export type MedicalRecord = {
  id: number
  gender: string
  age: number
  skinType: number
  familyWithMelanoma: boolean
  previousMelanoma: boolean
  evaluation: EvaluationReport
  images: string[]
}

export type EvaluationReport = {
  visualFeatures: string
  diagnosis: string
  treatment: string
  alternativePlan: string
  followUp: string
}

export type Patient = {
  gender: string
  age: number
  skinType: number
  familyWithMelanoma: boolean
  previousMelanoma: boolean
}
