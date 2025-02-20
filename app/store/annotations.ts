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
  current: Annotation | null
  setCurrent: (annotation: Annotation | null) => void
  setAnnotations: (annotations: Annotation[]) => void
  addScreenshot: (screenshot: Screenshot) => void
}

const useAnnotationsStore = create<AnnotationStore>((set) => ({
  annotations: [],
  screenshots: [],
  current: null,
  setCurrent: (annotation) => set({ current: annotation }),
  setAnnotations: (annotations) => set({ annotations }),
  addScreenshot: (image) =>
    set({ screenshots: [...useAnnotationsStore.getState().screenshots, image] }),
}))

export default useAnnotationsStore
