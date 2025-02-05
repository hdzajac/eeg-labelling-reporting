import { create } from 'zustand'

type EdfStore = {
  edf: any
  setEDF: (edf: any) => void
}

export const useEDFStore = create<EdfStore>((set) => ({
  edf: undefined,
  setEDF: (edf) => set({ edf }),
}))
