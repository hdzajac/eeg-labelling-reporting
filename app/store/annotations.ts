import { ANNOTATION_TYPES } from '@/constants'
import { create } from 'zustand'

export type Annotation = {
  mode: (typeof ANNOTATION_TYPES)[number]
  type: string
  startTime: number
  endTime: number
  signalIndex: number // Index of the signal array
}

export type Screenshot = {
  image: string
  time: number
}

interface AnnotationStore {
  annotations: Annotation[]
  screenshots: Screenshot[]
  setAnnotations: (annotations: Annotation[]) => void
  addScreenshot: (screenshot: Screenshot) => void
}

const sampleAnnotations: Annotation[] = [
  {
    mode: 'AI',
    type: 'PDR',
    startTime: 531,
    endTime: 531,
    signalIndex: 78,
  },
]

const useAnnotationsStore = create<AnnotationStore>((set) => ({
  annotations: sampleAnnotations,
  screenshots: [],
  setAnnotations: (annotations) => set({ annotations }),
  addScreenshot: (image) =>
    set({ screenshots: [...useAnnotationsStore.getState().screenshots, image] }),
}))

export default useAnnotationsStore
