import { ANNOTATION_TYPES } from '@/constants'
import { create } from 'zustand'

export type Annotation = {
  mode: (typeof ANNOTATION_TYPES)[number]
  type: string
  startTime: number
  endTime: number
  signalIndex: number // Index of the signal array
}

interface AnnotationStore {
  annotations: Annotation[]
  setAnnotations: (annotations: Annotation[]) => void
}

const useAnnotationsStore = create<AnnotationStore>((set) => ({
  annotations: [],
  setAnnotations: (annotations) => set({ annotations }),
}))

export default useAnnotationsStore
